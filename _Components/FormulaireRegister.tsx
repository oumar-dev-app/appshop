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
  onLogin,
}: FormulaireRegisterProps) => {
  const router = useRouter();

  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');
  const [telephone, setTelephone] = useState('');
  const [password, setPassword] = useState('');
  const [image_url, setImage_url] = useState('');

  const [uploading, setUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const uploadImage = async (file: File) => {
    try {
      setUploading(true);

      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Erreur upload');
      }

      setImage_url(data.imageUrl);
      toast.success('Image téléchargée avec succès');
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de l'upload");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (
      !nom.trim() ||
      !prenom.trim() ||
      !email.trim() ||
      !telephone.trim() ||
      !password.trim()
    ) {
      toast.error('Tous les champs sont requis');
      return;
    }

    setIsLoading(true);

    const loading = toast.loading('Création du compte...');

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nom,
          prenom,
          email,
          telephone,
          password,
          image_url,
        }),
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

      setNom('');
      setPrenom('');
      setEmail('');
      setTelephone('');
      setPassword('');
      setImage_url('');

      router.push('/');
    } catch (error: any) {
      toast.dismiss(loading);

      toast.error(
        error.message || "Erreur lors de l'inscription"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 w-full"
    >
      {/* APERÇU IMAGE */}
      {image_url && (
        <div className="flex justify-center">
          <img
            src={image_url}
            alt="Photo de profil"
            className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
          />
        </div>
      )}

      {/* UPLOAD */}
      <input
        type="file"
        accept="image/*"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (!file) return;

          await uploadImage(file);
        }}
        className="border p-2 rounded-lg w-full"
      />

      {uploading && (
        <p className="text-sm text-blue-600">
          Téléchargement de l'image...
        </p>
      )}

      {/* NOM / PRENOM */}
      <div className="flex flex-col sm:flex-row gap-3">
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

      {/* EMAIL / TELEPHONE */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="border p-2 rounded-lg w-full"
        />

        <input
          type="tel"
          value={telephone}
          onChange={(e) => setTelephone(e.target.value)}
          placeholder="Téléphone"
          className="border p-2 rounded-lg w-full"
        />
      </div>

      {/* PASSWORD */}
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Mot de passe"
        className="border p-2 rounded-lg w-full"
      />

      {/* SUBMIT */}
      <button
        type="submit"
        disabled={isLoading || uploading}
        className="bg-black text-white p-3 rounded-lg w-full disabled:opacity-50"
      >
        {uploading
          ? "Téléchargement..."
          : isLoading
          ? "Enregistrement..."
          : "Créer mon compte"}
      </button>

      {/* LOGIN */}
      <button
        type="button"
        onClick={onLogin}
        className="underline text-sm text-center"
      >
        J'ai déjà un compte
      </button>
    </form>
  );
};

export default FormulaireRegister;