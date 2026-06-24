import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// CREATE
export async function POST(req: Request) {

  try {
    const { nom, description, stock, prix, image_url, category_id, section } = await req.json();

    console.log({ nom, description, stock, prix, image_url, category_id });
    console.log("TYPE:", typeof category_id);

    if (
      !nom ||
      !description ||
      stock === undefined ||
      prix === undefined ||
      !category_id ||
      !section ||
      isNaN(Number(stock)) ||
      isNaN(Number(prix)) ||
      isNaN(Number(category_id))
    ) {
      return NextResponse.json(
        { message: "Tous les champs sont requis !" },
        { status: 400 }
      );
    }

    const [rows]: any = await db.query(
      "SELECT * FROM produits WHERE nom=?",
      [nom]
    );

    if (rows.length > 0) {
      return NextResponse.json(
        { message: "Produit existe déjà" },
        { status: 400 }
      );
    }

    if (
      section !== "populaire" &&
      section !== "meilleur offre" &&
      section !== "autre"
    ) {
      return NextResponse.json(
        { message: "Mode commande invalide" },
        { status: 400 }
      );
    }

    await db.query(
      "INSERT INTO produits (nom, description, stock, prix, image_url, category_id, section) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [nom, description, stock, prix, image_url, category_id, section]
    );

    return NextResponse.json(
      { message: "Produit ajoute avec succès !" },
      { status: 200 }
    );

  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { message: "Erreur serveur" },
      { status: 500 }
    );
  }
}


// READ
export async function GET() {
  try {
    const [rows]: any = await db.query(`
      SELECT *,
      CASE
        WHEN created_at >= NOW() - INTERVAL 7 DAY
        THEN TRUE
        ELSE FALSE
      END AS isNew
      FROM produits
    `);

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
