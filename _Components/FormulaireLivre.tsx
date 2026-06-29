"use client";

import { useState } from "react";
import { MapPin } from "lucide-react";
import { toast } from "sonner";

import { CartItem } from "../lib/cart";

type Props = {
  type: "commander" | "livre";
  cart: CartItem[];
  total: number;
};

export default function FormulaireLivre({
  type,
  cart,
  total,
}: Props) {
  const [location, setLocation] = useState("");

  const [nom, setNom] = useState("");
  const [telephone, setTelephone] = useState("");
  const [addresse, setAddresse] = useState("");
  const [paiement, setPaiement] = useState("Orange Money");

  // =========================
  // 📍 GPS
  // =========================
  const getLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Votre navigateur ne supporte pas la géolocalisation.");
      return;
    }

    const loading = toast.loading("Récupération de votre position...");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        toast.dismiss(loading);

        const { latitude, longitude } = position.coords;

        setLocation(
          `https://maps.google.com/?q=${latitude},${longitude}`
        );

        toast.success("Localisation récupérée avec succès.");
      },
      (error) => {
        toast.dismiss(loading);

        switch (error.code) {
          case error.PERMISSION_DENIED:
            toast.error(
              "Vous avez refusé l'accès à votre localisation. Autorisez-la dans les paramètres du navigateur."
            );
            break;

          case error.POSITION_UNAVAILABLE:
            toast.error(
              "Votre position est actuellement indisponible. Vérifiez que le GPS est activé."
            );
            break;

          case error.TIMEOUT:
            toast.error(
              "Le délai de récupération de la position est dépassé. Réessayez."
            );
            break;

          default:
            toast.error(error.message);
        }

        console.error(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 0,
      }
    );
  };
  // =========================
  // 🛒 Submit
  // =========================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nom || !telephone || !addresse) {
      toast.error("Tous les champs sont requis");
      return;
    }

    if (type === "livre" && !location) {
      toast.error(
        "La localisation GPS est obligatoire pour une livraison."
      );
      return;
    }

    if (!cart || cart.length === 0) {
      toast.error("Panier vide");
      return;
    }

    const loading = toast.loading(
      "Envoi de la commande..."
    );

    try {
      const data = {
        nom_client: nom,
        telephone,
        addresse,
        gps: location,
        mode_commande:
          type === "livre"
            ? "livraison"
            : "commande",
        paiement,
        total,
        produits: cart.map((item) => ({
          produit_id: item.id,
          quantite: item.quantity,
        })),
      };

      const res = await fetch("/api/commandes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      toast.dismiss(loading);

      if (!res.ok) {
        toast.error(
          result.message ||
          "Erreur lors de la commande"
        );
        return;
      }

      toast.success(
        "Commande envoyée avec succès"
      );

      localStorage.removeItem("cart");

      setTimeout(() => {
        window.location.reload();
      }, 1000);

    } catch (error) {
      toast.dismiss(loading);
      toast.error("Erreur serveur");
      console.error(error);
    }
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="space-y-4 text-black"
      >
        <h1 className="text-xl font-bold text-center">
          {type === "livre"
            ? "Formulaire de livraison"
            : "Formulaire de commande"}
        </h1>

        {/* NOM */}
        <input
          value={nom}
          onChange={(e) =>
            setNom(e.target.value)
          }
          className="w-full border rounded-lg p-3 text-sm"
          placeholder="Nom complet"
          required
        />

        {/* TEL */}
        <input
          value={telephone}
          onChange={(e) =>
            setTelephone(e.target.value)
          }
          className="w-full border rounded-lg p-3 text-sm"
          placeholder="Téléphone"
          required
        />

        {/* ADRESSE */}
        <input
          value={addresse}
          onChange={(e) =>
            setAddresse(e.target.value)
          }
          className="w-full border rounded-lg p-3 text-sm"
          placeholder="Adresse"
          required
        />

        {/* PAIEMENT */}
        <select
          value={paiement}
          onChange={(e) =>
            setPaiement(e.target.value)
          }
          className="w-full border rounded-lg p-3 text-sm"
        >
          <option>Orange Money</option>
          <option>Moov Money</option>
          <option>
            Paiement à la livraison
          </option>
        </select>

        {/* GPS obligatoire pour livraison */}
        {type === "livre" && (
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Localisation GPS *
            </label>

            <div className="flex flex-col sm:flex-row gap-2">
              <input
                value={location}
                readOnly
                placeholder="Cliquez sur GPS pour récupérer votre position"
                className="flex-1 border rounded-lg p-3 text-sm"
              />

              <button
                type="button"
                onClick={getLocation}
                className="bg-green-700 hover:bg-green-600 text-white px-4 py-3 rounded-lg flex items-center justify-center gap-2"
              >
                <MapPin size={18} />
                GPS
              </button>
            </div>

            <p className="text-xs text-red-500">
              La localisation GPS est obligatoire
              pour la livraison.
            </p>
          </div>
        )}

        {/* TOTAL */}
        <div className="text-right font-bold">
          Total : {total} FCFA
        </div>

        {/* BOUTON */}
        <button
          type="submit"
          disabled={
            type === "livre" && !location
          }
          className="w-full bg-black text-white py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {type === "livre"
            ? "Confirmer la livraison"
            : "Confirmer la commande"}
        </button>
      </form>
    </div>
  );
}