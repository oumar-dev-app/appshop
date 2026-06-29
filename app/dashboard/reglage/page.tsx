'use client'
import BoutiqueReglage from "../../../_Components/BoutiqueReglage";
import ChangerPassword from "../../../_Components/ChangerPassword";
import ModifierProfil from "../../../_Components/ModifierProfil";
import { useEffect, useState } from "react";

type User = {
    id: number;
    nom: string;
    prenom: string;
    email: string;
    telephone: string;
    role: string
}

export default function PersonnalisationPage() {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const elements = document.querySelectorAll(".fade-item");

        const observer = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("show");
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.2,
            }
        );

        elements.forEach((el) => observer.observe(el));

        return () => {
            elements.forEach((el) => observer.unobserve(el));
        };
    }, []);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem("token");

                if (!token) {
                    setUser(null);
                    return;
                }

                const res = await fetch("/api/me", {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await res.json();

                if (!res.ok || !data.user) {
                    setUser(null);
                    return;
                }

                setUser(data.user);

            } catch (error) {
                console.error(error);
                setUser(null);
            }
        };

        fetchUser();
    }, []);
    return (
        <div className='fade-item mx-4 sm:mx-6 lg:mx-8 mt-5'>
            <div className='text-black'>

                <h1 className='max-w-7xl m-auto text-lg sm:text-2xl font-semibold mb-6 '>
                    ⚙️ Réglages
                </h1>

                {/* ================= PROFILE ================= */}
                <div className="max-w-7xl m-auto border border-white bg-white rounded-lg shadow-lg mt-4 mb-2 py-6 px-4 sm:px-6">
                    <h2 className="text-md font-semibold mb-3">👤 Profil utilisateur</h2>

                    {user ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4  p-4 rounded-lg">
                            <div className="flex flex-col space-y-3">
                                <p className="text-sm text-gray-500">Nom et Prénom:</p>
                                <p>{user.nom} {user.prenom}</p>
                            </div>

                            <div className="flex flex-col space-y-3">
                                <p className="text-sm text-gray-500">Email:</p>
                                <p>{user.email}</p>
                            </div>

                            <div className="flex flex-col space-y-3">
                                <p className="text-sm text-gray-500">Téléphone:</p>
                                <p>{user.telephone}</p>
                            </div>

                            <div className="flex gap-2 items-center">
                                {/* ================= Modifier profil ================= */}
                                <ModifierProfil
                                    user={user}
                                    onUpdated={(u) => setUser(u)}
                                />
                                <ChangerPassword />
                            </div>
                        </div>
                    ) : (
                        <p className="text-gray-500 animate-pulse">Chargement...</p>
                    )}
                </div>

                {/* ================= BOUTIQUE ================= */}
                <BoutiqueReglage />
            </div>
        </div>
    )
}