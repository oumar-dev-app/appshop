"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";

type Categories = {
  id: number;
  nom: string;
  image_url: string;
};

const FooterCategory = () => {
  const [categories, setCategories] = useState<Categories[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/category", {
          method: "GET",
        });

        const data = await res.json();
        setCategories(data.data || []);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCategories();
  }, []);

  return (
<div className="flex flex-col gap-2">
    <h1 className="font-bold text-white">Les categories</h1>
  {categories.map((item) => (
    <Link
      key={item.id}
      href={`/categories/${item.id}`}
      className="text-white text-sm hover:text-green-400 transition"
    >
      {item.nom}
    </Link>
  ))}
</div>
  );
};

export default FooterCategory;