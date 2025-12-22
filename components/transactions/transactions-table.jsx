"use client"

import { useState } from "react"
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Eye,
  Banknote,
  CreditCard,
  Smartphone,
  Calendar,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { TransactionDetailDialog } from "./transaction-detail-dialog"
import { cn } from "@/lib/utils"
import {
  format,
  isWithinInterval,
  startOfDay,
  endOfDay,
  subDays,
  startOfMonth,
  endOfMonth,
  subMonths,
} from "date-fns"

export function TransactionsTable({ transactions, shop }) {
  const [search, setSearch] = useState("")
  const [paymentFilter, setPaymentFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateRange, setDateRange] = useState(undefined)
  const [datePreset, setDatePreset] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedTransaction, setSelectedTransaction] =
    useState(null)

  const itemsPerPage = 15

  // Date presets
  const getDateRangeFromPreset = (preset) => {
    const today = new Date()

    switch (preset) {
      case "today":
        return {
          from: startOfDay(today),
          to: endOfDay(today),
        }
      case "yesterday":
        return {
          from: startOfDay(subDays(today, 1)),
          to: endOfDay(subDays(today, 1)),
        }
      case "last7days":
        return {
          from: startOfDay(subDays(today, 6)),
          to: endOfDay(today),
        }
      case "last30days":
        return {
          from: startOfDay(subDays(today, 29)),
          to: endOfDay(today),
        }
      case "thisMonth":
        return {
          from: startOfMonth(today),
          to: endOfMonth(today),
        }
      case "lastMonth":
        return {
          from: startOfMonth(subMonths(today, 1)),
          to: endOfMonth(subMonths(today, 1)),
        }
      default:
        return undefined
    }
  }

  const handleDatePresetChange = (preset) => {
    setDatePreset(preset)

    if (preset !== "custom") {
      setDateRange(getDateRangeFromPreset(preset))
      setCurrentPage(1)
    }
  }

  // Filters
  const filteredTransactions = transactions.filter(
    (transaction) => {
      const matchesSearch =
        transaction.invoice_number
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        transaction.customer_name
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        transaction.customer_phone?.includes(search)

      const matchesPayment =
        paymentFilter === "all" ||
        transaction.payment_mode === paymentFilter

      const matchesStatus =
        statusFilter === "all" ||
        transaction.status === statusFilter

      let matchesDate = true
      if (dateRange?.from && dateRange?.to) {
        const txDate = new Date(transaction.created_at)
        matchesDate = isWithinInterval(txDate, {
          start: startOfDay(dateRange.from),
          end: endOfDay(dateRange.to),
        })
      }

      return (
        matchesSearch &&
        matchesPayment &&
        matchesStatus &&
        matchesDate
      )
    }
  )

  // Pagination
  const totalPages = Math.ceil(
    filteredTransactions.length / itemsPerPage
  )
  const paginatedTransactions =
    filteredTransactions.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    )

  const statusVariants = {
    success: "default",
    pending: "secondary",
    delayed: "outline",
    failed: "destructive",
  }

  const paymentIcons = {
    cash: Banknote,
    card: CreditCard,
    upi: Smartphone,
  }

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4 p-4 border-b border-border">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by invoice, customer name or phone..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setCurrentPage(1)
            }}
            className="pl-9"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <Select
            value={paymentFilter}
            onValueChange={(value) => {
              setPaymentFilter(value)
              setCurrentPage(1)
            }}
          >
            <SelectTrigger className="w-[130px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Payment" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Payments</SelectItem>
              <SelectItem value="cash">Cash</SelectItem>
              <SelectItem value="card">Card</SelectItem>
              <SelectItem value="upi">UPI</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={statusFilter}
            onValueChange={(value) => {
              setStatusFilter(value)
              setCurrentPage(1)
            }}
          >
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="success">Success</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="delayed">Delayed</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={datePreset}
            onValueChange={handleDatePresetChange}
          >
            <SelectTrigger className="w-[140px]">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Date" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="yesterday">Yesterday</SelectItem>
              <SelectItem value="last7days">Last 7 Days</SelectItem>
              <SelectItem value="last30days">
                Last 30 Days
              </SelectItem>
              <SelectItem value="thisMonth">
                This Month
              </SelectItem>
              <SelectItem value="lastMonth">
                Last Month
              </SelectItem>
              <SelectItem value="custom">
                Custom Range
              </SelectItem>
            </SelectContent>
          </Select>

          {datePreset === "custom" && (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="gap-2 bg-transparent"
                >
                  <Calendar className="h-4 w-4" />
                  {dateRange?.from ? (
                    dateRange.to ? (
                      <>
                        {format(
                          dateRange.from,
                          "LLL dd"
                        )}{" "}
                        -{" "}
                        {format(
                          dateRange.to,
                          "LLL dd"
                        )}
                      </>
                    ) : (
                      format(
                        dateRange.from,
                        "LLL dd, y"
                      )
                    )
                  ) : (
                    "Pick dates"
                  )}
                </Button>
              </PopoverTrigger>

              <PopoverContent
                className="w-auto p-0"
                align="end"
              >
                <CalendarComponent
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange?.from}
                  selected={dateRange}
                  onSelect={(range) => {
                    setDateRange(range)
                    setCurrentPage(1)
                  }}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                Invoice
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                Date & Time
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                Customer
              </th>
              <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">
                Items
              </th>
              <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">
                Amount
              </th>
              <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">
                Payment
              </th>
              <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">
                Status
              </th>
              <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {paginatedTransactions.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="px-4 py-12 text-center text-muted-foreground"
                >
                  {transactions.length === 0
                    ? "No transactions yet. Make your first sale!"
                    : "No transactions match your filters"}
                </td>
              </tr>
            ) : (
              paginatedTransactions.map(
                (transaction, index) => {
                  const PaymentIcon =
                    paymentIcons[
                      transaction.payment_mode
                    ] || CreditCard

                  return (
                    <tr
                      key={transaction.id}
                      className={cn(
                        "border-b border-border hover:bg-muted/50 transition-colors",
                        index % 2 === 0 &&
                          "bg-muted/20"
                      )}
                    >
                      <td className="px-4 py-3">
                        <span className="font-mono text-sm font-medium text-primary">
                          {transaction.invoice_number}
                        </span>
                      </td>

                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        {format(
                          new Date(
                            transaction.created_at
                          ),
                          "dd/MM/yyyy"
                        )}
                        <br />
                        <span className="text-xs">
                          {format(
                            new Date(
                              transaction.created_at
                            ),
                            "hh:mm a"
                          )}
                        </span>
                      </td>

                      <td className="px-4 py-3">
                        <p className="font-medium text-card-foreground text-sm">
                          {transaction.customer_name ||
                            "Walk-in Customer"}
                        </p>
                        {transaction.customer_phone && (
                          <p className="text-xs text-muted-foreground">
                            {transaction.customer_phone}
                          </p>
                        )}
                      </td>

                      <td className="px-4 py-3 text-center">
                        <Badge variant="secondary">
                          {transaction.items.length} items
                        </Badge>
                      </td>

                      <td className="px-4 py-3 text-right">
                        <p className="font-semibold text-card-foreground">
                          ₹
                          {Number(
                            transaction.total_amount
                          ).toLocaleString()}
                        </p>
                      </td>

                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <PaymentIcon className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm capitalize">
                            {transaction.payment_mode}
                          </span>
                        </div>
                      </td>

                      <td className="px-4 py-3 text-center">
                        <Badge
                          variant={
                            statusVariants[
                              transaction.status
                            ] || "default"
                          }
                          className="capitalize"
                        >
                          {transaction.status}
                        </Badge>
                      </td>

                      <td className="px-4 py-3 text-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            setSelectedTransaction(
                              transaction
                            )
                          }
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  )
                }
              )
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Showing{" "}
            {(currentPage - 1) * itemsPerPage + 1} to{" "}
            {Math.min(
              currentPage * itemsPerPage,
              filteredTransactions.length
            )}{" "}
            of {filteredTransactions.length} transactions
          </p>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentPage(currentPage - 1)
              }
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <span className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>

            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentPage(currentPage + 1)
              }
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Transaction Detail Dialog */}
      {selectedTransaction && shop && (
        <TransactionDetailDialog
          transaction={selectedTransaction}
          shop={shop}
          open={!!selectedTransaction}
          onOpenChange={(open) =>
            !open && setSelectedTransaction(null)
          }
        />
      )}
    </div>
  )
}
