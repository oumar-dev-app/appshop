import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        // =========================
        // 📦 COMMANDES
        // =========================

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
            SELECT COUNT(*) AS pending
            FROM commandes
            WHERE status = 'en_attente'
        `);

        const [deliveredRows]: any = await db.query(`
            SELECT COUNT(*) AS delivered
            FROM commandes
            WHERE status IN ('livree', 'recuperee')
        `);

        // =========================
        // 🏪 / 🚚 MODES
        // =========================

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

        // =========================
        // 📊 STATUTS
        // =========================

        const [confirmedRows]: any = await db.query(`
            SELECT COUNT(*) AS confirmed
            FROM commandes
            WHERE status = 'confirmee'
        `);

        const [preparingRows]: any = await db.query(`
            SELECT COUNT(*) AS preparing
            FROM commandes
            WHERE status = 'en_preparation'
        `);

        const [shippedRows]: any = await db.query(`
            SELECT COUNT(*) AS shipped
            FROM commandes
            WHERE status = 'expediee'
        `);

        const [cancelledRows]: any = await db.query(`
            SELECT COUNT(*) AS cancelled
            FROM commandes
            WHERE status = 'annulee'
        `);

        // =========================
        // 💰 CHIFFRE D'AFFAIRES
        // =========================

        const [totalPriceRows]: any = await db.query(`
            SELECT COALESCE(SUM(total), 0) AS totalPrice
            FROM commandes
            WHERE status != 'annulee'
        `);

        const [todayPriceRows]: any = await db.query(`
            SELECT COALESCE(SUM(total), 0) AS todayPrice
            FROM commandes
            WHERE DATE(created_at) = CURDATE()
            AND status != 'annulee'
        `);

        const [pendingPriceRows]: any = await db.query(`
            SELECT COALESCE(SUM(total), 0) AS pendingPrice
            FROM commandes
            WHERE status = 'en_attente'
        `);

        const [deliveredPriceRows]: any = await db.query(`
            SELECT COALESCE(SUM(total), 0) AS deliveredPrice
            FROM commandes
            WHERE status IN ('livree', 'recuperee')
        `);

        return NextResponse.json({
            total: Number(totalRows[0].total),
            today: Number(todayRows[0].today),

            pending: Number(pendingRows[0].pending),
            delivered: Number(deliveredRows[0].delivered),

            livraison: Number(livraisonRows[0].livraison),
            commande: Number(commandeRows[0].commande),

            confirmed: Number(confirmedRows[0].confirmed),
            preparing: Number(preparingRows[0].preparing),
            shipped: Number(shippedRows[0].shipped),
            cancelled: Number(cancelledRows[0].cancelled),

            totalPrice: Number(totalPriceRows[0].totalPrice),
            todayPrice: Number(todayPriceRows[0].todayPrice),
            pendingPrice: Number(pendingPriceRows[0].pendingPrice),
            deliveredPrice: Number(deliveredPriceRows[0].deliveredPrice),
        });
    } catch (error: any) {
        console.error(error);

        return NextResponse.json(
            {
                message: "Erreur serveur",
            },
            { status: 500 }
        );
    }
}