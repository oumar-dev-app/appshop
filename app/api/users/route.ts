import { db } from "@/lib/db";
import { NextResponse } from "next/server";

// READ
export async function GET(req: Request) {
  try {
    const [rows] = await db.query("SELECT * FROM users");

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

export async function PUT(req: Request) {
  try {
    const { id, nom, prenom, telephone, email } = await req.json();

    await db.query(
      "UPDATE users SET nom=?, prenom=?, telephone=?, email=? WHERE id=?",
      [nom, prenom, telephone, email, id]
    );

    return NextResponse.json(
      { message: "Profil mis à jour" },
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