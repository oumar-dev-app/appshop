'use client'
import { useState } from 'react'
import { Pencil, Plus, X } from "lucide-react";
import ExploreAdd from './ExploreAdd';
import ExploreEdit from './ExploreEdit';
import ProduitsAdd from './ProduitsAdd';
import ProduitsEdit from './ProduitsEdit';

const ExporeCategories = () => {
  const [modalCategories, setModalCategories] = useState<"modifier" | "ajouter" | null>(null);

  return (
      <div className=" shadow-lg rounded-lg max-w-md">

        {/* La demande modification et d'ajout */}
        {modalCategories === null && (
          <div className='flex justify-between items-center m-3'>
            <p className='text-sm'>Modifier et ajouter des images des produits.</p>

            <div className='flex items-center gap-4'>
              <Plus
                onClick={() => setModalCategories("ajouter")}
                size={18}
                className='cursor-pointer'
              />

              <Pencil
                onClick={() => setModalCategories("modifier")}
                size={18}
                className='cursor-pointer'
              />
            </div>
          </div>
        )}

        {/* Ajouter */}
        {modalCategories  === "ajouter" && (
          <div>
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-semibold">
                Ajouter
              </h2>

              <button onClick={() => setModalCategories(null)}>
                <X />
              </button>
            </div>
            <ProduitsAdd/>

          </div>
        )}

        {/* Modifier */}
        {modalCategories === "modifier" && (
          <div>
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-semibold">
                Modifier
              </h2>

              <button onClick={() => setModalCategories(null)}>
                <X />
              </button>
            </div>
            <ProduitsEdit/>
          </div>
        )}

      </div>
  )
}

export default ExporeCategories;