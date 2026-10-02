"use client";

import { FiEdit3 } from "react-icons/fi";

type Produit = {
    id: number;
    nom: string;
    description: string;
    stock: number;
    prix: number;
    image_url: string;
    category_id: string;
};

type EditBtnProps = {
    produit: Produit;
    onClick: (produit: Produit) => void;
};

export default function EditBtn({
    produit,
    onClick,
}: EditBtnProps) {
    return (
        <button
            type="button"
            onClick={() => onClick(produit)}
            aria-label={`Modifier ${produit.nom}`}
            title="Modifier"
            className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-lg
                border
                border-[#eadfd8]
                bg-white
                text-[#a66a4c]
                transition
                hover:border-[#c89a7c]
                hover:bg-[#fdfaf7]
                hover:text-[#7d4d38]
            "
        >
            <FiEdit3 size={16} />
        </button>
    );
}