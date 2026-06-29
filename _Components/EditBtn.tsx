"use client";
import { X } from "lucide-react";
import { useState } from "react";
import { FiEdit3 } from "react-icons/fi";
import { toast } from "sonner";

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
    onUpdated?: (updated: Produit) => void;
};

const formatFCFA = (value: any) =>
    new Intl.NumberFormat("fr-FR").format(Number(value || 0)) + " FCFA";

export default function EditBouton({
    produit,
    onUpdated,
}: EditBtnProps) {
    const [modal, setModal] = useState(false);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);

    const [nom, setNom] = useState(produit.nom);
    const [description, setDescription] = useState(produit.description);
    const [stock, setStock] = useState(produit.stock);
    const [prix, setPrix] = useState(produit.prix);
    const [imageUrl, setImageUrl] = useState(produit.image_url || "");

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

            if (!res.ok) throw new Error(data.message);

            setImageUrl(data.imageUrl);
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setUploading(false);
        }
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();

        const loadingToast = toast.loading("Modification...");

        try {
            setSaving(true);

            const token = localStorage.getItem("token");

            const res = await fetch(`/api/produits/${produit.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    nom,
                    description,
                    stock,
                    prix,
                    image_url: imageUrl,
                }),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.message);

            toast.dismiss(loadingToast);
            toast.success("Produit modifié avec succès");

            onUpdated?.({
                ...produit,
                nom,
                description,
                stock,
                prix,
                image_url: imageUrl,
            });

            setModal(false);
        } catch (error: any) {
            toast.dismiss(loadingToast);
            toast.error(error.message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <>
            {/* BUTTON */}
            <button
                type="button"
                onClick={() => setModal(true)}
                className="text-green-500 hover:text-green-700 transition"
            >
                <FiEdit3 size={18} />
            </button>

            {/* MODAL */}
            {modal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    
                    {/* BACKDROP */}
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={() => setModal(false)}
                    />

                    {/* MODAL CONTENT */}
                    <div className="relative bg-white text-black w-full max-w-md max-h-[90vh] overflow-y-auto p-6 rounded shadow-lg m-3">

                        {/* HEADER */}
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold">
                                Modifier le produit
                            </h2>

                            <button onClick={() => setModal(false)}>
                                <X size={22} />
                            </button>
                        </div>

                        {/* FORM */}
                        <form
                            onSubmit={handleUpdate}
                            className="flex flex-col gap-3"
                        >
                            {/* IMAGE */}
                            {imageUrl && (
                                <img
                                    src={imageUrl}
                                    alt={nom}
                                    className="w-full h-40 object-cover rounded border"
                                />
                            )}

                            <input
                                type="file"
                                accept="image/*"
                                onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (!file) return;
                                    await uploadImage(file);
                                }}
                                className="border p-2 rounded"
                            />

                            {uploading && (
                                <p className="text-sm text-blue-500 animate-pulse">
                                    Chargement d'image...
                                </p>
                            )}

                            <input
                                type="text"
                                value={nom}
                                onChange={(e) => setNom(e.target.value)}
                                className="border p-2 rounded"
                                placeholder="Nom"
                            />

                            <textarea
                                value={description}
                                onChange={(e) =>
                                    setDescription(e.target.value)
                                }
                                className="border p-2 rounded h-32"
                                placeholder="Description"
                            />

                            <input
                                type="number"
                                value={prix}
                                onChange={(e) =>
                                    setPrix(((Number(e.target.value))))
                                }
                                className="border p-2 rounded"
                                placeholder="Prix"
                            />

                            <input
                                type="number"
                                value={stock}
                                onChange={(e) =>
                                    setStock(Number(e.target.value))
                                }
                                className="border p-2 rounded"
                                placeholder="Stock"
                            />

                            {/* SUBMIT */}
                            <button
                                type="submit"
                                disabled={saving}
                                className="bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-50"
                            >
                                {saving ? "Modification..." : "Modifier"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}