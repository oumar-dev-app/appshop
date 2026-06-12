import Link from 'next/link';
import React from 'react'

const FormulaireLogin = () => {
    return (
        <div>
            <div >
                <form action="" className="flex flex-col gap-3">
                    <input type="email" placeholder='Email' className='border rounded-lg p-2' />
                    <input type="password" placeholder='Password' className='border rounded-lg p-2' />
                    <div className='flex justify-between items-center'>
                        <div className='flex items-center gap-2'>
                            <input type="checkbox" />
                            <label className='text-sm'>Souvenez de moi</label>
                        </div>
                        <Link href={""} className='underline text-sm hover:text-red-500 transition  '>
                            Mode passe oublie ?
                        </Link>
                    </div>
                    <button type="submit"
                        className='bg-black rounded-lg p-2 text-white hover:bg-black/90 transition'>
                        Connexion
                    </button>
                    <div className='flex items-center text-sm gap-2 justify-center'>
                        <p>Vous avez pas de compte ?</p>
                        <Link href={""} className='unders'>Créer un compte</Link>
                    </div>
                </form>
            </div>

        </div>
    )
}

export default FormulaireLogin;