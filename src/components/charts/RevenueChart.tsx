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

const RevenueChart = ({
  data,
}: {
  data: { product: string; revenue: number }[];
}) => {
  // Custom format for revenue values
  const formatRevenue = (value: number) => {
    if (value >= 1000000) {
      return `N${(value / 1000000).toFixed(1)}M`; // Format as millions
    } else if (value >= 1000) {
      return `N${(value / 1000).toFixed(1)}k`; // Format as thousands
    }
    return `N${value}`; // Format as is for smaller values
  };

  return (
    <div style={{ width: "100%", height: 400 }}>
      <ResponsiveContainer>
        <BarChart
          data={data}
          layout="vertical"
          margin={{
            top: 20,
            right: 30,
            left: 0, // Space for long product names
            bottom: 20,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            type="number"
            tickFormatter={formatRevenue}
            domain={[0, Math.max(...data.map((item) => item.revenue))]}
            tick={{ fontSize: 13 }}
          />
          <YAxis
            type="category"
            dataKey="product"
            width={150}
            tick={{ fontSize: 12 }}
          />
          <Tooltip
            formatter={(value) => [formatRevenue(value as number), "Revenue"]}
            labelStyle={{ fontWeight: "bold" }}
          />
          <Bar
            dataKey="revenue"
            fill="#3182CE" // Blue color
            radius={[0, 4, 4, 0]} // Rounded right corners
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueChart;
