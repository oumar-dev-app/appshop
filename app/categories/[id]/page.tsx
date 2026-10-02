"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Heart,
  Package,
  Sparkles,
} from "lucide-react";
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

type Category = {
  id: number;
  nom: string;
  image_url?: string;
};

export default function CategoryProductsPage() {
  const params = useParams();
  const router = useRouter();

  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const [products, setProducts] = useState<Produit[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [categoryLoading, setCategoryLoading] = useState(true);

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

  const getRating = (productId: number) => (productId % 5) + 1;

  /* RESET PAGINATION */
  useEffect(() => {
    setCurrentPage(1);
  }, [id]);

  /* FETCH CATEGORY */
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setCategoryLoading(true);

        const res = await fetch(`/api/category/${id}`);

        if (!res.ok) {
          setCategory(null);
          return;
        }

        const data = await res.json();

        setCategory(data?.data || data?.category || null);
      } catch (error) {
        console.error("Erreur récupération catégorie :", error);
        setCategory(null);
      } finally {
        setCategoryLoading(false);
      }
    };

    if (id) {
      fetchCategory();
    }
  }, [id]);

  /* FETCH PRODUCTS */
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const token = localStorage.getItem("token");

        const headers: HeadersInit = token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : {};

        const res = await fetch(`/api/category/${id}/produits`, {
          headers,
        });

        if (!res.ok) {
          throw new Error("Impossible de récupérer les produits");
        }

        const data = await res.json();

        setProducts(Array.isArray(data?.data) ? data.data : []);
      } catch (error) {
        console.error("Erreur récupération produits :", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProducts();
    }
  }, [id]);

  /* LOADING */
  if (loading || categoryLoading) {
    return (
      <main className="min-h-screen bg-[#fdfaf7]">
        <div className="mx-auto max-w-7xl px-5 py-10 sm:px-6 lg:px-8">
          <div className="mb-10 h-7 w-32 animate-pulse rounded-full bg-[#f7f0e9]" />

          <div className="mb-10 overflow-hidden rounded-3xl bg-[#f7f0e9]">
            <div className="h-[280px] animate-pulse sm:h-[340px]" />
          </div>

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-5">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-[330px] animate-pulse rounded-3xl bg-[#f7f0e9]"
              />
            ))}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fdfaf7]">
      {/* HERO CATEGORY */}
      <section className="border-b border-[#eadfd8] bg-gradient-to-b from-[#f7f0e9] to-[#fdfaf7]">
        <div className="mx-auto max-w-7xl px-5 py-8 sm:px-6 sm:py-12 lg:px-8">
          {/* BACK */}
          <button
            type="button"
            onClick={() => router.back()}
            className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-[#6f625d] transition-colors hover:text-[#a66a4c]"
          >
            <ArrowLeft size={17} />
            Retour aux catégories
          </button>

          {/* CATEGORY HERO */}
          <div className="relative overflow-hidden rounded-3xl bg-[#2b211f] shadow-[0_15px_45px_rgba(75,49,39,0.12)]">
            <div className="relative h-[260px] sm:h-[330px]">
              {category?.image_url && (
                <Image
                  src={category.image_url}
                  alt={category.nom}
                  fill
                  sizes="100vw"
                  className="object-cover"
                />
              )}

              <div className="absolute inset-0 bg-gradient-to-r from-[#2b211f]/95 via-[#2b211f]/65 to-[#2b211f]/20" />

              <div className="absolute inset-0 flex items-center">
                <div className="max-w-2xl px-6 sm:px-10">
                  <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 backdrop-blur-md">
                    <Sparkles size={13} className="text-[#d8b58a]" />
                    <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#ead8c0]">
                      Collection Mini Luxe
                    </span>
                  </div>

                  <h1 className="text-4xl font-semibold leading-tight text-white sm:text-5xl">
                    {category?.nom || "Notre collection"}
                  </h1>

                  <p className="mt-4 max-w-xl text-sm leading-6 text-white/75 sm:text-base">
                    Découvrez notre sélection de parfums dans cette collection
                    et trouvez la fragrance qui vous correspond.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRODUCTS */}
      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-6 sm:py-16 lg:px-8">
        {/* HEADER */}
        <div className="mb-8 flex items-end justify-between gap-5">
          <div>
            <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#a66a4c]">
              <span className="h-px w-6 bg-[#d8b58a]" />
              Notre sélection
            </p>

            <h2 className="text-3xl font-semibold text-[#2b211f] sm:text-4xl">
              {category?.nom || "Produits"}
            </h2>

            <p className="mt-2 text-sm text-[#6f625d]">
              {products.length} produit
              {products.length > 1 ? "s" : ""} disponible
              {products.length > 1 ? "s" : ""}
            </p>
          </div>

          <Link
            href="/categories"
            className="hidden items-center gap-2 text-sm font-semibold text-[#a66a4c] transition-colors hover:text-[#7d4d38] sm:flex"
          >
            Toutes les catégories
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* EMPTY */}
        {products.length === 0 ? (
          <div className="rounded-3xl border border-[#eadfd8] bg-white px-6 py-20 text-center shadow-[0_8px_30px_rgba(75,49,39,0.06)]">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f7f0e9] text-[#a66a4c]">
              <Package size={24} />
            </div>

            <h2 className="mt-5 text-2xl font-semibold text-[#2b211f]">
              Aucun produit disponible
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#6f625d]">
              Cette collection ne contient aucun produit pour le moment.
              Découvrez nos autres catégories.
            </p>

            <Link
              href="/categories"
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#a66a4c] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#7d4d38]"
            >
              Explorer les catégories
              <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <>
            {/* PRODUCT GRID */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
              {paginatedProducts.map((product) => {
                const rating = getRating(product.id);

                return (
                  <article
                    key={product.id}
                    className="group overflow-hidden rounded-3xl border border-[#eadfd8] bg-white shadow-[0_8px_30px_rgba(75,49,39,0.06)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(75,49,39,0.12)]"
                  >
                    {/* IMAGE */}
                    <Link
                      href={`/produits/${product.id}`}
                      className="block"
                    >
                      <div className="relative aspect-[4/4.6] overflow-hidden bg-[#f7f0e9]">
                        <Image
                          src={product.image_url || "/placeholder.png"}
                          alt={product.nom}
                          fill
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />

                        {/* TOP LABEL */}
                        <div className="absolute left-3 top-3 rounded-full border border-white/20 bg-[#2b211f]/65 px-2.5 py-1 backdrop-blur-md">
                          <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#ead8c0]">
                            Mini Luxe
                          </span>
                        </div>

                        {/* STOCK */}
                        {product.stock <= 0 && (
                          <div className="absolute inset-0 flex items-center justify-center bg-[#2b211f]/45">
                            <span className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-[#5a4740]">
                              Rupture de stock
                            </span>
                          </div>
                        )}
                      </div>
                    </Link>

                    {/* CONTENT */}
                    <div className="p-4 sm:p-5">
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          href={`/produits/${product.id}`}
                          className="min-w-0"
                        >
                          <h3 className="line-clamp-1 text-base font-semibold text-[#2b211f] transition-colors group-hover:text-[#a66a4c] sm:text-lg">
                            {product.nom}
                          </h3>
                        </Link>

                        <HeartBtn
                          productId={product.id}
                          initialLikes={product.jaime}
                        />
                      </div>

                      <p className="mt-2 line-clamp-2 min-h-[40px] text-xs leading-5 text-[#6f625d] sm:text-sm">
                        {product.description}
                      </p>

                      {/* RATING */}
                      <div className="mt-3 flex items-center gap-1">
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, index) => (
                            <FaStar
                              key={index}
                              size={11}
                              className={
                                index < rating
                                  ? "text-[#d8b58a]"
                                  : "text-[#e5ddd7]"
                              }
                            />
                          ))}
                        </div>

                        <span className="ml-1 text-[10px] text-[#8b7d77]">
                          {rating}.0
                        </span>
                      </div>

                      {/* PRICE */}
                      <div className="mt-3 flex items-center justify-between gap-2">
                        <p className="text-base font-semibold text-[#a66a4c] sm:text-lg">
                          {Number(product.prix).toLocaleString("fr-FR")} FCFA
                        </p>

                        <span
                          className={`hidden text-[10px] font-medium sm:block ${
                            product.stock > 0
                              ? "text-[#547a5b]"
                              : "text-[#a94b4b]"
                          }`}
                        >
                          {product.stock > 0
                            ? `${product.stock} en stock`
                            : "Indisponible"}
                        </span>
                      </div>

                      {/* ACTION */}
                      <Link
                        href={`/produits/${product.id}`}
                        className="mt-4 flex min-h-10 items-center justify-center gap-2 rounded-full border border-[#a66a4c] px-3 text-xs font-semibold text-[#a66a4c] transition-all duration-300 hover:bg-[#a66a4c] hover:text-white sm:text-sm"
                      >
                        Découvrir
                        <ArrowUpRight
                          size={15}
                          className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        />
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* PAGINATION */}
            {totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-3">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() =>
                    setCurrentPage((page) => Math.max(1, page - 1))
                  }
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[#eadfd8] bg-white text-[#6f625d] transition hover:border-[#a66a4c] hover:text-[#a66a4c] disabled:cursor-not-allowed disabled:opacity-35"
                  aria-label="Page précédente"
                >
                  <ChevronLeft size={18} />
                </button>

                <div className="flex h-10 min-w-24 items-center justify-center rounded-full bg-[#f7f0e9] px-4 text-xs font-semibold text-[#5a4740]">
                  Page {currentPage} / {totalPages}
                </div>

                <button
                  type="button"
                  disabled={currentPage === totalPages}
                  onClick={() =>
                    setCurrentPage((page) =>
                      Math.min(totalPages, page + 1)
                    )
                  }
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[#eadfd8] bg-white text-[#6f625d] transition hover:border-[#a66a4c] hover:text-[#a66a4c] disabled:cursor-not-allowed disabled:opacity-35"
                  aria-label="Page suivante"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </>
        )}

        {/* MOBILE CATEGORIES LINK */}
        <div className="mt-10 flex justify-center sm:hidden">
          <Link
            href="/categories"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#a66a4c]"
          >
            Toutes les catégories
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </main>
  );
}