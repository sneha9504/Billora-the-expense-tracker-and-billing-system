import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/dashboard/header"
import { ExpenseForm } from "@/components/expenses/expense-form"
import { ExpensesOverview } from "@/components/expenses/expenses-overview"
import { ExpensesTable } from "@/components/expenses/expenses-table"

export default async function ExpensesPage() {
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

  let expenses = []
  let totalRevenue = 0

  if (shop?.id) {
    const { data: expensesData } = await supabase
      .from("expenses")
      .select("*")
      .eq("shop_id", shop.id)
      .order("date", { ascending: false })

    if (expensesData) {
      expenses = expensesData
    }

    // Get total revenue for profit calculation
    const { data: transactions } = await supabase
      .from("transactions")
      .select("total_amount")
      .eq("shop_id", shop.id)
      .eq("status", "success")

    if (transactions) {
      totalRevenue = transactions.reduce(
        (sum, t) => sum + Number(t.total_amount),
        0
      )
    }
  }

  // Calculate expense stats
  const totalExpenses = expenses.reduce(
    (sum, e) => sum + Number(e.amount),
    0
  )

  const thisMonthExpenses = expenses
    .filter((e) => {
      const expenseDate = new Date(e.date)
      const now = new Date()
      return (
        expenseDate.getMonth() === now.getMonth() &&
        expenseDate.getFullYear() === now.getFullYear()
      )
    })
    .reduce((sum, e) => sum + Number(e.amount), 0)

  const profit = totalRevenue - totalExpenses

  // Category-wise breakdown
  const categoryBreakdown = expenses.reduce((acc, expense) => {
    acc[expense.category] =
      (acc[expense.category] || 0) + Number(expense.amount)
    return acc
  }, {})

  return (
    <div className="flex flex-col">
      <Header
        title="Expenses"
        description="Track and manage your business expenses"
        userEmail={user?.email}
      />

      <div className="space-y-6 p-6">
        <div className="grid gap-6 lg:grid-cols-5">
          {/* Left Panel - Add Expense Form */}
          <div className="lg:col-span-2">
            <ExpenseForm shopId={shop?.id} />
          </div>

          {/* Right Panel - Overview */}
          <div className="lg:col-span-3">
            <ExpensesOverview
              totalExpenses={totalExpenses}
              thisMonthExpenses={thisMonthExpenses}
              totalRevenue={totalRevenue}
              profit={profit}
              categoryBreakdown={categoryBreakdown}
            />
          </div>
        </div>

        {/* Expenses Table */}
        <div className="rounded-xl border border-border bg-card">
          <div className="border-b border-border p-4">
            <h2 className="text-lg font-semibold text-card-foreground">
              Expense History
            </h2>
          </div>
          <ExpensesTable expenses={expenses} />
        </div>
      </div>
    </div>
  )
}
