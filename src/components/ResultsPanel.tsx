"use client";
import type { SCRResults } from "@/types/scr";

type Row = {
  label: string;
  value: number | string;
  unit: string;
  symbol?: string;
  hint?: string;
};

function fmt(n: number, digits = 4): string {
  if (!Number.isFinite(n)) return "—";
  if (n === 0) return "0";
  const abs = Math.abs(n);
  if (abs >= 1e5 || abs < 1e-3)
    return n.toExponential(2);
  return n.toLocaleString("ko-KR", {
    maximumSignificantDigits: digits,
  });
}

export function ResultsPanel({ r }: { r: SCRResults }) {
  const stoich: Row[] = [
    { label: "NH₃/NOx 몰비", symbol: "α", value: fmt(r.alpha), unit: "-" },
    {
      label: "NH₃ 주입율",
      symbol: "ṁ_NH₃",
      value: fmt(r.nh3RateKgh),
      unit: "kg/h",
    },
    {
      label: "입구 NOx 몰유량",
      symbol: "Ṅ_NOx",
      value: fmt(r.noxInMolh),
      unit: "mol/h",
    },
    {
      label: "유효 제거율",
      symbol: "η_eff",
      value: fmt(r.effectiveRemoval * 100),
      unit: "%",
    },
  ];

  const geom: Row[] = [
    { label: "셀 개구부", symbol: "a", value: fmt(r.cellOpeningMm), unit: "mm" },
    {
      label: "수력직경",
      symbol: "d_h",
      value: fmt(r.hydraulicDiameterMm),
      unit: "mm",
    },
    { label: "개구율", symbol: "OFA", value: fmt(r.openFrontalArea * 100), unit: "%" },
    { label: "셀 밀도", symbol: "CPSI", value: fmt(r.cpsi), unit: "cells/in²" },
    {
      label: "기하 표면적 밀도",
      symbol: "a_v",
      value: fmt(r.geometricSurfaceDensity),
      unit: "m²/m³",
    },
  ];

  const flow: Row[] = [
    {
      label: "면속도",
      symbol: "AV",
      value: fmt(r.areaVelocity),
      unit: "m/h",
    },
    {
      label: "공간속도",
      symbol: "SV",
      value: fmt(r.spaceVelocity),
      unit: "h⁻¹",
    },
    { label: "GHSV (표준 기준)", symbol: "GHSV", value: fmt(r.ghsv), unit: "h⁻¹" },
    {
      label: "실 운전 유량",
      symbol: "Q_act",
      value: fmt(r.actualFlowM3h),
      unit: "m³/h",
    },
    {
      label: "접근 선속도",
      symbol: "LV",
      value: fmt(r.linearVelocityMs),
      unit: "m/s",
    },
    {
      label: "채널 내 속도",
      symbol: "v_ch",
      value: fmt(r.channelVelocityMs),
      unit: "m/s",
    },
  ];

  const sizing: Row[] = [
    {
      label: "촉매 체적",
      symbol: "V_cat",
      value: fmt(r.volumeCatalystM3),
      unit: "m³",
    },
    {
      label: "정면 단면적",
      symbol: "A_front",
      value: fmt(r.frontalAreaM2),
      unit: "m²",
    },
    {
      label: "촉매 총 길이",
      symbol: "L_cat",
      value: fmt(r.catalystLengthM),
      unit: "m",
    },
    {
      label: "층당 모듈수",
      symbol: "N/layer",
      value: r.modulesPerLayer,
      unit: "EA",
    },
    { label: "층수", symbol: "N_layer", value: r.numberOfLayers, unit: "EA" },
    { label: "총 모듈수", symbol: "N_total", value: r.totalModules, unit: "EA" },
  ];

  const loss: Row[] = [
    {
      label: "압력손실",
      symbol: "ΔP",
      value: fmt(r.pressureDropPa),
      unit: "Pa",
    },
    {
      label: "압력손실",
      symbol: "ΔP",
      value: fmt(r.pressureDropMmH2O),
      unit: "mmH₂O",
    },
    {
      label: "SO₂→SO₃ 변환율",
      symbol: "X_SO₂",
      value: fmt(r.so2ToSo3ConvPct),
      unit: "%",
    },
  ];

  const sections: { title: string; rows: Row[] }[] = [
    { title: "화학양론 · NH₃ 주입", rows: stoich },
    { title: "촉매 기하", rows: geom },
    { title: "운전 속도", rows: flow },
    { title: "치수 · 모듈", rows: sizing },
    { title: "압력손실 · 부반응", rows: loss },
  ];

  return (
    <div className="space-y-6">
      {sections.map((s) => (
        <div key={s.title} className="doc-card">
          <div className="doc-title">{s.title}</div>
          <table className="data-table">
            <colgroup>
              <col style={{ width: "38%" }} />
              <col style={{ width: "12%" }} />
              <col style={{ width: "30%" }} />
              <col style={{ width: "20%" }} />
            </colgroup>
            <tbody>
              {s.rows.map((row, idx) => (
                <tr key={`${row.label}-${idx}`}>
                  <th scope="row">{row.label}</th>
                  <td className="font-mono text-[13px]">{row.symbol ?? ""}</td>
                  <td className="num">{row.value}</td>
                  <td className="text-[var(--muted)]">{row.unit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}

      <div className="doc-card">
        <div className="doc-title">설계 의견</div>
        <div className="space-y-3 text-[15px] leading-relaxed">
          <div className="flex items-start gap-3">
            <span
              className={`chip ${r.temperatureWindowOk ? "chip-ok" : "chip-warn"}`}
            >
              온도창 {r.temperatureWindowOk ? "양호" : "검토"}
            </span>
            <div>{r.temperatureWindowNote}</div>
          </div>
          <div className="flex items-start gap-3">
            <span className="chip chip-ok">여유</span>
            <div>{r.designMarginNote}</div>
          </div>
          {r.warnings.length > 0 && (
            <div className="border-t border-[var(--border)] pt-3 mt-3">
              <div className="doc-subtitle text-[var(--warning)] mb-2">
                경고 사항
              </div>
              <ul className="list-disc pl-6 space-y-1">
                {r.warnings.map((w, i) => (
                  <li key={i} className="text-[var(--warning)]">
                    {w}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
