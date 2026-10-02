"use client";

import { useState } from "react";
import { DashboardMenu1, DashboardMenu2, DashboardMenu3 } from "./DashboardMenu";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MdMenu } from "react-icons/md";

type Props = {
    mobile?: boolean;
};

const SliderBar = ({ mobile = false }: Props) => {
    const pathname = usePathname();

    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const allMenus = [
        ...DashboardMenu1,
        ...DashboardMenu2,
        ...DashboardMenu3,
    ];

    // ================= MOBILE =================
    if (mobile) {
        return (
            <div
                className="
                    fixed
                    bottom-0
                    left-0
                    right-0
                    z-50
                    border-t
                    border-[#eadfd8]
                    bg-white/95
                    px-2
                    py-2
                    shadow-[0_-8px_25px_rgba(75,49,39,0.10)]
                    backdrop-blur-xl
                "
            >
                <div className="flex items-center justify-around">
                    {allMenus.map((item) => {
                        const active = pathname === item.href;

                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="min-w-0"
                            >
                                <div
                                    className={`
                                        flex
                                        min-w-[46px]
                                        flex-col
                                        items-center
                                        justify-center
                                        gap-1
                                        rounded-xl
                                        px-2
                                        py-1.5
                                        text-xs
                                        transition
                                        ${
                                            active
                                                ? "bg-[#f2e5e1] text-[#a66a4c]"
                                                : "text-[#8b7d77] hover:bg-[#fdfaf7] hover:text-[#a66a4c]"
                                        }
                                    `}
                                >
                                    <div className="flex h-5 items-center justify-center">
                                        {item.icon}
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        );
    }

    // ================= DESKTOP =================
    return (
        <aside
            className={`
                relative
                shrink-0
                border-r
                border-[#eadfd8]
                bg-white
                transition-all
                duration-300
                ${
                    isSidebarOpen
                        ? "w-64"
                        : "w-20"
                }
            `}
        >
            <div className="flex h-full min-h-screen flex-col px-3 py-4">

                {/* LOGO / BRAND */}
                <div
                    className={`
                        mb-5
                        flex
                        items-center
                        ${
                            isSidebarOpen
                                ? "justify-between px-2"
                                : "justify-center"
                        }
                    `}
                >
                    {isSidebarOpen && (
                        <div>
                            <p className="font-['Playfair_Display'] text-xl font-semibold text-[#7d4d38]">
                                Mini Luxe
                            </p>

                            <p className="text-[10px] uppercase tracking-[0.18em] text-[#a66a4c]">
                                Administration
                            </p>
                        </div>
                    )}

                    <button
                        type="button"
                        aria-label={
                            isSidebarOpen
                                ? "Réduire le menu"
                                : "Ouvrir le menu"
                        }
                        onClick={() =>
                            setIsSidebarOpen(!isSidebarOpen)
                        }
                        className="
                            flex
                            h-9
                            w-9
                            items-center
                            justify-center
                            rounded-xl
                            border
                            border-[#eadfd8]
                            bg-[#fdfaf7]
                            text-[#a66a4c]
                            transition
                            hover:border-[#c89a7c]
                            hover:bg-[#f2e5e1]
                            hover:text-[#7d4d38]
                        "
                    >
                        <MdMenu size={22} />
                    </button>
                </div>

                <nav className="flex-1 overflow-y-auto">

                    {/* ================= MENU 1 ================= */}
                    <div className="space-y-1">
                        {DashboardMenu1.map((item) => (
                            <DashboardLink
                                key={item.name}
                                item={item}
                                pathname={pathname}
                                isSidebarOpen={isSidebarOpen}
                            />
                        ))}
                    </div>

                    {/* ================= BOUTIQUE ================= */}
                    <MenuSection
                        title="Boutique"
                        items={DashboardMenu2}
                        pathname={pathname}
                        isSidebarOpen={isSidebarOpen}
                    />

                    {/* ================= PARAMÈTRES ================= */}
                    <MenuSection
                        title="Paramètres"
                        items={DashboardMenu3}
                        pathname={pathname}
                        isSidebarOpen={isSidebarOpen}
                    />
                </nav>
            </div>
        </aside>
    );
};

function DashboardLink({
    item,
    pathname,
    isSidebarOpen,
}: {
    item: {
        name: string;
        href: string;
        icon: React.ReactNode;
    };
    pathname: string;
    isSidebarOpen: boolean;
}) {
    const active = pathname === item.href;

    return (
        <Link href={item.href}>
            <div
                className={`
                    group
                    flex
                    items-center
                    rounded-xl
                    py-3
                    text-sm
                    font-medium
                    transition-all
                    ${
                        isSidebarOpen
                            ? "px-3"
                            : "justify-center px-2"
                    }
                    ${
                        active
                            ? "bg-[#f2e5e1] text-[#7d4d38]"
                            : "text-[#6f625d] hover:bg-[#fdfaf7] hover:text-[#a66a4c]"
                    }
                `}
            >
                <div
                    className={`
                        flex
                        h-6
                        w-6
                        shrink-0
                        items-center
                        justify-center
                        ${
                            active
                                ? "text-[#a66a4c]"
                                : "text-[#8b7d77] group-hover:text-[#a66a4c]"
                        }
                    `}
                >
                    {item.icon}
                </div>

                {isSidebarOpen && (
                    <span className="ml-3 whitespace-nowrap">
                        {item.name}
                    </span>
                )}
            </div>
        </Link>
    );
}

function MenuSection({
    title,
    items,
    pathname,
    isSidebarOpen,
}: {
    title: string;
    items: {
        name: string;
        href: string;
        icon: React.ReactNode;
    }[];
    pathname: string;
    isSidebarOpen: boolean;
}) {
    return (
        <div className="mt-6">
            {isSidebarOpen && (
                <p
                    className="
                        mb-2
                        px-3
                        text-[10px]
                        font-semibold
                        uppercase
                        tracking-[0.18em]
                        text-[#b19f95]
                    "
                >
                    {title}
                </p>
            )}

            <div className="space-y-1">
                {items.map((item) => (
                    <DashboardLink
                        key={item.name}
                        item={item}
                        pathname={pathname}
                        isSidebarOpen={isSidebarOpen}
                    />
                ))}
            </div>
        </div>
    );
}

export default SliderBar;
