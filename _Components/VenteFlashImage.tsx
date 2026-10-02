import { ArrowUpRight } from "lucide-react";
import React, { useEffect, useState } from "react";
import Image from "next/image";

type TypeProduits = {
  id: number;
  nom: string;
  description: string;
  stock: number;
  prix: number;
  image_url: string;
  category_id: number;
};

const VenteFlashImage = () => {
  const [produits, setProduits] = useState<TypeProduits[]>([]);

  useEffect(() => {
    const fetchProduits = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch("/api/produits", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        setProduits(data.data || []);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProduits();
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 mt-6 gap-5">
      {produits.map((item) => (
        <div
          key={item.id}
          className="h-80 rounded-lg bg-white shadow-xl flex flex-col justify-between hover:scale-[1.02] transition"
        >
          {/* Image */}
          <div className="relative w-full h-52 rounded-lg overflow-hidden">
            {item.image_url ? (
              <Image
                src={item.image_url}
                alt={item.nom}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500">Pas d’image</span>
              </div>
            )}
          </div>
          {/* Infos produit */}
          <div className="mt-4 m-3">
            <h2 className="font-semibold text-lg">{item.nom}</h2>

            <p className="text-sm text-gray-500 line-clamp-2">
              {item.description}
            </p>

            <div className="flex justify-between items-center mt-3">
              <span className="font-bold text-black">
                {item.prix} FCFA
              </span>
              <ArrowUpRight className="cursor-pointer hover:text-black transition" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default VenteFlashImage;