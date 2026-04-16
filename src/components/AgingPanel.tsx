"use client";
import { useMemo, useState } from "react";
import { computeAging } from "@/lib/scr/aging";
import type { SCRInputs } from "@/types/scr";

function fmt(n: number, d = 4) {
  if (!Number.isFinite(n)) return "∞";
  return n.toLocaleString("ko-KR", { maximumSignificantDigits: d });
}

/**
 * Catalyst aging estimator — takes K₀ and operating T from main SCRInputs,
 * exposes local inputs for fuel sulfur, dust load, and minimum activity fraction.
 */
export function AgingPanel({ scrInputs }: { scrInputs: SCRInputs }) {
  const [fuelSulfurPct, setFuelSulfurPct] = useState(0.5);
  const [dustLoadGNm3, setDustLoadGNm3] = useState(5);
  const [minActivityFraction, setMinActivityFraction] = useState(0.6);

  const results = useMemo(
    () =>
      computeAging({
        k0: scrInputs.activityK,
        fuelSulfurPct,
        dustLoadGNm3,
        operatingTempC: scrInputs.tempC,
        minActivityFraction,
      }),
    [
      scrInputs.activityK,
      scrInputs.tempC,
      fuelSulfurPct,
      dustLoadGNm3,
      minActivityFraction,
    ],
  );

  return (
    <div className="doc-card">
      <div className="doc-title">촉매 수명 / 열화 추정</div>
      <p className="text-[13px] text-[var(--muted)] mb-4 leading-relaxed">
        1차 열화 K(t) = K₀·exp(−k_d·t). 연료 황분·분진·온도 가속 항을 반영한
        경험식이며, 실측 재생 주기 대비 1차 가이드 값입니다.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
        <label className="flex items-center justify-between gap-2">
          <span className="text-[14px] font-medium">연료 황분</span>
          <div className="flex items-center gap-1.5 shrink-0">
            <input
              type="number"
              className="cell-input text-right"
              style={{ width: "80px" }}
              value={fuelSulfurPct}
              step={0.1}
              min={0}
              max={6}
              onChange={(e) => setFuelSulfurPct(Number(e.target.value) || 0)}
            />
            <span className="cell-unit text-[12px] w-10">wt%</span>
          </div>
        </label>

        <label className="flex items-center justify-between gap-2">
          <span className="text-[14px] font-medium">분진 부하</span>
          <div className="flex items-center gap-1.5 shrink-0">
            <input
              type="number"
              className="cell-input text-right"
              style={{ width: "80px" }}
              value={dustLoadGNm3}
              step={1}
              min={0}
              max={60}
              onChange={(e) => setDustLoadGNm3(Number(e.target.value) || 0)}
            />
            <span className="cell-unit text-[12px] w-12">g/Nm³</span>
          </div>
        </label>

        <label className="flex items-center justify-between gap-2">
          <span className="text-[14px] font-medium">K_min/K₀</span>
          <div className="flex items-center gap-1.5 shrink-0">
            <input
              type="number"
              className="cell-input text-right"
              style={{ width: "80px" }}
              value={minActivityFraction}
              step={0.05}
              min={0.3}
              max={0.95}
              onChange={(e) =>
                setMinActivityFraction(Number(e.target.value) || 0.6)
              }
            />
            <span className="cell-unit text-[12px] w-10">-</span>
          </div>
        </label>
      </div>

      <table className="data-table">
        <tbody>
          <tr>
            <th>열화 상수 k_d</th>
            <td className="num">{fmt(results.deactivationRatePerYear)} 1/yr</td>
            <th>예상 수명</th>
            <td className="num">{fmt(results.estimatedLifeYears)} 년</td>
          </tr>
          <tr>
            <th>K(1년)</th>
            <td className="num">
              {fmt(results.kAtYears[0].k)} m/h
            </td>
            <th>K(3년)</th>
            <td className="num">
              {fmt(results.kAtYears[2].k)} m/h
            </td>
          </tr>
          <tr>
            <th>K(5년)</th>
            <td className="num">
              {fmt(results.kAtYears[3].k)} m/h
            </td>
            <th>K₀ (신촉매)</th>
            <td className="num">{fmt(scrInputs.activityK)} m/h</td>
          </tr>
        </tbody>
      </table>

      {results.notes.length > 0 && (
        <div className="mt-3 text-[13px] leading-relaxed">
          <div className="doc-subtitle text-[var(--warning)] mb-1.5">
            열화 관련 유의사항
          </div>
          <ul className="list-disc pl-6 space-y-0.5 text-[var(--warning)]">
            {results.notes.map((n, i) => (
              <li key={i}>{n}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
