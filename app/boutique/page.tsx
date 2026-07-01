"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { FaStar } from "react-icons/fa";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import HeartBtn from "../../_Components/HeartBtn";
import { motion } from "framer-motion";

type Produit = {
  id: number;
  nom: string;
  description: string;
  stock: number;
  prix: number;
  image_url?: string;
  category_id: number;
  isNew: number;
  jaime: number;
};

type Categorie = {
  id: number;
  nom: string;
};

const formatFCFA = (value: any) =>
  new Intl.NumberFormat("fr-FR").format(Number(value || 0)) + " FCFA";

const ITEMS_PER_PAGE = 6;

export default function BoutiquePage() {
  const [categories, setCategories] = useState<Categorie[]>([]);
  const [produits, setProduits] = useState<Produit[]>([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

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
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);


  const getRating = (id: number) => (id % 5) + 1;

  // 🔥 FILTRAGE (optionnel)
  const filteredProducts = selectedCategory
    ? produits.filter((p) => p.category_id === selectedCategory)
    : produits;

  // 🔥 PAGINATION GLOBALE
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

  const start = (currentPage - 1) * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;

  const paginatedProducts = filteredProducts.slice(start, end);

  const changePage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-60">
        <p className="text-gray-500">Chargement...</p>
      </div>
    );
  }

  return (
    <div className=" max-w-7xl mx-auto p-4">

      {/*     <h1 className="text-3xl font-bold mb-6">Boutique</h1> */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* FILTRES CATEGORIES */}
        <div className=" flex gap-2 flex-wrap mb-6">
          <button
            onClick={() => {
              setSelectedCategory(null);
              setCurrentPage(1);
            }}
            className={`px-3 py-1 border rounded ${selectedCategory === null ? "bg-green-600 text-white" : ""
              }`}
          >
            Tous
          </button>

          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                setCurrentPage(1);
              }}
              className={`px-3 py-1 border rounded ${selectedCategory === cat.id ? "bg-green-600 text-white" : ""
                }`}
            >
              {cat.nom}
            </button>
          ))}
        </div>

        {/* PRODUITS */}
        {paginatedProducts.length === 0 ? (
          <div className=" flex justify-center items-center py-16">
            <p className="text-lg text-gray-500 font-medium">
              Aucun produit trouvé.
            </p>
          </div>
        ) : (
          <div className=" grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {paginatedProducts.map((produit) => {
              const rating = getRating(produit.id);

              return (
                <div
                  key={produit.id}
                  className="bg-white rounded shadow hover:shadow-xl transition overflow-hidden"
                >
                  {/* IMAGE */}
                  <div className="relative w-full h-44 bg-gray-100">
                    {produit.isNew === 1 && (
                      <span className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded text-xs">
                        Nouveau
                      </span>
                    )}

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

                  {/* CONTENT */}
                  <div className="p-4 space-y-2">
                    <h2 className="font-bold text-lg">{produit.nom}</h2>

                    <p className="text-sm text-gray-500 line-clamp-3">
                      {produit.description}
                    </p>

                    <div className="flex mt-2">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          size={14}
                          className={
                            i < rating ? "text-yellow-400" : "text-gray-300"
                          }
                        />
                      ))}
                    </div>

                    <p className="font-bold text-green-700 text-lg">
                      {formatFCFA(produit.prix)}
                    </p>

                    <p className="text-sm">Stock : {produit.stock}</p>

                    <div className="flex justify-between items-center">
                      <HeartBtn
                        productId={produit.id}
                        initialLikes={produit.jaime}
                      />

                      <Link
                        href={`/produits/${produit.id}`}
                        className="flex items-center justify-center gap-2 text-sm font-bold bg-green-600 hover:bg-green-700 transition px-4 py-2 text-white rounded"
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
        )}

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
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
      </motion.div>
    </div>
  );
}