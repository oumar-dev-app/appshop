"use client";

import { useEffect, useState } from "react";
import {
    FaBox,
    FaCalendarDay,
    FaClock,
    FaCheckCircle,
    FaArrowUp,
    FaShoppingBag,
} from "react-icons/fa";

type Stats = {
    total: number;
    today: number;
    delivered: number;
    pending: number;

    totalPrice: number;
    todayPrice: number;
    pendingPrice: number;
};

export default function DashboardPage() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem("token");

                const res = await fetch(
                    "/api/commandes/countCommande",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (!res.ok) {
                    throw new Error("Erreur API dashboard");
                }

                const data = await res.json();
                setStats(data);
            } catch (err) {
                console.error(err);
                setError(
                    "Impossible de charger les statistiques"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return (
            <main className="min-h-screen bg-[#fdfaf7] p-6">
                <div className="mx-auto max-w-7xl">
                    <div className="animate-pulse space-y-6">
                        <div className="h-8 w-64 rounded-lg bg-[#eadfd8]" />

                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
                            {[1, 2, 3, 4].map((item) => (
                                <div
                                    key={item}
                                    className="h-36 rounded-2xl bg-white shadow-sm"
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="min-h-screen bg-[#fdfaf7] p-6">
                <div className="mx-auto max-w-7xl">
                    <div className="rounded-2xl border border-[#eadfd8] bg-white p-6 shadow-sm">
                        <p className="text-sm text-[#a94b4b]">
                            {error}
                        </p>
                    </div>
                </div>
            </main>
        );
    }

    if (!stats) return null;

    const cards = [
        {
            title: "Total commandes",
            value: stats.total,
            amount: stats.totalPrice,
            icon: FaBox,
            iconBg: "bg-[#f2e5e1]",
            iconColor: "text-[#a66a4c]",
        },
        {
            title: "Commandes du jour",
            value: stats.today,
            amount: stats.todayPrice,
            icon: FaCalendarDay,
            iconBg: "bg-[#ead8c0]",
            iconColor: "text-[#7d4d38]",
        },
        {
            title: "En attente",
            value: stats.pending,
            amount: stats.pendingPrice,
            icon: FaClock,
            iconBg: "bg-[#f7f0e9]",
            iconColor: "text-[#a66a4c]",
        },
        {
            title: "Commandes livrées",
            value: stats.delivered,
            amount: null,
            icon: FaCheckCircle,
            iconBg: "bg-[#f2e5e1]",
            iconColor: "text-[#547a5b]",
        },
    ];

    return (
        <main className="min-h-screen bg-[#fdfaf7]">
            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

                {/* HEADER */}
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#a66a4c]">
                            Mini Luxe Parfum
                        </p>

                        <h1 className="text-2xl font-semibold text-[#2b211f] sm:text-3xl">
                            Tableau de bord
                        </h1>

                        <p className="mt-2 text-sm text-[#6f625d]">
                            Suivez l'activité de votre boutique et vos commandes.
                        </p>
                    </div>

                    <div className="flex items-center gap-2 rounded-full border border-[#eadfd8] bg-white px-4 py-2 shadow-sm">
                        <FaShoppingBag className="text-[#a66a4c]" />
                        <span className="text-sm font-medium text-[#5a4740]">
                            Activité commerciale
                        </span>
                    </div>
                </div>

                {/* STATISTIQUES */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
                    {cards.map((card) => {
                        const Icon = card.icon;

                        return (
                            <div
                                key={card.title}
                                className="
                                    group
                                    rounded-2xl
                                    border
                                    border-[#eadfd8]
                                    bg-white
                                    p-5
                                    shadow-[0_8px_30px_rgba(75,49,39,0.06)]
                                    transition-all
                                    duration-300
                                    hover:-translate-y-1
                                    hover:shadow-[0_14px_35px_rgba(75,49,39,0.10)]
                                "
                            >
                                <div className="flex items-start justify-between">
                                    <div
                                        className={`flex h-12 w-12 items-center justify-center rounded-xl ${card.iconBg}`}
                                    >
                                        <Icon
                                            className={`text-xl ${card.iconColor}`}
                                        />
                                    </div>

                                    <FaArrowUp className="text-sm text-[#d8b58a] transition-transform duration-300 group-hover:-translate-y-1" />
                                </div>

                                <div className="mt-5">
                                    <p className="text-sm font-medium text-[#6f625d]">
                                        {card.title}
                                    </p>

                                    <h2 className="mt-1 text-3xl font-semibold text-[#2b211f]">
                                        {card.value.toLocaleString()}
                                    </h2>

                                    {card.amount !== null && (
                                        <p className="mt-2 text-sm font-medium text-[#a66a4c]">
                                            {card.amount.toLocaleString()} FCFA
                                        </p>
                                    )}

                                    {card.amount === null && (
                                        <p className="mt-2 text-sm text-[#8b7d77]">
                                            Commandes terminées
                                        </p>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* RESUME */}
                <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">

                    <div className="rounded-2xl border border-[#eadfd8] bg-white p-6 shadow-[0_8px_30px_rgba(75,49,39,0.06)]">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#a66a4c]">
                                    Aujourd'hui
                                </p>

                                <h2 className="mt-2 text-xl font-semibold text-[#2b211f]">
                                    Activité du jour
                                </h2>
                            </div>

                            <FaCalendarDay className="text-2xl text-[#d8b58a]" />
                        </div>

                        <div className="mt-6 rounded-xl bg-[#f7f0e9] p-5">
                            <p className="text-sm text-[#6f625d]">
                                Chiffre des commandes du jour
                            </p>

                            <p className="mt-2 text-2xl font-semibold text-[#7d4d38]">
                                {stats.todayPrice.toLocaleString()} FCFA
                            </p>

                            <p className="mt-1 text-sm text-[#8b7d77]">
                                {stats.today.toLocaleString()} commande
                                {stats.today > 1 ? "s" : ""}
                            </p>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-[#eadfd8] bg-white p-6 shadow-[0_8px_30px_rgba(75,49,39,0.06)]">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#a66a4c]">
                                    À traiter
                                </p>

                                <h2 className="mt-2 text-xl font-semibold text-[#2b211f]">
                                    Commandes en attente
                                </h2>
                            </div>

                            <FaClock className="text-2xl text-[#d8b58a]" />
                        </div>

                        <div className="mt-6 rounded-xl bg-[#f7f0e9] p-5">
                            <p className="text-sm text-[#6f625d]">
                                Montant actuellement en attente
                            </p>

                            <p className="mt-2 text-2xl font-semibold text-[#7d4d38]">
                                {stats.pendingPrice.toLocaleString()} FCFA
                            </p>

                            <p className="mt-1 text-sm text-[#8b7d77]">
                                {stats.pending.toLocaleString()} commande
                                {stats.pending > 1 ? "s" : ""} à traiter
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </main>
    );
}