"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ReportSheet } from "@/components/ReportSheet";
import { computeAging } from "@/lib/scr/aging";
import { DEFAULT_SCR_INPUTS } from "@/lib/scr/constants";
import { computeHoneycomb } from "@/lib/scr/honeycomb";
import { loadInputs, loadRequester, saveRequester } from "@/lib/store";
import type { RequesterInfo, SCRInputs } from "@/types/scr";

export default function ReportPage() {
  const [inputs, setInputs] = useState<SCRInputs>(DEFAULT_SCR_INPUTS);
  const [req, setReq] = useState<RequesterInfo>({
    docNo: "",
    docDate: new Date().toISOString().slice(0, 10),
    companyName: "",
    contactPerson: "",
    contactPhone: "",
    contactEmail: "",
    facilityType: "",
    projectName: "",
  });
  const [includeAging, setIncludeAging] = useState(true);
  const [fuelSulfurPct, setFuelSulfurPct] = useState(0.5);
  const [dustLoadGNm3, setDustLoadGNm3] = useState(5);
  const [minActivityFraction, setMinActivityFraction] = useState(0.6);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setInputs(loadInputs());
    setReq(loadRequester());
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) saveRequester(req);
  }, [req, loaded]);

  const res = useMemo(() => computeHoneycomb(inputs), [inputs]);
  const aging = useMemo(
    () =>
      computeAging({
        k0: inputs.activityK,
        fuelSulfurPct,
        dustLoadGNm3,
        operatingTempC: inputs.tempC,
        minActivityFraction,
      }),
    [
      inputs.activityK,
      inputs.tempC,
      fuelSulfurPct,
      dustLoadGNm3,
      minActivityFraction,
    ],
  );

  function onReqChange<K extends keyof RequesterInfo>(k: K, v: RequesterInfo[K]) {
    setReq((r) => ({ ...r, [k]: v }));
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      {/* 의뢰자 입력 폼 (화면용, 인쇄 시 숨김) */}
      <section className="no-print mb-8">
        <div className="flex justify-between items-end mb-4 flex-wrap gap-4">
          <div>
            <div className="doc-subtitle">Design Request Form · 설계 의뢰서</div>
            <h1 className="text-2xl font-bold tracking-tight">설계 의뢰서 작성</h1>
            <p className="text-sm text-[var(--muted)] mt-1">
              계산은 <code>/calculator</code>에서 입력한 값으로 자동 반영됩니다.
              의뢰자 정보만 기입 후 인쇄·PDF 저장 하세요.
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/calculator"
              className="border border-[var(--border-strong)] px-4 py-2 text-sm rounded-sm hover:bg-[var(--accent-soft)]"
            >
              ← 입력값 편집
            </Link>
            <button
              onClick={() => window.print()}
              className="bg-[var(--accent)] text-white font-semibold px-5 py-2 rounded-sm hover:opacity-90"
            >
              인쇄 / PDF 저장
            </button>
          </div>
        </div>

        <div className="doc-card mb-4">
          <div className="doc-title">의뢰자 정보</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            {(
              [
                ["docNo", "문서번호"],
                ["docDate", "작성일"],
                ["companyName", "회사명"],
                ["projectName", "프로젝트명"],
                ["contactPerson", "담당자"],
                ["facilityType", "설비 구분"],
                ["contactPhone", "연락처"],
                ["contactEmail", "E-mail"],
              ] as const
            ).map(([k, label]) => (
              <label key={k} className="grid grid-cols-[9rem_1fr] items-center gap-3">
                <div className="text-[15px] font-medium">{label}</div>
                <input
                  type={k === "docDate" ? "date" : "text"}
                  className="cell-input"
                  value={req[k]}
                  onChange={(e) => onReqChange(k, e.target.value)}
                />
              </label>
            ))}
          </div>
        </div>

        <div className="doc-card">
          <div className="flex items-center justify-between mb-3">
            <div className="doc-title mb-0">수명 예측 조건</div>
            <label className="flex items-center gap-2 text-[13px]">
              <input
                type="checkbox"
                checked={includeAging}
                onChange={(e) => setIncludeAging(e.target.checked)}
              />
              의뢰서에 포함
            </label>
          </div>
          <div
            className={`grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4 ${
              !includeAging ? "opacity-50 pointer-events-none" : ""
            }`}
          >
            <label className="grid grid-cols-[7rem_1fr] items-center gap-3">
              <div className="text-[14px]">연료 황분</div>
              <div className="flex items-center gap-2">
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
                <span className="cell-unit text-[12px]">wt%</span>
              </div>
            </label>
            <label className="grid grid-cols-[7rem_1fr] items-center gap-3">
              <div className="text-[14px]">분진 부하</div>
              <div className="flex items-center gap-2">
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
                <span className="cell-unit text-[12px]">g/Nm³</span>
              </div>
            </label>
            <label className="grid grid-cols-[7rem_1fr] items-center gap-3">
              <div className="text-[14px]">K_min / K₀</div>
              <div className="flex items-center gap-2">
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
                <span className="cell-unit text-[12px]">-</span>
              </div>
            </label>
          </div>
        </div>
      </section>

      {/* 실제 의뢰서 (인쇄 대상) */}
      <ReportSheet
        req={req}
        inp={inputs}
        res={res}
        aging={includeAging ? aging : undefined}
        agingInputs={
          includeAging
            ? { fuelSulfurPct, dustLoadGNm3, minActivityFraction }
            : undefined
        }
      />
    </div>
  );
}
