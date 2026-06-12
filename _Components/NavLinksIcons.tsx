'use client';

import { Search, User, ShoppingBag, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import Rechercher from './Rechercher';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import FormulaireRegister from './FormulaireRegister';
import Link from 'next/link';

const NavLinksIcons = () => {

    const [modal, setModal] =
        useState<"search" | "login" | "register" | null>(null);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [cartCount, setCartCount] = useState(0);

    const router = useRouter();

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
            const cart = JSON.parse(localStorage.getItem("cart") || "[]");

            const total = cart.reduce(
                (sum: number, item: any) => sum + item.quantity,
                0
            );

            setCartCount(total);
        };

        updateCart(); // initial load

        window.addEventListener("cartUpdated", updateCart);

        return () => {
            window.removeEventListener("cartUpdated", updateCart);
        };
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {

        e.preventDefault();

        setIsLoading(true);

        const loading = toast.loading("Chargement...");

        try {
            const res = await fetch("/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email,
                    password
                })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message);
            }

            // Sauvegarde du token
            localStorage.setItem("token", data.token);
            localStorage.setItem(
                "user",
                JSON.stringify(data.user)
            );

            toast.dismiss(loading);

            toast.success(data.message || "Connexion réussie");

            // Fermer la modal
            setModal(null);

            // Attendre avant redirection
            if (data.user.role === "admin") {
                router.push("/dashboard");
            } else {
                router.push("/");
            }

            // Vide les champs après la soumition
            setEmail("");
            setPassword("");

        } catch (error: any) {

            console.error(error);

            toast.dismiss(loading);

            toast.error(
                error.message || "Erreur de connexion"
            );

        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* NAV */}
            <div className="flex items-center gap-5">

                <button
                    onClick={() => setModal("search")}
                    className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-black hover:text-white transition"
                >
                    <Search size={18} />
                </button>

                <div className="flex items-center gap-4">
                    <Link href={"/panier"} className="relative">
                        <ShoppingBag className="w-9 h-9 p-2 rounded-full hover:bg-black transition hover:text-white" />

                        {cartCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                                {cartCount}
                            </span>
                        )}
                    </Link>


                    <button onClick={() => setModal("login")}>
                        <User className="w-9 h-9 p-2 rounded-full hover:bg-black transition hover:text-white" />
                    </button>

                </div>
            </div>

            {/* BACKDROP */}
            {modal && (
                <div
                    onClick={() => setModal(null)}
                    className=" fixed inset-0 z-50 flex items-center justify-center"
                >
                    <div className='absolute inset-0 bg-black/60 backdrop-blur-md' onClick={() => setModal(null)} />

                    {/* SEARCH */}
                    {modal === "search" && (
                        <div
                            onClick={(e) => e.stopPropagation()}
                            className="relative bg-white p-6 rounded-lg shadow-lg w-full max-w-md m-3"
                        >

                            <div className="flex justify-between items-center">

                                <h2 className="text-lg font-semibold">
                                    Recherche
                                </h2>

                                <button onClick={() => setModal(null)}>
                                    <X />
                                </button>

                            </div>

                            <Rechercher onClose={() => setModal(null)} />

                        </div>
                    )}

                    {/* LOGIN */}
                    {modal === "login" && (
                        <div
                            onClick={(e) => e.stopPropagation()}
                            className="relative bg-white w-full max-w-md rounded-xl p-5 space-y-4 m-3"
                        >

                            <div className="flex justify-between items-center">

                                <h2 className="text-lg font-semibold">
                                    Connexion
                                </h2>

                                <button onClick={() => setModal(null)}>
                                    <X />
                                </button>

                            </div>

                            <form
                                onSubmit={handleSubmit}
                                className="flex flex-col gap-3"
                            >

                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="border p-2 rounded-lg"
                                    placeholder="Email"
                                />

                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="border p-2 rounded-lg"
                                    placeholder="Mot de passe"
                                />

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="bg-black text-white p-2 rounded-lg disabled:opacity-50 hover:bg-black/90"
                                >
                                    {isLoading ? "Connexion..." : "Connexion"}
                                </button>

                                <p className="text-sm text-center">

                                    Pas de compter ?

                                    <button
                                        type="button"
                                        onClick={() => setModal("register")}
                                        className="underline ml-1"
                                    >
                                        Créer un compter
                                    </button>

                                </p>

                            </form>
                        </div>
                    )}

                    {/* REGISTER */}
                    {modal === "register" && (
                        <div
                            onClick={(e) => e.stopPropagation()}
                            className="relative bg-white w-full max-w-md rounded-xl p-5 space-y-4 m-3"
                        >

                            <div className="flex justify-between items-center">

                                <h2 className="text-lg font-semibold">
                                    Inscription
                                </h2>

                                <button onClick={() => setModal(null)}>
                                    <X />
                                </button>

                            </div>
                            <FormulaireRegister
                                onSuccess={() => setModal(null)}
                                onLogin={() => setModal("login")}
                            />

                        </div>
                    )}
                </div>
            )}
        </>
    );
};

export default NavLinksIcons;