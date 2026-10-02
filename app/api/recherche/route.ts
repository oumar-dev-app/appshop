import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: Request) {

    try {

        const { searchParams } = new URL(req.url);

        const query = searchParams.get("query");

        // si vide
        if (!query) {
            return NextResponse.json([]);
        }

        // REQUETE MYSQL
        const [rows]: any = await db.query(
            `
            SELECT *
            FROM produits
            WHERE nom LIKE ?
            LIMIT 10
            `,
            [`%${query}%`]
        );

        return NextResponse.json(rows);

    } catch (error) {

        console.error(error);

        return NextResponse.json(
            { message: "Erreur serveur" },
            { status: 500 }
        );
    }
}