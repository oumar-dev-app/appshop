'use client';

import React, { useState } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface FormulaireRegisterProps {
  onSuccess?: () => void;
  onLogin?: () => void;
}

const FormulaireRegister = ({
  onSuccess,
  onLogin
}: FormulaireRegisterProps) => {

  const router = useRouter();

  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {

    e.preventDefault();

    setIsLoading(true);

    const loading = toast.loading("Chargement...");

    try {

      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          nom,
          prenom,
          email,
          telephone,
          password
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      toast.dismiss(loading);

      toast.success(data.message);

      if (onSuccess) {
        onSuccess();
      }

      router.push("/");

      // Vide les champs après la soumition
      setNom("");
      setPrenom("");
      setEmail("");
      setTelephone("")
      setPassword("");

    } catch (error: any) {

      toast.dismiss(loading);

      toast.error(
        error.message || "Erreur d'inscription"
      );

    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 w-full"
    >

      <div className="flex flex-col sm:flex-row gap-3 w-full">

        <input
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          placeholder="Nom"
          className="border p-2 rounded-lg w-full"
        />

        <input
          value={prenom}
          onChange={(e) => setPrenom(e.target.value)}
          placeholder="Prénom"
          className="border p-2 rounded-lg w-full"
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-3 w-full">

        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="border p-2 rounded-lg w-full"
        />

        <input
          value={telephone}
          onChange={(e) => setTelephone(e.target.value)}
          placeholder="Téléphone"
          className="border p-2 rounded-lg w-full"
        />
      </div>

      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Mot de passe"
        className="border p-2 rounded-lg w-full"
      />

      <button
        type="submit"
        disabled={isLoading}
        className="bg-black text-white p-2 rounded-lg w-full"
      >
        {isLoading ? "Enregistrement..." : "Enregistrer"}
      </button>

      <button
        type="button"
        onClick={onLogin}
        className="underline text-sm"
      >
        J'ai déjà un compter
      </button>

    </form>
  );
};

export default FormulaireRegister;