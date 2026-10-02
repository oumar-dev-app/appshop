import { Trash } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'

type SlideEditType = {
    id: number
    image_url: string
    title?: string
    description?: string
}

const HombarEdit = () => {

    const [sliderEdit, setSliderEdit] = useState<SlideEditType[]>([]);

    // loading submit
    const [loading, setLoading] = useState(false);

    // loading fetch
    const [isFetching, setIsFetching] = useState(true);

    useEffect(() => {

        const fetchEdit = async () => {

            try {

                setIsFetching(true);

                const token = localStorage.getItem("token");

                const res = await fetch("/api/homebar", {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await res.json();

                setSliderEdit(data.data || []);

            } catch (error) {

                console.error(error);

                toast.error("Erreur de chargement");

            } finally {

                setIsFetching(false);
            }
        };

        fetchEdit();

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

            return data.imageUrl;

        } catch (error) {

            console.error(error);

            toast.error("Erreur upload image");

            return null;
        }
    };

    // DELETE SLIDE
    const handleDelete = async (id: number) => {

        const confirmDelete = window.confirm(
            "Voulez-vous vraiment supprimer ce slide ?"
        );

        if (!confirmDelete) return;

        const toastId = toast.loading("Suppression...");

        try {

            const token = localStorage.getItem("token");

            const res = await fetch(`/api/homebar/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message);
            }

            setSliderEdit(prev =>
                prev.filter(slide => slide.id !== id)
            );

            toast.success(data.message || "Slide supprimé");

        } catch (error: any) {

            console.error(error);

            toast.error(
                error?.message || "Erreur de suppression"
            );

        } finally {

            toast.dismiss(toastId);
        }
    };

    // SUBMIT
    const handleSubmit = async (e: React.FormEvent) => {

        e.preventDefault();

        const toastId = toast.loading("Sauvegarde...");

        setLoading(true);

        try {

            const token = localStorage.getItem("token");

            await Promise.all(
                sliderEdit.map(async (item) => {

                    const res = await fetch(`/api/homebar/${item.id}`, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({
                            image_url: item.image_url,
                            title: item.title,
                            description: item.description,
                        }),
                    });

                    const data = await res.json();

                    if (!res.ok) {
                        throw new Error(data.message);
                    }
                })
            );

            toast.success("Slides sauvegardés avec succès");

        } catch (error: any) {

            console.error(error);

            toast.error(
                error?.message || "Erreur de sauvegarde"
            );

        } finally {

            setLoading(false);

            toast.dismiss(toastId);
        }
    };

    // ✅ LOADING SCREEN
    if (isFetching) {
        return (
            <div className="flex justify-center items-center h-75">

                <div className="flex flex-col items-center gap-4">

                    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>

                    <p className="text-gray-400 text-sm">
                        Chargement...
                    </p>

                </div>

            </div>
        );
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="border border-white/25 rounded-lg p-5 max-w-md space-y-4"
        >

            {sliderEdit.map((item) => (
                <div
                    key={item.id}
                    className='flex gap-3 border-b border-gray-600 pb-4'
                >

                    <div className='flex flex-col gap-3 w-full'>

                        {/* DELETE */}
                        <div className='flex justify-end'>
                            <button
                                type="button"
                                onClick={() => handleDelete(item.id)}
                                className='text-red-500 hover:text-red-700 transition cursor-pointer'
                            >
                                <Trash size={18} />
                            </button>
                        </div>

                        {/* IMAGE */}
                        <div className='flex justify-center'>
                            <img
                                src={item.image_url}
                                alt="slide"
                                className="w-50 h-30 object-cover rounded-md"
                            />
                        </div>

                        {/* INPUTS */}
                        <div className='flex flex-col gap-3 w-full mt-4'>

                            <input
                                type="file"
                                accept="image/*"
                                onChange={async (e) => {

                                    const file = e.target.files?.[0];

                                    if (!file) return;

                                    const url = await uploadImage(file);

                                    if (url) {
                                        setSliderEdit(prev =>
                                            prev.map(slide =>
                                                slide.id === item.id
                                                    ? { ...slide, image_url: url }
                                                    : slide
                                            )
                                        );
                                    }
                                }}
                                className="border p-2 rounded-md w-full"
                            />

                            <input
                                type="text"
                                placeholder="Titre"
                                value={item.title || ""}
                                onChange={(e) => {

                                    const value = e.target.value;

                                    setSliderEdit(prev =>
                                        prev.map(slide =>
                                            slide.id === item.id
                                                ? { ...slide, title: value }
                                                : slide
                                        )
                                    );
                                }}
                                className="border p-2 rounded-md w-full outline-none"
                            />

                            <input
                                type="text"
                                placeholder="Description"
                                value={item.description || ""}
                                onChange={(e) => {

                                    const value = e.target.value;

                                    setSliderEdit(prev =>
                                        prev.map(slide =>
                                            slide.id === item.id
                                                ? { ...slide, description: value }
                                                : slide
                                        )
                                    );
                                }}
                                className="border p-2 rounded-md w-full outline-none"
                            />
                        </div>
                    </div>
                </div>
            ))}

            {/* BUTTON */}
            <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-4 py-2 rounded-md w-full hover:bg-blue-700 disabled:opacity-50"
            >
                {loading ? "Saving..." : "Save changes"}
            </button>

        </form>
    )
}

export default HombarEdit;