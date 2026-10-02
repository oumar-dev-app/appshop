"use client";

import { Heart } from "lucide-react";
import { useState } from "react";

type HeartBtnProps = {
  productId: number;
  initialLikes: number;
};

const HeartBtn = ({ productId, initialLikes }: HeartBtnProps) => {
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [animate, setAnimate] = useState(false);

  const handleLike = async () => {
    if (loading) return;

    try {
      setLoading(true);
      setAnimate(true);

      const token = localStorage.getItem("token");

      const res = await fetch(`/api/produits/${productId}/like`, {
        method: "POST",
        headers: token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : {},
      });

      if (!res.ok) return;

      await res.json();

      setLiked((prev) => !prev);

      window.setTimeout(() => {
        setAnimate(false);
      }, 350);
    } catch (error) {
      console.error("Erreur like :", error);
      setAnimate(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleLike}
      disabled={loading}
      aria-label={
        liked
          ? "Retirer des favoris"
          : "Ajouter aux favoris"
      }
      className={`
        flex h-10 w-10 items-center justify-center
        rounded-full
        border
        backdrop-blur-md
        transition-all duration-300
        ${
          liked
            ? "border-[#d8b58a] bg-[#f2e5e1] !text-[#a66a4c]"
            : "border-white/40 bg-[#fdfaf7]/90 !text-[#a66a4c] hover:border-[#d8b58a] hover:bg-white"
        }
        ${animate ? "scale-110" : "scale-100"}
      `}
    >
      <Heart
        size={19}
        strokeWidth={1.8}
        className={`
          transition-all duration-300
          ${
            liked
              ? "fill-[#a66a4c] !text-[#a66a4c]"
              : "!text-[#a66a4c]"
          }
        `}
      />
    </button>
  );
};

export default HeartBtn;