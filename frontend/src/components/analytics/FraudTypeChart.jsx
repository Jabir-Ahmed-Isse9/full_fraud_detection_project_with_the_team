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

export default function FraudTypeChart({ data = [] }) {
  // Filter for fraud occurrence
  const formattedData = data.map((item) => ({
    type: item.type,
    fraudCount: item.fraudCount || 0,
    fraudRate: item.fraudRate || 0,
    totalCount: item.count || 0,
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="bg-slate-900 text-white p-3 rounded-lg shadow-xl text-xs font-mono border border-slate-800">
          <div className="font-semibold text-red-400">{label} Fraud Count</div>
          <div className="text-slate-300 mt-1">
            Confirmed Fraud: <span className="text-white font-bold">{formatNumber(item.fraudCount)}</span>
          </div>
          <div className="text-slate-400">
            Fraud Occurrence Rate: <span className="text-red-400 font-bold">{item.fraudRate}%</span>
          </div>
          <div className="text-slate-500 text-[10px] mt-1 pt-1 border-t border-slate-800">
            Total transactions of this type: {formatNumber(item.totalCount)}
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
          data={formattedData}
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
            tickFormatter={(val) => `${val}`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey="fraudCount"
            name="Confirmed Fraud Cases"
            fill="#ef4444"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
