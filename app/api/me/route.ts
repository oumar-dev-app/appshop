import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { db } from "@/lib/db";

export async function GET() {
    const token = (await cookies()).get("token")?.value;

    if (!token) {
        return NextResponse.json({ user: null }, { status: 401 });
    }

    try {
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

        const [rows]: any = await db.query(
            "SELECT id, nom, prenom, image_url, role FROM users WHERE id = ?",
            [decoded.id]
        );

        return NextResponse.json({ user: rows[0] });
    } catch (err) {
        return NextResponse.json({ user: null }, { status: 401 });
    }
}