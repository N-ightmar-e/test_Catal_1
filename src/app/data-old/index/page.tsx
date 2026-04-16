import Link from "next/link";

type Row = {
  field: string;
  ko: string;
  desc: string;
  unit: string;
  typical?: string;
  notes?: string;
};

const SEC1: Row[] = [
  { field: "projectName", ko: "프로젝트 이름", desc: "의뢰서에 기재되는 프로젝트 명칭", unit: "문자열" },
  { field: "designMode", ko: "설계 모드", desc: "1=DeNOx (NOx만), 2=DeDIOx (다이옥신만), 3=Both (통합)", unit: "-", typical: "1" },
  { field: "catType", ko: "촉매 타입", desc: "활성 금속 선택. 1=W (텅스텐 촉진), 2=Mo (몰리브덴 촉진)", unit: "-", typical: "2 (Mo)", notes: "W: 고온 안정성↑, Mo: 저온 활성↑" },
  { field: "flowRate", ko: "배기 유량", desc: "운전 조건(T, P)에서의 체적 유량 (실제 유량)", unit: "m³/h", typical: "500,000–2,000,000" },
  { field: "temperature", ko: "운전 온도", desc: "SCR 입구 배가스 온도", unit: "°C", typical: "320–400" },
  { field: "pressure", ko: "절대 압력", desc: "SCR 내부 절대압력 (대기압 ≈ 1013 hPa)", unit: "hPa", typical: "1000–1030" },
  { field: "humidity", ko: "습도", desc: "배가스 수분 함량 (부피 기준)", unit: "vol%", typical: "5–15" },
  { field: "o2Operating", ko: "O₂ 운전 농도", desc: "실제 운전 시 배가스 중 산소 농도", unit: "vol%", typical: "3–7" },
  { field: "o2Reference", ko: "O₂ 기준 농도", desc: "규제 기준 O₂ 농도 (한국 화력: 6% 또는 3%)", unit: "vol%", typical: "3 or 6" },
  { field: "designLife", ko: "설계 수명", desc: "촉매 교체까지 예상 운전 시간. kt/k0 계산 기준", unit: "h", typical: "24,000 (3년) – 40,000 (5년)" },
];

const SEC2: Row[] = [
  { field: "noxInlet", ko: "NOx 입구 농도", desc: "SCR 입구 NOx 농도 (건배가스, O₂_ref 기준)", unit: "mg/Nm³", typical: "200–1500" },
  { field: "noxReduction", ko: "NOx 제거 목표", desc: "η target — 원하는 NOx 저감율", unit: "%", typical: "70–95" },
  { field: "nh3Slip", ko: "NH₃ slip 허용치", desc: "출구 미반응 NH₃ 최대 허용 농도", unit: "mg/Nm³", typical: "2–10" },
  { field: "no2Fraction", ko: "NO₂ 비율", desc: "전체 NOx 중 NO₂ 분율 (나머지는 NO). Fast-SCR에 영향", unit: "%", typical: "5–15" },
  { field: "so2Inlet", ko: "SO₂ 입구", desc: "연료 황분 및 연소 조건으로 형성된 SO₂", unit: "mg/Nm³", typical: "50–2000 (석탄)" },
  { field: "so3Inlet", ko: "SO₃ 입구", desc: "이미 생성된 SO₃ (통상 SO₂의 1–3%)", unit: "mg/Nm³", typical: "1–30" },
];

const SEC3: Row[] = [
  { field: "v2o5Content", ko: "V₂O₅ 담지량", desc: "TiO₂ 지지체 위 V₂O₅ 질량 담지율. 활성↑ 하지만 SO₂→SO₃ 변환율도 ↑", unit: "wt%", typical: "0.3–1.5" },
  { field: "plateThick", ko: "판 두께", desc: "Plate-type 촉매의 실제 판 두께 (한 장)", unit: "mm", typical: "0.5–1.0" },
  { field: "plateHtOpt", ko: "판 높이 (선택)", desc: "모듈 내 판의 세로 길이 (flow 방향). 6단계 선택: 0.45/0.50/0.55/0.57/0.60/0.625 m", unit: "m", typical: "0.50" },
  { field: "specificArea", ko: "기하 표면적 밀도", desc: "단위 체적당 촉매 표면적. Plate는 Honeycomb보다 통상 낮음", unit: "m²/m³", typical: "400–700" },
  { field: "notches", ko: "노치 수", desc: "판 위에 형성된 스페이서 노치 개수 — 판 간격 결정", unit: "#", typical: "3–5" },
  { field: "gasVelocity", ko: "접근 가스 유속", desc: "모듈 정면 접근 속도. 채널 내 속도와 구분됨", unit: "m/s", typical: "3–6" },
  { field: "safetyNox", ko: "NOx 안전 계수", desc: "촉매량에 곱해지는 여유 계수. V_design = V_required × safetyNox / ktk0", unit: "-", typical: "1.1–1.3" },
  { field: "ktk0", ko: "활성도 비 kt/k0", desc: "수명 말기 활성 / 초기 활성. 1.0=신촉매, 0.6=수명 말", unit: "-", typical: "0.7–0.9" },
];

const SEC4: Row[] = [
  { field: "elemPerLen", ko: "요소 수 (길이)", desc: "모듈당 flow 방향 요소 개수", unit: "#", typical: "3–6" },
  { field: "elemPerWid", ko: "요소 수 (폭)", desc: "모듈당 폭 방향 요소 개수", unit: "#", typical: "1–4" },
  { field: "numLayers", ko: "층수", desc: "반응기 내 촉매 층 수. 통상 2–5, 1층 spare", unit: "#", typical: "3–5" },
  { field: "modWidth", ko: "모듈 폭 (개수)", desc: "반응기 단면 폭 방향 모듈 개수", unit: "#", typical: "2–4" },
  { field: "modDepth", ko: "모듈 깊이 (개수)", desc: "반응기 단면 깊이 방향 모듈 개수", unit: "#", typical: "20–60" },
];

const OUT1: Row[] = [
  { field: "kMat", ko: "재료 활성 상수", desc: "Arrhenius 기반 반응 속도 (V₂O₅·T·catType 의존)", unit: "m/h", notes: "kinetic 제어 항" },
  { field: "kStr", ko: "구조 활성 상수", desc: "Sherwood 수 × NO 확산율 / 수력직경 (질량 전달 항)", unit: "m/h", notes: "mass-transfer 제어 항" },
  { field: "kOverall", ko: "종합 활성도 K", desc: "직렬 저항 조합: 1/K = 1/kMat + 1/kStr", unit: "m/h", notes: "설계 기준 K" },
  { field: "reynolds", ko: "레이놀즈 수", desc: "Re = ρ·v·d_h / μ  (채널 내 유동 양상 판별)", unit: "-", typical: "<2300 층류, >4000 난류" },
  { field: "isLaminar / flowRegime", ko: "유동 양상", desc: "Re에 따른 층류·전이·난류 분류", unit: "-" },
];

const OUT2: Row[] = [
  { field: "etaTarget", ko: "유효 제거율 η_eff", desc: "η_target + slip 보정 (slip 허용치 반영)", unit: "-" },
  { field: "avRequired", ko: "필요 면속도 AV", desc: "AV = K / (−ln(1 − η_eff))", unit: "m/h", typical: "15–45" },
  { field: "volumeRequired", ko: "최소 촉매 체적", desc: "V_req = Q / (AV · a_v). 여유 없는 계산값", unit: "m³" },
  { field: "volumeDesign", ko: "설계 촉매 체적", desc: "V_des = V_req × safetyNox / ktk0. 실제 발주 기준", unit: "m³", notes: "핵심 설계 결과" },
  { field: "volumeDiox", ko: "DeDIOx 병렬 체적", desc: "designMode=3 (Both)일 때만 산출. 다이옥신 촉매층 추가 체적", unit: "m³" },
];

const OUT3: Row[] = [
  { field: "dpPerLayer", ko: "층당 압력손실", desc: "한 층의 ΔP (층류: Hagen–Poiseuille, 난류: Blasius)", unit: "mbar" },
  { field: "dpProtGrid", ko: "보호 grating ΔP", desc: "분진·열응력 보호 grating에 의한 추가 ΔP", unit: "mbar" },
  { field: "dpDesign", ko: "전체 설계 ΔP", desc: "N_layers × ΔP_layer + ΔP_grid", unit: "mbar / mmH₂O", typical: "5–20 mbar" },
];

const OUT4: Row[] = [
  { field: "convRate", ko: "SO₂→SO₃ 전환율", desc: "0.6 × V₂O₅[wt%] × exp((T−380)/50). V₂O₅ 담지 감소시 저감", unit: "%", typical: "<1.0" },
  { field: "convRateSF", ko: "SO₂→SO₃ 안전값", desc: "convRate × safetyNox (보수적 추정)", unit: "%" },
  { field: "so3Outlet", ko: "SO₃ 출구", desc: "전환된 SO₃ + 기존 SO₃_in", unit: "mg/Nm³", notes: "NH₄HSO₄ 응축 risk 지표" },
  { field: "noxOutlet", ko: "NOx 출구", desc: "NOx_in × (1 − η)", unit: "mg/Nm³" },
  { field: "nh3Demand", ko: "NH₃ 주입량", desc: "α · Ṅ_NOx · 17.03 / 1000", unit: "kg/h" },
  { field: "alpha", ko: "α = NH₃/NOx 몰비", desc: "η + slip/NOx_in. 통상 0.8–1.05", unit: "-" },
];

function Section({ title, rows }: { title: string; rows: Row[] }) {
  return (
    <div className="doc-card mb-6">
      <div className="doc-title">{title}</div>
      <table className="data-table">
        <thead>
          <tr>
            <th style={{ width: "20%" }}>필드명</th>
            <th style={{ width: "18%" }}>한글 설명</th>
            <th>의미 / 식</th>
            <th style={{ width: "10%" }}>단위</th>
            <th style={{ width: "14%" }}>통상 범위</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.field}>
              <td className="font-mono text-xs">{r.field}</td>
              <td className="font-medium">{r.ko}</td>
              <td className="text-[13px] leading-relaxed">
                {r.desc}
                {r.notes && (
                  <div className="text-[11px] text-[var(--muted)] mt-1">
                    ※ {r.notes}
                  </div>
                )}
              </td>
              <td className="font-mono text-xs">{r.unit}</td>
              <td className="text-xs text-[var(--muted)]">{r.typical ?? "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function DataOldIndexPage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="flex items-baseline justify-between flex-wrap gap-4 mb-6">
        <div>
          <div className="doc-subtitle">Data_old · 파라미터 인덱스</div>
          <h1 className="text-3xl font-bold tracking-tight">NCB_B2 입력·출력 전체 용어집</h1>
        </div>
        <Link
          href="/data-old"
          className="bg-[var(--accent)] text-white font-semibold px-5 py-2 rounded-sm hover:opacity-90"
        >
          계산 페이지 →
        </Link>
      </div>

      <div className="doc-card bg-[var(--accent-soft)] border-[var(--accent)] mb-8">
        <p className="text-sm leading-relaxed">
          <strong>출처:</strong> NCB_B2 v1.0.1 Desktop (Wails/Go, 2026-01 빌드)
          바이너리에서 추출한 프론트엔드 UI 스키마와 Go struct 태그. 계산 엔진은
          동일한 입력/출력 계약을 유지하되, 내부 공식은 표준 plate-type SCR 물리
          (Arrhenius + Sherwood + Hagen–Poiseuille + Blasius)로 재구성했습니다.
          NCB_B2 원본 내부 계수는 비공개이므로 절대치는 ±15–30% 차이가 가능합니다.
        </p>
      </div>

      <h2 className="text-xl font-bold mb-4 text-[var(--accent)]">■ 입력 (31 필드)</h2>
      <Section title="① 프로젝트 / 연소 가스 (10 필드)" rows={SEC1} />
      <Section title="② NOx / SOx (6 필드)" rows={SEC2} />
      <Section title="③ 촉매 (8 필드)" rows={SEC3} />
      <Section title="④ 모듈 / 반응기 (5 필드)" rows={SEC4} />

      <h2 className="text-xl font-bold mt-10 mb-4 text-[var(--accent)]">■ 출력 (재구성 결과)</h2>
      <Section title="A. 활성 / 유동" rows={OUT1} />
      <Section title="B. 촉매 용적" rows={OUT2} />
      <Section title="C. 압력손실" rows={OUT3} />
      <Section title="D. NOx / SOx 화학" rows={OUT4} />

      <div className="doc-card mt-8">
        <div className="doc-title">주요 계산 식 요약</div>
        <pre className="bg-[var(--accent-soft)] p-4 rounded-sm font-mono text-[13px] leading-relaxed overflow-x-auto">
{`1. 활성도 (series resistance):
   kMat = A · exp(−Ea/RT) · (V2O5/0.45)^0.6         [A=1.1e6(W) or 1.5e6(Mo), Ea=65 or 55 kJ/mol]
   kStr = Sh · D_NO(T,P) / d_h × 3600               [Sh=7.54 laminar, Dittus-Boelter 난류]
   K    = (1/kMat + 1/kStr)^−1

2. 반응기 크기:
   η_eff = η + NH3_slip/NOx_in                       (slip 허용치 반영)
   AV    = K / (−ln(1 − η_eff))
   V_req = Q / (AV · a_v)
   V_des = V_req × safetyNox / ktk0

3. 압력손실:
   Laminar  :  ΔP = 32 μ L v / d_h²
   Turbulent:  ΔP = 0.5 ρ v² · (f L/d_h),  f = 0.316/Re^0.25

4. SO₂ → SO₃:
   X_SO2  ≈  0.6 × V2O5[wt%] × exp((T − 380)/50)    [%]

5. NH₃ 주입:
   α        = η + slip/NOx_in
   Ṅ_NOx    = Q_N [Nm³/h] × NOx_ppm × 10⁻⁶ / 22.414e-3  [mol/h]
   ṁ_NH3    = α · Ṅ_NOx · 17.03 / 1000                  [kg/h]`}
        </pre>
      </div>

      <div className="doc-card bg-[var(--accent-soft)] mt-6">
        <div className="doc-subtitle text-[var(--accent)] mb-2">면책</div>
        <p className="text-sm leading-relaxed">
          본 Data_old 모드는 NCB_B2의 UI 계약을 그대로 유지한 <strong>재구성
          계산 엔진</strong>입니다. 절대치는 NCB_B2 원본과 차이가 날 수 있으며,
          상대 경향(V₂O₅ ↑ ⇒ K ↑, ktk0 ↓ ⇒ V_design ↑ 등)은 같은 방향을 유지합니다.
          실제 발주 전에는 NCB_B2 원본 프로그램과 수치 비교 후 계수 보정을
          권장합니다.
        </p>
      </div>
    </div>
  );
}
