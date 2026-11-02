/// <reference types="@webgpu/types" />

/**
 * WebGPU renderer — implements the Renderer interface with a WGSL dither shader.
 *
 * Uses a fullscreen triangle (3 vertices via vertex_index, no vertex buffer).
 * Embeds the Bayer 8×8 matrix directly in WGSL for GPU-side dithering.
 */

import type { Renderer, ShaderColors } from './types';

// ── WGSL shader source ─────────────────────────────────────────────

const SHADER_SOURCE = /* wgsl */ `

const MAX_RIPPLES = 32u;

struct Uniforms {
  time: f32,
  ripple_count: u32,
  resolution: vec2f,
  pointer: vec2f,
  color_bg: vec4f,
  color_accent: vec4f,
  color_strong: vec4f,
  // Each ripple: vec4(x, y, birth_time, intensity)
  ripples: array<vec4f, 32>,
};

@group(0) @binding(0) var<uniform> u: Uniforms;

// Classic Bayer 8×8 ordered dither threshold matrix (normalized 0–1).
const bayer8x8 = array<f32, 64>(
  0.007813, 0.507813, 0.132813, 0.632813, 0.039063, 0.539063, 0.164063, 0.664063,
  0.757813, 0.257813, 0.882813, 0.382813, 0.789063, 0.289063, 0.914063, 0.414063,
  0.195313, 0.695313, 0.070313, 0.570313, 0.226563, 0.726563, 0.101563, 0.601563,
  0.945313, 0.445313, 0.820313, 0.320313, 0.976563, 0.476563, 0.851563, 0.351563,
  0.054688, 0.554688, 0.179688, 0.679688, 0.023438, 0.523438, 0.148438, 0.648438,
  0.804688, 0.304688, 0.929688, 0.429688, 0.773438, 0.273438, 0.898438, 0.398438,
  0.242188, 0.742188, 0.117188, 0.617188, 0.210938, 0.710938, 0.085938, 0.585938,
  0.992188, 0.492188, 0.867188, 0.367188, 0.960938, 0.460938, 0.835938, 0.335938,
);

struct VertexOutput {
  @builtin(position) position: vec4f,
};

// Fullscreen triangle from vertex_index — no vertex buffer needed.
@vertex
fn vs(@builtin(vertex_index) vi: u32) -> VertexOutput {
  var pos = array<vec2f, 3>(
    vec2f(-1.0, -1.0),
    vec2f( 3.0, -1.0),
    vec2f(-1.0,  3.0),
  );
  var out: VertexOutput;
  out.position = vec4f(pos[vi], 0.0, 1.0);
  return out;
}

// Animated radial gradient — center orbits slowly, wide soft falloff.
// This is the luminance source that the Bayer dither thresholds against.
fn gradient_field(uv: vec2f, t: f32) -> f32 {
  let slow = t * 0.03;

  // Aspect ratio correction for circular gradients.
  let aspect = u.resolution.x / u.resolution.y;

  // Primary gradient center: orbits along canvas edge slowly.
  let c1 = vec2f(
    0.5 + 0.45 * cos(slow * 0.6),
    0.5 + 0.45 * sin(slow * 0.4)
  );

  // Aspect-corrected distance for circular shape on screen.
  let d1 = distance(vec2f(uv.x * aspect, uv.y), vec2f(c1.x * aspect, c1.y));
  let g1 = smoothstep(1.1, 0.0, d1);

  // Secondary gradient: slower orbit, offset phase, adds depth.
  let c2 = vec2f(
    0.5 + 0.35 * cos(slow * 0.35 + 2.5),
    0.5 + 0.35 * sin(slow * 0.5 + 1.8)
  );
  let d2 = distance(vec2f(uv.x * aspect, uv.y), vec2f(c2.x * aspect, c2.y));
  let g2 = smoothstep(0.9, 0.0, d2);

  // Combine: primary dominant, secondary adds subtle complexity.
  var v = max(g1 * 0.7, g2 * 0.35);

  // Cursor: gently drift gradient center toward pointer.
  if (u.pointer.x >= 0.0) {
    let pull = 0.12 * smoothstep(0.6, 0.0, distance(c1, u.pointer));
    let pulled = mix(c1, u.pointer, pull);
    let dp = distance(vec2f(uv.x * aspect, uv.y), vec2f(pulled.x * aspect, pulled.y));
    let gp = smoothstep(1.1, 0.0, dp);
    v = max(v, gp * 0.5);
  }

  // Subtle base everywhere — prevents pure black, adds texture.
  v = max(v, 0.035);

  return clamp(v, 0.0, 1.0);
}

// Cursor ripples — expanding rings from recent cursor impacts.
// Each ripple is a ring that expands outward and fades over time.
// Returns additive luminance to be mixed with gradient_field BEFORE dithering.
fn ripple_field(uv: vec2f, t: f32) -> f32 {
  let aspect = u.resolution.x / u.resolution.y;
  var total = 0.0;

  let count = min(u.ripple_count, MAX_RIPPLES);
  for (var i = 0u; i < count; i = i + 1u) {
    let rip = u.ripples[i];
    let age = t - rip.z;
    if (age < 0.0 || age > 2.0) { continue; }

    // Ring expands outward over time.
    let radius = age * 0.20;

    // Aspect-corrected distance from pixel to impact center.
    let dx = (uv.x - rip.x) * aspect;
    let dy = uv.y - rip.y;
    let dist = sqrt(dx * dx + dy * dy);

    // Narrow ring: Gaussian peak around dist == radius.
    let ring_dist = dist - radius;
    let wave = exp(-ring_dist * ring_dist * 180.0);

    // Fade out over time.
    let fade = exp(-age * 2.5);

    total += wave * fade * rip.w;
  }

  return clamp(total, 0.0, 1.0);
}

@fragment
fn fs(@builtin(position) frag_coord: vec4f) -> @location(0) vec4f {
  // Snap to pixel grid (4×4 blocks) for chunky dither dots.
  // Scale pixel_size up on smaller viewports so dither dots stay visible on mobile.
  // Resolution is in physical pixels (CSS × DPR), so thresholds account for retina:
  // ~8px at ≤1200 physical (e.g. phones at 3x), ~4px at ≥2560 (desktop 2x / wide 1x).
  let pixel_size = max(4.0, 8.0 - 4.0 * smoothstep(1200.0, 2560.0, u.resolution.x));
  let snapped = floor(frag_coord.xy / pixel_size);
  let uv = (snapped + 0.5) * pixel_size / u.resolution;

  // Compose: gradient + ripples BEFORE dither threshold.
  let base_lum = gradient_field(uv, u.time);
  let ripple_lum = ripple_field(uv, u.time);
  let lum = clamp(base_lum + ripple_lum * 0.35, 0.0, 1.0);

  // Bayer 8×8 ordered dithering on the snapped grid.
  let bx = u32(snapped.x) % 8u;
  let by = u32(snapped.y) % 8u;
  let threshold = bayer8x8[by * 8u + bx];

  if (lum < threshold) {
    // Off-pixels: very subtle lift above pure black.
    return vec4f(u.color_bg.xyz + vec3f(0.008, 0.008, 0.008), 1.0);
  }

  // Dot color: restrained charcoal gray.
  let dot_color = u.color_bg.xyz + vec3f(0.12, 0.12, 0.12);
  return vec4f(dot_color, 1.0);
}
`;

// ── Uniform buffer layout ───────────────────────────────────────────

// Layout (std140-aligned):
//   0: time (f32)
//   4: ripple_count (u32)
//   8: resolution (vec2f)
//  16: pointer (vec2f)
//  24: (8 bytes implicit pad to align vec4f)
//  32: color_bg (vec4f) — .xyz used, .w ignored
//  48: color_accent (vec4f) — .xyz used, .w ignored
//  64: color_strong (vec4f) — .xyz used, .w ignored
//  80: ripples[32] (vec4f each = 16 bytes × 32 = 512 bytes)
// Total: 592 bytes

const MAX_RIPPLES = 32;
const UNIFORM_SIZE = 592;

// ── WebGPU Renderer ─────────────────────────────────────────────────

export class WebGPURenderer implements Renderer {
  private device: GPUDevice | null = null;
  private context: GPUCanvasContext | null = null;
  private pipeline: GPURenderPipeline | null = null;
  private uniformBuffer: GPUBuffer | null = null;
  private bindGroup: GPUBindGroup | null = null;
  private uniformData = new Float32Array(UNIFORM_SIZE / 4);
  private canvasFormat: GPUTextureFormat = 'bgra8unorm';

  async init(canvas: HTMLCanvasElement, colors: ShaderColors): Promise<boolean> {
    // Guard: WebGPU API must exist.
    if (!navigator.gpu) {
      return false;
    }

    // Request adapter — may return null on unsupported hardware.
    const adapter = await navigator.gpu.requestAdapter();
    if (!adapter) {
      return false;
    }

    // Request device — may throw or return null-ish on failure.
    let device: GPUDevice;
    try {
      device = await adapter.requestDevice();
    } catch {
      return false;
    }

    // Acquire canvas context.
    const ctx = canvas.getContext('webgpu');
    if (!ctx) {
      return false;
    }

    this.device = device;
    this.context = ctx;

    // Prefer the system's preferred format.
    this.canvasFormat = navigator.gpu.getPreferredCanvasFormat();

    ctx.configure({
      device,
      format: this.canvasFormat,
      alphaMode: 'opaque',
    });

    // Create shader module with compilation error checking.
    const module = device.createShaderModule({ code: SHADER_SOURCE });
    const info = await module.getCompilationInfo();
    const hasErrors = info.messages.some((m) => m.type === 'error');
    if (hasErrors) {
      for (const msg of info.messages) {
        console.error(`[shader/webgpu] WGSL ${msg.type}: ${msg.message}`);
      }
      return false;
    }

    // Create render pipeline — fullscreen triangle, no vertex buffers.
    this.pipeline = device.createRenderPipeline({
      layout: 'auto',
      vertex: {
        module,
        entryPoint: 'vs',
      },
      fragment: {
        module,
        entryPoint: 'fs',
        targets: [{ format: this.canvasFormat }],
      },
      primitive: {
        topology: 'triangle-list',
      },
    });

    // Create uniform buffer.
    this.uniformBuffer = device.createBuffer({
      size: UNIFORM_SIZE,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });

    // Create bind group.
    this.bindGroup = device.createBindGroup({
      layout: this.pipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: this.uniformBuffer } },
      ],
    });

    // Write initial colors into uniform data.
    this.setColors(colors);

    // Set initial resolution.
    this.updateResolution(canvas.width, canvas.height);

    // Default pointer off-screen.
    this.uniformData[4] = -1;
    this.uniformData[5] = -1;

    // Listen for device loss.
    device.lost.then((info) => {
      console.warn(`[shader/webgpu] device lost: ${info.message}`);
      this.device = null;
    });

    return true;
  }

  render(time: number, pointer: [number, number]): void {
    if (!this.device || !this.context || !this.pipeline || !this.uniformBuffer || !this.bindGroup) {
      return;
    }

    // Update time.
    this.uniformData[0] = time;

    // Update pointer.
    this.uniformData[4] = pointer[0];
    this.uniformData[5] = pointer[1];

    // Upload uniforms.
    this.device.queue.writeBuffer(this.uniformBuffer, 0, this.uniformData);

    // Begin render pass.
    let textureView: GPUTextureView;
    try {
      textureView = this.context.getCurrentTexture().createView();
    } catch {
      // Context may be lost or canvas resized — skip this frame.
      return;
    }

    const encoder = this.device.createCommandEncoder();
    const pass = encoder.beginRenderPass({
      colorAttachments: [
        {
          view: textureView,
          loadOp: 'clear' as GPULoadOp,
          storeOp: 'store' as GPUStoreOp,
          clearValue: { r: 0, g: 0, b: 0, a: 1 },
        },
      ],
    });

    pass.setPipeline(this.pipeline);
    pass.setBindGroup(0, this.bindGroup);
    pass.draw(3); // Fullscreen triangle.
    pass.end();

    this.device.queue.submit([encoder.finish()]);
  }

  resize(width: number, height: number): void {
    if (!this.device || !this.context) return;

    this.context.configure({
      device: this.device,
      format: this.canvasFormat,
      alphaMode: 'opaque',
    });

    this.updateResolution(width, height);
  }

  updateRipples(ripples: Float32Array, count: number): void {
    // ripple_count is at byte 4 (float index 1) — stored as u32 bits in f32 slot.
    const view = new DataView(this.uniformData.buffer);
    view.setUint32(4, Math.min(count, MAX_RIPPLES), true);

    // Ripple data starts at float index 20 (byte 80).
    const maxFloats = MAX_RIPPLES * 4;
    const copyCount = Math.min(count * 4, maxFloats);
    for (let i = 0; i < copyCount; i++) {
      this.uniformData[20 + i] = ripples[i];
    }
    // Zero out remaining slots.
    for (let i = copyCount; i < maxFloats; i++) {
      this.uniformData[20 + i] = 0;
    }
  }

  destroy(): void {
    this.uniformBuffer?.destroy();
    this.device?.destroy();
    this.uniformBuffer = null;
    this.pipeline = null;
    this.bindGroup = null;
    this.context = null;
    this.device = null;
  }

  // ── Private helpers ─────────────────────────────────────────────

  private setColors(colors: ShaderColors): void {
    // color_bg at offset 8 (float index 8 = byte 32)
    this.uniformData[8] = colors.bg[0];
    this.uniformData[9] = colors.bg[1];
    this.uniformData[10] = colors.bg[2];
    // pad at [11]

    // color_accent at offset 12 (float index 12 = byte 48)
    this.uniformData[12] = colors.accent[0];
    this.uniformData[13] = colors.accent[1];
    this.uniformData[14] = colors.accent[2];
    // pad at [15]

    // color_strong at offset 16 (float index 16 = byte 64)
    this.uniformData[16] = colors.strong[0];
    this.uniformData[17] = colors.strong[1];
    this.uniformData[18] = colors.strong[2];
    // pad at [19]
  }

  private updateResolution(width: number, height: number): void {
    // resolution at offset 2 (float index 2 = byte 8)
    this.uniformData[2] = width;
    this.uniformData[3] = height;
  }
}
