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
import { formatNumber } from "../../utils/formatters";

export default function AmountDistributionChart({ data = [] }) {
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="bg-slate-900 text-white p-3 rounded-lg shadow-xl text-xs font-mono border border-slate-800">
          <div className="font-semibold text-blue-400">Amount Band: {label}</div>
          <div className="text-slate-300 mt-1 flex justify-between gap-4">
            <span>Legitimate:</span>
            <span className="font-bold text-emerald-400">{formatNumber(item.legitimate)}</span>
          </div>
          <div className="text-slate-300 flex justify-between gap-4">
            <span>Fraudulent:</span>
            <span className="font-bold text-red-400">{formatNumber(item.fraud)}</span>
          </div>
          <div className="text-slate-400 mt-1 pt-1 border-t border-slate-800">
            Fraud rate: <span className="text-slate-200 font-bold">{item.fraudRate ?? 0}%</span>
          </div>
          <div className="text-slate-400">
            Total amount: <span className="text-slate-200 font-bold">${formatNumber(item.totalAmount ?? 0)}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
          <XAxis
            dataKey="range"
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
          <Legend
            verticalAlign="top"
            height={36}
            iconSize={10}
            formatter={(value) => (
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                {value}
              </span>
            )}
          />
          <Bar
            dataKey="legitimate"
            name="Legitimate Transactions"
            fill="#10b981"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="fraud"
            name="Fraudulent Transactions"
            fill="#ef4444"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
