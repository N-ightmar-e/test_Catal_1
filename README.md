# SCR-CALC · 탈질촉매 설계 계산기

V₂O₅-WO₃/TiO₂ 허니컴형 (그리고 Plate-type) SCR 촉매 설계 · 계산 · 설계 의뢰서 자동 작성을 위한 Next.js 웹 앱.

라이브: **https://n-ightmar-e.github.io/test_Catal_1/**

---

## 주요 경로

| Route | 설명 |
|---|---|
| `/` | 랜딩 — 지원 형식 4종, 빠른 진입 카드 |
| `/quick` | ⚡ 대략 계산 — 4입력(유량·온도·NOx·η) 즉시 추정 |
| `/calculator` | 🛠 세부 계산 — 15+ 입력 + 4종 설계 그래프 |
| `/data-old` | Data_old — NCB_B2 v1.0.1 호환 Plate-type SCR 31입력 |
| `/data-old/index` | NCB_B2 파라미터 전체 용어집 (31 입력 + 출력) |
| `/methods` | 설계 방식 비교 (Honeycomb/Plate/Corrugate/Marine) |
| `/report` | A4 설계 의뢰서 (인쇄·PDF) — 수명 예측 포함 |
| `/about` | 수식 유도 · 참고문헌 |

### 설계 그래프 4종 (/calculator)
- **K(t) 열화 곡선** — 수명 예측, 황분·분진·온도 의존
- **η vs AV** — K별 NOx 제거율 곡선, 현재 설계점 마킹
- **온도-활성 창** — 최적 300–400 °C + SO₂→SO₃ 곡선 이중축
- **ΔP vs LV** — 압력손실 예산 범위 비교

### 계산 엔진 (Honeycomb)
```
η     = 1 − exp(−K / AV)
AV    = K / (−ln(1 − η_eff))
V_cat = (Q_actual / AV) / a_v,   a_v = 4·a / p²
ΔP    ≈ 32·μ·L·v_ch / d_h² / 0.89   (정사각 채널 layer laminar)
```

### Data_old 모드 (Plate-type, NCB_B2 호환)
- `K = (1/kMat + 1/kStr)⁻¹` (직렬 저항)
- kMat: Arrhenius + V₂O₅ 담지 의존 + catType (W/Mo) 보정
- kStr: Sherwood · D_NO / d_h (laminar 7.54, 난류 Dittus-Boelter)
- ΔP: Hagen-Poiseuille(층류) / Blasius(난류)
- V_design = V_required × safetyNox / ktk0

---

## Stack

- Next.js 16 (app router, **static export**)
- React 19, TypeScript 5
- Tailwind CSS v4
- Recharts 3 (차트 4종)
- Vitest 4 (**24 테스트**)

---

## 개발

```bash
npm install
npm run dev           # http://localhost:3000
npm test              # 24/24 통과
npm run build         # out/ 정적 사이트
```

## 배포 (GitHub Pages)

`main` 브랜치 push 시 `.github/workflows/deploy.yml`가 자동 실행:
1. `npm ci` → `npm test` → `npm run build`
2. `out/` 을 Pages artifact 업로드
3. `https://n-ightmar-e.github.io/test_Catal_1/` 에 배포

`basePath: '/test_Catal_1'` 은 `GITHUB_ACTIONS=true` 일 때만 적용 — 로컬은 `/`.

---

## 면책

본 도구는 참고용 1차 추정 계산기입니다. 실제 상용 설계는 피독·열화·분진·SO₃ 응축·NH₄HSO₄ 플러깅·모듈 조립 공차 등 현장 조건 반영한 현업 검토가 필요합니다. Data_old 모드는 NCB_B2 UI 계약만 동일하며, 내부 계수는 표준 plate-SCR 물리로 재구성된 것이라 원본과 ±15–30% 차이 가능합니다.

## Reference

- Park, S.-S. et al., *Korean J. Chem. Eng.* (2018) — rGO V₂O₅-WO₃-TiO₂ SCR
- Qu et al., *Nano Convergence* 9:42 (2022) — Vanadium SCR review
- Park, S. & Lee, G., *Catalysts* 10(1):52 (2020) — SCR in South Korea
- EPA *SCR Cost Manual* Ch.2 (2016 rev 2017)
- KISTI JAKO201621650491377 — SV/LV의 NOx 제거 효율 영향
