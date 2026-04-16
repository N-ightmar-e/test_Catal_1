import { describe, expect, it } from "vitest";
import { computeDataOld } from "../data-old";
import { DEFAULT_DATA_OLD_INPUTS } from "@/types/data-old";

describe("Data_old (NCB_B2 reconstruction) engine", () => {
  it("runs with defaults and returns plausible values", () => {
    const r = computeDataOld(DEFAULT_DATA_OLD_INPUTS);
    expect(r.success).toBe(true);
    expect(r.activity.kMat).toBeGreaterThan(0);
    expect(r.activity.kStr).toBeGreaterThan(0);
    expect(r.activity.kOverall).toBeLessThan(
      Math.min(r.activity.kMat, r.activity.kStr) + 1e-6,
    );
    expect(r.catVolume.volumeDesign).toBeGreaterThan(
      r.catVolume.volumeRequired,
    );
    expect(r.pressureDrop.dpDesign).toBeGreaterThan(0);
    expect(r.so2Conversion.convRate).toBeGreaterThan(0);
    expect(r.nox.noxOutlet).toBeLessThan(DEFAULT_DATA_OLD_INPUTS.noxInlet);
  });

  it("V_design scales inversely with ktk0 (life factor)", () => {
    const fresh = computeDataOld({ ...DEFAULT_DATA_OLD_INPUTS, ktk0: 1.0 });
    const aged = computeDataOld({ ...DEFAULT_DATA_OLD_INPUTS, ktk0: 0.6 });
    expect(aged.catVolume.volumeDesign).toBeGreaterThan(
      fresh.catVolume.volumeDesign,
    );
  });

  it("higher safetyNox → proportionally larger V_design", () => {
    const lo = computeDataOld({ ...DEFAULT_DATA_OLD_INPUTS, safetyNox: 1.0 });
    const hi = computeDataOld({ ...DEFAULT_DATA_OLD_INPUTS, safetyNox: 1.5 });
    expect(hi.catVolume.volumeDesign / lo.catVolume.volumeDesign).toBeCloseTo(
      1.5,
      1,
    );
  });

  it("flow regime changes with channel geometry / velocity", () => {
    const slow = computeDataOld({
      ...DEFAULT_DATA_OLD_INPUTS,
      gasVelocity: 0.5,
    });
    const fast = computeDataOld({
      ...DEFAULT_DATA_OLD_INPUTS,
      gasVelocity: 15,
    });
    expect(slow.activity.reynolds).toBeLessThan(fast.activity.reynolds);
  });

  it("DeDIOx mode (3) populates volumeDiox, otherwise undefined", () => {
    const dnx = computeDataOld({ ...DEFAULT_DATA_OLD_INPUTS, designMode: 1 });
    const both = computeDataOld({ ...DEFAULT_DATA_OLD_INPUTS, designMode: 3 });
    expect(dnx.catVolume.volumeDiox).toBeUndefined();
    expect(both.catVolume.volumeDiox).toBeGreaterThan(0);
  });

  it("catalyst type W vs Mo yields different kMat", () => {
    const w = computeDataOld({ ...DEFAULT_DATA_OLD_INPUTS, catType: 1 });
    const mo = computeDataOld({ ...DEFAULT_DATA_OLD_INPUTS, catType: 2 });
    expect(w.activity.kMat).not.toEqual(mo.activity.kMat);
  });

  it("emits warnings outside temperature window", () => {
    const cold = computeDataOld({ ...DEFAULT_DATA_OLD_INPUTS, temperature: 250 });
    const hot = computeDataOld({ ...DEFAULT_DATA_OLD_INPUTS, temperature: 450 });
    expect(cold.warnings.join("\n")).toMatch(/온도/);
    expect(hot.warnings.join("\n")).toMatch(/온도/);
  });

  it("α ratio stays near target η for small slip", () => {
    const r = computeDataOld({
      ...DEFAULT_DATA_OLD_INPUTS,
      nh3Slip: 2,
      noxReduction: 75,
    });
    expect(r.nox.alpha).toBeGreaterThan(0.75);
    expect(r.nox.alpha).toBeLessThan(0.8);
  });
});
