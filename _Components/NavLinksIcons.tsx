"use client";

import {
  Search,
  User,
  ShoppingBag,
  X,
  Loader2,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import Rechercher from "./Rechercher";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import FormulaireRegister from "./FormulaireRegister";
import Link from "next/link";
import { createPortal } from "react-dom";

const NavLinksIcons = () => {
  const [modal, setModal] = useState<
    "search" | "login" | "register" | null
  >(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const router = useRouter();

  useEffect(() => {
    if (modal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [modal]);

  useEffect(() => {
    const updateCart = () => {
      try {
        const cart = JSON.parse(
          localStorage.getItem("cart") || "[]"
        );

        const total = cart.reduce(
          (sum: number, item: { quantity?: number }) =>
            sum + (item.quantity || 0),
          0
        );

        setCartCount(total);
      } catch {
        setCartCount(0);
      }
    };

    updateCart();

    window.addEventListener("cartUpdated", updateCart);

    return () => {
      window.removeEventListener("cartUpdated", updateCart);
    };
  }, []);

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setIsLoading(true);

    const loading = toast.loading("Connexion en cours...");

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      localStorage.setItem("token", data.token);

      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      toast.dismiss(loading);

      toast.success(
        data.message || "Connexion réussie"
      );

      setModal(null);

      setEmail("");
      setPassword("");

      if (data.user.role === "admin") {
        router.push("/dashboard");
      } else {
        router.push("/");
      }
    } catch (error: any) {
      console.error(error);

      toast.dismiss(loading);

      toast.error(
        error.message || "Erreur de connexion"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* ACTIONS DU HEADER */}
      <div className="flex items-center gap-1 sm:gap-2">
        {/* RECHERCHE */}
        <button
          type="button"
          aria-label="Rechercher"
          onClick={() => setModal("search")}
          className="
            group
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-full
            text-[#6f625d]
            transition-all
            duration-300
            hover:bg-[#f2e5e1]
            hover:text-[#a66a4c]
          "
        >
          <Search
            size={19}
            strokeWidth={1.7}
          />
        </button>

        {/* PANIER */}
        <Link
          href="/panier"
          aria-label="Panier"
          className="
            group
            relative
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-full
            text-[#6f625d]
            transition-all
            duration-300
            hover:bg-[#f2e5e1]
            hover:text-[#a66a4c]
          "
        >
          <ShoppingBag
            size={19}
            strokeWidth={1.7}
          />

          {cartCount > 0 && (
            <span
              className="
                absolute
                right-0
                top-0
                flex
                h-4.5
                min-w-4.5
                items-center
                justify-center
                rounded-full
                bg-[#a66a4c]
                px-1
                text-[10px]
                font-semibold
                text-white
              "
            >
              {cartCount > 99 ? "99+" : cartCount}
            </span>
          )}
        </Link>

        {/* COMPTE */}
        <button
          type="button"
          aria-label="Mon compte"
          onClick={() => setModal("login")}
          className="
            group
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-full
            text-[#6f625d]
            transition-all
            duration-300
            hover:bg-[#f2e5e1]
            hover:text-[#a66a4c]
          "
        >
          <User
            size={19}
            strokeWidth={1.7}
          />
        </button>
      </div>

 
      {/* MODALES */}
      {modal &&
        createPortal(
          <div
            onClick={() => setModal(null)}
            className="
              fixed
              inset-0
              z-9999
              flex
              items-start
              justify-center
              overflow-y-auto
              p-4
              pt-6
              sm:items-center
              sm:pt-4
            "
          >
          {/* BACKDROP */}
          <div
            className="
              absolute
              inset-0
              bg-[#2b211f]/60
              backdrop-blur-sm
            "
          />

          {/* RECHERCHE */}
          {modal === "search" && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="
                relative
                my-auto
                w-[calc(100%-0.5rem)]
                max-w-lg
                max-h-[calc(100vh-3rem)]
                overflow-y-auto
                rounded-2xl
                border
                border-[#eadfd8]
                bg-[#fdfaf7]
                p-4
                shadow-[0_25px_80px_rgba(43,33,31,0.2)]
                sm:w-full
                sm:p-6
              "
            >
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#a66a4c]">
                    Mini Luxe Parfum
                  </p>

                  <h2 className="mt-1 font-serif text-2xl text-[#2b211f]">
                    Rechercher
                  </h2>
                </div>

                <button
                  type="button"
                  aria-label="Fermer"
                  onClick={() => setModal(null)}
                  className="
                    flex
                    h-9
                    w-9
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    text-[#6f625d]
                    transition
                    hover:bg-[#f2e5e1]
                    hover:text-[#a66a4c]
                  "
                >
                  <X size={19} />
                </button>
              </div>

              <Rechercher
                onClose={() => setModal(null)}
              />
            </div>
          )}

          {/* LOGIN */}
          {modal === "login" && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="
                relative
                my-auto
                w-[calc(100%-0.5rem)]
                max-w-md
                max-h-[calc(100vh-3rem)]
                overflow-y-auto
                rounded-2xl
                border
                border-[#eadfd8]
                bg-[#fdfaf7]
                p-4
                shadow-[0_25px_80px_rgba(43,33,31,0.2)]
                sm:w-full
                sm:p-6
              "
            >
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#a66a4c]">
                    Votre espace
                  </p>

                  <h2 className="mt-1 font-serif text-2xl text-[#2b211f]">
                    Connexion
                  </h2>
                </div>

                <button
                  type="button"
                  aria-label="Fermer"
                  onClick={() => setModal(null)}
                  className="
                    flex
                    h-9
                    w-9
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    text-[#6f625d]
                    transition
                    hover:bg-[#f2e5e1]
                    hover:text-[#a66a4c]
                  "
                >
                  <X size={19} />
                </button>
              </div>

              <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-4"
              >
                <div>
                  <label
                    htmlFor="login-email"
                    className="mb-1.5 block text-xs font-medium text-[#6f625d]"
                  >
                    Adresse e-mail
                  </label>

                  <input
                    id="login-email"
                    type="email"
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    required
                    autoComplete="email"
                    className="
                      min-h-12
                      w-full
                      rounded-xl
                      border
                      border-[#eadfd8]
                      bg-white
                      px-4
                      py-3
                      text-base
                      text-[#2b211f]
                      outline-none
                      transition
                      placeholder:text-[#aaa09b]
                      focus:border-[#a66a4c]
                      focus:ring-2
                      focus:ring-[#a66a4c]/10
                      sm:text-sm
                    "
                    placeholder="votre@email.com"
                  />
                </div>

                <div>
                  <label
                    htmlFor="login-password"
                    className="mb-1.5 block text-xs font-medium text-[#6f625d]"
                  >
                    Mot de passe
                  </label>

                  <input
                    id="login-password"
                    type="password"
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    required
                    autoComplete="current-password"
                    className="
                      min-h-12
                      w-full
                      rounded-xl
                      border
                      border-[#eadfd8]
                      bg-white
                      px-4
                      py-3
                      text-base
                      text-[#2b211f]
                      outline-none
                      transition
                      placeholder:text-[#aaa09b]
                      focus:border-[#a66a4c]
                      focus:ring-2
                      focus:ring-[#a66a4c]/10
                      sm:text-sm
                    "
                    placeholder="Votre mot de passe"
                  />
                </div>

                <div className="flex justify-end">
                  <Link
                    href="/mot-de-passe-oublie"
                    className="
                      text-sm
                      font-medium
                      text-[#a66a4c]
                      transition
                      hover:text-[#7d4d38]
                      hover:underline
                      underline-offset-4
                    "
                  >
                    Mot de passe oublié ?
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="
                    mt-2
                    flex
                    min-h-12
                    w-full
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    bg-[#a66a4c]
                    px-4
                    py-3
                    text-sm
                    font-semibold
                    text-white
                    transition
                    duration-300
                    hover:bg-[#7d4d38]
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                  "
                >
                  {isLoading && (
                    <Loader2
                      size={17}
                      className="animate-spin"
                    />
                  )}

                  {isLoading
                    ? "Connexion..."
                    : "Se connecter"}
                </button>

                <p className="pt-2 text-center text-sm leading-6 text-[#6f625d]">
                  Vous n'avez pas encore de compte ?

                  <button
                    type="button"
                    onClick={() =>
                      setModal("register")
                    }
                    className="
                      ml-1
                      font-medium
                      text-[#a66a4c]
                      underline-offset-4
                      hover:underline
                    "
                  >
                    Créer un compte
                  </button>
                </p>
              </form>
            </div>
          )}

          {/* REGISTER */}
          {modal === "register" && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="
                relative
                my-auto
                w-[calc(100%-0.5rem)]
                max-w-md
                max-h-[calc(100vh-3rem)]
                overflow-y-auto
                rounded-2xl
                border
                border-[#eadfd8]
                bg-[#fdfaf7]
                p-4
                shadow-[0_25px_80px_rgba(43,33,31,0.2)]
                sm:w-full
                sm:p-6
              "
            >
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#a66a4c]">
                    Bienvenue
                  </p>

                  <h2 className="mt-1 font-serif text-2xl text-[#2b211f]">
                    Créer un compte
                  </h2>
                </div>

                <button
                  type="button"
                  aria-label="Fermer"
                  onClick={() => setModal(null)}
                  className="
                    flex
                    h-9
                    w-9
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    text-[#6f625d]
                    transition
                    hover:bg-[#f2e5e1]
                    hover:text-[#a66a4c]
                  "
                >
                  <X size={19} />
                </button>
              </div>

              <FormulaireRegister
                onSuccess={() => setModal(null)}
                onLogin={() => setModal("login")}
              />
            </div>
          )}
          </div>,
          document.body
        )}
    </>
  );
};

export default NavLinksIcons;