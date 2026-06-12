'use client';

import React, { useState } from 'react';
import { toast } from 'sonner';
import { useRouter, useSearchParams } from "next/navigation";

function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const router = useRouter();

  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      toast.error("Token invalide");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas");
      return;
    }

    const loading = toast.loading("Réinitialisation...");

    try {
      const res = await fetch("/api/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password,
          token,
        }),
      });

      const data = await res.json();

      toast.dismiss(loading);

      if (!res.ok) {
        toast.error(data.message || "Erreur");
        return;
      }

      toast.success("Mot de passe réinitialisé avec succès");
      router.push("/login")

      setPassword("");
      setConfirmPassword("");

    } catch (error: any) {
      toast.dismiss(loading);
      toast.error("Erreur serveur");
      console.error(error);
    }
  };

  return (
    <div className='flex justify-center items-center h-screen'>
      <form onSubmit={handleSubmit}>
        <div className='bg-white rounded-xl shadow-2xl w-130 h-auto'>
          <div className='flex flex-col space-y-6 p-6'>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nouveau mot de passe"
              className='p-2 border-2 border-black/20 rounded-xl outline-none'
              required
            />

            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirmer le mot de passe"
              className='p-2 border-2 border-black/20 rounded-xl outline-none'
              required
            />

            <button
              type="submit"
              className='text-sm p-2 py-2 px-10 text-white bg-blue-950 rounded-xl font-bold'
            >
              Envoyer
            </button>

          </div>
        </div>
      </form>
    </div>
  );
}

export default ResetPassword;