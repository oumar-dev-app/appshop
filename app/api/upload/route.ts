import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { fileTypeFromBuffer } from "file-type";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { message: "Aucun fichier" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // validation type image
    const type = await fileTypeFromBuffer(buffer);

    if (!type || !type.mime.startsWith("image/")) {
      return NextResponse.json(
        { message: "Fichier non valide" },
        { status: 400 }
      );
    }

    // taille max 5MB
    if (buffer.length > 5 * 1024 * 1024) {
      return NextResponse.json(
        { message: "Image trop lourde" },
        { status: 400 }
      );
    }

    const fileName = `${Date.now()}-${Math.random()
      .toString(36)
      .slice(2)}.${type.ext}`;

    const uploadPath = path.join(process.cwd(), "public/images");

    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    fs.writeFileSync(path.join(uploadPath, fileName), buffer);

    return NextResponse.json({
      imageUrl: `/images/${fileName}`,
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Erreur upload image" },
      { status: 500 }
    );
  }
}