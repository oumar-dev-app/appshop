import { NextResponse } from "next/server";
import { db } from "@/lib/db";


// READ

export async function GET(req: Request) {
  try {
    const [rows] = await db.query(`
      SELECT *,
      CASE
        WHEN created_at >= NOW() - INTERVAL 7 DAY
        THEN 1
        ELSE 0
      END AS isNew
      FROM produits
      WHERE section = ?
    `, ["populaire"]);

    return NextResponse.json(
      { data: rows },
      { status: 200 }
    );

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: (error as Error).message },
      { status: 500 }
    );
  }
}