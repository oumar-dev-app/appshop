"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

function Header() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

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

                setUser(data.user || null);
            } catch (err) {
                console.error(err);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    return (
        <header className="mx-4 sm:mx-6 lg:mx-8">
            <div className="max-w-7xl m-auto border border-white bg-white text-black rounded-lg shadow-lg mt-4 mb-2 py-4 px-4 sm:px-6 flex items-center justify-between">

                <h1 className="text-lg sm:text-2xl font-semibold">
                    Dashboard
                </h1>

                <div className="flex items-center space-x-3 sm:space-x-6">

                    <Link
                        href={"/dashboard/reglage"}
                        className="flex items-center space-x-3"
                    >
                        <Image
                            src={user?.image_url || "/oumar.png"}
                            alt="user"
                            width={40}
                            height={40}
                            className="rounded-full object-cover"
                        />

                        <span className="hidden sm:block text-black font-medium">
                            {loading
                                ? "Chargement..."
                                : user
                                ? ` ${user.nom}`
                                : "Utilisateur"}
                        </span>
                    </Link>

                </div>
            </div>
        </header>
    );
}

export default Header;