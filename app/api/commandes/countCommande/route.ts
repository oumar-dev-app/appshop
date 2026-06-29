import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        // 📦 Comptage commandes
        const [totalRows]: any = await db.query(`
            SELECT COUNT(*) AS total
            FROM commandes
        `);

        const [todayRows]: any = await db.query(`
            SELECT COUNT(*) AS today
            FROM commandes
            WHERE DATE(created_at) = CURDATE()
        `);

        const [pendingRows]: any = await db.query(`
            SELECT COUNT(*) AS en_attente
            FROM commandes
            WHERE status = 'en_attente'
        `);

        const [deliveredRows]: any = await db.query(`
            SELECT COUNT(*) AS livree
            FROM commandes
            WHERE status = 'livree'
        `);

        const [livraisonRows]: any = await db.query(`
            SELECT COUNT(*) AS livraison
            FROM commandes
            WHERE mode_commande = 'livraison'
        `);

        const [commandeRows]: any = await db.query(`
            SELECT COUNT(*) AS commande
            FROM commandes
            WHERE mode_commande = 'commande'
        `);

        // 💰 Chiffre d'affaires
        const [totalPriceRows]: any = await db.query(`
            SELECT COALESCE(SUM(total), 0) AS totalPrice
            FROM commandes
        `);

        const [todayPriceRows]: any = await db.query(`
            SELECT COALESCE(SUM(total), 0) AS todayPrice
            FROM commandes
            WHERE DATE(created_at) = CURDATE()
        `);

        const [pendingPriceRows]: any = await db.query(`
            SELECT COALESCE(SUM(total), 0) AS pendingPrice
            FROM commandes
            WHERE status = 'en_attente'
        `);

        const [deliveredPriceRows]: any = await db.query(`
            SELECT COALESCE(SUM(total), 0) AS deliveredPrice
            FROM commandes
            WHERE status = 'livree'
        `);
        return NextResponse.json({
            total: totalRows[0].total,
            today: todayRows[0].today,
            en_attente: pendingRows[0].en_attente,
            livree: deliveredRows[0].livree,

            livraison: livraisonRows[0].livraison,
            commande: commandeRows[0].commande,

            totalPrice: totalPriceRows[0].totalPrice,
            todayPrice: todayPriceRows[0].todayPrice,
            pendingPrice: pendingPriceRows[0].pendingPrice,
            deliveredPrice: deliveredPriceRows[0].deliveredPrice,
        });
    } catch (error: any) {
        console.error(error);

        return NextResponse.json(
            { message: error.message },
            { status: 500 }
        );
    }
}