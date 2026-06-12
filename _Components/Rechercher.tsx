"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

type Produit = {
    id: number;
    nom: string;
    prix: number;
    image_url?: string;
};

type RechercherProps = {
    onClose: () => void;
};

const Rechercher = ({ onClose }: RechercherProps) => {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<Produit[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchProducts = async () => {
            if (!query.trim()) {
                setResults([]);
                return;
            }

            try {
                setLoading(true);

                const token = localStorage.getItem("token");

                const res = await fetch(
                    `/api/recherche?query=${query}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const data = await res.json();

                setResults(data.data || data || []);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        const timer = setTimeout(() => {
            fetchProducts();
        }, 500);

        return () => clearTimeout(timer);
    }, [query]);

    return (
        <div className="w-full max-w-xl mx-auto space-y-3">
            {/* INPUT */}
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Rechercher un produit..."
                className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-green-500"
            />

            {/* RESULTS */}
            <div className="max-h-80 overflow-y-auto space-y-2">

                {loading && (
                    <p className="text-sm text-gray-500">
                        Recherche...
                    </p>
                )}

                {!loading && query && results.length === 0 && (
                    <p className="text-sm text-gray-500">
                        Aucun produit trouvé
                    </p>
                )}

                {results.map((p) => (
                    <Link
                        key={p.id}
                        href={`/produits/${p.id}`}
                        onClick={onClose}
                        className="flex items-center gap-3 border rounded-lg p-2 hover:bg-gray-100 transition"
                    >
                        <Image
                            src={p.image_url || "/placeholder.png"}
                            alt={p.nom}
                            width={60}
                            height={60}
                            className="rounded object-cover w-14 h-14"
                        />

                        <div className="flex-1">
                            <h3 className="font-semibold">
                                {p.nom}
                            </h3>

                            <p className="text-green-600 text-sm">
                                {p.prix} FCFA
                            </p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Rechercher;