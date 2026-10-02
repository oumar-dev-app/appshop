"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Heart,
  Minus,
  Plus,
  ShoppingBag,
} from "lucide-react";
import { addToCart } from "@/lib/cart";
import { toast } from "sonner";

type Produit = {
  id: number;
  nom: string;
  description: string;
  stock: number;
  prix: number;
  image_url?: string;
  jaime: number;
  category_id?: number;
};

export default function ConsulterProduit() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const router = useRouter();

  const [product, setProduct] = useState<Produit | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState<Produit[]>([]);
  const [imageError, setImageError] = useState(false);

  const handleAddToCart = () => {
    if (!product || product.stock <= 0) return;

    const loadingToast = toast.loading("Ajout au panier...");

    try {
      addToCart({
        id: product.id,
        nom: product.nom,
        prix: product.prix,
        image_url: product.image_url,
        quantity,
      });

      toast.dismiss(loadingToast);
      toast.success("Produit ajouté au panier");
    } catch {
      toast.dismiss(loadingToast);
      toast.error("Erreur lors de l'ajout au panier");
    }
  };

  const handleLike = async () => {
    if (!product) return;

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`/api/produits/${product.id}/like`, {
        method: "POST",
        headers: token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : {},
      });

      if (!res.ok) {
        toast.error("Impossible de modifier les favoris");
        return;
      }

      await res.json();

      setLiked((prev) => !prev);
      setLikes((prev) => (liked ? Math.max(0, prev - 1) : prev + 1));
    } catch (error) {
      console.error("Erreur favori :", error);
      toast.error("Une erreur est survenue");
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);

        const token = localStorage.getItem("token");

        const headers: HeadersInit = token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : {};

        const res = await fetch(`/api/produits/${id}`, {
          headers,
        });

        if (!res.ok) {
          setProduct(null);
          return;
        }

        const data = await res.json();
        const prod = data?.data || data?.product || data;

        setProduct(prod);
        setLikes(Number(prod?.jaime ?? 0));

        if (prod?.category_id) {
          const res2 = await fetch(
            `/api/category/${prod.category_id}/produits`,
            {
              headers,
            }
          );

          if (res2.ok) {
            const data2 = await res2.json();

            const products = Array.isArray(data2)
              ? data2
              : Array.isArray(data2?.data)
                ? data2.data
                : [];

            const filtered = products
              .filter((p: Produit) => p.id !== prod.id)
              .slice(0, 4);

            setRelatedProducts(filtered);
          }
        }
      } catch (error) {
        console.error("Erreur récupération produit :", error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-[70vh] bg-[#fdfaf7]">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 lg:px-8">
          <div className="grid animate-pulse grid-cols-1 gap-10 lg:grid-cols-2">
            <div className="aspect-square rounded-[28px] bg-[#f7f0e9]" />

            <div className="flex flex-col justify-center gap-5">
              <div className="h-3 w-32 rounded bg-[#f7f0e9]" />
              <div className="h-12 w-3/4 rounded bg-[#f7f0e9]" />
              <div className="h-5 w-full rounded bg-[#f7f0e9]" />
              <div className="h-5 w-5/6 rounded bg-[#f7f0e9]" />
              <div className="h-10 w-40 rounded bg-[#f7f0e9]" />
              <div className="h-14 w-full rounded-full bg-[#f7f0e9]" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-[#fdfaf7] px-5">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] !text-[#a66a4c]">
            Mini Luxe Parfum
          </p>

          <h1 className="mt-3 font-[family-name:var(--font-playfair)] text-3xl font-semibold !text-[#5a4740]">
            Parfum introuvable
          </h1>

          <p className="mt-3 text-sm text-[#8b7d77]">
            Le produit que vous recherchez n'est plus disponible.
          </p>

          <button
            type="button"
            onClick={() => router.back()}
            className="mt-7 inline-flex min-h-11 items-center gap-2 rounded-full bg-[#a66a4c] px-6 text-sm font-semibold !text-white transition-all duration-300 hover:bg-[#7d4d38]"
          >
            <ArrowLeft size={16} />
            Retour
          </button>
        </div>
      </main>
    );
  }

  const formattedPrice = product.prix.toLocaleString("fr-FR");

  return (
    <main className="min-h-screen bg-[#fdfaf7]">
      {/* FIL D'ARIANE / RETOUR */}
      <div className="mx-auto w-full max-w-7xl px-5 pt-7 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => router.back()}
          className="group inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] !text-[#6f625d] transition-colors duration-300 hover:!text-[#a66a4c]"
        >
          <ArrowLeft
            size={15}
            className="transition-transform duration-300 group-hover:-translate-x-1"
          />
          Retour
        </button>
      </div>

      {/* PRODUIT */}
      <section className="mx-auto w-full max-w-7xl px-5 pb-16 pt-7 sm:px-6 sm:pt-10 lg:px-8 lg:pb-20">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16">
          {/* IMAGE */}
          <div className="relative">
            <div className="relative aspect-square w-full overflow-hidden rounded-[28px] border border-[#eadfd8] bg-[#f7f0e9] shadow-[0_12px_40px_rgba(75,49,39,0.08)]">
              {!imageError ? (
                <Image
                  src={product.image_url || "/placeholder.png"}
                  alt={product.nom}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  onError={() => setImageError(true)}
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <div className="text-center">
                    <ShoppingBag
                      size={42}
                      strokeWidth={1.2}
                      className="mx-auto !text-[#c89a7c]"
                    />

                    <p className="mt-3 text-xs uppercase tracking-[0.18em] !text-[#8b7d77]">
                      Mini Luxe Parfum
                    </p>
                  </div>
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-[#2b211f]/10 via-transparent to-transparent" />

              {/* DISPONIBILITÉ */}
              <div className="absolute left-5 top-5">
                {product.stock > 0 ? (
                  <span className="rounded-full border border-white/30 bg-[#2b211f]/70 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] !text-[#f3dfc3] backdrop-blur-md">
                    Disponible
                  </span>
                ) : (
                  <span className="rounded-full bg-[#2b211f]/80 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] !text-white backdrop-blur-md">
                    Rupture de stock
                  </span>
                )}
              </div>

              {/* FAVORI */}
              <button
                type="button"
                onClick={handleLike}
                aria-label={
                  liked
                    ? "Retirer des favoris"
                    : "Ajouter aux favoris"
                }
                className={`absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full border backdrop-blur-md transition-all duration-300 ${
                  liked
                    ? "border-[#d8b58a] bg-[#f2e5e1] !text-[#a66a4c]"
                    : "border-white/40 bg-[#fdfaf7]/90 !text-[#a66a4c] hover:border-[#d8b58a] hover:bg-white"
                }`}
              >
                <Heart
                  size={20}
                  strokeWidth={1.8}
                  className={
                    liked
                      ? "fill-[#a66a4c] !text-[#a66a4c]"
                      : "!text-[#a66a4c]"
                  }
                />
              </button>
            </div>

            {/* PETITE SIGNATURE SOUS L'IMAGE */}
            <div className="mt-4 flex items-center justify-between px-1">
              <span className="text-[10px] font-medium uppercase tracking-[0.2em] !text-[#8b7d77]">
                Mini Luxe Parfum
              </span>

              <span className="text-xs !text-[#a66a4c]">
                {likes} j'aime
              </span>
            </div>
          </div>

          {/* INFORMATIONS */}
          <div className="flex flex-col">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] !text-[#a66a4c]">
              Parfum d'exception
            </p>

            <h1 className="mt-3 font-[family-name:var(--font-playfair)] text-4xl font-semibold leading-[1.05] !text-[#5a4740] sm:text-5xl lg:text-6xl">
              {product.nom}
            </h1>

            <div className="mt-5 h-px w-16 bg-[#d8b58a]" />

            <p className="mt-6 max-w-xl text-sm leading-7 !text-[#6f625d] sm:text-[15px]">
              {product.description}
            </p>

            {/* PRIX */}
            <div className="mt-7">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] !text-[#8b7d77]">
                Prix
              </p>

              <p className="mt-1 text-3xl font-semibold tracking-tight !text-[#a66a4c] sm:text-4xl">
                {formattedPrice} FCFA
              </p>
            </div>

            {/* STOCK */}
            <div className="mt-6 flex items-center gap-3">
              <span
                className={`h-2 w-2 rounded-full ${
                  product.stock > 0
                    ? "bg-[#547a5b]"
                    : "bg-[#a94b4b]"
                }`}
              />

              <p className="text-xs font-medium !text-[#6f625d]">
                {product.stock > 0
                  ? `${product.stock} exemplaire${
                      product.stock > 1 ? "s" : ""
                    } disponible${product.stock > 1 ? "s" : ""}`
                  : "Produit actuellement indisponible"}
              </p>
            </div>

            {/* ACHAT */}
            {product.stock > 0 && (
              <div className="mt-8 border-t border-[#eadfd8] pt-7">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  {/* QUANTITÉ */}
                  <div className="flex h-12 w-fit items-center rounded-full border border-[#eadfd8] bg-white">
                    <button
                      type="button"
                      onClick={() =>
                        setQuantity((q) => Math.max(1, q - 1))
                      }
                      disabled={quantity <= 1}
                      aria-label="Diminuer la quantité"
                      className="flex h-11 w-11 items-center justify-center rounded-full !text-[#a66a4c] transition-colors hover:bg-[#f7f0e9] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <Minus size={15} />
                    </button>

                    <span className="min-w-9 text-center text-sm font-semibold !text-[#5a4740]">
                      {quantity}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        setQuantity((q) =>
                          Math.min(product.stock, q + 1)
                        )
                      }
                      disabled={quantity >= product.stock}
                      aria-label="Augmenter la quantité"
                      className="flex h-11 w-11 items-center justify-center rounded-full !text-[#a66a4c] transition-colors hover:bg-[#f7f0e9] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <Plus size={15} />
                    </button>
                  </div>

                  {/* PANIER */}
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full bg-[#a66a4c] px-7 text-sm font-semibold !text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#7d4d38] hover:shadow-[0_12px_28px_rgba(125,77,56,0.2)]"
                  >
                    <ShoppingBag size={17} />
                    Ajouter au panier
                  </button>
                </div>

                <p className="mt-3 text-center text-[11px] !text-[#8b7d77] sm:text-left">
                  Quantité sélectionnée : {quantity}
                </p>
              </div>
            )}

            {/* MINI INFORMATIONS */}
            <div className="mt-8 grid grid-cols-1 gap-3 border-t border-[#eadfd8] pt-7 sm:grid-cols-3">
              <div className="rounded-2xl bg-[#f7f0e9] p-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] !text-[#a66a4c]">
                  Qualité
                </p>
                <p className="mt-1 text-xs leading-5 !text-[#6f625d]">
                  Sélection premium
                </p>
              </div>

              <div className="rounded-2xl bg-[#f7f0e9] p-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] !text-[#a66a4c]">
                  Commande
                </p>
                <p className="mt-1 text-xs leading-5 !text-[#6f625d]">
                  Simple et rapide
                </p>
              </div>

              <div className="rounded-2xl bg-[#f7f0e9] p-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] !text-[#a66a4c]">
                  Expérience
                </p>
                <p className="mt-1 text-xs leading-5 !text-[#6f625d]">
                  Mini Luxe Parfum
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRODUITS SIMILAIRES */}
      <section className="border-t border-[#eadfd8] bg-[#f7f0e9] py-16 sm:py-20">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="mb-9 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] !text-[#a66a4c]">
                Vous aimerez peut-être
              </p>

              <h2 className="mt-2 font-[family-name:var(--font-playfair)] text-3xl font-semibold !text-[#5a4740] sm:text-4xl">
                Parfums similaires
              </h2>
            </div>

            {relatedProducts.length > 0 && (
              <Link
                href="/boutique"
                className="group inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] !text-[#a66a4c] transition-colors hover:!text-[#7d4d38]"
              >
                Voir la boutique
                <ArrowRight
                  size={15}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
            )}
          </div>

          {relatedProducts.length === 0 ? (
            <div className="rounded-[22px] border border-[#eadfd8] bg-[#fdfaf7] px-6 py-12 text-center">
              <p className="font-[family-name:var(--font-playfair)] text-xl !text-[#5a4740]">
                Aucun parfum similaire
              </p>

              <p className="mt-2 text-sm !text-[#8b7d77]">
                Découvrez prochainement d'autres fragrances.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
              {relatedProducts.map((p) => (
                <article
                  key={p.id}
                  className="group overflow-hidden rounded-2xl border border-[#eadfd8] bg-white shadow-[0_8px_30px_rgba(75,49,39,0.06)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(75,49,39,0.12)]"
                >
                  <Link href={`/produits/${p.id}`}>
                    <div className="relative h-56 w-full overflow-hidden bg-[#f7f0e9] sm:h-64">
                      <Image
                        src={p.image_url || "/placeholder.png"}
                        alt={p.nom}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-[#2b211f]/20 via-transparent to-transparent" />

                      <div className="absolute bottom-3 left-3">
                        <span className="rounded-full border border-white/30 bg-[#2b211f]/70 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.12em] !text-[#f3dfc3] backdrop-blur-md">
                          {p.stock > 0
                            ? "Disponible"
                            : "Rupture"}
                        </span>
                      </div>
                    </div>

                    <div className="p-4">
                      <h3 className="truncate font-[family-name:var(--font-playfair)] text-lg font-semibold !text-[#5a4740]">
                        {p.nom}
                      </h3>

                      <p className="mt-1 text-sm font-semibold !text-[#a66a4c]">
                        {p.prix.toLocaleString("fr-FR")} FCFA
                      </p>

                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-[10px] uppercase tracking-[0.1em] !text-[#8b7d77]">
                          Découvrir
                        </span>

                        <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[#eadfd8] !text-[#a66a4c] transition-all duration-300 group-hover:border-[#a66a4c] group-hover:bg-[#a66a4c] group-hover:!text-white">
                          <ArrowUpRight size={15} />
                        </span>
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

