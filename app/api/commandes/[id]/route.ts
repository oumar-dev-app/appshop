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

    if (isNaN(commandeId)) {
      return NextResponse.json({ message: "ID invalide !" }, { status: 400 });
    }

    const [rows]: any = await db.query(`
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

    ci.quantite,
    ci.prix_unitaire,

    p.id AS produit_id,
    p.nom AS produit_nom

  FROM commandes c
  JOIN users u ON c.user_id = u.id
  LEFT JOIN commande_items ci ON c.id = ci.commande_id
LEFT JOIN produits p ON ci.produit_id = p.id
WHERE c.id = ?
`, [commandeId]);

    if (!rows || rows.length === 0) {
      return NextResponse.json({ message: "Commande introuvable" }, { status: 404 });
    }

    // 🧾 commande
    const commande = {
      id: rows[0].commande_id,
      reference: rows[0].reference,
      total: rows[0].total,
      status: rows[0].status,
      created_at: rows[0].created_at,
    };

    // 👤 user
    const user = {
      id: rows[0].user_id,
      nom: rows[0].user_nom,
      prenom: rows[0].prenom,
      telephone: rows[0].telephone,
    };

    // 📦 produits
    // 📦 produits
    const produits = rows
      .filter((r: any) => r.produit_id !== null)
      .map((r: any) => ({
        nom: r.produit_nom,
        quantite: r.quantite,
        prix_unitaire: r.prix_unitaire ?? r.produit_prix,
      }));

    return NextResponse.json({
      commande,
      user,
      produits,
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
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

    if (isNaN(id)) {
      return NextResponse.json({ message: "ID invalide !" }, { status: 400 });
    }

    await db.query("DELETE FROM commandes WHERE id = ?", [id]);

    return NextResponse.json({ message: "Commande supprimée" });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}

// =========================
// PUT (FIX IMPORTANT)
// =========================
export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const data = await context.params;
    const id = Number(data.id);

    if (isNaN(id)) {
      return NextResponse.json({ message: "ID invalide !" }, { status: 400 });
    }

    const body = await req.json();
    const { status, mode_commande } = body;

    await db.query(
      `
      UPDATE commandes
      SET status = ?, mode_commande = ?
      WHERE id = ?
      `,
      [status, mode_commande, id]
    );

    return NextResponse.json({ message: "Commande mise à jour" });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}
