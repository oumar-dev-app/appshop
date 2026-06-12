"use client";

import { X } from "lucide-react";
import { useState } from "react";
import { FiEdit3 } from "react-icons/fi";
import { toast } from "sonner";

type Slider = {
    id: number;
    image_url: string;
    title: string;
    description: string
};

type EditBtnProps = {
    slider: Slider;
    onUpdated?: (updated: Slider) => void;
};

export default function EditSliderBtn({
    slider,
    onUpdated,
}: EditBtnProps) {
    const [modal, setModal] = useState(false);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);

    const [description, setDescription] = useState(slider.description);
    const [title, setTitle] = useState(slider.title);
    const [image_url, setImage_url] = useState(slider.image_url || "");

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
                throw new Error(data.message || "Erreur upload image");
            }

            setImage_url(data.imageUrl);
        } catch (error: any) {
            toast.error(error.message || "Erreur upload image");
        } finally {
            setUploading(false);
        }
    };

    // UPDATE PRODUIT
    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();

        const loadingToast = toast.loading("Modification...");

        try {
            setSaving(true);

            const token = localStorage.getItem("token");

            const res = await fetch(`/api/homebar/${slider.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    image_url,
                    title,
                    description,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Erreur modification");
            }

            toast.dismiss(loadingToast);
            toast.success(data.message || "Produit modifié avec succès");

            onUpdated?.({
                ...slider,
                image_url: image_url,
                title,
                description,
            });

            setModal(false);
        } catch (error: any) {
            toast.dismiss(loadingToast);
            toast.error(error.message || "Erreur lors de la modification");
        } finally {
            setSaving(false);
        }
    };

    return (
        <>
            {/* BUTTON EDIT */}
            <button
                type="button"
                onClick={() => setModal(true)}
                className="text-green-500 hover:text-green-700 transition"
            >
                <FiEdit3 size={18} />
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
                                Modifier le produit
                            </h2>

                            <button onClick={() => setModal(false)}>
                                <X size={22} />
                            </button>
                        </div>

                        <form
                            onSubmit={handleUpdate}
                            className="flex flex-col gap-3"
                        >
                            {/* IMAGE PREVIEW */}
                            {image_url && (
                                <img
                                    src={image_url}
                                    className="w-full h-40 object-cover rounded border"
                                />
                            )}


                            {/* UPLOAD IMAGE */}
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
                                value={title}
                                onChange={(e) =>
                                    setTitle(e.target.value)
                                }
                                className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                                placeholder="Nom"
                            />

                            <textarea
                                value={description}
                                onChange={(e) =>
                                    setDescription(e.target.value)
                                }
                                className="border p-2 rounded h-40 focus:outline-none focus:ring-2 focus:ring-green-500"
                                placeholder="Description"
                            />


                            {/* ACTIONS */}
                            <button
                                type="submit"
                                disabled={saving}
                                className="bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-50"
                            >
                                {saving
                                    ? "Modification..."
                                    : "Modifier"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}