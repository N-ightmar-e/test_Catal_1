import Link from "next/link";

type MethodRow = {
  name: string;
  status: "지원" | "후속 개발";
  description: string;
  strengths: string[];
  weaknesses: string[];
  typicalUse: string[];
  pitchRange: string;
  dpBudget: string;
  typicalAV: string;
  ref?: string;
};

const methods: MethodRow[] = [
  {
    name: "Honeycomb (V₂O₅-WO₃/TiO₂ 압출)",
    status: "지원",
    description:
      "TiO₂ 기반에 V₂O₅(0.5–1.5 wt%) / WO₃(5–10 wt%)를 담지한 정사각 벌집 구조. 한국·일본·유럽 발전소 표준. NANO NH-시리즈도 이 형식.",
    strengths: [
      "낮은 압력손실 (ΔP 50–200 mmH₂O)",
      "높은 기하 표면적 밀도 (a_v 400–800 m²/m³)",
      "분진 견딤성 적당 (CPSI 7–25)",
      "압출 성형으로 대량 생산 용이",
    ],
    weaknesses: [
      "고분진(>10 g/Nm³) 환경에서 플러깅 위험",
      "모듈 교체시 벌집 파손 주의",
      "pitch가 너무 작으면 재 축적",
    ],
    typicalUse: [
      "석탄·중유·가스 화력발전소",
      "산업용 보일러",
      "소각로 후단 SCR",
    ],
    pitchRange: "3.5 – 8.5 mm",
    dpBudget: "50 – 200 mmH₂O",
    typicalAV: "25 – 45 m/h (K, η에 따라)",
    ref: "Park S.-S. et al., KJChE (2018)",
  },
  {
    name: "Plate (판형, TiO₂ 코팅 스틸메쉬)",
    status: "후속 개발",
    description:
      "스틸 메쉬에 V-Ti 촉매를 코팅한 판상형. 병렬 판들이 수직으로 배열되며 분진이 그대로 통과함.",
    strengths: [
      "고분진 환경에 최적 (석탄 화력, 소결로)",
      "재 축적 최소",
      "열충격·기계적 안정성 우수",
    ],
    weaknesses: [
      "체적당 표면적이 Honeycomb 대비 ~60%",
      "압력손실은 낮지만 촉매 체적 커야 함",
      "코팅층 박리 가능성",
    ],
    typicalUse: [
      "석탄화력 고분진 환경",
      "시멘트·제철 소결 배출",
    ],
    pitchRange: "5 – 10 mm",
    dpBudget: "30 – 150 mmH₂O",
    typicalAV: "15 – 30 m/h",
  },
  {
    name: "Corrugate (섬유강화 주름형)",
    status: "후속 개발",
    description:
      "글라스 섬유 웅자를 Ti-V 촉매로 함침한 주름진 기판. 가볍고 기계적 충격에 강함.",
    strengths: [
      "경량 (Honeycomb 대비 ~50%)",
      "기계·진동 충격 우수 → 선박·이동형",
      "제조 공정 단순",
    ],
    weaknesses: [
      "표면적 밀도 가장 낮음",
      "고온 장기 운전시 섬유 열화",
      "SO₃ 피독 대응 제한",
    ],
    typicalUse: [
      "선박용 SCR (IMO Tier III)",
      "LNG/디젤 엔진 후단",
      "이동형 가스터빈",
    ],
    pitchRange: "6 – 12 mm",
    dpBudget: "40 – 180 mmH₂O",
    typicalAV: "12 – 25 m/h",
  },
  {
    name: "Marine / Engine SCR (Honeycomb 변형)",
    status: "후속 개발",
    description:
      "선박·디젤 엔진용으로 개질된 Honeycomb. 저온(200–350°C) 활성 강화, 황분 내성 특화.",
    strengths: [
      "저온 활성 (200–300°C) 유지",
      "고황 연료(S > 1%) 대응",
      "저 NH₃ slip 요구 만족 (<5 ppm)",
    ],
    weaknesses: [
      "상시 변동 부하에 민감",
      "Urea→NH₃ 변환 모듈 필요",
      "연료·황분 변화에 따른 재생 잦음",
    ],
    typicalUse: [
      "대형 선박 엔진 (2-stroke, 4-stroke)",
      "오프로드 디젤",
      "비상 발전기",
    ],
    pitchRange: "4 – 6 mm",
    dpBudget: "100 – 250 mmH₂O",
    typicalAV: "20 – 40 m/h",
  },
];

export default function MethodsPage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="doc-subtitle mb-2">Design Methods · 설계 방식 비교</div>
      <h1 className="text-3xl font-bold tracking-tight mb-3">
        탈질촉매 설계 방식 4종 비교
      </h1>
      <p className="text-[var(--muted)] max-w-3xl mb-8 leading-relaxed">
        SCR 탈질촉매는 설치 환경·분진·온도·황분 조건에 따라 4가지 주요 형식으로
        설계됩니다. 현 버전은{" "}
        <strong className="text-[var(--accent)]">Honeycomb</strong>만
        계산기를 제공하며, 나머지 3종은 설계 특성만 비교 목적으로 정리되어
        있습니다.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {methods.map((m) => (
          <div
            key={m.name}
            className={`doc-card ${
              m.status === "지원"
                ? "border-[var(--accent)] bg-[var(--accent-soft)]"
                : ""
            }`}
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <h2 className="font-bold text-lg leading-tight">{m.name}</h2>
              <span
                className={`chip ${
                  m.status === "지원" ? "chip-ok" : "chip-warn"
                } shrink-0`}
              >
                {m.status}
              </span>
            </div>
            <p className="text-sm leading-relaxed mb-3 text-[var(--foreground)]">
              {m.description}
            </p>

            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[13px] border-t border-[var(--border)] pt-3 mb-3">
              <div className="text-[var(--muted)]">Pitch 범위</div>
              <div className="font-mono">{m.pitchRange}</div>
              <div className="text-[var(--muted)]">ΔP 예산</div>
              <div className="font-mono">{m.dpBudget}</div>
              <div className="text-[var(--muted)]">통상 AV</div>
              <div className="font-mono">{m.typicalAV}</div>
            </div>

            <div className="grid grid-cols-2 gap-x-4 text-[13px] leading-relaxed">
              <div>
                <div className="font-semibold text-[var(--ok)] mb-1">강점</div>
                <ul className="list-disc pl-5 space-y-0.5">
                  {m.strengths.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="font-semibold text-[var(--warning)] mb-1">
                  약점
                </div>
                <ul className="list-disc pl-5 space-y-0.5">
                  {m.weaknesses.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-[var(--border)] text-[13px]">
              <div className="text-[var(--muted)] mb-1">주요 적용처</div>
              <div className="flex flex-wrap gap-1.5">
                {m.typicalUse.map((u) => (
                  <span
                    key={u}
                    className="inline-block bg-white border border-[var(--border)] rounded-sm px-2 py-0.5 text-[12px]"
                  >
                    {u}
                  </span>
                ))}
              </div>
            </div>

            {m.ref && (
              <div className="mt-3 text-[11px] text-[var(--muted)]">
                ref. {m.ref}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="doc-card mb-8">
        <div className="doc-title">선택 가이드</div>
        <table className="data-table">
          <thead>
            <tr>
              <th>환경 조건</th>
              <th>권장 형식</th>
              <th>주의</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>저~중분진 (≤10 g/Nm³), 300–400 °C</td>
              <td>
                <strong>Honeycomb</strong>
              </td>
              <td>V₂O₅ 담지량 1 wt% 이하 유지 → SO₂→SO₃ 억제</td>
            </tr>
            <tr>
              <td>고분진 (&gt;10 g/Nm³), 석탄·소결</td>
              <td>
                <strong>Plate</strong>
              </td>
              <td>체적 커지므로 공간 확보 필요</td>
            </tr>
            <tr>
              <td>경량·진동 환경 (선박·이동형)</td>
              <td>
                <strong>Corrugate</strong>
              </td>
              <td>고온 장기 운전은 피할 것</td>
            </tr>
            <tr>
              <td>고황·저온 엔진 배출</td>
              <td>
                <strong>Marine SCR</strong>
              </td>
              <td>Urea 변환·재생 설비 병행 설계 필수</td>
            </tr>
          </tbody>
        </table>
      </div>

      <section className="flex gap-4">
        <Link
          href="/calculator"
          className="inline-block bg-[var(--accent)] text-white font-semibold px-6 py-2.5 rounded-sm hover:opacity-90"
        >
          Honeycomb 계산 →
        </Link>
        <Link
          href="/about"
          className="inline-block border border-[var(--border-strong)] text-[var(--foreground)] font-semibold px-6 py-2.5 rounded-sm hover:bg-[var(--accent-soft)]"
        >
          수식·참고문헌
        </Link>
      </section>
    </div>
  );
}
