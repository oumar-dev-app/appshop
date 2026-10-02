"use client";

import { FiEdit3 } from "react-icons/fi";

type Category = {
    id: number;
    nom: string;
    image_url: string;
};

type EditBtnCategoryProps = {
    category: Category;
    onClick: (category: Category) => void;
};

export default function EditBtnCategory({
    category,
    onClick,
}: EditBtnCategoryProps) {
    return (
        <button
            type="button"
            onClick={() => onClick(category)}
            aria-label={`Modifier ${category.nom}`}
            title="Modifier"
            className="
                flex h-9 w-9 items-center justify-center
                rounded-lg
                border border-[#eadfd8]
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