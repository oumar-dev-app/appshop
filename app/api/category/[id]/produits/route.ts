import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const categoryId = Number(id);

    if (isNaN(categoryId)) {
      return NextResponse.json(
        { message: "ID invalide" },
        { status: 400 }
      );
    }

    const [rows]: any = await db.query(
      "SELECT * FROM produits WHERE category_id = ?",
      [categoryId]
    );

    return NextResponse.json(
      { data: rows },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    );
  }
}
