import Link from "next/link";

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <section className="mb-10">
        <div className="doc-subtitle mb-2">
          Selective Catalytic Reduction · 설계 계산
        </div>
        <h1 className="text-4xl font-bold tracking-tight mb-4 text-[var(--foreground)]">
          탈질촉매 설계 계산 · 설계 의뢰서 자동 작성
        </h1>
        <p className="text-lg text-[var(--muted)] max-w-3xl leading-relaxed">
          V₂O₅-WO₃/TiO₂ 기반 허니컴(Honeycomb)형 탈질촉매의 면속도(AV), 공간속도(SV),
          촉매량(V<sub>cat</sub>), 모듈수, NH₃ 주입율, 압력손실(ΔP)을 한 화면에서
          계산하고, 엔지니어링 표준 <strong>설계 의뢰서</strong>를 자동 작성합니다.
        </p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
        <div className="doc-card">
          <div className="doc-subtitle mb-1">① 입력</div>
          <p className="text-base leading-relaxed">
            배기가스 유량·온도·NOx 농도·목표 제거율·NH₃ slip·V₂O₅ 담지량 등
            설계 입력값을 표 형식으로 입력합니다.
          </p>
        </div>
        <div className="doc-card">
          <div className="doc-subtitle mb-1">② 계산</div>
          <p className="text-base leading-relaxed">
            1차 플러그 흐름 근사와 허니컴 기하 공식으로 AV·SV·LV·V
            <sub>cat</sub>·ΔP·α(NH₃/NOx) 등을 즉시 계산합니다.
          </p>
        </div>
        <div className="doc-card">
          <div className="doc-subtitle mb-1">③ 의뢰서 출력</div>
          <p className="text-base leading-relaxed">
            의뢰자 정보·설계 입력·계산 결과·설계 의견·승인란을 포함한 A4
            설계 의뢰서를 바로 인쇄·PDF 저장 할 수 있습니다.
          </p>
        </div>
      </section>

      <section className="doc-card bg-[var(--accent-soft)] border-[var(--accent)] mb-10">
        <div className="doc-subtitle text-[var(--accent)] mb-3">
          현 버전 지원 형식
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
          <div>
            <div className="font-semibold mb-1">Honeycomb</div>
            <div className="text-[var(--muted)]">
              V₂O₅-WO₃/TiO₂ · 정사각 셀 · 압출 성형
            </div>
            <span className="chip chip-ok mt-2 inline-block">지원</span>
          </div>
          <div>
            <div className="font-semibold mb-1">Plate</div>
            <div className="text-[var(--muted)]">판형 — 석탄화력 고분진용</div>
            <span className="chip chip-warn mt-2 inline-block">후속 개발</span>
          </div>
          <div>
            <div className="font-semibold mb-1">Corrugate</div>
            <div className="text-[var(--muted)]">섬유 강화기판형</div>
            <span className="chip chip-warn mt-2 inline-block">후속 개발</span>
          </div>
          <div>
            <div className="font-semibold mb-1">Marine / Diesel</div>
            <div className="text-[var(--muted)]">선박 · 디젤 엔진용 SCR</div>
            <span className="chip chip-warn mt-2 inline-block">후속 개발</span>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <Link
          href="/quick"
          className="doc-card hover:border-[var(--accent)] transition-colors"
        >
          <div className="doc-subtitle text-[var(--accent)] mb-1">
            ⚡ 대략 계산
          </div>
          <div className="font-bold text-lg mb-1">4 입력으로 빠른 추정</div>
          <div className="text-sm text-[var(--muted)] leading-relaxed">
            유량·온도·NOx·제거율 4가지만 넣으면 촉매 체적·모듈 수·NH₃ 주입율을
            즉시 계산. 세부 파라미터는 한국 발전소 표준값 사용.
          </div>
        </Link>
        <Link
          href="/calculator"
          className="doc-card hover:border-[var(--accent)] transition-colors bg-[var(--accent-soft)] border-[var(--accent)]"
        >
          <div className="doc-subtitle text-[var(--accent)] mb-1">
            🛠 세부 계산 · 그래프
          </div>
          <div className="font-bold text-lg mb-1">15+ 입력 · 설계 그래프</div>
          <div className="text-sm text-[var(--muted)] leading-relaxed">
            모든 설계 파라미터 조정 + 4종 그래프 (수명 K(t), η-AV, 온도창,
            ΔP-LV) + 촉매 수명/열화 예측 + 설계 의뢰서 연계.
          </div>
        </Link>
      </section>

      <section className="flex gap-4">
        <Link
          href="/calculator"
          className="inline-block bg-[var(--accent)] text-white font-semibold px-7 py-3 rounded-sm hover:opacity-90 transition-opacity"
        >
          세부 계산 시작 →
        </Link>
        <Link
          href="/about"
          className="inline-block border border-[var(--border-strong)] text-[var(--foreground)] font-semibold px-7 py-3 rounded-sm hover:bg-[var(--accent-soft)] transition-colors"
        >
          수식·참고문헌
        </Link>
      </section>
    </div>
  );
}
