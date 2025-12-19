import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

/* ---------------- GET: Fetch Expenses ---------------- */
export async function GET(request) {
  try {
    const db = await getDatabase();
    const { searchParams } = new URL(request.url);

    const category = searchParams.get("category");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    const query = {};

    if (category && category !== "all") {
      query.category = category;
    }

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const expenses = await db
      .collection("expenses")
      .find(query)
      .sort({ date: -1 })
      .toArray();

    return NextResponse.json(expenses);
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

/* ---------------- POST: Add Expense ---------------- */
export async function POST(request) {
  try {
    const db = await getDatabase();
    const data = await request.json();

    const expense = {
      ...data,
      amount: parseFloat(data.amount) || 0,
      date: new Date(data.date),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db
      .collection("expenses")
      .insertOne(expense);

    return NextResponse.json({
      ...expense,
      _id: result.insertedId,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

/* ---------------- DELETE: Remove Expense ---------------- */
export async function DELETE(request) {
  try {
    const db = await getDatabase();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Expense ID is required" },
        { status: 400 }
      );
    }

    await db
      .collection("expenses")
      .deleteOne({ _id: new ObjectId(id) });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
