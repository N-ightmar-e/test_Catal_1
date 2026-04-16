"use client";
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { agingSeries } from "@/lib/scr/curves";

export function AgingCurveChart({
  k0,
  fuelSulfurPct,
  dustLoadGNm3,
  operatingTempC,
  minActivityFraction,
  estimatedLifeYears,
}: {
  k0: number;
  fuelSulfurPct: number;
  dustLoadGNm3: number;
  operatingTempC: number;
  minActivityFraction: number;
  estimatedLifeYears: number;
}) {
  const data = agingSeries(
    k0,
    fuelSulfurPct,
    dustLoadGNm3,
    operatingTempC,
    minActivityFraction,
    10,
  );
  const kMin = k0 * minActivityFraction;

  return (
    <div>
      <div className="doc-subtitle mb-1">K(t) 열화 곡선</div>
      <div className="text-xs text-[var(--muted)] mb-2">
        예상 수명 <strong>{estimatedLifeYears.toFixed(2)} 년</strong> — 활성이
        K_min ({kMin.toFixed(1)} m/h)까지 떨어지는 시점
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <ComposedChart
          data={data}
          margin={{ top: 10, right: 16, left: 0, bottom: 20 }}
        >
          <CartesianGrid stroke="#e7e3d9" strokeDasharray="2 3" />
          <XAxis
            dataKey="t"
            type="number"
            domain={[0, 10]}
            tick={{ fontSize: 11, fill: "#6b6a66" }}
            label={{
              value: "경과 시간 (년)",
              position: "insideBottom",
              offset: -8,
              fontSize: 12,
              fill: "#6b6a66",
            }}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#6b6a66" }}
            label={{
              value: "K (m/h)",
              angle: -90,
              position: "insideLeft",
              fontSize: 12,
              fill: "#6b6a66",
            }}
          />
          <Tooltip
            formatter={(v, name) => [
              typeof v === "number" ? `${v.toFixed(2)} m/h` : String(v),
              String(name),
            ]}
            labelFormatter={(l) => `t = ${Number(l).toFixed(2)} 년`}
            contentStyle={{ fontSize: 12, fontFamily: "monospace" }}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} verticalAlign="top" />
          <ReferenceLine
            x={estimatedLifeYears}
            stroke="#991b1b"
            strokeDasharray="4 3"
            label={{
              value: "수명 종점",
              position: "top",
              fontSize: 11,
              fill: "#991b1b",
            }}
          />
          <Line
            type="monotone"
            dataKey="k"
            stroke="#1a4d7a"
            strokeWidth={2.5}
            dot={false}
            name="K(t) 실제"
          />
          <Line
            type="monotone"
            dataKey="kMin"
            stroke="#b45309"
            strokeDasharray="5 3"
            dot={false}
            name={`K_min (${kMin.toFixed(1)})`}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
