import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";

export async function GET() {
  try {
    const db = await getDatabase();

    // Dates
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startOfMonth = new Date(
      today.getFullYear(),
      today.getMonth(),
      1
    );

    /* ---------------- Transactions ---------------- */

    const todayTransactions = await db
      .collection("transactions")
      .find({
        createdAt: { $gte: today },
        status: "completed",
      })
      .toArray();

    const monthlyTransactions = await db
      .collection("transactions")
      .find({
        createdAt: { $gte: startOfMonth },
        status: "completed",
      })
      .toArray();

    const pendingTransactions = await db
      .collection("transactions")
      .find({ status: "pending" })
      .toArray();

    const recentTransactions = await db
      .collection("transactions")
      .find()
      .sort({ createdAt: -1 })
      .limit(5)
      .toArray();

    /* ---------------- Products ---------------- */

    const productsCount = await db
      .collection("products")
      .countDocuments();

    const lowStockCount = await db
      .collection("products")
      .countDocuments({
        $expr: { $lte: ["$stock", "$lowStockThreshold"] },
      });

    /* ---------------- Expenses ---------------- */

    const monthlyExpenses = await db
      .collection("expenses")
      .find({ date: { $gte: startOfMonth } })
      .toArray();

    /* ---------------- Calculations ---------------- */

    const todayRevenue = todayTransactions.reduce(
      (sum, t) => sum + t.total,
      0
    );

    const monthlyRevenue = monthlyTransactions.reduce(
      (sum, t) => sum + t.total,
      0
    );

    const totalExpenses = monthlyExpenses.reduce(
      (sum, e) => sum + e.amount,
      0
    );

    const productsSold = todayTransactions.reduce(
      (sum, t) =>
        sum +
        t.items.reduce((s, i) => s + i.quantity, 0),
      0
    );

    /* ---------------- Chart Data (Last 7 Days) ---------------- */

    const last7Days = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);

      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const dayTransactions = await db
        .collection("transactions")
        .find({
          createdAt: { $gte: date, $lt: nextDate },
          status: "completed",
        })
        .toArray();

      last7Days.push({
        date: date.toISOString().split("T")[0],
        revenue: dayTransactions.reduce(
          (sum, t) => sum + t.total,
          0
        ),
        transactions: dayTransactions.length,
      });
    }

    /* ---------------- Response ---------------- */

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
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
