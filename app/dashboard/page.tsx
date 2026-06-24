"use client";

import { motion } from "framer-motion";
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

// 🔥 FORMAT FCFA SAFE
const formatFCFA = (value: any) =>
    new Intl.NumberFormat("fr-FR").format(Number(value || 0)) + " FCFA";

export default function DashboardPage() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const elements = document.querySelectorAll(".fade-item");

        const observer = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("show");
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.2,
            }
        );

        elements.forEach((el) => observer.observe(el));

        return () => observer.disconnect();
    }, []);
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

    if (loading) return <p className="p-6 flex justify-center items-center h-screen animate-pulse">Chargement...</p>;
    if (error) return <p className="p-6 text-red-500">{error}</p>;
    if (!stats) return null;

    return (
        <>
            <div className="max-w-7xl m-auto mt-4 mb-2 py-4 px-4 sm:px-6 text-black">
                
                <h1 className="text-lg sm:text-2xl font-semibold mb-5">
                    Dashboard commandes
                </h1>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >

                    <div className=" grid grid-cols-1 lg:grid-cols-3 gap-6">

                        {/* TOTAL */}
                        <div className="border border-white bg-white border-b-green-400 border-b-3 shadow-lg p-4 rounded flex gap-6 items-center">
                            <FaBox className="text-3xl text-green-500" />
                            <div>
                                <p>Total commandes</p>
                                <h2 className="text-2xl font-bold">{stats.total}</h2>
                                <p className="mt-2">
                                    {formatFCFA(stats.totalPrice.toLocaleString())}
                                </p>
                            </div>
                        </div>

                        {/* TODAY */}
                        <div className="border border-white bg-white border-b-green-400 border-b-3 shadow-lg p-4 rounded flex gap-6 items-center">
                            <FaCalendarDay className="text-3xl text-green-500" />
                            <div>
                                <p>Commandes du jour</p>
                                <h2 className="text-2xl font-bold">{stats.today}</h2>
                                <p className="mt-2">
                                    {formatFCFA(stats.todayPrice.toLocaleString())}
                                </p>
                            </div>
                        </div>

                        {/* PENDING */}
                        <div className="border border-white bg-white border-b-green-400 border-b-3 shadow-lg p-4 rounded flex gap-6 items-center">
                            <FaClock className="text-3xl text-orange-500" />
                            <div>
                                <p>En attente</p>
                                <h2 className="text-2xl font-bold">{stats.pending}</h2>
                                <p className="mt-2">
                                    {formatFCFA(stats.pendingPrice.toLocaleString())}
                                </p>
                            </div>
                        </div>

                    </div>
                </motion.div>
            </div>
        </>
    );
}