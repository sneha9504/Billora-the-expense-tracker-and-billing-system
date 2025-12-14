import { NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function GET(request) {
  try {
    const db = await getDatabase()
    const { searchParams } = new URL(request.url)
    const paymentMode = searchParams.get("paymentMode")
    const status = searchParams.get("status")
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")

    const query = {}

    if (paymentMode && paymentMode !== "all") {
      query.paymentMode = paymentMode
    }

    if (status && status !== "all") {
      query.status = status
    }

    if (startDate || endDate) {
      query.createdAt = {}
      if (startDate) query.createdAt.$gte = new Date(startDate)
      if (endDate) query.createdAt.$lte = new Date(endDate)
    }

    const transactions = await db.collection("transactions").find(query).sort({ createdAt: -1 }).toArray()

    return NextResponse.json(transactions)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const db = await getDatabase()
    const data = await request.json()

    const transaction = {
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    // Update product stock
    for (const item of data.items) {
      await db
        .collection("products")
        .updateOne({ _id: new ObjectId(item.productId) }, { $inc: { stock: -item.quantity } })
    }

    const result = await db.collection("transactions").insertOne(transaction)

    return NextResponse.json({ ...transaction, _id: result.insertedId })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(request) {
  try {
    const db = await getDatabase()
    const data = await request.json()
    const { _id, ...updateData } = data

    updateData.updatedAt = new Date()

    await db.collection("transactions").updateOne({ _id: new ObjectId(_id) }, { $set: updateData })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
