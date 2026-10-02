"use client";

import { useEffect } from "react";
import Image from "next/image";
import { ArrowRight, Check, ShoppingBag, Truck } from "lucide-react";

const cards = [
  {
    number: "01",
    title: "Choisissez votre fragrance",
    desc: "Explorez notre collection et trouvez le parfum qui correspond à votre personnalité et à votre style.",
    img: "/image1.png",
    icon: ShoppingBag,
  },
  {
    number: "02",
    title: "Passez votre commande",
    desc: "Sélectionnez votre parfum, ajoutez-le à votre panier et commandez simplement en quelques instants.",
    img: "/image2.png",
    icon: Check,
  },
  {
    number: "03",
    title: "Recevez votre parfum",
    desc: "Votre commande est préparée avec soin puis livrée directement à l'adresse indiquée.",
    img: "/image3.png",
    icon: Truck,
  },
];

const ModeAchat = () => {
  useEffect(() => {
    const elements = document.querySelectorAll(".fade-item");

    const observer = new IntersectionObserver(
      (entries, observerInstance) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
            observerInstance.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
      }
    );

    elements.forEach((element) => observer.observe(element));

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section className="mx-auto w-full max-w-7xl px-5 py-14 sm:px-6 lg:px-8">
      {/* HEADER */}
      <div className="fade-item mb-10 flex flex-col items-center gap-3 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] !text-[#a66a4c]">
          Une expérience simple
        </p>

        <h2 className="font-[family-name:var(--font-playfair)] text-3xl font-semibold leading-tight !text-[#5a4740] sm:text-4xl">
          Votre parfum, en quelques étapes
        </h2>

        <p className="max-w-2xl text-sm leading-7 text-[#6f625d]">
          Chez Mini Luxe Parfum, nous avons pensé votre expérience pour
          qu'elle soit simple, élégante et agréable, de la découverte
          jusqu'à la livraison.
        </p>
      </div>

      {/* CARDS */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <article
              key={card.number}
              className="fade-item group overflow-hidden rounded-2xl border border-[#eadfd8] bg-white shadow-[0_8px_30px_rgba(75,49,39,0.07)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(75,49,39,0.13)]"
            >
              {/* IMAGE */}
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#f7f0e9]">
                <Image
                  src={card.img}
                  alt={card.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                />
              </div>

              {/* CONTENT */}
              <div className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] !text-[#a66a4c]">
                      Étape {card.number}
                    </p>

                    <h3 className="font-[family-name:var(--font-playfair)] text-xl font-semibold !text-[#5a4740]">
                      {card.title}
                    </h3>
                  </div>

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f2e5e1] !text-[#a66a4c] transition-all duration-300 group-hover:bg-[#d8b58a] group-hover:!text-[#2b211f]">
                    <Icon size={18} strokeWidth={1.8} />
                  </div>
                </div>

                <p className="mt-3 text-sm leading-6 text-[#6f625d]">
                  {card.desc}
                </p>

                <div className="mt-5 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] !text-[#a66a4c]">
                  Mini Luxe Parfum

                  <ArrowRight
                    size={14}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default ModeAchat;