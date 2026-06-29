"use client";
import { useEffect, useState } from "react";

const Logo = () => {
  const [logo, setLogo] = useState<string>("");

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

        if (data.data?.logo) {
          setLogo(data.data.logo);
        }
      } catch (error) {
        console.error("Erreur récupération logo:", error);
      }
    };

    fetchLogo();
  }, []);

  if (!logo) return null;

  return (
    <div className="flex justify-center items-center">
      <img src={logo}
        alt="Logo boutique"
        className="h-20 w-20 object-contain rounded-lg"
      />
    </div>
  );
};

export default Logo;