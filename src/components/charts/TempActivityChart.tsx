"use client";
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ReferenceArea,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { tempActivitySeries } from "@/lib/scr/curves";

export function TempActivityChart({
  currentTempC,
  v2o5WtPct,
}: {
  currentTempC: number;
  v2o5WtPct: number;
}) {
  const data = tempActivitySeries(200, 500, 5, v2o5WtPct);

  return (
    <div>
      <div className="doc-subtitle mb-1">온도-활성 창 · SO₂→SO₃ 변환</div>
      <div className="text-xs text-[var(--muted)] mb-2">
        V₂O₅ {v2o5WtPct} wt% 기준. 최적 창 <strong>340–380°C</strong>, 허용 창{" "}
        <strong>300–400°C</strong>.
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <ComposedChart
          data={data}
          margin={{ top: 10, right: 24, left: 0, bottom: 20 }}
        >
          <CartesianGrid stroke="#e7e3d9" strokeDasharray="2 3" />
          <XAxis
            dataKey="t"
            tick={{ fontSize: 11, fill: "#6b6a66" }}
            label={{
              value: "온도 (°C)",
              position: "insideBottom",
              offset: -8,
              fontSize: 12,
              fill: "#6b6a66",
            }}
          />
          <YAxis
            yAxisId="left"
            domain={[0, 100]}
            tick={{ fontSize: 11, fill: "#6b6a66" }}
            label={{
              value: "상대 활성 (%)",
              angle: -90,
              position: "insideLeft",
              fontSize: 12,
              fill: "#1a4d7a",
            }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            domain={[0, "dataMax"]}
            tick={{ fontSize: 11, fill: "#6b6a66" }}
            label={{
              value: "SO₂→SO₃ (%)",
              angle: 90,
              position: "insideRight",
              fontSize: 12,
              fill: "#b45309",
            }}
          />
          <Tooltip
            formatter={(v, name) => [
              typeof v === "number" ? `${v.toFixed(2)} %` : String(v),
              String(name),
            ]}
            labelFormatter={(l) => `T = ${l} °C`}
            contentStyle={{ fontSize: 12, fontFamily: "monospace" }}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} verticalAlign="top" />
          <ReferenceArea
            yAxisId="left"
            x1={340}
            x2={380}
            fill="#c7e3c7"
            fillOpacity={0.5}
            label={{ value: "최적", fontSize: 10, fill: "#166534" }}
          />
          <ReferenceArea
            yAxisId="left"
            x1={300}
            x2={340}
            fill="#fef3c7"
            fillOpacity={0.4}
          />
          <ReferenceArea
            yAxisId="left"
            x1={380}
            x2={400}
            fill="#fef3c7"
            fillOpacity={0.4}
          />
          <ReferenceLine
            yAxisId="left"
            x={currentTempC}
            stroke="#991b1b"
            strokeDasharray="4 3"
            label={{
              value: `현재 ${currentTempC}°C`,
              fontSize: 11,
              fill: "#991b1b",
              position: "top",
            }}
          />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="activity"
            stroke="#1a4d7a"
            strokeWidth={2.5}
            dot={false}
            name="상대 활성"
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="so2conv"
            stroke="#b45309"
            strokeWidth={2}
            strokeDasharray="5 3"
            dot={false}
            name="SO₂→SO₃"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
