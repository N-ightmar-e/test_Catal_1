"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { DEFAULT_SCR_INPUTS } from "@/lib/scr/constants";
import { computeHoneycomb } from "@/lib/scr/honeycomb";
import { RemovalCurveChart } from "@/components/charts/RemovalCurveChart";

/**
 * Quick-estimate mode — only 4 inputs, everything else defaulted.
 * Designed for first-pass ballpark sizing before running the full calculator.
 */
export default function QuickPage() {
  const [flow, setFlow] = useState(DEFAULT_SCR_INPUTS.flowNm3h);
  const [tempC, setTempC] = useState(DEFAULT_SCR_INPUTS.tempC);
  const [noxIn, setNoxIn] = useState(DEFAULT_SCR_INPUTS.noxInPpm);
  const [eta, setEta] = useState(DEFAULT_SCR_INPUTS.noxRemovalPct);

  const results = useMemo(() => {
    const inputs = {
      ...DEFAULT_SCR_INPUTS,
      flowNm3h: flow,
      tempC,
      noxInPpm: noxIn,
      noxRemovalPct: eta,
    };
    return { inputs, r: computeHoneycomb(inputs) };
  }, [flow, tempC, noxIn, eta]);

  const { r, inputs } = results;

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="doc-subtitle mb-2">
        Quick Estimate · 대략 계산 (4 입력)
      </div>
      <h1 className="text-3xl font-bold tracking-tight mb-2">
        탈질촉매 빠른 설계 추정
      </h1>
      <p className="text-[var(--muted)] mb-8 max-w-3xl leading-relaxed">
        유량·온도·NOx·목표 제거율 4가지만 입력하면 <strong>촉매 체적·모듈
        수·NH₃ 주입율·ΔP</strong>을 바로 추정해줍니다. 나머지 파라미터는 한국
        발전소용 일반값 (V₂O₅ 1 wt%, Pitch 7.4 mm, K=30 m/h, NH₃ slip 3 ppm,
        150×150×1000 mm 모듈)을 사용합니다. 세부 조정은{" "}
        <Link
          className="text-[var(--accent)] underline underline-offset-2"
          href="/calculator"
        >
          전체 계산기
        </Link>
        에서 가능합니다.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="doc-card">
          <div className="doc-title">입력</div>
          <div className="space-y-4">
            <QuickField
              label="표준 유량"
              unit="Nm³/h"
              value={flow}
              step={1000}
              onChange={setFlow}
            />
            <QuickField
              label="운전 온도"
              unit="°C"
              value={tempC}
              step={5}
              onChange={setTempC}
            />
            <QuickField
              label="입구 NOx"
              unit="ppm"
              value={noxIn}
              step={10}
              onChange={setNoxIn}
            />
            <QuickField
              label="NOx 제거율 η"
              unit="%"
              value={eta}
              step={1}
              min={20}
              max={99}
              onChange={setEta}
            />
          </div>
          <div className="mt-5 pt-4 border-t border-[var(--border)] text-[13px] text-[var(--muted)] leading-relaxed">
            기본 가정 — 세부 설계 시 전체 계산기에서 조정 필요:
            <br />
            · 촉매: V₂O₅-WO₃/TiO₂ 허니컴, V₂O₅ 1 wt%, K=30 m/h
            <br />
            · 형상: Pitch 7.4 mm / 격벽 1.1 mm (CPSI ≈ 11.8)
            <br />
            · 모듈: 150×150×1000 mm, LV 목표 5 m/s
          </div>
        </div>

        <div className="doc-card bg-[var(--accent-soft)] border-[var(--accent)]">
          <div className="doc-title">추정 결과</div>
          <table className="data-table">
            <tbody>
              <tr>
                <th>촉매 체적 V_cat</th>
                <td className="num font-bold text-lg">
                  {r.volumeCatalystM3.toLocaleString("ko-KR", {
                    maximumSignificantDigits: 4,
                  })}{" "}
                  m³
                </td>
              </tr>
              <tr>
                <th>총 모듈 수</th>
                <td className="num font-bold text-lg">
                  {r.totalModules.toLocaleString("ko-KR")} EA
                </td>
              </tr>
              <tr>
                <th>층 구성</th>
                <td className="num">
                  {r.modulesPerLayer} EA × {r.numberOfLayers} 층
                </td>
              </tr>
              <tr>
                <th>면속도 AV</th>
                <td className="num">{r.areaVelocity} m/h</td>
              </tr>
              <tr>
                <th>공간속도 SV</th>
                <td className="num">
                  {r.spaceVelocity.toLocaleString("ko-KR")} h⁻¹
                </td>
              </tr>
              <tr>
                <th>NH₃ 주입율</th>
                <td className="num">{r.nh3RateKgh} kg/h</td>
              </tr>
              <tr>
                <th>α (NH₃/NOx)</th>
                <td className="num">{r.alpha}</td>
              </tr>
              <tr>
                <th>압력손실 ΔP</th>
                <td className="num">
                  {r.pressureDropMmH2O} mmH₂O
                </td>
              </tr>
            </tbody>
          </table>
          {r.warnings.length > 0 && (
            <div className="mt-3 text-[13px]">
              <div className="doc-subtitle text-[var(--warning)] mb-1">
                유의사항
              </div>
              <ul className="list-disc pl-6 space-y-0.5 text-[var(--warning)]">
                {r.warnings.map((w, i) => (
                  <li key={i}>{w}</li>
                ))}
              </ul>
            </div>
          )}
          <div className="mt-4 text-[12px] text-[var(--muted)]">
            온도창 상태:{" "}
            {r.temperatureWindowOk ? (
              <span className="chip chip-ok">정상</span>
            ) : (
              <span className="chip chip-warn">검토 필요</span>
            )}{" "}
            · {r.temperatureWindowNote}
          </div>
        </div>
      </div>

      <div className="doc-card mt-6">
        <RemovalCurveChart
          currentAV={r.areaVelocity}
          currentEta={r.effectiveRemoval}
          currentK={inputs.activityK}
        />
      </div>

      <div className="mt-8 flex gap-3 flex-wrap">
        <Link
          href="/calculator"
          className="bg-[var(--accent)] text-white font-semibold px-6 py-2.5 rounded-sm hover:opacity-90"
        >
          세부 계산기 →
        </Link>
        <Link
          href="/report"
          className="border border-[var(--border-strong)] font-semibold px-6 py-2.5 rounded-sm hover:bg-[var(--accent-soft)]"
        >
          설계 의뢰서 작성
        </Link>
        <Link
          href="/methods"
          className="border border-[var(--border-strong)] font-semibold px-6 py-2.5 rounded-sm hover:bg-[var(--accent-soft)]"
        >
          설계 방식 비교
        </Link>
      </div>
    </div>
  );
}

function QuickField({
  label,
  unit,
  value,
  step,
  min,
  max,
  onChange,
}: {
  label: string;
  unit: string;
  value: number;
  step?: number;
  min?: number;
  max?: number;
  onChange: (n: number) => void;
}) {
  return (
    <label className="flex items-center justify-between gap-3">
      <span className="text-[15px] font-medium">{label}</span>
      <div className="flex items-center gap-2">
        <input
          type="number"
          className="cell-input text-right"
          style={{ width: "120px" }}
          value={value}
          step={step}
          min={min}
          max={max}
          onChange={(e) => onChange(Number(e.target.value) || 0)}
        />
        <span className="cell-unit w-12 text-left text-[13px]">{unit}</span>
      </div>
    </label>
  );
}
