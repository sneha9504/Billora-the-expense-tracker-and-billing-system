"use client";

import { useState, useEffect } from "react";
import {
  ShoppingBag,
  IndianRupee,
  TrendingUp,
  Package,
  Clock,
  AlertTriangle,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import StatsCard from "@/components/dashboard/stats-card";
import { formatCurrency, formatDateTime } from "@/lib/utils";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  async function fetchDashboardData() {
    try {
      const res = await fetch("/api/dashboard");
      const result = await res.json();
      setData(result);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here&apos;s your business overview.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Today's Orders"
          value={data?.todayOrders || 0}
          icon={ShoppingBag}
          trend={12}
          trendUp
        />
        <StatsCard
          title="Today's Revenue"
          value={formatCurrency(data?.todayRevenue || 0)}
          icon={IndianRupee}
          trend={8}
          trendUp
        />
        <StatsCard
          title="Avg. Order Value"
          value={formatCurrency(
            data?.todayOrders
              ? data.todayRevenue / data.todayOrders
              : 0
          )}
          icon={TrendingUp}
        />
        <StatsCard
          title="Products Sold"
          value={data?.productsSold || 0}
          icon={Package}
          subtitle={`${data?.lowStockCount || 0} low stock items`}
        />
      </div>

      {/* Charts & Pending */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Revenue Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data?.chartData || []}>
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
                        stopColor="hsl(var(--primary))"
                        stopOpacity={0.3}
                      />
                      <stop
                        offset="95%"
                        stopColor="hsl(var(--primary))"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>

                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-border"
                  />

                  <XAxis
                    dataKey="date"
                    className="text-xs"
                    tickFormatter={(value) =>
                      new Date(value).toLocaleDateString("en-IN", {
                        weekday: "short",
                      })
                    }
                  />

                  <YAxis
                    className="text-xs"
                    tickFormatter={(value) => `₹${value / 1000}k`}
                  />

                  <Tooltip
                    formatter={(value) => [
                      formatCurrency(value),
                      "Revenue",
                    ]}
                    labelFormatter={(label) =>
                      new Date(label).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                      })
                    }
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />

                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="hsl(var(--primary))"
                    fill="url(#colorRevenue)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Pending Transactions */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-warning" />
              Pending
            </CardTitle>
            <Badge variant="outline">{data?.pendingCount || 0}</Badge>
          </CardHeader>

          <CardContent className="space-y-3">
            {data?.pendingTransactions?.slice(0, 4).map((t) => (
              <div
                key={t._id}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <div>
                  <p className="font-medium">{t.billNumber}</p>
                  <p className="text-xs text-muted-foreground">
                    {t.customerName || "Walk-in"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">
                    {formatCurrency(t.total)}
                  </p>
                  <Badge variant="secondary" className="text-xs">
                    {t.paymentMode}
                  </Badge>
                </div>
              </div>
            ))}

            {(!data?.pendingTransactions ||
              data.pendingTransactions.length === 0) && (
              <p className="text-center text-sm text-muted-foreground">
                No pending transactions
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent & Summary */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Transactions */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Transactions</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <a href="/dashboard/transactions">View All</a>
            </Button>
          </CardHeader>

          <CardContent className="space-y-3">
            {data?.recentTransactions?.map((t) => (
              <div
                key={t._id}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <ShoppingBag className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{t.billNumber}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDateTime(t.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">
                    {formatCurrency(t.total)}
                  </p>
                  <Badge
                    variant={
                      t.status === "completed" ? "default" : "secondary"
                    }
                    className={
                      t.status === "completed"
                        ? "bg-success text-success-foreground"
                        : ""
                    }
                  >
                    {t.status}
                  </Badge>
                </div>
              </div>
            ))}

            {(!data?.recentTransactions ||
              data.recentTransactions.length === 0) && (
              <p className="text-center text-sm text-muted-foreground">
                No transactions yet
              </p>
            )}
          </CardContent>
        </Card>

        {/* Monthly Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Summary</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Revenue</span>
                <span className="font-semibold text-success">
                  {formatCurrency(data?.monthlyRevenue || 0)}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">Expenses</span>
                <span className="font-semibold text-destructive">
                  {formatCurrency(data?.totalExpenses || 0)}
                </span>
              </div>

              <div className="h-px bg-border" />

              <div className="flex justify-between">
                <span className="font-medium">Net Profit</span>
                <span
                  className={cn(
                    "font-bold",
                    (data?.profit || 0) >= 0
                      ? "text-success"
                      : "text-destructive"
                  )}
                >
                  {formatCurrency(data?.profit || 0)}
                </span>
              </div>
            </div>

            {/* Budget */}
            <div className="space-y-3 pt-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  Monthly Budget
                </span>
                <span className="font-medium">
                  {formatCurrency(50000)}
                </span>
              </div>

              <div className="h-3 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{
                    width: `${Math.min(
                      ((data?.totalExpenses || 0) / 50000) * 100,
                      100
                    )}%`,
                  }}
                />
              </div>

              <p className="text-xs text-muted-foreground">
                {formatCurrency(data?.totalExpenses || 0)} spent of{" "}
                {formatCurrency(50000)}
              </p>
            </div>

            {data?.lowStockCount > 0 && (
              <div className="flex items-center gap-2 rounded-lg border border-warning/50 bg-warning/10 p-3">
                <AlertTriangle className="h-5 w-5 text-warning" />
                <div>
                  <p className="text-sm font-medium">
                    {data.lowStockCount} items low in stock
                  </p>
                  <a
                    href="/dashboard/products"
                    className="text-xs text-primary hover:underline"
                  >
                    View products
                  </a>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

/* Utility */
function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}
