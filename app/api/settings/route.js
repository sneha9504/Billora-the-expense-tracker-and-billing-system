import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";

/* ---------------- GET: Fetch Settings ---------------- */
export async function GET() {
  try {
    const db = await getDatabase();

    const settings = await db
      .collection("settings")
      .findOne({ type: "shop" });

    return NextResponse.json(settings || {});
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

/* ---------------- POST: Save / Update Settings ---------------- */
export async function POST(request) {
  try {
    const db = await getDatabase();
    const data = await request.json();

    await db.collection("settings").updateOne(
      { type: "shop" },
      {
        $set: {
          ...data,
          type: "shop",
          updatedAt: new Date(),
        },
      },
      { upsert: true }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
