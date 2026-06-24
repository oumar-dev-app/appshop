"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpLeft } from "lucide-react";
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

const formatFCFA = (value: any) =>
  new Intl.NumberFormat("fr-FR").format(Number(value || 0)) + " FCFA";

export default function CategoryProductsPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const router = useRouter();

  const [products, setProducts] = useState<Produit[]>([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 6;

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

  const totalPages = Math.max(
    1,
    Math.ceil(products.length / ITEMS_PER_PAGE)
  );

  const paginatedProducts = products.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const getRating = (id: number) => (id % 5) + 1;

  const changePage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return <p className="text-center mt-10 animate-pulse">Chargement...</p>;
  }

  return (
    <div className="max-w-7xl mx-auto p-5 space-y-6">

      {/* HEADER */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-white bg-green-600 px-4 py-2 rounded"
      >
        <ArrowUpLeft size={18} />
        Retour
      </button>

      <h1 className="text-2xl font-bold mt-5">
        Produits de la catégorie
      </h1>

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
                      className="object-cover"
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
              className="p-3 rounded-full bg-green-500 text-white disabled:opacity-50"
            >
              <ArrowLeft size={20} />
            </button>

            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => changePage(i + 1)}
                className={`px-4 py-1 rounded-full ${
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
              onClick={() => setCurrentPage((p) => p + 1)}
              className="p-3 rounded-full bg-green-500 text-white disabled:opacity-50"
            >
              <ArrowRight size={20} />
            </button>

          </div>
        </>
      )}
    </div>
  );
}