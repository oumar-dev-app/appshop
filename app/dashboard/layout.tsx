
import React from "react";
import HeaderDashboard from "@/_Components/HeaderDashboard";
import SliderBar from "@/_Components/SliderBar";

export default function Dashboard({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-[#fdfaf7]">
            <div className="flex min-h-screen">

                {/* ================= SIDEBAR DESKTOP ================= */}
                <aside className="hidden md:flex shrink-0">
                    <SliderBar />
                </aside>

                {/* ================= MAIN ================= */}
                <div className="relative flex min-w-0 flex-1 flex-col">

                    {/* HEADER */}
                    <HeaderDashboard />

                    {/* CONTENT */}
                    <main
                        className="
                            flex-1
                            overflow-x-hidden
                            bg-[#fdfaf7]
                            pb-20
                            md:pb-0
                        "
                    >
                        {children}
                    </main>
                </div>

                {/* ================= MOBILE NAVIGATION ================= */}
                <div
                    className="
                        fixed
                        bottom-0
                        left-0
                        right-0
                        z-50
                        md:hidden
                    "
                >
                    <SliderBar mobile />
                </div>
            </div>
        </div>
    );
}

