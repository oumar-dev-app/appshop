import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// CREATE
export async function POST(req: Request) {
  try {
    const { image_url, title, description } = await req.json();

    // Vérification champs obligatoires
    if (!image_url || !title || !description) {
      return NextResponse.json(
        { message: "Tous les champs sont requis !" },
        { status: 400 }
      );
    }

    // Vérification type string
    if (
      typeof image_url !== "string" ||
      typeof title !== "string" ||
      typeof description !== "string"
    ) {
      return NextResponse.json(
        { message: "Format invalide" },
        { status: 400 }
      );
    }

    // Nettoyage
    const cleanTitle = title.trim();
    const cleanDescription = description.trim();
    const cleanImageUrl = image_url.trim();

    // Vérification longueur
    if (cleanTitle.length < 3 || cleanTitle.length > 100) {
      return NextResponse.json(
        { message: "Titre invalide" },
        { status: 400 }
      );
    }

    if (
      cleanDescription.length < 5 ||
      cleanDescription.length > 500
    ) {
      return NextResponse.json(
        { message: "Description invalide" },
        { status: 400 }
      );
    }

    // Vérification extension image
    if (!cleanImageUrl.startsWith("https://")) {
      return NextResponse.json(
        { message: "URL image invalide" },
        { status: 400 }
      );
    }

    // Vérification doublon
    const [existing]: any = await db.query(
      "SELECT id FROM hombar WHERE title = ?",
      [cleanTitle]
    );

    if (existing.length > 0) {
      return NextResponse.json(
        { message: "Ce titre existe déjà" },
        { status: 409 }
      );
    }

    // Insertion
    await db.query(
      "INSERT INTO hombar (image_url, title, description) VALUES (?, ?, ?)",
      [cleanImageUrl, cleanTitle, cleanDescription]
    );

    return NextResponse.json(
      { message: "Enregistrement avec succès" },
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

// READ
export async function GET() {
  try {
    const [rows]: any = await db.query(
      "SELECT * FROM hombar ORDER BY id DESC"
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