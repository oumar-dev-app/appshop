"use client";
import { X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function AjouteCommandeBtn() {
    const [modal, setModal] = useState(false);
    const [saving, setSaving] = useState(false);

    const [nom_client, setNom] = useState("");
    const [telephone, setTelephone] = useState("");
    const [addresse, setAdresse] = useState("");
    const [total, setTotal] = useState<number>();
    const [mode_commande, setMode] = useState("commande");
    const [gps, setGps] = useState("");

    const reset = () => {
        setNom("");
        setTelephone("");
        setAdresse("");
        setMode("commande");
        setGps("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const loading = toast.loading("Création commande...");

        try {
            setSaving(true);

            const token = localStorage.getItem("token");

            const res = await fetch("/api/commandes", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    nom_client,
                    telephone,
                    addresse,
                    total,
                    mode_commande,
                    gps: mode_commande === "livraison" ? gps : "",
                }),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.message);

            toast.dismiss(loading);
            toast.success("Commande créée avec succès");

            reset();
            setModal(false);
        } catch (error: any) {
            toast.dismiss(loading);
            toast.error(error.message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <>
            {/* BUTTON */}
            <button
                onClick={() => setModal(true)}
                className="bg-green-600 text-white px-4 py-2 rounded"
            >
                ➕ Ajouter commande
            </button>

            {/* MODAL */}
            {modal && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={() => setModal(false)}
                    />

                    <div className="relative bg-white text-black w-full max-w-md p-6 rounded m-3">

                        <div className="flex justify-between mb-4">
                            <h2 className="font-bold">Nouvelle commande</h2>
                            <button onClick={() => setModal(false)}>
                                <X />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="flex flex-col gap-3">

                            <input
                                placeholder="Nom client"
                                value={nom_client}
                                onChange={(e) => setNom(e.target.value)}
                                className="border p-2 rounded"
                            />

                            <input
                                placeholder="Téléphone"
                                value={telephone}
                                onChange={(e) => setTelephone(e.target.value)}
                                className="border p-2 rounded"
                            />

                            <input
                                placeholder="Adresse"
                                value={addresse}
                                onChange={(e) => setAdresse(e.target.value)}
                                className="border p-2 rounded"
                            />

                            <input
                                type="number"
                                placeholder="Total"
                                value={total}
                                onChange={(e) => setTotal(Number(e.target.value))}
                                className="border p-2 rounded"
                            />

                            <select
                                value={mode_commande}
                                onChange={(e) => setMode(e.target.value)}
                                className="border p-2 rounded"
                            >
                                <option value="commande">Commande</option>
                                <option value="livraison">Livraison</option>
                            </select>

                            {/* GPS seulement si livraison */}
                            {mode_commande === "livraison" && (
                                <input
                                    placeholder="Lien GPS"
                                    value={gps}
                                    onChange={(e) => setGps(e.target.value)}
                                    className="border p-2 rounded"
                                />
                            )}

                            <button
                                disabled={saving}
                                className="bg-green-600 text-white py-2 rounded"
                            >
                                {saving ? "Création..." : "Créer commande"}
                            </button>

                        </form>
                    </div>
                </div>
            )}
        </>
    );
}