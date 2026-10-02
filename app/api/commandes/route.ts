import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const [rows]: any = await db.query(
      "SELECT * FROM commandes ORDER BY created_at DESC"
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

export async function POST(req: Request) {
  try {
    // =========================
    // 🔐 1. Vérification Token
    // =========================
    const authHeader = req.headers.get("authorization");

    if (!authHeader) {
      return NextResponse.json(
        { message: "Non autorisé" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return NextResponse.json(
        { message: "Token manquant" },
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

    const userId = decoded.id;

    // =========================
    // 📦 2. Lire body
    // =========================
    const body = await req.json();

    const {
      produits,
      nom_client,
      telephone,
      addresse,
      gps,
      mode_commande,
    } = body;

    // =========================
    // ✅ Validation panier
    // =========================
    if (
      !produits ||
      !Array.isArray(produits) ||
      produits.length === 0
    ) {
      return NextResponse.json(
        { message: "Panier vide" },
        { status: 400 }
      );
    }

    // =========================
    // ✅ Validation mode
    // =========================
    if (
      mode_commande !== "commande" &&
      mode_commande !== "livraison"
    ) {
      return NextResponse.json(
        { message: "Mode commande invalide" },
        { status: 400 }
      );
    }

    // =========================
    // 👤 Validation informations client
    // =========================
    if (!nom_client || !String(nom_client).trim()) {
      return NextResponse.json(
        { message: "Le nom du client est requis" },
        { status: 400 }
      );
    }

    if (!telephone || !String(telephone).trim()) {
      return NextResponse.json(
        { message: "Le numéro de téléphone est requis" },
        { status: 400 }
      );
    }

    // =========================
    // 🚚 Validation livraison
    // =========================
    if (mode_commande === "livraison") {
      if (!addresse || !String(addresse).trim()) {
        return NextResponse.json(
          {
            message:
              "L'adresse de livraison est requise",
          },
          { status: 400 }
        );
      }

      if (!gps || !String(gps).trim()) {
        return NextResponse.json(
          {
            message:
              "La localisation GPS est requise pour une livraison",
          },
          { status: 400 }
        );
      }
    }

    // =========================
    // 🏪 Retrait boutique
    // =========================
    const finalAddress =
      mode_commande === "livraison"
        ? String(addresse).trim()
        : "";

    const finalGps =
      mode_commande === "livraison"
        ? String(gps).trim()
        : "";

    // =========================
    // 💰 Calcul total sécurisé
    // =========================
    let total = 0;

    for (const item of produits) {
      const produitId = Number(item.produit_id);
      const quantite = Number(item.quantite);

      if (
        !Number.isInteger(produitId) ||
        !Number.isInteger(quantite) ||
        quantite <= 0
      ) {
        return NextResponse.json(
          {
            message:
              "Produit ou quantité invalide",
          },
          { status: 400 }
        );
      }

      const [rows]: any = await db.query(
        "SELECT * FROM produits WHERE id = ?",
        [produitId]
      );

      const produit = rows[0];

      // Produit introuvable
      if (!produit) {
        return NextResponse.json(
          {
            message:
              `Produit ${produitId} introuvable`,
          },
          { status: 404 }
        );
      }

      // Stock insuffisant
      if (produit.stock < quantite) {
        return NextResponse.json(
          {
            message:
              `Stock insuffisant pour ${produit.nom}`,
          },
          { status: 400 }
        );
      }

      // Calcul total avec le prix provenant de la DB
      total += Number(produit.prix) * quantite;
    }

    // =========================
    // 🧾 Génération référence
    // =========================
    const reference = `CMD-${Date.now()}`;

    // =========================
    // 🛒 Création commande
    // =========================
    const [commandeResult]: any = await db.query(
      `
      INSERT INTO commandes (
        reference,
        user_id,
        total,
        status,
        nom_client,
        telephone,
        addresse,
        gps,
        mode_commande
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        reference,
        userId,
        total,
        "en_attente",
        String(nom_client).trim(),
        String(telephone).trim(),
        finalAddress,
        finalGps,
        mode_commande,
      ]
    );

    const commandeId =
      commandeResult.insertId;

    // =========================
    // 📦 Insertion des produits
    // =========================
    for (const item of produits) {
      const produitId = Number(item.produit_id);
      const quantite = Number(item.quantite);

      const [rows]: any = await db.query(
        "SELECT * FROM produits WHERE id = ?",
        [produitId]
      );

      const produit = rows[0];

      await db.query(
        `
        INSERT INTO commande_items (
          commande_id,
          produit_id,
          quantite,
          prix_unitaire
        )
        VALUES (?, ?, ?, ?)
        `,
        [
          commandeId,
          produitId,
          quantite,
          produit.prix,
        ]
      );

      // =========================
      // 📉 Mise à jour stock
      // =========================
      await db.query(
        `
        UPDATE produits
        SET stock = stock - ?
        WHERE id = ?
        `,
        [
          quantite,
          produitId,
        ]
      );
    }

    // =========================
    // ✅ Succès
    // =========================
    return NextResponse.json(
      {
        success: true,
        message: "Commande créée avec succès",
        reference,
        total,
        commande_id: commandeId,
        mode_commande,
        status: "en_attente",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "Erreur création commande :",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Erreur serveur",
      },
      { status: 500 }
    );
  }
}