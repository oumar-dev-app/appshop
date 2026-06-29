'use client';

import AjouteCommandeBtn from "../../../_Components/AjouteCommandeBtn";
import VoirCommandeBtn from "../../../_Components/VoirCommande";
import { motion } from "framer-motion";
import { Search, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

/* =========================
   STATUTS FRANÇAIS (DB)
========================= */
const statusLabels: any = {
    en_attente: "En attente",
    confirmee: "Confirmée",
    en_preparation: "En préparation",
    expediee: "Expédiée",
    livree: "Livrée",
    recuperee: "Récupérée",
    annulee: "Annulée",
};

type Stats = {
    total: number;
    today: number;
    en_attente: number;
    livree: number;

    livraison: number;
    commande: number;

    totalPrice: number;
    todayPrice: number;
    pendingPrice: number;
    deliveredPrice: number;
};

type Commande = {
    id: number;
    reference: string;
    created_at: string;

    nom_client: string;
    telephone: string;
    addresse: string;

    gps: string;
    mode_commande: "commande" | "livraison";

    total: number;
    status: string;
};

const formatFCFA = (value: any) =>
    new Intl.NumberFormat("fr-FR").format(Number(value || 0)) + " FCFA";

export default function CommandePage() {

    const [stats, setStats] = useState<Stats | null>(null);
    const [commandes, setCommandes] = useState<Commande[]>([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    /* =========================
       STATS
    ========================= */
    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem("token");

                const res = await fetch("/api/commandes/countCommande", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await res.json();
                setStats(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    /* =========================
       COMMANDES
    ========================= */
    useEffect(() => {
        const fetchCommandes = async () => {
            try {
                const token = localStorage.getItem("token");

                const res = await fetch("/api/commandes", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await res.json();
                setCommandes(data.data || []);
            } catch (error) {
                console.error(error);
            }
        };

        fetchCommandes();
    }, []);

    /* =========================
       DELETE
    ========================= */
    const handleDelete = async (id: number) => {
        if (!confirm("Voulez-vous vraiment supprimer cette commande ?")) return;

        const loadingToast = toast.loading("Suppression...");

        try {
            const token = localStorage.getItem("token");

            const res = await fetch(`/api/commandes/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.message);

            setCommandes((prev) => prev.filter((c) => c.id !== id));

            toast.dismiss(loadingToast);
            toast.success(data.message || "Commande supprimée");
        } catch (error: any) {
            toast.dismiss(loadingToast);
            toast.error(error.message || "Erreur suppression");
        }
    };

    /* =========================
       LOADING
    ========================= */
    if (loading) {
        return (
            <p className="p-6 text-black flex items-center justify-center h-screen animate-pulse">
                Chargement des commandes...
            </p>
        );
    }

    if (!stats) {
        return <p className="p-6 text-black">Aucune donnée disponible.</p>;
    }

    const filteredCommandes = commandes.filter((c) =>
        c.nom_client?.toLowerCase().includes(search.toLowerCase()) ||
        c.reference?.toLowerCase().includes(search.toLowerCase()) ||
        c.telephone?.includes(search)
    );

    return (
        <div className="max-w-7xl mx-auto mt-4 mb-2 py-4 px-4 sm:px-6 text-black">

            <h1 className="text-2xl font-bold mb-6">
                📦 Dashboard Commande
            </h1>

            {/* STATS */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                <Card title="📦 En attente" value={stats.en_attente ?? 0} />
                <Card title="🚚 Livrées" value={stats.livree ?? 0} />
                <Card title="Récupérée" value={stats.commande ?? 0} />
                <Card
                    title="💰 Chiffre d'affaires"
                    value={formatFCFA(stats.totalPrice ?? 0)}
                />
            </div>

            {/* SEARCH */}
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between mb-6 mt-10">

                <div className="relative w-full sm:w-1/2">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

                    <input
                        type="text"
                        placeholder="Rechercher une commande..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full rounded bg-white pl-10 pr-3 py-2 shadow-lg outline-none focus:border-green-500"
                    />
                </div>

                <AjouteCommandeBtn />
            </div>

            {/* TABLE */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className="overflow-x-auto mt-8">
                    <table className="w-full border-collapse">

                        <thead>
                            <tr className="border-b">
                                <th className="p-3 text-left">Référence</th>
                                <th className="p-3 text-left">Client</th>
                                <th className="p-3 text-left">Téléphone</th>
                                <th className="p-3 text-left">Adresse</th>
                                <th className="p-3 text-left">Montant</th>
                                <th className="p-3 text-left">Statut</th>
                                <th className="p-3 text-left">Mode</th>
                                <th className="p-3 text-left">Date</th>
                                <th className="p-3 text-center">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredCommandes.map((commande) => (
                                <tr key={commande.id} className="border-b hover:bg-gray-50">

                                    <td className="p-3">{commande.reference}</td>
                                    <td className="p-3">{commande.nom_client}</td>
                                    <td className="p-3">{commande.telephone}</td>
                                    <td className="p-3">{commande.addresse}</td>

                                    <td className="p-3 font-semibold">
                                        {formatFCFA(commande.total)}
                                    </td>

                                    {/* STATUS FIX */}
                                    <td className="p-3">
                                        <span className={`px-2 py-1 rounded text-sm
                                            ${commande.status === "en_attente"
                                                ? "bg-yellow-500 text-black"
                                                : commande.status === "livree"
                                                    ? "bg-green-600 text-white"
                                                    : commande.status === "annulee"
                                                        ? "bg-red-600 text-white"
                                                        : "bg-gray-500 text-white"
                                            }`}>
                                            {statusLabels[commande.status] || commande.status}
                                        </span>
                                    </td>

                                    <td className="p-3">
                                        <span className={`px-2 py-1 rounded text-sm
                                            ${commande.mode_commande === "livraison"
                                                ? "bg-blue-500 text-white"
                                                : "bg-gray-500 text-white"
                                            }`}>
                                            {commande.mode_commande}
                                        </span>
                                    </td>

                                    <td className="p-3">
                                        {new Date(commande.created_at).toLocaleDateString()}
                                    </td>

                                    <td className="p-3 flex gap-4">
                                        <VoirCommandeBtn commande={commande} />

                                        <button
                                            onClick={() => handleDelete(commande.id)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <Trash size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}

                            {filteredCommandes.length === 0 && (
                                <tr>
                                    <td colSpan={9} className="text-center p-6 text-gray-400">
                                        Aucune commande trouvée
                                    </td>
                                </tr>
                            )}
                        </tbody>

                    </table>
                </div>
            </motion.div>
        </div>
    );
}

/* =========================
   CARD COMPONENT
========================= */
function Card({ title, value }: { title: string; value: React.ReactNode }) {
    return (
        <div className="bg-white text-black shadow-lg p-4 rounded-lg  border-b-3 border-b-green-500">
            <p className="text-gray-400">{title}</p>
            <h2 className="text-2xl font-bold mt-2">{value}</h2>
        </div>
    );
}