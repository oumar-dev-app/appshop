"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpLeft } from "lucide-react";
import { FaStar } from "react-icons/fa";
import HeartBtn from "@/_Components/HeartBtn";

type Produit = {
    id: number;
    nom: string;
    description: string;
    prix: number;
    stock: number;
    image_url?: string;
    jaime: number;
};

export default function CategoryProductsPage() {


    const [products, setProducts] = useState<Produit[]>([]);
    const [loading, setLoading] = useState(true);


    const route = useRouter();

    useEffect(() => {

        const fetchProducts = async () => {

            try {

                setLoading(true);

                const token = localStorage.getItem("token");

                const res = await fetch(
                    `/api/produits`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const data = await res.json();

                setProducts(data.data || data || []);

            } catch (error) {

                console.error(error);

            } finally {

                setLoading(false);

            }
        };
        fetchProducts();

    }, []);

    if (loading) {
        return (
            <p className="text-center mt-10">
                Chargement...
            </p>
        );
    }
    // rating simulé stable

    return (

        <div className="max-w-7xl mx-auto p-5">

            <div className="flex flex-col gap-5 mb-6">

                {/* RETOUR */}
                <button
                    onClick={() => route.back()}
                    className="flex items-center gap-2 text-white bg-green-600 hover:bg-green-700 w-fit px-4 py-2 rounded transition"
                >
                    <ArrowUpLeft size={18} />
                    Retour
                </button>

                {/* TITRE */}
                <h1 className="text-2xl font-bold text-black">
                    Nos Articles
                </h1>

            </div>

            {products.length === 0 ? (

                <p>Aucun produit trouvé</p>

            ) : (

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">

                    {products.map((p) => {

                        // rating simulé par produit (stable)
                        const rating = (p.id % 5) + 1;

                        return (
                            <div
                                key={p.id}
                                className="bg-white rounded shadow hover:shadow-xl transition overflow-hidden"
                            >

                                {/* IMAGE */}
                                <div className="relative w-full h-52">
                                    <Image
                                        src={p.image_url || '/placeholder.png'}
                                        alt={p.nom}
                                        fill
                                        className="object-cover transition-transform duration-300 hover:scale-105"
                                        sizes="(max-width: 768px) 100vw, 33vw"
                                    />
                                </div>

                                {/* CONTENT */}
                                <div className="p-4 space-y-2">

                                    <h2 className="font-bold text-lg">
                                        {p.nom}
                                    </h2>

                                    <p className="text-sm text-gray-500 line-clamp-3">
                                        {p.description}
                                    </p>

                                    {/* STARS */}
                                    <div className="flex mt-2">
                                        {[...Array(5)].map((_, i) => (
                                            <FaStar
                                                key={i}
                                                size={14}
                                                className={
                                                    i < rating
                                                        ? "text-yellow-400"
                                                        : "text-gray-300"
                                                }
                                            />
                                        ))}
                                    </div>

                                    <p className="font-bold text-green-700 text-lg">
                                        {p.prix} FCFA
                                    </p>

                                    <p className="text-sm">
                                        Stock : {p.stock}
                                    </p>

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
                    })}
                </div>

            )}

        </div>
    );
}