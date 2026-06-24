import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const commandeId = Number(id);

    if (isNaN(commandeId)) {
      return NextResponse.json(
        { message: "ID invalide" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { status } = body;

    const allowedStatus = [
      "pending",
      "confirmed",
      "preparing",
      "shipped",
      "delivered",
      "picked_up",
      "cancelled",
    ];

    if (!status || !allowedStatus.includes(status)) {
      return NextResponse.json(
        { message: "Status invalide" },
        { status: 400 }
      );
    }

    await db.query(
      `
      UPDATE commandes
      SET status = ?
      WHERE id = ?
      `,
      [status, commandeId]
    );

    return NextResponse.json({
      message: "Statut mis à jour avec succès",
      status,
      id: commandeId,
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Erreur serveur" },
      { status: 500 }
    );
  }
}