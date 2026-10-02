"use client";

import Image from "next/image";
import { Bell, Check, ShoppingBag } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type User = {
    id: number;
    nom: string;
    prenom: string;
    email: string;
    telephone: string;
    role?: string;
};

type Commande = {
    id: number;
    reference: string;
    nom_client: string;
    telephone: string;
    total: number | string;
    status: string;
    mode_commande: string;
    created_at: string;
};

export default function HeaderDashboard() {
    const router = useRouter();

    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const [notifications, setNotifications] = useState<Commande[]>([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const [notificationCount, setNotificationCount] = useState(0);

    const initializedRef = useRef(false);
    const lastOrderIdRef = useRef<number | null>(null);
    const notificationAudioRef = useRef<HTMLAudioElement | null>(null);

    /*
     * ============================================================
     * SON DE NOTIFICATION
     * ============================================================
     */
    const playNotificationSound = () => {
        try {
            if (!notificationAudioRef.current) {
                notificationAudioRef.current = new Audio(
                    "/sounds/notification.mp3"
                );

                notificationAudioRef.current.volume = 0.8;
            }

            const audio = notificationAudioRef.current;

            audio.currentTime = 0;

            const playPromise = audio.play();

            if (playPromise !== undefined) {
                playPromise.catch((error) => {
                    console.warn(
                        "Lecture automatique du son bloquée par le navigateur :",
                        error
                    );
                });
            }
        } catch (error) {
            console.error(
                "Erreur son notification :",
                error
            );
        }
    };

    /*
     * ============================================================
     * FORMAT PRIX
     * ============================================================
     */
    const formatPrice = (value: number | string) => {
        return (
            Number(value).toLocaleString("fr-FR") +
            " FCFA"
        );
    };

    /*
     * ============================================================
     * FORMAT DATE
     * ============================================================
     */
    const formatDate = (date: string) => {
        try {
            return new Date(date).toLocaleString(
                "fr-FR",
                {
                    day: "2-digit",
                    month: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                }
            );
        } catch {
            return date;
        }
    };

    /*
     * ============================================================
     * UTILISATEUR CONNECTÉ
     * ============================================================
     */
    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const token =
                    localStorage.getItem("token");

                if (!token) {
                    setLoading(false);
                    return;
                }

                const res = await fetch("/api/me", {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!res.ok) {
                    throw new Error(
                        "Impossible de récupérer l'utilisateur"
                    );
                }

                const data = await res.json();

                const currentUser =
                    data.data ||
                    data.user ||
                    null;

                setUser(currentUser);
            } catch (error) {
                console.error(
                    "Erreur utilisateur connecté :",
                    error
                );
            } finally {
                setLoading(false);
            }
        };

        fetchCurrentUser();
    }, []);

    /*
     * ============================================================
     * NOTIFICATIONS COMMANDES
     * ============================================================
     */
    useEffect(() => {
        let cancelled = false;

        const checkOrders = async () => {
            try {
                const token = localStorage.getItem("token");

                if (!token) {
                    console.warn(
                        "Aucun token disponible pour vérifier les commandes."
                    );
                    return;
                }

                const res = await fetch(
                    "/api/commandes",
                    {
                        method: "GET",
                        cache: "no-store",
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                if (!res.ok) {
                    console.error(
                        "Erreur API commandes :",
                        res.status
                    );
                    return;
                }

                const data = await res.json();

                const orders: Commande[] =
                    Array.isArray(data?.data)
                        ? data.data
                        : [];

                if (cancelled) {
                    return;
                }

                if (orders.length === 0) {
                    return;
                }

                /*
                 * IDs des commandes actuellement reçues
                 */
                const currentOrderIds = new Set(
                    orders.map((order) => Number(order.id))
                );

                /*
                 * PREMIER CHARGEMENT
                 *
                 * On mémorise toutes les commandes existantes.
                 * Elles ne doivent pas déclencher de notification.
                 */
                if (!initializedRef.current) {
                    initializedRef.current = true;

                    lastOrderIdRef.current =
                        Math.max(
                            ...orders.map((order) =>
                                Number(order.id)
                            )
                        );

                    return;
                }

                const lastOrderId =
                    lastOrderIdRef.current;

                /*
                 * On cherche les commandes dont l'ID
                 * est supérieur au dernier ID connu.
                 */
                const newOrders =
                    orders.filter(
                        (order) =>
                            Number(order.id) >
                            (lastOrderId ?? 0)
                    );

                if (newOrders.length > 0) {
                    console.log(
                        "🔔 Nouvelles commandes détectées :",
                        newOrders
                    );

                    /*
                     * Ajouter les notifications.
                     */
                    setNotifications((prev) => {
                        const merged = [
                            ...newOrders,
                            ...prev,
                        ];

                        const unique =
                            merged.filter(
                                (
                                    order,
                                    index,
                                    array
                                ) =>
                                    array.findIndex(
                                        (item) =>
                                            item.id ===
                                            order.id
                                    ) === index
                            );

                        return unique.slice(0, 10);
                    });

                    /*
                     * Mettre à jour le compteur.
                     */
                    setNotificationCount(
                        (prev) =>
                            prev + newOrders.length
                    );

                    /*
                     * 🔊 SON MP3
                     */
                    playNotificationSound();

                    /*
                     * Titre navigateur.
                     */
                    document.title =
                        "🔔 Nouvelle commande - Mini Luxe";
                }

                /*
                 * Mémoriser le plus grand ID.
                 */
                const newestId = Math.max(
                    ...orders.map((order) =>
                        Number(order.id)
                    )
                );

                lastOrderIdRef.current =
                    newestId;

            } catch (error) {
                console.error(
                    "Erreur vérification commandes :",
                    error
                );
            }
        };

        /*
         * Première vérification.
         */
        checkOrders();

        /*
         * Vérification toutes les 5 secondes.
         */
        const interval = setInterval(
            checkOrders,
            5000
        );

        return () => {
            cancelled = true;
            clearInterval(interval);
        };
    }, []);

    /*
     * ============================================================
     * OUVRIR / FERMER LES NOTIFICATIONS
     * ============================================================
     */
    const handleOpenNotifications = () => {
        setShowNotifications(
            (prev) => !prev
        );

        /*
         * Prépare également le lecteur audio
         * après une interaction utilisateur.
         *
         * Cela aide les navigateurs qui bloquent
         * les lectures automatiques.
         */
        try {
            if (!notificationAudioRef.current) {
                notificationAudioRef.current =
                    new Audio(
                        "/sounds/notification.mp3"
                    );

                notificationAudioRef.current.volume = 0.8;
            }
        } catch (error) {
            console.error(
                "Erreur initialisation audio :",
                error
            );
        }
    };

    /*
     * ============================================================
     * MARQUER LES NOTIFICATIONS COMME LUES
     * ============================================================
     */
    const handleClearNotifications = () => {
        setNotifications([]);
        setNotificationCount(0);

        document.title =
            "Mini Luxe - Dashboard";
    };

    /*
     * ============================================================
     * NOM UTILISATEUR
     * ============================================================
     */
    const fullName = user
        ? `${user.prenom || ""} ${user.nom || ""}`.trim()
        : "";

    const roleLabel =
        user?.role === "super_admin"
            ? "Super administrateur"
            : user?.role === "admin"
                ? "Administrateur"
                : user?.role || "Administrateur";

    return (
        <header className="sticky top-0 z-40 bg-[#fdfaf7]/95 px-4 py-3 backdrop-blur-xl sm:px-6 lg:px-8">
            <div
                className="
                    mx-auto
                    flex
                    max-w-7xl
                    items-center
                    justify-between
                    rounded-2xl
                    border
                    border-[#eadfd8]
                    bg-white
                    px-4
                    py-3
                    shadow-[0_6px_25px_rgba(75,49,39,0.06)]
                    sm:px-5
                "
            >
                {/* TITLE */}
                <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#a66a4c]">
                        Mini Luxe
                    </p>

                    <h1 className="mt-0.5 font-['Playfair_Display'] text-xl font-semibold text-[#2b211f] sm:text-2xl">
                        Dashboard
                    </h1>
                </div>

                {/* RIGHT */}
                <div className="flex items-center gap-3 sm:gap-5">

                    {/* NOTIFICATIONS */}
                    <div className="relative">
                        <button
                            type="button"
                            aria-label="Notifications"
                            onClick={
                                handleOpenNotifications
                            }
                            className="
                                relative
                                flex
                                h-10
                                w-10
                                items-center
                                justify-center
                                rounded-xl
                                border
                                border-[#eadfd8]
                                bg-[#fdfaf7]
                                text-[#6f625d]
                                transition
                                hover:border-[#c89a7c]
                                hover:bg-[#f2e5e1]
                                hover:text-[#a66a4c]
                            "
                        >
                            <Bell size={19} />

                            {notificationCount > 0 && (
                                <span
                                    className="
                                        absolute
                                        -right-1
                                        -top-1
                                        flex
                                        h-5
                                        min-w-5
                                        items-center
                                        justify-center
                                        rounded-full
                                        bg-[#a66a4c]
                                        px-1
                                        text-[10px]
                                        font-bold
                                        text-white
                                    "
                                >
                                    {notificationCount > 99
                                        ? "99+"
                                        : notificationCount}
                                </span>
                            )}
                        </button>

                        {/* DROPDOWN */}
                        {showNotifications && (
                            <div
                                className="
                                    absolute
                                    right-0
                                    top-12
                                    z-[100]
                                    w-[320px]
                                    overflow-hidden
                                    rounded-2xl
                                    border
                                    border-[#eadfd8]
                                    bg-white
                                    shadow-[0_15px_45px_rgba(75,49,39,0.15)]
                                    sm:w-[380px]
                                "
                            >
                                {/* HEADER */}
                                <div
                                    className="
                                        flex
                                        items-center
                                        justify-between
                                        border-b
                                        border-[#eadfd8]
                                        bg-[#fdfaf7]
                                        px-4
                                        py-3
                                    "
                                >
                                    <div>
                                        <p className="text-sm font-semibold text-[#2b211f]">
                                            Notifications
                                        </p>

                                        <p className="text-[11px] text-[#8b7d77]">
                                            Nouvelles commandes
                                        </p>
                                    </div>

                                    {notificationCount > 0 && (
                                        <button
                                            type="button"
                                            onClick={
                                                handleClearNotifications
                                            }
                                            className="
                                                flex
                                                items-center
                                                gap-1
                                                text-xs
                                                font-medium
                                                text-[#a66a4c]
                                                hover:text-[#7d4d38]
                                            "
                                        >
                                            <Check size={14} />
                                            Tout lire
                                        </button>
                                    )}
                                </div>

                                {/* LIST */}
                                <div className="max-h-[360px] overflow-y-auto">
                                    {notifications.length === 0 ? (
                                        <div className="px-5 py-10 text-center">
                                            <div
                                                className="
                                                    mx-auto
                                                    mb-3
                                                    flex
                                                    h-12
                                                    w-12
                                                    items-center
                                                    justify-center
                                                    rounded-full
                                                    bg-[#f2e5e1]
                                                    text-[#a66a4c]
                                                "
                                            >
                                                <Bell size={21} />
                                            </div>

                                            <p className="text-sm font-medium text-[#2b211f]">
                                                Aucune nouvelle commande
                                            </p>

                                            <p className="mt-1 text-xs text-[#8b7d77]">
                                                Les nouvelles commandes apparaîtront ici.
                                            </p>
                                        </div>
                                    ) : (
                                        notifications.map(
                                            (order) => (
                                                <button
                                                    key={order.id}
                                                    type="button"
                                                    onClick={() => {
                                                        setShowNotifications(
                                                            false
                                                        );

                                                        router.push(
                                                            "/dashboard/commande"
                                                        );
                                                    }}
                                                    className="
                                                        flex
                                                        w-full
                                                        items-start
                                                        gap-3
                                                        border-b
                                                        border-[#f0e7e1]
                                                        px-4
                                                        py-3
                                                        text-left
                                                        transition
                                                        hover:bg-[#fdfaf7]
                                                    "
                                                >
                                                    <div
                                                        className="
                                                            flex
                                                            h-9
                                                            w-9
                                                            shrink-0
                                                            items-center
                                                            justify-center
                                                            rounded-xl
                                                            bg-[#f2e5e1]
                                                            text-[#a66a4c]
                                                        "
                                                    >
                                                        <ShoppingBag
                                                            size={17}
                                                        />
                                                    </div>

                                                    <div className="min-w-0 flex-1">
                                                        <div className="flex items-center justify-between gap-2">
                                                            <p className="truncate text-sm font-semibold text-[#2b211f]">
                                                                Nouvelle commande
                                                            </p>

                                                            <span className="shrink-0 text-[10px] text-[#8b7d77]">
                                                                {formatDate(
                                                                    order.created_at
                                                                )}
                                                            </span>
                                                        </div>

                                                        <p className="mt-0.5 text-xs text-[#6f625d]">
                                                            {order.reference}
                                                        </p>

                                                        <p className="mt-1 truncate text-xs text-[#8b7d77]">
                                                            {order.nom_client}
                                                        </p>

                                                        <p className="mt-1 text-xs font-semibold text-[#a66a4c]">
                                                            {formatPrice(
                                                                order.total
                                                            )}
                                                        </p>
                                                    </div>
                                                </button>
                                            )
                                        )
                                    )}
                                </div>

                                {/* FOOTER */}
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowNotifications(
                                            false
                                        );

                                        router.push(
                                            "/dashboard/commande"
                                        );
                                    }}
                                    className="
                                        w-full
                                        border-t
                                        border-[#eadfd8]
                                        bg-[#fdfaf7]
                                        px-4
                                        py-3
                                        text-center
                                        text-xs
                                        font-semibold
                                        text-[#a66a4c]
                                        transition
                                        hover:bg-[#f2e5e1]
                                        hover:text-[#7d4d38]
                                    "
                                >
                                    Voir toutes les commandes
                                </button>
                            </div>
                        )}
                    </div>

                    {/* USER */}
                    <div className="flex items-center gap-2.5">
                        <div
                            className="
                                relative
                                h-9
                                w-9
                                overflow-hidden
                                rounded-full
                                border-2
                                border-[#ead8c0]
                                bg-[#f2e5e1]
                            "
                        >
                            <Image
                                src="/images.png"
                                alt={
                                    fullName ||
                                    "Utilisateur"
                                }
                                fill
                                sizes="36px"
                                className="object-cover"
                            />
                        </div>

                        <div className="hidden sm:block">
                            <p className="text-sm font-semibold text-[#2b211f]">
                                {loading
                                    ? "Chargement..."
                                    : fullName ||
                                    "Utilisateur"}
                            </p>

                            <p className="text-[11px] text-[#8b7d77]">
                                {roleLabel}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}

