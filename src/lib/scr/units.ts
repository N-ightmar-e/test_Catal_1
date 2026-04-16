/**
 * Unit conversion helpers.
 */
import { P_STD_KPA, T_STD_K } from "./constants";

/**
 * Convert normal volumetric flow to actual flow at operating T, P.
 * Q_actual = Q_normal × (T_actual / T_std) × (P_std / P_actual)
 */
export function normalToActualFlow(
  qNm3h: number,
  tempC: number,
  pressureKpa: number,
): number {
  const T_actual = tempC + T_STD_K;
  return qNm3h * (T_actual / T_STD_K) * (P_STD_KPA / pressureKpa);
}

/** [mm] → [m] */
export const mmToM = (mm: number): number => mm / 1000;

/** [m] → [mm] */
export const mToMm = (m: number): number => m * 1000;

/** [Pa] → [mmH₂O] (1 mmH₂O ≈ 9.80665 Pa) */
export const paToMmH2O = (pa: number): number => pa / 9.80665;

/** [mm] → [in] */
export const mmToIn = (mm: number): number => mm / 25.4;

/** Round to n significant digits for display */
export function sig(x: number, n = 4): number {
  if (!Number.isFinite(x) || x === 0) return x;
  const d = Math.ceil(Math.log10(Math.abs(x)));
  const factor = Math.pow(10, n - d);
  return Math.round(x * factor) / factor;
}
