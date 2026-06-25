
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const [rows]: any = await db.query(
      "SELECT * FROM commandes"
    );

    return NextResponse.json(
      { data: rows },
      { status: 200 }
    )

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Erreur serveur" },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
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
    // VALIDATION PANIER
    // =========================
    if (!produits || !Array.isArray(produits) || produits.length === 0) {
      return NextResponse.json(
        { message: "Panier vide" },
        { status: 400 }
      );
    }

    // =========================
    // VALIDATION MODE
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
    // CALCUL TOTAL + CHECK STOCK
    // =========================
    let total = 0;

    for (const item of produits) {
      const [rows]: any = await db.query(
        "SELECT * FROM produits WHERE id = ?",
        [item.produit_id]
      );

      const produit = rows[0];

      if (!produit) {
        return NextResponse.json(
          { message: `Produit ${item.produit_id} introuvable` },
          { status: 404 }
        );
      }

      if (produit.stock < item.quantite) {
        return NextResponse.json(
          { message: `Stock insuffisant pour ${produit.nom}` },
          { status: 400 }
        );
      }

      total += produit.prix * item.quantite;
    }

    // =========================
    // CREATE ORDER
    // =========================
    const reference = `CMD-${Date.now()}`;

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
        null, // 👈 pas d'utilisateur connecté
        total,
        "en_attente",
        nom_client,
        telephone,
        addresse,
        gps,
        mode_commande,
      ]
    );

    const commandeId = commandeResult.insertId;

    // =========================
    // INSERT ITEMS + UPDATE STOCK
    // =========================
    for (const item of produits) {
      const [rows]: any = await db.query(
        "SELECT * FROM produits WHERE id = ?",
        [item.produit_id]
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
          item.produit_id,
          item.quantite,
          produit.prix,
        ]
      );

      await db.query(
        `
        UPDATE produits
        SET stock = stock - ?
        WHERE id = ?
        `,
        [item.quantite, item.produit_id]
      );
    }

    // =========================
    // SUCCESS
    // =========================
    return NextResponse.json({
      success: true,
      message: "Commande créée avec succès",
      reference,
      total,
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
