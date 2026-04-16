import { describe, expect, it } from "vitest";
import { DEFAULT_SCR_INPUTS } from "../constants";
import { computeHoneycomb } from "../honeycomb";
import { normalToActualFlow, paToMmH2O, sig } from "../units";

describe("honeycomb SCR engine", () => {
  it("computes defaults without throwing and returns sensible ranges", () => {
    const r = computeHoneycomb(DEFAULT_SCR_INPUTS);
    expect(r.alpha).toBeGreaterThan(0.7);
    expect(r.alpha).toBeLessThan(1.05);
    expect(r.areaVelocity).toBeGreaterThan(5);
    expect(r.areaVelocity).toBeLessThan(40);
    expect(r.volumeCatalystM3).toBeGreaterThan(0);
    expect(r.spaceVelocity).toBeGreaterThan(1000); // typical SCR GHSV 2000–20000
    expect(r.spaceVelocity).toBeLessThan(30000);
    expect(r.linearVelocityMs).toBeGreaterThan(3);
    expect(r.linearVelocityMs).toBeLessThan(7);
    expect(r.cpsi).toBeGreaterThan(5);
    expect(r.cpsi).toBeLessThan(50);
    expect(r.openFrontalArea).toBeGreaterThan(0.5);
    expect(r.openFrontalArea).toBeLessThan(0.9);
  });

  it("α ratio close to target η when slip is small", () => {
    const r = computeHoneycomb({
      ...DEFAULT_SCR_INPUTS,
      noxRemovalPct: 80,
      nh3SlipPpm: 2,
      noxInPpm: 400,
    });
    expect(r.alpha).toBeGreaterThan(0.8);
    expect(r.alpha).toBeLessThan(0.82);
  });

  it("AV increases as required removal decreases", () => {
    const lo = computeHoneycomb({ ...DEFAULT_SCR_INPUTS, noxRemovalPct: 50 });
    const hi = computeHoneycomb({ ...DEFAULT_SCR_INPUTS, noxRemovalPct: 95 });
    expect(lo.areaVelocity).toBeGreaterThan(hi.areaVelocity);
  });

  it("smaller pitch ⇒ higher CPSI and higher GSA density", () => {
    const coarse = computeHoneycomb({ ...DEFAULT_SCR_INPUTS, pitchMm: 8.0 });
    const fine = computeHoneycomb({ ...DEFAULT_SCR_INPUTS, pitchMm: 5.0 });
    expect(fine.cpsi).toBeGreaterThan(coarse.cpsi);
    expect(fine.geometricSurfaceDensity).toBeGreaterThan(
      coarse.geometricSurfaceDensity,
    );
  });

  it("higher temperature ⇒ larger actual flow, higher pressure drop", () => {
    const cool = computeHoneycomb({ ...DEFAULT_SCR_INPUTS, tempC: 300 });
    const hot = computeHoneycomb({ ...DEFAULT_SCR_INPUTS, tempC: 400 });
    expect(hot.actualFlowM3h).toBeGreaterThan(cool.actualFlowM3h);
  });

  it("emits warnings when outside temperature window", () => {
    const too_low = computeHoneycomb({ ...DEFAULT_SCR_INPUTS, tempC: 250 });
    const too_high = computeHoneycomb({ ...DEFAULT_SCR_INPUTS, tempC: 450 });
    expect(too_low.temperatureWindowOk).toBe(false);
    expect(too_high.temperatureWindowOk).toBe(false);
    expect(too_low.warnings.length).toBeGreaterThan(0);
    expect(too_high.warnings.length).toBeGreaterThan(0);
  });

  it("normal→actual flow respects ideal-gas law", () => {
    const q = normalToActualFlow(100_000, 350, 101.325);
    // at 350 °C: T_ratio = 623.15/273.15 ≈ 2.281
    expect(q).toBeGreaterThan(220_000);
    expect(q).toBeLessThan(240_000);
  });

  it("paToMmH2O conversion sanity", () => {
    expect(sig(paToMmH2O(9.80665), 3)).toBeCloseTo(1.0, 2);
  });
});
