import { NextResponse } from "next/server";
import { db } from "@/lib/db";

/* ================= GET ================= */


export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await params;
    const categoryId = Number(data.id);

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



/* ================= PUT ================= */
export async function PUT(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const data = await params;

        const id = Number(data.id);

        if (isNaN(id)) {
            return NextResponse.json(
                { message: "ID invalide" },
                { status: 400 }
            );
        }

        const { nom, image_url} = await req.json();

        if (!nom || !image_url ) {
            return NextResponse.json(
                { message: "Tous les champs sont requis" },
                { status: 400 }
            );
        }

        const [result]: any = await db.query(
            `UPDATE category 
             SET  nom = ?, image_url = ?
             WHERE id = ?`,
            [nom, image_url,  id]
        );

        if (result.affectedRows === 0) {
            return NextResponse.json(
                { message: "Categories introuvable" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: "Categories modifié avec succès" },
            { status: 200 }
        );

    } catch (error: any) {
        return NextResponse.json(
            { message: error.message },
            { status: 500 }
        );
    }
}

/* ================= DELETE ================= */
export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const data = await params;
        const id = Number(data.id);

        if (isNaN(id)) {
            return NextResponse.json(
                { message: "ID invalide" },
                { status: 400 }
            );
        }

        const [result]: any = await db.query(
            "DELETE FROM category WHERE id = ?",
            [id]
        );

        if (result.affectedRows === 0) {
            return NextResponse.json(
                { message: "Categories introuvable" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: "Categories supprimé avec succè" },
            { status: 200 }
        );

    } catch (error: any) {
        return NextResponse.json(
            { message: error.message },
            { status: 500 }
        );
    }
}