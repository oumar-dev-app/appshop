"use client";

import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
} from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Heart } from "lucide-react";
import { FaStar } from "react-icons/fa";
import Link from "next/link";
import HeartBtn from "@/_Components/HeartBtn";

type Produits = {
  id: number;
  nom: string;
  description: string;
  stock: number;
  prix: number;
  image_url?: string;
  category_id: number;
  jaime: number;
};

/* CARD PRODUIT */
const ProduitCard = React.memo(({ p }: { p: Produits }) => {
  const rating = (p.id % 5) + 1;

  return (
    <article className="fade-item group min-w-[270px] snap-start overflow-hidden rounded-2xl border border-[#eadfd8] bg-white shadow-[0_8px_30px_rgba(75,49,39,0.07)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(75,49,39,0.13)] sm:min-w-[290px]">
      {/* IMAGE */}
      <div className="relative h-[300px] w-full overflow-hidden bg-[#f7f0e9]">
        <Image
          src={
            p.image_url?.startsWith("http")
              ? p.image_url
              : p.image_url || "/placeholder.png"
          }
          alt={p.nom}
          fill
          sizes="(max-width: 640px) 270px, 290px"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* IMAGE OVERLAY */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#2b211f]/25 via-transparent to-transparent opacity-70" />
        {/* FAVORI */}
        <div className="absolute right-4 top-4 z-10">
          <HeartBtn
            productId={p.id}
            initialLikes={p.jaime}
          />
        </div>

        {/* BADGE */}
        {p.stock > 0 && (
          <div className="absolute bottom-4 left-4 rounded-full border border-white/30 bg-[#2b211f]/70 px-3 py-1.5 backdrop-blur-md">
            <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#f3dfc3]">
              Disponible
            </span>
          </div>
        )}

        {p.stock === 0 && (
          <div className="absolute bottom-4 left-4 rounded-full bg-[#2b211f]/80 px-3 py-1.5 backdrop-blur-md">
            <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white">
              Rupture de stock
            </span>
          </div>
        )}
      </div>

      {/* CONTENT */}
      <div className="p-5">
        <div className="min-h-[86px]">
          <h3 className="line-clamp-1 font-[family-name:var(--font-playfair)] text-xl font-semibold !text-[#5a4740]">
            {p.nom}
          </h3>

          <p className="mt-2 line-clamp-2 text-xs leading-5 text-[#8b7d77]">
            {p.description}
          </p>
        </div>

        {/* PRICE / STOCK */}
        <div className="mt-4 flex items-end justify-between gap-3">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-[#a66a4c]">
              Prix
            </p>

            <span className="mt-1 block text-lg font-semibold !text-[#a66a4c]">
              {p.prix.toLocaleString("fr-FR")} FCFA
            </span>
          </div>

          <span className="text-[11px] text-[#8b7d77]">
            {p.stock > 0 ? `${p.stock} en stock` : "Indisponible"}
          </span>
        </div>

        {/* STARS */}
        <div className="mt-3 flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <FaStar
              key={i}
              size={12}
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

        {/* ACTIONS */}
        <div className="mt-5">
          <Link
            href={`/produits/${p.id}`}
            className="group/button flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-[#a66a4c] bg-[#a66a4c] px-4 text-sm font-semibold !text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#7d4d38] hover:shadow-[0_10px_25px_rgba(125,77,56,0.18)]"
          >
            Découvrir le parfum
            <ArrowRight
              size={16}
              className="transition-transform duration-300 group-hover/button:translate-x-1"
            />
          </Link>
        </div>
      </div>
    </article>
  );
});

ProduitCard.displayName = "ProduitCard";

const ProduitVedette = () => {
  const [produits, setProduits] = useState<Produits[]>([]);
  const [loading, setLoading] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);

  /* SCROLL */
  const scroll = useCallback((direction: "left" | "right") => {
    if (!scrollRef.current) return;

    const scrollAmount = 320;

    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  }, []);

  /* ANIMATION */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
          }
        });
      },
      { threshold: 0.15 }
    );

    const elements = document.querySelectorAll(".fade-item");

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [produits]);

  /* FETCH PRODUITS */
  useEffect(() => {
    const fetchProduits = async () => {
      setLoading(true);

      try {
        const token = localStorage.getItem("token");

        const res = await fetch("/api/produits", {
          method: "GET",
          headers: token
            ? {
              Authorization: `Bearer ${token}`,
            }
            : {},
        });

        if (!res.ok) {
          throw new Error("Erreur lors du chargement des produits");
        }

        const data = await res.json();

        setProduits(
          Array.isArray(data?.data) ? data.data : []
        );
      } catch (error) {
        console.error("Erreur récupération produits :", error);
        setProduits([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProduits();
  }, []);

  return (
    <section className="mt-10 py-10">
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8">
        {/* HEADER */}
        <div className="mb-9 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.28em] !text-[#a66a4c]">
              Notre sélection
            </p>

            <h2 className="font-[family-name:var(--font-playfair)] text-3xl font-semibold leading-tight !text-[#5a4740] sm:text-4xl">
              Nos parfums en vedette
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#6f625d]">
              Découvrez les fragrances qui attirent le plus
              l’attention et trouvez celle qui vous correspond.
            </p>
          </div>

          {/* NAVIGATION */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Produits précédents"
              onClick={() => scroll("left")}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[#d8b58a] bg-white !text-[#a66a4c] shadow-sm transition-all duration-300 hover:bg-[#a66a4c] hover:!text-white"
            >
              <ArrowLeft size={18} />
            </button>

            <button
              type="button"
              aria-label="Produits suivants"
              onClick={() => scroll("right")}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[#d8b58a] bg-white !text-[#a66a4c] shadow-sm transition-all duration-300 hover:bg-[#a66a4c] hover:!text-white"
            >
              <ArrowRight size={18} />
            </button>
          </div>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="flex gap-5 overflow-hidden">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-[520px] min-w-[270px] animate-pulse rounded-2xl bg-[#f7f0e9] sm:min-w-[290px]"
              />
            ))}
          </div>
        )}

        {/* EMPTY */}
        {!loading && produits.length === 0 && (
          <div className="rounded-2xl border border-[#eadfd8] bg-[#fdfaf7] px-6 py-12 text-center">
            <p className="text-sm text-[#6f625d]">
              Aucun parfum disponible pour le moment.
            </p>
          </div>
        )}

        {/* PRODUITS */}
        {!loading && produits.length > 0 && (
          <div
            ref={scrollRef}
            className="scrollbar-hide flex snap-x snap-mandatory gap-5 overflow-x-auto pb-5"
          >
            {produits.map((p) => (
              <ProduitCard key={p.id} p={p} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ProduitVedette;