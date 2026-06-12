"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
    FaBox,
    FaCalendarDay,
    FaClock,
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

                const res = await fetch("/api/commandes/countCommande", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!res.ok) {
                    throw new Error("Erreur API dashboard");
                }

                const data = await res.json();
                setStats(data);
            } catch (err) {
                console.error(err);
                setError("Impossible de charger les statistiques");
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) return <p className="p-6">Chargement...</p>;
    if (error) return <p className="p-6 text-red-500">{error}</p>;
    if (!stats) return null;

    return (
        <div className="mx-4 sm:mx-6 lg:mx-8">
            <div className="max-w-7xl m-auto mt-4 mb-2 py-4 px-4 sm:px-6">

                <h1 className="text-lg sm:text-2xl font-semibold mb-5">
                    Dashboard commandes
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* TOTAL */}
                    <div className="border border-gray-600 shadow-lg p-4 rounded flex gap-6 items-center">
                        <FaBox className="text-3xl text-green-500" />
                        <div>
                            <p>Total commandes</p>
                            <h2 className="text-2xl font-bold">{stats.total}</h2>
                            <p className="mt-2">
                                {stats.totalPrice.toLocaleString()} FCFA
                            </p>
                        </div>
                    </div>

                    {/* TODAY */}
                    <div className="border border-gray-600 shadow-lg p-4 rounded flex gap-6 items-center">
                        <FaCalendarDay className="text-3xl text-green-500" />
                        <div>
                            <p>Commandes du jour</p>
                            <h2 className="text-2xl font-bold">{stats.today}</h2>
                            <p className="mt-2">
                                {stats.todayPrice.toLocaleString()} FCFA
                            </p>
                        </div>
                    </div>

                    {/* PENDING */}
                    <div className="border border-gray-600 shadow-lg p-4 rounded flex gap-6 items-center">
                        <FaClock className="text-3xl text-orange-500" />
                        <div>
                            <p>En attente</p>
                            <h2 className="text-2xl font-bold">{stats.pending}</h2>
                            <p className="mt-2">
                                {stats.pendingPrice.toLocaleString()} FCFA
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}