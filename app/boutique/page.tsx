"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { FaStar } from "react-icons/fa";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

type Produit = {
  id: number;
  nom: string;
  description: string;
  stock: number;
  prix: number;
  image_url?: string;
  category_id: number;
};

type Categorie = {
  id: number;
  nom: string;
};

const ITEMS_PER_PAGE = 8;

export default function BoutiquePage() {
  const [categories, setCategories] = useState<Categorie[]>([]);
  const [produits, setProduits] = useState<Produit[]>([]);
  const [loading, setLoading] = useState(true);

  const [pageByCategory, setPageByCategory] = useState<Record<number, number>>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const [catRes, prodRes] = await Promise.all([
          fetch("/api/category", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("/api/produits", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const catData = await catRes.json();
        const prodData = await prodRes.json();

        setCategories(catData.data || []);
        setProduits(prodData.data || []);
      } catch (error) {
        console.error("Erreur chargement boutique:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getRating = (id: number) => (id % 5) + 1;

  const setPage = (catId: number, page: number) => {
    setPageByCategory((prev) => ({
      ...prev,
      [catId]: page,
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-60">
        <p className="text-gray-500">Chargement de la boutique...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4">

      <h1 className="text-3xl font-bold mb-8">
        Boutique
      </h1>

      {categories.map((categorie) => {
        const produitsCategorie = produits.filter(
          (p) => p.category_id === categorie.id
        );

        if (produitsCategorie.length === 0) return null;

        const currentPage = pageByCategory[categorie.id] || 1;

        const totalPages = Math.ceil(
          produitsCategorie.length / ITEMS_PER_PAGE
        );

        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        const end = start + ITEMS_PER_PAGE;

        const paginatedProducts = produitsCategorie.slice(start, end);

        return (
          <section key={categorie.id} className="mb-12">

            <div className="flex items-center justify-between mb-5">
              <h2 className="text-2xl font-bold">
                {categorie.nom}
              </h2>
            </div>

            {/* PRODUCTS */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">

              {paginatedProducts.map((produit) => {
                const rating = getRating(produit.id);

                return (
                  <div
                    key={produit.id}
                    className="rounded overflow-hidden bg-white shadow-sm hover:shadow-md transition"
                  >

                    <div className="relative w-full h-44 bg-gray-100">
                      <Image
                        src={
                          produit.image_url?.startsWith("http")
                            ? produit.image_url
                            : produit.image_url || "/placeholder.png"
                        }
                        alt={produit.nom}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="p-3">
                      <h3 className="font-semibold text-sm line-clamp-1">
                        {produit.nom}
                      </h3>

                      <p className="text-sm text-gray-700 line-clamp-2">
                        {produit.description}
                      </p>

                      <div className="mt-3 flex justify-between">
                        <span className="font-bold text-green-700">
                          {produit.prix} FCFA
                        </span>

                        <span className="text-xs text-gray-500">
                          Stock: {produit.stock}
                        </span>
                      </div>

                      <div className="flex mt-2 text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <FaStar
                            key={i}
                            size={14}
                            className={
                              i < rating
                                ? "text-yellow-400"
                                : "text-gray-300"
                            }
                          />
                        ))}
                      </div>
                    </div>

                    <div className="p-3 pt-0">
                      <Link
                        href={`/produits/${produit.id}`}
                        className="flex items-center justify-center gap-2 text-sm font-bold bg-green-600 hover:bg-green-700 transition px-4 py-2 text-white rounded w-full"
                      >
                        Consulter
                        <ArrowRight size={16} />
                      </Link>
                    </div>
                  </div>
                );
              })}

            </div>

            {/* PAGINATION */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-6">

                <button
                  disabled={currentPage === 1}
                  onClick={() => setPage(categorie.id, currentPage - 1)}
                  className="px-3 py-1 border rounded disabled:opacity-40"
                >
                  Précédent
                </button>

                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(categorie.id, i + 1)}
                    className={`px-3 py-1 border rounded ${
                      currentPage === i + 1
                        ? "bg-green-600 text-white"
                        : ""
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setPage(categorie.id, currentPage + 1)}
                  className="px-3 py-1 border rounded disabled:opacity-40"
                >
                  Suivant
                </button>

              </div>
            )}

          </section>
        );
      })}
    </div>
  );
}