'use client'
import { useEffect, useState } from "react"

type Apropos = {
    id: number;
    nom: string;
    apropos: string;
}

export default function PageApropos() {

    const [apropos, setApropos] = useState<Apropos | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem("token");

                const res = await fetch("/api/boutiqueConfig", {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await res.json();
                setApropos(data.data || []);
            } catch (error) {
                console.error(error);
            }
        }
        fetchUser();
    }, []);

    return (
        <div className="flex justify-center items-center h-screen">
            <div className="flex flex-col gap-5">
                <h1 className="font-bold text-2xl">{apropos?.nom}</h1>
                <p>{apropos?.apropos}</p>
            </div>

        </div>
    )
}