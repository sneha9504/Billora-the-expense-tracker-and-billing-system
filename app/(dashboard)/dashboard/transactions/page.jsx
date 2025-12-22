import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/dashboard/header"
import { TransactionsTable } from "@/components/transactions/transactions-table"
import { CreditCard, DollarSign, Banknote, Smartphone } from "lucide-react"

export default async function TransactionsPage() {
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

  let transactions = []

  if (shop?.id) {
    const { data: transactionsData } = await supabase
      .from("transactions")
      .select("*")
      .eq("shop_id", shop.id)
      .order("created_at", { ascending: false })

    if (transactionsData) {
      transactions = transactionsData
    }
  }

  // Calculate stats
  const totalTransactions = transactions.length

  const totalRevenue = transactions
    .filter((t) => t.status === "success")
    .reduce((sum, t) => sum + Number(t.total_amount), 0)

  const cashTotal = transactions
    .filter(
      (t) => t.payment_mode === "cash" && t.status === "success",
    )
    .reduce((sum, t) => sum + Number(t.total_amount), 0)

  const onlineTotal = transactions
    .filter(
      (t) =>
        (t.payment_mode === "card" || t.payment_mode === "upi") &&
        t.status === "success",
    )
    .reduce((sum, t) => sum + Number(t.total_amount), 0)

  return (
    <div className="flex flex-col">
      <Header
        title="Transactions"
        description="View and manage your sales history"
        userEmail={user?.email}
      />

      <div className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <CreditCard className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Total Transactions
                </p>
                <p className="text-2xl font-bold text-card-foreground">
                  {totalTransactions}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10 text-success">
                <DollarSign className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Total Revenue
                </p>
                <p className="text-2xl font-bold text-card-foreground">
                  ₹{totalRevenue.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-4/20 text-chart-4">
                <Banknote className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Cash Collected
                </p>
                <p className="text-2xl font-bold text-card-foreground">
                  ₹{cashTotal.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-3/20 text-chart-3">
                <Smartphone className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Online Received
                </p>
                <p className="text-2xl font-bold text-card-foreground">
                  ₹{onlineTotal.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="rounded-xl border border-border bg-card">
          <div className="p-4 border-b border-border">
            <h2 className="text-lg font-semibold text-card-foreground">
              Transaction History
            </h2>
          </div>
          <TransactionsTable transactions={transactions} shop={shop} />
        </div>
      </div>
    </div>
  )
}
