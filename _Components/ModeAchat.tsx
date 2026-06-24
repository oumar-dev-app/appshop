'use client';
import { useEffect, useState } from "react";
import Image from "next/image";

const cards = [
  {
    title: "Click & Collect",
    desc: "Commandez en ligne et récupérez en magasin en toute sécurité.",
    img: "/fashion-boutique.webp",
  },
  {
    title: "Livraison rapide",
    desc: "Recevez vos vêtements directement chez vous en 24h.",
    img: "/Livraision.webp",
  },
  {
    title: "Shopping en boutique",
    desc: "Essayez et achetez directement en magasin.",
    img: "/fashionable-boutique.webp",
  },
];

type Entreprise = {
  id: number;
  logo: string;
  nom: string;
};

const ModeAchat = () => {
  const [entreprise, setEntreprise] = useState<Entreprise | null>(null);

  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch("/api/boutiqueConfig", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        setEntreprise(data.data);
      } catch (error) {
        console.error("Erreur récupération configuration :", error);
      }
    };

    fetchLogo();
  }, []);

  useEffect(() => {
    const elements = document.querySelectorAll(".fade-item");

    const observer = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.2,
      }
    );

    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <section className="w-full max-w-7xl mx-auto px-4 space-y-10">
      {/* Header */}
      <div className="fade-item flex flex-col items-center text-center gap-4 py-6">
        <h1 className="text-3xl font-bold">
          Achat en ligne ou en magasin ?
        </h1>

        {entreprise && (
          <p className="text-gray-600 max-w-2xl font-medium text-sm">
            Avec <strong>{entreprise.nom}</strong>, vous avez toujours le choix.
            Découvrez plusieurs façons simples d’obtenir vos vêtements préférés.
          </p>
        )}
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, index) => (
          <div
            key={index}
            className="fade-item rounded bg-white shadow-lg flex flex-col justify-between hover:shadow-2xl transition duration-300"
          >
            <div className="flex flex-col gap-2 items-center text-center">
              <div className="relative w-full h-52 overflow-hidden">
                <Image
                  src={card.img}
                  alt={card.title}
                  fill
                  className="object-cover"
                />
              </div>

              <h2 className="font-semibold text-lg m-3">
                {card.title}
              </h2>

              <p className="text-sm text-gray-600 m-3">
                {card.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ModeAchat;