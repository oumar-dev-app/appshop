"use client";

import { X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

type Categorie = {
    id: number;
    nom: string;
};

const AjouteCategoryBtn = () => {
    const [modal, setModal] = useState(false);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);

    const [nom, setNom] = useState("");
    const [imageUrl, setImageUrl] = useState("");

    const [categories, setCategories] = useState<Categorie[]>([]);

    // GET CATEGORIES
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
                setCategories(data.data || []);
            } catch (error) {
                console.error(error);
            }
        };

        fetchCategories();
    }, []);

    // UPLOAD IMAGE
    const uploadImage = async (file: File) => {
        try {
            setUploading(true);

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

            if (!res.ok) {
                throw new Error(data.message || "Erreur upload");
            }

            setImageUrl(data.imageUrl);
        } catch (error: any) {
            toast.error(error.message || "Erreur upload image");
        } finally {
            setUploading(false);
        }
    };

    // RESET
    const reset = () => {
        setNom("");
        setImageUrl("");
    };

    // CREATE PRODUCT
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const loadingToast = toast.loading("Ajout du categorie...");

        try {
            setSaving(true);

            const token = localStorage.getItem("token");

            const res = await fetch("/api/category", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    nom,
                    image_url: imageUrl,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Erreur serveur");
            }

            toast.dismiss(loadingToast);
            toast.success(data.message || "categorie ajouté");

            reset();
            setModal(false);
        } catch (error: any) {
            toast.dismiss(loadingToast);
            toast.error(error.message || "Erreur création categorie");
        } finally {
            setSaving(false);
        }
    };

    return (
        <>
            {/* BUTTON */}
            <button
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center gap-2"
                onClick={() => setModal(true)}
            >
                ➕ Ajouter un produit
            </button>

            {/* MODAL */}
            {modal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center m-3">

                    {/* BACKDROP */}
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={() => setModal(false)}
                    />

                    {/* CONTENT */}
                    <div className="relative bg-white text-black w-full max-w-md p-6 rounded shadow-lg m-3">

                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold">
                                Ajouter une categorie
                            </h2>

                            <button onClick={() => setModal(false)}>
                                <X size={22} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="flex flex-col gap-3">

                            {/* IMAGE PREVIEW */}
                            {imageUrl && (
                                <img
                                    src={imageUrl}
                                    className="w-full h-40 object-cover rounded border"
                                    alt="preview"
                                />
                            )}

                            {/* UPLOAD */}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (!file) return;
                                    await uploadImage(file);
                                }}
                                className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                            />

                            {uploading && (
                                <p className="text-sm text-blue-500">
                                    Upload image...
                                </p>
                            )}

                            <input
                                type="text"
                                placeholder="Nom"
                                value={nom}
                                onChange={(e) => setNom(e.target.value)}
                                className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                            />


                            {/* ACTION */}
                            <button
                                type="submit"
                                disabled={saving}
                                className="bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-50"
                            >
                                {saving ? "Enregistrement..." : "Ajouter"}
                            </button>

                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default AjouteCategoryBtn;