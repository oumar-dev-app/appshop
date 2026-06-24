
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { db } from "@/lib/db";


export async function GET(req: Request) {
  try{
    const [rows] : any = await db.query(
      "SELECT * FROM commandes"
    );

    return NextResponse.json (
      {data: rows},
      {status: 200}
    )

  }catch(error){
    console.error(error);
    return NextResponse.json(
      {message: "Erreur serveur"},
      {status: 500}
    )
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

    let decoded: any;

    try {
      decoded = jwt.verify(
        token,
        process.env.JWT_SECRET!
      );
    } catch {
      return NextResponse.json(
        { message: "Token invalide" },
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
    // 💰 Calcul total sécurisé
    // =========================
    let total = 0;

    for (const item of produits) {

      const [rows]: any = await db.query(
        "SELECT * FROM produits WHERE id = ?",
        [item.produit_id]
      );

      const produit = rows[0];

      // Produit introuvable
      if (!produit) {
        return NextResponse.json(
          {
            message: `Produit ${item.produit_id} introuvable`,
          },
          { status: 404 }
        );
      }

      // Stock insuffisant
      if (produit.stock < item.quantite) {
        return NextResponse.json(
          {
            message: `Stock insuffisant pour ${produit.nom}`,
          },
          { status: 400 }
        );
      }

      // Calcul total
      total += produit.prix * item.quantite;
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
        "pending",
        nom_client,
        telephone,
        addresse,
        gps,
        mode_commande,
      ]
    );

    const commandeId =
      commandeResult.insertId;

    // =========================
    // 📦 Insertion items
    // =========================
    for (const item of produits) {

      const [rows]: any = await db.query(
        "SELECT * FROM produits WHERE id = ?",
        [item.produit_id]
      );

      const produit = rows[0];

      // Insert item
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
          item.produit_id,
          item.quantite,
          produit.prix,
        ]
      );

      // Update stock
      await db.query(
        `
        UPDATE produits
        SET stock = stock - ?
        WHERE id = ?
        `,
        [
          item.quantite,
          item.produit_id,
        ]
      );
    }

    // =========================
    // ✅ Succès
    // =========================
    return NextResponse.json({
      success: true,
      message: "Commande créée avec succès",
      reference,
      total,
      commande_id: commandeId,
    });

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Erreur serveur",
      },
      { status: 500 }
    );
  }
}

