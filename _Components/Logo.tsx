import Image from "next/image";
import Link from "next/link";

const Logo = () => {
  return (
    <Link
      href="/"
      aria-label="Mini Luxe Parfum - Accueil"
      className="flex shrink-0 items-center"
    >
      <Image
        src="/logo.png"
        alt="Mini Luxe Parfum"
        width={80}
        height={80}
        priority
        className="
          h-14
          w-14
          object-contain
          sm:h-16
          sm:w-16
          md:h-17
          md:w-17
          lg:h-18
          lg:w-18
        "
      />
    </Link>
  );
};

export default Logo;