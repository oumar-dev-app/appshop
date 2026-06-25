import React, { useEffect, useState } from 'react'
import { FiPhone, FiPhoneCall } from 'react-icons/fi';

type User = {
    id: number;
    telephone: string;
}

function ServiceClientel() {

    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem("token");

                const res = await fetch("/api/users", {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await res.json();
                setUser(data.data?.[0] || null);
            } catch (error) {
                console.error(error);
            }
        }
        fetchUser();
    }, []);



    return (
        <div className='flex flex-col gap-2 text-white'>
            <h1 className='font-bold text-white'>Service Client</h1>
            <div className='flex items-center gap-3'>
                <FiPhoneCall />
                <p>(+223)</p>{user?.telephone}
            </div>
        </div>
    )
}

export default ServiceClientel;