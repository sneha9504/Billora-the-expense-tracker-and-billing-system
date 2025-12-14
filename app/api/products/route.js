import { NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function GET(request) {
  try {
    const db = await getDatabase()
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const search = searchParams.get("search")
    const status = searchParams.get("status")

    const query = {}

    if (category && category !== "all") {
      query.category = category
    }

    if (search) {
      query.$or = [{ name: { $regex: search, $options: "i" } }, { sku: { $regex: search, $options: "i" } }]
    }

    if (status === "low") {
      query.$expr = { $lte: ["$stock", "$lowStockThreshold"] }
    } else if (status === "out") {
      query.stock = 0
    }

    const products = await db.collection("products").find(query).sort({ createdAt: -1 }).toArray()

    return NextResponse.json(products)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const db = await getDatabase()
    const data = await request.json()

    const product = {
      ...data,
      stock: Number.parseInt(data.stock) || 0,
      price: Number.parseFloat(data.price) || 0,
      costPrice: Number.parseFloat(data.costPrice) || 0,
      lowStockThreshold: Number.parseInt(data.lowStockThreshold) || 10,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection("products").insertOne(product)

    return NextResponse.json({ ...product, _id: result.insertedId })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(request) {
  try {
    const db = await getDatabase()
    const data = await request.json()
    const { _id, ...updateData } = data

    updateData.stock = Number.parseInt(updateData.stock) || 0
    updateData.price = Number.parseFloat(updateData.price) || 0
    updateData.costPrice = Number.parseFloat(updateData.costPrice) || 0
    updateData.lowStockThreshold = Number.parseInt(updateData.lowStockThreshold) || 10
    updateData.updatedAt = new Date()

    await db.collection("products").updateOne({ _id: new ObjectId(_id) }, { $set: updateData })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request) {
  try {
    const db = await getDatabase()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    await db.collection("products").deleteOne({ _id: new ObjectId(id) })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
