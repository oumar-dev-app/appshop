"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { BsEye } from "react-icons/bs";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { toast } from "sonner";

// =========================
// FORMAT FCFA
// =========================
const formatFCFA = (value: any) =>
    new Intl.NumberFormat("fr-FR", {
        maximumFractionDigits: 0,
    }).format(Number(value || 0)) + " FCFA";

// =========================
// TYPES
// =========================
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

// =========================
// COMPONENT
// =========================
export default function VoirCommandeBtn({ commande }: { commande: Commande }) {
    const [open, setOpen] = useState(false);
    const [produits, setProduits] = useState<Produit[]>([]);
    const [loadingProducts, setLoadingProducts] = useState(false);

    // =========================
    // FETCH PRODUITS
    // =========================
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

    // =========================
    // UPDATE STATUS
    // =========================
    const updateStatus = async (status: "delivered" | "picked_up") => {
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

            commande.status = status; // update UI simple
        } catch (err: any) {
            toast.error(err.message || "Erreur update statut");
        }
    };

    // =========================
    // PDF
    // =========================
    const generatePDF = async () => {
        const token = localStorage.getItem("token");

        let dataProduits = produits;

        if (produits.length === 0) {
            const res = await fetch(`/api/commandes/${commande.id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const data = await res.json();
            dataProduits = data.produits || [];
            setProduits(dataProduits);
        }

        const doc = new jsPDF();

        doc.setFontSize(18);
        doc.text("FACTURE DE COMMANDE", 50, 20);

        autoTable(doc, {
            startY: 40,
            head: [["Produit", "Qté", "Prix", "Total"]],
            body: dataProduits.map((p) => [
                p.nom,
                p.quantite,
                formatFCFA(p.prix_unitaire),
                formatFCFA(p.quantite * p.prix_unitaire),
            ]),
        });

        const finalY = (doc as any).lastAutoTable.finalY + 10;
        doc.text(`TOTAL: ${formatFCFA(commande.total)}`, 10, finalY);

        doc.save(`facture-${commande.reference}.pdf`);
    };

    // =========================
    // TICKET
    // =========================
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
        <p style="text-align:center;">Merci 🙏</p>
      </body>
      </html>
    `);

        win?.document.close();
        win?.print();
    };

    // =========================
    // WHATSAPP
    // =========================
    const sendWhatsApp = () => {
        const phone = commande.telephone.replace(/[^\d]/g, "");

        const message =
            `Bonjour ${commande.nom_client},\n\n` +
            `Réf: ${commande.reference}\n` +
            `Adresse: ${commande.addresse}\n` +
            `Total: ${formatFCFA(commande.total)}\n\n` +
            `Merci pour votre confiance 🙏`;

        window.open(
            `https://wa.me/${phone}?text=${encodeURIComponent(message)}`,
            "_blank"
        );
    };

    // =========================
    // UI
    // =========================
    return (
        <>
            {/* BUTTON OPEN */}
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

                    <div className="relative bg-white w-full max-w-md p-5 rounded-lg text-black">

                        {/* HEADER */}
                        <div className="flex justify-between mb-4">
                            <h2 className="font-bold">Détails commande</h2>
                            <button onClick={() => setOpen(false)}>
                                <X />
                            </button>
                        </div>

                        {/* INFOS */}
                        <div className="text-sm space-y-1">
                            <p><b>Ref:</b> {commande.reference}</p>
                            <p><b>Client:</b> {commande.nom_client}</p>
                            <p><b>Tél:</b> {commande.telephone}</p>
                            <p><b>Total:</b> {formatFCFA(commande.total)}</p>
                            <p><b>Mode:</b> {commande.mode_commande}</p>

                            <p>
                                <b>Statut:</b>{" "}
                                {commande.status === "delivered"
                                    ? "Livrée 🚚"
                                    : commande.status === "picked_up"
                                        ? "Récupérée 🏪"
                                        : "En cours ⏳"}
                            </p>

                            {/* MESSAGE FINAL */}
                            {commande.status === "delivered" && (
                                <p className="text-green-600 text-xs">
                                    ✔ Commande livrée avec succès
                                </p>
                            )}

                            {commande.status === "picked_up" && (
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

                            {/* PDF */}
                            <button
                                onClick={generatePDF}
                                className="bg-blue-600 text-white py-2 rounded"
                            >
                                📄 PDF facture
                            </button>

                            {/* TICKET */}
                            <button
                                onClick={printTicket}
                                className="bg-gray-700 text-white py-2 rounded"
                            >
                                🧾 Imprimer ticket
                            </button>

                            {/* WHATSAPP */}
                            <button
                                onClick={sendWhatsApp}
                                className="bg-green-600 text-white py-2 rounded"
                            >
                                📲 WhatsApp client
                            </button>

                            {/* ========================= */}
                            {/* 🚚 LIVRAISON */}
                            {/* ========================= */}
                            {commande.mode_commande === "livraison" &&
                                commande.status !== "delivered" && (
                                    <button
                                        onClick={() => updateStatus("delivered")}
                                        className="bg-emerald-600 text-white py-2 rounded"
                                    >
                                        🚚 Marquer comme livré
                                    </button>
                                )}

                            {/* ========================= */}
                            {/* 🏪 COMMANDE (RETRAIT) */}
                            {/* ========================= */}
                            {commande.mode_commande === "commande" &&
                                commande.status !== "picked_up" && (
                                    <button
                                        onClick={() => updateStatus("picked_up")}
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