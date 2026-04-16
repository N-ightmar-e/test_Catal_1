/**
 * Data_old — SCR plate-catalyst design engine reconstructed from
 * NCB_B2 v1.0.1 (Wails/Go Windows app extracted from NCB_B2_Desktop.exe).
 *
 * The original Go backend (`window.go.main.App.Calculate`) is embedded in
 * binary form; its exact coefficients are not publicly available. This engine
 * replicates the INPUT and OUTPUT CONTRACT of NCB_B2 exactly (every field) and
 * uses published plate-type SCR design physics to compute results. It is
 * labelled "Data_old" so results are treated as a transparent industry-standard
 * reconstruction rather than an exact replay of the vendor's proprietary
 * coefficients.
 *
 * Physics basis (each term tagged with its role in the pipeline):
 *
 *   1. NOx concentration conversion  (mg/Nm³ dry O2_ref → ppm)
 *   2. kMat (kinetic, Arrhenius, V₂O₅-dependent)
 *   3. kStr (mass-transfer, Sherwood correlation, Re-dependent)
 *   4. K = (1/kMat + 1/kStr)⁻¹  (series resistance)
 *   5. η_eff = η + NH3_slip/NOx_in
 *   6. AV_required = K / (−ln(1 − η_eff))
 *   7. V_required = Q / (AV · a_v)
 *   8. V_design   = V_required × safetyNox / ktk0
 *   9. ΔP_layer = 32 μ L v_ch / d_h²        (laminar plate)
 *                   = 0.5 ρ v² (f L/d_h)    (turbulent — Blasius)
 *  10. ΔP_design = N_layer · ΔP_layer + dp_grid
 *  11. SO₂→SO₃ conversion   (empirical Hinton-style T+V₂O₅ dependence)
 *  12. NH₃ demand           (stoichiometric)
 *
 * References:
 *   · Park S.-S. et al., Korean J. Chem. Eng. (2018)
 *   · EPA SCR Cost Manual Ch.2 (2016/2017)
 *   · Reid/Prausnitz — Properties of Gases & Liquids
 *   · Shah & London — Laminar Flow Forced Convection
 */
import type {
  ActivityResults,
  CatVolumeResults,
  DataOldInputs,
  DataOldResults,
  NOxOutputResults,
  PressureDropResults,
  SO2ConversionResults,
} from "@/types/data-old";
import { PLATE_HT_M } from "@/types/data-old";

// ─── Constants ────────────────────────────────────────────────────────────────
const R_UNIVERSAL = 8.31446; // J/(mol·K)
const T_ABS_0 = 273.15;
const MW_NH3 = 17.03;
const MW_NO2 = 46.006;
const P_STD_KPA = 101.325;
const MU_REF = 3.0e-5; // Pa·s at 350 °C (flue gas approximation)
const T_MU_REF_K = 350 + T_ABS_0;
const D_NO_REF_M2_S = 2.0e-5; // NO diffusion in air @ STP
const SHERWOOD_LAMINAR_PLATE = 7.54; // const-wall concentration, fully developed

// ─── Helper functions ─────────────────────────────────────────────────────────
function viscosityPaS(tempC: number): number {
  return MU_REF * Math.pow((tempC + T_ABS_0) / T_MU_REF_K, 0.7);
}
function diffusionM2S(tempC: number, pressureKPa: number): number {
  return (
    D_NO_REF_M2_S *
    Math.pow((tempC + T_ABS_0) / T_ABS_0, 1.75) *
    (P_STD_KPA / pressureKPa)
  );
}
function densityKgM3(tempC: number, pressureKPa: number): number {
  // Treat flue gas as air (M_avg ≈ 29 g/mol)
  const M = 29e-3; // kg/mol
  return (pressureKPa * 1000 * M) / (R_UNIVERSAL * (tempC + T_ABS_0));
}

/** Convert mg/Nm³ at O2_ref (dry) to ppm (volume). */
function mgNm3ToPpm(mgNm3: number, mw: number): number {
  // Nm³ basis: 22.414 L/mol → 1 Nm³ = 44.64 mol
  // ppm_v = mg/Nm³ × 22.414 / MW
  return (mgNm3 * 22.414) / mw;
}

// ─── Core engine ──────────────────────────────────────────────────────────────
export function computeDataOld(inp: DataOldInputs): DataOldResults {
  const warnings: string[] = [];

  // 1. Catalyst plate geometry
  const plateHt = PLATE_HT_M[inp.plateHtOpt]; // [m]
  const plateThickM = inp.plateThick / 1000;
  const channelGap = Math.max(0.001, plateHt / (inp.notches * 2)); // rough plate gap
  const dhM = 2 * channelGap; // hydraulic diameter (parallel plates ≈ 2 × gap)

  // 2. Flow conditions (operating → channel)
  // Inputs: flowRate given as m³/h at operating; normalize is not needed here.
  const Qm3h = inp.flowRate;
  const Qm3s = Qm3h / 3600;
  const mu = viscosityPaS(inp.temperature);
  const rho = densityKgM3(inp.temperature, inp.pressure / 10); // hPa→kPa: /10
  const vChannel = inp.gasVelocity; // treat user-input as channel velocity (m/s)

  // 3. Reynolds and flow regime
  const Re = (rho * vChannel * dhM) / mu;
  let flowRegime: "laminar" | "transitional" | "turbulent";
  if (Re < 2300) flowRegime = "laminar";
  else if (Re < 4000) flowRegime = "transitional";
  else flowRegime = "turbulent";
  const isLaminar = flowRegime === "laminar";

  // 4. kMat — kinetic activity (Arrhenius, V₂O₅ scaled, catalyst type factor)
  const Tk = inp.temperature + T_ABS_0;
  const Ea = inp.catType === 1 ? 65_000 : 55_000; // J/mol  (W vs Mo: W slightly higher)
  const A = inp.catType === 1 ? 1.1e6 : 1.5e6; // pre-exponential  [m/h] effective
  const v2o5Factor = Math.max(0.01, inp.v2o5Content) / 0.45; // normalized to 0.45 wt%
  const kMat =
    A * Math.exp(-Ea / (R_UNIVERSAL * Tk)) * Math.pow(v2o5Factor, 0.6);

  // 5. kStr — mass-transfer activity
  // Sh for laminar plate ≈ 7.54 (both walls constant concentration)
  // kStr_mass = Sh · D_NO / d_h  [m/s]  → ×3600 for m/h
  let sh: number;
  if (isLaminar) sh = SHERWOOD_LAMINAR_PLATE;
  else if (flowRegime === "transitional")
    sh = SHERWOOD_LAMINAR_PLATE + ((Re - 2300) / 1700) * 6;
  else sh = 0.023 * Math.pow(Re, 0.8) * Math.pow(0.7, 1 / 3); // Dittus-Boelter
  const D = diffusionM2S(inp.temperature, inp.pressure / 10);
  const kStr = ((sh * D) / dhM) * 3600; // m/h

  // 6. Overall K — series resistance
  const kOverall = 1 / (1 / kMat + 1 / kStr);

  // 7. η effective (include slip penalty)
  const noxInPpm = mgNm3ToPpm(inp.noxInlet, MW_NO2);
  const slipPpm = mgNm3ToPpm(inp.nh3Slip, MW_NH3);
  const eta = inp.noxReduction / 100;
  const etaEff = Math.min(0.999, eta + slipPpm / noxInPpm);
  const alpha = eta + slipPpm / noxInPpm;

  // 8. AV and volume
  const avRequired = kOverall / -Math.log(1 - etaEff);
  const volumeRequired = Qm3h / (avRequired * inp.specificArea);
  const lifeFactor = Math.max(0.2, inp.ktk0);
  const volumeDesign = (volumeRequired * inp.safetyNox) / lifeFactor;
  const volumeDiox =
    inp.designMode === 3
      ? volumeDesign * inp.safetyDiox * 0.4 // rough 40% add-on for DIOx parallel sizing
      : undefined;

  // 9. NH₃ demand (stoichiometric)
  // Ṅ_NOx [mol/h] = flowRate [m³/h]·noxIn[ppm]·1e-6 / 22.414 L/mol × 1000 ...
  // Using operating-condition flow with T adjustment:
  const Qnm3h = inp.flowRate * (T_ABS_0 / Tk) * (inp.pressure / 10 / P_STD_KPA);
  const ṄNOx = (Qnm3h * noxInPpm * 1e-6) / 22.414e-3; // mol/h
  const nh3Demand = (alpha * ṄNOx * MW_NH3) / 1000; // kg/h

  // 10. Pressure drop per layer + protection grid
  const plateLengthM = plateHt; // plateHtOpt gives element height along flow
  let dpLayerPa: number;
  if (isLaminar) {
    dpLayerPa = (32 * mu * plateLengthM * vChannel) / (dhM * dhM);
  } else {
    const f = 0.316 / Math.pow(Re, 0.25); // Blasius
    dpLayerPa = ((f * plateLengthM) / dhM) * (0.5 * rho * vChannel * vChannel);
  }
  const dpPerLayerMbar = dpLayerPa / 100; // Pa→mbar
  const dpProtGridMbar = inp.hasGrating ? 0.5 * rho * 0.04 * 1e-2 : 0; // ~0.4 mbar/grid
  const dpDesignMbar = dpPerLayerMbar * inp.numLayers + dpProtGridMbar;
  const dpMmH2O = (dpDesignMbar * 100) / 9.80665; // mbar→Pa→mmH₂O

  // 11. SO₂ → SO₃ conversion
  const convRate =
    0.6 * inp.v2o5Content * Math.exp((inp.temperature - 380) / 50);
  const convRateSF = convRate * inp.safetyNox; // safety-factored
  const so3Outlet =
    inp.so2Inlet * (convRate / 100) + inp.so3Inlet * (1 - convRate / 100);

  // 12. NOx outlet
  const noxOutlet = inp.noxInlet * (1 - eta);

  // 13. Warnings
  if (inp.temperature < 300 || inp.temperature > 420)
    warnings.push(
      `운전 온도 ${inp.temperature}°C가 권장 창(300–420°C)을 벗어남 — 활성/부반응 재검토.`,
    );
  if (convRate > 1.5)
    warnings.push(
      `SO₂→SO₃ 변환율 ${convRate.toFixed(2)}% — NH₄HSO₄ 응축 주의.`,
    );
  if (inp.nh3Slip / inp.noxInlet > 0.02)
    warnings.push("NH₃ slip이 NOx 입구 2% 초과 — slip 관리 필요.");
  if (alpha > 1.05)
    warnings.push(`α=${alpha.toFixed(3)} > 1.05 — 과주입 방지.`);
  if (dpDesignMbar > 20)
    warnings.push(`ΔP ${dpDesignMbar.toFixed(1)} mbar — 팬/공력 재검토.`);
  if (inp.ktk0 < 0.5)
    warnings.push(
      `ktk0=${inp.ktk0} — 수명 말기 활성이 매우 낮음. 재생 일정 확인.`,
    );

  // 14. Assemble results
  const activity: ActivityResults = {
    kMat,
    kStr,
    kOverall,
    reynolds: Re,
    isLaminar,
    flowRegime,
    channelVel: vChannel,
  };
  const catVolume: CatVolumeResults = {
    avRequired,
    volumeRequired,
    volumeDesign,
    volumeDiox,
    etaTarget: etaEff,
  };
  const pressureDrop: PressureDropResults = {
    dpPerLayer: dpPerLayerMbar,
    dpProtGrid: dpProtGridMbar,
    dpDesign: dpDesignMbar,
    dpMmH2O,
  };
  const so2Conversion: SO2ConversionResults = {
    convRate,
    convRateSF,
    so3Outlet,
  };
  const nox: NOxOutputResults = {
    noxOutlet,
    nh3Demand,
    alpha,
  };

  return {
    success: true,
    kmat: `K = ${kOverall.toFixed(4)} m/h   (kMat = ${kMat.toExponential(2)},  kStr = ${kStr.toFixed(2)})`,
    activity,
    catVolume,
    pressureDrop,
    so2Conversion,
    nox,
    warnings,
    inputsEcho: inp,
  };
}
