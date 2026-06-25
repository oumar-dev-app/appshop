"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { BsEye } from "react-icons/bs";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { toast } from "sonner";

/* ========================= */
const formatFCFA = (value: any) =>
  new Intl.NumberFormat("fr-FR").format(Number(value || 0)) + " FCFA";

/* ========================= */
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

const statusLabels: any = {
  en_attente: "En attente",
  confirmee: "Confirmée",
  en_preparation: "En préparation",
  expediee: "Expédiée",
  livree: "Livrée 🚚",
  recuperee: "Récupérée 🏪",
  annulee: "Annulée",
};

export default function VoirCommandeBtn({
  commande,
}: {
  commande: Commande;
}) {
  const [open, setOpen] = useState(false);
  const [produits, setProduits] = useState<Produit[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  const fetchDetails = async () => {
    try {
      setLoadingProducts(true);

      const token = localStorage.getItem("token");

      const res = await fetch(`/api/commandes/${commande.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      console.log("DEBUG PRODUITS API =>", data);

      setProduits(data?.produits ?? []);
    } catch (err) {
      console.error(err);
      toast.error("Erreur chargement produits");
      setProduits([]);
    } finally {
      setLoadingProducts(false);
    }
  };

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

          <div className="relative bg-white w-full max-w-md p-5 rounded-lg text-black m-3 max-h-[90vh] overflow-y-auto">

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

              <p>
                <b>Statut:</b>{" "}
                {statusLabels[commande.status] || commande.status}
              </p>
            </div>

            {/* PRODUITS */}
            <div className="mt-4">
              <h3 className="font-bold">Produits</h3>

              {loadingProducts ? (
                <p className="text-sm text-gray-500">
                  Chargement...
                </p>
              ) : produits.length === 0 ? (
                <p className="text-sm text-red-500">
                  Aucun produit trouvé
                </p>
              ) : (
                <ul className="text-sm list-disc pl-4">
                  {produits.map((p, i) => (
                    <li key={i}>
                      {p.nom} × {p.quantite}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}