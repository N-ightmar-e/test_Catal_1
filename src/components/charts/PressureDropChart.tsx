"use client";
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceArea,
  ReferenceDot,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { pressureDropSeries } from "@/lib/scr/curves";

export function PressureDropChart({
  catalystLengthM,
  hydraulicDiameterMm,
  openFrontalArea,
  tempC,
  currentLV,
  currentDPmmH2O,
}: {
  catalystLengthM: number;
  hydraulicDiameterMm: number;
  openFrontalArea: number;
  tempC: number;
  currentLV: number;
  currentDPmmH2O: number;
}) {
  const data = pressureDropSeries(
    catalystLengthM,
    hydraulicDiameterMm,
    openFrontalArea,
    tempC,
    1,
    10,
    0.25,
  );

  return (
    <div>
      <div className="doc-subtitle mb-1">압력손실 ΔP vs 선속도 LV</div>
      <div className="text-xs text-[var(--muted)] mb-2">
        L = {catalystLengthM.toFixed(2)} m, d_h = {hydraulicDiameterMm.toFixed(1)} mm,
        T = {tempC} °C. 현재:{" "}
        <strong>
          LV = {currentLV.toFixed(2)} m/s, ΔP = {currentDPmmH2O.toFixed(1)} mmH₂O
        </strong>
        . 통상 예산: 50–200 mmH₂O.
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data} margin={{ top: 10, right: 16, left: 0, bottom: 20 }}>
          <CartesianGrid stroke="#e7e3d9" strokeDasharray="2 3" />
          <XAxis
            dataKey="lv"
            type="number"
            domain={[1, 10]}
            tick={{ fontSize: 11, fill: "#6b6a66" }}
            label={{
              value: "선속도 LV (m/s)",
              position: "insideBottom",
              offset: -8,
              fontSize: 12,
              fill: "#6b6a66",
            }}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#6b6a66" }}
            label={{
              value: "ΔP (mmH₂O)",
              angle: -90,
              position: "insideLeft",
              fontSize: 12,
              fill: "#6b6a66",
            }}
          />
          <Tooltip
            formatter={(v) => [
              typeof v === "number" ? `${v.toFixed(1)} mmH₂O` : String(v),
              "ΔP",
            ]}
            labelFormatter={(l) => `LV = ${Number(l).toFixed(2)} m/s`}
            contentStyle={{ fontSize: 12, fontFamily: "monospace" }}
          />
          <ReferenceArea y1={50} y2={200} fill="#c7e3c7" fillOpacity={0.3} />
          <Line
            type="monotone"
            dataKey="dp"
            stroke="#1a4d7a"
            strokeWidth={2.5}
            dot={false}
          />
          <ReferenceDot
            x={currentLV}
            y={currentDPmmH2O}
            r={6}
            fill="#991b1b"
            stroke="#fff"
            strokeWidth={2}
            label={{
              value: "현재",
              position: "top",
              fontSize: 11,
              fill: "#991b1b",
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
