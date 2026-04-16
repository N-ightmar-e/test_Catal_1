"use client";
import { useState } from "react";
import { AgingCurveChart } from "./charts/AgingCurveChart";
import { PressureDropChart } from "./charts/PressureDropChart";
import { RemovalCurveChart } from "./charts/RemovalCurveChart";
import { TempActivityChart } from "./charts/TempActivityChart";
import type { SCRInputs, SCRResults } from "@/types/scr";

type Tab = "aging" | "removal" | "temp" | "pressure";

export function ChartsPanel({
  inputs,
  results,
  agingInputs,
  estimatedLifeYears,
}: {
  inputs: SCRInputs;
  results: SCRResults;
  agingInputs: {
    fuelSulfurPct: number;
    dustLoadGNm3: number;
    minActivityFraction: number;
  };
  estimatedLifeYears: number;
}) {
  const [tab, setTab] = useState<Tab>("aging");

  const tabs: { key: Tab; label: string }[] = [
    { key: "aging", label: "수명 K(t)" },
    { key: "removal", label: "η vs AV" },
    { key: "temp", label: "온도창" },
    { key: "pressure", label: "ΔP vs LV" },
  ];

  return (
    <div className="doc-card">
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <div className="doc-title mb-0">설계 그래프</div>
        <div className="flex gap-1">
          {tabs.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={`px-3 py-1.5 text-sm rounded-sm border transition-colors ${
                tab === t.key
                  ? "bg-[var(--accent)] text-white border-[var(--accent)]"
                  : "border-[var(--border)] hover:bg-[var(--accent-soft)]"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {tab === "aging" && (
        <AgingCurveChart
          k0={inputs.activityK}
          fuelSulfurPct={agingInputs.fuelSulfurPct}
          dustLoadGNm3={agingInputs.dustLoadGNm3}
          operatingTempC={inputs.tempC}
          minActivityFraction={agingInputs.minActivityFraction}
          estimatedLifeYears={estimatedLifeYears}
        />
      )}
      {tab === "removal" && (
        <RemovalCurveChart
          currentAV={results.areaVelocity}
          currentEta={results.effectiveRemoval}
          currentK={inputs.activityK}
        />
      )}
      {tab === "temp" && (
        <TempActivityChart
          currentTempC={inputs.tempC}
          v2o5WtPct={inputs.v2o5WtPct}
        />
      )}
      {tab === "pressure" && (
        <PressureDropChart
          catalystLengthM={results.catalystLengthM}
          hydraulicDiameterMm={results.hydraulicDiameterMm}
          openFrontalArea={results.openFrontalArea}
          tempC={inputs.tempC}
          currentLV={results.linearVelocityMs}
          currentDPmmH2O={results.pressureDropMmH2O}
        />
      )}
    </div>
  );
}
