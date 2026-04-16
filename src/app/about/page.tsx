export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="doc-subtitle mb-2">Formulas & References</div>
      <h1 className="text-3xl font-bold tracking-tight mb-8">
        수식 유도 · 참고문헌
      </h1>

      <section className="doc-card mb-6">
        <div className="doc-title">1. 1차 플러그흐름 NOx 제거 모델</div>
        <p className="leading-relaxed mb-3">
          V₂O₅-WO₃/TiO₂ SCR 반응은 NOx에 대해 1차 반응으로 근사되며, 플러그 흐름
          조건에서 다음과 같이 표현됩니다:
        </p>
        <pre className="bg-[var(--accent-soft)] p-4 rounded-sm font-mono text-sm leading-relaxed overflow-x-auto">
{`  η = 1 − exp(−K / AV)

  여기서
    η   = NOx 제거율 (fractional)
    K   = 촉매 활성도 [m/h]  (신촉매: 25–40)
    AV  = 면속도 (area velocity) [m/h]

  따라서:
    AV  = K / (−ln(1 − η_eff))
    η_eff = η + (NH₃_slip / NOx_in)·(1 − η)`}
        </pre>
      </section>

      <section className="doc-card mb-6">
        <div className="doc-title">2. NH₃/NOx 몰비 α 및 주입율</div>
        <pre className="bg-[var(--accent-soft)] p-4 rounded-sm font-mono text-sm leading-relaxed overflow-x-auto">
{`  α = η + (NH₃_slip / NOx_in)        (통상 0.80 – 1.05)

  Ṅ_NOx [mol/h] = Q_N [Nm³/h] × 1000/22.414 × (NOx_ppm × 10⁻⁶)
  ṁ_NH₃ [kg/h]  = α × Ṅ_NOx × M_NH₃(17.031) / 1000`}
        </pre>
      </section>

      <section className="doc-card mb-6">
        <div className="doc-title">3. 허니컴 정사각 채널 기하</div>
        <pre className="bg-[var(--accent-soft)] p-4 rounded-sm font-mono text-sm leading-relaxed overflow-x-auto">
{`  a      = pitch − wall_thickness        [m]  (open cell side)
  OFA    = (a / p)²                             (open frontal area)
  d_h    = a                                   (hydraulic diameter, 정사각)
  a_v    = 4·a / p²                     [m²/m³] (기하 표면적 밀도)
  CPSI   = 1 / (p[inch])²                       (cells per in²)

  A_geo  = Q_actual / AV                [m²]
  V_cat  = A_geo / a_v                  [m³]
  SV     = Q_actual / V_cat             [h⁻¹]`}
        </pre>
      </section>

      <section className="doc-card mb-6">
        <div className="doc-title">4. 압력손실 (층류, 정사각 채널)</div>
        <pre className="bg-[var(--accent-soft)] p-4 rounded-sm font-mono text-sm leading-relaxed overflow-x-auto">
{`  ΔP  ≈  (32 · μ · L · v_ch) / (d_h²)  / 0.89
  μ(T) ≈ 3.0×10⁻⁵ · (T / 623.15)^0.7     [Pa·s]

  여기서
    L      = 촉매 총 길이      [m]
    v_ch   = LV / OFA          [m/s]  (채널 내부 실속도)
    0.89   = 정사각 → 원형 보정계수`}
        </pre>
      </section>

      <section className="doc-card mb-6">
        <div className="doc-title">5. SO₂→SO₃ 변환율 (경험식)</div>
        <pre className="bg-[var(--accent-soft)] p-4 rounded-sm font-mono text-sm leading-relaxed overflow-x-auto">
{`  X_SO₂  ≈  0.6 × V₂O₅[wt%] × exp( (T − 380) / 50 )   [%]

  주의: 정확한 값은 제조업체별 실측·시험으로 확정 필요.`}
        </pre>
      </section>

      <section className="doc-card mb-6">
        <div className="doc-title">참고문헌</div>
        <ol className="list-decimal pl-6 space-y-2 text-[15px] leading-relaxed">
          <li>
            Park, S.-S. <i>et al.</i>, &quot;Reduced graphene oxide supported V₂O₅-WO₃-TiO₂
            catalysts for selective catalytic reduction of NOx,&quot; <i>Korean Journal of
            Chemical Engineering</i>, 2018.
          </li>
          <li>
            Qu, Q. et al., &quot;Recent trends in vanadium-based SCR catalysts for NOx
            reduction in industrial applications: stationary sources,&quot; <i>Nano
            Convergence</i>, 9:42 (2022). doi:10.1186/s40580-022-00341-7
          </li>
          <li>
            Park, S. &amp; Lee, G., &quot;Current Catalyst Technology of Selective
            Catalytic Reduction (SCR) for NOx Removal in South Korea,&quot;{" "}
            <i>Catalysts</i> 10(1), 52 (2020). MDPI.
          </li>
          <li>
            U.S. EPA, <i>SCR Cost Manual, Chapter 2</i>, 7th ed. (2016, rev. 2017).
          </li>
          <li>
            한국학술지 (KISTI ScienceON) JAKO201621650491377 — &quot;SCR 촉매의 공간속도
            및 선속도가 NOx 제거 효율에 미치는 영향&quot;
          </li>
          <li>
            대한민국 특허 KR101426601B1 — &quot;이산화황 내구성이 높은 탈질촉매와 그
            제조방법&quot;
          </li>
        </ol>
      </section>

      <section className="doc-card bg-[var(--accent-soft)]">
        <div className="doc-subtitle text-[var(--accent)] mb-2">면책</div>
        <p className="text-sm leading-relaxed">
          본 도구는 박삼식 박사님(주식회사 나노 연구소장)의 설계 참고용으로
          제작된 계산기입니다. 모든 계산은 문헌 기반 1차 근사이며, 실제 상용
          설계 시 피독·열화·분진·SO₃ 응축·NH₄HSO₄ 플러깅·모듈 조립 공차 등
          현장 조건을 고려한 현업 검토가 필수입니다.
        </p>
      </section>
    </div>
  );
}
