import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

const SECRET = process.env.JWT_SECRET!;

export async function PUT(req: Request) {
    try {
        const token = req.headers.get("Authorization")?.split(" ")[1];

        if (!token) {
            return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
        }

        const decoded: any = jwt.verify(token, SECRET);
        const userId = decoded.id;

        const { oldPassword, newPassword } = await req.json();

        if (!oldPassword || !newPassword) {
            return NextResponse.json({ message: "Tous les champs sont obligatoires" }, { status: 400 });
        }

        const [rows]: any = await db.query("SELECT id, password FROM users WHERE id = ?", [userId]);

        if (rows.length === 0) {
            return NextResponse.json({ message: "Utilisateur introuvable" }, { status: 404 });
        }

        const user = rows[0];
        const isMatch = await bcrypt.compare(oldPassword, user.password);

        if (!isMatch) {
            return NextResponse.json({ message: "Mot de passe actuel incorrect" }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await db.query("UPDATE users SET password = ? WHERE id = ?", [hashedPassword, userId]);

        return NextResponse.json({ message: "Mot de passe modifié avec succès" }, { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
    }
}