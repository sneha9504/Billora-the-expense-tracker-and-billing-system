"use client"

import { useState, useEffect } from "react"
import { Receipt, IndianRupee, CreditCard, Banknote, Calendar } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import TransactionsTable from "@/components/transactions/transactions-table"
import { formatCurrency, formatDate } from "@/lib/utils"

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [paymentFilter, setPaymentFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateRange, setDateRange] = useState({ from: null, to: null })

  useEffect(() => {
    fetchTransactions()
  }, [paymentFilter, statusFilter, dateRange])

  async function fetchTransactions() {
    try {
      const params = new URLSearchParams()
      if (paymentFilter !== "all") params.append("paymentMode", paymentFilter)
      if (statusFilter !== "all") params.append("status", statusFilter)
      if (dateRange.from) params.append("startDate", dateRange.from.toISOString())
      if (dateRange.to) params.append("endDate", dateRange.to.toISOString())

      const res = await fetch(`/api/transactions?${params}`)
      const data = await res.json()
      setTransactions(data)
    } catch (error) {
      console.error("Error fetching transactions:", error)
    } finally {
      setLoading(false)
    }
  }

  const stats = {
    total: transactions.length,
    revenue: transactions.filter((t) => t.status === "completed").reduce((sum, t) => sum + t.total, 0),
    cash: transactions
      .filter((t) => t.paymentMode === "cash" && t.status === "completed")
      .reduce((sum, t) => sum + t.total, 0),
    online: transactions
      .filter((t) => ["card", "upi"].includes(t.paymentMode) && t.status === "completed")
      .reduce((sum, t) => sum + t.total, 0),
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Transactions</h1>
        <p className="text-muted-foreground">View and manage all your sales transactions</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Receipt className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-sm text-muted-foreground">Total Transactions</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-success/10">
              <IndianRupee className="h-6 w-6 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold">{formatCurrency(stats.revenue)}</p>
              <p className="text-sm text-muted-foreground">Total Revenue</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-chart-4/10">
              <Banknote className="h-6 w-6 text-chart-4" />
            </div>
            <div>
              <p className="text-2xl font-bold">{formatCurrency(stats.cash)}</p>
              <p className="text-sm text-muted-foreground">Cash Collected</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-chart-3/10">
              <CreditCard className="h-6 w-6 text-chart-3" />
            </div>
            <div>
              <p className="text-2xl font-bold">{formatCurrency(stats.online)}</p>
              <p className="text-sm text-muted-foreground">Online Payments</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4">
            <Select value={paymentFilter} onValueChange={setPaymentFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Payment Mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Payments</SelectItem>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="card">Card</SelectItem>
                <SelectItem value="upi">UPI</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-[240px] justify-start text-left font-normal bg-transparent">
                  <Calendar className="mr-2 h-4 w-4" />
                  {dateRange.from ? (
                    dateRange.to ? (
                      <>
                        {formatDate(dateRange.from)} - {formatDate(dateRange.to)}
                      </>
                    ) : (
                      formatDate(dateRange.from)
                    )
                  ) : (
                    "Select date range"
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="range"
                  selected={dateRange}
                  onSelect={setDateRange}
                  initialFocus
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
            {(dateRange.from || paymentFilter !== "all" || statusFilter !== "all") && (
              <Button
                variant="ghost"
                onClick={() => {
                  setPaymentFilter("all")
                  setStatusFilter("all")
                  setDateRange({ from: null, to: null })
                }}
              >
                Clear Filters
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <TransactionsTable transactions={transactions} loading={loading} />
    </div>
  )
}
