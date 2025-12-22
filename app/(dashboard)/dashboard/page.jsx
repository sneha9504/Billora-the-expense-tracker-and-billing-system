import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/dashboard/header"
import { StatsCard } from "@/components/dashboard/stats-card"
import { ShoppingCart, DollarSign, TrendingUp, Package } from "lucide-react"
import { DashboardCharts } from "@/components/dashboard/dashboard-charts"
import { RecentTransactions } from "@/components/dashboard/recent-transactions"
import { PendingTransactions } from "@/components/dashboard/pending-transactions"
import { BudgetProgress } from "@/components/dashboard/budget-progress"

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Get shop for user
  const { data: shop } = await supabase
    .from("shops")
    .select("*")
    .eq("user_id", user?.id)
    .single()

  const shopId = shop?.id

  // Dashboard stats
  const stats = {
    totalOrders: 0,
    totalRevenue: 0,
    avgPrice: 0,
    productsSold: 0,
  }

  let recentTransactions = []
  let pendingTransactions = []

  if (shopId) {
    // Transactions
    const { data: transactions } = await supabase
      .from("transactions")
      .select("*")
      .eq("shop_id", shopId)

    if (transactions?.length) {
      stats.totalOrders = transactions.length
      stats.totalRevenue = transactions.reduce(
        (sum, t) => sum + Number(t.total_amount),
        0,
      )
      stats.avgPrice = stats.totalRevenue / stats.totalOrders
      stats.productsSold = transactions.reduce((sum, t) => {
        const items = t.items || []
        return sum + items.reduce((s, i) => s + i.quantity, 0)
      }, 0)
    }

    // Recent transactions
    const { data: recent } = await supabase
      .from("transactions")
      .select("id, invoice_number, customer_name, created_at, total_amount, status")
      .eq("shop_id", shopId)
      .order("created_at", { ascending: false })
      .limit(5)

    if (recent) recentTransactions = recent

    // Pending transactions
    const { data: pending } = await supabase
      .from("transactions")
      .select("id, invoice_number, created_at, total_amount, status")
      .eq("shop_id", shopId)
      .in("status", ["pending", "delayed"])
      .order("created_at", { ascending: false })
      .limit(5)

    if (pending) pendingTransactions = pending
  }

  // Expenses
  let totalExpenses = 0
  if (shopId) {
    const { data: expenses } = await supabase
      .from("expenses")
      .select("amount")
      .eq("shop_id", shopId)

    if (expenses) {
      totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount), 0)
    }
  }

  const profit = stats.totalRevenue - totalExpenses
  const savingsPercentage =
    stats.totalRevenue > 0
      ? Math.round((profit / stats.totalRevenue) * 100)
      : 0

  return (
    <div className="flex flex-col">
      <Header
        title="Dashboard"
        description={
          shop ? `Welcome back to ${shop.name}` : "Set up your shop to get started"
        }
        userEmail={user?.email}
      />

      <div className="p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Orders"
            value={stats.totalOrders.toLocaleString()}
            icon={ShoppingCart}
            trend={{ value: 12, label: "from last month" }}
          />
          <StatsCard
            title="Revenue"
            value={`₹${stats.totalRevenue.toLocaleString()}`}
            icon={DollarSign}
            variant="success"
            trend={{ value: 8, label: "from last month" }}
          />
          <StatsCard
            title="Avg Price"
            value={`₹${stats.avgPrice.toFixed(2)}`}
            icon={TrendingUp}
          />
          <StatsCard
            title="Products Sold"
            value={stats.productsSold.toLocaleString()}
            icon={Package}
            variant="primary"
          />
        </div>

        {/* Charts + Pending */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <DashboardCharts />
          </div>
          <PendingTransactions transactions={pendingTransactions} />
        </div>

        {/* Recent + Budget */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <RecentTransactions transactions={recentTransactions} />
          </div>
          <BudgetProgress
            totalSpent={totalExpenses}
            totalRevenue={stats.totalRevenue}
            savingsPercentage={savingsPercentage}
          />
        </div>
      </div>
    </div>
  )
}
