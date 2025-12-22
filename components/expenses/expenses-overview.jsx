"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Calendar,
  DollarSign,
} from "lucide-react"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts"
import { cn } from "@/lib/utils"

const COLORS = [
  "oklch(0.55 0.2 270)",
  "oklch(0.6 0.18 145)",
  "oklch(0.6 0.15 220)",
  "oklch(0.75 0.15 85)",
  "oklch(0.65 0.2 25)",
  "oklch(0.6 0.15 300)",
  "oklch(0.7 0.12 180)",
  "oklch(0.65 0.18 50)",
]

export function ExpensesOverview({
  totalExpenses,
  thisMonthExpenses,
  totalRevenue,
  profit,
  categoryBreakdown,
}) {
  const profitMargin =
    totalRevenue > 0
      ? ((profit / totalRevenue) * 100).toFixed(1)
      : 0

  // Prepare pie chart data
  const chartData = Object.entries(categoryBreakdown || {})
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8)

  return (
    <div className="space-y-4">
      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
                <Wallet className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Total Expenses
                </p>
                <p className="text-2xl font-bold text-card-foreground">
                  ₹{totalExpenses.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10 text-warning">
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  This Month
                </p>
                <p className="text-2xl font-bold text-card-foreground">
                  ₹{thisMonthExpenses.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card
          className={cn(
            profit >= 0
              ? "border-success/30 bg-success/5"
              : "border-destructive/30 bg-destructive/5"
          )}
        >
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-lg",
                  profit >= 0
                    ? "bg-success/20 text-success"
                    : "bg-destructive/20 text-destructive"
                )}
              >
                {profit >= 0 ? (
                  <TrendingUp className="h-5 w-5" />
                ) : (
                  <TrendingDown className="h-5 w-5" />
                )}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Net {profit >= 0 ? "Profit" : "Loss"}
                </p>
                <p
                  className={cn(
                    "text-2xl font-bold",
                    profit >= 0
                      ? "text-success"
                      : "text-destructive"
                  )}
                >
                  ₹{Math.abs(profit).toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Profit Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Profit Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="text-center p-4 rounded-lg bg-success/10">
              <p className="text-sm text-muted-foreground">
                Total Revenue
              </p>
              <p className="text-xl font-bold text-success">
                ₹{totalRevenue.toLocaleString()}
              </p>
            </div>
            <div className="text-center p-4 rounded-lg bg-destructive/10">
              <p className="text-sm text-muted-foreground">
                Total Expenses
              </p>
              <p className="text-xl font-bold text-destructive">
                ₹{totalExpenses.toLocaleString()}
              </p>
            </div>
            <div
              className={cn(
                "text-center p-4 rounded-lg",
                profit >= 0
                  ? "bg-primary/10"
                  : "bg-destructive/10"
              )}
            >
              <p className="text-sm text-muted-foreground">
                Profit Margin
              </p>
              <p
                className={cn(
                  "text-xl font-bold",
                  profit >= 0
                    ? "text-primary"
                    : "text-destructive"
                )}
              >
                {profitMargin}%
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Category Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Expense Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          {chartData.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">
              No expenses recorded yet
            </p>
          ) : (
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="h-[200px] w-full md:w-1/2">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {chartData.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => [
                        `₹${value.toLocaleString()}`,
                        "Amount",
                      ]}
                      contentStyle={{
                        backgroundColor: "oklch(1 0 0)",
                        border:
                          "1px solid oklch(0.92 0.005 260)",
                        borderRadius: "8px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="w-full md:w-1/2 space-y-2">
                {chartData.map((item, index) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="h-3 w-3 rounded-full"
                        style={{
                          backgroundColor:
                            COLORS[index % COLORS.length],
                        }}
                      />
                      <span className="text-muted-foreground">
                        {item.name}
                      </span>
                    </div>
                    <span className="font-medium">
                      ₹{item.value.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
