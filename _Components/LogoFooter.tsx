import Image from "next/image";
import Link from "next/link";

const LogoFooter = () => {
  return (
    <div className="flex flex-col items-center md:items-start">
      <Link href="/" aria-label="Mini Luxe Parfum - Accueil">
        <Image
          src="/logo.png"
          alt="Mini Luxe Parfum"
          width={110}
          height={110}
          className="h-24 w-24 object-contain"
        />
      </Link>

      <p className="mt-5 max-w-xs text-center text-sm leading-6 text-[#d9cbc4] md:text-left">
        Découvrez une sélection de parfums élégants et laissez votre
        fragrance révéler votre personnalité.
      </p>
    </div>
  );
};

export default LogoFooter;