<<<<<<< HEAD
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

function Header() {
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const fetchUser = async () => {
            const res = await fetch("/api/me");
            const data = await res.json();
            setUser(data.user);
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
                        className="flex items-center space-x-2 sm:space-x-3"
                    >
                        <Image
                            src={user?.image_url || "/oumar.png"}
                            alt="user"
                            width={40}
                            height={40}
                            className="rounded-full"
                        />

                        <span className="hidden sm:block text-black font-medium">
                            {user ? `${user.prenom} ${user.nom}` : "Chargement..."}
                        </span>
                    </Link>
                </div>
            </div>
        </header>
    );
=======
import { FaRegBell } from 'react-icons/fa';
import Image from 'next/image';
import Link from 'next/link';

function Header() {
    return (
        <header className=' mx-4 sm:mx-6 lg:mx-8  '>
            <div className='max-w-7xl m-auto border border-white bg-white text-black rounded-lg shadow-lg mt-4 mb-2  py-4 px-4 sm:px-6 flex items-center justify-between'>
                <h1 className='text-lg sm:text-2xl font-semibold'>
                    Dashboard
                </h1>


                <div className='flex items-center space-x-3 sm:space-x-6'>
                    {/*                     <div>
                        <FaRegBell className='w-5 sm:w-5 h-5 sm:h-5 text-black hover:text-white cursor-pointer' />
                    </div> */}

                    <div >
                        <Link
                            href={"/dashboard/reglage"}
                            className='flex items-center space-x-2 sm:space-x-3'
                        >
                            <Image src={"/oumar.png"} alt='icon' width={40} height={40} className='rounded-full' />



                            <span className='hidden sm:block text-black font-medium'>
                                Oumar
                            </span>
                        </Link>
                    </div>

                </div>
            </div>

        </header>
    )
>>>>>>> 6ddfba36 (first commit)
}

export default Header;