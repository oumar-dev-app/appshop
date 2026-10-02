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

        if (!Number.isInteger(id) || id <= 0) {
            return NextResponse.json(
                { message: "ID invalide" },
                { status: 400 }
            );
        }

        const [rows]: any = await db.query(
            "SELECT * FROM hombar WHERE id = ?",
            [id]
        );

        if (rows.length === 0) {
            return NextResponse.json(
                { message: "Slider introuvable" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { data: rows[0] },
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

/* ================= PUT ================= */

export async function PUT(
    req: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const data = await context.params;
        const id = Number(data.id);

        if (!Number.isInteger(id) || id <= 0) {
            return NextResponse.json(
                { message: "ID invalide" },
                { status: 400 }
            );
        }

        const {
            image_url,
            title,
            description,
        } = await req.json();

        if (
            !image_url ||
            !title ||
            !description
        ) {
            return NextResponse.json(
                {
                    message:
                        "Tous les champs sont requis",
                },
                { status: 400 }
            );
        }

        const cleanImageUrl =
            String(image_url).trim();

        const cleanTitle =
            String(title).trim();

        const cleanDescription =
            String(description).trim();

        if (
            cleanTitle.length < 3 ||
            cleanTitle.length > 100
        ) {
            return NextResponse.json(
                {
                    message:
                        "Titre invalide",
                },
                { status: 400 }
            );
        }

        if (
            cleanDescription.length < 5 ||
            cleanDescription.length > 500
        ) {
            return NextResponse.json(
                {
                    message:
                        "Description invalide",
                },
                { status: 400 }
            );
        }

        if (
            !cleanImageUrl.match(
                /\.(jpg|jpeg|png|webp|gif)$/i
            )
        ) {
            return NextResponse.json(
                {
                    message:
                        "URL image invalide",
                },
                { status: 400 }
            );
        }

        const [existing]: any =
            await db.query(
                `
                    SELECT id
                    FROM hombar
                    WHERE title = ?
                    AND id != ?
                    LIMIT 1
                `,
                [cleanTitle, id]
            );

        if (existing.length > 0) {
            return NextResponse.json(
                {
                    message:
                        "Ce titre existe déjà",
                },
                { status: 409 }
            );
        }

        const [result]: any =
            await db.query(
                `
                    UPDATE hombar
                    SET image_url = ?,
                        title = ?,
                        description = ?
                    WHERE id = ?
                `,
                [
                    cleanImageUrl,
                    cleanTitle,
                    cleanDescription,
                    id,
                ]
            );

        if (result.affectedRows === 0) {
            return NextResponse.json(
                {
                    message:
                        "Slider introuvable",
                },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                message:
                    "Slider modifié avec succès",
            },
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

/* ================= DELETE ================= */

export async function DELETE(
    req: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const data = await context.params;
        const id = Number(data.id);

        if (!Number.isInteger(id) || id <= 0) {
            return NextResponse.json(
                { message: "ID invalide" },
                { status: 400 }
            );
        }

        const [result]: any =
            await db.query(
                "DELETE FROM hombar WHERE id = ?",
                [id]
            );

        if (result.affectedRows === 0) {
            return NextResponse.json(
                {
                    message:
                        "Slider introuvable",
                },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                message:
                    "Slider supprimé avec succès",
            },
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