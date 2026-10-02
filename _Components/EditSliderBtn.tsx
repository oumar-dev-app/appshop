"use client";

import { FiEdit3 } from "react-icons/fi";

type Slider = {
    id: number;
    image_url: string;
    title: string;
    description: string;
};

type EditSliderBtnProps = {
    slider: Slider;
    onClick: (slider: Slider) => void;
};

export default function EditSliderBtn({
    slider,
    onClick,
}: EditSliderBtnProps) {
    return (
        <button
            type="button"
            onClick={() => onClick(slider)}
            aria-label={`Modifier ${slider.title}`}
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