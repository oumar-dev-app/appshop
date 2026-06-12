import React from 'react'
import Logo from './Logo'
import { DataLinks } from './DataLinks'
import Link from 'next/link'


const NavLinks = () => {
  return (
    <div className='flex items-center gap-5 '>
      {DataLinks.map((item) => {
        return (
          <div key={item.name}>
            <Link href={item.href} className='text-sm'>
              {item.name}
            </Link>
          </div>
        )
      })}
    </div>
  )
}

export default NavLinks