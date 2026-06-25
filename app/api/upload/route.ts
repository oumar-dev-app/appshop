import { NextResponse } from "next/server";
import { put } from "@vercel/blob";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { message: "Aucun fichier valide fourni." },
        { status: 400 }
      );
    }

    const token = process.env.BLOB_READ_WRITE_TOKEN;

    if (!token) {
      console.error("BLOB_READ_WRITE_TOKEN manquant");

      return NextResponse.json(
        { message: "Configuration Vercel Blob manquante." },
        { status: 500 }
      );
    }

    const blob = await put(file.name, file, {
      access: "public",
      token,
      addRandomSuffix: true,
    });

    return NextResponse.json(
      {
        success: true,
        imageUrl: blob.url,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur upload :", error);

    return NextResponse.json(
      {
        success: false,
        message: "Erreur lors de l'upload de l'image.",
      },
      { status: 500 }
    );
  }
}