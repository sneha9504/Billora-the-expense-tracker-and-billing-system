"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"

export function RecentTransactions({ transactions }) {
  const statusVariants = {
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
          <p className="py-8 text-center text-sm text-muted-foreground">
            No transactions yet
          </p>
        ) : (
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between border-b border-border py-2 last:border-0"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
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
                  <Badge
                    variant={statusVariants[transaction.status] || "default"}
                    className="capitalize"
                  >
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
