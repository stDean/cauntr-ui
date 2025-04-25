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

const RevenueChart = () => {
  // Chart data
  const data = [
    { product: "iPhone 16", revenue: 900000 },
    { product: "iPhone 16", revenue: 800000 },
    { product: "iPhone 12", revenue: 700000 },
    { product: "iPhone 13 Pro Max", revenue: 600000 },
    { product: "PlayStation 5", revenue: 500000 },
    { product: "Tesla Model 3", revenue: 400000 },
    { product: "Nintendo Switch", revenue: 300000 },
    { product: "Samsung Galaxy S21 Ultra", revenue: 200000 },
    { product: "Dyson Airwrap", revenue: 100000 },
    { product: 'MacBook Pro 16"', revenue: 0 }, // "NO" entry
  ];

  // Custom format for revenue values
  const formatRevenue = (value: any) => `N${value / 10000}k`;

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
            domain={[0, 1000000]}
            tick={{ fontSize: 13 }}
          />
          <YAxis
            type="category"
            dataKey="product"
            width={150}
            tick={{ fontSize: 12 }}
          />
          <Tooltip
            formatter={(value) => [formatRevenue(value), "Revenue"]}
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
