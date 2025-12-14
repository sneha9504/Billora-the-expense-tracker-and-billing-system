"use client"

import { useState } from "react"
import { Eye, Banknote, CreditCard, Smartphone } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import TransactionDetailDialog from "@/components/transactions/transaction-detail-dialog"
import { formatCurrency, formatDateTime } from "@/lib/utils"

const paymentIcons = {
  cash: Banknote,
  card: CreditCard,
  upi: Smartphone,
}

const statusColors = {
  completed: "bg-success/10 text-success hover:bg-success/20",
  pending: "bg-warning/10 text-warning hover:bg-warning/20",
  cancelled: "bg-destructive/10 text-destructive hover:bg-destructive/20",
}

export default function TransactionsTable({ transactions, loading }) {
  const [selectedTransaction, setSelectedTransaction] = useState(null)

  if (loading) {
    return (
      <Card>
        <CardContent className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Bill Number</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[100px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-32 text-center text-muted-foreground">
                    No transactions found
                  </TableCell>
                </TableRow>
              ) : (
                transactions.map((transaction) => {
                  const PaymentIcon = paymentIcons[transaction.paymentMode] || Banknote
                  return (
                    <TableRow key={transaction._id}>
                      <TableCell className="font-mono font-medium">{transaction.billNumber}</TableCell>
                      <TableCell className="text-sm">{formatDateTime(transaction.createdAt)}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{transaction.customerName || "Walk-in"}</p>
                          {transaction.customerPhone && (
                            <p className="text-xs text-muted-foreground">{transaction.customerPhone}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{transaction.items?.length || 0} items</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <PaymentIcon className="h-4 w-4 text-muted-foreground" />
                          <span className="capitalize">{transaction.paymentMode}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-semibold">{formatCurrency(transaction.total)}</TableCell>
                      <TableCell>
                        <Badge className={statusColors[transaction.status]}>{transaction.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" onClick={() => setSelectedTransaction(transaction)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <TransactionDetailDialog
        transaction={selectedTransaction}
        open={!!selectedTransaction}
        onOpenChange={(open) => !open && setSelectedTransaction(null)}
      />
    </>
  )
}
