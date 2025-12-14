"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"

interface BudgetProgressProps {
  totalSpent: number
  totalRevenue: number
  savingsPercentage: number
}

export function BudgetProgress({ totalSpent, totalRevenue, savingsPercentage }: BudgetProgressProps) {
  const profit = totalRevenue - totalSpent
  const data = [
    { name: "Spent", value: totalSpent },
    { name: "Saved", value: profit > 0 ? profit : 0 },
  ]

  const COLORS = ["oklch(0.55 0.2 25)", "oklch(0.6 0.18 145)"]

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Budget Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center">
          <div className="relative h-[180px] w-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {data.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-card-foreground">{savingsPercentage}%</span>
              <span className="text-sm text-muted-foreground">Saved</span>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4 w-full">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Total Spent</p>
              <p className="text-lg font-semibold text-destructive">₹{totalSpent.toLocaleString()}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Profit</p>
              <p className="text-lg font-semibold text-success">₹{profit > 0 ? profit.toLocaleString() : 0}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
