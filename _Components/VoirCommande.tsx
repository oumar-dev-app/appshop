"use client";

import { useState } from "react";
import { X } from "lucide-react";
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

export default function VoirCommandeBtn({ commande }: { commande: Commande }) {
    const [open, setOpen] = useState(false);
    const [produits, setProduits] = useState<Produit[]>([]);
    const [loading, setLoading] = useState(false);

    // =========================
    // 📦 FETCH PRODUITS
    // =========================
    const fetchDetails = async () => {
        try {
            setLoading(true);

            const token = localStorage.getItem("token");

            const res = await fetch(
                `/api/commandes/${commande.id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await res.json();

            console.log("DETAIL COMMANDE =", data);
            console.log("PRODUITS =", data.produits);

            setProduits(data.produits || []);

        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };



    // =========================
    // 📄 PDF FACTURE PRO
    // =========================
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
        doc.text(`Statut: ${commande.status}`, 10, 75);

        // PRODUITS TABLE
        autoTable(doc, {
            startY: 85,
            head: [["Produit", "Qté", "Prix", "Total"]],
            body: produits.map((p) => [
                p.nom,
                p.quantite,
                `${p.prix_unitaire} FCFA`,
                `${p.quantite * p.prix_unitaire} FCFA`,
            ]),
        });

        const finalY = (doc as any).lastAutoTable.finalY + 10;

        // TOTAL
        doc.setFontSize(13);
        doc.text(
            `TOTAL: ${commande.total.toLocaleString()} FCFA`,
            10,
            finalY
        );

        // FOOTER
        doc.setFontSize(10);
        doc.text("Merci pour votre confiance ", 10, finalY + 15);

        doc.save(`facture-${commande.reference}.pdf`);
    };

    // =========================
    // 🧾 TICKET IMPRIMABLE
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
                <h2>BON DE COMMANDE</h2>
                <p>Ref: ${commande.reference}</p>
                <p>Client: ${commande.nom_client}</p>
                <p>Tel: ${commande.telephone}</p>
                <p>Total: ${commande.total} FCFA</p>
                <p>Mode: ${commande.mode_commande}</p>
                <hr />
                <p style="text-align:center;">Merci </p>
            </body>
            </html>
        `);

        win?.document.close();
        win?.print();
    };

    // =========================
    // 📲 WHATSAPP SMART
    // =========================
    const sendWhatsApp = () => {
        const phone = commande.telephone.replace(/\D/g, "");

        const isLivraison = commande.mode_commande === "livraison";

        const message = isLivraison
            ? `Bonjour ${commande.nom_client},

            Votre commande est en livraison 
            Réf: ${commande.reference}
            Adresse: ${commande.addresse}
            Total: ${commande.total.toLocaleString()} FCFA

            Merci pour votre confiance `
            : `Bonjour ${commande.nom_client},

            Votre commande est confirmée 
            Réf: ${commande.reference}
            Adresse: ${commande.addresse}
            Total: ${commande.total.toLocaleString()} FCFA

            Merci pour votre confiance `;

        window.open(
            `https://wa.me/${phone}?text=${encodeURIComponent(message)}`,
            "_blank"
        );
    };

    return (
        <>
            {/* BUTTON */}
            <button
                onClick={async () => {
                    setOpen(true);
                    await fetchDetails(); // 🔥 charge produits dès ouverture
                }}
                className="text-blue-500 hover:text-blue-700"
            >
                <BsEye size={18} />
            </button>

            {/* MODAL */}
            {open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={() => setOpen(false)}
                    />

                    <div className="relative bg-white text-black w-full max-w-md p-6 rounded-lg m-3">

                        {/* HEADER */}
                        <div className="flex justify-between mb-4">
                            <h2 className="font-bold">Détails commande</h2>
                            <button onClick={() => setOpen(false)}>
                                <X />
                            </button>
                        </div>

                        {/* INFOS */}
                        <div className="text-sm space-y-1">
                            <p><b>Réf:</b> {commande.reference}</p>
                            <p><b>Client:</b> {commande.nom_client}</p>
                            <p><b>Tél:</b> {commande.telephone}</p>
                            <p><b>Adresse:</b> {commande.addresse}</p>
                            <p><b>Total:</b> {commande.total}</p>
                            <p><b>Mode:</b> {commande.mode_commande}</p>
                            <p><b>Statut:</b> {commande.status}</p>

                            {commande.mode_commande === "livraison" && commande.gps && (
                                <a
                                    href={commande.gps}
                                    target="_blank"
                                    className="text-blue-600 underline"
                                >
                                    🚚 Voir la lovalisation (GPS)
                                </a>
                            )}
                        </div>

                        {/* PRODUITS */}
                        <div className="mt-4">
                            <h3 className="font-bold mb-2">Produits commandés</h3>

                            {loading ? (
                                <p>Chargement...</p>
                            ) : (
                                <ul className="text-sm space-y-1">
                                    {produits.map((p, i) => (
                                        <li key={i}>
                                            {p.nom} × {p.quantite} — {p.prix_unitaire} FCFA
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

                        </div>
                    </div>
                </div>
            )}
        </>
    );
}