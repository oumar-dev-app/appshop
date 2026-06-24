import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json(
                { message: "Email et mot de passe requis" },
                { status: 400 }
            )
        }

        const [rows]: any = await db.query(
            "SELECT * FROM users WHERE email=?",
            [email]
        );

        if (!rows.length) {
            return NextResponse.json(
                { message: "Identifient incorrect" },
                { status: 404 }
            )
        }

        const user = rows[0];

        const isValid = await bcrypt.compare(password, user.password);

        if (!isValid) {
            return NextResponse.json(
                { message: "Mot de passe incorrect" },
                { status: 404 }
            )
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET!,
            { expiresIn: "1d" }
        );

        return NextResponse.json({
            message: "Connexion réussie",
            token,
            user: {
                id: user.id,
                nom: user.nom,
                email: user.email,
                role: user.role
            },
        });

    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { message: "Erreur serveur" },
            { status: 500 }
        )
    }
}
