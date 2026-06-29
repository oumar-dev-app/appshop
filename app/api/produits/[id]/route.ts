import { NextResponse } from "next/server";
import { db } from "../../../../lib/db";

/* ================= GET PRODUIT ================= */
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params; // ✅ IMPORTANT

    const numericId = Number(id);

    if (isNaN(numericId)) {
      return NextResponse.json(
        { message: "ID invalide" },
        { status: 400 }
      );
    }

    const [rows]: any = await db.query(
      "SELECT * FROM produits WHERE id = ?",
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
    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    );
  }
}
/* ================= PUT PRODUIT ================= */
export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const numericId = Number(id);

    if (isNaN(numericId)) {
      return NextResponse.json(
        { message: "ID invalide" },
        { status: 400 }
      );
    }

    const { nom, description, stock, prix, image_url } = await req.json();

    if (
      nom === undefined ||
      description === undefined ||
      stock === undefined ||
      prix === undefined ||
      image_url === undefined
    ) {
      return NextResponse.json(
        { message: "Tous les champs sont requis" },
        { status: 400 }
      );
    }

    if (isNaN(Number(stock)) || isNaN(Number(prix))) {
      return NextResponse.json(
        { message: "Stocke et prix doivent être des nombres" },
        { status: 400 }
      );
    }

    const [result]: any = await db.query(
      `UPDATE produits
      SET nom=?, description=?, stock=?, prix=?, image_url=?
      WHERE id=?`,
      [nom, description, stock, prix, image_url, id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { message: "Produit introuvable" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Produit modifié avec succès" },
      { status: 200 }
    );

  } catch (error: any) {
    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    );
  }
}

/* ================= DELETE PRODUIT ================= */
export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const data = await context.params;
    const id = Number(data.id);

    await db.query("DELETE FROM produits WHERE id=?", [id]);

    return NextResponse.json(
      { message: "Produit supprimé" },
      { status: 200 }
    );

  } catch (error: any) {
    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    );
  }
}
