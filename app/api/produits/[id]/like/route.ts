import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await db.query(
      "UPDATE produits SET jaime = jaime + 1 WHERE id = ?",
      [id]
    );

    const [rows]: any = await db.query(
      "SELECT jaime FROM produits WHERE id = ?",
      [id]
    );

    return NextResponse.json({
      likes: rows[0].jaime,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Erreur serveur" },
      { status: 500 }
    );
  }
}
