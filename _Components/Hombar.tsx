'use client'
import React, { useState } from 'react'
import { toast } from 'sonner';

const Hombar = () => {

  const [image_url, setImage_url] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault();

    const loading = toast.loading("Chargement....");

    try {

      const token = localStorage.getItem("token");

      const res = await fetch("/api/homebar", {

        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          image_url,
          title,
          description,
        }),

      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Erreur serveur");
      }

      toast.success(data.message || "Enregistrement réussi");

      // Reset formulaire
      setTitle("");
      setDescription("");
      setImage_url("");

    } catch (error: any) {

      toast.error(error.message || "Erreur d'enregistrement");

      console.error(error);

    } finally {

      toast.dismiss(loading);

    }
  };

  // Upload image
  const uploadImage = async (file: File) => {

    try {

      const token = localStorage.getItem("token");

      const formData = new FormData();

      formData.append("file", file);

      const res = await fetch("/api/upload", {

        method: "POST",

        headers: {
          Authorization: `Bearer ${token}`,
        },

        body: formData,
      });

      const data = await res.json();

      return data.imageUrl;

    } catch (error) {

      console.error(error);

      return null;
    }
  };

  return (

    <div className="">

      <div className="border border-white/25 rounded-lg p-5 max-w-md">


        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-5"
        >

          <input
            type="text"
            placeholder="Titre"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border p-2 rounded-md w-full outline-none"
          />

          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border p-2 rounded-md w-full outline-none"
          />

          <div className="flex items-center gap-3">

            <input
              type="file"
              accept="image/*"

              onChange={async (e) => {

                const file = e.target.files?.[0];

                if (!file) return;

                const url = await uploadImage(file);

                if (url) {

                  setImage_url(url);

                  console.log("Image URL:", url);
                }
              }}

              className="border p-2 rounded-md w-full"
            />

          </div>
          <button
            type="submit"
            className="flex items-center justify-center gap-2 text-sm font-bold bg-green-500 hover:bg-green-600 transition px-5 py-2 text-white rounded-lg"
          >
            Valider
          </button>
        </form>

      </div>

    </div>
  );
};

export default Hombar;  