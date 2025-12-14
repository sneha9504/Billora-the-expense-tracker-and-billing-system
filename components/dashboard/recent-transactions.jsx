import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"

interface Transaction {
  id: string
  invoice_number: string
  customer_name: string | null
  created_at: string
  total_amount: number
  status: string
}

interface RecentTransactionsProps {
  transactions: Transaction[]
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  const statusVariants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
    success: "default",
    pending: "secondary",
    delayed: "outline",
    failed: "destructive",
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">No transactions yet</p>
        ) : (
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between py-2 border-b border-border last:border-0"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-medium text-sm">
                    {transaction.invoice_number.slice(-3)}
                  </div>
                  <div>
                    <p className="font-medium text-card-foreground">
                      {transaction.customer_name || "Walk-in Customer"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(transaction.created_at), "dd/MM/yyyy")}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-card-foreground">
                    ₹{Number(transaction.total_amount).toLocaleString()}
                  </p>
                  <Badge variant={statusVariants[transaction.status] || "default"} className="capitalize">
                    {transaction.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
