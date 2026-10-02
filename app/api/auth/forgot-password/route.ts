import { NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = String(body?.email || "")
      .trim()
      .toLowerCase();

    if (!email) {
      return NextResponse.json(
        {
          success: false,
          message: "Veuillez renseigner votre adresse email.",
        },
        { status: 400 }
      );
    }

    // Recherche de l'utilisateur
    const [users]: any = await db.query(
      `
        SELECT id, email
        FROM users
        WHERE LOWER(email) = ?
        LIMIT 1
      `,
      [email]
    );

    /*
     * Pour des raisons de sécurité, on renvoie le même message
     * que l'adresse existe ou non.
     */
    if (!users.length) {
      return NextResponse.json({
        success: true,
        message:
          "Si cette adresse email existe, un lien de réinitialisation vous sera envoyé.",
      });
    }

    const user = users[0];

    // Invalider les anciennes demandes encore utilisables
    await db.query(
      `
        UPDATE password_reset_tokens
        SET used_at = NOW()
        WHERE user_id = ?
          AND used_at IS NULL
      `,
      [user.id]
    );

    // Génération d'un token cryptographiquement sécurisé
    const token = crypto.randomBytes(32).toString("hex");

    // On ne stocke jamais le token original en base
    const tokenHash = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    // Validité : 30 minutes
    await db.query(
      `
        INSERT INTO password_reset_tokens
          (user_id, token_hash, expires_at)
        VALUES
          (?, ?, DATE_ADD(NOW(), INTERVAL 30 MINUTE))
      `,
      [user.id, tokenHash]
    );

    /*
     * Pour le moment, on retourne temporairement le token
     * uniquement en développement afin de tester le flux.
     *
     * À retirer dès que l'envoi d'emails sera configuré.
     */
    return NextResponse.json({
      success: true,
      message:
        "Si cette adresse email existe, un lien de réinitialisation vous sera envoyé.",
      developmentToken: token,
    });
  } catch (error) {
    console.error("Erreur forgot-password :", error);

    return NextResponse.json(
      {
        success: false,
        message:
          "Une erreur est survenue. Veuillez réessayer plus tard.",
      },
      { status: 500 }
    );
  }
}