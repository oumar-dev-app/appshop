"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

type SlideType = {
  id: number;
  image_url: string;
  title?: string;
  description?: string;
};

const Slider = () => {
  const [slides, setSlides] = useState<SlideType[]>([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch("/api/homebar", {
          method: "GET",
          headers: token
            ? {
              Authorization: `Bearer ${token}`,
            }
            : {},
        });

        if (!res.ok) {
          throw new Error("Impossible de récupérer les slides");
        }

        const data = await res.json();

        setSlides(Array.isArray(data?.data) ? data.data : []);
      } catch (error) {
        console.error("Erreur récupération slider :", error);
        setSlides([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSlides();
  }, []);

  useEffect(() => {
    if (slides.length <= 1) return;

    const interval = window.setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => window.clearInterval(interval);
  }, [slides.length]);

  const previousSlide = () => {
    setCurrent((prev) =>
      prev === 0 ? slides.length - 1 : prev - 1
    );
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  if (loading) {
    return (
      <section className="relative h-107.5 w-full overflow-hidden bg-[#f7f0e9] sm:h-125 lg:h-142.5">
        <div className="flex h-full items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#d8b58a] border-t-transparent" />
        </div>
      </section>
    );
  }

  if (slides.length === 0) {
    return (
      <section className="relative overflow-hidden bg-[#f7f0e9]">
        <div className="mx-auto flex min-h-107.5 max-w-7xl items-center px-6 py-16 sm:min-h-125 lg:min-h-142.5 lg:px-10">
          <div className="max-w-2xl">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-[#a66a4c]">
              Mini Luxe Parfum
            </p>

            <h1 className="font-(family-name:--font-playfair) text-4xl font-semibold leading-tight text-[#2b211f] sm:text-5xl lg:text-6xl">
              Laissez votre parfum
              <span className="block text-[#a66a4c]">
                raconter votre histoire.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-sm leading-7 text-[#6f625d] sm:text-base">
              Découvrez notre sélection de parfums soigneusement choisis
              pour révéler votre style, votre personnalité et votre élégance.
            </p>

            <Link
              href="/produits"
              className="mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#a66a4c] px-7 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#7d4d38] hover:shadow-[0_10px_25px_rgba(125,77,56,0.2)]"
            >
              Découvrir nos parfums
              <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative w-full overflow-hidden bg-[#2b211f]">
      <div className="relative h-125 w-full sm:h-140 lg:h-155">
        {slides.map((slide, index) => {
          const isActive = index === current;

          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ${isActive
                ? "z-10 opacity-100"
                : "pointer-events-none z-0 opacity-0"
                }`}
            >
              <Image
                src={slide.image_url}
                alt={slide.title || "Mini Luxe Parfum"}
                fill
                priority={index === 0}
                sizes="100vw"
                className="object-cover"
              />

              {/* Voile élégant */}
              <div className="absolute inset-0 bg-linear-to-r from-[#2b211f]/85 via-[#2b211f]/45 to-[#2b211f]/10" />

              {/* Contenu */}
              <div className="absolute inset-0">
                <div className="mx-auto flex h-full max-w-7xl items-center px-6 sm:px-8 lg:px-10">
                  <div className="max-w-2xl text-white">
                    <div
                      className={`transition-all delay-200 duration-700 ${isActive
                          ? "translate-y-0 opacity-100"
                          : "translate-y-5 opacity-0"
                        }`}
                    >
                      <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] !text-[#ead8c0] sm:text-sm">
                        Mini Luxe Parfum
                      </p>

                      <h1 className="font-[family-name:var(--font-playfair)] text-4xl font-semibold leading-[1.1] !text-[#f3dfc3] sm:text-5xl lg:text-7xl">
                        {slide.title}
                      </h1>

                      {slide.description && (
                        <p className="mt-5 max-w-xl text-sm leading-7 text-white/85 sm:text-base lg:text-lg">
                          {slide.description}
                        </p>
                      )}

                      <Link
                        href="/produits"
                        className="mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#d8b58a] px-7 text-sm font-semibold text-[#2b211f] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#ead8c0] hover:shadow-[0_12px_30px_rgba(216,181,138,0.25)]"
                      >
                        Découvrir la collection
                        <ArrowRight size={17} />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Navigation */}
        {slides.length > 1 && (
          <>
            <button
              type="button"
              onClick={previousSlide}
              aria-label="Slide précédente"
              className="absolute left-4 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/20 text-white backdrop-blur-sm transition hover:bg-white/15 sm:left-6 sm:h-12 sm:w-12"
            >
              <ChevronLeft size={20} />
            </button>

            <button
              type="button"
              onClick={nextSlide}
              aria-label="Slide suivante"
              className="absolute right-4 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/20 text-white backdrop-blur-sm transition hover:bg-white/15 sm:right-6 sm:h-12 sm:w-12"
            >
              <ChevronRight size={20} />
            </button>

            {/* Indicateurs */}
            <div className="absolute bottom-7 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2">
              {slides.map((slide, index) => (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => setCurrent(index)}
                  aria-label={`Afficher le slide ${index + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-300 ${index === current
                    ? "w-9 bg-[#d8b58a]"
                    : "w-2.5 bg-white/50 hover:bg-white/80"
                    }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Slider;