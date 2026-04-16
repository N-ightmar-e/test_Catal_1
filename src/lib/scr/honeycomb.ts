/**
 * Honeycomb V₂O₅-WO₃/TiO₂ SCR catalyst design engine.
 *
 * Core formulae:
 *   η = 1 − exp(−K / AV)           (1st-order plug-flow NOx)
 *   AV = K / (−ln(1 − η_eff))       (solved for AV)
 *   A_geo = Q_actual / AV          (required geometric surface)
 *   a_v = 4·a / p²                 (GSA density of square-channel honeycomb)
 *   V_cat = A_geo / a_v            (catalyst volume)
 *   ΔP ≈ 32·μ·L·v_ch / d_h²        (laminar Hagen–Poiseuille, square ch.)
 *
 * Honeycomb geometry definitions (square channels):
 *   p   = pitch (wall-center to wall-center)                [m]
 *   t_w = wall thickness                                    [m]
 *   a   = open cell side = p − t_w                          [m]
 *   OFA = (a/p)²                    (open frontal area)     [-]
 *   d_h = a                         (hydraulic diameter)    [m]
 *
 * All inputs/outputs in SI unless clearly suffixed.
 */
import type { SCRInputs, SCRResults } from "@/types/scr";
import {
  M_NH3_G,
  MOLAR_VOLUME_STP_L,
  TEMP_WINDOW_C,
  fluGasViscosityPas,
} from "./constants";
import { mmToIn, mmToM, normalToActualFlow, paToMmH2O, sig } from "./units";

export function computeHoneycomb(inp: SCRInputs): SCRResults {
  const warnings: string[] = [];

  // --- 0. Unit prep ---
  const p_m = mmToM(inp.pitchMm);
  const tw_m = mmToM(inp.wallThicknessMm);
  const a_m = p_m - tw_m;

  if (a_m <= 0) {
    warnings.push("격벽 두께가 피치보다 크거나 같습니다 — 기하 불가능.");
  }

  // --- 1. Geometry ---
  const openFrontalArea = Math.max(0, (a_m / p_m) ** 2);
  const hydraulicDiameterM = a_m; // square channel: d_h = a
  const cpsi = 1 / mmToIn(inp.pitchMm) ** 2;
  // GSA density: 4 × (wetted perimeter per cell) × L / (cell volume = p² × L)
  // = 4·a·L / (p²·L) = 4a/p²   [m²/m³]
  const geometricSurfaceDensity = a_m > 0 ? (4 * a_m) / (p_m * p_m) : 0;

  // --- 2. Stoichiometry & NH₃ demand ---
  const eta = inp.noxRemovalPct / 100;
  // NH₃ slip contribution: slip ppm / inlet ppm (extra NH₃ beyond what reacts)
  const slipFrac = inp.nh3SlipPpm / inp.noxInPpm;
  // effective conversion the catalyst must deliver (slightly > target when slip > 0)
  const etaEff = Math.min(0.999, eta + slipFrac * (1 - eta));
  // α = moles NH₃ per mole NOx — standard practice: η + slip/(NOx_in) ≤ 1.05
  const alpha = eta + slipFrac;

  if (alpha > 1.05)
    warnings.push(
      `α(NH₃/NOx)=${sig(alpha, 3)}이 1.05를 초과합니다 — NH₃ slip 또는 목표 제거율 재검토 필요.`,
    );
  if (alpha < 0.7)
    warnings.push(
      `α=${sig(alpha, 3)}이 매우 낮습니다 — 설계 목표 재확인.`,
    );

  // NOx molar flow [mol/h]
  // Nm³/h × 1000 L/m³ / 22.414 L/mol × ppm × 1e-6
  const noxInMolh =
    ((inp.flowNm3h * 1000) / MOLAR_VOLUME_STP_L) * inp.noxInPpm * 1e-6;
  const nh3RateKgh = (alpha * noxInMolh * M_NH3_G) / 1000;

  // --- 3. Area velocity (1st-order plug flow) ---
  const lnTerm = -Math.log(Math.max(1e-9, 1 - etaEff));
  const areaVelocity = inp.activityK / lnTerm; // [m/h]

  // --- 4. Actual flow and required surface area ---
  const actualFlowM3h = normalToActualFlow(
    inp.flowNm3h,
    inp.tempC,
    inp.pressureKpa,
  );
  const requiredAreaM2 = actualFlowM3h / areaVelocity;

  // --- 5. Catalyst volume ---
  const volumeCatalystM3 =
    geometricSurfaceDensity > 0 ? requiredAreaM2 / geometricSurfaceDensity : 0;

  // --- 6. Space & linear velocities ---
  const spaceVelocity = volumeCatalystM3 > 0 ? actualFlowM3h / volumeCatalystM3 : 0;
  const ghsv = volumeCatalystM3 > 0 ? inp.flowNm3h / volumeCatalystM3 : 0;

  // --- 7. Module layout ---
  const moduleArea =
    mmToM(inp.moduleWidthMm) * mmToM(inp.moduleHeightMm);
  const moduleLengthM = mmToM(inp.moduleLengthMm);

  // Target LV ~ 4–6 m/s at operating conditions for typical honeycomb SCR.
  // Decide frontal area so that LV stays in range.
  const targetLVms = 5.0;
  const actualFlowM3s = actualFlowM3h / 3600;
  const frontalAreaM2 = actualFlowM3s / targetLVms;

  const modulesPerLayer = Math.ceil(frontalAreaM2 / moduleArea);
  // Catalyst length given required volume and frontal area:
  const catalystLengthM = volumeCatalystM3 / frontalAreaM2;
  const numberOfLayers = Math.max(1, Math.ceil(catalystLengthM / moduleLengthM));
  const totalModules = modulesPerLayer * numberOfLayers;

  // Real LV & channel velocity
  const linearVelocityMs = actualFlowM3s / frontalAreaM2;
  const channelVelocityMs =
    openFrontalArea > 0 ? linearVelocityMs / openFrontalArea : 0;

  // --- 8. Pressure drop (laminar, square channel) ---
  // ΔP = 32·μ·L·v_ch / d_h²   (Hagen–Poiseuille; for square channel, shape factor ~0.89)
  const mu = fluGasViscosityPas(inp.tempC);
  const dP =
    hydraulicDiameterM > 0
      ? (32 * mu * catalystLengthM * channelVelocityMs) /
        (hydraulicDiameterM * hydraulicDiameterM) /
        0.89 // square vs circular correction
      : 0;

  // --- 9. SO₂→SO₃ estimate (empirical) ---
  // Roughly: %conv ≈ 0.6 × V₂O₅[wt%] × exp((T − 380)/50)
  const so2ToSo3ConvPct =
    0.6 * inp.v2o5WtPct * Math.exp((inp.tempC - 380) / 50);

  // --- 10. Temperature window flags ---
  const tempOk =
    inp.tempC >= TEMP_WINDOW_C.min && inp.tempC <= TEMP_WINDOW_C.max;
  let tempNote = "";
  if (inp.tempC < TEMP_WINDOW_C.min) {
    tempNote = `운전온도가 ${TEMP_WINDOW_C.min}°C 미만입니다 — NH₄HSO₄ 폐색 및 활성 저하 우려.`;
    warnings.push(tempNote);
  } else if (inp.tempC > TEMP_WINDOW_C.max) {
    tempNote = `운전온도가 ${TEMP_WINDOW_C.max}°C 초과입니다 — NH₃ 산화 및 SO₂→SO₃ 변환 증가 우려.`;
    warnings.push(tempNote);
  } else if (
    inp.tempC < TEMP_WINDOW_C.optimalMin ||
    inp.tempC > TEMP_WINDOW_C.optimalMax
  ) {
    tempNote = `운전온도가 최적 구간(${TEMP_WINDOW_C.optimalMin}–${TEMP_WINDOW_C.optimalMax}°C) 밖입니다 — 허용 범위 내이나 성능 여유 축소.`;
  } else {
    tempNote = `운전온도 최적 구간 내(${TEMP_WINDOW_C.optimalMin}–${TEMP_WINDOW_C.optimalMax}°C).`;
  }

  // --- 11. Design margin note ---
  // 설치 총 길이와 계산 길이 차이(slack) 기준으로 여유 판정.
  // 통상 허니컴 SCR 설계 관행:
  //   - slack ≥ 200 mm (또는 층 하나 여분) → 피독/열화 여유 "양호"
  //   - 100–200 mm                         → "여유 보통, 모니터링 권장"
  //   - < 100 mm                           → "여유 부족, 추가 층 고려"
  const totalInstalledLengthM = moduleLengthM * numberOfLayers;
  const slackM = Math.max(0, totalInstalledLengthM - catalystLengthM);
  const slackPct = totalInstalledLengthM > 0 ? (slackM / totalInstalledLengthM) * 100 : 0;
  const utilizationPct =
    totalInstalledLengthM > 0 ? (catalystLengthM / totalInstalledLengthM) * 100 : 0;

  let marginNote = "";
  if (slackM >= 0.2) {
    marginNote = `촉매 설치 길이 ${sig(totalInstalledLengthM, 3)} m 중 사용 ${sig(catalystLengthM, 3)} m (잉여 ${sig(slackM * 1000, 3)} mm, 여유율 ${sig(slackPct, 3)}%) — 수명/피독 여유 양호.`;
  } else if (slackM >= 0.1) {
    marginNote = `촉매 설치 길이 ${sig(totalInstalledLengthM, 3)} m 중 사용 ${sig(catalystLengthM, 3)} m (잉여 ${sig(slackM * 1000, 3)} mm) — 여유 보통, 운전 중 활성 저하 모니터링 권장.`;
  } else {
    marginNote = `촉매 설치 길이 ${sig(totalInstalledLengthM, 3)} m 중 사용 ${sig(catalystLengthM, 3)} m (잉여 ${sig(slackM * 1000, 3)} mm, 사용률 ${sig(utilizationPct, 3)}%) — 여유 부족, 추가 층 또는 모듈 길이 상향 검토 필요.`;
    warnings.push(marginNote);
  }

  if (so2ToSo3ConvPct > 1.0) {
    warnings.push(
      `SO₂→SO₃ 변환율 추정치 ${sig(so2ToSo3ConvPct, 3)}% — 황산암모늄 응축 위험, V₂O₅ 담지량 또는 온도 재검토.`,
    );
  }

  return {
    alpha: sig(alpha, 4),
    nh3RateKgh: sig(nh3RateKgh, 4),
    noxInMolh: sig(noxInMolh, 4),
    cellOpeningMm: sig(a_m * 1000, 4),
    openFrontalArea: sig(openFrontalArea, 4),
    hydraulicDiameterMm: sig(hydraulicDiameterM * 1000, 4),
    cpsi: sig(cpsi, 4),
    geometricSurfaceDensity: sig(geometricSurfaceDensity, 4),
    areaVelocity: sig(areaVelocity, 4),
    effectiveRemoval: sig(etaEff, 4),
    actualFlowM3h: sig(actualFlowM3h, 4),
    volumeCatalystM3: sig(volumeCatalystM3, 4),
    spaceVelocity: sig(spaceVelocity, 4),
    ghsv: sig(ghsv, 4),
    linearVelocityMs: sig(linearVelocityMs, 4),
    channelVelocityMs: sig(channelVelocityMs, 4),
    pressureDropPa: sig(dP, 4),
    pressureDropMmH2O: sig(paToMmH2O(dP), 4),
    frontalAreaM2: sig(frontalAreaM2, 4),
    catalystLengthM: sig(catalystLengthM, 4),
    modulesPerLayer,
    numberOfLayers,
    totalModules,
    so2ToSo3ConvPct: sig(so2ToSo3ConvPct, 4),
    temperatureWindowOk: tempOk,
    temperatureWindowNote: tempNote,
    designMarginNote: marginNote,
    warnings,
  };
}
