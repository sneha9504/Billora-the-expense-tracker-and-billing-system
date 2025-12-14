"use client"

import { Trash2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatCurrency, formatDate } from "@/lib/utils"

const categoryColors = {
  rent: "bg-chart-1/10 text-chart-1",
  utilities: "bg-chart-2/10 text-chart-2",
  salaries: "bg-chart-3/10 text-chart-3",
  inventory: "bg-chart-4/10 text-chart-4",
  marketing: "bg-chart-5/10 text-chart-5",
  maintenance: "bg-primary/10 text-primary",
  transport: "bg-success/10 text-success",
  other: "bg-muted-foreground/10 text-muted-foreground",
}

export default function ExpensesTable({ expenses, loading, onDelete }) {
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
    <Card>
      <CardHeader>
        <CardTitle>Expense History</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {expenses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                  No expenses recorded
                </TableCell>
              </TableRow>
            ) : (
              expenses.map((expense) => (
                <TableRow key={expense._id}>
                  <TableCell className="text-sm">{formatDate(expense.date)}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{expense.title}</p>
                      {expense.description && (
                        <p className="text-xs text-muted-foreground line-clamp-1">{expense.description}</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={categoryColors[expense.category] || categoryColors.other}>
                      {expense.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="capitalize">{expense.paymentMode?.replace("_", " ")}</TableCell>
                  <TableCell className="text-right font-semibold text-destructive">
                    -{formatCurrency(expense.amount)}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive"
                      onClick={() => onDelete(expense._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
