import React from 'react'
import { FaRegBell } from 'react-icons/fa';
import Image from 'next/image';

function Header() {
    return (
        <header className=' mx-4 sm:mx-6 lg:mx-8  '>
            <div className='max-w-7xl m-auto border border-gray-600 rounded-lg shadow-lg mt-4 mb-2  py-4 px-4 sm:px-6 flex items-center justify-between'>
                <h1 className='text-lg sm:text-2xl font-semibold'>
                    Dashboard
                </h1>


                <div className='flex items-center space-x-3 sm:space-x-6'>
                    <div>
                        <FaRegBell className='w-5 sm:w-5 h-5 sm:h-5 text-gray-300 hover:text-white cursor-pointer' />
                    </div>
                    <div className='flex items-center space-x-2 sm:space-x-3'>
                        <Image src={"/images.png"} alt='icon' width={40} height={40} className='rounded-full' />

                        <span className='hidden sm:block text-gray-100 font-medium'>
                            Oumar
                        </span>
                    </div>

                </div>
            </div>

        </header>
    )
}

export default Header;