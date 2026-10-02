import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(req: Request) {
    try {
        const authHeader = req.headers.get("authorization");

        if (!authHeader) {
            return NextResponse.json(
                { message: "Token manquant" },
                { status: 401 }
            );
        }

        const [type, token] = authHeader.split(" ");

        if (type !== "Bearer" || !token) {
            return NextResponse.json(
                { message: "Format invalide" },
                { status: 401 }
            );
        }

        let decoded: any;

        try {
            decoded = jwt.verify(
                token,
                process.env.JWT_SECRET!
            );
        } catch {
            return NextResponse.json(
                { message: "Token invalide ou expiré" },
                { status: 401 }
            );
        }

        const userId = Number(decoded.id);

        if (!Number.isInteger(userId) || userId <= 0) {
            return NextResponse.json(
                { message: "Utilisateur invalide" },
                { status: 401 }
            );
        }

        const [rows]: any = await db.query(
            `
                SELECT
                    id,
                    nom,
                    prenom,
                    email,
                    telephone,
                    role
                FROM users
                WHERE id = ?
                LIMIT 1
            `,
            [userId]
        );

        if (!rows.length) {
            return NextResponse.json(
                { message: "Utilisateur introuvable" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                data: rows[0],
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Erreur /api/me :", error);

        return NextResponse.json(
            { message: "Erreur serveur" },
            { status: 500 }
        );
    }
}
