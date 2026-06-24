'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';

type TypeAvisClient = {
  id: number;
  message: string;
  image_url?: string;
  nom: string;
};

const Avis = () => {

  const [avis, setAvis] = useState<TypeAvisClient[]>([]);

  /* FETCH AVIS */
  useEffect(() => {

    const fetchAvis = async () => {

      try {

        const token = localStorage.getItem("token");

        const res = await fetch("/api/avisClient", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Erreur API avis");
        }

        const data = await res.json();

        setAvis(Array.isArray(data.data) ? data.data : []);

      } catch (error) {
        console.error(error);
      }
    };

    fetchAvis();

  }, []);

  /* ANIMATION */
  useEffect(() => {

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
          }
        });
      },
      { threshold: 0.2 }
    );

    const elements = document.querySelectorAll(".fade-item");

    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };

  }, []);

  return (

    <div className="fade-item w-full max-w-7xl mx-auto mt-10 px-4">

      <div className=" text-black rounded py-10 px-6">

        {/* TITLE */}
        <div className="fade-item flex flex-col items-center text-center gap-3 mb-10">

          <h1 className="text-3xl  font-bold">
            Ce que disent nos clients
          </h1>

        </div>

        {/* GRID */}
        {avis.length === 0 ? (

          <p className="text-center text-gray-300">
            Aucun avis disponible
          </p>

        ) : (

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

            {avis.map((item) => (

              <div
                key={item.id}
                className="h-80 rounded bg-gray-700 shadow-xl p-4 flex flex-col justify-between hover:scale-[1.02] transition"
              >

                {/* MESSAGE */}
                <div className="text-center text-white text-sm">
                  <p>{item.message}</p>
                </div>

                {/* USER */}
                <div className="flex justify-between items-center mt-4">

                  <Image
                    src={item.image_url || "/placeholder.png"}
                    alt={item.nom}
                    width={40}
                    height={40}
                    className="rounded-full object-cover"
                  />

                  <p className="text-white font-medium text-sm">
                    {item.nom}
                  </p>

                </div>

              </div>

            ))}

          </div>

        )}
      </div>

    </div>
  );
};

export default Avis;