"use client";

import { useState } from "react";
import {
    Check,
    CheckCircle2,
    ChevronDown,
    Clock3,
    FileText,
    MapPin,
    MessageCircle,
    Package,
    Printer,
    Store,
    Truck,
    X,
} from "lucide-react";
import { BsEye } from "react-icons/bs";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

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

type Produit = {
    nom: string;
    quantite: number;
    prix_unitaire: number;
};

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

const formatPrice = (value: number) =>
    Number(value || 0).toLocaleString("fr-FR");

export default function VoirCommandeBtn({
    commande,
}: {
    commande: Commande;
}) {
    const [open, setOpen] = useState(false);
    const [produits, setProduits] = useState<Produit[]>([]);
    const [loading, setLoading] = useState(false);

    const [currentStatus, setCurrentStatus] =
        useState(commande.status);

    const [updatingStatus, setUpdatingStatus] =
        useState(false);

    const [statusMessage, setStatusMessage] =
        useState("");

    const isLivraison =
        commande.mode_commande === "livraison";

    const status =
        statusConfig[currentStatus] ||
        statusConfig.en_attente;

    // =========================
    // STATUTS DISPONIBLES
    // =========================

    const getAvailableStatuses = () => {
        switch (currentStatus) {
            case "en_attente":
                return [
                    "confirmee",
                    "annulee",
                ];

            case "confirmee":
                return [
                    "en_preparation",
                    "annulee",
                ];

            case "en_preparation":
                return isLivraison
                    ? [
                          "expediee",
                          "annulee",
                      ]
                    : [
                          "recuperee",
                          "annulee",
                      ];

            case "expediee":
                return [
                    "livree",
                    "annulee",
                ];

            case "livree":
            case "recuperee":
            case "annulee":
                return [];

            default:
                return [];
        }
    };

    const availableStatuses =
        getAvailableStatuses();

    // =========================
    // 📦 CHARGER LES PRODUITS
    // =========================

    const fetchDetails = async () => {
        try {
            setLoading(true);

            const token =
                localStorage.getItem("token");

            const res = await fetch(
                `/api/commandes/${commande.id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await res.json();

            if (!res.ok) {
                throw new Error(
                    data.message ||
                        "Impossible de charger la commande"
                );
            }

            setProduits(
                Array.isArray(data?.produits)
                    ? data.produits
                    : []
            );

            if (data?.commande?.status) {
                setCurrentStatus(
                    data.commande.status
                );
            }
        } catch (error) {
            console.error(
                "Erreur détail commande :",
                error
            );
        } finally {
            setLoading(false);
        }
    };

    // =========================
    // 🔄 CHANGER LE STATUT
    // =========================

    const updateStatus = async (
        newStatus: string
    ) => {
        if (
            updatingStatus ||
            newStatus === currentStatus
        ) {
            return;
        }

        try {
            setUpdatingStatus(true);
            setStatusMessage("");

            const token =
                localStorage.getItem("token");

            const res = await fetch(
                `/api/commandes/${commande.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type":
                            "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        status: newStatus,
                    }),
                }
            );

            const data = await res.json();

            if (!res.ok) {
                throw new Error(
                    data.message ||
                        "Impossible de modifier le statut"
                );
            }

            setCurrentStatus(newStatus);

            setStatusMessage(
                "Statut mis à jour avec succès."
            );

            window.setTimeout(() => {
                setStatusMessage("");
            }, 3000);

            // Permet au dashboard parent
            // de récupérer les nouvelles données
            window.dispatchEvent(
                new CustomEvent(
                    "commandeStatusUpdated",
                    {
                        detail: {
                            commandeId:
                                commande.id,
                            status: newStatus,
                        },
                    }
                )
            );
        } catch (error) {
            console.error(
                "Erreur changement statut :",
                error
            );

            setStatusMessage(
                error instanceof Error
                    ? error.message
                    : "Erreur lors de la mise à jour."
            );
        } finally {
            setUpdatingStatus(false);
        }
    };

    // =========================
    // 📄 PDF
    // =========================

    const generatePDF = async () => {
        let products = produits;

        if (products.length === 0) {
            try {
                const token =
                    localStorage.getItem("token");

                const res = await fetch(
                    `/api/commandes/${commande.id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const data = await res.json();

                products = Array.isArray(
                    data?.produits
                )
                    ? data.produits
                    : [];

                setProduits(products);
            } catch (error) {
                console.error(error);
                return;
            }
        }

        const doc = new jsPDF();

        doc.setFontSize(18);
        doc.text(
            "MINI LUXE PARFUM",
            14,
            20
        );

        doc.setFontSize(12);
        doc.text(
            "FACTURE DE COMMANDE",
            14,
            29
        );

        doc.setFontSize(10);

        doc.text(
            `Référence : ${commande.reference}`,
            14,
            42
        );

        doc.text(
            `Date : ${new Date(
                commande.created_at
            ).toLocaleDateString("fr-FR")}`,
            14,
            49
        );

        doc.text(
            `Client : ${commande.nom_client}`,
            14,
            59
        );

        doc.text(
            `Téléphone : ${commande.telephone}`,
            14,
            66
        );

        doc.text(
            `Mode : ${
                isLivraison
                    ? "Livraison"
                    : "Retrait à la boutique"
            }`,
            14,
            73
        );

        doc.text(
            `Statut : ${
                status.label
            }`,
            14,
            80
        );

        if (
            isLivraison &&
            commande.addresse
        ) {
            doc.text(
                `Adresse : ${commande.addresse}`,
                14,
                87
            );
        }

        const startY = isLivraison
            ? 97
            : 91;

        autoTable(doc, {
            startY,
            head: [
                [
                    "Produit",
                    "Qté",
                    "Prix unitaire",
                    "Total",
                ],
            ],
            body: products.map((p) => [
                p.nom,
                p.quantite,
                `${formatPrice(
                    p.prix_unitaire
                )} FCFA`,
                `${formatPrice(
                    p.quantite *
                        p.prix_unitaire
                )} FCFA`,
            ]),
            styles: {
                fontSize: 9,
            },
            headStyles: {
                fillColor: [
                    166,
                    106,
                    76,
                ],
            },
        });

        const finalY =
            (doc as any).lastAutoTable
                ?.finalY + 10;

        doc.setFontSize(13);

        doc.text(
            `TOTAL : ${formatPrice(
                commande.total
            )} FCFA`,
            14,
            finalY
        );

        doc.setFontSize(9);

        doc.text(
            "Merci pour votre confiance.",
            14,
            finalY + 12
        );

        doc.save(
            `facture-${commande.reference}.pdf`
        );
    };

    // =========================
    // 🧾 IMPRESSION
    // =========================

    const printTicket = () => {
        const win = window.open(
            "",
            "PRINT",
            "width=420,height=650"
        );

        if (!win) {
            return;
        }

        const mode = isLivraison
            ? "Livraison"
            : "Retrait à la boutique";

        win.document.write(`
            <html>
                <head>
                    <title>Commande ${
                        commande.reference
                    }</title>

                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            padding: 24px;
                            color: #2b211f;
                        }

                        h2 {
                            text-align: center;
                            margin-bottom: 4px;
                        }

                        .brand {
                            text-align: center;
                            color: #a66a4c;
                            font-size: 11px;
                            letter-spacing: 2px;
                            text-transform: uppercase;
                            margin-bottom: 20px;
                        }

                        .line {
                            border-top: 1px solid #ddd;
                            margin: 15px 0;
                        }

                        .total {
                            font-size: 18px;
                            font-weight: bold;
                            color: #a66a4c;
                        }
                    </style>
                </head>

                <body>
                    <h2>BON DE COMMANDE</h2>

                    <div class="brand">
                        Mini Luxe Parfum
                    </div>

                    <p>
                        <strong>Référence :</strong>
                        ${commande.reference}
                    </p>

                    <p>
                        <strong>Client :</strong>
                        ${commande.nom_client}
                    </p>

                    <p>
                        <strong>Téléphone :</strong>
                        ${commande.telephone}
                    </p>

                    <p>
                        <strong>Mode :</strong>
                        ${mode}
                    </p>

                    ${
                        isLivraison &&
                        commande.addresse
                            ? `
                            <p>
                                <strong>Adresse :</strong>
                                ${commande.addresse}
                            </p>
                        `
                            : ""
                    }

                    <p>
                        <strong>Statut :</strong>
                        ${status.label}
                    </p>

                    <div class="line"></div>

                    <p class="total">
                        TOTAL :
                        ${formatPrice(
                            commande.total
                        )} FCFA
                    </p>

                    <div class="line"></div>

                    <p style="text-align:center;">
                        Merci pour votre confiance.
                    </p>
                </body>
            </html>
        `);

        win.document.close();
        win.focus();
        win.print();
    };

    // =========================
    // 📲 WHATSAPP
    // =========================

    const sendWhatsApp = () => {
        const phone =
            commande.telephone.replace(
                /\D/g,
                ""
            );

        const message = isLivraison
            ? `Bonjour ${commande.nom_client},

Votre commande Mini Luxe Parfum est en cours de traitement.

Référence : ${commande.reference}
Mode : Livraison
Adresse : ${commande.addresse}
Statut : ${status.label}
Total : ${formatPrice(
                  commande.total
              )} FCFA

Merci pour votre confiance.`
            : `Bonjour ${commande.nom_client},

Votre commande Mini Luxe Parfum est en cours de traitement.

Référence : ${commande.reference}
Mode : Retrait à la boutique
Statut : ${status.label}
Total : ${formatPrice(
                  commande.total
              )} FCFA

Votre commande sera préparée pour être récupérée à la boutique.

Merci pour votre confiance.`;

        window.open(
            `https://wa.me/${phone}?text=${encodeURIComponent(
                message
            )}`,
            "_blank"
        );
    };

    return (
        <>
            {/* =========================
                BOUTON VOIR
            ========================= */}

            <button
                type="button"
                onClick={async () => {
                    setOpen(true);
                    await fetchDetails();
                }}
                aria-label="Voir la commande"
                className="flex h-7 w-7 items-center justify-center !text-[#a66a4c] transition hover:!text-[#7d4d38]"
            >
                <BsEye size={17} />
            </button>

            {/* =========================
                MODAL
            ========================= */}

            {open && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6">

                    <div
                        className="absolute inset-0 bg-[#2b211f]/55 backdrop-blur-sm"
                        onClick={() =>
                            setOpen(false)
                        }
                    />

                    <div className="relative flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-[24px] border border-[#eadfd8] bg-[#fdfaf7] shadow-[0_25px_80px_rgba(43,33,31,0.25)]">

                        {/* =========================
                            HEADER
                        ========================= */}

                        <div className="border-b border-[#eadfd8] bg-white px-5 py-5 sm:px-7">

                            <div className="flex items-start justify-between gap-4">

                                <div>
                                    <p className="text-[9px] font-semibold uppercase tracking-[0.28em] !text-[#a66a4c]">
                                        Mini Luxe Parfum
                                    </p>

                                    <h2 className="mt-1 font-[family-name:var(--font-playfair)] text-2xl font-semibold !text-[#5a4740]">
                                        Détails de la commande
                                    </h2>

                                    <p className="mt-1 text-xs !text-[#8b7d77]">
                                        {commande.reference}
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setOpen(
                                            false
                                        )
                                    }
                                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#eadfd8] bg-[#fdfaf7] !text-[#6f625d] transition hover:border-[#a66a4c] hover:!text-[#a66a4c]"
                                    aria-label="Fermer"
                                >
                                    <X
                                        size={18}
                                    />
                                </button>

                            </div>

                            {/* MODE + STATUT */}

                            <div className="mt-5 flex flex-wrap gap-2">

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
                                        ? "Livraison à domicile"
                                        : "Retrait à la boutique"}
                                </div>

                                <span
                                    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[10px] font-semibold ${status.className}`}
                                >
                                    <Clock3
                                        size={
                                            12
                                        }
                                    />

                                    {status.label}
                                </span>

                            </div>
                        </div>

                        {/* =========================
                            CONTENU
                        ========================= */}

                        <div className="overflow-y-auto px-5 py-5 sm:px-7">

                            {/* CLIENT */}

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                                <InfoCard
                                    label="Client"
                                    value={
                                        commande.nom_client
                                    }
                                />

                                <InfoCard
                                    label="Téléphone"
                                    value={
                                        commande.telephone
                                    }
                                />

                            </div>

                            {/* =========================
                                STATUT
                            ========================= */}

                            <div className="mt-4 rounded-2xl border border-[#eadfd8] bg-white p-5">

                                <div className="flex items-start gap-3">

                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f2e5e1]">
                                        <CheckCircle2
                                            size={
                                                18
                                            }
                                            className="!text-[#a66a4c]"
                                        />
                                    </div>

                                    <div className="min-w-0 flex-1">

                                        <p className="text-[9px] font-semibold uppercase tracking-[0.2em] !text-[#a66a4c]">
                                            Suivi de la commande
                                        </p>

                                        <h3 className="mt-1 font-[family-name:var(--font-playfair)] text-lg font-semibold !text-[#5a4740]">
                                            {status.label}
                                        </h3>

                                        {availableStatuses.length >
                                        0 ? (
                                            <div className="mt-4">

                                                <div className="relative">

                                                    <select
                                                        value=""
                                                        disabled={
                                                            updatingStatus
                                                        }
                                                        onChange={(
                                                            event
                                                        ) => {
                                                            if (
                                                                event
                                                                    .target
                                                                    .value
                                                            ) {
                                                                updateStatus(
                                                                    event
                                                                        .target
                                                                        .value
                                                                );
                                                            }
                                                        }}
                                                        className="h-11 w-full appearance-none rounded-xl border border-[#eadfd8] bg-[#fdfaf7] px-4 pr-10 text-xs font-medium !text-[#5a4740] outline-none transition focus:border-[#a66a4c] focus:ring-2 focus:ring-[#a66a4c]/10 disabled:cursor-not-allowed disabled:opacity-60"
                                                    >
                                                        <option
                                                            value=""
                                                            disabled
                                                        >
                                                            {updatingStatus
                                                                ? "Mise à jour..."
                                                                : "Changer le statut"}
                                                        </option>

                                                        {availableStatuses.map(
                                                            (
                                                                statusKey
                                                            ) => (
                                                                <option
                                                                    key={
                                                                        statusKey
                                                                    }
                                                                    value={
                                                                        statusKey
                                                                    }
                                                                >
                                                                    {
                                                                        statusConfig[
                                                                            statusKey
                                                                        ]
                                                                            ?.label
                                                                    }
                                                                </option>
                                                            )
                                                        )}
                                                    </select>

                                                    <ChevronDown
                                                        size={
                                                            16
                                                        }
                                                        className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 !text-[#a66a4c]"
                                                    />

                                                </div>

                                                <p className="mt-2 text-[10px] !text-[#8b7d77]">
                                                    Les étapes proposées
                                                    dépendent du mode de
                                                    réception de la commande.
                                                </p>

                                            </div>
                                        ) : (
                                            <p className="mt-2 text-xs !text-[#8b7d77]">
                                                Cette commande est arrivée
                                                à son statut final.
                                            </p>
                                        )}

                                        {statusMessage && (
                                            <div
                                                className={`mt-3 flex items-center gap-2 rounded-xl px-3 py-2 text-[10px] font-medium ${
                                                    statusMessage.includes(
                                                        "succès"
                                                    )
                                                        ? "bg-[#f0f8f1] !text-[#547a5b]"
                                                        : "bg-[#fdf1f1] !text-[#a94b4b]"
                                                }`}
                                            >
                                                {statusMessage.includes(
                                                    "succès"
                                                ) ? (
                                                    <Check
                                                        size={
                                                            13
                                                        }
                                                    />
                                                ) : null}

                                                {
                                                    statusMessage
                                                }
                                            </div>
                                        )}

                                    </div>
                                </div>
                            </div>

                            {/* =========================
                                RÉCEPTION
                            ========================= */}

                            <div className="mt-4 rounded-2xl border border-[#eadfd8] bg-white p-5">

                                <div className="flex items-start gap-3">

                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f2e5e1]">
                                        {isLivraison ? (
                                            <Truck
                                                size={
                                                    18
                                                }
                                                className="!text-[#a66a4c]"
                                            />
                                        ) : (
                                            <Store
                                                size={
                                                    18
                                                }
                                                className="!text-[#a66a4c]"
                                            />
                                        )}
                                    </div>

                                    <div className="min-w-0 flex-1">

                                        <p className="text-[9px] font-semibold uppercase tracking-[0.2em] !text-[#a66a4c]">
                                            Mode de réception
                                        </p>

                                        <h3 className="mt-1 font-[family-name:var(--font-playfair)] text-lg font-semibold !text-[#5a4740]">
                                            {isLivraison
                                                ? "Livraison à domicile"
                                                : "Retrait à la boutique"}
                                        </h3>

                                        {isLivraison ? (
                                            <div className="mt-3 space-y-2">

                                                {commande.addresse && (
                                                    <div className="flex items-start gap-2 text-xs !text-[#6f625d]">
                                                        <MapPin
                                                            size={
                                                                15
                                                            }
                                                            className="mt-0.5 shrink-0 !text-[#a66a4c]"
                                                        />

                                                        <span>
                                                            {
                                                                commande.addresse
                                                            }
                                                        </span>
                                                    </div>
                                                )}

                                                {commande.gps && (
                                                    <a
                                                        href={
                                                            commande.gps
                                                        }
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-2 text-xs font-semibold !text-[#a66a4c] hover:!text-[#7d4d38]"
                                                    >
                                                        <MapPin
                                                            size={
                                                                14
                                                            }
                                                        />
                                                        Voir la localisation GPS
                                                    </a>
                                                )}

                                            </div>
                                        ) : (
                                            <p className="mt-2 text-xs leading-5 !text-[#8b7d77]">
                                                Le client récupérera sa
                                                commande directement à la
                                                boutique.
                                            </p>
                                        )}

                                    </div>
                                </div>
                            </div>

                            {/* =========================
                                PRODUITS
                            ========================= */}

                            <div className="mt-4 rounded-2xl border border-[#eadfd8] bg-white p-5">

                                <div className="flex items-center gap-2">
                                    <Package
                                        size={
                                            17
                                        }
                                        className="!text-[#a66a4c]"
                                    />

                                    <h3 className="font-[family-name:var(--font-playfair)] text-lg font-semibold !text-[#5a4740]">
                                        Produits commandés
                                    </h3>
                                </div>

                                {loading ? (
                                    <div className="flex items-center justify-center py-8">
                                        <div className="h-7 w-7 animate-spin rounded-full border-2 border-[#eadfd8] border-t-[#a66a4c]" />
                                    </div>
                                ) : produits.length ===
                                  0 ? (
                                    <p className="mt-5 text-center text-xs !text-[#8b7d77]">
                                        Aucun produit trouvé.
                                    </p>
                                ) : (
                                    <div className="mt-4 space-y-2">

                                        {produits.map(
                                            (
                                                produit,
                                                index
                                            ) => (
                                                <div
                                                    key={`${produit.nom}-${index}`}
                                                    className="flex items-center justify-between gap-4 rounded-xl bg-[#fdfaf7] px-4 py-3"
                                                >
                                                    <div className="min-w-0">
                                                        <p className="truncate text-sm font-medium !text-[#5a4740]">
                                                            {
                                                                produit.nom
                                                            }
                                                        </p>

                                                        <p className="mt-1 text-[10px] !text-[#8b7d77]">
                                                            Quantité :{" "}
                                                            {
                                                                produit.quantite
                                                            }
                                                        </p>
                                                    </div>

                                                    <p className="shrink-0 text-xs font-semibold !text-[#a66a4c]">
                                                        {formatPrice(
                                                            produit.prix_unitaire
                                                        )}{" "}
                                                        FCFA
                                                    </p>
                                                </div>
                                            )
                                        )}

                                    </div>
                                )}

                                <div className="mt-4 flex items-center justify-between border-t border-[#eadfd8] pt-4">

                                    <span className="text-xs font-medium !text-[#6f625d]">
                                        Total commande
                                    </span>

                                    <span className="text-lg font-semibold !text-[#a66a4c]">
                                        {formatPrice(
                                            commande.total
                                        )}{" "}
                                        FCFA
                                    </span>

                                </div>
                            </div>

                            {/* DATE */}

                            <div className="mt-4 flex items-center justify-between rounded-xl border border-[#eadfd8] bg-[#f7f0e9] px-4 py-3">

                                <span className="text-[10px] uppercase tracking-[0.12em] !text-[#8b7d77]">
                                    Date de commande
                                </span>

                                <span className="text-xs font-medium !text-[#5a4740]">
                                    {new Date(
                                        commande.created_at
                                    ).toLocaleDateString(
                                        "fr-FR",
                                        {
                                            day: "2-digit",
                                            month: "long",
                                            year: "numeric",
                                        }
                                    )}
                                </span>

                            </div>

                        </div>

                        {/* =========================
                            ACTIONS
                        ========================= */}

                        <div className="border-t border-[#eadfd8] bg-white px-5 py-4 sm:px-7">

                            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">

                                <button
                                    type="button"
                                    onClick={
                                        generatePDF
                                    }
                                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[#eadfd8] bg-[#fdfaf7] px-4 text-xs font-semibold !text-[#6f625d] transition hover:border-[#a66a4c] hover:!text-[#a66a4c]"
                                >
                                    <FileText
                                        size={
                                            15
                                        }
                                    />
                                    PDF facture
                                </button>

                                <button
                                    type="button"
                                    onClick={
                                        printTicket
                                    }
                                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[#eadfd8] bg-[#fdfaf7] px-4 text-xs font-semibold !text-[#6f625d] transition hover:border-[#a66a4c] hover:!text-[#a66a4c]"
                                >
                                    <Printer
                                        size={
                                            15
                                        }
                                    />
                                    Imprimer
                                </button>

                                <button
                                    type="button"
                                    onClick={
                                        sendWhatsApp
                                    }
                                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#a66a4c] px-4 text-xs font-semibold !text-white transition hover:bg-[#7d4d38]"
                                >
                                    <MessageCircle
                                        size={
                                            15
                                        }
                                    />
                                    WhatsApp
                                </button>

                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

function InfoCard({
    label,
    value,
}: {
    label: string;
    value: string;
}) {
    return (
        <div className="rounded-2xl border border-[#eadfd8] bg-white p-4">
            <p className="text-[9px] font-semibold uppercase tracking-[0.18em] !text-[#8b7d77]">
                {label}
            </p>

            <p className="mt-2 truncate text-sm font-medium !text-[#5a4740]">
                {value || "—"}
            </p>
        </div>
    );
}