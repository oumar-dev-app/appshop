"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Heart,
} from "lucide-react";
import { FaStar } from "react-icons/fa";

type Produit = {
  id: number;
  nom: string;
  description: string;
  stock: number;
  prix: number;
  image_url?: string;
  category_id: number;
  jaime?: number;
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

  const [pageByCategory, setPageByCategory] = useState<
    Record<number, number>
  >({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const headers: HeadersInit = token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : {};

        const [catRes, prodRes] = await Promise.all([
          fetch("/api/category", {
            headers,
          }),
          fetch("/api/produits", {
            headers,
          }),
        ]);

        const catData = await catRes.json();
        const prodData = await prodRes.json();

        setCategories(
          Array.isArray(catData?.data)
            ? catData.data
            : []
        );

        setProduits(
          Array.isArray(prodData?.data)
            ? prodData.data
            : []
        );
      } catch (error) {
        console.error(
          "Erreur chargement boutique :",
          error
        );

        setCategories([]);
        setProduits([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getRating = (id: number) => (id % 5) + 1;

  const setPage = (
    categoryId: number,
    page: number
  ) => {
    setPageByCategory((prev) => ({
      ...prev,
      [categoryId]: page,
    }));
  };

  if (loading) {
    return (
      <main className="min-h-[70vh] bg-[#fdfaf7]">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <div className="mx-auto h-3 w-32 animate-pulse rounded-full bg-[#f7f0e9]" />
            <div className="mx-auto mt-4 h-10 w-64 animate-pulse rounded-full bg-[#f7f0e9]" />
            <div className="mx-auto mt-4 h-4 w-80 max-w-full animate-pulse rounded-full bg-[#f7f0e9]" />
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(
              (item) => (
                <div
                  key={item}
                  className="overflow-hidden rounded-2xl border border-[#eadfd8] bg-white"
                >
                  <div className="h-52 animate-pulse bg-[#f7f0e9] sm:h-64" />

                  <div className="space-y-3 p-4">
                    <div className="h-5 animate-pulse rounded bg-[#f7f0e9]" />
                    <div className="h-3 animate-pulse rounded bg-[#f7f0e9]" />
                    <div className="h-3 w-2/3 animate-pulse rounded bg-[#f7f0e9]" />
                    <div className="h-10 animate-pulse rounded-full bg-[#f7f0e9]" />
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fdfaf7]">
      {/* HERO */}
      <section className="border-b border-[#eadfd8] bg-[#f7f0e9]">
        <div className="mx-auto max-w-7xl px-5 py-14 text-center sm:px-6 sm:py-18 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] !text-[#a66a4c]">
            Mini Luxe Parfum
          </p>

          <h1 className="mt-3 font-[family-name:var(--font-playfair)] text-4xl font-semibold leading-tight !text-[#5a4740] sm:text-5xl lg:text-6xl">
            Notre boutique
          </h1>

          <div className="mx-auto mt-5 h-px w-16 bg-[#d8b58a]" />

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 !text-[#6f625d] sm:text-[15px]">
            Découvrez notre sélection de parfums et trouvez
            la fragrance qui correspond à votre personnalité.
          </p>
        </div>
      </section>

      {/* CATALOGUE */}
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-6 lg:px-8 lg:py-20">
        {categories.map((categorie) => {
          const produitsCategorie = produits.filter(
            (produit) =>
              produit.category_id === categorie.id
          );

          if (produitsCategorie.length === 0) {
            return null;
          }

          const currentPage =
            pageByCategory[categorie.id] || 1;

          const totalPages = Math.ceil(
            produitsCategorie.length /
              ITEMS_PER_PAGE
          );

          const start =
            (currentPage - 1) * ITEMS_PER_PAGE;

          const paginatedProducts =
            produitsCategorie.slice(
              start,
              start + ITEMS_PER_PAGE
            );

          return (
            <section
              key={categorie.id}
              className="mb-16 last:mb-0 sm:mb-20"
            >
              {/* CATEGORY HEADER */}
              <div className="mb-7 flex items-end justify-between gap-4 border-b border-[#eadfd8] pb-5">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.25em] !text-[#a66a4c]">
                    Collection
                  </p>

                  <h2 className="mt-1 font-[family-name:var(--font-playfair)] text-2xl font-semibold !text-[#5a4740] sm:text-3xl">
                    {categorie.nom}
                  </h2>
                </div>

                <span className="hidden text-xs !text-[#8b7d77] sm:block">
                  {produitsCategorie.length} parfum
                  {produitsCategorie.length > 1
                    ? "s"
                    : ""}
                </span>
              </div>

              {/* PRODUCTS */}
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
                {paginatedProducts.map(
                  (produit) => {
                    const rating = getRating(
                      produit.id
                    );

                    return (
                      <article
                        key={produit.id}
                        className="group overflow-hidden rounded-2xl border border-[#eadfd8] bg-white shadow-[0_8px_30px_rgba(75,49,39,0.06)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(75,49,39,0.12)]"
                      >
                        {/* IMAGE */}
                        <Link
                          href={`/produits/${produit.id}`}
                          className="block"
                        >
                          <div className="relative h-52 w-full overflow-hidden bg-[#f7f0e9] sm:h-64">
                            <Image
                              src={
                                produit.image_url?.startsWith(
                                  "http"
                                )
                                  ? produit.image_url
                                  : produit.image_url ||
                                    "/placeholder.png"
                              }
                              alt={produit.nom}
                              fill
                              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
                              className="object-cover transition-transform duration-700 group-hover:scale-105"
                            />

                            <div className="absolute inset-0 bg-gradient-to-t from-[#2b211f]/25 via-transparent to-transparent" />

                            {/* FAVORI */}
                            <div className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border border-white/40 bg-[#fdfaf7]/90 backdrop-blur-md">
                              <Heart
                                size={17}
                                strokeWidth={1.8}
                                className="!text-[#a66a4c]"
                              />
                            </div>

                            {/* STOCK */}
                            <div className="absolute bottom-3 left-3">
                              {produit.stock > 0 ? (
                                <span className="rounded-full border border-white/30 bg-[#2b211f]/70 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.13em] !text-[#f3dfc3] backdrop-blur-md">
                                  Disponible
                                </span>
                              ) : (
                                <span className="rounded-full bg-[#2b211f]/80 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.13em] !text-white backdrop-blur-md">
                                  Rupture
                                </span>
                              )}
                            </div>
                          </div>
                        </Link>

                        {/* INFOS */}
                        <div className="p-4">
                          <Link
                            href={`/produits/${produit.id}`}
                          >
                            <h3 className="line-clamp-1 font-[family-name:var(--font-playfair)] text-lg font-semibold !text-[#5a4740] transition-colors duration-300 group-hover:!text-[#a66a4c] sm:text-xl">
                              {produit.nom}
                            </h3>
                          </Link>

                          <p className="mt-1.5 line-clamp-2 min-h-10 text-[11px] leading-5 !text-[#8b7d77] sm:text-xs">
                            {produit.description}
                          </p>

                          {/* PRICE */}
                          <div className="mt-4 flex items-end justify-between gap-2">
                            <div>
                              <p className="text-[9px] font-medium uppercase tracking-[0.15em] !text-[#a66a4c]">
                                Prix
                              </p>

                              <p className="mt-0.5 text-sm font-semibold !text-[#a66a4c] sm:text-base">
                                {produit.prix.toLocaleString(
                                  "fr-FR"
                                )}{" "}
                                FCFA
                              </p>
                            </div>

                            <span className="text-[9px] !text-[#8b7d77] sm:text-[10px]">
                              {produit.stock > 0
                                ? `${produit.stock} en stock`
                                : "Indisponible"}
                            </span>
                          </div>

                          {/* RATING */}
                          <div className="mt-3 flex items-center gap-0.5">
                            {[
                              0, 1, 2, 3, 4,
                            ].map((star) => (
                              <FaStar
                                key={star}
                                size={10}
                                className={
                                  star < rating
                                    ? "!text-[#d8b58a]"
                                    : "!text-[#eadfd8]"
                                }
                              />
                            ))}

                            <span className="ml-1 text-[9px] !text-[#8b7d77]">
                              ({rating}.0)
                            </span>
                          </div>

                          {/* CTA */}
                          <Link
                            href={`/produits/${produit.id}`}
                            className="mt-4 flex min-h-10 items-center justify-center gap-1.5 rounded-full bg-[#a66a4c] px-3 text-[11px] font-semibold !text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#7d4d38] hover:shadow-[0_8px_20px_rgba(125,77,56,0.18)] sm:text-xs"
                          >
                            Découvrir
                            <ArrowRight size={14} />
                          </Link>
                        </div>
                      </article>
                    );
                  }
                )}
              </div>

              {/* PAGINATION */}
              {totalPages > 1 && (
                <div className="mt-8 flex items-center justify-center gap-2">
                  <button
                    type="button"
                    disabled={currentPage === 1}
                    onClick={() =>
                      setPage(
                        categorie.id,
                        currentPage - 1
                      )
                    }
                    aria-label="Page précédente"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-[#eadfd8] bg-white !text-[#a66a4c] transition-all duration-300 hover:border-[#d8b58a] hover:bg-[#f7f0e9] disabled:cursor-not-allowed disabled:opacity-35"
                  >
                    <ArrowLeft size={14} />
                  </button>

                  <div className="flex items-center gap-1">
                    {Array.from({
                      length: totalPages,
                    }).map((_, index) => {
                      const page = index + 1;

                      return (
                        <button
                          type="button"
                          key={page}
                          onClick={() =>
                            setPage(
                              categorie.id,
                              page
                            )
                          }
                          className={`flex h-9 min-w-9 items-center justify-center rounded-full px-2 text-[11px] font-semibold transition-all duration-300 ${
                            currentPage === page
                              ? "bg-[#a66a4c] !text-white shadow-[0_6px_16px_rgba(166,106,76,0.18)]"
                              : "border border-[#eadfd8] bg-white !text-[#6f625d] hover:border-[#d8b58a] hover:!text-[#a66a4c]"
                          }`}
                        >
                          {page}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    type="button"
                    disabled={
                      currentPage === totalPages
                    }
                    onClick={() =>
                      setPage(
                        categorie.id,
                        currentPage + 1
                      )
                    }
                    aria-label="Page suivante"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-[#eadfd8] bg-white !text-[#a66a4c] transition-all duration-300 hover:border-[#d8b58a] hover:bg-[#f7f0e9] disabled:cursor-not-allowed disabled:opacity-35"
                  >
                    <ArrowRight size={14} />
                  </button>
                </div>
              )}
            </section>
          );
        })}

        {/* EMPTY STATE */}
        {categories.every(
          (categorie) =>
            !produits.some(
              (produit) =>
                produit.category_id === categorie.id
            )
        ) && (
          <div className="py-20 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] !text-[#a66a4c]">
              Mini Luxe Parfum
            </p>

            <h2 className="mt-3 font-[family-name:var(--font-playfair)] text-2xl font-semibold !text-[#5a4740]">
              Notre boutique se prépare
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 !text-[#8b7d77]">
              Nos parfums seront bientôt disponibles.
              Revenez découvrir notre sélection.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

