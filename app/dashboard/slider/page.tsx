"use client";

import {
    ImagePlus,
    Layers3,
    Loader2,
    PlaySquare,
    Search,
    Save,
    Trash2,
    X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import BtnAjouteSlider from "@/_Components/BtnAjouteSlider";
import EditSliderBtn from "@/_Components/EditSliderBtn";

type Slider = {
    id: number;
    image_url: string;
    title: string;
    description: string;
};

export default function SliderPage() {
    const [slider, setSlider] = useState<Slider[]>([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    // =========================
    // MODIFICATION
    // =========================

    const [editingSlider, setEditingSlider] =
        useState<Slider | null>(null);

    const [savingEdit, setSavingEdit] = useState(false);
    const [uploadingEdit, setUploadingEdit] = useState(false);

    const [editTitle, setEditTitle] = useState("");
    const [editDescription, setEditDescription] =
        useState("");
    const [editImageUrl, setEditImageUrl] =
        useState("");

    // =========================
    // CHARGEMENT
    // =========================

    useEffect(() => {
        const fetchSlides = async () => {
            try {
                setLoading(true);

                const token =
                    localStorage.getItem("token");

                const res = await fetch(
                    "/api/homebar",
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const data = await res.json();

                if (!res.ok) {
                    throw new Error(
                        data.message ||
                            "Impossible de charger les sliders"
                    );
                }

                setSlider(
                    Array.isArray(data.data)
                        ? data.data
                        : []
                );
            } catch (error: any) {
                console.error(error);

                toast.error(
                    error.message ||
                        "Erreur lors du chargement des sliders"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchSlides();
    }, []);

    // =========================
    // RECHERCHE
    // =========================

    const filteredSliders = useMemo(() => {
        const value =
            search.trim().toLowerCase();

        if (!value) {
            return slider;
        }

        return slider.filter(
            (item) =>
                item.title
                    ?.toLowerCase()
                    .includes(value) ||
                item.description
                    ?.toLowerCase()
                    .includes(value)
        );
    }, [slider, search]);

    // =========================
    // STATISTIQUES
    // =========================

    const totalSliders = slider.length;

    const slidersWithImage = slider.filter(
        (item) => Boolean(item.image_url)
    ).length;

    const slidersWithoutImage =
        totalSliders - slidersWithImage;

    // =========================
    // OUVRIR MODIFICATION
    // =========================

    const handleOpenEdit = (item: Slider) => {
        setEditingSlider(item);

        setEditTitle(item.title || "");
        setEditDescription(
            item.description || ""
        );
        setEditImageUrl(item.image_url || "");
    };

    // =========================
    // FERMER MODIFICATION
    // =========================

    const handleCloseEdit = () => {
        if (
            savingEdit ||
            uploadingEdit
        ) {
            return;
        }

        setEditingSlider(null);
    };

    // =========================
    // UPLOAD IMAGE
    // =========================

    const handleEditImageUpload = async (
        file: File
    ) => {
        try {
            setUploadingEdit(true);

            const token =
                localStorage.getItem("token");

            const formData = new FormData();
            formData.append("file", file);

            const res = await fetch(
                "/api/upload",
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    body: formData,
                }
            );

            const data = await res.json();

            if (!res.ok) {
                throw new Error(
                    data.message ||
                        "Erreur lors du téléchargement"
                );
            }

            setEditImageUrl(data.imageUrl);

            toast.success(
                "Image téléchargée"
            );
        } catch (error: any) {
            toast.error(
                error.message ||
                    "Erreur lors du téléchargement de l'image"
            );
        } finally {
            setUploadingEdit(false);
        }
    };

    // =========================
    // SAUVEGARDE
    // =========================

    const handleSaveEdit = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        if (!editingSlider) {
            return;
        }

        if (!editTitle.trim()) {
            toast.error(
                "Le titre est requis."
            );
            return;
        }

        if (editTitle.trim().length < 3) {
            toast.error(
                "Le titre doit contenir au moins 3 caractères."
            );
            return;
        }

        if (!editDescription.trim()) {
            toast.error(
                "La description est requise."
            );
            return;
        }

        if (!editImageUrl.trim()) {
            toast.error(
                "Une image est requise."
            );
            return;
        }

        const loadingToast =
            toast.loading(
                "Modification du slider..."
            );

        try {
            setSavingEdit(true);

            const token =
                localStorage.getItem("token");

            const res = await fetch(
                `/api/homebar/${editingSlider.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type":
                            "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        image_url:
                            editImageUrl.trim(),
                        title:
                            editTitle.trim(),
                        description:
                            editDescription.trim(),
                    }),
                }
            );

            const data = await res.json();

            if (!res.ok) {
                throw new Error(
                    data.message ||
                        "Erreur lors de la modification"
                );
            }

            const updatedSlider: Slider = {
                ...editingSlider,
                image_url:
                    editImageUrl.trim(),
                title:
                    editTitle.trim(),
                description:
                    editDescription.trim(),
            };

            setSlider((prev) =>
                prev.map((item) =>
                    item.id ===
                    updatedSlider.id
                        ? updatedSlider
                        : item
                )
            );

            toast.dismiss(
                loadingToast
            );

            toast.success(
                data.message ||
                    "Slider modifié avec succès"
            );

            setEditingSlider(null);
        } catch (error: any) {
            toast.dismiss(
                loadingToast
            );

            toast.error(
                error.message ||
                    "Erreur lors de la modification"
            );
        } finally {
            setSavingEdit(false);
        }
    };

    // =========================
    // SUPPRESSION
    // =========================

    const handleDelete = async (
        id: number
    ) => {
        const item = slider.find(
            (sliderItem) =>
                sliderItem.id === id
        );

        if (!item) {
            return;
        }

        if (
            !confirm(
                `Voulez-vous vraiment supprimer le slider « ${item.title} » ?`
            )
        ) {
            return;
        }

        const loadingToast =
            toast.loading(
                "Suppression..."
            );

        try {
            const token =
                localStorage.getItem("token");

            const res = await fetch(
                `/api/homebar/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await res.json();

            if (!res.ok) {
                throw new Error(
                    data.message ||
                        "Erreur lors de la suppression"
                );
            }

            setSlider((prev) =>
                prev.filter(
                    (item) =>
                        item.id !== id
                )
            );

            toast.dismiss(
                loadingToast
            );

            toast.success(
                data.message ||
                    "Slider supprimé"
            );
        } catch (error: any) {
            toast.dismiss(
                loadingToast
            );

            toast.error(
                error.message ||
                    "Erreur lors de la suppression"
            );

            console.error(error);
        }
    };

    // =========================
    // LOADING
    // =========================

    if (loading) {
        return (
            <div className="mx-4 sm:mx-6 lg:mx-8">
                <div className="mx-auto max-w-7xl py-8">
                    <div className="animate-pulse space-y-6">

                        <div className="h-8 w-56 rounded-lg bg-[#eadfd8]" />

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {[1, 2, 3].map(
                                (item) => (
                                    <div
                                        key={item}
                                        className="h-28 rounded-2xl border border-[#eadfd8] bg-white"
                                    />
                                )
                            )}
                        </div>

                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                            {[1, 2, 3, 4, 5, 6].map(
                                (item) => (
                                    <div
                                        key={item}
                                        className="h-96 rounded-2xl border border-[#eadfd8] bg-white"
                                    />
                                )
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="mx-4 sm:mx-6 lg:mx-8">
            <div className="mx-auto max-w-7xl py-6">

                {/* ================= HEADER ================= */}

                <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#a66a4c]">
                            Administration
                        </p>

                        <h1 className="text-3xl font-semibold tracking-tight text-[#2b211f] sm:text-4xl">
                            Sliders
                        </h1>

                        <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6f625d]">
                            Gérez les visuels et les
                            messages présentés sur la
                            page d'accueil de Mini Luxe.
                        </p>
                    </div>

                    <BtnAjouteSlider />
                </div>

                {/* ================= STATS ================= */}

                <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

                    <SliderStat
                        icon={
                            <Layers3 size={20} />
                        }
                        label="Total sliders"
                        value={totalSliders}
                        description="Visuels enregistrés"
                    />

                    <SliderStat
                        icon={
                            <ImagePlus size={20} />
                        }
                        label="Avec image"
                        value={slidersWithImage}
                        description="Visuels illustrés"
                    />

                    <SliderStat
                        icon={
                            <PlaySquare size={20} />
                        }
                        label="Sans image"
                        value={
                            slidersWithoutImage
                        }
                        description="À compléter"
                    />
                </div>

                {/* ================= SEARCH ================= */}

                <div className="mb-8 rounded-2xl border border-[#eadfd8] bg-white p-4 shadow-[0_8px_30px_rgba(75,49,39,0.06)]">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                        <div>
                            <h2 className="font-display text-xl font-semibold text-[#2b211f]">
                                Vos sliders
                            </h2>

                            <p className="mt-1 text-sm text-[#8b7d77]">
                                {
                                    filteredSliders.length
                                }{" "}
                                slider
                                {filteredSliders.length >
                                1
                                    ? "s"
                                    : ""}{" "}
                                affiché
                                {filteredSliders.length >
                                1
                                    ? "s"
                                    : ""}
                            </p>
                        </div>

                        <div className="relative w-full sm:max-w-sm">
                            <Search
                                size={18}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a66a4c]"
                            />

                            <input
                                type="text"
                                placeholder="Rechercher un slider..."
                                value={search}
                                onChange={(e) =>
                                    setSearch(
                                        e.target.value
                                    )
                                }
                                className="
                                    w-full rounded-xl
                                    border border-[#eadfd8]
                                    bg-[#fdfaf7]
                                    py-3 pl-10 pr-4
                                    text-sm text-[#2b211f]
                                    outline-none
                                    transition
                                    placeholder:text-[#a79a94]
                                    focus:border-[#a66a4c]
                                    focus:ring-2
                                    focus:ring-[#a66a4c]/10
                                "
                            />
                        </div>
                    </div>
                </div>

                {/* ================= SLIDERS ================= */}

                {filteredSliders.length ===
                0 ? (
                    <div className="rounded-2xl border border-dashed border-[#d8c4b8] bg-white px-6 py-16 text-center">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f7f0e9] text-[#a66a4c]">
                            <PlaySquare
                                size={25}
                            />
                        </div>

                        <h3 className="mt-4 font-display text-xl font-semibold text-[#2b211f]">
                            Aucun slider trouvé
                        </h3>

                        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#6f625d]">
                            {search
                                ? "Aucun slider ne correspond à votre recherche."
                                : "Commencez par créer votre premier slider."}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                        {filteredSliders.map(
                            (item) => (
                                <SliderCard
                                    key={item.id}
                                    slider={item}
                                    onEdit={
                                        handleOpenEdit
                                    }
                                    onDelete={
                                        handleDelete
                                    }
                                />
                            )
                        )}
                    </div>
                )}

                {/* ================= MODAL UNIQUE ================= */}

                {editingSlider && (
                    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">

                        {/* BACKDROP */}

                        <div
                            className="absolute inset-0 bg-[#2b211f]/45 backdrop-blur-sm"
                            onClick={
                                handleCloseEdit
                            }
                        />

                        {/* MODAL */}

                        <div className="relative z-10 w-full max-w-2xl overflow-hidden rounded-2xl border border-[#eadfd8] bg-white shadow-2xl">

                            {/* HEADER */}

                            <div className="flex items-center justify-between border-b border-[#eadfd8] px-6 py-5">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#a66a4c]">
                                        Gestion de l'accueil
                                    </p>

                                    <h2 className="mt-1 font-display text-xl font-semibold text-[#2b211f]">
                                        Modifier le slider
                                    </h2>
                                </div>

                                <button
                                    type="button"
                                    onClick={
                                        handleCloseEdit
                                    }
                                    disabled={
                                        savingEdit ||
                                        uploadingEdit
                                    }
                                    className="flex h-9 w-9 items-center justify-center rounded-full border border-[#eadfd8] text-[#6f625d] transition hover:bg-[#f7f0e9] hover:text-[#7d4d38] disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            {/* FORM */}

                            <form
                                onSubmit={
                                    handleSaveEdit
                                }
                                className="max-h-[80vh] overflow-y-auto"
                            >
                                <div className="space-y-5 p-6">

                                    {/* IMAGE */}

                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-[#5a4740]">
                                            Image du slider
                                        </label>

                                        <div className="overflow-hidden rounded-xl border border-[#eadfd8] bg-[#f7f0e9]">
                                            {editImageUrl ? (
                                                <img
                                                    src={
                                                        editImageUrl
                                                    }
                                                    alt={
                                                        editTitle
                                                    }
                                                    className="h-56 w-full object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-56 items-center justify-center text-[#a66a4c]">
                                                    <ImagePlus
                                                        size={
                                                            35
                                                        }
                                                    />
                                                </div>
                                            )}
                                        </div>

                                        <label className="mt-3 flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-[#c89a7c] bg-[#fdfaf7] px-4 text-sm font-medium text-[#a66a4c] transition hover:bg-[#f7f0e9]">
                                            {uploadingEdit ? (
                                                <>
                                                    <Loader2
                                                        size={
                                                            17
                                                        }
                                                        className="animate-spin"
                                                    />
                                                    Téléchargement...
                                                </>
                                            ) : (
                                                <>
                                                    <ImagePlus
                                                        size={
                                                            17
                                                        }
                                                    />
                                                    Changer l'image
                                                </>
                                            )}

                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                disabled={
                                                    uploadingEdit
                                                }
                                                onChange={(
                                                    e
                                                ) => {
                                                    const file =
                                                        e
                                                            .target
                                                            .files?.[0];

                                                    if (
                                                        file
                                                    ) {
                                                        handleEditImageUpload(
                                                            file
                                                        );
                                                    }
                                                }}
                                            />
                                        </label>
                                    </div>

                                    {/* TITRE */}

                                    <div>
                                        <label
                                            htmlFor="edit-slider-title"
                                            className="mb-2 block text-sm font-medium text-[#5a4740]"
                                        >
                                            Titre
                                        </label>

                                        <input
                                            id="edit-slider-title"
                                            type="text"
                                            value={
                                                editTitle
                                            }
                                            onChange={(
                                                e
                                            ) =>
                                                setEditTitle(
                                                    e
                                                        .target
                                                        .value
                                                )
                                            }
                                            required
                                            className="w-full rounded-xl border border-[#eadfd8] bg-[#fdfaf7] px-4 py-3 text-sm text-[#2b211f] outline-none transition focus:border-[#a66a4c] focus:ring-2 focus:ring-[#a66a4c]/10"
                                        />
                                    </div>

                                    {/* DESCRIPTION */}

                                    <div>
                                        <label
                                            htmlFor="edit-slider-description"
                                            className="mb-2 block text-sm font-medium text-[#5a4740]"
                                        >
                                            Description
                                        </label>

                                        <textarea
                                            id="edit-slider-description"
                                            value={
                                                editDescription
                                            }
                                            onChange={(
                                                e
                                            ) =>
                                                setEditDescription(
                                                    e
                                                        .target
                                                        .value
                                                )
                                            }
                                            required
                                            rows={5}
                                            className="w-full resize-none rounded-xl border border-[#eadfd8] bg-[#fdfaf7] px-4 py-3 text-sm leading-6 text-[#2b211f] outline-none transition focus:border-[#a66a4c] focus:ring-2 focus:ring-[#a66a4c]/10"
                                        />
                                    </div>
                                </div>

                                {/* FOOTER */}

                                <div className="flex flex-col-reverse gap-3 border-t border-[#eadfd8] bg-[#fdfaf7] px-6 py-4 sm:flex-row sm:justify-end">
                                    <button
                                        type="button"
                                        onClick={
                                            handleCloseEdit
                                        }
                                        disabled={
                                            savingEdit ||
                                            uploadingEdit
                                        }
                                        className="min-h-11 rounded-xl border border-[#eadfd8] bg-white px-5 text-sm font-semibold text-[#6f625d] transition hover:border-[#c89a7c] hover:text-[#7d4d38] disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        Annuler
                                    </button>

                                    <button
                                        type="submit"
                                        disabled={
                                            savingEdit ||
                                            uploadingEdit ||
                                            !editTitle.trim() ||
                                            !editDescription.trim()
                                        }
                                        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#a66a4c] px-6 text-sm font-semibold text-white transition hover:bg-[#7d4d38] disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        {savingEdit ? (
                                            <>
                                                <Loader2
                                                    size={
                                                        17
                                                    }
                                                    className="animate-spin"
                                                />
                                                Enregistrement...
                                            </>
                                        ) : (
                                            <>
                                                <Save
                                                    size={
                                                        17
                                                    }
                                                />
                                                Enregistrer
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

// =====================================================
// SLIDER CARD
// =====================================================

function SliderCard({
    slider,
    onEdit,
    onDelete,
}: {
    slider: Slider;
    onEdit: (slider: Slider) => void;
    onDelete: (id: number) => void;
}) {
    return (
        <div className="group overflow-hidden rounded-2xl border border-[#eadfd8] bg-white shadow-[0_8px_30px_rgba(75,49,39,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_14px_40px_rgba(75,49,39,0.12)]">

            {/* IMAGE */}

            <div className="relative h-56 overflow-hidden bg-[#f7f0e9]">
                <img
                    src={
                        slider.image_url ||
                        "/placeholder.png"
                    }
                    alt={slider.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />

                <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#2b211f]/45 to-transparent" />

                <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full border border-white/40 bg-white/85 px-3 py-1.5 text-xs font-semibold text-[#7d4d38] backdrop-blur">
                    <PlaySquare size={13} />
                    Slider
                </div>
            </div>

            {/* CONTENT */}

            <div className="p-5">
                <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                        <p className="mb-1 text-xs font-medium uppercase tracking-[0.12em] text-[#a66a4c]">
                            Accueil
                        </p>

                        <h2 className="font-display text-xl font-semibold text-[#2b211f]">
                            {slider.title}
                        </h2>
                    </div>

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f7f0e9] text-[#a66a4c]">
                        <Layers3 size={19} />
                    </div>
                </div>

                <p className="mt-3 line-clamp-3 min-h-[72px] text-sm leading-6 text-[#6f625d]">
                    {slider.description}
                </p>

                {/* ACTIONS */}

                <div className="mt-5 flex items-center justify-between border-t border-[#f0e5df] pt-4">
                    <span className="text-xs text-[#8b7d77]">
                        ID #{slider.id}
                    </span>

                    <div className="flex items-center gap-2">
                        <EditSliderBtn
                            slider={slider}
                            onClick={onEdit}
                        />

                        <button
                            type="button"
                            onClick={() =>
                                onDelete(
                                    slider.id
                                )
                            }
                            aria-label={`Supprimer ${slider.title}`}
                            title="Supprimer"
                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#eadfd8] bg-white text-[#a94b4b] transition hover:border-[#d9aaaa] hover:bg-[#fff7f7]"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// =====================================================
// STAT CARD
// =====================================================

function SliderStat({
    icon,
    label,
    value,
    description,
}: {
    icon: React.ReactNode;
    label: string;
    value: number;
    description: string;
}) {
    return (
        <div className="rounded-2xl border border-[#eadfd8] bg-white p-5 shadow-[0_8px_30px_rgba(75,49,39,0.06)]">
            <div className="flex items-start justify-between gap-4">

                <div>
                    <p className="text-sm font-medium text-[#6f625d]">
                        {label}
                    </p>

                    <p className="mt-2 text-3xl font-semibold tracking-tight text-[#2b211f]">
                        {value}
                    </p>

                    <p className="mt-1 text-xs text-[#8b7d77]">
                        {description}
                    </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f7f0e9] text-[#a66a4c]">
                    {icon}
                </div>
            </div>
        </div>
    );
}