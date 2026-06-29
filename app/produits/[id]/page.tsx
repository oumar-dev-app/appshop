"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { addToCart } from "../../../lib/cart";
import { toast } from "sonner";
import { motion } from "framer-motion";

type Produits = {
    id: number;
    nom: string;
    description: string;
    stock: number;
    prix: number;
    image_url?: string;
    jaime: number;
};

// 🔥 FORMAT FCFA SAFE
const formatFCFA = (value: any) =>
    new Intl.NumberFormat("fr-FR").format(Number(value || 0)) + " FCFA"

export default function ConsulterProduit() {

    const params = useParams();
    const id = Array.isArray(params.id) ? params.id[0] : params.id;

    const route = useRouter();

    const [product, setProduct] = useState<Produits | null>(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [likes, setLikes] = useState(0);
    const [relatedProducts, setRelatedProducts] = useState<Produits[]>([]);

    const handleAddToCart = () => {

        if (!product) return;

        const loadingToast = toast.loading("Ajout au panier...");

        try {
            addToCart({
                id: product.id,
                nom: product.nom,
                prix: product.prix,
                image_url: product.image_url,
                quantity,
            });

            toast.dismiss(loadingToast);
            toast.success("Produit ajouté au panier");

        } catch {
            toast.dismiss(loadingToast);
            toast.error("Erreur lors de l'ajout");
        }
    };

    useEffect(() => {

        const fetchProduct = async () => {

            try {

                setLoading(true);

                const token = localStorage.getItem("token");

                const res = await fetch(`/api/produits/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await res.json();
                const prod = data.data || data.product || data;

                setProduct(prod);
                setLikes(prod.jaime);

                if (prod?.category_id) {

                    const res2 = await fetch(
                        `/api/category/${prod.category_id}/produits`,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );

                    const data2 = await res2.json();

                    const products = data2.data || [];

                    const filtered = products
                        .filter((p: Produits) => p.id !== prod.id)
                        .slice(0, 4);

                    setRelatedProducts(filtered);
                }

            } catch (error) {
                console.error(error);
                setProduct(null);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchProduct();

    }, [id]);

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
            { threshold: 0.3 }
        );

        const elements = document.querySelectorAll('.fade-item');

        elements.forEach((el) => observer.observe(el));

        return () => observer.disconnect();

    }, [product]);

    if (loading)
        return (
            <p className="text-center flex justify-center items-center h-screen animate-pulse">
                Chargement...
            </p>
        );

    if (!product)
        return (
            <p className="text-center text-red-500 flex justify-center italic h-screen">
                Produit introuvable
            </p>
        );

    return (
        <div className="flex flex-col space-y-5 mt-5">


            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >

                {/* HEADER STYLE CATÉGORIE */}
                {/* HEADER */}
                <div className="w-full max-w-7xl mx-auto px-5  mb-6 space-y-4">

                    {/* BOUTON RETOUR */}
                    <div className=" flex gap-4 items-center">
                        <div>
                            <button
                                onClick={() => route.back()}
                                className="flex items-center gap-2 text-white bg-green-600 px-4 py-2 rounded"
                            >
                                <ArrowLeft size={18} />

                            </button>
                        </div>

                        <div>

                            {/* TITRE */}
                            <h1 className="text-2xl font-bold text-black">
                                Détails du produit
                            </h1>
                        </div>

                    </div>


                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >

                {/* CONTENT */}
                <div className="max-w-7xl mx-auto p-5 grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* IMAGE */}
                    <div className="flex justify-center">
                        <Image
                            src={product.image_url || "/placeholder.png"}
                            alt={product.nom}
                            width={400}
                            height={400}
                            className="rounded border"
                        />
                    </div>

                    {/* INFOS */}
                    <div className="p-5 space-y-5">

                        <h2 className="text-2xl font-bold">
                            {product.nom}
                        </h2>

                        <p className="text-gray-600">
                            {product.description}
                        </p>

                        <p className="text-green-600 font-bold">
                            Prix : {formatFCFA(product.prix)}
                        </p>

                        <p>
                            Stock : {product.stock}
                        </p>

                        {/* LIKES */}
                        <div className="flex items-center gap-2">
                            <span>❤️</span>
                            <p className="text-sm text-gray-600">
                                {likes} j'aime
                            </p>
                        </div>

                        {/* QUANTITÉ */}
                        <div className="flex items-center gap-3">

                            <button
                                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                className="px-3 py-1 border rounded"
                            >
                                -
                            </button>

                            <span>{quantity}</span>

                            <button
                                onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                                className="px-3 py-1 border rounded"
                            >
                                +
                            </button>

                        </div>

                        {/* PANIER */}
                        <button
                            onClick={handleAddToCart}
                            className="bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded w-full transition"
                        >
                            Ajouter au panier ({quantity})
                        </button>

                    </div>
                </div>

            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                {/* PRODUITS SIMILAIRES */}
                <div className="max-w-7xl mx-auto px-5 mt-10 space-y-6">

                    <h2 className="text-xl font-bold">
                        Produits similaires
                    </h2>

                    {relatedProducts?.length === 0 ? (
                        <p className="text-gray-500">
                            Aucun produit similaire
                        </p>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-6 gap-5">

                            {relatedProducts.map((p) => (

                                <div
                                    key={p.id}
                                    className="rounded overflow-hidden bg-white shadow-lg hover:shadow-2xl transition duration-300 hover:-translate-y-1"
                                >
                                    <Link
                                        href={`/produits/${p.id}`}
                                    >
                                        {/* IMAGE */}
                                        <div className="relative w-full h-32 overflow-hidden">

                                            <Image
                                                src={p.image_url || "/placeholder.png"}
                                                alt={p.nom}
                                                fill
                                                className="object-cover hover:scale-110 transition duration-500"
                                            />

                                        </div>

                                        {/* FOOTER */}
                                        <div className="p-2 flex justify-between items-center">

                                            <h3 className="font-bold text-sm truncate">
                                                {p.nom}
                                            </h3>

                                            <div className="bg-green-600 text-white p-2 rounded-full hover:bg-green-700 transition"
                                            >
                                                <ArrowUpRight size={16} />
                                            </div>
                                        </div>
                                    </Link>
                                </div>

                            ))}

                        </div>
                    )}
                </div>
            </motion.div>

        </div>
    );
}