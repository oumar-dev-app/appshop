import Link from 'next/link';
import React from 'react'
import { DataInternet } from './DataInternet';

function SuivezNous() {
  return (
        <div className='flex flex-col gap-2 text-white'>
            <h1 className='font-bold'>Suivez nous sur</h1>
            <div className='flex flex-col gap-3'>
                {DataInternet.map((item) => {
                    return (
                        <div key={item.name}>
                            <Link href={item.href}
                                className="text-white flex items-center  gap-5 text-sm hover:text-green-400 transition"
                            >
                                {item.icon} {item.name} 
                            </Link>
                        </div>
                    )
                })}
            </div>
        </div>
  )
}

export default SuivezNous;