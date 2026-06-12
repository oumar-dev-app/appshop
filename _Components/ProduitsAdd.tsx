'use client'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner';

const ProduitsAdd = () => {

    const [nom, setNom] = useState("");
    const [description, setDescription] = useState("");
    const [stock, setStock] = useState("");
    const [prix, setPrix] = useState("");
    const [category_id, setCategory_id] = useState("");
    const [category, setCategory] = useState<any[]>([]);
    const [imageUrl, setImageUrl] = useState<string>("");

    // Charger catégories
    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const token = localStorage.getItem("token");

                const res = await fetch("/api/category", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                const data = await res.json();
                setCategory(Array.isArray(data.data) ? data.data : []);

            } catch (error) {
                console.error(error);
            }
        };

        fetchCategory();
    }, []);

    // Upload image
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
            return data.imageUrl || "";

        } catch (error) {
            console.error(error);
            return "";
        }
    };

    // Submit produit
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        

        const loading = toast.loading("Chargement....");

        try {
            const token = localStorage.getItem("token");

            const res = await fetch("/api/produits", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    nom,
                    description,
                    stock: Number(stock),
                    prix: Number(prix),
                    image_url: imageUrl ,
                    category_id: Number(category_id)
                }),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.message);

            toast.success("Produit ajouté avec succès");

            // reset form
            setNom("");
            setDescription("");
            setStock("");
            setPrix("");
            setCategory_id("");
            setImageUrl("");

        } catch (error: any) {
            toast.error(error.message || "Erreur");
        } finally {
            toast.dismiss(loading);
        }
    };

    return (
        <div>
            <div className="border border-white/25 rounded-lg p-5 max-w-md">

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">

                    <input
                        type="text"
                        placeholder="Nom"
                        value={nom}
                        onChange={(e) => setNom(e.target.value)}
                        className="border p-2 rounded-md w-full outline-none"
                    />

                    <input
                        type="text"
                        placeholder="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="border p-2 rounded-md w-full outline-none"
                    />

                    <input
                        type="text"
                        placeholder="Stock"
                        value={stock}
                        onChange={(e) => setStock(e.target.value)}
                        className="border p-2 rounded-md w-full outline-none"
                    />

                    <input
                        type="text"
                        placeholder="Prix"
                        value={prix}
                        onChange={(e) => setPrix(e.target.value)}
                        className="border p-2 rounded-md w-full outline-none"
                    />

                    <select
                        value={category_id}
                        onChange={(e) => setCategory_id(e.target.value)}
                        className="border p-2 rounded-md w-full outline-none bg-black"
                    >
                        <option value="">Choisir une catégorie</option>

                        {category.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.nom}
                            </option>
                        ))}
                    </select>

                    {/* Upload image */}
                    <input
                        type="file"
                        accept="image/*"
                        className="border p-2 rounded-md w-full"
                        onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;

                            const url = await uploadImage(file);

                            if (url) {
                                setImageUrl(url);
                                console.log("Image URL:", url);
                            }
                        }}
                    />

                    <button
                        type="submit"
                        className="flex items-center justify-center gap-2 text-sm font-bold bg-green-500 hover:bg-green-600 transition px-5 py-2 text-white rounded-lg"
                    >
                        Valider
                    </button>

                </form>

            </div>
        </div>
    );
};

export default ProduitsAdd;