'use client';
import Image from 'next/image';
import { Trash } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

type Produits = {
    id: number;
    nom: string;
    description: string;
    stock: number;
    prix: number;
    image_url?: string;
    category_id: number;
};

type Category = {
    id: number;
    nom: string;
};

const ExploreEdit = () => {

    const [sliderEdit, setSliderEdit] = useState<Produits[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);

    // loading submit
    const [loading, setLoading] = useState(false);

    // loading fetch
    const [isFetching, setIsFetching] = useState(true);

    // FETCH CATEGORIES
    useEffect(() => {

        const fetchCategories = async () => {

            try {

                const token = localStorage.getItem("token");

                const res = await fetch("/api/category", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await res.json();

                setCategories(Array.isArray(data.data) ? data.data : []);

            } catch (error) {

                console.error(error);

                toast.error("Erreur chargement catégories");
            }
        };

        fetchCategories();

    }, []);

    // FETCH PRODUITS
    useEffect(() => {

        const fetchEdit = async () => {

            try {

                setIsFetching(true);

                const token = localStorage.getItem("token");

                const res = await fetch("/api/produits", {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await res.json();

                setSliderEdit(Array.isArray(data.data) ? data.data : []);

            } catch (error) {

                console.error(error);

                toast.error("Erreur de chargement");

            } finally {

                setIsFetching(false);
            }
        };

        fetchEdit();

    }, []);

    // UPLOAD IMAGE
    const uploadImage = async (file: File) => {

        try {

            const token = localStorage.getItem("token");

            const formData = new FormData();

            formData.append("file", file);

            const res = await fetch("/api/upload", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            const data = await res.json();

            return data.imageUrl || data.url || "";

        } catch (error) {

            console.error(error);

            toast.error("Erreur upload image");

            return "";
        }
    };

    // DELETE PRODUIT
    const handleDelete = async (id: number) => {

        const confirmDelete = window.confirm(
            "Voulez-vous vraiment supprimer ce produit ?"
        );

        if (!confirmDelete) return;

        const toastId = toast.loading("Suppression...");

        try {

            const token = localStorage.getItem("token");

            const res = await fetch(`/api/produits/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message);
            }

            setSliderEdit(prev =>
                prev.filter(slide => slide.id !== id)
            );

            toast.success(data.message || "Produit supprimé");

        } catch (error: any) {

            console.error(error);

            toast.error(
                error?.message || "Erreur de suppression"
            );

        } finally {

            toast.dismiss(toastId);
        }
    };

    // SUBMIT
    const handleSubmit = async (e: React.FormEvent) => {

        e.preventDefault();

        const toastId = toast.loading("Sauvegarde...");

        setLoading(true);

        try {

            const token = localStorage.getItem("token");

            await Promise.all(
                sliderEdit.map(async (item) => {

                    const res = await fetch(`/api/produits/${item.id}`, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({
                            nom: item.nom,
                            description: item.description,
                            stock: item.stock,
                            prix: item.prix,
                            image_url: item.image_url,
                            category_id: item.category_id
                        }),
                    });

                    const data = await res.json();

                    if (!res.ok) {
                        throw new Error(data.message);
                    }
                })
            );

            toast.success("Produits sauvegardés avec succès");

        } catch (error: any) {

            console.error(error);

            toast.error(
                error?.message || "Erreur de sauvegarde"
            );

        } finally {

            setLoading(false);

            toast.dismiss(toastId);
        }
    };

    // LOADING
    if (isFetching) {

        return (
            <div className="flex justify-center items-center h-72">

                <div className="flex flex-col items-center gap-4">

                    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>

                    <p className="text-gray-400 text-sm">
                        Chargement...
                    </p>

                </div>

            </div>
        );
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="border border-white/25 rounded-lg p-5 max-w-md space-y-6"
        >

            {sliderEdit.map((item) => (

                <div
                    key={item.id}
                    className="border-b border-gray-700 pb-6"
                >

                    <div className="flex justify-end">

                        <button
                            type="button"
                            onClick={() => handleDelete(item.id)}
                            className="text-red-500 hover:text-red-700 transition"
                        >
                            <Trash size={18} />
                        </button>

                    </div>

                    {/* IMAGE */}
                    <div className="mt-3">

                        <Image
                            src={item.image_url || "/placeholder.png"}
                            alt={item.nom}
                            width={500}
                            height={300}
                            className="
                                w-full
                                h-44
                                object-cover
                                rounded-lg
                                border
                                hover:scale-105
                                transition
                            "
                        />

                    </div>

                    {/* INPUTS */}
                    <div className="flex flex-col gap-3 mt-4">

                        {/* IMAGE INPUT */}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={async (e) => {

                                const file = e.target.files?.[0];

                                if (!file) return;

                                const url = await uploadImage(file);

                                if (url) {

                                    setSliderEdit(prev =>
                                        prev.map(slide =>
                                            slide.id === item.id
                                                ? {
                                                    ...slide,
                                                    image_url: url
                                                }
                                                : slide
                                        )
                                    );
                                }
                            }}
                            className="border p-2 rounded-md w-full"
                        />

                        {/* NOM */}
                        <input
                            type="text"
                            placeholder="Nom"
                            value={item.nom}
                            onChange={(e) => {

                                const value = e.target.value;

                                setSliderEdit(prev =>
                                    prev.map(slide =>
                                        slide.id === item.id
                                            ? {
                                                ...slide,
                                                nom: value
                                            }
                                            : slide
                                    )
                                );
                            }}
                            className="border p-2 rounded-md w-full outline-none"
                        />

                        {/* DESCRIPTION */}
                        <textarea
                            placeholder="Description"
                            value={item.description}
                            onChange={(e) => {

                                const value = e.target.value;

                                setSliderEdit(prev =>
                                    prev.map(slide =>
                                        slide.id === item.id
                                            ? {
                                                ...slide,
                                                description: value
                                            }
                                            : slide
                                    )
                                );
                            }}
                            className="border p-2 rounded-md w-full outline-none"
                        />

                        {/* STOCK */}
                        <input
                            type="number"
                            placeholder="Stock"
                            value={item.stock}
                            onChange={(e) => {

                                const value = Number(e.target.value);

                                setSliderEdit(prev =>
                                    prev.map(slide =>
                                        slide.id === item.id
                                            ? {
                                                ...slide,
                                                stock: value
                                            }
                                            : slide
                                    )
                                );
                            }}
                            className="border p-2 rounded-md w-full outline-none"
                        />

                        {/* PRIX */}
                        <input
                            type="number"
                            placeholder="Prix"
                            value={item.prix}
                            onChange={(e) => {

                                const value = Number(e.target.value);

                                setSliderEdit(prev =>
                                    prev.map(slide =>
                                        slide.id === item.id
                                            ? {
                                                ...slide,
                                                prix: value
                                            }
                                            : slide
                                    )
                                );
                            }}
                            className="border p-2 rounded-md w-full outline-none"
                        />

                        {/* CATEGORY */}
                        <select
                            value={item.category_id}
                            onChange={(e) => {

                                const value = Number(e.target.value);

                                setSliderEdit(prev =>
                                    prev.map(slide =>
                                        slide.id === item.id
                                            ? {
                                                ...slide,
                                                category_id: value
                                            }
                                            : slide
                                    )
                                );
                            }}
                            className="border p-2 rounded-md w-full outline-none bg-black"
                        >

                            <option value="">
                                Choisir une catégorie
                            </option>

                            {categories.map((cat) => (

                                <option
                                    key={cat.id}
                                    value={cat.id}
                                >
                                    {cat.nom}
                                </option>

                            ))}

                        </select>

                    </div>

                </div>
            ))}

            {/* BUTTON */}
            <button
                type="submit"
                disabled={loading}
                className="
                    bg-blue-600
                    text-white
                    px-4
                    py-2
                    rounded-md
                    w-full
                    hover:bg-blue-700
                    disabled:opacity-50
                "
            >
                {loading
                    ? "Sauvegarde..."
                    : "Sauvegarder les modifications"}
            </button>

        </form>
    );
};

export default ExploreEdit;