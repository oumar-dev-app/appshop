import { NextResponse } from "next/server";
import { db } from "../../../lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
    try {
        // Récupération des données
        const {
            nom,
            prenom,
            email,
            telephone,
            password,
            image_url
        } = await req.json();

        // Vérification des champs obligatoires
        if (!nom || !email || !password) {
            return NextResponse.json(
                {
                    message: "Les champs sont obligatoires"
                },
                {
                    status: 400
                }
            );
        }

        // Vérification si l'email existe déjà
        const [rows]: any = await db.query(
            "SELECT * FROM users WHERE email = ?",
            [email]
        );

        if (rows.length > 0) {
            return NextResponse.json(
                {
                    message: "Cet email est déjà utilisé"
                },
                {
                    status: 409
                }
            );
        }

        // Hash du mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insertion utilisateur
        await db.query(
            `INSERT INTO users 
            (nom, prenom, email, telephone, password, image_url) 
            VALUES (?, ?, ?, ?, ?, image_url)`,
            [
                nom,
                prenom,
                email,
                telephone,
                image_url,
                hashedPassword
            ]
        );

        return NextResponse.json(
            {
                message: "Compte créé avec succès"
            },
            {
                status: 201
            }
        );

    } catch (error) {
        console.error(error);

        return NextResponse.json(
            {
                message: "Erreur serveur"
            },
            {
                status: 500
            }
        );
    }
}