"use client";

import { Search, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import AjouteProduitBtn from "@/_Components/AjouteProduitBtn";
import { toast } from "sonner";
import EditBtn from "@/_Components/EditBtn";

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

export default function ProduitsPage() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [produits, setProduits] = useState<Produit[]>([]);
    const [search, setSearch] = useState("");

    const [loading, setLoading] = useState(true);
    const [loadingProducts, setLoadingProducts] = useState(true);

    // 🔥 PAGINATION
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

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

    // reset page quand search change
    useEffect(() => {
        setCurrentPage(1);
    }, [search]);

    // 🗑️ SUPPRESSION
    const handleDelete = async (id: number) => {
        if (!confirm("Voulez-vous vraiment supprimer ce produit ?")) {
            return;
        }

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

            if (!res.ok) {
                throw new Error(data.message);
            }

            setProduits((prev) => prev.filter((p) => p.id !== id));

            toast.dismiss(loadingToast);
            toast.success(data.message || "Produit supprimé");
        } catch (error: any) {
            toast.dismiss(loadingToast);
            toast.error(error.message || "Erreur lors de la suppression");
            console.error(error);
        }
    };

    if (loading) {
        return (
            <p className="p-6 flex items-center justify-center h-screen animate-pulse">
                Chargement des statistiques...
            </p>
        );
    }

    if (!stats) {
        return <p className="p-6">Aucune donnée disponible.</p>;
    }

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
        <div className="mx-4 sm:mx-6 lg:mx-8">
            <div className="max-w-7xl mx-auto mt-4 mb-2 py-4 px-4 sm:px-6">

                <h1 className="text-2xl font-bold mb-6">
                    📦 Dashboard Produits
                </h1>

                {/* STATS */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                    <Card title="🧾 Total produits" value={stats.total} />
                    <Card title="📦 En stock" value={stats.inStock} />
                    <Card title="⚠️ Rupture" value={stats.outOfStock} />
                    <Card
                        title="💰 Valeur stock"
                        value={`${(stats.stockValue ?? 0).toLocaleString()} FCFA`}
                    />
                </div>

                {/* EXTRA */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
                    <Card
                        title="💸 Prix max"
                        value={`${(stats.maxPrice ?? 0).toLocaleString()} FCFA`}
                    />
                    <Card
                        title="💸 Prix min"
                        value={`${(stats.minPrice ?? 0).toLocaleString()} FCFA`}
                    />
                </div>

                {/* SEARCH + AJOUT */}
                <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between mb-6 mt-10">

                    <div className="relative w-full sm:w-1/2">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />

                        <input
                            type="text"
                            placeholder="Rechercher un produit..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full border border-gray-600 rounded pl-10 pr-3 py-2 bg-transparent outline-none focus:border-blue-500 transition"
                        />
                    </div>

                    <AjouteProduitBtn />
                </div>

                {/* PRODUITS */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

                    {loadingProducts ? (
                        <p>Chargement produits...</p>
                    ) : paginatedProducts.length === 0 ? (
                        <p>Aucun produit trouvé.</p>
                    ) : (
                        paginatedProducts.map((p) => (
                            <div
                                key={p.id}
                                className="border border-gray-700 rounded-lg shadow flex flex-col gap-3"
                            >
                                <img
                                    src={p.image_url || "/placeholder.png"}
                                    alt={p.nom}
                                    className=" h-50 object-cover w-full rounded"
                                />
                                <div className="m-3">
                                    <h2 className="text-lg font-bold">{p.nom}</h2>

                                    <div className="flex justify-between items-center">
                                        <p className="font-bold">
                                            💰 {(p.prix ?? 0).toLocaleString()} FCFA
                                        </p>

                                        <p className={p.stock > 0 ? "text-green-500" : "text-red-500"}>
                                            📦 {p.stock}
                                        </p>
                                    </div>

                                    <div className="flex justify-end gap-5 mt-2">

                                        <EditBtn
                                            produit={p}
                                            onUpdated={(updatedProduit) => {
                                                setProduits((prev) =>
                                                    prev.map((item) =>
                                                        item.id === updatedProduit.id
                                                            ? updatedProduit
                                                            : item
                                                    )
                                                );
                                            }}
                                        />

                                        <button
                                            type="button"
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

                {/* PAGINATION */}
                {filteredProducts.length > itemsPerPage && (
                    <div className="flex justify-center items-center gap-3 mt-8">
                        <button
                            onClick={() =>
                                setCurrentPage((prev) => Math.max(prev - 1, 1))
                            }
                            disabled={currentPage === 1}
                            className="px-3 py-1 border rounded disabled:opacity-50"
                        >
                            Précédent
                        </button>

                        <span className="text-sm">
                            Page {currentPage} / {totalPages}
                        </span>

                        <button
                            onClick={() =>
                                setCurrentPage((prev) =>
                                    Math.min(prev + 1, totalPages)
                                )
                            }
                            disabled={currentPage === totalPages}
                            className="px-3 py-1 border rounded disabled:opacity-50"
                        >
                            Suivant
                        </button>
                    </div>
                )}

            </div>
        </div>
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
        <div className="border border-gray-600 shadow-lg p-4 rounded-lg">
            <p className="text-gray-400">{title}</p>
            <h2 className="text-2xl font-bold mt-2">{value}</h2>
        </div>
    );
}