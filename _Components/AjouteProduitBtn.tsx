"use client";
import { X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

type Categorie = {
    id: number;
    nom: string;
};

const AjouteProduitBtn = () => {
    const [modal, setModal] = useState(false);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);

    const [nom, setNom] = useState("");
    const [description, setDescription] = useState("");
    const [stock, setStock] = useState<number>();
    const [prix, setPrix] = useState<number>();
    const [section, setSection] = useState("");

    const [imageUrl, setImageUrl] = useState("");
    const [category_id, setCategory_id] = useState("");

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
        setDescription("");

        setImageUrl("");
        setCategory_id("");
    };

    // CREATE PRODUCT
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!nom || !description || !category_id) {
            toast.error("Tous les champs sont requis !");
            return;
        }

        const loadingToast = toast.loading("Ajout du produit...");

        try {
            setSaving(true);

            const token = localStorage.getItem("token");

            const res = await fetch("/api/produits", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    nom,
                    description,
                    stock,
                    prix,
                    section,
                    image_url: imageUrl,
                    category_id: Number(category_id),
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Erreur serveur");
            }

            toast.dismiss(loadingToast);
            toast.success(data.message || "Produit ajouté");

            reset();
            setModal(false);
        } catch (error: any) {
            toast.dismiss(loadingToast);
            toast.error(error.message || "Erreur création produit");
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
                                Ajouter un produit
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

                            <textarea
                                placeholder="Description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="border p-2 rounded h-40 focus:outline-none focus:ring-2 focus:ring-green-500"
                            />


                            <input
                                type="number"
                                placeholder="Prix"
                                value={prix}
                                onChange={(e) => setPrix(Number(e.target.value))}
                                className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                            />

                            <input
                                type="number"
                                placeholder="Stock"
                                value={stock}
                                onChange={(e) => setStock(Number(e.target.value))}
                                className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                            />

                            <select
                                value={category_id}
                                onChange={(e) => setCategory_id(e.target.value)}
                                className="w-full border p-2 rounded bg-white text-black text-base focus:outline-none focus:ring-2 focus:ring-green-500"
                            >
                                <option value="">Choisir une catégorie</option>

                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.nom}
                                    </option>
                                ))}
                            </select>
                            <select
                                value={section}
                                onChange={(e) => setSection(e.target.value)}
                                className="border p-2 rounded"
                            >
                                <option value="commande">Populaire</option>
                                <option value="livraison">Meilleur Offre</option>
                            </select>

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

export default AjouteProduitBtn;