/**
 * Data_old mode — type contracts reconstructed from NCB_B2 v1.0.1
 * (embedded Wails frontend extracted from NCB_B2_Desktop.exe).
 *
 * Covers plate-type SCR catalyst design with kMat / kStr (kinetic / mass-transfer)
 * series resistance, Reynolds regime, SO2→SO3 conversion, module sizing.
 */

export type DesignModeCode = 1 | 2 | 3; // 1=DeNOx, 2=DeDIOx, 3=Both
export type CatTypeCode = 1 | 2; // 1=W, 2=Mo
export type PlateHtCode = 1 | 2 | 3 | 4 | 5 | 6;
export const PLATE_HT_M: Record<PlateHtCode, number> = {
  1: 0.45,
  2: 0.5,
  3: 0.55,
  4: 0.57,
  5: 0.6,
  6: 0.625,
};

export interface DataOldInputs {
  // --- 프로젝트 / Project ---
  projectName: string;
  projectVersion: string;
  inquiryDate: string;
  department: string;
  preparedBy: string;
  outputLang: "ko" | "en";

  // --- 모드 / 촉매 타입 ---
  designMode: DesignModeCode;
  appType: number; // 1
  catType: CatTypeCode;
  moduleType: number; // 1
  plateHtOpt: PlateHtCode;

  // --- 연소 가스 / Flue Gas ---
  flowRate: number; // [m³/h] (at operating conditions, wet basis)
  temperature: number; // [°C]
  pressure: number; // [hPa] (absolute)
  humidity: number; // [vol%]
  o2Operating: number; // [vol%]
  o2Reference: number; // [vol%]
  designLife: number; // [h]

  // --- NOx / SOx ---
  noxInlet: number; // [mg/Nm³, O2_ref basis, dry]
  noxReduction: number; // [%]
  nh3Slip: number; // [mg/Nm³]
  no2Fraction: number; // [%] of NOx that is NO2
  so2Inlet: number; // [mg/Nm³]
  so3Inlet: number; // [mg/Nm³]

  // --- 촉매 / Catalyst ---
  v2o5Content: number; // [wt%]
  plateThick: number; // [mm]
  specificArea: number; // [m²/m³]
  notches: number; // [#]
  gasVelocity: number; // [m/s] (empty-duct linear velocity target)
  safetyNox: number; // [-] margin multiplier ≥ 1
  ktk0: number; // [-] activity ratio k(life)/k(0)  (0 < ktk0 ≤ 1)
  hasGrating: boolean;
  safetyDiox: number; // [-] margin multiplier for DeDIOx

  // --- 모듈 / Reactor Module ---
  elemPerLen: number; // elements along catalyst length
  elemPerWid: number; // elements across catalyst width
  numLayers: number; // stacked layers
  modWidth: number; // module width (# elements)
  modDepth: number; // module depth (# elements)
}

export interface ActivityResults {
  kMat: number; // [m/h]  mass-transfer (structure) activity
  kStr: number; // [m/h]  kinetic (material) activity
  kOverall: number; // [m/h] combined series-resistance K
  reynolds: number; // [-] channel Re
  isLaminar: boolean;
  flowRegime: "laminar" | "transitional" | "turbulent";
  channelVel: number; // [m/s] actual channel velocity
}

export interface CatVolumeResults {
  avRequired: number; // [m/h] area velocity at current design
  volumeRequired: number; // [m³] bare catalyst vol (no margin)
  volumeDesign: number; // [m³] with safetyNox + ktk0 corrections
  volumeDiox?: number; // [m³] parallel DIOx design vol when designMode=3
  etaTarget: number; // [-] effective η required including slip
}

export interface PressureDropResults {
  dpPerLayer: number; // [mbar] ΔP of one catalyst layer
  dpProtGrid: number; // [mbar] protection grid ΔP
  dpDesign: number; // [mbar] total ΔP for all layers + grid
  dpMmH2O: number; // [mmH₂O]  convenience
}

export interface SO2ConversionResults {
  convRate: number; // [%]  dry conversion rate at operating conditions
  convRateSF: number; // [%]  conservative (safety-factored) rate
  so3Outlet: number; // [mg/Nm³]  at outlet
}

export interface NOxOutputResults {
  noxOutlet: number; // [mg/Nm³] at O2_ref basis
  nh3Demand: number; // [kg/h]
  alpha: number; // [mol/mol]
}

export interface DataOldResults {
  success: boolean;
  error?: string;
  kmat: string; // human string for display header
  activity: ActivityResults;
  catVolume: CatVolumeResults;
  pressureDrop: PressureDropResults;
  so2Conversion: SO2ConversionResults;
  nox: NOxOutputResults;
  warnings: string[];
  inputsEcho: DataOldInputs;
}

export const DEFAULT_DATA_OLD_INPUTS: DataOldInputs = {
  projectName: "Test",
  projectVersion: "1.0",
  inquiryDate: new Date().toISOString().slice(0, 10),
  department: "",
  preparedBy: "",
  outputLang: "ko",
  designMode: 1,
  appType: 1,
  catType: 2,
  moduleType: 1,
  plateHtOpt: 2,
  flowRate: 1_000_000,
  temperature: 350,
  pressure: 1013,
  humidity: 10,
  o2Operating: 5,
  o2Reference: 3,
  designLife: 24_000,
  noxInlet: 1000,
  noxReduction: 80,
  nh3Slip: 5,
  no2Fraction: 5,
  so2Inlet: 100,
  so3Inlet: 10,
  v2o5Content: 0.45,
  plateThick: 0.7,
  specificArea: 500,
  notches: 4,
  gasVelocity: 5,
  safetyNox: 1.2,
  ktk0: 0.8,
  hasGrating: true,
  safetyDiox: 1.2,
  elemPerLen: 4,
  elemPerWid: 2,
  numLayers: 5,
  modWidth: 2,
  modDepth: 47,
};
