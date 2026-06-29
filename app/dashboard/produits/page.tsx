"use client";

import { ArrowLeft, ArrowRight, Search, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import AjouteProduitBtn from "../../../_Components/AjouteProduitBtn";
import { toast } from "sonner";
import EditBouton from "../../../_Components/EditBtn";
import { motion } from "framer-motion";
import EditBtn from "../../../_Components/EditBtn";


type Stats = {
    total: number;
    inStock: number;
    outOfStock: number;
    stockValue: number;
    maxPrice: number;
    minPrice: number;
};

type Produit = {
    id: number;
    nom: string;
    description: string;
    stock: number;
    prix: number;
    image_url: string;
    category_id: string;
};

// 🔥 FORMAT FCFA SAFE
const formatFCFA = (value: any) =>
    new Intl.NumberFormat("fr-FR").format(Number(value || 0)) + " FCFA";

export default function ProduitsPage() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [produits, setProduits] = useState<Produit[]>([]);
    const [search, setSearch] = useState("");

    const [loading, setLoading] = useState(true);
    const [loadingProducts, setLoadingProducts] = useState(true);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    useEffect(() => {
        const elements = document.querySelectorAll(".fade-in");

        const observer = new IntersectionObserver(
            (entries, obs) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("show");
                        obs.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.15 }
        );

        elements.forEach((el) => observer.observe(el));

        return () => observer.disconnect();
    }, [produits, currentPage]);
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

    // 📦 PRODUITS
    useEffect(() => {
        const fetchProduits = async () => {
            try {
                const token = localStorage.getItem("token");

                const res = await fetch("/api/produits", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await res.json();

                setProduits(data.data || []);
            } catch (error) {
                console.error(error);
            } finally {
                setLoadingProducts(false);
            }
        };

        fetchProduits();
    }, []);

    // reset page search
    useEffect(() => {
        setCurrentPage(1);
    }, [search]);

    // 🗑️ DELETE
    const handleDelete = async (id: number) => {
        if (!confirm("Voulez-vous vraiment supprimer ce produit ?")) return;

        const loadingToast = toast.loading("Suppression...");

        try {
            const token = localStorage.getItem("token");

            const res = await fetch(`/api/produits/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.message);

            setProduits((prev) => prev.filter((p) => p.id !== id));

            toast.success(data.message || "Produit supprimé");
        } catch (error: any) {
            toast.error(error.message || "Erreur suppression");
        } finally {
            toast.dismiss(loadingToast);
        }
    };

    const changePage = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    if (loading) {
        return (
            <p className="text-black p-6 flex items-center justify-center h-screen animate-pulse">
                Chargement des statistiques...
            </p>
        );
    }

    if (!stats) return <p className="p-6 text-black">Aucune donnée disponible.</p>;

    // 🔎 FILTER
    const filteredProducts = produits.filter((p) =>
        p.nom.toLowerCase().includes(search.toLowerCase())
    );

    const totalPages = Math.max(
        1,
        Math.ceil(filteredProducts.length / itemsPerPage)
    );

    const paginatedProducts = filteredProducts.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <>
            <div className="max-w-7xl mx-auto mt-4 mb-2 py-4 px-4 sm:px-6 text-black">

                <h1 className="text-2xl font-bold mb-6">
                    📦 Dashboard Produits
                </h1>

                {/* STATS */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card title="🧾 Total produits" value={stats.total ?? 0} />
                    <Card title="📦 En stock" value={stats.inStock ?? 0} />
                    <Card title="⚠️ Rupture" value={stats.outOfStock ?? 0} />
                    <Card title="💰 Valeur stock" value={formatFCFA(stats.stockValue)} />
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-2 gap-4 mt-6">
                    <Card title="💸 Prix max" value={formatFCFA(stats.maxPrice)} />
                    <Card title="💸 Prix min" value={formatFCFA(stats.minPrice)} />
                </div>

                {/* SEARCH */}
                <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between mb-6 mt-10">
                    <div className="relative w-full sm:w-1/2">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

                        <input
                            type="text"
                            placeholder="Rechercher un produit..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full border border-white rounded pl-10 pr-3 py-2 bg-white shadow-lg outline-none focus:border-green-500"
                        />
                    </div>

                    <AjouteProduitBtn />
                </div>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >



                    {/* PRODUCTS */}
                    <div className=" mt-8 grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">

                        {loadingProducts ? (
                            <p className="text-black animate-pulse">Chargement produits...</p>
                        ) : paginatedProducts.length === 0 ? (
                            <p className="text-black">Aucun produit trouvé.</p>
                        ) : (
                            paginatedProducts.map((p) => (
                                <div
                                    key={p.id}
                                    className="bg-white  rounded shadow hover:shadow-xl transition overflow-hidden text-black"
                                >
                                    <img
                                        src={p.image_url || "/placeholder.png"}
                                        className="h-35 w-full object-cover rounded-t"
                                    />

                                    <div className="m-3">
                                        <h2 className="text-lg font-bold">{p.nom}</h2>

                                        <div className="flex justify-between">
                                            <p className="font-bold">
                                                💰 {formatFCFA(p.prix)}
                                            </p>

                                            <p className={p.stock > 0 ? "text-green-500" : "text-red-500"}>
                                                📦 {p.stock}
                                            </p>
                                        </div>

                                        <div className="flex justify-end gap-5 mt-2">

                                            <EditBtn
                                                produit={p}
                                                onUpdated={(updated) => {
                                                    setProduits((prev) =>
                                                        prev.map((item) =>
                                                            item.id === updated.id ? updated : item
                                                        )
                                                    );
                                                }}
                                            />

                                            <button
                                                onClick={() => handleDelete(p.id)}
                                                className="text-red-500 hover:text-red-700"
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

                {/* PAGINATION */}
                {filteredProducts.length > itemsPerPage && (
                    <div className="flex justify-center items-center gap-3 mt-8">
                        <button
                            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                            disabled={currentPage === 1}
                            className="rounded-full bg-green-500 p-3 shadow hover:bg-green-600  transition text-white disabled:opacity-50"
                        >
                            <ArrowLeft size={20} />
                        </button>

                        {Array.from({ length: totalPages }).map((_, i) => (
                            <button
                                key={i}
                                onClick={() => changePage(i + 1)}
                                className={`px-4 py-2 rounded-full  shadow hover:bg-green-600 ${currentPage === i + 1
                                        ? "bg-green-600 text-white"
                                        : ""
                                    }`}
                            >
                                {i + 1}
                            </button>
                        ))}

                        <button
                            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="rounded-full bg-green-500 p-3 shadow hover:bg-green-600 mr-5 transition text-white disabled:opacity-50"
                        >
                            <ArrowRight size={20} />
                        </button>
                    </div>
                )}
            </div >
        </>
    );
}

// 🔥 CARD
function Card({ title, value }: { title: string; value: React.ReactNode }) {
    return (
        <div className="border border-white bg-white border-b-green-400 border-b-3 shadow-lg p-4 rounded-lg">
            <p className="text-gray-400">{title}</p>
            <h2 className="text-2xl font-bold mt-2">{value}</h2>
        </div>
    );
}