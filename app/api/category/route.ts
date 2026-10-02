import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// CREATE
export async function POST(req: Request) {
    try {
        const { nom, image_url } = await req.json();

        // Vérification champs obligatoires
        if (!nom || !image_url) {
            return NextResponse.json(
                { message: "Tous les champs sont requis !" },
                { status: 400 }
            );
        }

        // Vérification type string
        if (
            typeof nom !== "string" ||
            typeof image_url !== "string"
        ) {
            return NextResponse.json(
                { message: "Format invalide" },
                { status: 400 }
            );
        }

        // Nettoyage
        const cleanNom = nom.trim();
        const cleanImageUrl = image_url.trim();

        // Vérification longueur
        if (cleanNom.length < 3 || cleanNom.length > 100) {
            return NextResponse.json(
                { message: "Nom invalide" },
                { status: 400 }
            );
        }

        // Vérification extension image
        if (!cleanImageUrl.match(/\.(jpg|jpeg|png|webp|gif)$/i)) {
            return NextResponse.json(
                { message: "URL image invalide" },
                { status: 400 }
            );
        }

        // Vérification doublon
        const [existing]: any = await db.query(
            "SELECT id FROM category WHERE nom = ?",
            [cleanNom]
        );

        if (existing.length > 0) {
            return NextResponse.json(
                { message: "Cette catégorie existe déjà" },
                { status: 409 }
            );
        }

        // Insertion
        await db.query(
            "INSERT INTO category (nom, image_url) VALUES (?, ?)",
            [cleanNom, cleanImageUrl]
        );

        return NextResponse.json(
            { message: "Enregistrement avec succès" },
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

// READ
export async function GET() {
    try {
        const [rows]: any = await db.query(
            "SELECT * FROM category ORDER BY id DESC"
        );

        return NextResponse.json(
            { data: rows },
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