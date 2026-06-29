'use client'
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

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
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        setCategories(data.data || []);

      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();

  }, []);

  return (

    <div className="w-full max-w-7xl mx-auto mt-10 space-y-6 px-4">

      {/* HEADER */}
      <div className="flex justify-between items-center">

        <h1 className="text-2xl font-bold">
          Explorer par catégorie
        </h1>

        <Link
          href="/produits"
          className="flex items-center gap-2 text-sm font-medium hover:underline"
        >
          Voir tout <ArrowRight size={18} />
        </Link>

      </div>

      {/* LOADING */}
      {loading && (
        <p className="text-gray-500 animate-pulse">Chargement...</p>
      )}

      {/* EMPTY */}
      {!loading && categories.length === 0 && (
        <p className="text-gray-500">Aucune catégorie trouvée</p>
      )}

      {/* HORIZONTAL SCROLL */}

      <div className="flex gap-5 overflow-x-auto pb-4 scroll-smooth snap-x snap-mandatory scrollbar-hide">

        {categories.map((item) => (

          <div
            key={item.id}
            className="min-w-41.5 snap-start rounded overflow-hidden bg-white shadow-lg hover:shadow-2xl transition duration-300 hover:-translate-y-1"
          >
            <Link
              href={`/categories/${item.id}`}
              
            >
              {/* IMAGE */}
              <div className="relative w-full h-28 overflow-hidden">


                <Image
                  src={item.image_url || "/placeholder.png"}
                  alt={item.nom}
                  fill
                  className="object-cover hover:scale-105 transition duration-500"
                />

              </div>

              {/* FOOTER */}
              <div className="p-2 flex justify-between items-center gap-2">

                <h2 className="font-bold text-sm">
                  {item.nom}
                </h2>
                <div className="bg-green-600 text-white p-2 rounded-full hover:bg-green-700 transition">
                  <ArrowUpRight size={16} />
                </div>
              </div>
            </Link>

          </div>

        ))}

      </div>

    </div>
  );
};

export default Nouveau;