"use client";

import AjouteCommandeBtn from "@/_Components/AjouteCommandeBtn";
import VoirCommandeBtn from "@/_Components/VoirCommande";
import {
    CheckCircle2,
    Clock3,
    Eye,
    Package,
    Search,
    ShoppingBag,
    Store,
    Trash2,
    Truck,
    XCircle,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

type Stats = {
    total: number;
    today: number;
    pending: number;
    delivered: number;

    livraison: number;
    commande: number;

    confirmed: number;
    preparing: number;
    shipped: number;
    cancelled: number;

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

const formatPrice = (value: number) =>
    Number(value || 0).toLocaleString("fr-FR");

const statusConfig: Record<
    string,
    {
        label: string;
        className: string;
    }
> = {
    en_attente: {
        label: "En attente",
        className:
            "border-[#ead7b8] bg-[#fff8ea] text-[#9a6b25]",
    },

    confirmee: {
        label: "Confirmée",
        className:
            "border-[#d9c9ea] bg-[#f7f0fc] text-[#76539a]",
    },

    en_preparation: {
        label: "En préparation",
        className:
            "border-[#d6dce9] bg-[#f3f6fb] text-[#536987]",
    },

    expediee: {
        label: "Expédiée",
        className:
            "border-[#c9dce8] bg-[#eef8fc] text-[#39718e]",
    },

    livree: {
        label: "Livrée",
        className:
            "border-[#cfe2d3] bg-[#f0f8f1] text-[#547a5b]",
    },

    recuperee: {
        label: "Récupérée",
        className:
            "border-[#cfe2d3] bg-[#f0f8f1] text-[#547a5b]",
    },

    annulee: {
        label: "Annulée",
        className:
            "border-[#ead0d0] bg-[#fdf1f1] text-[#a94b4b]",
    },
};

export default function CommandePage() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [commandes, setCommandes] = useState<Commande[]>([]);

    const [search, setSearch] = useState("");
    const [modeFilter, setModeFilter] = useState<
        "all" | "commande" | "livraison"
    >("all");

    const [statusFilter, setStatusFilter] = useState("all");

    const [loading, setLoading] = useState(true);
    const [loadingCommandes, setLoadingCommandes] =
        useState(true);

    // =========================
    // 📊 STATS
    // =========================

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token =
                    localStorage.getItem("token");

                const res = await fetch(
                    "/api/commandes/countCommande",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (!res.ok) {
                    throw new Error(
                        "Impossible de charger les statistiques"
                    );
                }

                const data = await res.json();

                setStats(data);
            } catch (error) {
                console.error(error);
                toast.error(
                    "Impossible de charger les statistiques"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    // =========================
    // 📦 COMMANDES
    // =========================

    useEffect(() => {
        const fetchCommandes = async () => {
            try {
                const token =
                    localStorage.getItem("token");

                const res = await fetch(
                    "/api/commandes",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (!res.ok) {
                    throw new Error(
                        "Impossible de charger les commandes"
                    );
                }

                const data = await res.json();

                setCommandes(
                    Array.isArray(data?.data)
                        ? data.data
                        : []
                );
            } catch (error) {
                console.error(error);

                toast.error(
                    "Impossible de charger les commandes"
                );
            } finally {
                setLoadingCommandes(false);
            }
        };

        fetchCommandes();
    }, []);

    // =========================
    // 🗑️ SUPPRESSION
    // =========================

    const handleDelete = async (id: number) => {
        if (
            !confirm(
                "Voulez-vous vraiment supprimer cette commande ?"
            )
        ) {
            return;
        }

        const loadingToast =
            toast.loading("Suppression...");

        try {
            const token =
                localStorage.getItem("token");

            const res = await fetch(
                `/api/commandes/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await res.json();

            if (!res.ok) {
                throw new Error(
                    data.message ||
                        "Erreur lors de la suppression"
                );
            }

            setCommandes((prev) =>
                prev.filter(
                    (commande) =>
                        commande.id !== id
                )
            );

            toast.dismiss(loadingToast);

            toast.success(
                data.message ||
                    "Commande supprimée"
            );
        } catch (error: any) {
            toast.dismiss(loadingToast);

            toast.error(
                error.message ||
                    "Erreur lors de la suppression"
            );

            console.error(error);
        }
    };

    // =========================
    // 🔎 FILTRAGE
    // =========================

    const filteredCommandes = useMemo(() => {
        const query =
            search.trim().toLowerCase();

        return commandes.filter((commande) => {
            const matchesSearch =
                !query ||
                commande.nom_client
                    ?.toLowerCase()
                    .includes(query) ||
                commande.reference
                    ?.toLowerCase()
                    .includes(query) ||
                commande.telephone
                    ?.toLowerCase()
                    .includes(query);

            const matchesMode =
                modeFilter === "all" ||
                commande.mode_commande ===
                    modeFilter;

            const matchesStatus =
                statusFilter === "all" ||
                commande.status === statusFilter;

            return (
                matchesSearch &&
                matchesMode &&
                matchesStatus
            );
        });
    }, [
        commandes,
        search,
        modeFilter,
        statusFilter,
    ]);

    if (loading) {
        return (
            <div className="flex min-h-[70vh] items-center justify-center bg-[#fdfaf7]">
                <div className="text-center">
                    <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-[#eadfd8] border-t-[#a66a4c]" />

                    <p className="mt-4 text-sm text-[#8b7d77]">
                        Chargement des commandes...
                    </p>
                </div>
            </div>
        );
    }

    if (!stats) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center bg-[#fdfaf7] px-4">
                <div className="rounded-2xl border border-[#eadfd8] bg-white p-8 text-center shadow-[0_8px_30px_rgba(75,49,39,0.06)]">
                    <XCircle
                        size={36}
                        className="mx-auto !text-[#a94b4b]"
                    />

                    <p className="mt-4 text-sm text-[#6f625d]">
                        Aucune donnée disponible.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#fdfaf7] px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">

                {/* =========================
                    HEADER
                ========================= */}

                <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.3em] !text-[#a66a4c]">
                            Mini Luxe Parfum
                        </p>

                        <h1 className="mt-2 font-[family-name:var(--font-playfair)] text-3xl font-semibold !text-[#5a4740] sm:text-4xl">
                            Commandes
                        </h1>

                        <p className="mt-2 max-w-xl text-sm leading-6 !text-[#8b7d77]">
                            Gérez les commandes, les retraits
                            en boutique et les livraisons de vos
                            clients.
                        </p>
                    </div>

                    <AjouteCommandeBtn />
                </div>

                {/* =========================
                    STATS PRINCIPALES
                ========================= */}

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

                    <StatCard
                        icon={
                            <Package
                                size={20}
                            />
                        }
                        label="Commandes"
                        value={stats.total}
                        detail={`${stats.today} aujourd'hui`}
                    />

                    <StatCard
                        icon={
                            <Clock3
                                size={20}
                            />
                        }
                        label="En attente"
                        value={stats.pending}
                        detail={`${formatPrice(
                            stats.pendingPrice
                        )} FCFA`}
                    />

                    <StatCard
                        icon={
                            <CheckCircle2
                                size={20}
                            />
                        }
                        label="Terminées"
                        value={stats.delivered}
                        detail={`${formatPrice(
                            stats.deliveredPrice
                        )} FCFA`}
                    />

                    <StatCard
                        icon={
                            <ShoppingBag
                                size={20}
                            />
                        }
                        label="Chiffre d'affaires"
                        value={`${formatPrice(
                            stats.totalPrice
                        )} FCFA`}
                        detail={`${formatPrice(
                            stats.todayPrice
                        )} FCFA aujourd'hui`}
                    />

                </div>

                {/* =========================
                    MODES
                ========================= */}

                <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">

                    <button
                        type="button"
                        onClick={() =>
                            setModeFilter(
                                modeFilter ===
                                    "commande"
                                    ? "all"
                                    : "commande"
                            )
                        }
                        className={`rounded-2xl border p-5 text-left transition-all ${
                            modeFilter ===
                            "commande"
                                ? "border-[#a66a4c] bg-[#f7f0e9] shadow-[0_10px_30px_rgba(75,49,39,0.08)]"
                                : "border-[#eadfd8] bg-white hover:border-[#d8b58a]"
                        }`}
                    >
                        <div className="flex items-center justify-between">

                            <div className="flex items-center gap-3">
                                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#f2e5e1]">
                                    <Store
                                        size={20}
                                        className="!text-[#a66a4c]"
                                    />
                                </div>

                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-[0.15em] !text-[#8b7d77]">
                                        Retrait boutique
                                    </p>

                                    <p className="mt-1 font-[family-name:var(--font-playfair)] text-xl font-semibold !text-[#5a4740]">
                                        {stats.commande}
                                    </p>
                                </div>
                            </div>

                            <span className="text-xs !text-[#a66a4c]">
                                {modeFilter ===
                                "commande"
                                    ? "Filtré"
                                    : "Voir"}
                            </span>
                        </div>
                    </button>

                    <button
                        type="button"
                        onClick={() =>
                            setModeFilter(
                                modeFilter ===
                                    "livraison"
                                    ? "all"
                                    : "livraison"
                            )
                        }
                        className={`rounded-2xl border p-5 text-left transition-all ${
                            modeFilter ===
                            "livraison"
                                ? "border-[#a66a4c] bg-[#f7f0e9] shadow-[0_10px_30px_rgba(75,49,39,0.08)]"
                                : "border-[#eadfd8] bg-white hover:border-[#d8b58a]"
                        }`}
                    >
                        <div className="flex items-center justify-between">

                            <div className="flex items-center gap-3">
                                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#f2e5e1]">
                                    <Truck
                                        size={20}
                                        className="!text-[#a66a4c]"
                                    />
                                </div>

                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-[0.15em] !text-[#8b7d77]">
                                        Livraisons
                                    </p>

                                    <p className="mt-1 font-[family-name:var(--font-playfair)] text-xl font-semibold !text-[#5a4740]">
                                        {stats.livraison}
                                    </p>
                                </div>
                            </div>

                            <span className="text-xs !text-[#a66a4c]">
                                {modeFilter ===
                                "livraison"
                                    ? "Filtré"
                                    : "Voir"}
                            </span>
                        </div>
                    </button>

                </div>

                {/* =========================
                    RECHERCHE + FILTRES
                ========================= */}

                <div className="mt-8 rounded-2xl border border-[#eadfd8] bg-white p-4 shadow-[0_8px_30px_rgba(75,49,39,0.05)]">

                    <div className="flex flex-col gap-4 lg:flex-row">

                        <div className="relative flex-1">
                            <Search
                                size={18}
                                className="absolute left-4 top-1/2 -translate-y-1/2 !text-[#a66a4c]"
                            />

                            <input
                                type="text"
                                placeholder="Rechercher par client, référence ou téléphone..."
                                value={search}
                                onChange={(e) =>
                                    setSearch(
                                        e.target.value
                                    )
                                }
                                className="h-12 w-full rounded-xl border border-[#eadfd8] bg-[#fdfaf7] pl-11 pr-4 text-sm !text-[#5a4740] outline-none transition-all placeholder:!text-[#b4a8a2] focus:border-[#a66a4c] focus:ring-2 focus:ring-[#a66a4c]/10"
                            />
                        </div>

                        <select
                            value={statusFilter}
                            onChange={(e) =>
                                setStatusFilter(
                                    e.target.value
                                )
                            }
                            className="h-12 rounded-xl border border-[#eadfd8] bg-[#fdfaf7] px-4 text-sm !text-[#5a4740] outline-none focus:border-[#a66a4c]"
                        >
                            <option value="all">
                                Tous les statuts
                            </option>

                            <option value="en_attente">
                                En attente
                            </option>

                            <option value="confirmee">
                                Confirmées
                            </option>

                            <option value="en_preparation">
                                En préparation
                            </option>

                            <option value="expediee">
                                Expédiées
                            </option>

                            <option value="livree">
                                Livrées
                            </option>

                            <option value="recuperee">
                                Récupérées
                            </option>

                            <option value="annulee">
                                Annulées
                            </option>
                        </select>

                        <button
                            type="button"
                            onClick={() => {
                                setSearch("");
                                setModeFilter(
                                    "all"
                                );
                                setStatusFilter(
                                    "all"
                                );
                            }}
                            className="h-12 rounded-xl border border-[#eadfd8] px-5 text-sm font-medium !text-[#6f625d] transition hover:border-[#a66a4c] hover:!text-[#a66a4c]"
                        >
                            Réinitialiser
                        </button>

                    </div>
                </div>

                {/* =========================
                    LISTE
                ========================= */}

                <div className="mt-6 overflow-hidden rounded-2xl border border-[#eadfd8] bg-white shadow-[0_8px_30px_rgba(75,49,39,0.05)]">

                    <div className="flex items-center justify-between border-b border-[#eadfd8] px-5 py-4">
                        <div>
                            <h2 className="font-[family-name:var(--font-playfair)] text-xl font-semibold !text-[#5a4740]">
                                Toutes les commandes
                            </h2>

                            <p className="mt-1 text-xs !text-[#8b7d77]">
                                {filteredCommandes.length} commande
                                {filteredCommandes.length >
                                1
                                    ? "s"
                                    : ""}
                            </p>
                        </div>
                    </div>

                    {loadingCommandes ? (
                        <div className="flex min-h-60 items-center justify-center">
                            <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#eadfd8] border-t-[#a66a4c]" />
                        </div>
                    ) : filteredCommandes.length ===
                      0 ? (
                        <div className="px-6 py-16 text-center">
                            <ShoppingBag
                                size={38}
                                className="mx-auto !text-[#d8b58a]"
                            />

                            <h3 className="mt-4 font-[family-name:var(--font-playfair)] text-xl font-semibold !text-[#5a4740]">
                                Aucune commande
                            </h3>

                            <p className="mt-2 text-sm !text-[#8b7d77]">
                                Aucune commande ne
                                correspond à vos critères.
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[1050px]">
                                <thead>
                                    <tr className="border-b border-[#eadfd8] bg-[#fdfaf7]">
                                        <th className="px-5 py-4 text-left text-[10px] font-semibold uppercase tracking-[0.15em] !text-[#8b7d77]">
                                            Commande
                                        </th>

                                        <th className="px-5 py-4 text-left text-[10px] font-semibold uppercase tracking-[0.15em] !text-[#8b7d77]">
                                            Client
                                        </th>

                                        <th className="px-5 py-4 text-left text-[10px] font-semibold uppercase tracking-[0.15em] !text-[#8b7d77]">
                                            Réception
                                        </th>

                                        <th className="px-5 py-4 text-left text-[10px] font-semibold uppercase tracking-[0.15em] !text-[#8b7d77]">
                                            Montant
                                        </th>

                                        <th className="px-5 py-4 text-left text-[10px] font-semibold uppercase tracking-[0.15em] !text-[#8b7d77]">
                                            Statut
                                        </th>

                                        <th className="px-5 py-4 text-left text-[10px] font-semibold uppercase tracking-[0.15em] !text-[#8b7d77]">
                                            Date
                                        </th>

                                        <th className="px-5 py-4 text-center text-[10px] font-semibold uppercase tracking-[0.15em] !text-[#8b7d77]">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {filteredCommandes.map(
                                        (commande) => {
                                            const status =
                                                statusConfig[
                                                    commande.status
                                                ] ||
                                                statusConfig.en_attente;

                                            const isLivraison =
                                                commande.mode_commande ===
                                                "livraison";

                                            return (
                                                <tr
                                                    key={
                                                        commande.id
                                                    }
                                                    className="border-b border-[#f0e7e1] transition-colors hover:bg-[#fdfaf7]"
                                                >
                                                    <td className="px-5 py-4">
                                                        <p className="text-sm font-semibold !text-[#5a4740]">
                                                            {
                                                                commande.reference
                                                            }
                                                        </p>

                                                        <p className="mt-1 text-[10px] !text-[#a69a94]">
                                                            #
                                                            {
                                                                commande.id
                                                            }
                                                        </p>
                                                    </td>

                                                    <td className="px-5 py-4">
                                                        <p className="text-sm font-medium !text-[#5a4740]">
                                                            {
                                                                commande.nom_client
                                                            }
                                                        </p>

                                                        <p className="mt-1 text-xs !text-[#8b7d77]">
                                                            {
                                                                commande.telephone
                                                            }
                                                        </p>
                                                    </td>

                                                    <td className="px-5 py-4">
                                                        <div
                                                            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[10px] font-semibold ${
                                                                isLivraison
                                                                    ? "border-[#d8b58a] bg-[#fff8ef] !text-[#a66a4c]"
                                                                    : "border-[#eadfd8] bg-[#f7f0e9] !text-[#6f625d]"
                                                            }`}
                                                        >
                                                            {isLivraison ? (
                                                                <Truck
                                                                    size={
                                                                        13
                                                                    }
                                                                />
                                                            ) : (
                                                                <Store
                                                                    size={
                                                                        13
                                                                    }
                                                                />
                                                            )}

                                                            {isLivraison
                                                                ? "Livraison"
                                                                : "Retrait boutique"}
                                                        </div>

                                                        {isLivraison &&
                                                            commande.addresse && (
                                                                <p className="mt-2 max-w-[190px] truncate text-[10px] !text-[#8b7d77]">
                                                                    {
                                                                        commande.addresse
                                                                    }
                                                                </p>
                                                            )}
                                                    </td>

                                                    <td className="px-5 py-4">
                                                        <p className="text-sm font-semibold !text-[#a66a4c]">
                                                            {formatPrice(
                                                                commande.total
                                                            )}{" "}
                                                            FCFA
                                                        </p>
                                                    </td>

                                                    <td className="px-5 py-4">
                                                        <span
                                                            className={`inline-flex rounded-full border px-3 py-1.5 text-[10px] font-semibold ${status.className}`}
                                                        >
                                                            {
                                                                status.label
                                                            }
                                                        </span>
                                                    </td>

                                                    <td className="px-5 py-4">
                                                        <p className="text-xs !text-[#6f625d]">
                                                            {new Date(
                                                                commande.created_at
                                                            ).toLocaleDateString(
                                                                "fr-FR"
                                                            )}
                                                        </p>

                                                        <p className="mt-1 text-[10px] !text-[#a69a94]">
                                                            {new Date(
                                                                commande.created_at
                                                            ).toLocaleTimeString(
                                                                "fr-FR",
                                                                {
                                                                    hour: "2-digit",
                                                                    minute: "2-digit",
                                                                }
                                                            )}
                                                        </p>
                                                    </td>

                                                    <td className="px-5 py-4">
                                                        <div className="flex items-center justify-center gap-3">
                                                            <div className="rounded-full border border-[#eadfd8] bg-white p-2 transition hover:border-[#a66a4c]">
                                                                <VoirCommandeBtn
                                                                    commande={
                                                                        commande
                                                                    }
                                                                />
                                                            </div>

                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    handleDelete(
                                                                        commande.id
                                                                    )
                                                                }
                                                                className="rounded-full border border-[#eadfd8] bg-white p-2 !text-[#a94b4b] transition hover:border-[#e4c8c2] hover:bg-[#fdf1ef]"
                                                                aria-label="Supprimer la commande"
                                                            >
                                                                <Trash2
                                                                    size={
                                                                        16
                                                                    }
                                                                />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        }
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* =========================
                    RAPPORT RAPIDE
                ========================= */}

                <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">

                    <MiniStat
                        icon={
                            <Clock3
                                size={16}
                            />
                        }
                        label="En attente"
                        value={stats.pending}
                    />

                    <MiniStat
                        icon={
                            <CheckCircle2
                                size={16}
                            />
                        }
                        label="Confirmées"
                        value={stats.confirmed}
                    />

                    <MiniStat
                        icon={
                            <Package
                                size={16}
                            />
                        }
                        label="Préparation"
                        value={stats.preparing}
                    />

                    <MiniStat
                        icon={
                            <Truck
                                size={16}
                            />
                        }
                        label="Expédiées"
                        value={stats.shipped}
                    />

                </div>

            </div>
        </div>
    );
}

function StatCard({
    icon,
    label,
    value,
    detail,
}: {
    icon: React.ReactNode;
    label: string;
    value: React.ReactNode;
    detail: string;
}) {
    return (
        <div className="rounded-2xl border border-[#eadfd8] bg-white p-5 shadow-[0_8px_30px_rgba(75,49,39,0.05)]">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] !text-[#8b7d77]">
                        {label}
                    </p>

                    <p className="mt-2 text-2xl font-semibold !text-[#5a4740]">
                        {value}
                    </p>

                    <p className="mt-1 text-[10px] !text-[#a69a94]">
                        {detail}
                    </p>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f2e5e1] !text-[#a66a4c]">
                    {icon}
                </div>
            </div>
        </div>
    );
}

function MiniStat({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode;
    label: string;
    value: number;
}) {
    return (
        <div className="rounded-xl border border-[#eadfd8] bg-white px-4 py-3">
            <div className="flex items-center gap-2">
                <span className="!text-[#a66a4c]">
                    {icon}
                </span>

                <span className="text-[10px] !text-[#8b7d77]">
                    {label}
                </span>
            </div>

            <p className="mt-1 text-lg font-semibold !text-[#5a4740]">
                {value}
            </p>
        </div>
    );
}