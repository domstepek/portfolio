/**
 * WebGL2 fallback renderer — implements the Renderer interface with a GLSL 300 es dither shader.
 *
 * Uses a fullscreen quad (two triangles via a static VAO, no vertex buffer).
 * The GLSL fragment shader is a direct port of the WGSL dither shader in
 * webgpu-renderer.ts — identical Bayer 8×8 matrix, gradient field, ripples, and palette mapping.
 */

import type { Renderer, ShaderColors } from './types';

// ── Constants ───────────────────────────────────────────────────────

const MAX_RIPPLES = 32;

// ── GLSL 300 es shader sources ──────────────────────────────────────

const VERT_SOURCE = /* glsl */ `#version 300 es
void main() {
  vec2 verts[6] = vec2[6](
    vec2(-1.0, -1.0), vec2( 1.0, -1.0), vec2(-1.0,  1.0),
    vec2(-1.0,  1.0), vec2( 1.0, -1.0), vec2( 1.0,  1.0)
  );
  gl_Position = vec4(verts[gl_VertexID], 0.0, 1.0);
}
`;

const FRAG_SOURCE = /* glsl */ `#version 300 es
precision highp float;

const int MAX_RIPPLES = 32;

uniform float u_time;
uniform int   u_ripple_count;
uniform vec2  u_resolution;
uniform vec2  u_pointer;
uniform vec3  u_color_bg;
uniform vec3  u_color_accent;
uniform vec3  u_color_strong;
// Each ripple: vec4(x, y, birth_time, intensity)
uniform vec4  u_ripples[32];

out vec4 fragColor;

// Classic Bayer 8×8 ordered dither threshold matrix (normalized 0–1).
const float bayer8x8[64] = float[64](
  0.007813, 0.507813, 0.132813, 0.632813, 0.039063, 0.539063, 0.164063, 0.664063,
  0.757813, 0.257813, 0.882813, 0.382813, 0.789063, 0.289063, 0.914063, 0.414063,
  0.195313, 0.695313, 0.070313, 0.570313, 0.226563, 0.726563, 0.101563, 0.601563,
  0.945313, 0.445313, 0.820313, 0.320313, 0.976563, 0.476563, 0.851563, 0.351563,
  0.054688, 0.554688, 0.179688, 0.679688, 0.023438, 0.523438, 0.148438, 0.648438,
  0.804688, 0.304688, 0.929688, 0.429688, 0.773438, 0.273438, 0.898438, 0.398438,
  0.242188, 0.742188, 0.117188, 0.617188, 0.210938, 0.710938, 0.085938, 0.585938,
  0.992188, 0.492188, 0.867188, 0.367188, 0.960938, 0.460938, 0.835938, 0.335938
);

float gradient_field(vec2 uv, float t) {
  float slow = t * 0.03;
  float aspect = u_resolution.x / u_resolution.y;

  vec2 c1 = vec2(0.5 + 0.45 * cos(slow * 0.6), 0.5 + 0.45 * sin(slow * 0.4));
  float d1 = distance(vec2(uv.x * aspect, uv.y), vec2(c1.x * aspect, c1.y));
  float g1 = smoothstep(1.1, 0.0, d1);

  vec2 c2 = vec2(0.5 + 0.35 * cos(slow * 0.35 + 2.5), 0.5 + 0.35 * sin(slow * 0.5 + 1.8));
  float d2 = distance(vec2(uv.x * aspect, uv.y), vec2(c2.x * aspect, c2.y));
  float g2 = smoothstep(0.9, 0.0, d2);

  float v = max(g1 * 0.7, g2 * 0.35);

  if (u_pointer.x >= 0.0) {
    float pull = 0.12 * smoothstep(0.6, 0.0, distance(c1, u_pointer));
    vec2 pulled = mix(c1, u_pointer, pull);
    float dp = distance(vec2(uv.x * aspect, uv.y), vec2(pulled.x * aspect, pulled.y));
    float gp = smoothstep(1.1, 0.0, dp);
    v = max(v, gp * 0.5);
  }

  v = max(v, 0.035);
  return clamp(v, 0.0, 1.0);
}

float ripple_field(vec2 uv, float t) {
  float aspect = u_resolution.x / u_resolution.y;
  float total = 0.0;

  int count = min(u_ripple_count, MAX_RIPPLES);
  for (int i = 0; i < count; i++) {
    vec4 rip = u_ripples[i];
    float age = t - rip.z;
    if (age < 0.0 || age > 2.0) { continue; }

    float radius = age * 0.20;
    float dx = (uv.x - rip.x) * aspect;
    float dy = uv.y - rip.y;
    float dist = sqrt(dx * dx + dy * dy);

    float ring_dist = dist - radius;
    float wave = exp(-ring_dist * ring_dist * 180.0);
    float fade = exp(-age * 2.5);

    total += wave * fade * rip.w;
  }

  return clamp(total, 0.0, 1.0);
}

void main() {
  // Scale pixel_size up on smaller viewports so dither dots stay visible on mobile.
  // Resolution is in physical pixels (CSS × DPR), so thresholds account for retina:
  // ~8px at ≤1200 physical (e.g. phones at 3x), ~4px at ≥2560 (desktop 2x / wide 1x).
  float pixel_size = max(4.0, 8.0 - 4.0 * smoothstep(1200.0, 2560.0, u_resolution.x));
  vec2 snapped = floor(gl_FragCoord.xy / pixel_size);
  vec2 uv = (snapped + 0.5) * pixel_size / u_resolution;

  float base_lum = gradient_field(uv, u_time);
  float ripple_lum = ripple_field(uv, u_time);
  float lum = clamp(base_lum + ripple_lum * 0.35, 0.0, 1.0);

  int bx = int(snapped.x) % 8;
  int by = int(snapped.y) % 8;
  float threshold = bayer8x8[by * 8 + bx];

  if (lum < threshold) {
    fragColor = vec4(u_color_bg + vec3(0.008), 1.0);
    return;
  }

  vec3 dot_color = u_color_bg + vec3(0.12);
  fragColor = vec4(dot_color, 1.0);
}
`;

// ── Uniform locations cache ─────────────────────────────────────────

interface UniformLocations {
  time: WebGLUniformLocation;
  rippleCount: WebGLUniformLocation;
  resolution: WebGLUniformLocation;
  pointer: WebGLUniformLocation;
  colorBg: WebGLUniformLocation;
  colorAccent: WebGLUniformLocation;
  colorStrong: WebGLUniformLocation;
  ripples: WebGLUniformLocation;
}

// ── WebGL2 Renderer ─────────────────────────────────────────────────

export class WebGL2Renderer implements Renderer {
  private gl: WebGL2RenderingContext | null = null;
  private program: WebGLProgram | null = null;
  private vao: WebGLVertexArrayObject | null = null;
  private uniforms: UniformLocations | null = null;
  private onContextLost: ((e: Event) => void) | null = null;
  private canvas: HTMLCanvasElement | null = null;

  async init(canvas: HTMLCanvasElement, colors: ShaderColors): Promise<boolean> {
    const gl = canvas.getContext('webgl2');
    if (!gl) return false;

    this.gl = gl;
    this.canvas = canvas;

    const vert = this.compileShader(gl, gl.VERTEX_SHADER, VERT_SOURCE);
    if (!vert) return false;

    const frag = this.compileShader(gl, gl.FRAGMENT_SHADER, FRAG_SOURCE);
    if (!frag) { gl.deleteShader(vert); return false; }

    const program = gl.createProgram();
    if (!program) { gl.deleteShader(vert); gl.deleteShader(frag); return false; }

    gl.attachShader(program, vert);
    gl.attachShader(program, frag);
    gl.linkProgram(program);
    gl.deleteShader(vert);
    gl.deleteShader(frag);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(`[shader/webgl2] program link failed: ${gl.getProgramInfoLog(program)}`);
      gl.deleteProgram(program);
      return false;
    }

    this.program = program;

    const loc = (name: string): WebGLUniformLocation => {
      const l = gl.getUniformLocation(program, name);
      if (!l) throw new Error(`Missing uniform: ${name}`);
      return l;
    };

    try {
      this.uniforms = {
        time: loc('u_time'),
        rippleCount: loc('u_ripple_count'),
        resolution: loc('u_resolution'),
        pointer: loc('u_pointer'),
        colorBg: loc('u_color_bg'),
        colorAccent: loc('u_color_accent'),
        colorStrong: loc('u_color_strong'),
        ripples: loc('u_ripples[0]'),
      };
    } catch (e) {
      console.error(`[shader/webgl2] ${(e as Error).message}`);
      gl.deleteProgram(program);
      this.program = null;
      return false;
    }

    this.vao = gl.createVertexArray();

    gl.useProgram(program);
    gl.uniform3f(this.uniforms.colorBg, colors.bg[0], colors.bg[1], colors.bg[2]);
    gl.uniform3f(this.uniforms.colorAccent, colors.accent[0], colors.accent[1], colors.accent[2]);
    gl.uniform3f(this.uniforms.colorStrong, colors.strong[0], colors.strong[1], colors.strong[2]);
    gl.uniform2f(this.uniforms.pointer, -1, -1);
    gl.uniform2f(this.uniforms.resolution, canvas.width, canvas.height);
    gl.uniform1i(this.uniforms.rippleCount, 0);

    this.onContextLost = (e: Event) => { e.preventDefault(); this.destroy(); };
    canvas.addEventListener('webglcontextlost', this.onContextLost);

    return true;
  }

  render(time: number, pointer: [number, number]): void {
    const { gl, program, vao, uniforms } = this;
    if (!gl || !program || !vao || !uniforms) return;

    gl.useProgram(program);
    gl.uniform1f(uniforms.time, time);
    gl.uniform2f(uniforms.pointer, pointer[0], pointer[1]);

    gl.bindVertexArray(vao);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    gl.bindVertexArray(null);
  }

  updateRipples(ripples: Float32Array, count: number): void {
    const { gl, program, uniforms } = this;
    if (!gl || !program || !uniforms) return;

    gl.useProgram(program);
    gl.uniform1i(uniforms.rippleCount, Math.min(count, MAX_RIPPLES));
    // Upload ripple data as vec4 array.
    const uploadCount = Math.min(count, MAX_RIPPLES) * 4;
    const data = new Float32Array(MAX_RIPPLES * 4);
    for (let i = 0; i < uploadCount; i++) {
      data[i] = ripples[i];
    }
    gl.uniform4fv(uniforms.ripples, data);
  }

  resize(width: number, height: number): void {
    const { gl, program, uniforms } = this;
    if (!gl || !program || !uniforms) return;
    gl.viewport(0, 0, width, height);
    gl.useProgram(program);
    gl.uniform2f(uniforms.resolution, width, height);
  }

  destroy(): void {
    const { gl, canvas } = this;
    if (canvas && this.onContextLost) {
      canvas.removeEventListener('webglcontextlost', this.onContextLost);
      this.onContextLost = null;
    }
    if (gl) {
      if (this.vao) { gl.deleteVertexArray(this.vao); this.vao = null; }
      if (this.program) { gl.deleteProgram(this.program); this.program = null; }
      const ext = gl.getExtension('WEBGL_lose_context');
      if (ext) ext.loseContext();
    }
    this.uniforms = null;
    this.gl = null;
    this.canvas = null;
  }

  private compileShader(gl: WebGL2RenderingContext, type: GLenum, source: string): WebGLShader | null {
    const shader = gl.createShader(type);
    if (!shader) return null;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const label = type === gl.VERTEX_SHADER ? 'vertex' : 'fragment';
      console.error(`[shader/webgl2] ${label} compile failed: ${gl.getShaderInfoLog(shader)}`);
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }
}
