import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { X } from "lucide-react";

type User = {
    id: number;
    nom: string;
    prenom: string;
    telephone: string;
    email: string;
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

    const [saving, setSaving] = useState(false);

    // ✅ PRE-REMPLISSAGE quand modal s’ouvre ou user change
    useEffect(() => {
        if (user) {
            setNom(user.nom);
            setPrenom(user.prenom);
            setTelephone(user.telephone);
            setEmail(user.email);
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

    return (
        <div>
            <button
                onClick={() => setModal(true)}
                className="px-3 py-2 bg-green-600 text-white rounded-md text-sm"
            >
                Modifier profil
            </button>

            {modal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center m-3">
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={() => setModal(false)}
                    />

                    <div className="relative bg-white text-black w-full max-w-md p-6 rounded">
                        <div className="flex justify-between mb-4">
                            <h2 className="text-xl font-bold">
                                Modifier le profil
                            </h2>

                            <button onClick={() => setModal(false)}>
                                <X />
                            </button>
                        </div>

                        <form onSubmit={handleUpdate} className="flex flex-col gap-3">
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