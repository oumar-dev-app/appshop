"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpLeft } from "lucide-react";
import { FaStar } from "react-icons/fa";
import HeartBtn from "../../_Components/HeartBtn";
import { motion } from "framer-motion";

type Produit = {
  id: number;
  nom: string;
  description: string;
  prix: number;
  stock: number;
  image_url?: string;
  jaime: number;
  isNew: number;
};

const formatFCFA = (value: any) =>
  new Intl.NumberFormat("fr-FR").format(Number(value || 0)) + " FCFA";

export default function CategoryProductsPage() {
  const [products, setProducts] = useState<Produit[]>([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 8;

  const route = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const token = localStorage.getItem("token");

        const res = await fetch(`/api/produits`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        setProducts(data.data || data || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  /* ANIMATION */
  useEffect(() => {

    const observer = new IntersectionObserver(
      (entries) => {

        entries.forEach((entry) => {

          if (entry.isIntersecting) {
            entry.target.classList.add('show');
          }

        });

      },
      { threshold: 0.3 }
    );

    const elements = document.querySelectorAll('.fade-item');

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();

  }, [products]);

  /* RESET PAGE SI PRODUITS CHANGE */
  useEffect(() => {
    setCurrentPage(1);
  }, [products]);

  if (loading) {
    return (
      <p className="text-center mt-10 animate-pulse">Chargement...</p>
    );
  }

  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);

  const paginatedProducts = products.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const changePage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="max-w-7xl mx-auto p-5">

      {/* HEADER */}
      <div className="mb-7">

        <div className=" fade-item flex gap-4 items-center">
          <div>
            <button
              onClick={() => route.back()}
              className="flex items-center gap-2 text-white bg-green-600 px-4 py-2 rounded"
            >
              <ArrowLeft size={18} />

            </button>
          </div>

          <div>

            {/* TITRE */}
            <h1 className="text-2xl sm:text-3xl font-bold">
              Nos produits
            </h1>
          </div>

        </div>

      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* PRODUCTS */}
        {products.length === 0 ? (
          <p>Aucun produit trouvé</p>
        ) : (
          <>
            <div className=" grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">

              {paginatedProducts.map((p) => {
                const rating = (p.id % 6) + 1;

                return (
                  <div
                    key={p.id}
                    className="bg-white rounded shadow hover:shadow-xl transition overflow-hidden"
                  >

                    {/* IMAGE */}
                    <div className="relative w-full h-48">

                      <Image
                        src={p.image_url || "/placeholder.png"}
                        alt={p.nom}
                        fill
                        className="object-cover hover:scale-105 transition"
                      />
                      {p.isNew === 1 && (
                        <span className="top-2 left-2 bg-green-500 text-white px-2 py-1 rounded text-xs">
                          Nouveau
                        </span>
                      )}

                    </div>

                    {/* CONTENT */}
                    <div className="p-4 space-y-2">

                      <h2 className="font-bold text-lg">{p.nom}</h2>

                      <p className="text-sm text-gray-500 line-clamp-3">
                        {p.description}
                      </p>

                      <div className="flex mt-2">
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

                      <p className="font-bold text-green-700 text-lg">
                        {formatFCFA(p.prix)}
                      </p>

                      <p className="text-sm">Stock : {p.stock}</p>

                      <div className="flex justify-between items-center m-3">
                        <HeartBtn
                          productId={p.id}
                          initialLikes={p.jaime}
                        />

                        <Link
                          href={`/produits/${p.id}`}
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

            {/* PAGINATION */}
            <div className="flex justify-center items-center gap-2 mt-8">

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
          </>
        )}
      </motion.div>
    </div>
  );
}