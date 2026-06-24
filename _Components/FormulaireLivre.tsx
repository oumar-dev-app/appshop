"use client";
import { useState } from "react";
import { MapPin } from "lucide-react";

import { CartItem } from "@/lib/cart";

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
      alert("Géolocalisation non supportée");
      return;
    }

    navigator.geolocation.getCurrentPosition((pos) => {

      const { latitude, longitude } = pos.coords;

      setLocation(
        `https://maps.google.com/?q=${latitude},${longitude}`
      );
    });
  };

  // =========================
  // 🛒 Submit
  // =========================
  const handleSubmit = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    try {

      const token =
        localStorage.getItem("token");

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

      const res = await fetch(
        "/api/commandes",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify(data),
        }
      );

      const result = await res.json();

      if (!res.ok) {
        alert(result.message);
        return;
      }

      alert("Commande créée avec succès");

      // 🧹 vider panier
      localStorage.removeItem("cart");

      window.location.reload();

    } catch (error) {

      console.log(error);

      alert("Erreur serveur");
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
          <option>
            Orange Money
          </option>

          <option>
            Moov Money
          </option>

          <option>
            Paiement à la livraison
          </option>
        </select>

        {/* GPS */}
        {type === "livre" && (
          <div className="space-y-2">

            <label className="text-sm font-medium">
              Localisation GPS
            </label>

            <div className="flex flex-col sm:flex-row gap-2">

              <input
                value={location}
                readOnly
                placeholder="Cliquez sur GPS"
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

          </div>
        )}

        {/* TOTAL */}
        <div className="text-right font-bold">
          Total : {total} FCFA
        </div>

        {/* BTN */}
        <button
          type="submit"
          className="w-full bg-black text-white py-3 rounded-lg"
        >
          {type === "livre"
            ? "Confirmer la livraison"
            : "Confirmer la commande"}

        </button>

      </form>

    </div>
  );
}

