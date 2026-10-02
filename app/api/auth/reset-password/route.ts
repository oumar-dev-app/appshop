import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const token = String(body?.token || "").trim();
    const password = String(body?.password || "");

    if (!token || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Token et nouveau mot de passe requis.",
        },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Le mot de passe doit contenir au moins 6 caractères.",
        },
        { status: 400 }
      );
    }

    const tokenHash = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const [rows]: any = await db.query(
      `
        SELECT id, user_id
        FROM password_reset_tokens
        WHERE token_hash = ?
          AND used_at IS NULL
          AND expires_at > NOW()
        LIMIT 1
      `,
      [tokenHash]
    );

    if (!rows.length) {
      return NextResponse.json(
        {
          success: false,
          message: "Ce lien est invalide ou a expiré.",
        },
        { status: 400 }
      );
    }

    const resetToken = rows[0];

    const hashedPassword = await bcrypt.hash(password, 12);

    await db.query(
      `
        UPDATE users
        SET password = ?
        WHERE id = ?
      `,
      [hashedPassword, resetToken.user_id]
    );

    await db.query(
      `
        UPDATE password_reset_tokens
        SET used_at = NOW()
        WHERE id = ?
      `,
      [resetToken.id]
    );

    return NextResponse.json({
      success: true,
      message: "Votre mot de passe a été réinitialisé avec succès.",
    });
  } catch (error) {
    console.error("Erreur reset-password :", error);

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
