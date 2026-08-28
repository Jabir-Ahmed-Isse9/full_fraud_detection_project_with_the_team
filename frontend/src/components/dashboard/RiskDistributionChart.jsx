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

const RISK_COLORS = ["#10b981", "#f59e0b", "#ef4444"];

export default function RiskDistributionChart({ data = [] }) {
  const total = (data || []).reduce((sum, item) => sum + Number(item.value || 0), 0);
  if (!data || data.length === 0 || total === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-xs text-slate-400">
        No risk distribution data
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
            Volume: <span className="text-white font-bold">{formatNumber(item.value)}</span>
          </div>
          <div className="text-slate-400">
            Share: <span className="font-bold text-slate-200">{item.percentage}%</span>
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
            innerRadius={50}
            outerRadius={75}
            paddingAngle={3}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-risk-${index}`}
                fill={RISK_COLORS[index % RISK_COLORS.length]}
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
              <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                {value}
              </span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
