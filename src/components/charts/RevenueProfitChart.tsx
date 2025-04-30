"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import React from "react";

const RevenueProfitChart = () => {
  const data = [
    { month: "Jan", revenue: 320000, profit: 160000 },
    { month: "Feb", revenue: 280000, profit: 140000 },
    { month: "Mar", revenue: 350000, profit: 160000 },
    { month: "Apr", revenue: 220000, profit: 170000 },
    { month: "May", revenue: 400000, profit: 170000 },
    { month: "Jun", revenue: 450000, profit: 170000 },
    { month: "Jul", revenue: 380000, profit: 120000 },
    { month: "Aug", revenue: 420000, profit: 130000 },
    { month: "Sep", revenue: 440000, profit: 140000 },
    { month: "Oct", revenue: 460000, profit: 150000 },
    { month: "Nov", revenue: 520000, profit: 160000 },
    { month: "Dec", revenue: 580000, profit: 140000 },
  ];

  // Currency formatter
  const formatCurrency = (value: any) =>
    value === 0 ? "N0.00" : `N${(value / 1000).toFixed(0)}k`;

  return (
    <div
      style={{ width: "100%", height: 400 }}
      className="border rounded-lg p-2"
    >
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
          <YAxis tickFormatter={formatCurrency} domain={[0, 750000]} />
          <Tooltip
            formatter={(value) => formatCurrency(value)}
            labelStyle={{ fontWeight: "bold" }}
          />
          <Legend verticalAlign="top" wrapperStyle={{ paddingBottom: 20 }} />

          {/* Revenue (base bar) */}

          <Bar
            dataKey="revenue"
            name="Revenue"
            fill="#766FFB"
            stackId="a"
            barSize={25}
            radius={[0, 0, 0, 0]} // Bottom corners rounded
          />

          {/* Profit (stacked on top) */}
          <Bar
            dataKey="profit"
            name="Profit"
            fill="#FDD487"
            stackId="a"
            barSize={25}
            radius={[4, 4, 0, 0]} // Top corners rounded
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueProfitChart;
