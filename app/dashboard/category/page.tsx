"use client";

import {
    FolderOpen,
    ImagePlus,
    Layers3,
    Loader2,
    Pencil,
    Search,
    Save,
    Trash2,
    X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import AjouteCategoryBtn from "@/_Components/AjouteCategoryBtn";
import EditBtnCategory from "@/_Components/EditBtnCategory";

type Category = {
    id: number;
    nom: string;
    image_url: string;
};

export default function CategoryPage() {
    const [category, setCategory] = useState<Category[]>([]);
    const [search, setSearch] = useState("");

    const [loading, setLoading] = useState(true);

    // =========================
    // MODIFICATION
    // =========================

    const [editingCategory, setEditingCategory] =
        useState<Category | null>(null);

    const [savingEdit, setSavingEdit] = useState(false);
    const [uploadingEdit, setUploadingEdit] = useState(false);

    const [editNom, setEditNom] = useState("");
    const [editImageUrl, setEditImageUrl] = useState("");

    // =========================
    // CHARGEMENT
    // =========================

    useEffect(() => {
        const fetchCategory = async () => {
            try {
                setLoading(true);

                const token = localStorage.getItem("token");

                const res = await fetch("/api/category", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await res.json();

                if (!res.ok) {
                    throw new Error(
                        data.message ||
                            "Impossible de charger les catégories"
                    );
                }

                setCategory(
                    Array.isArray(data.data)
                        ? data.data
                        : []
                );
            } catch (error: any) {
                console.error(error);

                toast.error(
                    error.message ||
                        "Erreur lors du chargement des catégories"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchCategory();
    }, []);

    // =========================
    // RECHERCHE
    // =========================

    const filteredCategories = useMemo(() => {
        const value = search.trim().toLowerCase();

        if (!value) {
            return category;
        }

        return category.filter((item) =>
            item.nom?.toLowerCase().includes(value)
        );
    }, [category, search]);

    // =========================
    // STATISTIQUES
    // =========================

    const totalCategories = category.length;

    const categoriesWithImage = category.filter(
        (item) => Boolean(item.image_url)
    ).length;

    const categoriesWithoutImage =
        totalCategories - categoriesWithImage;

    // =========================
    // OUVRIR MODIFICATION
    // =========================

    const handleOpenEdit = (item: Category) => {
        setEditingCategory(item);

        setEditNom(item.nom || "");
        setEditImageUrl(item.image_url || "");
    };

    // =========================
    // FERMER MODIFICATION
    // =========================

    const handleCloseEdit = () => {
        if (savingEdit || uploadingEdit) {
            return;
        }

        setEditingCategory(null);
    };

    // =========================
    // UPLOAD IMAGE
    // =========================

    const handleEditImageUpload = async (
        file: File
    ) => {
        try {
            setUploadingEdit(true);

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
                throw new Error(
                    data.message ||
                        "Erreur lors du téléchargement"
                );
            }

            setEditImageUrl(data.imageUrl);

            toast.success("Image téléchargée");
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

        if (!editingCategory) {
            return;
        }

        if (!editNom.trim()) {
            toast.error(
                "Le nom de la catégorie est requis."
            );
            return;
        }

        if (!editImageUrl.trim()) {
            toast.error(
                "Une image est requise."
            );
            return;
        }

        const loadingToast = toast.loading(
            "Modification de la catégorie..."
        );

        try {
            setSavingEdit(true);

            const token = localStorage.getItem("token");

            const res = await fetch(
                `/api/category/${editingCategory.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type":
                            "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        nom: editNom.trim(),
                        image_url:
                            editImageUrl.trim(),
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

            const updatedCategory: Category = {
                ...editingCategory,
                nom: editNom.trim(),
                image_url:
                    editImageUrl.trim(),
            };

            setCategory((prev) =>
                prev.map((item) =>
                    item.id === updatedCategory.id
                        ? updatedCategory
                        : item
                )
            );

            toast.dismiss(loadingToast);

            toast.success(
                data.message ||
                    "Catégorie modifiée avec succès"
            );

            setEditingCategory(null);
        } catch (error: any) {
            toast.dismiss(loadingToast);

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

    const handleDelete = async (id: number) => {
        const item = category.find(
            (categoryItem) =>
                categoryItem.id === id
        );

        if (!item) {
            return;
        }

        if (
            !confirm(
                `Voulez-vous vraiment supprimer la catégorie « ${item.nom} » ?`
            )
        ) {
            return;
        }

        const loadingToast = toast.loading(
            "Suppression..."
        );

        try {
            const token =
                localStorage.getItem("token");

            const res = await fetch(
                `/api/category/${id}`,
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

            setCategory((prev) =>
                prev.filter(
                    (item) => item.id !== id
                )
            );

            toast.dismiss(loadingToast);

            toast.success(
                data.message ||
                    "Catégorie supprimée"
            );
        } catch (error: any) {
            toast.dismiss(loadingToast);

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
                                        className="h-28 rounded-2xl bg-white border border-[#eadfd8]"
                                    />
                                )
                            )}
                        </div>

                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                            {[1, 2, 3, 4, 5, 6].map(
                                (item) => (
                                    <div
                                        key={item}
                                        className="h-80 rounded-2xl bg-white border border-[#eadfd8]"
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
                            Catégories
                        </h1>

                        <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6f625d]">
                            Organisez les produits de votre
                            boutique avec des catégories
                            claires et élégantes.
                        </p>
                    </div>

                    <AjouteCategoryBtn />
                </div>

                {/* ================= STATS ================= */}

                <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

                    <CategoryStat
                        icon={
                            <Layers3 size={20} />
                        }
                        label="Total catégories"
                        value={totalCategories}
                        description="Catégories enregistrées"
                    />

                    <CategoryStat
                        icon={
                            <ImagePlus size={20} />
                        }
                        label="Avec image"
                        value={categoriesWithImage}
                        description="Catégories illustrées"
                    />

                    <CategoryStat
                        icon={
                            <FolderOpen size={20} />
                        }
                        label="Sans image"
                        value={
                            categoriesWithoutImage
                        }
                        description="À compléter"
                    />
                </div>

                {/* ================= SEARCH ================= */}

                <div className="mb-8 rounded-2xl border border-[#eadfd8] bg-white p-4 shadow-[0_8px_30px_rgba(75,49,39,0.06)]">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                        <div>
                            <h2 className="font-display text-xl font-semibold text-[#2b211f]">
                                Vos catégories
                            </h2>

                            <p className="mt-1 text-sm text-[#8b7d77]">
                                {filteredCategories.length}{" "}
                                catégorie
                                {filteredCategories.length >
                                1
                                    ? "s"
                                    : ""}{" "}
                                affichée
                                {filteredCategories.length >
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
                                placeholder="Rechercher une catégorie..."
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

                {/* ================= CATEGORIES ================= */}

                {filteredCategories.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-[#d8c4b8] bg-white px-6 py-16 text-center">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f7f0e9] text-[#a66a4c]">
                            <FolderOpen
                                size={25}
                            />
                        </div>

                        <h3 className="mt-4 font-display text-xl font-semibold text-[#2b211f]">
                            Aucune catégorie trouvée
                        </h3>

                        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#6f625d]">
                            {search
                                ? "Aucune catégorie ne correspond à votre recherche."
                                : "Commencez par créer votre première catégorie."}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                        {filteredCategories.map(
                            (item) => (
                                <CategoryCard
                                    key={item.id}
                                    category={item}
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

                {editingCategory && (
                    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">

                        {/* BACKDROP */}

                        <div
                            className="absolute inset-0 bg-[#2b211f]/45 backdrop-blur-sm"
                            onClick={
                                handleCloseEdit
                            }
                        />

                        {/* MODAL */}

                        <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-2xl border border-[#eadfd8] bg-white shadow-2xl">

                            {/* HEADER */}

                            <div className="flex items-center justify-between border-b border-[#eadfd8] px-6 py-5">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#a66a4c]">
                                        Gestion
                                    </p>

                                    <h2 className="mt-1 font-display text-xl font-semibold text-[#2b211f]">
                                        Modifier la catégorie
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
                            >
                                <div className="space-y-5 p-6">

                                    {/* IMAGE */}

                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-[#5a4740]">
                                            Image de la catégorie
                                        </label>

                                        <div className="overflow-hidden rounded-xl border border-[#eadfd8] bg-[#f7f0e9]">
                                            {editImageUrl ? (
                                                <img
                                                    src={
                                                        editImageUrl
                                                    }
                                                    alt={
                                                        editNom
                                                    }
                                                    className="h-52 w-full object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-52 items-center justify-center text-[#a66a4c]">
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

                                    {/* NOM */}

                                    <div>
                                        <label
                                            htmlFor="edit-category-name"
                                            className="mb-2 block text-sm font-medium text-[#5a4740]"
                                        >
                                            Nom de la catégorie
                                        </label>

                                        <input
                                            id="edit-category-name"
                                            type="text"
                                            value={
                                                editNom
                                            }
                                            onChange={(
                                                e
                                            ) =>
                                                setEditNom(
                                                    e
                                                        .target
                                                        .value
                                                )
                                            }
                                            required
                                            className="w-full rounded-xl border border-[#eadfd8] bg-[#fdfaf7] px-4 py-3 text-sm text-[#2b211f] outline-none transition focus:border-[#a66a4c] focus:ring-2 focus:ring-[#a66a4c]/10"
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
                                            !editNom.trim()
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
// CATEGORY CARD
// =====================================================

function CategoryCard({
    category,
    onEdit,
    onDelete,
}: {
    category: Category;
    onEdit: (category: Category) => void;
    onDelete: (id: number) => void;
}) {
    return (
        <div className="group overflow-hidden rounded-2xl border border-[#eadfd8] bg-white shadow-[0_8px_30px_rgba(75,49,39,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_14px_40px_rgba(75,49,39,0.12)]">

            {/* IMAGE */}

            <div className="relative h-52 overflow-hidden bg-[#f7f0e9]">
                <img
                    src={
                        category.image_url ||
                        "/placeholder.png"
                    }
                    alt={category.nom}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />

                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#2b211f]/35 to-transparent" />

                <div className="absolute left-4 top-4 rounded-full border border-white/40 bg-white/85 px-3 py-1.5 text-xs font-semibold text-[#7d4d38] backdrop-blur">
                    Catégorie
                </div>
            </div>

            {/* CONTENT */}

            <div className="p-5">
                <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                        <p className="mb-1 text-xs font-medium uppercase tracking-[0.12em] text-[#a66a4c]">
                            Collection
                        </p>

                        <h2 className="truncate font-display text-xl font-semibold text-[#2b211f]">
                            {category.nom}
                        </h2>
                    </div>

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f7f0e9] text-[#a66a4c]">
                        <Layers3 size={19} />
                    </div>
                </div>

                {/* ACTIONS */}

                <div className="mt-5 flex items-center justify-between border-t border-[#f0e5df] pt-4">
                    <span className="text-xs text-[#8b7d77]">
                        ID #{category.id}
                    </span>

                    <div className="flex items-center gap-2">
                        <EditBtnCategory
                            category={category}
                            onClick={onEdit}
                        />

                        <button
                            type="button"
                            onClick={() =>
                                onDelete(category.id)
                            }
                            aria-label={`Supprimer ${category.nom}`}
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

function CategoryStat({
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