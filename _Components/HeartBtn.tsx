"use client";
import { Heart } from "lucide-react";
import { useState } from "react";

type HeartBtnProps = {
  productId: number;
  initialLikes: number;
};

const HeartBtn = ({ productId, initialLikes }: HeartBtnProps) => {
  const [likes, setLikes] = useState(initialLikes);
  const [liked, setLiked] = useState(false);

  const handleLike = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch(`/api/produits/${productId}/like`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) return;

    const data = await res.json();

    setLikes(data.likes);

    // toggle logique simple
    setLiked(true);
  };

  return (
    <div className="flex items-center gap-2">
      <Heart
        size={22}
        onClick={handleLike}
        className={`cursor-pointer transition ${
          liked
            ? "text-green-600 fill-green-600"
            : "text-green-600"
        }`}
      />

      <span className="text-xs text-gray-500">{likes}</span>
    </div>
  );
};

export default HeartBtn;