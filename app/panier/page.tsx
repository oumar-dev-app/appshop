"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  Truck,
  X,
} from "lucide-react";
import {
  CartItem,
  getCart,
  removeFromCart,
} from "@/lib/cart";
import FormulaireLivre from "@/_Components/FormulaireLivre";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function PanierPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [modal, setModal] = useState<
    "commander" | "livre" | null
  >(null);

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
      setCart(getCart());
    };

    updateCart();

    window.addEventListener(
      "cartUpdated",
      updateCart
    );

    return () => {
      window.removeEventListener(
        "cartUpdated",
        updateCart
      );
    };
  }, []);

  const handleRemove = (id: number) => {
    removeFromCart(id);

    setCart((prev) =>
      prev.filter((item) => item.id !== id)
    );
  };

  const updateQuantity = (
    id: number,
    quantity: number
  ) => {
    if (quantity < 1) return;

    const currentCart = getCart();

    const updatedCart = currentCart.map((item) =>
      item.id === id
        ? {
            ...item,
            quantity,
          }
        : item
    );

    localStorage.setItem(
      "cart",
      JSON.stringify(updatedCart)
    );

    window.dispatchEvent(
      new Event("cartUpdated")
    );

    setCart(updatedCart);
  };

  const total = useMemo(() => {
    return cart.reduce(
      (acc, item) =>
        acc + item.prix * item.quantity,
      0
    );
  }, [cart]);

  const totalItems = useMemo(() => {
    return cart.reduce(
      (acc, item) => acc + item.quantity,
      0
    );
  }, [cart]);

  return (
    <main className="min-h-screen bg-[#fdfaf7]">
      {/* HEADER */}
      <section className="border-b border-[#eadfd8] bg-[#f7f0e9]">
        <div className="mx-auto max-w-7xl px-5 py-10 sm:px-6 sm:py-14 lg:px-8">
          <button
            type="button"
            onClick={() => router.back()}
            className="group mb-7 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] !text-[#6f625d] transition-colors duration-300 hover:!text-[#a66a4c]"
          >
            <ArrowLeft
              size={15}
              className="transition-transform duration-300 group-hover:-translate-x-1"
            />
            Retour
          </button>

          <p className="text-xs font-semibold uppercase tracking-[0.3em] !text-[#a66a4c]">
            Mini Luxe Parfum
          </p>

          <h1 className="mt-2 font-[family-name:var(--font-playfair)] text-4xl font-semibold !text-[#5a4740] sm:text-5xl">
            Mon panier
          </h1>

          <p className="mt-3 text-sm !text-[#6f625d]">
            {totalItems > 0
              ? `${totalItems} article${
                  totalItems > 1 ? "s" : ""
                } dans votre sélection`
              : "Votre sélection vous attend"}
          </p>
        </div>
      </section>

      {/* PANIER VIDE */}
      {cart.length === 0 ? (
        <section className="mx-auto flex min-h-[50vh] max-w-7xl items-center justify-center px-5 py-16 sm:px-6 lg:px-8">
          <div className="max-w-md text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#f7f0e9]">
              <ShoppingBag
                size={32}
                strokeWidth={1.3}
                className="!text-[#a66a4c]"
              />
            </div>

            <h2 className="mt-6 font-[family-name:var(--font-playfair)] text-2xl font-semibold !text-[#5a4740]">
              Votre panier est vide
            </h2>

            <p className="mt-3 text-sm leading-6 !text-[#8b7d77]">
              Découvrez notre sélection de parfums et
              ajoutez vos fragrances préférées à votre
              panier.
            </p>

            <button
              type="button"
              onClick={() => router.push("/boutique")}
              className="mt-7 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#a66a4c] px-7 text-sm font-semibold !text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#7d4d38] hover:shadow-[0_10px_25px_rgba(125,77,56,0.18)]"
            >
              Découvrir la boutique
              <ArrowRight size={16} />
            </button>
          </div>
        </section>
      ) : (
        <section className="mx-auto max-w-7xl px-5 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_380px] lg:items-start">
            {/* ARTICLES */}
            <div>
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] !text-[#a66a4c]">
                    Votre sélection
                  </p>

                  <h2 className="mt-1 font-[family-name:var(--font-playfair)] text-2xl font-semibold !text-[#5a4740]">
                    Vos parfums
                  </h2>
                </div>

                <span className="text-xs !text-[#8b7d77]">
                  {totalItems} article
                  {totalItems > 1 ? "s" : ""}
                </span>
              </div>

              <div className="space-y-4">
                {cart.map((item) => (
                  <article
                    key={item.id}
                    className="overflow-hidden rounded-2xl border border-[#eadfd8] bg-white shadow-[0_8px_30px_rgba(75,49,39,0.05)]"
                  >
                    <div className="flex gap-4 p-4 sm:gap-5 sm:p-5">
                      {/* IMAGE */}
                      <div className="relative h-28 w-24 shrink-0 overflow-hidden rounded-xl bg-[#f7f0e9] sm:h-36 sm:w-32">
                        <Image
                          src={
                            item.image_url ||
                            "/placeholder.png"
                          }
                          alt={item.nom}
                          fill
                          sizes="128px"
                          className="object-cover"
                        />
                      </div>

                      {/* INFOS */}
                      <div className="flex min-w-0 flex-1 flex-col">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <h3 className="truncate font-[family-name:var(--font-playfair)] text-lg font-semibold !text-[#5a4740] sm:text-xl">
                              {item.nom}
                            </h3>

                            <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.14em] !text-[#a66a4c]">
                              Mini Luxe Parfum
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              handleRemove(item.id)
                            }
                            aria-label={`Supprimer ${item.nom}`}
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#eadfd8] !text-[#a66a4c] transition-all duration-300 hover:border-[#d9b8b0] hover:bg-[#f2e5e1]"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>

                        <div className="mt-auto pt-4">
                          <div className="flex flex-wrap items-end justify-between gap-3">
                            <div>
                              <p className="text-[9px] uppercase tracking-[0.15em] !text-[#8b7d77]">
                                Prix unitaire
                              </p>

                              <p className="mt-0.5 text-sm font-semibold !text-[#a66a4c]">
                                {item.prix.toLocaleString(
                                  "fr-FR"
                                )}{" "}
                                FCFA
                              </p>
                            </div>

                            {/* QUANTITÉ */}
                            <div className="flex h-9 items-center rounded-full border border-[#eadfd8] bg-[#fdfaf7]">
                              <button
                                type="button"
                                onClick={() =>
                                  updateQuantity(
                                    item.id,
                                    item.quantity - 1
                                  )
                                }
                                disabled={
                                  item.quantity <= 1
                                }
                                aria-label="Diminuer la quantité"
                                className="flex h-8 w-8 items-center justify-center rounded-full !text-[#a66a4c] transition-colors hover:bg-[#f7f0e9] disabled:cursor-not-allowed disabled:opacity-35"
                              >
                                <Minus size={13} />
                              </button>

                              <span className="min-w-7 text-center text-xs font-semibold !text-[#5a4740]">
                                {item.quantity}
                              </span>

                              <button
                                type="button"
                                onClick={() =>
                                  updateQuantity(
                                    item.id,
                                    item.quantity + 1
                                  )
                                }
                                aria-label="Augmenter la quantité"
                                className="flex h-8 w-8 items-center justify-center rounded-full !text-[#a66a4c] transition-colors hover:bg-[#f7f0e9]"
                              >
                                <Plus size={13} />
                              </button>
                            </div>

                            <div className="text-right">
                              <p className="text-[9px] uppercase tracking-[0.15em] !text-[#8b7d77]">
                                Total
                              </p>

                              <p className="mt-0.5 text-sm font-semibold !text-[#5a4740]">
                                {(
                                  item.prix *
                                  item.quantity
                                ).toLocaleString(
                                  "fr-FR"
                                )}{" "}
                                FCFA
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            {/* RÉSUMÉ */}
            <aside className="lg:sticky lg:top-28">
              <div className="rounded-[24px] border border-[#eadfd8] bg-white p-6 shadow-[0_10px_35px_rgba(75,49,39,0.07)] sm:p-7">
                <p className="text-[10px] font-semibold uppercase tracking-[0.25em] !text-[#a66a4c]">
                  Récapitulatif
                </p>

                <h2 className="mt-2 font-[family-name:var(--font-playfair)] text-2xl font-semibold !text-[#5a4740]">
                  Votre commande
                </h2>

                <div className="my-6 h-px bg-[#eadfd8]" />

                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm !text-[#6f625d]">
                      Articles
                    </span>

                    <span className="text-sm font-medium !text-[#5a4740]">
                      {totalItems}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm !text-[#6f625d]">
                      Sous-total
                    </span>

                    <span className="text-sm font-medium !text-[#5a4740]">
                      {total.toLocaleString(
                        "fr-FR"
                      )}{" "}
                      FCFA
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm !text-[#6f625d]">
                      Livraison
                    </span>

                    <span className="text-xs font-medium !text-[#a66a4c]">
                      À confirmer
                    </span>
                  </div>
                </div>

                <div className="my-6 h-px bg-[#eadfd8]" />

                <div className="flex items-end justify-between gap-4">
                  <span className="text-sm font-semibold !text-[#5a4740]">
                    Total
                  </span>

                  <span className="text-2xl font-semibold !text-[#a66a4c]">
                    {total.toLocaleString(
                      "fr-FR"
                    )}{" "}
                    FCFA
                  </span>
                </div>

                {/* COMMANDER */}
                <button
                  type="button"
                  onClick={() =>
                    setModal("commander")
                  }
                  className="mt-7 flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#a66a4c] px-5 text-sm font-semibold !text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#7d4d38] hover:shadow-[0_12px_28px_rgba(125,77,56,0.2)]"
                >
                  <ShoppingBag size={17} />
                  Commander
                </button>

                {/* LIVRAISON */}
                <button
                  type="button"
                  onClick={() =>
                    setModal("livre")
                  }
                  className="mt-3 flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-[#a66a4c] bg-transparent px-5 text-sm font-semibold !text-[#a66a4c] transition-all duration-300 hover:bg-[#f7f0e9]"
                >
                  <Truck size={17} />
                  Organiser la livraison
                </button>

                <p className="mt-5 text-center text-[10px] leading-5 !text-[#8b7d77]">
                  Les informations de livraison seront
                  précisées lors de votre commande.
                </p>
              </div>

              {/* CONTINUER */}
              <Link
                href="/boutique"
                className="group mt-5 flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] !text-[#6f625d] transition-colors hover:!text-[#a66a4c]"
              >
                Continuer mes achats
                <ArrowRight
                  size={14}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
            </aside>
          </div>
        </section>
      )}

      {/* MODAL */}
      {modal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5">
          <div
            className="absolute inset-0 bg-[#2b211f]/65 backdrop-blur-md"
            onClick={() => setModal(null)}
          />

          <div
            onClick={(event) =>
              event.stopPropagation()
            }
            className="relative max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-[24px] border border-[#eadfd8] bg-[#fdfaf7] shadow-[0_25px_70px_rgba(43,33,31,0.25)]"
          >
            {/* MODAL HEADER */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#eadfd8] bg-[#fdfaf7]/95 px-5 py-4 backdrop-blur-md sm:px-6">
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.22em] !text-[#a66a4c]">
                  Mini Luxe Parfum
                </p>

                <h2 className="mt-1 font-[family-name:var(--font-playfair)] text-xl font-semibold !text-[#5a4740]">
                  {modal === "commander"
                    ? "Finaliser votre commande"
                    : "Organiser la livraison"}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setModal(null)}
                aria-label="Fermer"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[#eadfd8] !text-[#a66a4c] transition-colors hover:bg-[#f7f0e9]"
              >
                <X size={17} />
              </button>
            </div>

            {/* FORMULAIRE EXISTANT */}
            <div className="p-5 sm:p-6">
              <FormulaireLivre
                type={modal}
                cart={cart}
                total={total}
              />
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

