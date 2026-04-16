"use client";
import type { SCRInputs } from "@/types/scr";

interface Field {
  key: keyof SCRInputs;
  label: string;
  unit: string;
  step?: number;
  min?: number;
  max?: number;
  hint?: string;
}

const groups: { title: string; items: Field[] }[] = [
  {
    title: "① 배기가스 조건",
    items: [
      { key: "flowNm3h", label: "표준 유량", unit: "Nm³/h", step: 1000, min: 0 },
      { key: "tempC", label: "운전 온도", unit: "°C", step: 5, min: 100, max: 500 },
      {
        key: "pressureKpa",
        label: "절대 압력",
        unit: "kPa",
        step: 1,
        min: 50,
        max: 300,
      },
      {
        key: "noxInPpm",
        label: "입구 NOx",
        unit: "ppm",
        step: 10,
        min: 0,
      },
      {
        key: "o2VolPct",
        label: "O₂",
        unit: "vol%",
        step: 0.5,
        min: 0,
        max: 21,
      },
      {
        key: "h2oVolPct",
        label: "H₂O",
        unit: "vol%",
        step: 0.5,
        min: 0,
        max: 30,
      },
    ],
  },
  {
    title: "② 설계 목표",
    items: [
      {
        key: "noxRemovalPct",
        label: "NOx 제거율 η",
        unit: "%",
        step: 1,
        min: 20,
        max: 99.5,
      },
      {
        key: "nh3SlipPpm",
        label: "NH₃ slip",
        unit: "ppm",
        step: 0.5,
        min: 0,
        max: 20,
      },
    ],
  },
  {
    title: "③ 촉매 사양",
    items: [
      {
        key: "activityK",
        label: "활성도 K",
        unit: "m/h",
        step: 1,
        min: 5,
        max: 60,
        hint: "신촉매 25–40",
      },
      {
        key: "v2o5WtPct",
        label: "V₂O₅",
        unit: "wt%",
        step: 0.1,
        min: 0.1,
        max: 5,
      },
      {
        key: "pitchMm",
        label: "Pitch",
        unit: "mm",
        step: 0.1,
        min: 2,
        max: 15,
      },
      {
        key: "wallThicknessMm",
        label: "격벽 두께",
        unit: "mm",
        step: 0.05,
        min: 0.4,
        max: 3,
      },
    ],
  },
  {
    title: "④ 모듈 규격",
    items: [
      {
        key: "moduleWidthMm",
        label: "가로 W",
        unit: "mm",
        step: 10,
        min: 100,
        max: 300,
      },
      {
        key: "moduleHeightMm",
        label: "세로 H",
        unit: "mm",
        step: 10,
        min: 100,
        max: 300,
      },
      {
        key: "moduleLengthMm",
        label: "길이 L",
        unit: "mm",
        step: 50,
        min: 300,
        max: 2000,
      },
    ],
  },
];

export function InputTable({
  value,
  onChange,
}: {
  value: SCRInputs;
  onChange: (next: SCRInputs) => void;
}) {
  function setField(k: keyof SCRInputs, raw: string) {
    const n = Number(raw);
    if (Number.isFinite(n)) onChange({ ...value, [k]: n });
  }

  return (
    <div className="space-y-6">
      {groups.map((g) => (
        <div key={g.title} className="doc-card">
          <div className="doc-title">{g.title}</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            {g.items.map((f) => (
              <label
                key={f.key}
                className="flex items-center justify-between gap-2"
              >
                <div className="min-w-[70px] flex-1">
                  <div className="text-[14px] font-medium leading-tight whitespace-nowrap">
                    {f.label}
                  </div>
                  {f.hint && (
                    <div className="text-[11px] text-[var(--muted)] leading-tight whitespace-nowrap">
                      {f.hint}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <input
                    type="number"
                    className="cell-input text-right"
                    style={{ width: "96px" }}
                    value={value[f.key] as number}
                    step={f.step}
                    min={f.min}
                    max={f.max}
                    onChange={(e) => setField(f.key, e.target.value)}
                  />
                  <span
                    className="cell-unit text-left text-[12px]"
                    style={{ width: "48px" }}
                  >
                    {f.unit}
                  </span>
                </div>
              </label>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
