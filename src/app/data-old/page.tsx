"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { computeDataOld } from "@/lib/scr/data-old";
import {
  DEFAULT_DATA_OLD_INPUTS,
  type DataOldInputs,
} from "@/types/data-old";

function num(v: number, d = 4): string {
  if (!Number.isFinite(v)) return "—";
  if (v === 0) return "0";
  const abs = Math.abs(v);
  if (abs >= 1e5 || abs < 1e-4) return v.toExponential(3);
  return v.toLocaleString("ko-KR", { maximumSignificantDigits: d });
}

export default function DataOldPage() {
  const [inp, setInp] = useState<DataOldInputs>(DEFAULT_DATA_OLD_INPUTS);
  const res = useMemo(() => computeDataOld(inp), [inp]);

  function update<K extends keyof DataOldInputs>(k: K, v: DataOldInputs[K]) {
    setInp((p) => ({ ...p, [k]: v }));
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="flex justify-between items-end mb-6 flex-wrap gap-4">
        <div>
          <div className="doc-subtitle">Data_old · NCB_B2 호환 모드</div>
          <h1 className="text-2xl font-bold tracking-tight">
            Plate-type SCR · 31입력 전체 계산
          </h1>
          <p className="text-sm text-[var(--muted)] mt-1 max-w-3xl">
            NCB_B2 v1.0.1 Desktop (Wails/Go) 프로그램의 입력·출력 계약을 그대로
            재현합니다. 계산 로직은 표준 plate-type SCR 물리(kMat·kStr 직렬저항
            + Sherwood 질량전달 + Arrhenius 반응 + Blasius 압력손실)으로 재구성.
            상수·계수는 NCB_B2 내부값과 다를 수 있으므로 결과는 <strong>1차
            추정</strong>으로 활용하세요.
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/data-old/index"
            className="border border-[var(--border-strong)] px-4 py-2 text-sm rounded-sm hover:bg-[var(--accent-soft)]"
          >
            📖 파라미터 인덱스
          </Link>
          <button
            onClick={() => setInp(DEFAULT_DATA_OLD_INPUTS)}
            className="border border-[var(--border-strong)] px-4 py-2 text-sm rounded-sm hover:bg-[var(--accent-soft)]"
          >
            기본값
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ========= INPUTS (4 sections, NCB_B2 layout) ========= */}
        <div className="space-y-4">
          {/* Section 1: 프로젝트 / 연소가스 */}
          <div className="doc-card">
            <div className="doc-title">① 프로젝트 / 연소 가스</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <TextField label="이름 (name)" value={inp.projectName} onChange={(v) => update("projectName", v)} />
              <SelectField
                label="모드 (mode)"
                value={inp.designMode}
                onChange={(v) => update("designMode", Number(v) as 1 | 2 | 3)}
                options={[
                  { v: 1, l: "1 · DeNOx" },
                  { v: 2, l: "2 · DeDIOx" },
                  { v: 3, l: "3 · Both" },
                ]}
              />
              <SelectField
                label="촉매 (cat)"
                value={inp.catType}
                onChange={(v) => update("catType", Number(v) as 1 | 2)}
                options={[
                  { v: 1, l: "W" },
                  { v: 2, l: "Mo" },
                ]}
              />
              <NumField label="유량" unit="m³/h" value={inp.flowRate} onChange={(v) => update("flowRate", v)} step={1000} />
              <NumField label="온도" unit="°C" value={inp.temperature} onChange={(v) => update("temperature", v)} step={5} />
              <NumField label="압력" unit="hPa" value={inp.pressure} onChange={(v) => update("pressure", v)} step={1} />
              <NumField label="습도" unit="%" value={inp.humidity} onChange={(v) => update("humidity", v)} step={0.5} />
              <NumField label="O₂ 운전" unit="%" value={inp.o2Operating} onChange={(v) => update("o2Operating", v)} step={0.1} />
              <NumField label="O₂ 기준" unit="%" value={inp.o2Reference} onChange={(v) => update("o2Reference", v)} step={0.1} />
              <NumField label="수명" unit="h" value={inp.designLife} onChange={(v) => update("designLife", v)} step={1000} />
            </div>
          </div>

          {/* Section 2: NOx / SOx */}
          <div className="doc-card">
            <div className="doc-title">② NOx / SOx</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <NumField label="NOx 입구" unit="mg/Nm³" value={inp.noxInlet} onChange={(v) => update("noxInlet", v)} step={10} />
              <NumField label="저감율" unit="%" value={inp.noxReduction} onChange={(v) => update("noxReduction", v)} step={1} />
              <NumField label="NH₃ slip" unit="mg/Nm³" value={inp.nh3Slip} onChange={(v) => update("nh3Slip", v)} step={0.5} />
              <NumField label="NO₂ 비율" unit="%" value={inp.no2Fraction} onChange={(v) => update("no2Fraction", v)} step={1} />
              <NumField label="SO₂ 입구" unit="mg/Nm³" value={inp.so2Inlet} onChange={(v) => update("so2Inlet", v)} step={10} />
              <NumField label="SO₃ 입구" unit="mg/Nm³" value={inp.so3Inlet} onChange={(v) => update("so3Inlet", v)} step={1} />
            </div>
          </div>

          {/* Section 3: 촉매 */}
          <div className="doc-card">
            <div className="doc-title">③ 촉매</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <NumField label="V₂O₅" unit="wt%" value={inp.v2o5Content} onChange={(v) => update("v2o5Content", v)} step={0.05} />
              <NumField label="두께" unit="mm" value={inp.plateThick} onChange={(v) => update("plateThick", v)} step={0.1} />
              <SelectField
                label="높이"
                value={inp.plateHtOpt}
                onChange={(v) => update("plateHtOpt", Number(v) as 1 | 2 | 3 | 4 | 5 | 6)}
                options={[
                  { v: 1, l: "0.450" },
                  { v: 2, l: "0.500" },
                  { v: 3, l: "0.550" },
                  { v: 4, l: "0.570" },
                  { v: 5, l: "0.600" },
                  { v: 6, l: "0.625" },
                ]}
                unit="m"
              />
              <NumField label="면적" unit="m²/m³" value={inp.specificArea} onChange={(v) => update("specificArea", v)} step={10} />
              <NumField label="노치" unit="#" value={inp.notches} onChange={(v) => update("notches", v)} step={1} />
              <NumField label="유속" unit="m/s" value={inp.gasVelocity} onChange={(v) => update("gasVelocity", v)} step={0.1} />
              <NumField label="안전(NOx)" unit="-" value={inp.safetyNox} onChange={(v) => update("safetyNox", v)} step={0.1} />
              <NumField label="kt/k0" unit="-" value={inp.ktk0} onChange={(v) => update("ktk0", v)} step={0.01} />
            </div>
          </div>

          {/* Section 4: 모듈 */}
          <div className="doc-card">
            <div className="doc-title">④ 모듈 / 반응기</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <NumField label="요소/길이" unit="#" value={inp.elemPerLen} onChange={(v) => update("elemPerLen", v)} step={1} />
              <NumField label="요소/폭" unit="#" value={inp.elemPerWid} onChange={(v) => update("elemPerWid", v)} step={1} />
              <NumField label="층수" unit="#" value={inp.numLayers} onChange={(v) => update("numLayers", v)} step={1} />
              <NumField label="모듈 W" unit="#" value={inp.modWidth} onChange={(v) => update("modWidth", v)} step={1} />
              <NumField label="모듈 D" unit="#" value={inp.modDepth} onChange={(v) => update("modDepth", v)} step={1} />
            </div>
          </div>
        </div>

        {/* ========= RESULTS ========= */}
        <div className="space-y-4">
          <div className="doc-card bg-[var(--accent-soft)] border-[var(--accent)]">
            <div className="doc-subtitle text-[var(--accent)] mb-1">k(mat) Summary</div>
            <div className="font-mono text-sm tracking-tight">{res.kmat}</div>
          </div>

          <div className="doc-card">
            <div className="doc-title">활성 / 유동 (Activity)</div>
            <table className="data-table">
              <tbody>
                <tr><th>k(mat)</th><td className="num">{num(res.activity.kMat, 5)} m/h</td></tr>
                <tr><th>k(str)</th><td className="num">{num(res.activity.kStr, 5)} m/h</td></tr>
                <tr><th>K_overall</th><td className="num">{num(res.activity.kOverall, 5)} m/h</td></tr>
                <tr><th>Reynolds</th><td className="num">{num(res.activity.reynolds, 4)}</td></tr>
                <tr><th>유동 양상</th><td>
                  <span className={`chip ${res.activity.isLaminar ? "chip-ok" : "chip-warn"}`}>
                    {res.activity.flowRegime === "laminar" ? "층류" : res.activity.flowRegime === "turbulent" ? "난류" : "전이"}
                  </span>
                </td></tr>
                <tr><th>채널 속도</th><td className="num">{num(res.activity.channelVel)} m/s</td></tr>
              </tbody>
            </table>
          </div>

          <div className="doc-card">
            <div className="doc-title">촉매 용적 (Catalyst Volume)</div>
            <table className="data-table">
              <tbody>
                <tr><th>η_target (effective)</th><td className="num">{num(res.catVolume.etaTarget * 100, 4)} %</td></tr>
                <tr><th>AV_required</th><td className="num">{num(res.catVolume.avRequired)} m/h</td></tr>
                <tr><th>V_required</th><td className="num">{num(res.catVolume.volumeRequired)} m³</td></tr>
                <tr><th>V_design</th><td className="num font-bold">{num(res.catVolume.volumeDesign)} m³</td></tr>
                {res.catVolume.volumeDiox != null && (
                  <tr><th>V_DIOx (parallel)</th><td className="num">{num(res.catVolume.volumeDiox)} m³</td></tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="doc-card">
            <div className="doc-title">압력손실 (Pressure Drop)</div>
            <table className="data-table">
              <tbody>
                <tr><th>ΔP per layer</th><td className="num">{num(res.pressureDrop.dpPerLayer)} mbar</td></tr>
                <tr><th>ΔP protection grid</th><td className="num">{num(res.pressureDrop.dpProtGrid)} mbar</td></tr>
                <tr><th>ΔP_design (total)</th><td className="num font-bold">{num(res.pressureDrop.dpDesign)} mbar / {num(res.pressureDrop.dpMmH2O)} mmH₂O</td></tr>
              </tbody>
            </table>
          </div>

          <div className="doc-card">
            <div className="doc-title">SO₂ / NOx 결과</div>
            <table className="data-table">
              <tbody>
                <tr><th>SO₂→SO₃ 전환율</th><td className="num">{num(res.so2Conversion.convRate)} %</td></tr>
                <tr><th>SO₂→SO₃ (safety)</th><td className="num">{num(res.so2Conversion.convRateSF)} %</td></tr>
                <tr><th>SO₃ 출구</th><td className="num">{num(res.so2Conversion.so3Outlet)} mg/Nm³</td></tr>
                <tr><th>NOx 출구</th><td className="num">{num(res.nox.noxOutlet)} mg/Nm³</td></tr>
                <tr><th>NH₃ 주입량</th><td className="num">{num(res.nox.nh3Demand)} kg/h</td></tr>
                <tr><th>α (NH₃/NOx)</th><td className="num">{num(res.nox.alpha)}</td></tr>
              </tbody>
            </table>
          </div>

          {res.warnings.length > 0 && (
            <div className="doc-card border-[var(--warning)]">
              <div className="doc-subtitle text-[var(--warning)] mb-2">유의사항</div>
              <ul className="list-disc pl-6 space-y-1 text-[var(--warning)] text-sm leading-relaxed">
                {res.warnings.map((w, i) => <li key={i}>{w}</li>)}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Helper field components ──────────────────────────────────────────────────
function NumField({
  label, unit, value, onChange, step,
}: {
  label: string;
  unit: string;
  value: number;
  onChange: (n: number) => void;
  step?: number;
}) {
  return (
    <label className="flex items-center justify-between gap-2">
      <span className="text-[13px] font-medium">{label}</span>
      <div className="flex items-center gap-1">
        <input
          type="number"
          className="cell-input text-right"
          style={{ width: "88px" }}
          value={value}
          step={step}
          onChange={(e) => onChange(Number(e.target.value) || 0)}
        />
        <span className="cell-unit w-12 text-left text-[11px]">{unit}</span>
      </div>
    </label>
  );
}

function TextField({
  label, value, onChange,
}: {
  label: string;
  value: string;
  onChange: (s: string) => void;
}) {
  return (
    <label className="flex items-center justify-between gap-2">
      <span className="text-[13px] font-medium">{label}</span>
      <input
        type="text"
        className="cell-input"
        style={{ width: "140px" }}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}

function SelectField({
  label, value, onChange, options, unit,
}: {
  label: string;
  value: number | string;
  onChange: (v: string) => void;
  options: { v: number | string; l: string }[];
  unit?: string;
}) {
  return (
    <label className="flex items-center justify-between gap-2">
      <span className="text-[13px] font-medium">{label}</span>
      <div className="flex items-center gap-1">
        <select
          className="cell-input"
          style={{ width: "100px" }}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          {options.map((o) => <option key={o.v} value={o.v}>{o.l}</option>)}
        </select>
        {unit && <span className="cell-unit w-12 text-left text-[11px]">{unit}</span>}
      </div>
    </label>
  );
}
