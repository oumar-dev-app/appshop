'use client';

import { useEffect, useState } from "react";

type Apropos = {
    id: number;
    nom: string;
    apropos: string;
};

export default function PageApropos() {
    const [apropos, setApropos] = useState<Apropos | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchApropos = async () => {
            try {
                const token = localStorage.getItem("token");

                const res = await fetch("/api/boutiqueConfig", {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await res.json();

                setApropos(data.data || null);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchApropos();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4 animate-pulse">
                <p className="text-gray-500 text-lg">
                    Chargement...
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-8 sm:py-10">

            <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">

                <div className="p-5 sm:p-6 md:p-10">

                    {/* TITRE */}
                    <div className="text-center mb-8">
                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 wrap-break-word">
                            {apropos?.nom || "À propos"}
                        </h1>

                        <div className="w-24 h-1 bg-green-600 mx-auto mt-4 rounded-full" />
                    </div>

                    {/* CONTENU */}
                    <div className="w-full overflow-hidden">

                        <p className="text-gray-700 text-base md:text-lg leading-8 whitespace-pre-wrap wrap-break-word text-justify">
                            {apropos?.apropos || "Aucune information disponible."}
                        </p>

                    </div>

                </div>

            </div>

        </div>
    );
}