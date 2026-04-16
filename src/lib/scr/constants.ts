/**
 * Physical constants and default design values for SCR honeycomb calculations.
 * V₂O₅-WO₃/TiO₂ system, industrial DeNOx.
 */

/** 질소 산화물 표준 몰부피 at STP (0 °C, 101.325 kPa) [L/mol] */
export const MOLAR_VOLUME_STP_L = 22.414;

/** Universal gas constant [J/(mol·K)] */
export const R_J_PER_MOL_K = 8.31446;

/** Standard atmospheric pressure [kPa] */
export const P_STD_KPA = 101.325;

/** Standard temperature [K] */
export const T_STD_K = 273.15;

/** NH₃ molar mass [g/mol] */
export const M_NH3_G = 17.031;

/** NOx (as NO₂ basis) molar mass [g/mol] — industry convention */
export const M_NOX_AS_NO2_G = 46.006;

/** Typical flue gas dynamic viscosity @ 350 °C [Pa·s] — air-like approximation */
export const MU_FLUE_350C_PAS = 3.0e-5;

/** Temperature coefficient of viscosity (Sutherland-like for flue gas) */
export function fluGasViscosityPas(tempC: number): number {
  // μ ≈ μ₀ × (T/T₀)^0.7  from kinetic theory for dilute gas
  const T = tempC + T_STD_K;
  const T0 = 350 + T_STD_K;
  return MU_FLUE_350C_PAS * Math.pow(T / T0, 0.7);
}

/** Default design inputs for a typical coal-fired boiler SCR (Korean practice) */
export const DEFAULT_SCR_INPUTS = {
  flowNm3h: 500_000, // 500,000 Nm³/h
  tempC: 360,
  pressureKpa: 101.325,
  noxInPpm: 350,
  noxRemovalPct: 85,
  nh3SlipPpm: 3,
  o2VolPct: 4,
  h2oVolPct: 8,
  activityK: 30, // m/h, fresh V₂O₅-WO₃/TiO₂
  pitchMm: 7.4, // ~4.6 CPSI equivalent... actually CPSI ≈ (25.4/7.4)² ≈ 11.8
  wallThicknessMm: 1.1,
  moduleWidthMm: 150,
  moduleHeightMm: 150,
  moduleLengthMm: 1000,
  v2o5WtPct: 1.0,
};

/** Recommended operating temperature window */
export const TEMP_WINDOW_C = { min: 300, max: 400, optimalMin: 340, optimalMax: 380 };
