'use client'
import { useState } from 'react'
import { Pencil, Plus, X } from "lucide-react";
import Hombar from './Hombar';
import HombarEdit from './HombarEdit';

const NouveauHombar = () => {
  const [modal, setModal] = useState<"modifier" | "ajouter" | null>(null);

  return (
      <div className="shadow-lg rounded-lg  max-w-md">

        {/* La demande modification et d'ajout */}
        {modal === null && (
          <div className='flex justify-between items-center gap-2 m-3'>
            <p className='text-sm'>Modifier et ajouter des images, titre, texte aux sliders.</p>

            <div className='flex items-center gap-4'>
              <Plus
                onClick={() => setModal("ajouter")}
                size={18}
                className='cursor-pointer'
              />

              <Pencil
                onClick={() => setModal("modifier")}
                size={18}
                className='cursor-pointer'
              />
            </div>
          </div>
        )}

        {/* Ajouter */}
        {modal === "ajouter" && (
          <div>
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-semibold">
                Ajouter
              </h2>

              <button onClick={() => setModal(null)}>
                <X />
              </button>
            </div>

            <Hombar />
          </div>
        )}

        {/* Modifier */}
        {modal === "modifier" && (
          <div>
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-semibold">
                Modifier
              </h2>

              <button onClick={() => setModal(null)}>
                <X />
              </button>
            </div>

            <HombarEdit />
          </div>
        )}

      </div>
  )
}

export default NouveauHombar;