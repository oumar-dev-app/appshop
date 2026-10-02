"use client";

import {
    AlertTriangle,
    Archive,
    ChevronLeft,
    ChevronRight,
    ImagePlus,
    Loader2,
    Package,
    Save,
    Search,
    ShoppingBag,
    Trash2,
    TrendingDown,
    TrendingUp,
    X,
} from "lucide-react";
import { useEffect, useState } from "react";
import AjouteProduitBtn from "@/_Components/AjouteProduitBtn";
import { toast } from "sonner";
import EditBtn from "@/_Components/EditBtn";

type Stats = {
    total: number;
    inStock: number;
    outOfStock: number;
    stockValue: number;
    maxPrice: number;
    minPrice: number;
};

type Produit = {
    id: number;
    nom: string;
    description: string;
    stock: number;
    prix: number;
    image_url: string;
    category_id: string;
};

export default function ProduitsPage() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [produits, setProduits] = useState<Produit[]>([]);
    const [search, setSearch] = useState("");

    const [editingProduct, setEditingProduct] =
        useState<Produit | null>(null);

    const [savingEdit, setSavingEdit] = useState(false);
    const [uploadingEdit, setUploadingEdit] = useState(false);

    const [editNom, setEditNom] = useState("");
    const [editDescription, setEditDescription] = useState("");
    const [editStock, setEditStock] = useState(0);
    const [editPrix, setEditPrix] = useState(0);
    const [editImageUrl, setEditImageUrl] = useState("");

    const [loading, setLoading] = useState(true);
    const [loadingProducts, setLoadingProducts] = useState(true);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    // 📊 STATISTIQUES
    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem("token");

                const res = await fetch("/api/produits/stats", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await res.json();
                setStats(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    // 📦 PRODUITS
    useEffect(() => {
        const fetchProduits = async () => {
            try {
                const token = localStorage.getItem("token");

                const res = await fetch("/api/produits", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await res.json();

                setProduits(data.data || []);
            } catch (error) {
                console.error(error);
            } finally {
                setLoadingProducts(false);
            }
        };

        fetchProduits();
    }, []);

    // 🔎 RESET PAGINATION LORS D'UNE RECHERCHE
    useEffect(() => {
        setCurrentPage(1);
    }, [search]);

    // 🗑️ SUPPRESSION
    const handleDelete = async (id: number) => {
        if (!confirm("Voulez-vous vraiment supprimer ce produit ?")) {
            return;
        }

        const loadingToast = toast.loading("Suppression...");

        try {
            const token = localStorage.getItem("token");

            const res = await fetch(`/api/produits/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message);
            }

            setProduits((prev) => prev.filter((p) => p.id !== id));

            toast.dismiss(loadingToast);
            toast.success(data.message || "Produit supprimé");
        } catch (error: any) {
            toast.dismiss(loadingToast);
            toast.error(
                error.message || "Erreur lors de la suppression"
            );
            console.error(error);
        }
    };

    // ============================================================
    // OUVRIR LE MODAL D'ÉDITION
    // ============================================================

    const handleOpenEdit = (produit: Produit) => {
        setEditingProduct(produit);

        setEditNom(produit.nom || "");
        setEditDescription(produit.description || "");
        setEditStock(Number(produit.stock) || 0);
        setEditPrix(Number(produit.prix) || 0);
        setEditImageUrl(produit.image_url || "");
    };

    // ============================================================
    // FERMER LE MODAL
    // ============================================================

    const handleCloseEdit = () => {
        if (savingEdit || uploadingEdit) return;

        setEditingProduct(null);
    };

    // ============================================================
    // UPLOAD IMAGE
    // ============================================================

    const handleEditImageUpload = async (file: File) => {
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
                    data.message || "Erreur lors de l'upload"
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

    // ============================================================
    // SAUVEGARDE DU PRODUIT
    // ============================================================

    const handleSaveEdit = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        if (!editingProduct) return;

        const loadingToast = toast.loading(
            "Modification du produit..."
        );

        try {
            setSavingEdit(true);

            const token = localStorage.getItem("token");

            const res = await fetch(
                `/api/produits/${editingProduct.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        nom: editNom,
                        description: editDescription,
                        stock: editStock,
                        prix: editPrix,
                        image_url: editImageUrl,
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

            const updatedProduit: Produit = {
                ...(data.data || editingProduct),
                id: Number(
                    data.data?.id ?? editingProduct.id
                ),
                nom:
                    data.data?.nom ??
                    editNom,
                description:
                    data.data?.description ??
                    editDescription,
                stock: Number(
                    data.data?.stock ??
                    editStock
                ),
                prix: Number(
                    data.data?.prix ??
                    editPrix
                ),
                image_url:
                    data.data?.image_url ??
                    editImageUrl,
                category_id: String(
                    data.data?.category_id ??
                    editingProduct.category_id ??
                    ""
                ),
            };

            setProduits((prev) =>
                prev.map((produit) =>
                    produit.id === updatedProduit.id
                        ? updatedProduit
                        : produit
                )
            );

            toast.dismiss(loadingToast);

            toast.success(
                data.message ||
                "Produit modifié avec succès"
            );

            setEditingProduct(null);
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

    if (loading) {
        return (
            <div className="min-h-screen bg-[#fdfaf7] flex items-center justify-center">
                <div className="text-center">
                    <div className="mx-auto mb-4 h-10 w-10 rounded-full border-2 border-[#ead8c0] border-t-[#a66a4c] animate-spin" />

                    <p className="text-sm font-medium text-[#6f625d]">
                        Chargement des statistiques...
                    </p>
                </div>
            </div>
        );
    }

    if (!stats) {
        return (
            <div className="min-h-screen bg-[#fdfaf7] px-4 py-10">
                <div className="mx-auto max-w-7xl rounded-2xl border border-[#eadfd8] bg-white p-8 text-center shadow-[0_8px_30px_rgba(75,49,39,0.06)]">
                    <Package
                        size={38}
                        className="mx-auto mb-3 text-[#a66a4c]"
                    />

                    <h2 className="font-[Playfair_Display] text-xl font-semibold text-[#2b211f]">
                        Aucune donnée disponible
                    </h2>

                    <p className="mt-2 text-sm text-[#6f625d]">
                        Impossible de récupérer les statistiques des produits.
                    </p>
                </div>
            </div>
        );
    }

    const filteredProducts = produits.filter((p) =>
        p.nom.toLowerCase().includes(search.toLowerCase())
    );

    const totalPages = Math.max(
        1,
        Math.ceil(filteredProducts.length / itemsPerPage)
    );

    const paginatedProducts = filteredProducts.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="min-h-screen bg-[#fdfaf7]">
            <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

                {/* =====================================================
                        HEADER
                    ====================================================== */}
                <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">

                    <div>
                        <div className="mb-2 flex items-center gap-2">
                            <span className="h-px w-8 bg-[#d8b58a]" />

                            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#a66a4c]">
                                Mini Luxe Parfum
                            </span>
                        </div>

                        <h1 className="font-[Playfair_Display] text-3xl font-semibold tracking-tight text-[#2b211f] sm:text-4xl">
                            Gestion des produits
                        </h1>

                        <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6f625d]">
                            Gérez votre produits, vos prix et vos stocks
                            depuis votre espace d’administration.
                        </p>
                    </div>

                    <div className="shrink-0">
                        <AjouteProduitBtn />
                    </div>
                </div>

                {/* =====================================================
                        STATISTIQUES PRINCIPALES
                    ====================================================== */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

                    <StatCard
                        title="Total produits"
                        value={stats.total}
                        icon={<ShoppingBag size={21} />}
                        description="Produits du catalogue"
                        accent="bronze"
                    />

                    <StatCard
                        title="En stock"
                        value={stats.inStock}
                        icon={<Package size={21} />}
                        description="Produits disponibles"
                        accent="champagne"
                    />

                    <StatCard
                        title="Rupture"
                        value={stats.outOfStock}
                        icon={<AlertTriangle size={21} />}
                        description="Produits à réapprovisionner"
                        accent="rose"
                    />

                    <StatCard
                        title="Valeur du stock"
                        value={`${(stats.stockValue ?? 0).toLocaleString()} FCFA`}
                        icon={<Archive size={21} />}
                        description="Valeur totale estimée"
                        accent="dark"
                    />
                </div>

                {/* =====================================================
                        PRIX
                    ====================================================== */}
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">

                    <PriceCard
                        title="Prix minimum"
                        value={`${(stats.minPrice ?? 0).toLocaleString()} FCFA`}
                        icon={<TrendingDown size={20} />}
                        description="Tarif le plus bas du catalogue"
                    />

                    <PriceCard
                        title="Prix maximum"
                        value={`${(stats.maxPrice ?? 0).toLocaleString()} FCFA`}
                        icon={<TrendingUp size={20} />}
                        description="Tarif le plus élevé du catalogue"
                    />
                </div>

                {/* =====================================================
                        BARRE DE RECHERCHE
                    ====================================================== */}
                <div className="mt-10 rounded-2xl border border-[#eadfd8] bg-white p-4 shadow-[0_8px_30px_rgba(75,49,39,0.06)] sm:p-5">

                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                        <div>
                            <h2 className="font-[Playfair_Display] text-xl font-semibold text-[#2b211f]">
                                Votre catalogue
                            </h2>

                            <p className="mt-1 text-xs text-[#8b7d77]">
                                {filteredProducts.length} produit
                                {filteredProducts.length > 1 ? "s" : ""} trouvé
                                {filteredProducts.length > 1 ? "s" : ""}
                            </p>
                        </div>

                        <div className="relative w-full lg:max-w-md">
                            <Search
                                size={18}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a66a4c]"
                            />

                            <input
                                type="text"
                                placeholder="Rechercher un produit..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="
                                        h-12
                                        w-full
                                        rounded-xl
                                        border
                                        border-[#eadfd8]
                                        bg-[#fdfaf7]
                                        pl-11
                                        pr-4
                                        text-sm
                                        text-[#2b211f]
                                        outline-none
                                        transition
                                        placeholder:text-[#a89b95]
                                        focus:border-[#a66a4c]
                                        focus:bg-white
                                        focus:ring-4
                                        focus:ring-[#a66a4c]/10
                                    "
                            />
                        </div>
                    </div>
                </div>

                {/* =====================================================
                        PRODUITS
                    ====================================================== */}
                <div className="mt-6">

                    {loadingProducts ? (
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                            {Array.from({ length: 6 }).map((_, index) => (
                                <ProductSkeleton key={index} />
                            ))}
                        </div>
                    ) : paginatedProducts.length === 0 ? (
                        <EmptyProducts search={search} />
                    ) : (
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">

                            {paginatedProducts.map((p) => (
                                <ProductCard
                                    key={p.id}
                                    produit={p}
                                    onDelete={handleDelete}
                                    onEdit={handleOpenEdit}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* =====================================================
                        PAGINATION
                    ====================================================== */}
                {filteredProducts.length > itemsPerPage && (
                    <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-2xl border border-[#eadfd8] bg-white px-5 py-4 shadow-[0_8px_30px_rgba(75,49,39,0.05)] sm:flex-row">

                        <p className="text-xs text-[#6f625d]">
                            Page{" "}
                            <span className="font-semibold text-[#2b211f]">
                                {currentPage}
                            </span>{" "}
                            sur{" "}
                            <span className="font-semibold text-[#2b211f]">
                                {totalPages}
                            </span>
                        </p>

                        <div className="flex items-center gap-2">

                            <button
                                type="button"
                                onClick={() =>
                                    setCurrentPage((prev) =>
                                        Math.max(prev - 1, 1)
                                    )
                                }
                                disabled={currentPage === 1}
                                className="
                                        flex
                                        h-10
                                        items-center
                                        gap-2
                                        rounded-xl
                                        border
                                        border-[#eadfd8]
                                        bg-white
                                        px-3
                                        text-sm
                                        font-medium
                                        text-[#5a4740]
                                        transition
                                        hover:border-[#a66a4c]
                                        hover:text-[#a66a4c]
                                        disabled:cursor-not-allowed
                                        disabled:opacity-40
                                    "
                            >
                                <ChevronLeft size={17} />
                                <span className="hidden sm:inline">
                                    Précédent
                                </span>
                            </button>

                            <div className="flex h-10 min-w-10 items-center justify-center rounded-xl bg-[#a66a4c] px-3 text-sm font-semibold text-white">
                                {currentPage}
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    setCurrentPage((prev) =>
                                        Math.min(prev + 1, totalPages)
                                    )
                                }
                                disabled={currentPage === totalPages}
                                className="
                                        flex
                                        h-10
                                        items-center
                                        gap-2
                                        rounded-xl
                                        border
                                        border-[#eadfd8]
                                        bg-white
                                        px-3
                                        text-sm
                                        font-medium
                                        text-[#5a4740]
                                        transition
                                        hover:border-[#a66a4c]
                                        hover:text-[#a66a4c]
                                        disabled:cursor-not-allowed
                                        disabled:opacity-40
                                    "
                            >
                                <span className="hidden sm:inline">
                                    Suivant
                                </span>
                                <ChevronRight size={17} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
            {/* ============================================================
    MODAL MODIFICATION PRODUIT
============================================================ */}

            {editingProduct && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">

                    {/* BACKDROP */}
                    <div
                        className="absolute inset-0 bg-[#2b211f]/60 backdrop-blur-sm"
                        onClick={handleCloseEdit}
                    />

                    {/* MODAL */}
                    <div
                        className="
                relative
                z-10
                flex
                max-h-[92vh]
                w-full
                max-w-xl
                flex-col
                overflow-hidden
                rounded-2xl
                border
                border-[#eadfd8]
                bg-[#fdfaf7]
                shadow-[0_25px_80px_rgba(43,33,31,0.25)]
            "
                    >

                        {/* HEADER */}
                        <div className="flex items-center justify-between border-b border-[#eadfd8] bg-white px-5 py-4 sm:px-6">

                            <div>
                                <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#a66a4c]">
                                    Mini Luxe Parfum
                                </p>

                                <h2 className="font-[Playfair_Display] text-xl font-semibold text-[#2b211f]">
                                    Modifier le produit
                                </h2>
                            </div>

                            <button
                                type="button"
                                onClick={handleCloseEdit}
                                disabled={
                                    savingEdit ||
                                    uploadingEdit
                                }
                                className="
                        flex
                        h-9
                        w-9
                        items-center
                        justify-center
                        rounded-lg
                        border
                        border-[#eadfd8]
                        text-[#6f625d]
                        transition
                        hover:border-[#a66a4c]
                        hover:text-[#a66a4c]
                        disabled:opacity-50
                    "
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* BODY */}
                        <div className="overflow-y-auto px-5 py-5 sm:px-6">

                            <form
                                onSubmit={handleSaveEdit}
                                className="flex flex-col gap-4"
                            >

                                {/* IMAGE */}
                                <div>
                                    <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.08em] text-[#6f625d]">
                                        Image
                                    </label>

                                    <div className="overflow-hidden rounded-xl border border-[#eadfd8] bg-white">

                                        {editImageUrl ? (
                                            <div className="relative h-48 bg-[#f7f0e9]">
                                                <img
                                                    src={editImageUrl}
                                                    alt={editNom}
                                                    className="h-full w-full object-cover"
                                                />
                                            </div>
                                        ) : (
                                            <div className="flex h-48 flex-col items-center justify-center bg-[#f7f0e9] text-[#9b8b84]">
                                                <ImagePlus size={30} />

                                                <span className="mt-2 text-xs">
                                                    Aucune image
                                                </span>
                                            </div>
                                        )}

                                        <div className="p-3">
                                            <label
                                                className="
                                        flex
                                        h-10
                                        cursor-pointer
                                        items-center
                                        justify-center
                                        gap-2
                                        rounded-lg
                                        border
                                        border-[#d8c8bf]
                                        bg-white
                                        text-xs
                                        font-semibold
                                        text-[#a66a4c]
                                        transition
                                        hover:border-[#a66a4c]
                                        hover:bg-[#fdfaf7]
                                    "
                                            >
                                                {uploadingEdit ? (
                                                    <>
                                                        <Loader2
                                                            size={15}
                                                            className="animate-spin"
                                                        />
                                                        Upload...
                                                    </>
                                                ) : (
                                                    <>
                                                        <ImagePlus size={15} />
                                                        Changer l'image
                                                    </>
                                                )}

                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    disabled={uploadingEdit}
                                                    className="hidden"
                                                    onChange={async (
                                                        e
                                                    ) => {
                                                        const file =
                                                            e.target
                                                                .files?.[0];

                                                        if (!file)
                                                            return;

                                                        await handleEditImageUpload(
                                                            file
                                                        );

                                                        e.target.value =
                                                            "";
                                                    }}
                                                />
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                {/* NOM */}
                                <div>
                                    <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.08em] text-[#6f625d]">
                                        Nom
                                    </label>

                                    <input
                                        type="text"
                                        value={editNom}
                                        onChange={(e) =>
                                            setEditNom(
                                                e.target.value
                                            )
                                        }
                                        placeholder="Nom du produit"
                                        className="
                                h-11
                                w-full
                                rounded-xl
                                border
                                border-[#eadfd8]
                                bg-white
                                px-4
                                text-sm
                                text-[#2b211f]
                                outline-none
                                transition
                                placeholder:text-[#a89b95]
                                focus:border-[#a66a4c]
                                focus:ring-4
                                focus:ring-[#a66a4c]/10
                            "
                                    />
                                </div>

                                {/* DESCRIPTION */}
                                <div>
                                    <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.08em] text-[#6f625d]">
                                        Description
                                    </label>

                                    <textarea
                                        value={editDescription}
                                        onChange={(e) =>
                                            setEditDescription(
                                                e.target.value
                                            )
                                        }
                                        placeholder="Description du produit"
                                        className="
                                min-h-32
                                w-full
                                resize-y
                                rounded-xl
                                border
                                border-[#eadfd8]
                                bg-white
                                px-4
                                py-3
                                text-sm
                                leading-6
                                text-[#2b211f]
                                outline-none
                                transition
                                placeholder:text-[#a89b95]
                                focus:border-[#a66a4c]
                                focus:ring-4
                                focus:ring-[#a66a4c]/10
                            "
                                    />
                                </div>

                                {/* PRIX + STOCK */}
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                                    <div>
                                        <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.08em] text-[#6f625d]">
                                            Prix
                                        </label>

                                        <div className="relative">
                                            <input
                                                type="number"
                                                min="0"
                                                value={editPrix}
                                                onChange={(e) =>
                                                    setEditPrix(
                                                        Number(
                                                            e.target.value
                                                        )
                                                    )
                                                }
                                                className="
                                        h-11
                                        w-full
                                        rounded-xl
                                        border
                                        border-[#eadfd8]
                                        bg-white
                                        px-4
                                        pr-16
                                        text-sm
                                        text-[#2b211f]
                                        outline-none
                                        transition
                                        focus:border-[#a66a4c]
                                        focus:ring-4
                                        focus:ring-[#a66a4c]/10
                                    "
                                            />

                                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-semibold text-[#8b7d77]">
                                                FCFA
                                            </span>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.08em] text-[#6f625d]">
                                            Stock
                                        </label>

                                        <input
                                            type="number"
                                            min="0"
                                            value={editStock}
                                            onChange={(e) =>
                                                setEditStock(
                                                    Number(
                                                        e.target.value
                                                    )
                                                )
                                            }
                                            className="
                                    h-11
                                    w-full
                                    rounded-xl
                                    border
                                    border-[#eadfd8]
                                    bg-white
                                    px-4
                                    text-sm
                                    text-[#2b211f]
                                    outline-none
                                    transition
                                    focus:border-[#a66a4c]
                                    focus:ring-4
                                    focus:ring-[#a66a4c]/10
                                "
                                        />
                                    </div>
                                </div>

                                {/* ACTIONS */}
                                <div className="mt-2 flex flex-col-reverse gap-3 border-t border-[#eadfd8] pt-5 sm:flex-row sm:justify-end">

                                    <button
                                        type="button"
                                        onClick={handleCloseEdit}
                                        disabled={
                                            savingEdit ||
                                            uploadingEdit
                                        }
                                        className="
                                h-11
                                rounded-xl
                                border
                                border-[#d8c8bf]
                                bg-white
                                px-6
                                text-sm
                                font-semibold
                                text-[#6f625d]
                                transition
                                hover:border-[#a66a4c]
                                hover:text-[#a66a4c]
                                disabled:opacity-50
                            "
                                    >
                                        Annuler
                                    </button>

                                    <button
                                        type="submit"
                                        disabled={
                                            savingEdit ||
                                            uploadingEdit
                                        }
                                        className="
                                flex
                                h-11
                                items-center
                                justify-center
                                gap-2
                                rounded-xl
                                bg-[#a66a4c]
                                px-6
                                text-sm
                                font-semibold
                                text-white
                                transition
                                hover:bg-[#7d4d38]
                                disabled:cursor-not-allowed
                                disabled:opacity-50
                            "
                                    >
                                        {savingEdit ? (
                                            <>
                                                <Loader2
                                                    size={16}
                                                    className="animate-spin"
                                                />
                                                Modification...
                                            </>
                                        ) : (
                                            <>
                                                <Save size={16} />
                                                Modifier
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

/* ============================================================
STAT CARD
============================================================ */

function StatCard({
    title,
    value,
    icon,
    description,
    accent,
}: {
    title: string;
    value: React.ReactNode;
    icon: React.ReactNode;
    description: string;
    accent: "bronze" | "champagne" | "rose" | "dark";
}) {
    const accentStyles = {
        bronze: {
            icon: "bg-[#f2e5e1] text-[#a66a4c]",
            line: "bg-[#a66a4c]",
        },
        champagne: {
            icon: "bg-[#f7f0e9] text-[#9b7659]",
            line: "bg-[#d8b58a]",
        },
        rose: {
            icon: "bg-[#f2e5e1] text-[#a85e57]",
            line: "bg-[#d9b8b0]",
        },
        dark: {
            icon: "bg-[#f7f0e9] text-[#5a4740]",
            line: "bg-[#7d4d38]",
        },
    };

    const style = accentStyles[accent];

    return (
        <div className="group relative overflow-hidden rounded-2xl border border-[#eadfd8] bg-white p-5 shadow-[0_8px_30px_rgba(75,49,39,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_14px_35px_rgba(75,49,39,0.10)]">

            <div
                className={`absolute left-0 top-0 h-full w-1 ${style.line}`}
            />

            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="text-xs font-medium uppercase tracking-[0.08em] text-[#8b7d77]">
                        {title}
                    </p>

                    <h2 className="mt-2 font-[Playfair_Display] text-2xl font-semibold text-[#2b211f]">
                        {value}
                    </h2>

                    <p className="mt-1 text-xs text-[#8b7d77]">
                        {description}
                    </p>
                </div>

                <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${style.icon}`}
                >
                    {icon}
                </div>
            </div>
        </div>
    );
}

/* ============================================================
PRICE CARD
============================================================ */

function PriceCard({
    title,
    value,
    icon,
    description,
}: {
    title: string;
    value: string;
    icon: React.ReactNode;
    description: string;
}) {
    return (
        <div className="rounded-2xl border border-[#eadfd8] bg-gradient-to-br from-white to-[#fdfaf7] p-5 shadow-[0_8px_30px_rgba(75,49,39,0.05)]">
            <div className="flex items-center gap-4">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#f7f0e9] text-[#a66a4c]">
                    {icon}
                </div>

                <div className="min-w-0">
                    <p className="text-xs font-medium uppercase tracking-[0.08em] text-[#8b7d77]">
                        {title}
                    </p>

                    <p className="mt-1 font-[Playfair_Display] text-xl font-semibold text-[#2b211f]">
                        {value}
                    </p>

                    <p className="mt-1 text-xs text-[#8b7d77]">
                        {description}
                    </p>
                </div>
            </div>
        </div>
    );
}

/* ============================================================
PRODUCT CARD
============================================================ */

function ProductCard({
    produit,
    onDelete,
    onEdit,
}: {
    produit: Produit;
    onDelete: (id: number) => void;
    onEdit: (produit: Produit) => void;
}) {
    const inStock = produit.stock > 0;

    return (
        <div className="group overflow-hidden rounded-2xl border border-[#eadfd8] bg-white shadow-[0_8px_30px_rgba(75,49,39,0.07)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(75,49,39,0.12)]">

            {/* IMAGE */}
            <div className="relative aspect-[4/3] overflow-hidden bg-[#f7f0e9]">

                <img
                    src={produit.image_url || "/placeholder.png"}
                    alt={produit.nom}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
                />

                {/* overlay */}
                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#2b211f]/30 to-transparent opacity-70" />

                {/* stock */}
                <div className="absolute left-3 top-3">
                    <span
                        className={`
                                inline-flex
                                items-center
                                gap-1.5
                                rounded-full
                                px-3
                                py-1.5
                                text-[11px]
                                font-semibold
                                shadow-sm
                                backdrop-blur-md
                                ${inStock
                                ? "bg-white/90 text-[#547a5b]"
                                : "bg-[#fff5f3]/95 text-[#a94b4b]"
                            }
                            `}
                    >
                        <span
                            className={`h-1.5 w-1.5 rounded-full ${inStock
                                ? "bg-[#547a5b]"
                                : "bg-[#a94b4b]"
                                }`}
                        />

                        {inStock
                            ? `${produit.stock} en stock`
                            : "Rupture"}
                    </span>
                </div>
            </div>

            {/* CONTENT */}
            <div className="p-5">

                <div className="min-h-[74px]">
                    <h2 className="line-clamp-2 font-[Playfair_Display] text-xl font-semibold leading-tight text-[#2b211f]">
                        {produit.nom}
                    </h2>

                    {produit.description && (
                        <p className="mt-2 line-clamp-2 text-xs leading-5 text-[#8b7d77]">
                            {produit.description}
                        </p>
                    )}
                </div>

                <div className="mt-4 flex items-end justify-between gap-3 border-t border-[#f0e7e2] pt-4">

                    <div>
                        <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-[#9b8b84]">
                            Prix
                        </p>

                        <p className="mt-1 text-lg font-semibold text-[#a66a4c]">
                            {(produit.prix ?? 0).toLocaleString()}{" "}
                            <span className="text-xs font-medium text-[#7d4d38]">
                                FCFA
                            </span>
                        </p>
                    </div>

                    <div className="text-right">
                        <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-[#9b8b84]">
                            Stock
                        </p>

                        <p
                            className={`mt-1 text-sm font-semibold ${inStock
                                ? "text-[#547a5b]"
                                : "text-[#a94b4b]"
                                }`}
                        >
                            {produit.stock}
                        </p>
                    </div>
                </div>

                {/* ACTIONS */}
                <div className="mt-5 flex items-center justify-between border-t border-[#f0e7e2] pt-4">

                    <span className="text-[11px] text-[#9b8b84]">
                        Produit #{produit.id}
                    </span>

                    <div className="flex items-center gap-2">

                        <EditBtn
                            produit={produit}
                            onClick={onEdit}
                        />

                        <button
                            type="button"
                            onClick={() => onDelete(produit.id)}
                            aria-label={`Supprimer ${produit.nom}`}
                            title="Supprimer"
                            className="
                                    flex
                                    h-9
                                    w-9
                                    items-center
                                    justify-center
                                    rounded-lg
                                    border
                                    border-[#eadfd8]
                                    bg-white
                                    text-[#a94b4b]
                                    transition
                                    hover:border-[#d8aaa4]
                                    hover:bg-[#fff5f3]
                                "
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ============================================================
SKELETON
============================================================ */

function ProductSkeleton() {
    return (
        <div className="overflow-hidden rounded-2xl border border-[#eadfd8] bg-white shadow-[0_8px_30px_rgba(75,49,39,0.05)]">
            <div className="aspect-[4/3] animate-pulse bg-[#f2e5e1]" />

            <div className="space-y-4 p-5">
                <div className="h-5 w-3/4 animate-pulse rounded bg-[#f2e5e1]" />
                <div className="h-3 w-full animate-pulse rounded bg-[#f7f0e9]" />
                <div className="h-3 w-2/3 animate-pulse rounded bg-[#f7f0e9]" />

                <div className="flex justify-between border-t border-[#f0e7e2] pt-4">
                    <div className="h-7 w-28 animate-pulse rounded bg-[#f2e5e1]" />
                    <div className="h-7 w-12 animate-pulse rounded bg-[#f7f0e9]" />
                </div>
            </div>
        </div>
    );
}

/* ============================================================
EMPTY STATE
============================================================ */

function EmptyProducts({ search }: { search: string }) {
    return (
        <div className="rounded-2xl border border-dashed border-[#d8c8bf] bg-white px-6 py-14 text-center shadow-[0_8px_30px_rgba(75,49,39,0.04)]">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f7f0e9] text-[#a66a4c]">
                {search ? (
                    <Search size={24} />
                ) : (
                    <Package size={24} />
                )}
            </div>

            <h3 className="mt-5 font-[Playfair_Display] text-xl font-semibold text-[#2b211f]">
                {search
                    ? "Aucun produit trouvé"
                    : "Votre catalogue est vide"}
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#6f625d]">
                {search
                    ? `Aucun produit ne correspond à « ${search} ». Essayez un autre terme de recherche.`
                    : "Ajoutez votre premier produit pour commencer à construire votre catalogue Mini Luxe."}
            </p>
        </div>
    );
}