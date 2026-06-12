"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpLeft } from "lucide-react";
import { FaStar } from "react-icons/fa";
import HeartBtn from "@/_Components/HeartBtn";

type Produit = {
    id: number;
    nom: string;
    description: string;
    prix: number;
    stock: number;
    image_url?: string;
    jaime: number;
};

export default function CategoryProductsPage() {
    const params = useParams();
    const id = Array.isArray(params.id) ? params.id[0] : params.id;

    const route = useRouter();

    const [products, setProducts] = useState<Produit[]>([]);
    const [loading, setLoading] = useState(true);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    const totalPages = Math.max(
        1,
        Math.ceil(products.length / itemsPerPage)
    );

    const paginatedProducts = products.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const getRating = (id: number) => (id % 5) + 1;

    /* RESET PAGE */
    useEffect(() => {
        setCurrentPage(1);
    }, [id]);

    /* FETCH */
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);

                const token = localStorage.getItem("token");

                const res = await fetch(`/api/category/${id}/produits`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await res.json();

                setProducts(data.data || []);
            } catch (error) {
                console.error(error);
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchProducts();
    }, [id]);

    if (loading) {
        return <p className="text-center mt-10">Chargement...</p>;
    }

    return (

        <div className="max-w-7xl mx-auto p-5 space-y-6">

            {/* HEADER ALIGNÉ */}
            <div className="flex items-center justify-between">

                <button
                    onClick={() => route.back()}
                    className="flex items-center gap-2 text-white bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
                >
                    <ArrowUpLeft size={18} />
                    Retour
                </button>

                <h1 className="text-2xl font-bold text-center flex-1">
                    Produits de la catégorie
                </h1>

                {/* espace vide pour symétrie */}
                <div className="w-30" />
            </div>

            {/* EMPTY */}
            {products.length === 0 ? (
                <p>Aucun produit trouvé</p>
            ) : (
                <>
                    {/* GRID */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">

                        {paginatedProducts.map((p) => {
                            const rating = getRating(p.id);

                            return (
                                <div
                                    key={p.id}
                                    className="bg-white rounded shadow hover:shadow-xl transition overflow-hidden"
                                >

                                    <div className="relative w-full h-52">
                                        <Image
                                            src={p.image_url || "/placeholder.png"}
                                            alt={p.nom}
                                            fill
                                            className="object-cover hover:scale-105 transition"
                                        />
                                    </div>

                                    <div className="p-4 space-y-2">

                                        <h2 className="font-bold text-lg">{p.nom}</h2>

                                        <p className="text-sm text-gray-500 line-clamp-2">
                                            {p.description}
                                        </p>

                                        <div className="flex text-yellow-400">
                                            {[...Array(5)].map((_, i) => (
                                                <FaStar
                                                    key={i}
                                                    size={14}
                                                    className={i < rating ? "text-yellow-400" : "text-gray-300"}
                                                />
                                            ))}
                                        </div>

                                        <p className="font-bold text-green-700 text-lg">
                                            {p.prix} FCFA
                                        </p>

                                        <p className="text-sm">Stock : {p.stock}</p>

                                        <div className="flex justify-between items-center mt-3">

                                            <HeartBtn
                                                productId={p.id}
                                                initialLikes={p.jaime}
                                            />

                                            <Link
                                                href={`/produits/${p.id}`}
                                                className="flex items-center gap-2 text-sm font-bold bg-green-600 hover:bg-green-700 px-4 py-2 text-white rounded"
                                            >
                                                Consulter
                                                <ArrowRight size={16} />
                                            </Link>

                                        </div>

                                    </div>

                                </div>
                            );
                        })}

                    </div>

                    {/* PAGINATION */}
                    <div className="flex justify-center items-center gap-3 mt-8">

                        <button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage((p) => p - 1)}
                            className="px-4 py-2 border rounded disabled:opacity-40"
                        >
                            Précédent
                        </button>

                        <span className="text-sm">
                            Page {currentPage} / {totalPages}
                        </span>

                        <button
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage((p) => p + 1)}
                            className="px-4 py-2 border rounded disabled:opacity-40"
                        >
                            Suivant
                        </button>

                    </div>
                </>
            )}
        </div>
    );
}