"use client";

import React, {
  useState,
  useEffect,
  useCallback,
} from "react";
import Image from "next/image";
import Link from "next/link";
import { FaStar } from "react-icons/fa";
import { ArrowLeft, ArrowRight } from "lucide-react";
import HeartBtn from "./HeartBtn";

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
};

/* =========================
   PRODUCT CARD
========================= */

const ProduitCard = React.memo(({ p }: { p: Produit }) => {
  const rating = (p.id % 5) + 1;

  return (
    <article className="group overflow-hidden rounded-2xl border border-[#eadfd8] bg-white shadow-[0_8px_30px_rgba(75,49,39,0.07)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(75,49,39,0.13)]">
      {/* IMAGE */}
      <div className="relative h-[280px] w-full overflow-hidden bg-[#f7f0e9]">
        <Image
          src={
            p.image_url?.startsWith("http")
              ? p.image_url
              : p.image_url || "/placeholder.png"
          }
          alt={p.nom}
          fill
          sizes="(max-width: 640px) 80vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[#2b211f]/25 via-transparent to-transparent" />

        {/* FAVORI */}
        <div className="absolute right-4 top-4 z-10">
          <HeartBtn
            productId={p.id}
            initialLikes={p.jaime}
          />
        </div>

        {/* DISPONIBILITÉ */}
        <div className="absolute bottom-4 left-4">
          {p.stock > 0 ? (
            <span className="rounded-full border border-white/30 bg-[#2b211f]/70 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#f3dfc3] backdrop-blur-md">
              Disponible
            </span>
          ) : (
            <span className="rounded-full bg-[#2b211f]/80 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-white backdrop-blur-md">
              Rupture de stock
            </span>
          )}
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-5">
        <div className="min-h-[78px]">
          <h3 className="line-clamp-1 font-[family-name:var(--font-playfair)] text-xl font-semibold !text-[#5a4740]">
            {p.nom}
          </h3>

          <p className="mt-2 line-clamp-2 text-xs leading-5 text-[#8b7d77]">
            {p.description}
          </p>
        </div>

        {/* PRICE */}
        <div className="mt-4 flex items-end justify-between gap-3">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.16em] !text-[#a66a4c]">
              Prix
            </p>

            <span className="mt-1 block text-lg font-semibold !text-[#a66a4c]">
              {p.prix.toLocaleString("fr-FR")} FCFA
            </span>
          </div>

          <span className="text-[11px] text-[#8b7d77]">
            {p.stock > 0
              ? `${p.stock} en stock`
              : "Indisponible"}
          </span>
        </div>

        {/* RATING */}
        <div className="mt-3 flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <FaStar
              key={i}
              size={11}
              className={
                i < rating
                  ? "!text-[#d8b58a]"
                  : "!text-[#eadfd8]"
              }
            />
          ))}

          <span className="ml-1 text-[10px] text-[#8b7d77]">
            ({rating}.0)
          </span>
        </div>

        {/* BUTTON */}
        <Link
          href={`/produits/${p.id}`}
          className="mt-5 flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-[#a66a4c] px-4 text-sm font-semibold !text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#7d4d38] hover:shadow-[0_10px_25px_rgba(125,77,56,0.18)]"
        >
          Découvrir
          <ArrowRight size={16} />
        </Link>
      </div>
    </article>
  );
});

ProduitCard.displayName = "ProduitCard";

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
      type="button"
      onClick={onClick}
      className={`
        whitespace-nowrap rounded-full border px-5 py-2.5
        text-xs font-semibold tracking-[0.04em]
        transition-all duration-300
        ${
          selected
            ? "border-[#a66a4c] bg-[#a66a4c] !text-white shadow-[0_8px_20px_rgba(166,106,76,0.18)]"
            : "border-[#eadfd8] bg-white !text-[#6f625d] hover:border-[#d8b58a] hover:!text-[#a66a4c]"
        }
      `}
    >
      {item.nom}
    </button>
  )
);

CategoryButton.displayName = "CategoryButton";

/* =========================
   MAIN COMPONENT
========================= */

export default function VenteFlashMenu() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [produits, setProduits] = useState<Produit[]>([]);
  const [selectedCategory, setSelectedCategory] =
    useState<number | null>(null);

  const [loadingCategories, setLoadingCategories] =
    useState(false);

  const [loadingProducts, setLoadingProducts] =
    useState(false);

  const [cache, setCache] =
    useState<Record<number, Produit[]>>({});

  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 6;

  /* =========================
     FETCH CATEGORIES
  ========================= */

  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true);

      try {
        const token = localStorage.getItem("token");

        const res = await fetch("/api/category", {
          headers: token
            ? {
                Authorization: `Bearer ${token}`,
              }
            : {},
        });

        const data = await res.json();

        setCategories(
          Array.isArray(data?.data)
            ? data.data
            : []
        );
      } catch (err) {
        console.error(
          "Erreur récupération catégories :",
          err
        );

        setCategories([]);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  /* =========================
     FETCH PRODUCTS + CACHE
  ========================= */

  const loadProducts = useCallback(
    async (id: number) => {
      if (selectedCategory === id) return;

      if (cache[id]) {
        setProduits(cache[id]);
        setSelectedCategory(id);
        return;
      }

      setLoadingProducts(true);

      try {
        const token = localStorage.getItem("token");

        const res = await fetch(
          `/api/category/${id}/produits`,
          {
            headers: token
              ? {
                  Authorization: `Bearer ${token}`,
                }
              : {},
          }
        );

        const data = await res.json();

        const items = Array.isArray(data)
          ? data
          : data?.data ?? [];

        setProduits(items);

        setCache((prev) => ({
          ...prev,
          [id]: items,
        }));

        setSelectedCategory(id);
      } catch (err) {
        console.error(
          "Erreur récupération produits :",
          err
        );

        setProduits([]);
      } finally {
        setLoadingProducts(false);
      }
    },
    [selectedCategory, cache]
  );

  /* =========================
     AUTO FIRST CATEGORY
  ========================= */

  useEffect(() => {
    if (
      categories.length > 0 &&
      selectedCategory === null
    ) {
      loadProducts(categories[0].id);
    }
  }, [
    categories,
    selectedCategory,
    loadProducts,
  ]);

  /* =========================
     RESET PAGE
  ========================= */

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory]);

  /* =========================
     PAGINATION
  ========================= */

  const totalPages = Math.ceil(
    produits.length / itemsPerPage
  );

  const paginatedProducts = produits.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  /* =========================
     RENDER
  ========================= */

  return (
    <section className="w-full">
      {/* HEADER */}
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-7 px-5 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] !text-[#a66a4c]">
            Sélection exclusive
          </p>

          <h2 className="mt-2 font-[family-name:var(--font-playfair)] text-3xl font-semibold leading-tight !text-[#5a4740] sm:text-4xl">
            Les offres du moment
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-[#6f625d]">
            Découvrez nos parfums sélectionnés à des prix
            privilégiés pour une durée limitée.
          </p>
        </div>

        {/* CATEGORIES */}
        <div className="scrollbar-hide flex gap-2 overflow-x-auto pb-2 md:justify-center">
          {loadingCategories ? (
            <div className="h-10 w-32 animate-pulse rounded-full bg-[#f7f0e9]" />
          ) : (
            categories.map((cat) => (
              <CategoryButton
                key={cat.id}
                item={cat}
                selected={
                  selectedCategory === cat.id
                }
                onClick={() =>
                  loadProducts(cat.id)
                }
              />
            ))
          )}
        </div>
      </div>

      {/* PRODUCTS */}
      <div className="mx-auto mt-8 w-full max-w-7xl px-5 sm:px-6 lg:px-8">
        {loadingProducts && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-[520px] animate-pulse rounded-2xl bg-[#f7f0e9]"
              />
            ))}
          </div>
        )}

        {!loadingProducts &&
          produits.length > 0 && (
            <>
              {/* MOBILE */}
              <div className="scrollbar-hide flex snap-x snap-mandatory gap-5 overflow-x-auto pb-5 sm:hidden">
                {paginatedProducts.map((p) => (
                  <div
                    key={p.id}
                    className="min-w-[82%] snap-start"
                  >
                    <ProduitCard p={p} />
                  </div>
                ))}
              </div>

              {/* DESKTOP */}
              <div className="hidden grid-cols-2 gap-5 sm:grid lg:grid-cols-3">
                {paginatedProducts.map((p) => (
                  <ProduitCard
                    key={p.id}
                    p={p}
                  />
                ))}
              </div>
            </>
          )}

        {/* PAGINATION */}
        {produits.length > itemsPerPage && (
          <div className="mt-7 flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={() =>
                setCurrentPage((page) =>
                  Math.max(page - 1, 1)
                )
              }
              disabled={currentPage === 1}
              aria-label="Page précédente"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#eadfd8] bg-white !text-[#a66a4c] transition-all duration-300 hover:border-[#d8b58a] hover:bg-[#f7f0e9] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ArrowLeft size={17} />
            </button>

            <span className="text-xs font-medium tracking-[0.08em] text-[#6f625d]">
              {currentPage} / {totalPages}
            </span>

            <button
              type="button"
              onClick={() =>
                setCurrentPage((page) =>
                  Math.min(
                    page + 1,
                    totalPages
                  )
                )
              }
              disabled={
                currentPage === totalPages
              }
              aria-label="Page suivante"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#eadfd8] bg-white !text-[#a66a4c] transition-all duration-300 hover:border-[#d8b58a] hover:bg-[#f7f0e9] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ArrowRight size={17} />
            </button>
          </div>
        )}

        {/* EMPTY */}
        {!loadingProducts &&
          produits.length === 0 &&
          selectedCategory !== null && (
            <div className="rounded-2xl border border-[#eadfd8] bg-[#fdfaf7] px-6 py-14 text-center">
              <p className="font-[family-name:var(--font-playfair)] text-xl !text-[#5a4740]">
                Aucun parfum disponible
              </p>

              <p className="mt-2 text-sm text-[#8b7d77]">
                Cette sélection ne contient aucun produit
                pour le moment.
              </p>
            </div>
          )}
      </div>
    </section>
  );
}