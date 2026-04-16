/**
 * Human-readable spot-check: prints the full result table for three cases
 * so a reviewer can eyeball values against industry norms.
 *
 * Run: npm test -- --reporter=verbose spotcheck
 */
import { describe, it, expect } from "vitest";
import { DEFAULT_SCR_INPUTS } from "../constants";
import { computeHoneycomb } from "../honeycomb";
import type { SCRInputs, SCRResults } from "@/types/scr";

function dump(label: string, r: SCRResults) {
  const lines = [
    ``,
    `▶ ${label}`,
    `  α (NH₃/NOx)     : ${r.alpha}`,
    `  NH₃ rate        : ${r.nh3RateKgh} kg/h`,
    `  η_eff           : ${(r.effectiveRemoval * 100).toFixed(2)} %`,
    `  AV              : ${r.areaVelocity} m/h`,
    `  SV              : ${r.spaceVelocity} 1/h   GHSV: ${r.ghsv} 1/h`,
    `  LV              : ${r.linearVelocityMs} m/s   v_ch: ${r.channelVelocityMs} m/s`,
    `  CPSI            : ${r.cpsi}   OFA: ${(r.openFrontalArea * 100).toFixed(2)} %`,
    `  a_v (GSA)       : ${r.geometricSurfaceDensity} m²/m³   a: ${r.cellOpeningMm} mm`,
    `  V_cat           : ${r.volumeCatalystM3} m³   L_cat: ${r.catalystLengthM} m`,
    `  A_front         : ${r.frontalAreaM2} m²`,
    `  Modules         : ${r.totalModules} EA (${r.modulesPerLayer}/layer × ${r.numberOfLayers} layers)`,
    `  ΔP              : ${r.pressureDropPa} Pa | ${r.pressureDropMmH2O} mmH₂O`,
    `  SO₂→SO₃         : ${r.so2ToSo3ConvPct} %`,
    `  Temp window OK  : ${r.temperatureWindowOk}`,
    ...(r.warnings.length
      ? [`  ⚠ warnings:`, ...r.warnings.map((w) => `     - ${w}`)]
      : []),
  ];
  console.log(lines.join("\n"));
}

describe("spot-check numeric sanity", () => {
  it("default case yields industry-plausible numbers", () => {
    const r = computeHoneycomb(DEFAULT_SCR_INPUTS);
    dump("Default (500k Nm³/h, 360 °C, 350 ppm NOx, η=85%)", r);
    expect(r.alpha).toBeGreaterThan(0.8);
    expect(r.alpha).toBeLessThan(0.9);
    expect(r.spaceVelocity).toBeGreaterThan(2000);
    expect(r.spaceVelocity).toBeLessThan(10000);
    expect(r.pressureDropMmH2O).toBeGreaterThan(1);
    expect(r.pressureDropMmH2O).toBeLessThan(300); // SCR ΔP budgets typical 50-200
  });

  it("small industrial boiler (50k Nm³/h)", () => {
    const inputs: SCRInputs = {
      ...DEFAULT_SCR_INPUTS,
      flowNm3h: 50_000,
      tempC: 320,
      noxInPpm: 200,
      noxRemovalPct: 75,
    };
    const r = computeHoneycomb(inputs);
    dump("Small boiler (50k Nm³/h, 320 °C, 200 ppm NOx, η=75%)", r);
    expect(r.volumeCatalystM3).toBeGreaterThan(0);
    // smaller flow → smaller catalyst volume than the 500k default
    const big = computeHoneycomb(DEFAULT_SCR_INPUTS);
    expect(r.volumeCatalystM3).toBeLessThan(big.volumeCatalystM3);
  });

  it("high-removal, tight slip case", () => {
    const r = computeHoneycomb({
      ...DEFAULT_SCR_INPUTS,
      noxRemovalPct: 92,
      nh3SlipPpm: 2,
    });
    dump("High-removal, tight slip (η=92%, slip 2 ppm)", r);
    expect(r.alpha).toBeLessThanOrEqual(1.0);
    // higher required removal ⇒ larger catalyst vs baseline
    const base = computeHoneycomb(DEFAULT_SCR_INPUTS);
    expect(r.volumeCatalystM3).toBeGreaterThan(base.volumeCatalystM3);
  });
});
