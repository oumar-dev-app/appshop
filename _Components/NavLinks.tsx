import { usePathname } from 'next/navigation'
import { DataLinks } from './DataLinks'
import Link from 'next/link'


const NavLinks = () => {
  const pathname = usePathname();
  return (
    <div className='flex items-center gap-5 '>
      {DataLinks.map((item) => {
        return (
          <div key={item.name}>
            <Link href={item.href} className={`text-sm ${pathname === item.href ? "text-green-300 underline font-bold transition" : ""}`}>
              {item.name}
            </Link>
          </div>
        )
      })}
    </div>
  )
}
export default NavLinks;