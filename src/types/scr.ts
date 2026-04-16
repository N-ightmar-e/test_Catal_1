/**
 * SCR (Selective Catalytic Reduction) Honeycomb Catalyst Design — Types
 *
 * For V₂O₅-WO₃/TiO₂ honeycomb-form DeNOx catalysts.
 * Reference: Korean J. Chem. Eng. (2018) — Park Sam-Sik et al.
 */

export interface SCRInputs {
  /** 배기가스 유량 (표준 상태) — Normal flue gas flow */
  flowNm3h: number; // [Nm³/h]

  /** 배기가스 운전 온도 — Operating temperature */
  tempC: number; // [°C]

  /** 운전 압력 — Operating pressure (absolute) */
  pressureKpa: number; // [kPa abs]

  /** 입구 NOx 농도 */
  noxInPpm: number; // [ppm, dry basis]

  /** 목표 NOx 제거율 */
  noxRemovalPct: number; // [%]

  /** 허용 NH₃ slip */
  nh3SlipPpm: number; // [ppm]

  /** 배기가스 산소 농도 */
  o2VolPct: number; // [vol%]

  /** 배기가스 수분 농도 */
  h2oVolPct: number; // [vol%]

  /** 촉매 활성도 — catalyst activity (fresh) */
  activityK: number; // [m/h]  typical 25–40

  /** 허니컴 피치 — cell pitch */
  pitchMm: number; // [mm]

  /** 격벽 두께 */
  wallThicknessMm: number; // [mm]

  /** 단일 촉매 모듈 단면 가로 */
  moduleWidthMm: number; // [mm]

  /** 단일 촉매 모듈 단면 세로 */
  moduleHeightMm: number; // [mm]

  /** 단일 모듈 길이 (flow direction) */
  moduleLengthMm: number; // [mm]

  /** V₂O₅ 담지량 */
  v2o5WtPct: number; // [wt%]
}

export interface SCRResults {
  // --- 화학 양론 / Stoichiometry ---
  alpha: number; // [-] NH₃/NOx molar ratio
  nh3RateKgh: number; // [kg/h]
  noxInMolh: number; // [mol/h]

  // --- 촉매 기하 / Geometry ---
  cellOpeningMm: number; // [mm]  a = p − t_w
  openFrontalArea: number; // [-]  OFA
  hydraulicDiameterMm: number; // [mm]
  cpsi: number; // [cells / in²]
  geometricSurfaceDensity: number; // [m²/m³]  a_v

  // --- 속도 / Velocities ---
  areaVelocity: number; // [m/h]  AV = K / (−ln(1 − η_eff))
  effectiveRemoval: number; // [-]  η accounting for NH₃ slip
  actualFlowM3h: number; // [m³/h] at operating T, P
  volumeCatalystM3: number; // [m³]
  spaceVelocity: number; // [h⁻¹]  SV = Q_actual / V_cat
  ghsv: number; // [h⁻¹]  Q_normal / V_cat
  linearVelocityMs: number; // [m/s]
  channelVelocityMs: number; // [m/s]

  // --- 압력손실 / Pressure drop ---
  pressureDropPa: number; // [Pa]
  pressureDropMmH2O: number; // [mmH₂O]

  // --- 모듈 수량 / Modules ---
  frontalAreaM2: number; // [m²]  total front face of catalyst bed
  catalystLengthM: number; // [m]  total flow-direction length
  modulesPerLayer: number; // [-] (rounded up)
  numberOfLayers: number; // [-] (rounded up)
  totalModules: number; // [-]

  // --- 부가 지표 ---
  so2ToSo3ConvPct: number; // [%] estimated
  temperatureWindowOk: boolean;
  temperatureWindowNote: string;
  designMarginNote: string;

  // --- Warnings ---
  warnings: string[];
}

export interface RequesterInfo {
  docNo: string;
  docDate: string;
  companyName: string;
  contactPerson: string;
  contactPhone: string;
  contactEmail: string;
  facilityType: string;
  projectName: string;
}

export type DesignCase = {
  id: string;
  createdAt: string;
  requester: RequesterInfo;
  inputs: SCRInputs;
  results: SCRResults;
};
