"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

function Header() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem("token");

                const res = await fetch("/api/me", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await res.json();

                setUser(data.user);

            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [router]);

    const getUserName = () => {
        if (!user) return "Admin";

        return `${user?.prenom || ""} ${user?.nom || ""}`.trim() || "Utilisateur";
    };

    return (
        <header className="mx-4 sm:mx-6 lg:mx-8">
            <div className="max-w-7xl m-auto border bg-white text-black rounded-lg shadow-lg mt-4 mb-2 py-4 px-4 sm:px-6 flex items-center justify-between">

                <h1 className="text-lg sm:text-2xl font-semibold">
                    Dashboard
                </h1>

                <div className="flex items-center space-x-3 sm:space-x-6">

                    <Link
                        href="/dashboard/reglage"
                        className="flex items-center space-x-3"
                    >
                        <Image
                            src={user?.image_url || "/oumar.png"}
                            alt="user"
                            width={40}
                            height={40}
                            className="rounded-full object-cover"
                        />

                        <span className="hidden sm:block font-medium">
                            {loading ? "Chargement..." : getUserName()}
                        </span>

                    </Link>

                </div>
            </div>
        </header>
    );
}

export default Header;