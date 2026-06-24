import { usePathname } from 'next/navigation';
import { DataLinks } from './DataLinks';
import Link from 'next/link';

const FooterLinks = () => {
    const pathname = usePathname();
    return (
        <div className='flex flex-col gap-2 text-white'>
            <h1 className='font-bold'>Liens rapides</h1>
            <div className='flex flex-col gap-3'>
                {DataLinks.map((item) => {
                    return (
                        <div key={item.name}>
                            <Link href={item.href}
                                className={`text-sm ${pathname === item.href ? "text-green-300 underline font-bold transition" : ""}`}
                            >
                                {item.name}
                            </Link>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default FooterLinks;
