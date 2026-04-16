import { describe, expect, it } from "vitest";
import { computeAging } from "../aging";

describe("catalyst aging model", () => {
  const base = {
    k0: 30,
    fuelSulfurPct: 0.5,
    dustLoadGNm3: 5,
    operatingTempC: 360,
    minActivityFraction: 0.6,
  };

  it("returns a sensible life for typical coal boiler conditions", () => {
    const r = computeAging(base);
    expect(r.estimatedLifeYears).toBeGreaterThan(2);
    expect(r.estimatedLifeYears).toBeLessThan(12);
    expect(r.deactivationRatePerYear).toBeGreaterThan(0.08);
    expect(r.deactivationRatePerYear).toBeLessThan(0.3);
    // K decays monotonically
    for (let i = 1; i < r.kAtYears.length; i++) {
      expect(r.kAtYears[i].k).toBeLessThan(r.kAtYears[i - 1].k);
    }
  });

  it("high sulfur accelerates deactivation", () => {
    const low = computeAging({ ...base, fuelSulfurPct: 0 });
    const high = computeAging({ ...base, fuelSulfurPct: 3 });
    expect(high.deactivationRatePerYear).toBeGreaterThan(
      low.deactivationRatePerYear,
    );
    expect(high.estimatedLifeYears).toBeLessThan(low.estimatedLifeYears);
    expect(high.notes.join("\n")).toMatch(/황분/);
  });

  it("high dust emits a Plate-conversion note", () => {
    const r = computeAging({ ...base, dustLoadGNm3: 25 });
    expect(r.notes.join("\n")).toMatch(/Plate/);
  });

  it("elevated temperature > 420 °C flags thermal aging", () => {
    const r = computeAging({ ...base, operatingTempC: 430 });
    expect(r.notes.join("\n")).toMatch(/열적 열화/);
  });

  it("K(t) follows exp(−k_d t) exactly", () => {
    const r = computeAging(base);
    const y1 = r.kAtYears.find((x) => x.year === 1)!.k;
    const y2 = r.kAtYears.find((x) => x.year === 2)!.k;
    // ratio should be exp(-k_d)
    expect(y2 / y1).toBeCloseTo(Math.exp(-r.deactivationRatePerYear), 5);
  });
});
