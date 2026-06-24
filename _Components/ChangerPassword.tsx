import { X } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

function ChangerPassword() {
    const [modal, setModal] = useState(false);

    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [saving, setSaving] = useState(false);

    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            toast.error(
                "Les mots de passe ne correspondent pas"
            );
            return;
        }

        if (newPassword.length < 8) {
            toast.error(
                "Le mot de passe doit contenir au moins 8 caractères"
            );
            return;
        }

        try {
            setSaving(true);

            const token = localStorage.getItem("token");

            const res = await fetch(
                "/api/change-password",
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        oldPassword,
                        newPassword,
                    }),
                }
            );

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message);
            }

            toast.success(
                data.message ||
                "Mot de passe modifié avec succès"
            );

            setModal(false);

            setOldPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div>
            <>
                {/* BUTTON */}
                <button
                    onClick={() => setModal(true)}
                    className="px-3 py-2 bg-gray-200 rounded-md text-black text-sm"
                >
                    Changer le mot de passe
                </button>

                {/* MODAL */}
                {modal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center">

                        {/* BACKDROP */}
                        <div
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm rounded"
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
                                onSubmit={handleSubmit}
                                className="flex flex-col gap-3"
                            >
                                <input
                                    type="password"
                                    placeholder="Mot de passe actuel"
                                    value={oldPassword}
                                    onChange={(e) =>
                                        setOldPassword(
                                            e.target.value
                                        )
                                    }
                                    className="border p-2 rounded"
                                    required
                                />

                                <input
                                    type="password"
                                    placeholder="Nouveau mot de passe"
                                    value={newPassword}
                                    onChange={(e) =>
                                        setNewPassword(
                                            e.target.value
                                        )
                                    }
                                    className="border p-2 rounded"
                                    required
                                />

                                <input
                                    type="password"
                                    placeholder="Confirmer le nouveau mot de passe"
                                    value={confirmPassword}
                                    onChange={(e) =>
                                        setConfirmPassword(
                                            e.target.value
                                        )
                                    }
                                    className="border p-2 rounded"
                                    required
                                />

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
        </div>
    );
}

export default ChangerPassword;