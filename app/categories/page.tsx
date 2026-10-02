"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

type Category = {
  id: number;
  nom: string;
  image_url?: string;
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch("/api/category", {
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

        setCategories(Array.isArray(data?.data) ? data.data : []);
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
    <main className="min-h-screen bg-[#fdfaf7]">
      {/* HERO */}
      <section className="border-b border-[#eadfd8] bg-gradient-to-b from-[#f7f0e9] to-[#fdfaf7]">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-6 sm:py-18 lg:px-8">
          <div className="max-w-3xl">
            <Link
              href="/"
              className="mb-7 inline-flex items-center gap-2 text-sm font-medium text-[#a66a4c] transition hover:text-[#7d4d38]"
            >
              <ArrowRight size={16} className="rotate-180" />
              Retour à l'accueil
            </Link>

            <div className="mb-3 flex items-center gap-2 text-[#a66a4c]">
              <Sparkles size={16} />
              <span className="text-xs font-semibold uppercase tracking-[0.28em]">
                L'univers Mini Luxe
              </span>
            </div>

            <h1 className="text-4xl font-semibold leading-tight text-[#2b211f] sm:text-5xl lg:text-6xl">
              Nos catégories
            </h1>

            <p className="mt-5 max-w-2xl text-sm leading-7 text-[#6f625d] sm:text-base">
              Explorez notre sélection de parfums et découvrez les collections
              pensées pour chaque personnalité, chaque style et chaque occasion.
            </p>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-6 sm:py-16 lg:px-8">
        {loading ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
              <div
                key={item}
                className="h-[360px] animate-pulse overflow-hidden rounded-3xl bg-[#f7f0e9]"
              />
            ))}
          </div>
        ) : categories.length === 0 ? (
          <div className="rounded-3xl border border-[#eadfd8] bg-white px-6 py-20 text-center shadow-[0_8px_30px_rgba(75,49,39,0.06)]">
            <Sparkles className="mx-auto mb-4 text-[#d8b58a]" size={28} />

            <h2 className="text-2xl font-semibold text-[#2b211f]">
              Aucune catégorie disponible
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#6f625d]">
              Les catégories seront bientôt disponibles dans notre boutique.
            </p>

            <Link
              href="/produits"
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#a66a4c] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#7d4d38]"
            >
              Découvrir les produits
              <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-8 flex items-end justify-between gap-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#a66a4c]">
                  Collection
                </p>

                <h2 className="mt-2 text-2xl font-semibold text-[#2b211f] sm:text-3xl">
                  Choisissez votre univers
                </h2>
              </div>

              <span className="hidden rounded-full border border-[#eadfd8] bg-white px-4 py-2 text-xs font-medium text-[#6f625d] sm:block">
                {categories.length} catégorie
                {categories.length > 1 ? "s" : ""}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/categories/${category.id}`}
                  className="group relative overflow-hidden rounded-3xl bg-[#2b211f] shadow-[0_10px_35px_rgba(75,49,39,0.10)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(75,49,39,0.17)]"
                >
                  <div className="relative h-[360px] w-full">
                    <Image
                      src={category.image_url || "/placeholder.png"}
                      alt={category.nom}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-[#2b211f]/95 via-[#2b211f]/25 to-transparent" />

                    <div className="absolute left-5 top-5 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 backdrop-blur-md">
                      <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#ead8c0]">
                        Mini Luxe
                      </span>
                    </div>

                    <div className="absolute inset-x-0 bottom-0 p-5">
                      <div className="flex items-end justify-between gap-4">
                        <div>
                          <p className="mb-1 text-[10px] font-medium uppercase tracking-[0.18em] text-[#d8b58a]">
                            Collection
                          </p>

                          <h3 className="text-2xl font-semibold text-white">
                            {category.nom}
                          </h3>
                        </div>

                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#d8b58a] text-[#2b211f] transition-all duration-300 group-hover:rotate-45 group-hover:bg-[#ead8c0]">
                          <ArrowUpRight size={19} />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </section>
    </main>
  );
}
