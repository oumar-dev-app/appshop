import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const [totalRows]: any = await db.query(
            "SELECT COUNT(*) AS total FROM produits"
        );

        const [inStockRows]: any = await db.query(
            "SELECT COUNT(*) AS inStock FROM produits WHERE stock > 0"
        );

        const [outOfStockRows]: any = await db.query(
            "SELECT COUNT(*) AS outOfStock FROM produits WHERE stock = 0"
        );

        const [stockValueRows]: any = await db.query(
            "SELECT COALESCE(SUM(prix),0) AS stockValue FROM produits"
        );

        const [maxPriceRows]: any = await db.query(
            "SELECT COALESCE(MAX(prix),0) AS maxPrice FROM produits"
        );

        const [minPriceRows]: any = await db.query(
            "SELECT COALESCE(MIN(prix),0) AS minPrice FROM produits"
        );

        return NextResponse.json({
            total: totalRows?.[0]?.total ?? 0,
            inStock: inStockRows?.[0]?.inStock ?? 0,
            outOfStock: outOfStockRows?.[0]?.outOfStock ?? 0,
            stockValue: stockValueRows?.[0]?.stockValue ?? 0,
            maxPrice: maxPriceRows?.[0]?.maxPrice ?? 0,
            minPrice: minPriceRows?.[0]?.minPrice ?? 0,
        });

    } catch (error: any) {
        console.error(error);

        return NextResponse.json(
            { message: error.message },
            { status: 500 }
        );
    }
}