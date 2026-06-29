'use client';
import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaStar } from 'react-icons/fa';
import { ArrowRight } from 'lucide-react';
import HeartBtn from './HeartBtn';

/* =========================
   TYPES
========================= */
type Category = {
    id: number;
    nom: string;
    image_url?: string;
};

type Produit = {
    id: number;
    nom: string;
    description: string;
    stock: number;
    prix: number;
    image_url?: string;
    category_id: number;
    jaime: number;
    isNew: number;
};

// 🔥 FORMAT FCFA SAFE
const formatFCFA = (value: any) =>
    new Intl.NumberFormat("fr-FR").format(Number(value || 0)) + " FCFA"

/* =========================
   PRODUCT CARD
========================= */
const ProduitCard = React.memo(({ p }: { p: Produit }) => {
    const rating = (p.id % 5) + 1;

    return (
        <div className="snap-start w-full rounded bg-white shadow-sm hover:shadow-md transition overflow-hidden">

            <div className="relative w-full h-44 bg-gray-100">

                <Image
                    src={
                        p.image_url?.startsWith("http")
                            ? p.image_url
                            : p.image_url || "/placeholder.png"
                    }
                    alt={p.nom}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover hover:scale-105 transition-transform"
                />
            </div>

            <div className="p-3">
                <h3 className="font-semibold text-sm line-clamp-1">
                    {p.nom}
                </h3>

                <p className="text-sm text-gray-700 line-clamp-3">
                    {p.description}
                </p>

                <div className="mt-3 flex items-center justify-between">
                    <span className="font-bold text-green-700">
                        {formatFCFA(p.prix)}
                    </span>

                    <span className="text-xs text-gray-500">
                        Stock: {p.stock}
                    </span>
                </div>

                <div className="flex mt-2 text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                        <FaStar
                            key={i}
                            size={14}
                            className={i < rating ? "text-yellow-400" : "text-gray-300"}
                        />
                    ))}

                    {p.isNew && (
                        <span className="absolute top-1 left-1 bg-green-500 text-white px-2 py-1 rounded text-xs">
                            Nouveau
                        </span>
                    )}
                </div>
            </div>
            <div className='flex justify-between items-center m-3'>
                <HeartBtn
                    productId={p.id}
                    initialLikes={p.jaime}
                />
                {/* BUTTON */}
                <div className="p-3 pt-0">
                    <Link
                        href={`/produits/${p.id}`}
                        className="flex items-center justify-center gap-2 text-sm font-bold bg-green-600 hover:bg-green-700 transition px-4 py-2 text-white rounded w-full"
                    >
                        Consulter
                        <ArrowRight size={16} />
                    </Link>
                </div>
            </div>

        </div>
    );
});

ProduitCard.displayName = 'ProduitCard';

/* =========================
   CATEGORY BUTTON
========================= */
const CategoryButton = React.memo(
    ({
        item,
        selected,
        onClick,
    }: {
        item: Category;
        selected: boolean;
        onClick: () => void;
    }) => (
        <button
            onClick={onClick}
            className={`px-3 py-2 rounded border whitespace-nowrap transition font-medium
                ${selected
                    ? 'bg-green-500 text-white border-green-500'
                    : 'bg-white text-black border-gray-300 hover:bg-gray-100'
                }`}
        >
            {item.nom}
        </button>
    )
);

CategoryButton.displayName = 'CategoryButton';

/* =========================
   MAIN COMPONENT
========================= */
export default function VenteFlashMenu() {

    const [categories, setCategories] = useState<Category[]>([]);
    const [produits, setProduits] = useState<Produit[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

    const [loadingCategories, setLoadingCategories] = useState(false);
    const [loadingProducts, setLoadingProducts] = useState(false);

    const [cache, setCache] = useState<Record<number, Produit[]>>({});

    /* PAGINATION */
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    /* =========================
       FETCH CATEGORIES
    ========================= */
    useEffect(() => {
        const fetchCategories = async () => {
            setLoadingCategories(true);

            try {
                const token = localStorage.getItem('token');

                const res = await fetch('/api/category', {
                    headers: token ? { Authorization: `Bearer ${token}` } : {},
                });

                const data = await res.json();
                setCategories(data?.data ?? []);

            } catch (err) {
                console.error(err);
                setCategories([]);
            } finally {
                setLoadingCategories(false);
            }
        };

        fetchCategories();
    }, []);

    /* =========================
       FETCH PRODUCTS (CACHE)
    ========================= */
    const loadProducts = useCallback(async (id: number) => {

        if (selectedCategory === id) return;

        if (cache[id]) {
            setProduits(cache[id]);
            setSelectedCategory(id);
            return;
        }

        setLoadingProducts(true);

        try {
            const token = localStorage.getItem('token');

            const res = await fetch(`/api/category/${id}/meilleurOffre`, {
                headers: token ? { Authorization: `Bearer ${token}` } : {},
            });

            const data = await res.json();
            const items = Array.isArray(data) ? data : data?.data ?? [];

            setProduits(items);
            setCache(prev => ({ ...prev, [id]: items }));
            setSelectedCategory(id);

        } catch (err) {
            console.error(err);
            setProduits([]);
        } finally {
            setLoadingProducts(false);
        }

    }, [selectedCategory, cache]);

    /* AUTO FIRST CATEGORY */
    useEffect(() => {
        if (categories.length && selectedCategory === null) {
            loadProducts(categories[0].id);
        }
    }, [categories, selectedCategory, loadProducts]);

    /* RESET PAGE */
    useEffect(() => {
        setCurrentPage(1);
    }, [selectedCategory]);

    /* PAGINATION */
    const totalPages = Math.ceil(produits.length / itemsPerPage);

    const paginatedProducts = produits.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <section>

            {/* HEADER */}
            <div className="w-full max-w-7xl mx-auto mt-10 px-4 space-y-10 grid grid-cols-1 lg:grid-cols-2">

                <div className='text-black'>
                    <h1 className="text-2xl md:text-3xl font-bold">
                        Vente Flash
                    </h1>
                    <p className="text-sm mt-2">
                        Découvrez nos meilleures offres du moment.
                    </p>
                </div>


            </div>

            {/* PRODUCTS */}
            <div className="mt-6 fade-item m-3">

                {loadingProducts && (
                    <p className="text-black text-center py-10 animate-pulse">
                        Chargement...
                    </p>
                )}

                {!loadingProducts && produits.length > 0 && (
                    <>
                        {/* MOBILE */}
                        <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 sm:hidden">
                            {paginatedProducts.map(p => (
                                <div key={p.id} className="min-w-[80%] snap-start">
                                    <ProduitCard p={p} />
                                </div>
                            ))}
                        </div>

                        {/* DESKTOP */}
                        <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {paginatedProducts.map(p => (
                                <ProduitCard key={p.id} p={p} />
                            ))}
                        </div>
                    </>
                )}

                {!loadingProducts && produits.length === 0 && selectedCategory && (
                    <p className="text-black text-center py-10">
                        Aucun produit disponible
                    </p>
                )}

                <div className="grid grid-cols-3 sm:grid-cols-3 md:flex items-center justify-center md:overflow-x-auto gap-3 pb-3 mt-8">
                    {loadingCategories ? (
                        <p className="text-black text-sm animate-pulse">Chargement...</p>
                    ) : (
                        categories.map(cat => (
                            <CategoryButton
                                key={cat.id}
                                item={cat}
                                selected={selectedCategory === cat.id}
                                onClick={() => loadProducts(cat.id)}
                            />
                        ))
                    )}
                </div>



            </div>

        </section>
    );
}