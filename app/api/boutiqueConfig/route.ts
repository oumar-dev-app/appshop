import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
    try {
        const [rows]: any = await db.query(
            "SELECT * FROM logoOrName LIMIT 1"
        );

        return NextResponse.json(
            { data: rows[0] || null },
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

export async function POST(req: Request) {
    try {
        const { nom, logo, apropos } = await req.json();

        const [exist]: any = await db.query(
            "SELECT id FROM logoOrName LIMIT 1"
        );

        if (exist.length > 0) {
            await db.query(
                "UPDATE logoOrName SET nom = ?, logo = ?, apropos = ? WHERE id = ?",
                [nom, logo, apropos, exist[0].id]
            );

            return NextResponse.json({
                message: "Configuration mise à jour"
            });
        }

        await db.query(
            "INSERT INTO logoOrName (nom, logo, apropos) VALUES (?, ?, ?)",
            [nom, logo]
        );

        return NextResponse.json({
            message: "Configuration enregistrée"
        });

    } catch (error) {
        console.error(error);

        return NextResponse.json(
            { message: "Erreur serveur" },
            { status: 500 }
        );
    }
}