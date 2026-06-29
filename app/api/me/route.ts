import { db } from "../../../lib/db";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(req: Request) {
    try {
        const authHeader = req.headers.get("authorization");

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return NextResponse.json(
                { user: null, authenticated: false },
                { status: 401 }
            );
        }

        const token = authHeader.split(" ")[1];

        if (!token) {
            return NextResponse.json(
                { user: null, authenticated: false },
                { status: 401 }
            );
        }

        let decoded: any;

        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET!);
        } catch (error) {
            return NextResponse.json(
                { user: null, authenticated: false, message: "Token invalide" },
                { status: 401 }
            );
        }

        const [rows]: any = await db.query(
            `SELECT id, nom, prenom, email, role, image_url 
             FROM users 
             WHERE id = ?`,
            [decoded.id]
        );

        if (!rows.length) {
            return NextResponse.json(
                { user: null, authenticated: false },
                { status: 404 }
            );
        }

        return NextResponse.json({
            user: rows[0],
            authenticated: true,
        });

    } catch (err) {
        console.error(err);

        return NextResponse.json(
            { user: null, authenticated: false },
            { status: 500 }
        );
    }
}