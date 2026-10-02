"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import React, { useEffect, useState } from "react";

type Typecategories = {
  id: number;
  nom: string;
  image_url: string;
};

const Nouveau = () => {
  const [categories, setCategories] = useState<Typecategories[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch("/api/category", {
          method: "GET",
          headers: token
            ? {
                Authorization: `Bearer ${token}`,
              }
            : {},
        });

        if (!res.ok) {
          throw new Error("Impossible de récupérer les catégories");
        }

        const data = await res.json();

        setCategories(
          Array.isArray(data?.data) ? data.data : []
        );
      } catch (error) {
        console.error("Erreur récupération catégories :", error);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <section className="mx-auto mt-16 w-full max-w-7xl px-5 sm:px-6 lg:px-8">
      {/* HEADER */}
      <div className="mb-8 flex items-end justify-between gap-6">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.28em] !text-[#a66a4c]">
            Découvrez notre univers
          </p>

          <h2 className="font-[family-name:var(--font-playfair)] text-3xl font-semibold leading-tight !text-[#5a4740] sm:text-4xl">
            Explorer par catégorie
          </h2>

          <p className="mt-3 max-w-xl text-sm leading-6 text-[#6f625d]">
            Trouvez le parfum qui correspond à votre style, votre personnalité
            et chaque moment de votre vie.
          </p>
        </div>

        <Link
          href="/categories"
          className="group hidden shrink-0 items-center gap-2 text-sm font-semibold !text-[#a66a4c] transition-colors duration-300 hover:!text-[#7d4d38] sm:flex"
        >
          Voir toute la collection
          <ArrowRight
            size={17}
            className="transition-transform duration-300 group-hover:translate-x-1"
          />
        </Link>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="flex gap-5 overflow-hidden">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-72 min-w-[230px] animate-pulse rounded-2xl bg-[#f7f0e9] sm:min-w-[250px]"
            />
          ))}
        </div>
      )}

      {/* EMPTY */}
      {!loading && categories.length === 0 && (
        <div className="rounded-2xl border border-[#eadfd8] bg-[#fdfaf7] px-6 py-12 text-center">
          <p className="text-sm text-[#6f625d]">
            Aucune catégorie disponible pour le moment.
          </p>
        </div>
      )}

      {/* CATEGORIES */}
      {!loading && categories.length > 0 && (
        <div className="scrollbar-hide flex snap-x snap-mandatory gap-5 overflow-x-auto pb-5">
          {categories.map((item) => (
            <Link
              key={item.id}
              href={`/categories/${item.id}`}
              className="group relative min-w-[245px] snap-start overflow-hidden rounded-2xl bg-[#2b211f] shadow-[0_10px_35px_rgba(75,49,39,0.10)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(75,49,39,0.16)] sm:min-w-[270px]"
            >
              {/* IMAGE */}
              <div className="relative h-72 w-full overflow-hidden">
                <Image
                  src={item.image_url || "/placeholder.png"}
                  alt={item.nom}
                  fill
                  sizes="(max-width: 640px) 245px, 270px"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* OVERLAY */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#2b211f]/90 via-[#2b211f]/20 to-transparent" />

                {/* TOP BADGE */}
                <div className="absolute left-4 top-4 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 backdrop-blur-md">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#f3dfc3]">
                    Mini Luxe
                  </span>
                </div>

                {/* CONTENT */}
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <div className="flex items-end justify-between gap-4">
                    <div>
                      <p className="mb-1 text-[10px] font-medium uppercase tracking-[0.18em] text-[#ead8c0]">
                        Collection
                      </p>

                      <h3 className="font-[family-name:var(--font-playfair)] text-2xl font-semibold text-white!">
                        {item.nom}
                      </h3>
                    </div>

                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#d8b58a] text-[#2b211f] transition-all duration-300 group-hover:rotate-45 group-hover:bg-[#ead8c0]">
                      <ArrowUpRight size={19} />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* MOBILE LINK */}
      {!loading && categories.length > 0 && (
        <div className="mt-2 flex justify-center sm:hidden">
          <Link
            href="/produits"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-[#a66a4c]!"
          >
            Voir toute la collection
            <ArrowRight
              size={17}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </div>
      )}
    </section>
  );
};

export default Nouveau;