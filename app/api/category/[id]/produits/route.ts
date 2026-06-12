import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {

    const { id } = await params;

    const [rows]: any = await db.query(
      "SELECT * FROM produits WHERE category_id = ?",
      [id]
    );

    return NextResponse.json(
      { data: rows },
      { status: 200 }
    );

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      { message: "Erreur serveur" },
      { status: 500 }
    );
  }
}