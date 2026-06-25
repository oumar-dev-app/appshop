import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(req: Request) {
    const authHeader = req.headers.get("authorization");

    if (!authHeader) {
        return NextResponse.json({ user: null }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

        const [rows]: any = await db.query(
            `SELECT id, nom, prenom, email, role, image_url 
             FROM users 
             WHERE id = ?`,
            [decoded.id]
        );

        if (!rows.length) {
            return NextResponse.json({ user: null }, { status: 404 });
        }

        return NextResponse.json({ user: rows[0] });

    } catch (err) {
        return NextResponse.json({ user: null }, { status: 401 });
    }
}