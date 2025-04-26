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

const SalesPerformanceChart = () => {
  const data = [
    { month: "Jan", sales: 150000, purchases: 90000 },
    { month: "Feb", sales: 180000, purchases: 120000 },
    { month: "Mar", sales: 220000, purchases: 150000 },
    { month: "Apr", sales: 250000, purchases: 180000 },
    { month: "May", sales: 300000, purchases: 200000 },
    { month: "Jun", sales: 350000, purchases: 220000 },
    { month: "Jul", sales: 500000, purchases: 300000 },
    { month: "Aug", sales: 450000, purchases: 280000 },
    { month: "Sep", sales: 400000, purchases: 250000 },
    { month: "Oct", sales: 380000, purchases: 240000 },
    { month: "Nov", sales: 420000, purchases: 260000 },
    { month: "Dec", sales: 480000, purchases: 290000 },
  ];

  // Format currency values
  const formatCurrency = (value: any) => `N${(value / 1000).toFixed(0)}k`;

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
          <YAxis tickFormatter={formatCurrency} domain={[0, 500000]} />
          <Tooltip
            formatter={(value) => formatCurrency(value)}
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
