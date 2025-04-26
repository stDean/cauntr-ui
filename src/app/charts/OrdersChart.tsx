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

const OrdersChart = () => {
  const data = [
    { month: "Jan", orders: 45 },
    { month: "Feb", orders: 62 },
    { month: "Mar", orders: 78 },
    { month: "Apr", orders: 53 },
    { month: "May", orders: 89 },
    { month: "Jun", orders: 92 },
    { month: "Jul", orders: 105 },
    { month: "Aug", orders: 98 },
    { month: "Sep", orders: 84 },
    { month: "Oct", orders: 76 },
    { month: "Nov", orders: 110 },
    { month: "Dec", orders: 127 },
  ];

  return (
    <div
      className="border rounded-lg p-4"
      style={{ width: "100%", height: 400 }}
    >
      <h2 className="text-lg font-semibold mb-4">No of Orders - 2025</h2>
      <ResponsiveContainer width="100%" height="90%">
        <BarChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 12 }}
            label={{ value: "Month", position: "bottom" }}
          />
          <YAxis
            label={{
              value: "Number of Orders",
              angle: -90,
              position: "left",
              offset: 10,
            }}
            allowDecimals={false}
          />
          <Tooltip
            formatter={(value) => [`${value} orders`, ""]}
            labelStyle={{ fontWeight: "bold" }}
          />
          <Bar
            dataKey="orders"
            name="Orders"
            fill="#766FFB"
            barSize={25}
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default OrdersChart;
