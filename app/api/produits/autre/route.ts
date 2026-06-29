import { NextResponse } from "next/server";
import { db } from "../../../../lib/db";



// READ
export async function GET(req: Request) {
  try {
    const [rows] = await db.query(
      "SELECT * FROM produits where section = autre"
    );

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
