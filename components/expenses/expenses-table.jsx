"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Trash2,
  MoreHorizontal,
  RefreshCw,
  Loader2,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { format } from "date-fns"

export function ExpensesTable({ expenses }) {
  const [search, setSearch] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [deleteExpense, setDeleteExpense] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const router = useRouter()

  const itemsPerPage = 10

  // Filter expenses
  const filteredExpenses = expenses.filter((expense) => {
    const matchesSearch =
      expense.category.toLowerCase().includes(search.toLowerCase()) ||
      expense.vendor?.toLowerCase().includes(search.toLowerCase()) ||
      expense.description?.toLowerCase().includes(search.toLowerCase())

    const matchesCategory =
      categoryFilter === "all" || expense.category === categoryFilter

    return matchesSearch && matchesCategory
  })

  // Pagination
  const totalPages = Math.ceil(filteredExpenses.length / itemsPerPage)
  const paginatedExpenses = filteredExpenses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  // Get used categories
  const usedCategories = [...new Set(expenses.map((e) => e.category))]

  const handleDelete = async () => {
    if (!deleteExpense) return
    setDeleting(true)

    const supabase = createClient()
    const { error } = await supabase
      .from("expenses")
      .delete()
      .eq("id", deleteExpense.id)

    if (error) {
      toast.error(error.message)
    } else {
      toast.success("Expense deleted successfully!")
      router.refresh()
    }

    setDeleteExpense(null)
    setDeleting(false)
  }

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 p-4 border-b border-border">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by category, vendor, or notes..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setCurrentPage(1)
            }}
            className="pl-9"
          />
        </div>

        <Select
          value={categoryFilter}
          onValueChange={(value) => {
            setCategoryFilter(value)
            setCurrentPage(1)
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {usedCategories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                Date
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                Category
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                Vendor
              </th>
              <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">
                Amount
              </th>
              <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">
                Payment
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                Notes
              </th>
              <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {paginatedExpenses.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-12 text-center text-muted-foreground"
                >
                  {expenses.length === 0
                    ? "No expenses recorded yet"
                    : "No expenses match your filters"}
                </td>
              </tr>
            ) : (
              paginatedExpenses.map((expense, index) => (
                <tr
                  key={expense.id}
                  className={cn(
                    "border-b border-border hover:bg-muted/50 transition-colors",
                    index % 2 === 0 && "bg-muted/20"
                  )}
                >
                  <td className="px-4 py-3 text-sm">
                    <p className="font-medium text-card-foreground">
                      {format(new Date(expense.date), "dd MMM yyyy")}
                    </p>
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">
                        {expense.category}
                      </Badge>
                      {expense.is_recurring && (
                        <RefreshCw
                          className="h-3 w-3 text-muted-foreground"
                          title="Recurring expense"
                        />
                      )}
                    </div>
                  </td>

                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {expense.vendor || "-"}
                  </td>

                  <td className="px-4 py-3 text-right">
                    <p className="font-semibold text-destructive">
                      ₹{Number(expense.amount).toLocaleString()}
                    </p>
                  </td>

                  <td className="px-4 py-3 text-center">
                    <span className="text-sm capitalize text-muted-foreground">
                      {expense.payment_mode.replace("_", " ")}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-sm text-muted-foreground max-w-[200px] truncate">
                    {expense.description || "-"}
                  </td>

                  <td className="px-4 py-3 text-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() =>
                            setDeleteExpense(expense)
                          }
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
            {Math.min(
              currentPage * itemsPerPage,
              filteredExpenses.length
            )}{" "}
            of {filteredExpenses.length} expenses
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

      {/* Delete Dialog */}
      <AlertDialog
        open={!!deleteExpense}
        onOpenChange={(open) =>
          !open && setDeleteExpense(null)
        }
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete Expense
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this expense?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteExpense(null)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
