import { NextResponse } from "next/server";
import { put } from "@vercel/blob";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ message: "Aucun fichier" }, { status: 400 });
    }

    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return NextResponse.json(
        { message: "Token Vercel Blob manquant" },
        { status: 500 }
      );
    }

    console.log("ENV CHECK =", {
      hasToken: !!process.env.BLOB_READ_WRITE_TOKEN,
      tokenLength: process.env.BLOB_READ_WRITE_TOKEN?.length,
    });

    const blob = await put(file.name, file, {
      access: "public",
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    return NextResponse.json({
      imageUrl: blob.url,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Erreur upload image" },
      { status: 500 }
    );
  }
}