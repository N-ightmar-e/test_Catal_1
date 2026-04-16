"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AgingPanel } from "@/components/AgingPanel";
import { CaseIO } from "@/components/CaseIO";
import { ChartsPanel } from "@/components/ChartsPanel";
import { InputTable } from "@/components/InputTable";
import { ResultsPanel } from "@/components/ResultsPanel";
import { computeAging } from "@/lib/scr/aging";
import { DEFAULT_SCR_INPUTS } from "@/lib/scr/constants";
import { computeHoneycomb } from "@/lib/scr/honeycomb";
import { loadInputs, saveInputs } from "@/lib/store";
import type { SCRInputs } from "@/types/scr";

export default function CalculatorPage() {
  const [inputs, setInputs] = useState<SCRInputs>(DEFAULT_SCR_INPUTS);
  const [loaded, setLoaded] = useState(false);

  // Load persisted inputs on mount (client-only)
  useEffect(() => {
    setInputs(loadInputs());
    setLoaded(true);
  }, []);

  // Persist on every change (debounce not needed — localStorage is fast enough for form edits)
  useEffect(() => {
    if (loaded) saveInputs(inputs);
  }, [inputs, loaded]);

  const results = useMemo(() => computeHoneycomb(inputs), [inputs]);

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="flex items-end justify-between mb-6 flex-wrap gap-4">
        <div>
          <div className="doc-subtitle">Calculator · Honeycomb V₂O₅-WO₃/TiO₂</div>
          <h1 className="text-2xl font-bold tracking-tight">
            탈질촉매 설계 입력 & 계산
          </h1>
          <p className="text-[var(--muted)] text-sm mt-1">
            입력값은 자동 저장됩니다. 결과는 우측에 실시간 계산됩니다.
          </p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <CaseIO inputs={inputs} onLoad={setInputs} />
          <button
            onClick={() => setInputs(DEFAULT_SCR_INPUTS)}
            className="border border-[var(--border-strong)] px-4 py-2 text-sm rounded-sm hover:bg-[var(--accent-soft)]"
          >
            초기값 리셋
          </button>
          <Link
            href="/report"
            className="bg-[var(--accent)] text-white font-semibold px-5 py-2 rounded-sm hover:opacity-90"
          >
            설계 의뢰서 작성 →
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] gap-8">
        <div className="space-y-6">
          <InputTable value={inputs} onChange={setInputs} />
          <AgingPanel scrInputs={inputs} />
        </div>
        <div className="space-y-6">
          <ResultsPanel r={results} />
        </div>
      </div>

      <div className="mt-8">
        <ChartsPanel
          inputs={inputs}
          results={results}
          agingInputs={{
            fuelSulfurPct: 0.5,
            dustLoadGNm3: 5,
            minActivityFraction: 0.6,
          }}
          estimatedLifeYears={
            computeAging({
              k0: inputs.activityK,
              fuelSulfurPct: 0.5,
              dustLoadGNm3: 5,
              operatingTempC: inputs.tempC,
              minActivityFraction: 0.6,
            }).estimatedLifeYears
          }
        />
      </div>
    </div>
  );
}
