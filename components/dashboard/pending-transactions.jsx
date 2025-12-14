import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock } from "lucide-react"
import { format } from "date-fns"

interface Transaction {
  id: string
  invoice_number: string
  created_at: string
  total_amount: number
  status: string
}

interface PendingTransactionsProps {
  transactions: Transaction[]
}

export function PendingTransactions({ transactions }: PendingTransactionsProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Pending Transactions
        </CardTitle>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">No pending transactions</p>
        ) : (
          <div className="space-y-3">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between rounded-lg border border-border p-3 bg-muted/50"
              >
                <div>
                  <p className="font-medium text-card-foreground text-sm">{transaction.invoice_number}</p>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(transaction.created_at), "dd/MM/yyyy")}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-card-foreground">
                    ₹{Number(transaction.total_amount).toLocaleString()}
                  </p>
                  <span className="text-xs text-warning capitalize">{transaction.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
