import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { formatNumber } from "../../utils/formatters";

const COLORS = ["#10b981", "#ef4444"];

export default function FraudDistributionChart({ data = [] }) {
  const total = (data || []).reduce((sum, item) => sum + Number(item.value || 0), 0);
  if (!data || data.length === 0 || total === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-xs text-slate-400">
        No distribution data available
      </div>
    );
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="bg-slate-900 text-white p-3 rounded-lg shadow-xl text-xs font-mono border border-slate-800">
          <div className="font-semibold text-slate-200">{item.name}</div>
          <div className="text-slate-300 mt-1">
            Count: <span className="text-white font-bold">{formatNumber(item.value)}</span>
          </div>
          <div className="text-slate-400">
            Share: <span className="text-emerald-400 font-bold">{item.percentage ?? 0}%</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-64 w-full relative">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={80}
            paddingAngle={4}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
                stroke="#1e293b"
                strokeWidth={1}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="bottom"
            height={36}
            formatter={(value, entry) => (
              <span className="text-xs font-medium text-slate-700 dark:text-slate-300 mr-2">
                {value} ({entry.payload.percentage ?? 0}%)
              </span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>

      {/* Center Label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-9">
        <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
          Total
        </span>
        <span className="text-sm font-bold text-slate-800 dark:text-slate-100 font-mono">
          {formatNumber(data.reduce((total, item) => total + Number(item.value || 0), 0))}
        </span>
      </div>
    </div>
  );
}
