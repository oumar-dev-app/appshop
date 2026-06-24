"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";

type Produits = {
  id: number;
  nom: string;
  description: string;
  stock: number;
  prix: number;
  image_url?: string;
};

export default function Consulter() {
  const { id } = useParams();
  const [product, setProduct] = useState<Produits | null>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/produits/${id}`);
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        console.error(err);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  if (!product) {
    return <p className="text-white text-center">Chargement...</p>;
  }

  return (
    <div className="max-w-7xl mx-auto mt-6 px-4">

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* IMAGE */}
        <div className="border p-5 flex justify-center">
          <Image
            src={product.image_url || "/placeholder.png"}
            alt={product.nom}
            width={400}
            height={400}
            className="rounded"
          />
        </div>

        {/* INFOS */}
        <div className="border p-5 space-y-5">

          <h1 className="text-2xl font-bold">
            {product.nom}
          </h1>

          <p className="text-gray-600">
            {product.description}
          </p>

          <p className="text-green-600 font-bold">
            Prix : {product.prix} FCFA
          </p>

          <p>
            Stock : {product.stock}
          </p>

          {/* QUANTITÉ */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setQuantity(q => Math.max(1, q - 1))}
              className="px-3 py-1 border"
            >
              -
            </button>

            <span>{quantity}</span>

            <button
              onClick={() => setQuantity(q => q + 1)}
              className="px-3 py-1 border"
            >
              +
            </button>
          </div>

          {/* PANIER */}
          <button className="bg-green-600 text-white px-4 py-2 rounded w-full">
            Ajouter au panier
          </button>

        </div>
      </div>
    </div>
  );
}