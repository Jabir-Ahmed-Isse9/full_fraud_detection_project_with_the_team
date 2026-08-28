import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function ModelPerformanceChart({ data = [] }) {
  if (!data || data.length === 0) {
    return (
      <div className="h-80 flex items-center justify-center text-xs text-slate-400">
        No performance metrics data
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 text-white p-3 rounded-lg shadow-xl text-xs font-mono border border-slate-800">
          <div className="font-semibold text-blue-400 mb-1">{label} Metric</div>
          {payload.map((entry, index) => (
            <div
              key={`metric-item-${index}`}
              className="flex items-center justify-between gap-6 my-1"
            >
              <span className="text-slate-300">{entry.name}:</span>
              <span className="font-bold font-mono" style={{ color: entry.color }}>
                {entry.value}%
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 20, left: -10, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
          <XAxis
            dataKey="metric"
            stroke="#94a3b8"
            fontSize={12}
            tickLine={false}
            dy={8}
          />
          <YAxis
            stroke="#94a3b8"
            fontSize={11}
            domain={[0, 100]}
            tickLine={false}
            tickFormatter={(val) => `${val}%`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="top"
            height={36}
            iconSize={12}
            formatter={(value) => (
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                {value}
              </span>
            )}
          />
          <Bar
            dataKey="logistic"
            name="Logistic Regression"
            fill="#64748b"
            radius={[4, 4, 0, 0]}
            maxBarSize={45}
          />
          <Bar
            dataKey="randomForest"
            name="Random Forest"
            fill="#2563eb"
            radius={[4, 4, 0, 0]}
            maxBarSize={45}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
