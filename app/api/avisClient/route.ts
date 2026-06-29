import { NextResponse } from "next/server";
import { db } from "../../../lib/db";

export async function GET(req: Request) {
    try {

        const [rows] : any = await db.query(
            "SELECT * FROM avisClient"
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