/**
 * Client-side gate controller for protected domain routes.
 *
 * - Hashes an entered passcode with SHA-256 in the browser
 * - Compares it to the build-time PUBLIC_GATE_HASH
 * - Writes a versioned sessionStorage unlock marker on success
 * - Mounts the proof view from the embedded JSON payload on unlock
 * - Auto-unlocks on load if sessionStorage already has the marker
 *
 * No raw passcode is ever stored, logged, or rendered.
 */

import type { DomainProofViewModel } from "../../data/domains/domain-view-model";
import { renderDomainProof } from "./domain-proof-view";

/* ── config ────────────────────────────────────────── */

interface GateConfig {
  hash: string;
  homePath: string;
  storageKey: string;
}

function readConfig(): GateConfig | null {
  const el = document.getElementById("domain-gate-config");
  if (!el?.textContent) return null;
  try {
    return JSON.parse(el.textContent) as GateConfig;
  } catch {
    return null;
  }
}

function readProofPayload(): DomainProofViewModel | null {
  const el = document.getElementById("domain-proof-payload");
  if (!el?.textContent) return null;
  try {
    return JSON.parse(el.textContent) as DomainProofViewModel;
  } catch {
    return null;
  }
}

/* ── crypto ────────────────────────────────────────── */

async function sha256(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

/* ── DOM helpers ───────────────────────────────────── */

function setGateStatus(status: "idle" | "error" | "unlocked", text: string) {
  const statusEl = document.querySelector("[data-gate-status]");
  const textEl = document.querySelector("[data-gate-status-text]");
  if (statusEl) statusEl.setAttribute("data-gate-status", status);
  if (textEl) textEl.textContent = text;
}

function transitionToOpen() {
  // Flip data-gate-state on the outermost protected element
  const gate = document.querySelector("[data-protected-gate]");
  if (gate) {
    gate.setAttribute("data-gate-state", "open");
    gate.setAttribute("data-protected-proof-state", "mounted");
  }
}

function mountProof(config: GateConfig, proof: DomainProofViewModel) {
  const mountPoint = document.querySelector("[data-proof-mount]");
  if (!mountPoint) return;

  const proofDOM = renderDomainProof(proof, config.homePath);
  // Replace the entire gate shell content with the proof view
  const gateShell = document.querySelector("[data-protected-gate]");
  if (gateShell) {
    // Clear gate shell children and replace with proof content
    // But keep the gate shell wrapper so data attrs remain for assertion
    gateShell.innerHTML = "";
    // Move proof article's children into the gate shell, keeping its own attributes
    gateShell.className = proofDOM.className;
    for (const attr of Array.from(proofDOM.attributes)) {
      gateShell.setAttribute(attr.name, attr.value);
    }
    while (proofDOM.firstChild) {
      gateShell.appendChild(proofDOM.firstChild);
    }

    // Visual reveal: start blurred, then transition to clear
    gateShell.setAttribute("data-visual-state", "revealing");
    requestAnimationFrame(() => {
      setTimeout(() => {
        gateShell.setAttribute("data-visual-state", "revealed");
      }, 50);
    });

    // Trigger gallery JS initialization for dynamically mounted galleries
    document.dispatchEvent(new Event("astro:page-load"));
  }
}

/* ── unlock flow ───────────────────────────────────── */

/**
 * Storage strategy: sessionStorage is per-tab (per top-level browsing
 * context), so a new tab in the same browser session starts with empty
 * sessionStorage. To carry the unlock across tabs within the same
 * browser session, we mirror the marker to localStorage (which is
 * shared across tabs for the same origin). On load we check both:
 *   1. sessionStorage (fast, same-tab continuity)
 *   2. localStorage   (cross-tab carryover within the browser session)
 *
 * A fresh incognito/browser context gets empty localStorage AND
 * sessionStorage, so it correctly relocks.
 */

function isSessionUnlocked(config: GateConfig): boolean {
  try {
    if (sessionStorage.getItem(config.storageKey) === "unlocked") return true;
    // Cross-tab carryover: check localStorage and promote to sessionStorage
    if (localStorage.getItem(config.storageKey) === "unlocked") {
      sessionStorage.setItem(config.storageKey, "unlocked");
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

function persistUnlock(config: GateConfig) {
  try {
    sessionStorage.setItem(config.storageKey, "unlocked");
    localStorage.setItem(config.storageKey, "unlocked");
  } catch {
    // Storage may be unavailable; gate still shows visual unlock
  }
}

async function attemptUnlock(passcode: string, config: GateConfig, proof: DomainProofViewModel): Promise<boolean> {
  const inputHash = await sha256(passcode);
  if (inputHash !== config.hash) {
    setGateStatus("error", "invalid passcode");
    return false;
  }

  persistUnlock(config);
  setGateStatus("unlocked", "access granted");
  transitionToOpen();
  mountProof(config, proof);
  return true;
}

/* ── init ──────────────────────────────────────────── */

export function initDomainGate() {
  const config = readConfig();
  const proof = readProofPayload();

  if (!config || !proof) return;

  // Auto-unlock if session already has the marker
  if (isSessionUnlocked(config)) {
    transitionToOpen();
    mountProof(config, proof);
    return;
  }

  // Wire up the form
  const form = document.querySelector<HTMLFormElement>("[data-gate-form]");
  const input = document.querySelector<HTMLInputElement>("[data-gate-passcode-input]");

  if (!form || !input) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const passcode = input.value.trim();
    if (!passcode) {
      setGateStatus("error", "enter a passcode");
      return;
    }
    await attemptUnlock(passcode, config, proof);
  });
}
