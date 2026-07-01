import { db } from "../../../lib/db";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        {
          authenticated: false,
          user: null,
        },
        {
          status: 401,
        }
      );
    }

    let decoded: any;

    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!);
    } catch {
      return NextResponse.json(
        {
          authenticated: false,
          user: null,
        },
        {
          status: 401,
        }
      );
    }

    const [rows]: any = await db.query(
      `SELECT
        id,
        nom,
        prenom,
        email,
        telephone,
        role,
        image_url
      FROM users
      WHERE id = ?`,
      [decoded.id]
    );

    if (!rows.length) {
      return NextResponse.json(
        {
          authenticated: false,
          user: null,
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      authenticated: true,
      user: rows[0],
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        authenticated: false,
        user: null,
      },
      {
        status: 500,
      }
    );
  }
}