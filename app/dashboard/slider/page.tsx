'use client'
import EditSliderBtn from "../../../_Components/EditSliderBtn";
import { Trash } from "lucide-react"
import { useEffect, useState } from "react";
import { toast } from "sonner";
import BtnAjouteSlider from "../../../_Components/BtnAjouteSlider";

type Slider = {
    id: number;
    image_url: string;
    title: string;
    description: string;

}

export default function SliderPage() {
    const [slider, setSlider] = useState<Slider[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const elements = document.querySelectorAll(".fade-item1");

        const observer = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("show");
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.2 }
        );

        elements.forEach((el) => observer.observe(el));

        return () => observer.disconnect();
    }, [slider]);

    // Fetch images
    useEffect(() => {
        const fetchSlides = async () => {
            try {
                const token = localStorage.getItem('token')

                const res = await fetch('/api/homebar', {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })

                const data = await res.json()
                setSlider(data.data || [])
            } catch (error) {
                console.error(error)
            } finally {
                setLoading(false);
            }
        }

        fetchSlides();
    }, []);


    // 🗑️ SUPPRESSION
    const handleDelete = async (id: number) => {
        if (!confirm("Voulez-vous vraiment supprimer ce slider ?")) {
            return;
        }

        const loadingToast = toast.loading("Suppression...");

        try {
            const token = localStorage.getItem("token");

            const res = await fetch(`/api/homebar/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message);
            }

            setSlider((prev) =>
                prev.filter((p) => p.id !== id)
            );

            toast.dismiss(loadingToast);
            toast.success(data.message || "Slider supprimé");
        } catch (error: any) {
            toast.dismiss(loadingToast);
            toast.error(
                error.message || "Erreur lors de la suppression"
            );
            console.error(error);
        }
    };

    if (loading) {
        return (
            <p className="text-black p-6 flex items-center justify-center h-screen animate-pulse">
                Chargement des sliders...
            </p>
        );
    }

    return (
        <div className="max-w-7xl mx-auto mt-4 mb-2 py-4 px-4 sm:px-6 text-black">
            <div className="max-w-7xl mx-auto mt-4 mb-2 py-4 px-4 sm:px-6">

                <h1 className="text-2xl font-bold mb-6 text-black">
                    Dashboard Slider
                </h1>
                {/* btn ajoute */}
                <BtnAjouteSlider />
            </div>

            {/* PRODUITS */}
            <div className="mt-8 grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">

                {slider.map((item) => (
                    <div
                        key={item.id}
                        className="bg-white rounded shadow hover:shadow-xl transition overflow-hidden text-black"
                    >
                        <img
                            src={
                                item.image_url ||
                                "/placeholder.png"
                            }
                            className="w-full h-40 object-cover rounded-t"
                        />
                        <div className="m-3">
                            <h2 className="text-lg font-bold">
                                {item.title}
                            </h2>
                            <p className="line-clamp-2">
                                {item.description}
                            </p>
                            <div className="flex justify-end gap-5 mt-2">

                                {/* EDIT */}
                                <EditSliderBtn
                                    slider={item}
                                    onUpdated={(updatedProduit) => {
                                        setSlider((prev) =>
                                            prev.map((item) =>
                                                item.id === updatedProduit.id
                                                    ? updatedProduit
                                                    : item
                                            )
                                        );
                                    }}
                                />

                                {/* DELETE */}
                                <button
                                    type="button"
                                    onClick={() =>
                                        handleDelete(item.id)
                                    }
                                    className="text-red-500 hover:text-red-700 transition"
                                >
                                    <Trash size={18} />
                                </button>

                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}