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
        const fetchUser = async () => {
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

        fetchUser();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p>Chargement...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4">
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-6 md:p-10">

                <div className="text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                        {apropos?.nom}
                    </h1>

                    <div className="w-24 h-1 bg-green-600 mx-auto mt-4 rounded-full" />
                </div>

                <div className="prose max-w-none">
                    <p className="text-gray-700 text-base md:text-lg leading-8 whitespace-pre-line text-justify">
                        {apropos?.apropos}
                    </p>
                </div>

            </div>
        </div>
    );
}