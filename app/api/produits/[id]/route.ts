import { NextResponse } from "next/server";
import { db } from "@/lib/db";

/* ================= GET PRODUIT ================= */
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const numericId = Number(id);

    if (!Number.isInteger(numericId) || numericId <= 0) {
      return NextResponse.json(
        { message: "ID invalide" },
        { status: 400 }
      );
    }

    const [rows]: any = await db.query(
      "SELECT * FROM produits WHERE id = ? LIMIT 1",
      [numericId]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { message: "Produit introuvable" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { data: rows[0] },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("GET produit error:", error);

    return NextResponse.json(
      {
        message: "Erreur lors de la récupération du produit",
      },
      { status: 500 }
    );
  }
}

/* ================= PUT PRODUIT ================= */
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const numericId = Number(id);

    if (!Number.isInteger(numericId) || numericId <= 0) {
      return NextResponse.json(
        { message: "ID invalide" },
        { status: 400 }
      );
    }

    const body = await req.json();

    const nom = String(body?.nom ?? "").trim();
    const description = String(body?.description ?? "").trim();
    const image_url = String(body?.image_url ?? "").trim();

    const stock = Number(body?.stock);
    const prix = Number(body?.prix);

    /* ================= VALIDATION ================= */

    if (!nom) {
      return NextResponse.json(
        { message: "Le nom du produit est requis" },
        { status: 400 }
      );
    }

    if (!Number.isFinite(stock) || stock < 0) {
      return NextResponse.json(
        { message: "Le stock doit être un nombre positif ou égal à 0" },
        { status: 400 }
      );
    }

    if (!Number.isFinite(prix) || prix < 0) {
      return NextResponse.json(
        { message: "Le prix doit être un nombre positif ou égal à 0" },
        { status: 400 }
      );
    }

    /* ================= VÉRIFICATION PRODUIT ================= */

    const [existingRows]: any = await db.query(
      "SELECT id FROM produits WHERE id = ? LIMIT 1",
      [numericId]
    );

    if (existingRows.length === 0) {
      return NextResponse.json(
        { message: "Produit introuvable" },
        { status: 404 }
      );
    }

    /* ================= MODIFICATION ================= */

    await db.query(
      `
        UPDATE produits
        SET
          nom = ?,
          description = ?,
          stock = ?,
          prix = ?,
          image_url = ?
        WHERE id = ?
      `,
      [
        nom,
        description,
        stock,
        prix,
        image_url,
        numericId,
      ]
    );

    /* ================= RÉCUPÉRATION ================= */

    const [updatedRows]: any = await db.query(
      "SELECT * FROM produits WHERE id = ? LIMIT 1",
      [numericId]
    );

    const updatedProduit = updatedRows[0];

    return NextResponse.json(
      {
        success: true,
        message: "Produit modifié avec succès",
        data: updatedProduit,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("PUT produit error:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error?.message ||
          "Erreur lors de la modification du produit",
      },
      { status: 500 }
    );
  }
}

/* ================= DELETE PRODUIT ================= */
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const numericId = Number(id);

    if (!Number.isInteger(numericId) || numericId <= 0) {
      return NextResponse.json(
        { message: "ID invalide" },
        { status: 400 }
      );
    }

    const [result]: any = await db.query(
      "DELETE FROM produits WHERE id = ?",
      [numericId]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { message: "Produit introuvable" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Produit supprimé",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("DELETE produit error:", error);

    return NextResponse.json(
      {
        message: "Erreur lors de la suppression du produit",
      },
      { status: 500 }
    );
  }
}