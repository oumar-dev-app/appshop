"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { BsEye } from "react-icons/bs";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { toast } from "sonner";


/* =========================
   TYPES (DB FR)
========================= */
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

/* =========================
   STATUS LABELS (FR DB)
========================= */
const statusLabels: any = {
    en_attente: "En attente",
    confirmee: "Confirmée",
    en_preparation: "En préparation",
    expediee: "Expédiée",
    livree: "Livrée 🚚",
    recuperee: "Récupérée 🏪",
    annulee: "Annulée",
};

// 🔥 FORMAT FCFA SAFE
const formatFCFA = (value: any) =>
    new Intl.NumberFormat("fr-FR").format(Number(value || 0)) + " FCFA";

/* =========================
   COMPONENT
========================= */
export default function VoirCommandeBtn({ commande }: { commande: Commande }) {
    
    const [open, setOpen] = useState(false);
    const [produits, setProduits] = useState<Produit[]>([]);
    const [loadingProducts, setLoadingProducts] = useState(false);

    /* =========================
       FETCH PRODUITS
    ========================= */
    const fetchDetails = async () => {
        try {
            setLoadingProducts(true);

            const token = localStorage.getItem("token");

            const res = await fetch(`/api/commandes/${commande.id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const data = await res.json();
            setProduits(data.produits || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingProducts(false);
        }
    };

    /* =========================
       UPDATE STATUS (FIXED)
    ========================= */
    const updateStatus = async (status: "livree" | "recuperee") => {
        try {
            const token = localStorage.getItem("token");

            const res = await fetch(`/api/commandes/${commande.id}/status`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ status }),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.message);

            toast.success("Statut mis à jour");

            // update UI local
            commande.status = status;

        } catch (err: any) {
            toast.error(err.message || "Erreur update statut");
        }
    };

    /* =========================
       PDF
    ========================= */
    const generatePDF = async () => {
        // ⚠️ important: attendre les produits
        if (produits.length === 0) {
            await fetchDetails();
        }

        const doc = new jsPDF();

        // HEADER
        doc.setFontSize(18);
        doc.text("FACTURE DE COMMANDE", 60, 20);

        doc.setFontSize(11);

        // CLIENT
        doc.text(`Client: ${commande.nom_client}`, 10, 40);
        doc.text(`Téléphone: ${commande.telephone}`, 10, 47);
        doc.text(`Adresse: ${commande.addresse}`, 10, 54);
        doc.text(`Référence: ${commande.reference}`, 10, 61);
        doc.text(`Mode: ${commande.mode_commande}`, 10, 68);

        // PRODUITS TABLE
        autoTable(doc, {
            startY: 85,
            head: [["Produit", "Qté", "Prix", "Total"]],
            body: produits.map((p) => [
                p.nom,
                p.quantite,
                `${formatFCFA(p.prix_unitaire)}`,
                `${formatFCFA(p.quantite * p.prix_unitaire)}`,
            ]),
        });

        const finalY = (doc as any).lastAutoTable.finalY + 10;

        // TOTAL
        doc.setFontSize(13);
        doc.text(
            `TOTAL: ${formatFCFA(commande.total)}`,
            10,
            finalY
        );

        // FOOTER
        doc.setFontSize(10);
        doc.text("Merci pour votre confiance ", 10, finalY + 15);

        doc.save(`facture-${commande.reference}.pdf`);
    };

    /* =========================
       PRINT
    ========================= */
    const printTicket = () => {
        const win = window.open("", "PRINT", "width=400,height=600");

        win?.document.write(`
            <html>
            <head>
                <title>Ticket</title>
                <style>
                    body { font-family: monospace; padding: 20px; }
                    h2 { text-align: center; }
                </style>
            </head>
            <body>
                <h2>COMMANDE</h2>
                <p>Ref: ${commande.reference}</p>
                <p>Client: ${commande.nom_client}</p>
                <p>Tel: ${commande.telephone}</p>
                <p>Total: ${formatFCFA(commande.total)}</p>
                <hr/>
                <p style="text-align:center;">Merci</p>
            </body>
            </html>
        `);

        win?.document.close();
        win?.print();
    };

    /* =========================
       WHATSAPP
    ========================= */
    const sendWhatsApp = () => {
        const phone = commande.telephone.replace(/\D/g, "");

        const isLivraison = commande.mode_commande === "livraison";

        const message = isLivraison
            ? `Bonjour ${commande.nom_client},

            Votre commande est en livraison 
            Réf: ${commande.reference}
            Adresse: ${commande.addresse}
           <p>Total: ${formatFCFA(commande.total)}</p>

            Merci pour votre confiance `
            : `Bonjour ${commande.nom_client},

            Votre commande est confirmée 
            Réf: ${commande.reference}
            Adresse: ${commande.addresse}
             <p>Total: ${formatFCFA(commande.total)}</p>
            Merci pour votre confiance `;

        window.open(
            `https://wa.me/${phone}?text=${encodeURIComponent(message)}`,
            "_blank"
        );
    };

    /* =========================
       UI
    ========================= */
    return (
        <>
            {/* OPEN */}
            <button
                onClick={async () => {
                    setOpen(true);
                    await fetchDetails();
                }}
                className="text-blue-500 hover:text-blue-700"
            >
                <BsEye size={18} />
            </button>

            {/* MODAL */}
            {open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div
                        className="absolute inset-0 bg-black/60"
                        onClick={() => setOpen(false)}
                    />

                    <div className="relative bg-white w-full max-w-md p-5 rounded-lg text-black m-3">

                        {/* HEADER */}
                        <div className="flex justify-between mb-4">
                            <h2 className="font-bold">Détails commande</h2>
                            <button onClick={() => setOpen(false)}>
                                <X />
                            </button>
                        </div>

                        {/* INFOS */}
                        {/* INFOS */}
                        <div className="text-sm space-y-1">
                            <p>
                                <b>Ref:</b> {commande.reference}
                            </p>

                            <p>
                                <b>Client:</b> {commande.nom_client}
                            </p>

                            <p>
                                <b>Tél:</b> {commande.telephone}
                            </p>

                            <p>
                                <b>Adresse:</b> {commande.addresse}
                            </p>

                            <p>
                                <b>Total:</b> {formatFCFA(commande.total)}
                            </p>

                            <p>
                                <b>Mode:</b>{" "}
                                {commande.mode_commande === "livraison"
                                    ? "Livraison 🚚"
                                    : "Commande 🏪"}
                            </p>

                            {/* GPS UNIQUEMENT POUR LES LIVRAISONS */}
                            {commande.mode_commande === "livraison" && commande.gps && (
                                <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                                    <p className="font-medium text-green-800">
                                        📍 Localisation du client
                                    </p>

                                    <a
                                        href={commande.gps}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 underline break-all"
                                    >
                                        Ouvrir dans Google Maps
                                    </a>
                                </div>
                            )}

                            <p>
                                <b>Statut:</b>{" "}
                                {statusLabels[commande.status] || commande.status}
                            </p>

                            {commande.status === "livree" && (
                                <p className="text-green-600 text-xs">
                                    ✔ Commande livrée avec succès
                                </p>
                            )}

                            {commande.status === "recuperee" && (
                                <p className="text-blue-600 text-xs">
                                    ✔ Commande récupérée
                                </p>
                            )}
                        </div>

                        {/* PRODUITS */}
                        <div className="mt-4">
                            <h3 className="font-bold">Produits</h3>

                            {loadingProducts ? (
                                <p>Chargement...</p>
                            ) : (
                                <ul className="text-sm">
                                    {produits.map((p, i) => (
                                        <li key={i}>
                                            {p.nom} × {p.quantite}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        {/* ACTIONS */}
                        <div className="mt-5 flex flex-col gap-2">

                            <button
                                onClick={generatePDF}
                                className="bg-blue-600 text-white py-2 rounded"
                            >
                                📄 PDF facture
                            </button>

                            <button
                                onClick={printTicket}
                                className="bg-gray-700 text-white py-2 rounded"
                            >
                                🧾 Imprimer ticket
                            </button>

                            <button
                                onClick={sendWhatsApp}
                                className="bg-green-600 text-white py-2 rounded"
                            >
                                📲 WhatsApp client
                            </button>

                            {/* LIVRAISON */}
                            {commande.mode_commande === "livraison" &&
                                commande.status !== "livree" && (
                                    <button
                                        onClick={() => updateStatus("livree")}
                                        className="bg-emerald-600 text-white py-2 rounded"
                                    >
                                        🚚 Marquer comme livré
                                    </button>
                                )}

                            {/* COMMANDE */}
                            {commande.mode_commande === "commande" &&
                                commande.status !== "recuperee" && (
                                    <button
                                        onClick={() => updateStatus("recuperee")}
                                        className="bg-indigo-600 text-white py-2 rounded"
                                    >
                                        🏪 Marquer comme récupéré
                                    </button>
                                )}

                        </div>
                    </div>
                </div>
            )}
        </>
    );
}