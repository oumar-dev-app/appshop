import { NextResponse } from "next/server";
import { db } from "../../../lib/db";
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

        const token = authHeader.split(" ")[1];

        const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

        const [rows]: any = await db.query(
            "SELECT id, nom, prenom, email, telephone, role, image_url FROM users WHERE id = ?",
            [decoded.id]
        );

        if (!rows.length) {
            return NextResponse.json(
                { message: "Utilisateur introuvable" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            user: rows[0]
        });

    } catch (error) {
        return NextResponse.json(
            { message: "Token invalide" },
            { status: 401 }
        );
    }
}