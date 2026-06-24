"use client";

import { Search, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import AjouteCategoryBtn from "@/_Components/AjouteCategoryBtn";
import EditBtnCategory from "@/_Components/EditBtnCategory";
import { motion } from "framer-motion";

// =========================
// 💰 FORMAT FCFA PROPRE
// =========================
const formatFCFA = (value: any) => {
    const num = Number(value || 0);

    return new Intl.NumberFormat("fr-FR", {
        maximumFractionDigits: 0,
    }).format(num) + " FCFA";
};

type Stats = {
    total: number;
    inStock: number;
    outOfStock: number;
    stockValue: number;
    maxPrice: number;
    minPrice: number;
};

type Category = {
    id: number;
    nom: string;
    image_url: string;
};

export default function CategoryPage() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [category, setCategory] = useState<Category[]>([]);
    const [search, setSearch] = useState("");

    const [loading, setLoading] = useState(true);
    const [loadingProducts, setLoadingProducts] = useState(true);

    // 📊 STATS
    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem("token");

                const res = await fetch("/api/produits/stats", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await res.json();
                setStats(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    // 📦 CATEGORY
    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const token = localStorage.getItem("token");

                const res = await fetch("/api/category", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await res.json();

                setCategory(data.data || []);
            } catch (error) {
                console.error(error);
            } finally {
                setLoadingProducts(false);
            }
        };

        fetchCategory();
    }, []);

    // 🗑️ DELETE
    const handleDelete = async (id: number) => {
        if (!confirm("Voulez-vous vraiment supprimer cette catégorie ?")) {
            return;
        }

        const loadingToast = toast.loading("Suppression...");

        try {
            const token = localStorage.getItem("token");

            const res = await fetch(`/api/category/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.message);

            setCategory((prev) =>
                prev.filter((p) => p.id !== id)
            );

            toast.dismiss(loadingToast);
            toast.success(data.message || "Catégorie supprimée");
        } catch (error: any) {
            toast.dismiss(loadingToast);
            toast.error(error.message || "Erreur lors de la suppression");
        }
    };

    if (loading) {
        return (
            <p className="p-6 flex items-center justify-center h-screen animate-pulse text-black">
                Chargement des statistiques...
            </p>
        );
    }

    if (!stats) {
        return <p className="p-6 text-black">Aucune donnée disponible.</p>;
    }

    const filteredProducts = category.filter((p) =>
        p.nom?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <>
            <div className="max-w-7xl mx-auto mt-4 mb-2 py-4 px-4 sm:px-6 text-black">

                <h1 className="text-2xl font-bold mb-6">
                    📦 Dashboard Categories
                </h1>

                {/* STATS */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 ">
                    <Card title="🧾 Total produits" value={stats.total ?? 0}/>
                    <Card title="📦 En stock" value={stats.inStock ?? 0} />
                    <Card title="⚠️ Rupture" value={stats.outOfStock ?? 0} />
                    <Card title="💰 Valeur stock" value={formatFCFA(stats.stockValue)} />
                </div>

                {/* SEARCH + AJOUT */}
                <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between mb-6 mt-10">

                    <div className="relative w-full sm:w-1/2">
                        <Search
                            size={18}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        />

                        <input
                            type="text"
                            placeholder="Rechercher une catégorie..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full border border-white bg-white rounded pl-10 pr-3 py-2 shadow-lg outline-none focus:border-green-500 transition"
                        />
                    </div>

                    <AjouteCategoryBtn />
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    {/* LISTE */}
                    <div className="mt-8 grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">

                        {loadingProducts ? (
                            <p className="flex justify-center items-center h-screen animate-pulse text-black">
                                Chargement catégories...
                            </p>
                        ) : filteredProducts.length === 0 ? (
                            <p className="text-black">Aucune catégorie trouvée.</p>
                        ) : (
                            filteredProducts.map((p) => (
                                <div
                                    key={p.id}
                                    className="border border-white bg-white text-black rounded-lg shadow flex flex-col gap-3"
                                >
                                    <img
                                        src={p.image_url || "/placeholder.png"}
                                        alt={p.nom}
                                        className="w-full h-40 object-cover rounded-t-lg"
                                    />

                                    <div className="m-3 flex items-center justify-between">
                                        <h2 className="text-lg font-bold">
                                            {p.nom}
                                        </h2>

                                        <div className="flex gap-4">
                                            <EditBtnCategory
                                                category={p}
                                                onUpdated={(updated) => {
                                                    setCategory((prev) =>
                                                        prev.map((item) =>
                                                            item.id === updated.id
                                                                ? updated
                                                                : item
                                                        )
                                                    );
                                                }}
                                            />

                                            <button
                                                onClick={() => handleDelete(p.id)}
                                                className="text-red-500 hover:text-red-700 transition"
                                            >
                                                <Trash size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </motion.div>
            </div>
    
       </>
    );
}

// 🔥 CARD
function Card({
    title,
    value,
}: {
    title: string;
    value: React.ReactNode;
}) {
    return (
        <div className="border border-white bg-white border-b-green-400 border-b-3 text-black shadow-lg p-4 rounded-lg">
            <p className="text-gray-400">{title}</p>
            <h2 className="text-2xl font-bold mt-2">
                {value}
            </h2>
        </div>
    );
}