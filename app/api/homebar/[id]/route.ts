import { NextResponse } from "next/server";
import { db } from "@/lib/db";

/* ================= GET ================= */
export async function GET(
    req: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const data = await context.params;
        const id = Number(data.id);

        if (isNaN(id)) {
            return NextResponse.json(
                { message: "ID invalide" },
                { status: 400 }
            );
        }

        const [rows]: any = await db.query(
            "SELECT * FROM homebar WHERE id = ?",
            [id]
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

/* ================= PUT ================= */
export async function PUT(
    req: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const data = await context.params;

        const id = Number(data.id);

        if (isNaN(id)) {
            return NextResponse.json(
                { message: "ID invalide" },
                { status: 400 }
            );
        }

        const { image_url, title, description } = await req.json();

        if (!image_url || !title || !description) {
            return NextResponse.json(
                { message: "Tous les champs sont requis" },
                { status: 400 }
            );
        }

        const [result]: any = await db.query(
            `UPDATE hombar
            SET image_url = ?, title = ?, description = ?
            WHERE id = ?`,
            [image_url, title, description, id]
        );

        if (result.affectedRows === 0) {
            return NextResponse.json(
                { message: "Slider introuvable" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: "Slider modifié avec succès" },
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
    context: { params: Promise<{ id: string }> }
) {
    try {
        const data = await context.params;
        const id = Number(data.id);

        if (isNaN(id)) {
            return NextResponse.json(
                { message: "ID invalide" },
                { status: 400 }
            );
        }

        const [result]: any = await db.query(
            "DELETE FROM hombar WHERE id = ?",
            [id]
        );

        if (result.affectedRows === 0) {
            return NextResponse.json(
                { message: "Slider introuvable" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: "Slider supprimé avec succè" },
            { status: 200 }
        );

    } catch (error: any) {
        return NextResponse.json(
            { message: error.message },
            { status: 500 }
        );
    }
}
