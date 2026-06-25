'use client';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

const BoutiqueReglage = () => {
    const [nom, setNom] = useState('');
    const [logo, setLogo] = useState('');
     const [apropos, setApropos] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchBoutique();
    }, []);

    const fetchBoutique = async () => {
        try {
            const token = localStorage.getItem('token');

            const res = await fetch('/api/boutiqueConfig', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();

            if (data.data) {
                setNom(data.data.nom || '');
                setLogo(data.data.logo || '');
                setApropos(data.data.apropos || '');
            }
        } catch (error) {
            console.error(error);
        }
    };

    const uploadImage = async (file: File) => {
        try {
            const token = localStorage.getItem('token');

            const formData = new FormData();
            formData.append('file', file);

            const res = await fetch('/api/upload', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            const data = await res.json();

            return data.imageUrl || '';
        } catch (error) {
            console.error(error);
            return '';
        }
    };

    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        const toastId = toast.loading(
            'Enregistrement en cours...'
        );

        try {
            setLoading(true);

            const token = localStorage.getItem('token');

            const res = await fetch('/api/boutiqueConfig', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    nom,
                    logo,
                    apropos
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message);
            }

            toast.success(data.message);

        } catch (error: any) {
            toast.error(
                error.message || 'Une erreur est survenue'
            );
        } finally {
            toast.dismiss(toastId);
            setLoading(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto border border-white bg-white rounded-lg text-black shadow-lg mt-4 mb-2 p-6">
            <h2 className="text-lg font-semibold mb-4 mt-10">
                Boutique
            </h2>

            <form
                onSubmit={handleSubmit}
                className="grid md:grid-cols-2 gap-4 "
            >
                <div className="flex flex-col gap-2">
                    <label>Nom de la boutique</label>

                    <input
                        type="text"
                        value={nom}
                        onChange={(e) =>
                            setNom(e.target.value)
                        }
                        className="border p-2 rounded w-full outline-none focus:border-green-500"
                    />
                    <label>A propos</label>
                    
                            <textarea
                                value={apropos}
                                onChange={(e) => 
                                    setApropos(e.target.value)
                                }
                                className="border p-2 rounded h-32 outline-none focus:border-green-500"
                                placeholder="Parle un peut de la boutique "
                            />
                </div>

                <div className="flex flex-col gap-2">
                    <label>Logo de la boutique</label>
                    {logo && (
                        <img
                            src={logo}
                            alt="Logo"
                            className="w-full h-40 object-cover rounded border outline-none"
                        />
                    )}
                    <input
                        type="file"
                        accept="image/*"
                        className="border p-2 rounded w-full focus:border-green-500"
                        onChange={async (e) => {
                            const file =
                                e.target.files?.[0];

                            if (!file) return;

                            const imageUrl =
                                await uploadImage(file);

                            if (imageUrl) {
                                setLogo(imageUrl);
                            }
                        }}
                    />

                </div>

                <div className="md:col-span-2">
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-green-600 text-white px-4 py-2 rounded w-full"
                    >
                        {loading
                            ? 'Enregistrement...'
                            : 'Mettre à jour'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default BoutiqueReglage;