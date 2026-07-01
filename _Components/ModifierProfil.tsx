import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { X } from "lucide-react";

type User = {
    id: number;
    nom: string;
    prenom: string;
    telephone: string;
    email: string;
    image_url?: string;
    role: string
};

type ModifierProfilProps = {
    user: User;
    onUpdated?: (updated: User) => void;
};

const ModifierProfil = ({ user, onUpdated }: ModifierProfilProps) => {
    const [modal, setModal] = useState(false);

    const [nom, setNom] = useState("");
    const [prenom, setPrenom] = useState("");
    const [telephone, setTelephone] = useState("");
    const [email, setEmail] = useState("");
    const [image_url, setImage_url] = useState("");
    const [uploading, setUploading] = useState(false);

    const [saving, setSaving] = useState(false);

    // ✅ PRE-REMPLISSAGE quand modal s’ouvre ou user change
    useEffect(() => {
        if (user) {
            setNom(user.nom);
            setPrenom(user.prenom);
            setTelephone(user.telephone);
            setEmail(user.email);
            setImage_url(user.image_url);
        }
    }, [user, modal]);

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();

        const loadingToast = toast.loading("Modification...");

        try {
            setSaving(true);

            const token = localStorage.getItem("token");

            const res = await fetch(`/api/users`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    id: user.id,
                    nom,
                    prenom,
                    telephone,
                    email,
                    image_url
                }),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.message);

            toast.success(data.message || "Profil modifié");

            onUpdated?.({
                ...user,
                nom,
                prenom,
                telephone,
                email,
            });

            setModal(false);
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            toast.dismiss(loadingToast);
            setSaving(false);
        }
    };

    if (!user) return null;

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


    return (
        <div>
            <button
                onClick={() => setModal(true)}
                className="px-3 py-2 bg-green-600 text-white rounded-md text-sm"
            >
                Modifier profil
            </button>

            {modal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center ">
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm rounded"
                        onClick={() => setModal(false)}
                    />

                    <div className="relative bg-white text-black w-full max-w-md p-6 rounded">
                        <div className="flex justify-between mb-4">
                            <h2 className="text-xl font-bold">
                                Modifier profil
                            </h2>

                            <button onClick={() => setModal(false)}>
                                <X />
                            </button>
                        </div>

                        <form onSubmit={handleUpdate} className="flex flex-col gap-3">

                                                        {/* IMAGE PREVIEW */}
                            {image_url && (
                                <img
                                    src={image_url}
                                    className="w-full h-30 object-cover rounded border"
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
                                value={nom}
                                onChange={(e) => setNom(e.target.value)}
                                placeholder="Nom"
                                className="border p-2 rounded" />

                            <input
                                value={prenom}
                                onChange={(e) => setPrenom(e.target.value)}
                                placeholder="Prénom"
                                className="border p-2 rounded" />

                            <input
                                value={telephone}
                                onChange={(e) => setTelephone(e.target.value)}
                                placeholder="Téléphone"
                                className="border p-2 rounded" />

                            <input
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email"
                                className="border p-2 rounded" />

                            <button
                                disabled={saving}
                                className="bg-green-600 text-white py-2 rounded"
                            >
                                {saving ? "Modification..." : "Modifier"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ModifierProfil;