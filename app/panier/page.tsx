"use client";

import { useEffect, useMemo, useReducer, useState } from "react";
import Image from "next/image";

import {
    CartItem,
    getCart,
    removeFromCart,
} from "../../lib/cart";

import { ArrowLeft, ArrowUpLeft, Trash, X } from "lucide-react";
import { FaBoxOpen, FaTruck } from "react-icons/fa";
import FormulaireLivre from "../../_Components/FormulaireLivre";
import { useRouter } from "next/navigation";

// 🔥 FORMAT FCFA SAFE
const formatFCFA = (value: any) =>
    new Intl.NumberFormat("fr-FR").format(Number(value || 0)) + " FCFA";

export default function PanierPage() {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [modal, setModal] = useState<"commander" | "livre" | null>(null);
    const route = useRouter();

    useEffect(() => {
        if (modal) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
        return () => {
            document.body.style.overflow = "auto";
        }
    }, [modal]);

    useEffect(() => {
        const updateCart = () => {
            setCart(getCart());
        };

        // Chargement initial
        updateCart();

        // Écoute les changements du panier
        window.addEventListener("cartUpdated", updateCart);

        return () => {
            window.removeEventListener("cartUpdated", updateCart);
        };
    }, []);

    const handleRemove = (id: number) => {
        removeFromCart(id);
        setCart((prev) => prev.filter((item) => item.id !== id));
    };

    const total = useMemo(() => {
        return cart.reduce((acc, item) => acc + item.prix * item.quantity, 0);
    }, [cart]);

    return (
        <div className="max-w-7xl mx-auto p-3 sm:p-5">
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
                    <h1 className="text-2xl sm:text-3xl font-bold">
                        Mon panier
                    </h1>
                </div>

            </div>


            {cart.length === 0 ? (
                <p className="text-center text-gray-500">
                    Votre panier est vide
                </p>
            ) : (
                <div className="space-y-4">
                    {cart.map((item) => (
                        <div
                            key={item.id}
                            className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 border-b p-3 rounded"
                        >
                            <Image
                                src={item.image_url || "/placeholder.png"}
                                alt={item.nom}
                                width={80}
                                height={80}
                                className="rounded w-20 h-20 object-cover"
                            />

                            <div className="flex-1">
                                <h2 className="font-bold text-sm sm:text-base">
                                    {item.nom}
                                </h2>

                                <p className="text-sm text-gray-600">
                                    {formatFCFA(item.prix)}
                                </p>

                                <p className="text-sm">
                                    Quantité : {item.quantity}
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => handleRemove(item.id)}
                                className="self-end sm:self-auto text-red-500 hover:text-red-700 transition"
                            >
                                <Trash size={18} />
                            </button>
                        </div>
                    ))}

                    <div className="text-center sm:text-right mt-6">
                        <h2 className="text-xl sm:text-2xl font-bold">
                            Total : {formatFCFA(total)}
                        </h2>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-4">
                            <button
                                onClick={() => setModal("commander")}
                                className="w-full sm:w-auto bg-green-600 hover:bg-green-700 px-4 py-2 flex items-center justify-center gap-2 rounded text-white transition"
                            >
                                <FaBoxOpen size={18} />
                                Commander
                            </button>

                            <span className="text-sm font-bold text-gray-500">ou</span>

                            <button
                                onClick={() => setModal("livre")}
                                className="w-full sm:w-auto bg-green-600 hover:bg-green-700 px-4 py-2 flex items-center justify-center gap-2 rounded text-white transition"
                            >
                                <FaTruck size={18} />
                                Livraison à domicile
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL */}
            {modal && (
                <div
                    className=" fixed inset-0 z-50 flex items-center justify-center"
                    onClick={() => setModal(null)}
                >
                    <div className='absolute inset-0 bg-black/60 backdrop-blur-md' onClick={() => setModal(null)} />
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="relative bg-white p-6 rounded-lg shadow-lg w-full max-w-md m-3"
                    >
                        <div className="flex justify-between items-center mb-4">

                            <h2 className="text-lg font-semibold">
                                {modal === "commander"
                                    ? "Commander"
                                    : "Livraison"}
                            </h2>

                            <button onClick={() => setModal(null)}>
                                <X size={20} />
                            </button>

                        </div>

                        <FormulaireLivre
                            type={modal}
                            cart={cart}
                            total={total}
                        />

                    </div>
                </div>
            )}
        </div>
    );
}