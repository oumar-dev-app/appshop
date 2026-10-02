"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";

type Category = {
  id: number;
  nom: string;
  image_url?: string;
};

const FooterCategory = () => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/category");
        const data = await res.json();

        setCategories(Array.isArray(data?.data) ? data.data : []);
      } catch (error) {
        console.error("Erreur récupération catégories :", error);
        setCategories([]);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="flex flex-col">
      <h2 className="font-[family-name:var(--font-playfair)] text-xl font-semibold text-[#f3dfc3]">
        Nos catégories
      </h2>

      <div className="mt-5 grid grid-cols-2 gap-x-8 gap-y-3">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/categories/${category.id}`}
            className="text-sm text-[#d9cbc4] transition-colors duration-300 hover:text-[#d8b58a]"
          >
            {category.nom}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default FooterCategory;