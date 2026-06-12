'use client'
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";


function ForgotPassword() {
    const [email, setEmail] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();


        const loading = toast.loading("Envoi en cours...");

        try {
            const res = await fetch("/api/forgot-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                }),
            });

            const data = await res.json();

            toast.dismiss(loading);

            if (!res.ok) {
                toast.error(data.message || "Erreur");
                return;
            }


            // afficher le lien dans le toast
            toast.success(data.message, {
                description: (
                    <a
                        href={data.resetLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ textDecoration: "underline" }}
                    >
                        Ouvrir le lien
                    </a>
                ),
            });

            // reset input
            setEmail("");

        } catch (error: any) {
            toast.dismiss(loading);
            toast.error("Erreur serveur");
            console.error(error);
        }
    };

    return (
        <div className='flex justify-center items-center h-screen'>
            <form onSubmit={handleSubmit}>
                <div className='flex justify-center items-center'>
                    <div className='bg-white rounded-xl shadow-2xl w-130 h-auto'>
                        <div className='flex flex-col space-y-6 p-6'>
                            <h1 className="text-center capitalize font-bold text-gray-500">Entre votre addresse email</h1>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Entrez votre email"
                                className='p-2 border-2 border-black/20 rounded-xl outline-none'
                                required
                            />

                            <button
                                type="submit"
                                className='text-sm p-2 py-2 px-10 text-white bg-blue-950 rounded-xl font-bold'
                            >
                                Envoyer
                            </button>
                            <button
                                type="button"
                                className='text-sm p-2 py-2 px-10 text-white bg-red-600 rounded-xl font-bold'
                                onClick={() => router.back()}
                            >
                                Annuler
                            </button>
                        </div>
                    </div>
                </div>

            </form>
        </div>
    );
}

export default ForgotPassword;