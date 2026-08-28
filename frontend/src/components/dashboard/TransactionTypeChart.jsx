import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatNumber } from "../../utils/formatters";

export default function TransactionTypeChart({ data = [] }) {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-xs text-slate-400">
        No transaction type data
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="bg-slate-900 text-white p-3 rounded-lg shadow-xl text-xs font-mono border border-slate-800">
          <div className="font-semibold text-blue-400">{label}</div>
          <div className="text-slate-300 mt-1">
            Volume: <span className="text-white font-bold">{formatNumber(item.count)}</span>
          </div>
          <div className="text-slate-400">
            Share: <span className="text-slate-200 font-medium">{item.percentage}%</span>
          </div>
          <div className="text-red-400 mt-1 pt-1 border-t border-slate-800 text-[11px]">
            Fraud: {formatNumber(item.fraudCount)} ({item.fraudRate ?? 0}%)
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
          <XAxis
            dataKey="type"
            stroke="#94a3b8"
            fontSize={11}
            tickLine={false}
            dy={8}
          />
          <YAxis
            stroke="#94a3b8"
            fontSize={10}
            tickLine={false}
            tickFormatter={(val) => `${(val / 1000000).toFixed(1)}M`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey="count"
            fill="#3b82f6"
            radius={[4, 4, 0, 0]}
            name="Transaction Count"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
