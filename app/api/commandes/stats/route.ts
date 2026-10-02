import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const [totalRows]: any = await db.query(
            "SELECT COUNT(*) AS total FROM commandes"
        );

/*         const [inStockRows]: any = await db.query(
            "SELECT COUNT(*) AS inStock FROM commandes WHERE stock > 0"
        ); */


/*         const [maxPriceRows]: any = await db.query(
            "SELECT COALESCE(MAX(prix),0) AS maxPrice FROM commandes"
        );

        const [minPriceRows]: any = await db.query(
            "SELECT COALESCE(MIN(prix),0) AS minPrice FROM commandes"
        ); */
 
        return NextResponse.json({
            total: totalRows?.[0]?.total ?? 0,
/*             inStock: inStockRows?.[0]?.inStock ?? 0, */
/*             outOfStock: outOfStockRows?.[0]?.outOfStock ?? 0, */
/*             stockValue: stockValueRows?.[0]?.stockValue ?? 0,
            maxPrice: maxPriceRows?.[0]?.maxPrice ?? 0,
            minPrice: minPriceRows?.[0]?.minPrice ?? 0, */
        });

    } catch (error: any) {
        console.error(error);

        return NextResponse.json(
            { message: error.message },
            { status: 500 }
        );
    }
}