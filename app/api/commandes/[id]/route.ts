import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// =========================
// GET ONE COMMANDE
// =========================

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const data = await context.params;
    const commandeId = Number(data.id);

    if (!Number.isInteger(commandeId) || commandeId <= 0) {
      return NextResponse.json(
        { message: "ID invalide !" },
        { status: 400 }
      );
    }

    const [rows]: any = await db.query(
      `
      SELECT 
          c.id AS commande_id,
          c.reference,
          c.total,
          c.mode_commande,
          c.status,
          c.created_at,

          u.id AS user_id,
          u.nom AS user_nom,
          u.prenom,
          u.telephone,

          p.id AS produit_id,
          p.nom AS produit_nom,
          p.prix AS produit_prix,

          ci.quantite,
          ci.prix_unitaire

      FROM commandes c
      JOIN users u ON c.user_id = u.id
      LEFT JOIN commande_items ci ON c.id = ci.commande_id
      LEFT JOIN produits p ON ci.produit_id = p.id
      WHERE c.id = ?
      `,
      [commandeId]
    );

    if (!rows || rows.length === 0) {
      return NextResponse.json(
        { message: "Commande introuvable" },
        { status: 404 }
      );
    }

    // =========================
    // COMMANDE
    // =========================

    const commande = {
      id: rows[0].commande_id,
      reference: rows[0].reference,
      total: Number(rows[0].total),
      mode_commande: rows[0].mode_commande,
      status: rows[0].status,
      created_at: rows[0].created_at,
    };

    // =========================
    // CLIENT
    // =========================

    const user = {
      id: rows[0].user_id,
      nom: rows[0].user_nom,
      prenom: rows[0].prenom,
      telephone: rows[0].telephone,
    };

    // =========================
    // PRODUITS
    // =========================

    const produits = rows
      .filter((row: any) => row.produit_id !== null)
      .map((row: any) => ({
        nom: row.produit_nom,
        quantite: Number(row.quantite),
        prix_unitaire: Number(
          row.prix_unitaire ?? row.produit_prix
        ),
      }));

    return NextResponse.json({
      commande,
      user,
      produits,
    });
  } catch (error) {
    console.error(
      "Erreur GET commande :",
      error
    );

    return NextResponse.json(
      { message: "Erreur serveur" },
      { status: 500 }
    );
  }
}

// =========================
// DELETE
// =========================

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const data = await context.params;
    const id = Number(data.id);

    if (!Number.isInteger(id) || id <= 0) {
      return NextResponse.json(
        { message: "ID invalide !" },
        { status: 400 }
      );
    }

    const [result]: any = await db.query(
      "DELETE FROM commandes WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { message: "Commande introuvable" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Commande supprimée",
    });
  } catch (error) {
    console.error(
      "Erreur DELETE commande :",
      error
    );

    return NextResponse.json(
      { message: "Erreur serveur" },
      { status: 500 }
    );
  }
}

// =========================
// PUT — CHANGEMENT DE STATUT
// =========================

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const data = await context.params;
    const id = Number(data.id);

    if (!Number.isInteger(id) || id <= 0) {
      return NextResponse.json(
        { message: "ID invalide !" },
        { status: 400 }
      );
    }

    const body = await req.json();

    const requestedStatus = body?.status;

    if (
      typeof requestedStatus !== "string" ||
      requestedStatus.trim() === ""
    ) {
      return NextResponse.json(
        { message: "Le statut est obligatoire." },
        { status: 400 }
      );
    }

    const status = requestedStatus.trim();

    // =========================
    // STATUTS AUTORISÉS
    // =========================

    const validStatuses = [
      "en_attente",
      "confirmee",
      "en_preparation",
      "expediee",
      "livree",
      "recuperee",
      "annulee",
    ];

    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        {
          message:
            "Statut de commande invalide.",
        },
        { status: 400 }
      );
    }

    // =========================
    // RÉCUPÉRER LA COMMANDE
    // =========================

    const [rows]: any = await db.query(
      `
      SELECT
        id,
        status,
        mode_commande
      FROM commandes
      WHERE id = ?
      LIMIT 1
      `,
      [id]
    );

    if (!rows || rows.length === 0) {
      return NextResponse.json(
        { message: "Commande introuvable." },
        { status: 404 }
      );
    }

    const currentStatus = rows[0].status;
    const modeCommande = rows[0].mode_commande;

    // =========================
    // EMPÊCHER LES STATUTS
    // INCOMPATIBLES AVEC LE MODE
    // =========================

    if (
      modeCommande === "commande" &&
      ["expediee", "livree"].includes(status)
    ) {
      return NextResponse.json(
        {
          message:
            "Une commande en retrait boutique ne peut pas être expédiée ou livrée.",
        },
        { status: 400 }
      );
    }

    if (
      modeCommande === "livraison" &&
      status === "recuperee"
    ) {
      return NextResponse.json(
        {
          message:
            "Une commande en livraison ne peut pas être marquée comme récupérée.",
        },
        { status: 400 }
      );
    }

    // =========================
    // EMPÊCHER LES TRANSITIONS
    // INCOHÉRENTES
    // =========================

    const transitions: Record<
      string,
      string[]
    > = {
      en_attente: [
        "confirmee",
        "annulee",
      ],

      confirmee: [
        "en_preparation",
        "annulee",
      ],

      en_preparation:
        modeCommande === "livraison"
          ? ["expediee", "annulee"]
          : ["recuperee", "annulee"],

      expediee: [
        "livree",
        "annulee",
      ],

      livree: [],

      recuperee: [],

      annulee: [],
    };

    // Autoriser le même statut
    // sans erreur.
    if (status !== currentStatus) {
      const allowedNextStatuses =
        transitions[currentStatus] || [];

      if (
        !allowedNextStatuses.includes(status)
      ) {
        return NextResponse.json(
          {
            message: `Transition impossible : "${currentStatus}" → "${status}".`,
          },
          { status: 400 }
        );
      }
    }

    // =========================
    // MISE À JOUR
    // =========================

    await db.query(
      `
      UPDATE commandes
      SET status = ?
      WHERE id = ?
      `,
      [status, id]
    );

    return NextResponse.json({
      success: true,
      message:
        "Statut de la commande mis à jour.",
      commande_id: id,
      ancien_status: currentStatus,
      nouveau_status: status,
      mode_commande: modeCommande,
    });
  } catch (error) {
    console.error(
      "Erreur PUT commande :",
      error
    );

    return NextResponse.json(
      { message: "Erreur serveur" },
      { status: 500 }
    );
  }
}