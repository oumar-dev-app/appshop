"use client";

import { useState } from "react";
import {
  Check,
  Loader2,
  MapPin,
  Phone,
  User,
  MapPinned,
  CreditCard,
  Store,
} from "lucide-react";

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
  const isLivraison = type === "livre";

  const [location, setLocation] = useState("");
  const [nom, setNom] = useState("");
  const [telephone, setTelephone] = useState("");
  const [addresse, setAddresse] = useState("");
  const [paiement, setPaiement] = useState("Orange Money");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // =========================
  // 📍 GPS
  // =========================
  const getLocation = () => {
    setError("");

    if (!navigator.geolocation) {
      setError(
        "La géolocalisation n'est pas disponible sur cet appareil."
      );
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;

        setLocation(
          `https://maps.google.com/?q=${latitude},${longitude}`
        );
      },
      () => {
        setError(
          "Impossible d'obtenir votre position. Vérifiez les autorisations GPS."
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  // =========================
  // 🛒 Submit
  // =========================
  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (cart.length === 0) {
      setError("Votre panier est vide.");
      return;
    }

    if (isLivraison && !addresse.trim()) {
      setError(
        "Veuillez renseigner votre adresse de livraison."
      );
      return;
    }

    if (isLivraison && !location) {
      setError(
        "Veuillez renseigner votre localisation GPS."
      );
      return;
    }

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");

      if (!token || token.trim() === "") {
        setError(
          "Vous devez être connecté pour passer une commande."
        );
        setLoading(false);
        return;
      }

      const data = {
        nom_client: nom.trim(),
        telephone: telephone.trim(),

        // Pour un retrait boutique, aucune adresse
        // de livraison n'est nécessaire.
        addresse: isLivraison
          ? addresse.trim()
          : "",

        gps: isLivraison ? location : "",

        mode_commande: isLivraison
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
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        }
      );

      const result = await res.json();

      if (!res.ok) {
        setError(
          result.message ||
          "Impossible de créer la commande."
        );
        setLoading(false);
        return;
      }

      setSuccess(true);

      localStorage.removeItem("cart");

      window.dispatchEvent(
        new Event("cartUpdated")
      );

      setTimeout(() => {
        window.location.reload();
      }, 1800);
    } catch (err) {
      console.error(
        "Erreur création commande :",
        err
      );

      setError(
        "Une erreur est survenue. Veuillez réessayer."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // ✅ SUCCÈS
  // =========================
  if (success) {
    return (
      <div className="flex min-h-[420px] flex-col items-center justify-center px-4 py-10 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#f2e5e1]">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#a66a4c]">
            <Check
              size={25}
              strokeWidth={2.2}
              className="!text-white"
            />
          </div>
        </div>

        <p className="mt-6 text-[10px] font-semibold uppercase tracking-[0.28em] !text-[#a66a4c]">
          Mini Luxe Parfum
        </p>

        <h2 className="mt-2 font-[family-name:var(--font-playfair)] text-3xl font-semibold !text-[#5a4740]">
          Commande confirmée
        </h2>

        <p className="mt-3 max-w-sm text-sm leading-6 !text-[#6f625d]">
          Merci pour votre confiance. Votre commande
          a bien été enregistrée.
        </p>

        <div className="mt-6 rounded-full border border-[#eadfd8] bg-[#f7f0e9] px-5 py-2 text-xs font-medium !text-[#a66a4c]">
          {isLivraison
            ? "Votre commande sera préparée pour livraison."
            : "Votre commande sera préparée pour retrait à la boutique."}
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      {/* MODE */}
      <div className="rounded-2xl border border-[#eadfd8] bg-[#f7f0e9] p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white">
            {isLivraison ? (
              <MapPin
                size={19}
                strokeWidth={1.6}
                className="!text-[#a66a4c]"
              />
            ) : (
              <Store
                size={19}
                strokeWidth={1.6}
                className="!text-[#a66a4c]"
              />
            )}
          </div>

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] !text-[#a66a4c]">
              Mode de réception
            </p>

            <h3 className="mt-1 font-[family-name:var(--font-playfair)] text-xl font-semibold !text-[#5a4740]">
              {isLivraison
                ? "Livraison à domicile"
                : "Retrait à la boutique"}
            </h3>

            <p className="mt-1 text-xs leading-5 !text-[#8b7d77]">
              {isLivraison
                ? "Votre parfum sera livré à l'adresse indiquée."
                : "Vous récupérerez votre commande directement à la boutique."}
            </p>
          </div>
        </div>
      </div>

      {/* INTRODUCTION */}
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.25em] !text-[#a66a4c]">
          {isLivraison
            ? "Informations de livraison"
            : "Informations de retrait"}
        </p>

        <h3 className="mt-1 font-[family-name:var(--font-playfair)] text-2xl font-semibold !text-[#5a4740]">
          Vos informations
        </h3>

        <p className="mt-2 text-xs leading-5 !text-[#8b7d77]">
          Renseignez vos coordonnées afin que nous
          puissions traiter votre commande.
        </p>
      </div>

      {/* ERREUR */}
      {error && (
        <div
          role="alert"
          className="rounded-xl border border-[#e4c8c2] bg-[#fdf1ef] px-4 py-3 text-xs leading-5 !text-[#a94b4b]"
        >
          {error}
        </div>
      )}

      {/* NOM */}
      <div>
        <label
          htmlFor="nom-client"
          className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.16em] !text-[#6f625d]"
        >
          Nom complet
        </label>

        <div className="relative">
          <User
            size={17}
            strokeWidth={1.6}
            className="absolute left-4 top-1/2 -translate-y-1/2 !text-[#a66a4c]"
          />

          <input
            id="nom-client"
            type="text"
            value={nom}
            onChange={(e) =>
              setNom(e.target.value)
            }
            placeholder="Votre nom complet"
            autoComplete="name"
            required
            disabled={loading}
            className="h-12 w-full rounded-xl border border-[#eadfd8] bg-white pl-11 pr-4 text-sm !text-[#5a4740] outline-none transition-all placeholder:!text-[#b4a8a2] focus:border-[#a66a4c] focus:ring-2 focus:ring-[#a66a4c]/10 disabled:cursor-not-allowed disabled:opacity-60"
          />
        </div>
      </div>

      {/* TELEPHONE */}
      <div>
        <label
          htmlFor="telephone"
          className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.16em] !text-[#6f625d]"
        >
          Téléphone
        </label>

        <div className="relative">
          <Phone
            size={17}
            strokeWidth={1.6}
            className="absolute left-4 top-1/2 -translate-y-1/2 !text-[#a66a4c]"
          />

          <input
            id="telephone"
            type="tel"
            value={telephone}
            onChange={(e) =>
              setTelephone(e.target.value)
            }
            placeholder="Ex. 70 00 00 00"
            autoComplete="tel"
            required
            disabled={loading}
            className="h-12 w-full rounded-xl border border-[#eadfd8] bg-white pl-11 pr-4 text-sm !text-[#5a4740] outline-none transition-all placeholder:!text-[#b4a8a2] focus:border-[#a66a4c] focus:ring-2 focus:ring-[#a66a4c]/10 disabled:cursor-not-allowed disabled:opacity-60"
          />
        </div>
      </div>

      {/* ADRESSE UNIQUEMENT LIVRAISON */}
      {isLivraison && (
        <div>
          <label
            htmlFor="adresse"
            className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.16em] !text-[#6f625d]"
          >
            Adresse de livraison
          </label>

          <div className="relative">
            <MapPinned
              size={17}
              strokeWidth={1.6}
              className="absolute left-4 top-4 !text-[#a66a4c]"
            />

            <textarea
              id="adresse"
              value={addresse}
              onChange={(e) =>
                setAddresse(e.target.value)
              }
              placeholder="Quartier, rue, repère..."
              autoComplete="street-address"
              required
              disabled={loading}
              rows={3}
              className="w-full resize-none rounded-xl border border-[#eadfd8] bg-white py-3 pl-11 pr-4 text-sm !text-[#5a4740] outline-none transition-all placeholder:!text-[#b4a8a2] focus:border-[#a66a4c] focus:ring-2 focus:ring-[#a66a4c]/10 disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>
        </div>
      )}

      {/* PAIEMENT */}
      <div>
        <label
          htmlFor="paiement"
          className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.16em] !text-[#6f625d]"
        >
          Mode de paiement
        </label>

        <div className="relative">
          <CreditCard
            size={17}
            strokeWidth={1.6}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 !text-[#a66a4c]"
          />

          <select
            id="paiement"
            value={paiement}
            onChange={(e) =>
              setPaiement(e.target.value)
            }
            disabled={loading}
            className="h-12 w-full appearance-none rounded-xl border border-[#eadfd8] bg-white pl-11 pr-4 text-sm !text-[#5a4740] outline-none transition-all focus:border-[#a66a4c] focus:ring-2 focus:ring-[#a66a4c]/10 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <option value="Orange Money">
              Orange Money
            </option>

            <option value="Moov Money">
              Moov Money
            </option>

            <option value="Paiement à la livraison">
              Paiement à la livraison
            </option>
          </select>
        </div>
      </div>

      {/* GPS UNIQUEMENT LIVRAISON */}
      {isLivraison && (
        <div className="rounded-2xl border border-[#eadfd8] bg-[#f7f0e9] p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white">
              <MapPin
                size={17}
                strokeWidth={1.6}
                className="!text-[#a66a4c]"
              />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold !text-[#5a4740]">
                Localisation GPS
              </p>

              <p className="mt-1 text-[10px] leading-4 !text-[#8b7d77]">
                Partagez votre position pour faciliter
                la livraison.
              </p>

              <button
                type="button"
                onClick={getLocation}
                disabled={loading}
                className="mt-3 inline-flex min-h-10 items-center justify-center gap-2 rounded-full bg-[#a66a4c] px-5 text-xs font-semibold !text-white transition-all duration-300 hover:bg-[#7d4d38] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <MapPin size={15} />

                {location
                  ? "Position enregistrée"
                  : "Partager ma position"}
              </button>

              {location && (
                <p className="mt-2 flex items-center gap-1.5 text-[10px] !text-[#547a5b]">
                  <Check size={12} />
                  Position GPS enregistrée
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* RETRAIT BOUTIQUE */}
      {!isLivraison && (
        <div className="flex items-start gap-3 rounded-2xl border border-[#eadfd8] bg-white p-4">
          <Store
            size={18}
            strokeWidth={1.6}
            className="mt-0.5 shrink-0 !text-[#a66a4c]"
          />

          <div>
            <p className="text-xs font-semibold !text-[#5a4740]">
              Retrait à la boutique
            </p>

            <p className="mt-1 text-[10px] leading-5 !text-[#8b7d77]">
              Votre commande sera préparée et vous
              pourrez la récupérer directement à la
              boutique.
            </p>
          </div>
        </div>
      )}

      {/* RÉCAPITULATIF */}
      <div className="rounded-2xl border border-[#eadfd8] bg-white p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-[9px] font-semibold uppercase tracking-[0.2em] !text-[#8b7d77]">
              Récapitulatif
            </p>

            <p className="mt-1 text-sm !text-[#6f625d]">
              {cart.length} produit
              {cart.length > 1 ? "s" : ""}
            </p>
          </div>

          <div className="text-right">
            <p className="text-[9px] uppercase tracking-[0.16em] !text-[#8b7d77]">
              Total
            </p>

            <p className="mt-1 text-lg font-semibold !text-[#a66a4c]">
              {total.toLocaleString("fr-FR")} FCFA
            </p>
          </div>
        </div>

        <div className="mt-4 space-y-2 border-t border-[#eadfd8] pt-4">
          {cart.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between gap-3 text-xs"
            >
              <span className="min-w-0 truncate !text-[#6f625d]">
                {item.nom} × {item.quantity}
              </span>

              <span className="shrink-0 font-medium !text-[#5a4740]">
                {(item.prix * item.quantity).toLocaleString(
                  "fr-FR"
                )}{" "}
                FCFA
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* CONFIRMATION */}
      <button
        type="submit"
        disabled={loading}
        className="flex min-h-13 w-full items-center justify-center gap-2 rounded-full bg-[#a66a4c] px-6 text-sm font-semibold !text-white shadow-[0_10px_25px_rgba(125,77,56,0.14)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#7d4d38] hover:shadow-[0_14px_30px_rgba(125,77,56,0.2)] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
      >
        {loading ? (
          <>
            <Loader2
              size={17}
              className="animate-spin"
            />
            Traitement en cours...
          </>
        ) : (
          <>
            {isLivraison
              ? "Confirmer la livraison"
              : "Confirmer le retrait"}
          </>
        )}
      </button>

      <p className="text-center text-[10px] leading-5 !text-[#8b7d77]">
        En confirmant, vous validez les informations
        renseignées pour votre commande.
      </p>
    </form>
  );
}