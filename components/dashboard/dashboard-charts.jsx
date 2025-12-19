"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Jan", revenue: 4000 },
  { name: "Feb", revenue: 3000 },
  { name: "Mar", revenue: 5000 },
  { name: "Apr", revenue: 4500 },
  { name: "May", revenue: 6000 },
  { name: "Jun", revenue: 5500 },
  { name: "Jul", revenue: 7000 },
  { name: "Aug", revenue: 6500 },
  { name: "Sep", revenue: 8000 },
  { name: "Oct", revenue: 7500 },
  { name: "Nov", revenue: 9000 },
  { name: "Dec", revenue: 8500 },
];

export function DashboardCharts() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue Overview</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient
                  id="colorRevenue"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor="oklch(0.55 0.2 270)"
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="95%"
                    stopColor="oklch(0.55 0.2 270)"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                stroke="oklch(0.9 0.005 260)"
              />

              <XAxis
                dataKey="name"
                stroke="oklch(0.5 0.02 260)"
                fontSize={12}
              />

              <YAxis
                stroke="oklch(0.5 0.02 260)"
                fontSize={12}
                tickFormatter={(value) => `₹${value}`}
              />

              <Tooltip
                contentStyle={{
                  backgroundColor: "oklch(1 0 0)",
                  border: "1px solid oklch(0.92 0.005 260)",
                  borderRadius: "8px",
                }}
                formatter={(value) => [
                  `₹${Number(value).toLocaleString()}`,
                  "Revenue",
                ]}
              />

              <Area
                type="monotone"
                dataKey="revenue"
                stroke="oklch(0.55 0.2 270)"
                strokeWidth={2}
                fill="url(#colorRevenue)"
                fillOpacity={1}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
