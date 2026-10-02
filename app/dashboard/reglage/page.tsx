"use client";

import BoutiqueReglage from "@/_Components/BoutiqueReglage";
import ChangerPassword from "@/_Components/ChangerPassword";
import ModifierProfil from "@/_Components/ModifierProfil";
import {
    KeyRound,
    Mail,
    Phone,
    Settings,
    ShieldCheck,
    UserRound,
} from "lucide-react";
import { useEffect, useState } from "react";

type User = {
    id: number;
    nom: string;
    prenom: string;
    email: string;
    telephone: string;
};

export default function PersonnalisationPage() {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem("token");

                const res = await fetch("/api/users", {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await res.json();
                setUser(data.data?.[0] || null);
            } catch (error) {
                console.error(error);
            }
        };

        fetchUser();
    }, []);

    return (
        <div className="mx-4 sm:mx-6 lg:mx-8">
            <div className="mx-auto max-w-7xl py-4 sm:py-6">
                {/* ================= HEADER ================= */}
                <div className="mb-6">
                    <div className="flex items-center gap-3">
                        <div
                            className="
                                flex h-11 w-11 items-center justify-center
                                rounded-2xl
                                bg-[#f2e5e1]
                                text-[#a66a4c]
                            "
                        >
                            <Settings size={22} />
                        </div>

                        <div>
                            <h1 className="text-2xl font-semibold text-[#2b211f] sm:text-3xl">
                                Réglages
                            </h1>

                            <p className="mt-1 text-sm text-[#6f625d]">
                                Gérez votre profil et les paramètres de votre boutique.
                            </p>
                        </div>
                    </div>
                </div>

                {/* ================= PROFILE ================= */}
                <section className="mb-6 overflow-hidden rounded-2xl border border-[#eadfd8] bg-white shadow-[0_8px_30px_rgba(75,49,39,0.06)]">
                    {/* Header */}
                    <div className="border-b border-[#eadfd8] bg-[#fdfaf7] px-5 py-5 sm:px-6">
                        <div className="flex items-center gap-3">
                            <div
                                className="
                                    flex h-10 w-10 items-center justify-center
                                    rounded-xl
                                    bg-[#ead8c0]
                                    text-[#7d4d38]
                                "
                            >
                                <UserRound size={20} />
                            </div>

                            <div>
                                <h2 className="text-lg font-semibold text-[#2b211f]">
                                    Profil utilisateur
                                </h2>

                                <p className="text-sm text-[#6f625d]">
                                    Consultez et modifiez vos informations personnelles.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 sm:p-6">
                        {user ? (
                            <div className="space-y-6">
                                {/* Informations */}
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                    {/* Nom */}
                                    <div
                                        className="
                                            rounded-xl
                                            border border-[#eadfd8]
                                            bg-[#fdfaf7]
                                            p-4
                                        "
                                    >
                                        <div className="mb-3 flex items-center gap-2">
                                            <UserRound
                                                size={17}
                                                className="text-[#a66a4c]"
                                            />

                                            <p className="text-xs font-medium uppercase tracking-wide text-[#8b7d77]">
                                                Nom et prénom
                                            </p>
                                        </div>

                                        <p className="font-medium text-[#2b211f]">
                                            {user.nom} {user.prenom}
                                        </p>
                                    </div>

                                    {/* Email */}
                                    <div
                                        className="
                                            rounded-xl
                                            border border-[#eadfd8]
                                            bg-[#fdfaf7]
                                            p-4
                                        "
                                    >
                                        <div className="mb-3 flex items-center gap-2">
                                            <Mail
                                                size={17}
                                                className="text-[#a66a4c]"
                                            />

                                            <p className="text-xs font-medium uppercase tracking-wide text-[#8b7d77]">
                                                Email
                                            </p>
                                        </div>

                                        <p className="break-all font-medium text-[#2b211f]">
                                            {user.email}
                                        </p>
                                    </div>

                                    {/* Téléphone */}
                                    <div
                                        className="
                                            rounded-xl
                                            border border-[#eadfd8]
                                            bg-[#fdfaf7]
                                            p-4
                                        "
                                    >
                                        <div className="mb-3 flex items-center gap-2">
                                            <Phone
                                                size={17}
                                                className="text-[#a66a4c]"
                                            />

                                            <p className="text-xs font-medium uppercase tracking-wide text-[#8b7d77]">
                                                Téléphone
                                            </p>
                                        </div>

                                        <p className="font-medium text-[#2b211f]">
                                            {user.telephone || "Non renseigné"}
                                        </p>
                                    </div>
                                </div>

                                {/* Security / actions */}
                                <div className="flex flex-col gap-3 border-t border-[#eadfd8] pt-5 sm:flex-row sm:items-center">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="
                                                flex h-10 w-10 shrink-0 items-center justify-center
                                                rounded-xl
                                                bg-[#f2e5e1]
                                                text-[#a66a4c]
                                            "
                                        >
                                            <ShieldCheck size={19} />
                                        </div>

                                        <div>
                                            <p className="text-sm font-semibold text-[#2b211f]">
                                                Sécurité du compte
                                            </p>

                                            <p className="text-xs text-[#6f625d]">
                                                Gérez vos informations et votre mot de passe.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-2 sm:ml-auto">
                                        <ModifierProfil
                                            user={user}
                                            onUpdated={(u) => setUser(u)}
                                        />

                                        <ChangerPassword />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3 py-6 text-sm text-[#6f625d]">
                                <div
                                    className="
                                        h-5 w-5 animate-spin rounded-full
                                        border-2 border-[#ead8c0]
                                        border-t-[#a66a4c]
                                    "
                                />

                                Chargement du profil...
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
}

