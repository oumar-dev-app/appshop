'use client';
import React, { useEffect, useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import { ArrowLeft, ArrowRight, Heart } from 'lucide-react';
import { FaStar } from 'react-icons/fa';
import Link from 'next/link';
import HeartBtn from '@/_Components/HeartBtn'

type Produits = {
  id: number;
  nom: string;
  description: string;
  stock: number;
  prix: number;
  image_url?: string;
  category_id: number;
  section: string;
  jaime: number;
  isNew: number; 
};

// 🔥 FORMAT FCFA SAFE
const formatFCFA = (value: any) =>
  new Intl.NumberFormat("fr-FR").format(Number(value || 0)) + " FCFA"

/* CARD PRODUIT */
const ProduitCard = React.memo(({ p }: { p: Produits }) => {

  // rating simulé stable
  const rating = (p.id % 5) + 1;

  return (
    <div className="fade-item snap-start rounded bg-white   shadow-sm hover:shadow-lg transition duration-300 min-w-65 overflow-hidden">

      <div
        key={p.id}
        className="rounded overflow-hidden bg-white shadow-sm hover:shadow-md transition"
      >


        {/* IMAGE */}
        <div className="relative w-full h-44 bg-gray-100">

          {p.isNew && (
            <span className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded text-xs">
              Nouveau
            </span>
          )}
          <Image
            src={
              p.image_url?.startsWith("http")
                ? p.image_url
                : p.image_url || "/placeholder.png"
            }
            alt={p.nom}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover hover:scale-105 transition-transform"
          />
        </div>

        {/* CONTENT */}
        <div className="p-3">

          <h3 className="font-semibold text-sm line-clamp-1">
            {p.nom}
          </h3>

          <p className="text-sm text-gray-700 line-clamp-2">
            {p.description}
          </p>

          {/* PRICE + STOCK */}
          <div className="mt-3 flex items-center justify-between">
            <span className="font-bold text-green-700">
              {formatFCFA(p.prix)}
            </span>

            <span className="text-xs text-gray-500">
              Stock: {p.stock}
            </span>
          </div>

          {/* STARS */}
          <div className="flex mt-2 text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <FaStar
                key={i}
                size={14}
                className={i < rating ? "text-yellow-400" : "text-gray-300"}
              />
            ))}
          </div>

        </div>
        <div className='flex justify-between items-center m-3'>
          <HeartBtn
            productId={p.id}
            initialLikes={p.jaime}
          />
          {/* BUTTON */}
          <div className="p-3 pt-0">
            <Link
              href={`/produits/${p.id}`}
              className="flex items-center justify-center gap-2 text-sm font-bold bg-green-600 hover:bg-green-700 transition px-4 py-2 text-white rounded w-full"
            >
              Consulter
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>


      </div>

    </div>
  );
});
ProduitCard.displayName = 'ProduitCard';

const ProduitVedette = () => {

  const [produits, setProduits] = useState<Produits[]>([]);
  const [loading, setLoading] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);

  /* SCROLL */
  const scroll = useCallback((direction: 'left' | 'right') => {

    if (!scrollRef.current) return;

    const scrollAmount = 300;

    scrollRef.current.scrollBy({
      left: direction === 'left'
        ? -scrollAmount
        : scrollAmount,
      behavior: 'smooth',
    });

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
      { threshold: 0.2 }
    );

    const elements = document.querySelectorAll('.fade-item');

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();

  }, [produits]);

  /* FETCH PRODUITS */
  useEffect(() => {

    const fetchProduits = async () => {

      setLoading(true);

      try {

        const token = localStorage.getItem('token');

        const res = await fetch('/api/produits/populaire', {
          method: 'GET',
          headers: token
            ? {
              Authorization: `Bearer ${token}`,
            }
            : {},
        });

        if (!res.ok) {
          throw new Error('Erreur lors du chargement');
        }

        const data = await res.json();

        setProduits(
          Array.isArray(data.data)
            ? data.data
            : []
        );

      } catch (error) {

        console.error(error);
        setProduits([]);

      } finally {

        setLoading(false);

      }

    };

    fetchProduits();

  }, []);
  return (

    <section className="fade-item  py-10 mt-10">

      <div className="w-full max-w-7xl mx-auto px-4">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-10">

          {/* TEXTE */}
          <div className="fade-item text-blacK">

            <h1 className="text-3xl text-black font-bold">
              Produits en vedette
            </h1>

            <p className="text-sm mt-2 max-w-2xl text-black">
              Voici les produits les plus populaires du moment,
              disponibles dès maintenant avec une réduction.
            </p>

          </div>

          {/* NAV BUTTONS */}
          <div className="fade-item  items-centergap-5 hidden sm:block">

            <button
              aria-label="Produits précédents"
              onClick={() => scroll('left')}
              className="rounded-full bg-green-500 p-3 shadow hover:bg-green-600 mr-5 transition text-white"
            >
              <ArrowLeft size={20} />
            </button>

            <button
              aria-label="Produits suivants"
              onClick={() => scroll('right')}
              className="rounded-full bg-green-500 p-3 shadow hover:bg-green-600 transition text-white"
            >
              <ArrowRight size={20} />
            </button>

          </div>

        </div>

        {/* PRODUITS */}
        {loading ? (

          <div className="text-center text-black py-10 animate-pulse">
            Chargement des produits...
          </div>

        ) : produits.length === 0 ? (

          <div className="text-center text-black py-10">
            Aucun produit disponible
          </div>

        ) : (

          <div
            ref={scrollRef}
            className="flex gap-5 overflow-x-auto scroll-smooth scrollbar-hide snap-x snap-mandatory pb-2"
          >

            {produits.map((p) => (
              <ProduitCard
                key={p.id}
                p={p}
              />
            ))}

          </div>

        )}

      </div>

    </section>

  );
};

export default ProduitVedette;
