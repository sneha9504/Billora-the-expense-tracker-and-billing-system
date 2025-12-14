import { NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"

export async function GET() {
  try {
    const db = await getDatabase()

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)

    // Get today's transactions
    const todayTransactions = await db
      .collection("transactions")
      .find({
        createdAt: { $gte: today },
        status: "completed",
      })
      .toArray()

    // Get monthly transactions
    const monthlyTransactions = await db
      .collection("transactions")
      .find({
        createdAt: { $gte: startOfMonth },
        status: "completed",
      })
      .toArray()

    // Get pending transactions
    const pendingTransactions = await db.collection("transactions").find({ status: "pending" }).toArray()

    // Get recent transactions
    const recentTransactions = await db.collection("transactions").find().sort({ createdAt: -1 }).limit(5).toArray()

    // Get products count
    const productsCount = await db.collection("products").countDocuments()
    const lowStockCount = await db.collection("products").countDocuments({
      $expr: { $lte: ["$stock", "$lowStockThreshold"] },
    })

    // Get monthly expenses
    const monthlyExpenses = await db
      .collection("expenses")
      .find({
        date: { $gte: startOfMonth },
      })
      .toArray()

    // Calculate stats
    const todayRevenue = todayTransactions.reduce((sum, t) => sum + t.total, 0)
    const monthlyRevenue = monthlyTransactions.reduce((sum, t) => sum + t.total, 0)
    const totalExpenses = monthlyExpenses.reduce((sum, e) => sum + e.amount, 0)
    const productsSold = todayTransactions.reduce((sum, t) => sum + t.items.reduce((s, i) => s + i.quantity, 0), 0)

    // Revenue by day for chart
    const last7Days = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      date.setHours(0, 0, 0, 0)
      const nextDate = new Date(date)
      nextDate.setDate(nextDate.getDate() + 1)

      const dayTransactions = await db
        .collection("transactions")
        .find({
          createdAt: { $gte: date, $lt: nextDate },
          status: "completed",
        })
        .toArray()

      last7Days.push({
        date: date.toISOString().split("T")[0],
        revenue: dayTransactions.reduce((sum, t) => sum + t.total, 0),
        transactions: dayTransactions.length,
      })
    }

    return NextResponse.json({
      todayOrders: todayTransactions.length,
      todayRevenue,
      monthlyRevenue,
      productsSold,
      productsCount,
      lowStockCount,
      pendingCount: pendingTransactions.length,
      totalExpenses,
      profit: monthlyRevenue - totalExpenses,
      recentTransactions,
      pendingTransactions,
      chartData: last7Days,
    })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
