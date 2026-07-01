"use client";

import { useEffect, useState } from "react";
import BoutiqueReglage from "../../../_Components/BoutiqueReglage";
import ChangerPassword from "../../../_Components/ChangerPassword";
import ModifierProfil from "../../../_Components/ModifierProfil";
import { useRouter } from "next/navigation";

type User = {
    id: number;
    nom: string;
    prenom: string;
    email: string;
    telephone: string;
    role: string;
    image_url?: string;
};

export default function PersonnalisationPage() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    // Animation
    useEffect(() => {
        const elements = document.querySelectorAll(".fade-item");

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("show");
                    }
                });
            },
            {
                threshold: 0.2,
            }
        );

        elements.forEach((el) => observer.observe(el));

        return () => observer.disconnect();
    }, []);

    // Utilisateur connecté

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem("token");

                const res = await fetch("/api/me", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const data = await res.json();
                setUser(data.user);

            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [router]);

    const getUserName = () => {
        if (!user) return "Admin";

        return `${user?.prenom || ""} ${user?.nom || ""}`.trim() || "Utilisateur";
    };


    return (
        <div className="fade-item mx-4 sm:mx-6 lg:mx-8 mt-5">
            <div className="text-black">

                <h1 className="max-w-7xl mx-auto text-lg sm:text-2xl font-semibold mb-6">
                    ⚙️ Réglages
                </h1>

                <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-lg p-6">

                    <h2 className="text-lg font-semibold mb-5">
                        👤 Profil utilisateur
                    </h2>

                    {loading ? (
                        <p className="animate-pulse">Chargement...</p>
                    ) : !user ? (
                        <p className="text-red-500">
                            Aucun utilisateur connecté.
                        </p>
                    ) : (
                        <>
                            <div className="grid md:grid-cols-2 gap-5">

                                <div className="flex flex-col gap-2">
                                    <p className="text-gray-500 text-sm">
                                        Nom et prénom:
                                    </p>

                                    <p className="font-semibold">
                                        {user.nom} {user.prenom}
                                    </p>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <p className="text-gray-500 text-sm">
                                        Email:
                                    </p>

                                    <p>{user.email}</p>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <p className="text-gray-500 text-sm">
                                        Téléphone:
                                    </p>

                                    <p>{user.telephone}</p>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <p className="text-gray-500 text-sm">
                                        Rôle:
                                    </p>

                                    <p className="font-semibold text-green-600">
                                        {user.role}
                                    </p>
                                </div>

                            </div>

                            <div className="mt-6 flex gap-3">
                                <ModifierProfil
                                    user={user}
                                    onUpdated={(updatedUser) => setUser(updatedUser)}
                                />

                                <ChangerPassword />
                            </div>
                        </>
                    )}
                </div>

                <BoutiqueReglage />

            </div>
        </div>
    );
}