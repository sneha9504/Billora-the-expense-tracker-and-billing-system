"use client"

import { useState, useEffect } from "react"
import ExpenseForm from "@/components/expenses/expense-form"
import ExpensesOverview from "@/components/expenses/expenses-overview"
import ExpensesTable from "@/components/expenses/expenses-table"

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)
  const [monthlyRevenue, setMonthlyRevenue] = useState(0)

  useEffect(() => {
    fetchExpenses()
    fetchRevenue()
  }, [])

  async function fetchExpenses() {
    try {
      const res = await fetch("/api/expenses")
      const data = await res.json()
      setExpenses(data)
    } catch (error) {
      console.error("Error fetching expenses:", error)
    } finally {
      setLoading(false)
    }
  }

  async function fetchRevenue() {
    try {
      const res = await fetch("/api/dashboard")
      const data = await res.json()
      setMonthlyRevenue(data.monthlyRevenue || 0)
    } catch (error) {
      console.error("Error fetching revenue:", error)
    }
  }

  async function handleAddExpense(expenseData) {
    try {
      const res = await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(expenseData),
      })
      if (res.ok) {
        fetchExpenses()
      }
    } catch (error) {
      console.error("Error adding expense:", error)
    }
  }

  async function handleDeleteExpense(id) {
    try {
      const res = await fetch(`/api/expenses?id=${id}`, {
        method: "DELETE",
      })
      if (res.ok) {
        fetchExpenses()
      }
    } catch (error) {
      console.error("Error deleting expense:", error)
    }
  }

  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  const monthlyExpenses = expenses.filter((e) => new Date(e.date) >= monthStart)
  const totalMonthlyExpenses = monthlyExpenses.reduce((sum, e) => sum + e.amount, 0)
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Expenses</h1>
        <p className="text-muted-foreground">Track and manage your business expenses</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Expense Form */}
        <div className="lg:col-span-1">
          <ExpenseForm onSubmit={handleAddExpense} />
        </div>

        {/* Overview */}
        <div className="lg:col-span-2">
          <ExpensesOverview
            totalExpenses={totalExpenses}
            monthlyExpenses={totalMonthlyExpenses}
            monthlyRevenue={monthlyRevenue}
            expenses={monthlyExpenses}
          />
        </div>
      </div>

      {/* Expenses Table */}
      <ExpensesTable expenses={expenses} loading={loading} onDelete={handleDeleteExpense} />
    </div>
  )
}
