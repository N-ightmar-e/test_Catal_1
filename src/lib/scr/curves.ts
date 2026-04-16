/**
 * Pure helpers that generate data series for charting.
 * No UI imports — safe to unit-test.
 */
import { computeAging } from "./aging";

// ---------- 1. Aging / K(t) decay curve ----------
export function agingSeries(
  k0: number,
  fuelSulfurPct: number,
  dustLoadGNm3: number,
  operatingTempC: number,
  minActivityFraction: number,
  yearMax = 10,
): { t: number; k: number; kMin: number; k0: number }[] {
  const r = computeAging({
    k0,
    fuelSulfurPct,
    dustLoadGNm3,
    operatingTempC,
    minActivityFraction,
  });
  const kMin = k0 * minActivityFraction;
  const out: { t: number; k: number; kMin: number; k0: number }[] = [];
  for (let t = 0; t <= yearMax; t += 0.25) {
    out.push({
      t,
      k: k0 * Math.exp(-r.deactivationRatePerYear * t),
      kMin,
      k0,
    });
  }
  return out;
}

// ---------- 2. η vs AV curve (plug-flow 1st order) ----------
export function removalVsAvSeries(
  kValues: number[] = [20, 30, 40],
  avMin = 5,
  avMax = 60,
  step = 1,
): Record<string, number>[] {
  const out: Record<string, number>[] = [];
  for (let av = avMin; av <= avMax; av += step) {
    const row: Record<string, number> = { av };
    for (const k of kValues) {
      row[`eta_K${k}`] = (1 - Math.exp(-k / av)) * 100; // %
    }
    out.push(row);
  }
  return out;
}

// ---------- 3. Relative activity vs temperature ----------
/**
 * Empirical bell-shape around optimal T (≈ 360–380°C).
 * Activity is normalized 0–1 with peak = 1.0 near 370°C.
 * Cold side governed by Arrhenius; hot side by NH₃ oxidation & SO₂→SO₃.
 */
export function tempActivitySeries(
  tempMin = 200,
  tempMax = 500,
  step = 5,
  v2o5WtPct = 1.0,
): {
  t: number;
  activity: number;
  so2conv: number;
  windowLo: number;
  windowHi: number;
}[] {
  const out: {
    t: number;
    activity: number;
    so2conv: number;
    windowLo: number;
    windowHi: number;
  }[] = [];
  const tPeak = 370; // °C
  const sigma = 60; // spread
  for (let t = tempMin; t <= tempMax; t += step) {
    // Bell-shape (Gaussian)
    const gauss = Math.exp(-((t - tPeak) ** 2) / (2 * sigma * sigma));
    // NH₃ oxidation penalty > 400 °C
    const nh3Loss = t > 400 ? 1 - Math.min(0.6, (t - 400) / 150) : 1;
    const activity = Math.max(0, gauss * nh3Loss);
    // SO₂→SO₃ conversion empirical (same form as engine)
    const so2conv = 0.6 * v2o5WtPct * Math.exp((t - 380) / 50);
    out.push({
      t,
      activity: activity * 100,
      so2conv,
      windowLo: t === 300 ? 100 : 0, // markers for shading
      windowHi: t === 400 ? 100 : 0,
    });
  }
  return out;
}

// ---------- 4. ΔP vs LV curve (laminar approximation) ----------
/**
 * ΔP = 32·μ·L·v_ch / d_h² / 0.89   (square channel laminar)
 * v_ch = LV / OFA
 * Returns ΔP in mmH₂O for a sweep of LV values.
 */
export function pressureDropSeries(
  catalystLengthM: number,
  hydraulicDiameterMm: number,
  openFrontalArea: number,
  tempC: number,
  lvMin = 1,
  lvMax = 10,
  step = 0.25,
): { lv: number; dp: number }[] {
  const muPaS = 3.0e-5 * Math.pow((tempC + 273.15) / (350 + 273.15), 0.7);
  const dh = hydraulicDiameterMm / 1000;
  const out: { lv: number; dp: number }[] = [];
  for (let lv = lvMin; lv <= lvMax; lv += step) {
    const vch = openFrontalArea > 0 ? lv / openFrontalArea : lv;
    const dPa =
      dh > 0
        ? (32 * muPaS * catalystLengthM * vch) / (dh * dh) / 0.89
        : 0;
    out.push({ lv, dp: dPa / 9.80665 }); // Pa → mmH₂O
  }
  return out;
}
