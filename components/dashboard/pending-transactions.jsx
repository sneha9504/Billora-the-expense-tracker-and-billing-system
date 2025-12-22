"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock } from "lucide-react"
import { format } from "date-fns"

export function PendingTransactions({ transactions }) {
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
          <p className="py-8 text-center text-sm text-muted-foreground">
            No pending transactions
          </p>
        ) : (
          <div className="space-y-3">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between rounded-lg border border-border bg-muted/50 p-3"
              >
                <div>
                  <p className="text-sm font-medium text-card-foreground">
                    {transaction.invoice_number}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(transaction.created_at), "dd/MM/yyyy")}
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-semibold text-card-foreground">
                    ₹{Number(transaction.total_amount).toLocaleString()}
                  </p>
                  <span className="text-xs capitalize text-warning">
                    {transaction.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
