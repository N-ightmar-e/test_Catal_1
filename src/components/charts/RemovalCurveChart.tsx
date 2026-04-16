"use client";
import {
  CartesianGrid,
  Line,
  LineChart,
  Legend,
  ReferenceDot,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { removalVsAvSeries } from "@/lib/scr/curves";

export function RemovalCurveChart({
  currentAV,
  currentEta,
  currentK,
}: {
  currentAV: number;
  currentEta: number; // fractional 0-1
  currentK: number;
}) {
  const kValues = Array.from(
    new Set([20, 30, 40, Math.round(currentK)]),
  ).sort((a, b) => a - b);
  const data = removalVsAvSeries(kValues, 5, 60, 1);
  const colors = ["#8c8a84", "#1a4d7a", "#166534", "#991b1b"];

  return (
    <div>
      <div className="doc-subtitle mb-1">NOx 제거율 η vs 면속도 AV</div>
      <div className="text-xs text-[var(--muted)] mb-2">
        η = 1 − exp(−K / AV). 현재 설계점:{" "}
        <strong>
          AV = {currentAV.toFixed(1)} m/h, η = {(currentEta * 100).toFixed(1)} %
        </strong>{" "}
        @ K = {currentK.toFixed(0)}
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data} margin={{ top: 10, right: 16, left: 0, bottom: 20 }}>
          <CartesianGrid stroke="#e7e3d9" strokeDasharray="2 3" />
          <XAxis
            dataKey="av"
            tick={{ fontSize: 11, fill: "#6b6a66" }}
            label={{
              value: "면속도 AV (m/h)",
              position: "insideBottom",
              offset: -8,
              fontSize: 12,
              fill: "#6b6a66",
            }}
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fontSize: 11, fill: "#6b6a66" }}
            label={{
              value: "η (%)",
              angle: -90,
              position: "insideLeft",
              fontSize: 12,
              fill: "#6b6a66",
            }}
          />
          <Tooltip
            formatter={(v, name) => [
              typeof v === "number" ? `${v.toFixed(2)} %` : String(v),
              String(name),
            ]}
            labelFormatter={(l) => `AV = ${Number(l).toFixed(1)} m/h`}
            contentStyle={{ fontSize: 12, fontFamily: "monospace" }}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} verticalAlign="top" />
          {kValues.map((k, i) => (
            <Line
              key={k}
              type="monotone"
              dataKey={`eta_K${k}`}
              stroke={colors[i % colors.length]}
              strokeWidth={k === Math.round(currentK) ? 2.5 : 1.5}
              dot={false}
              name={`K = ${k}`}
            />
          ))}
          <ReferenceDot
            x={currentAV}
            y={currentEta * 100}
            r={6}
            fill="#1a4d7a"
            stroke="#fff"
            strokeWidth={2}
            label={{
              value: "현재 설계점",
              position: "top",
              fontSize: 11,
              fill: "#1a4d7a",
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
