/**
 * Catalyst aging / deactivation model.
 *
 * Simplified 1st-order deactivation model (Arrhenius-type):
 *   K(t) = K₀ · exp(−k_d · t)
 *
 * where k_d is a deactivation rate constant. Combined with Korean thermal-plant
 * empirical data (Park S.-S. et al., KJChE 2018; MDPI Catalysts 10(1):52 2020):
 *
 *   k_d [1/yr] ≈ k_d,base + k_d,S · [S%] + k_d,dust · dust_gpNm3
 *
 * Typical industrial range: 0.10 – 0.30 1/yr (half-life 2.3 – 7 yr)
 *
 * Life estimate: time until K(t) drops to a minimum acceptable fraction
 * (typically 0.6 × K₀, beyond which the SCR can no longer meet η target).
 */

export interface AgingInputs {
  /** 초기 촉매 활성도 K₀ [m/h] */
  k0: number;
  /** 연료 황분 [wt%] — 0 for natural gas */
  fuelSulfurPct: number;
  /** 분진 부하 [g/Nm³] */
  dustLoadGNm3: number;
  /** 운전 온도 [°C] (>400°C accelerates thermal aging) */
  operatingTempC: number;
  /** 최소 허용 활성 비율 (K_min / K₀) — 보통 0.6 */
  minActivityFraction: number;
}

export interface AgingResults {
  /** 연간 열화 상수 k_d [1/yr] */
  deactivationRatePerYear: number;
  /** 예상 수명 [yr] */
  estimatedLifeYears: number;
  /** 1/2/3/5년 시점의 K(t) [m/h] */
  kAtYears: { year: number; k: number }[];
  /** 경고 및 권장사항 */
  notes: string[];
}

export function computeAging(inp: AgingInputs): AgingResults {
  const notes: string[] = [];

  // Base deactivation ~ 0.08 /yr (thermal only, clean gas)
  const k_d_base = 0.08;
  // Sulfur contribution: 0.04 per wt% S (SO₃→NH₄HSO₄ poisoning)
  const k_d_S = 0.04 * inp.fuelSulfurPct;
  // Dust: 0.005 per g/Nm³ (masking + abrasion)
  const k_d_dust = 0.005 * inp.dustLoadGNm3;
  // Thermal acceleration above 400 °C
  const tempExcess = Math.max(0, inp.operatingTempC - 400);
  const k_d_temp = 0.03 * Math.exp(tempExcess / 50) - 0.03;

  const k_d = k_d_base + k_d_S + k_d_dust + k_d_temp;

  // K(t) = K₀ exp(−k_d t) ;  solve for t s.t. K/K₀ = f_min
  //   → t = −ln(f_min) / k_d
  const estimatedLifeYears =
    k_d > 0 ? -Math.log(inp.minActivityFraction) / k_d : Infinity;

  const kAtYears = [1, 2, 3, 5].map((y) => ({
    year: y,
    k: inp.k0 * Math.exp(-k_d * y),
  }));

  if (estimatedLifeYears < 2)
    notes.push(
      `예상 수명 ${estimatedLifeYears.toFixed(1)}년 (< 2년) — 피독 요인 재검토 필요.`,
    );
  else if (estimatedLifeYears > 8)
    notes.push(
      `예상 수명 ${estimatedLifeYears.toFixed(1)}년 — 여유 충분. 초기 투자 과설계 여부 확인.`,
    );

  if (inp.fuelSulfurPct > 2)
    notes.push(
      `연료 황분 ${inp.fuelSulfurPct} wt% — SO₃→NH₄HSO₄ 응축 위험, V₂O₅ 담지량 감소 또는 온도 상향 고려.`,
    );

  if (inp.dustLoadGNm3 > 20)
    notes.push(
      `분진 ${inp.dustLoadGNm3} g/Nm³ (≥20) — Plate 형식 전환 검토 권장.`,
    );

  if (inp.operatingTempC > 420)
    notes.push(
      `운전 온도 ${inp.operatingTempC} °C (>420°C) — 열적 열화 가속. NH₃ 산화 및 소결 위험.`,
    );

  return {
    deactivationRatePerYear: k_d,
    estimatedLifeYears,
    kAtYears,
    notes,
  };
}
