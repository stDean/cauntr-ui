"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import React from "react";
import { formatNaira } from "@/lib/utils";

interface ChartProps {
  data: { month: string; sales: number; purchases: number }[];
}

const SalesPerformanceChart = ({
  data,
}: {
  data: { month: string; sales: number; purchases: number }[];
}) => {
  // Format currency values
  const formatCurrency = (value: any) => {
    if (value >= 1_000_000) {
      return `N${(value / 1_000_000).toFixed(1)}M`;
    } else if (value >= 1_000) {
      return `N${(value / 1_000).toFixed(1)}k`;
    }
    return `N${value}`;
  };

  return (
    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer>
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 30,
            bottom: 10,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" tick={{ fontSize: 12 }} />
          <YAxis
            tickFormatter={formatCurrency}
            domain={[
              0,
              Math.max(
          ...data.map((item) => Math.max(item.sales, item.purchases))
              ),
            ]}
          />
          <Tooltip
            formatter={(value) => formatNaira(Number(value))}
            labelStyle={{ fontWeight: "bold" }}
          />
          <Bar
            dataKey="sales"
            fill="#766FFB"
            name="Sales"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="purchases"
            fill="#FDD487"
            name="Purchases"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SalesPerformanceChart;
