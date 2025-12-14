"use client"

import { Wallet, TrendingDown, TrendingUp, PieChart } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"
import { PieChart as RechartsPie, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

const categoryColors = {
  rent: "#6366f1",
  utilities: "#22c55e",
  salaries: "#3b82f6",
  inventory: "#eab308",
  marketing: "#ef4444",
  maintenance: "#8b5cf6",
  transport: "#10b981",
  other: "#6b7280",
}

export default function ExpensesOverview({ totalExpenses, monthlyExpenses, monthlyRevenue, expenses }) {
  const profit = monthlyRevenue - monthlyExpenses

  // Group expenses by category for pie chart
  const categoryData = expenses.reduce((acc, expense) => {
    const existing = acc.find((item) => item.name === expense.category)
    if (existing) {
      existing.value += expense.amount
    } else {
      acc.push({
        name: expense.category,
        value: expense.amount,
        color: categoryColors[expense.category] || "#6b7280",
      })
    }
    return acc
  }, [])

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-destructive/10">
              <Wallet className="h-6 w-6 text-destructive" />
            </div>
            <div>
              <p className="text-2xl font-bold">{formatCurrency(totalExpenses)}</p>
              <p className="text-sm text-muted-foreground">Total Expenses</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-warning/10">
              <TrendingDown className="h-6 w-6 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold">{formatCurrency(monthlyExpenses)}</p>
              <p className="text-sm text-muted-foreground">This Month</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-lg ${profit >= 0 ? "bg-success/10" : "bg-destructive/10"}`}
            >
              {profit >= 0 ? (
                <TrendingUp className="h-6 w-6 text-success" />
              ) : (
                <TrendingDown className="h-6 w-6 text-destructive" />
              )}
            </div>
            <div>
              <p className={`text-2xl font-bold ${profit >= 0 ? "text-success" : "text-destructive"}`}>
                {formatCurrency(Math.abs(profit))}
              </p>
              <p className="text-sm text-muted-foreground">{profit >= 0 ? "Net Profit" : "Net Loss"}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pie Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="h-5 w-5" />
            Expense Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          {categoryData.length > 0 ? (
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPie>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Legend />
                </RechartsPie>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex h-[250px] items-center justify-center text-muted-foreground">
              No expense data for this month
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
