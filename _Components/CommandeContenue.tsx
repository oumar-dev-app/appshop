'use client'
import React, { useEffect, useState } from 'react'

type Commandes = {
    id: number;
    reference: string;
    total: number;
    nom_client: string;
    telephone: string;
    addresse: string;
    gps: string;
}
const CommandeContenue = () => {
    const [commande, setCommande] = useState<Commandes[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchCammande = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem("token");
                const res = await fetch("/api/commandes", {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                });
                const data = res.json();
                setCommande([]);
            }catch(error){
                console.error(error);
                setCommande([]);
            }finally{
                setLoading(false)
            }

        }
        fetchCammande();
    }, []);

    return (
        <div>
            {commande.map((item) => (
                <div key={item.id}>
                    {item.telephone}
                </div>
            ))}
        </div>
    )
}

export default CommandeContenue;
