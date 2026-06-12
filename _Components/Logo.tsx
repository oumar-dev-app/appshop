"use client";

import React, { useEffect, useState } from "react";

type LogoData = {
  logo: string;
};

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
    <div>
      <img src={logo}
        alt="Logo boutique"
        className="h-20 w-20 object-contain rounded"
      />
    </div>
  );
};

export default Logo;