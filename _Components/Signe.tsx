import Image from "next/image";
import Link from "next/link";

const Signe = () => {
  return (
    <div className="border-t border-white/10 pt-6">
      <div className="flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
        <Link href="/" aria-label="Mini Luxe Parfum">
          <Image
            src="/logo.png"
            alt="Mini Luxe Parfum"
            width={55}
            height={55}
            className="h-10 w-10 object-contain"
          />
        </Link>

        <p className="text-xs text-[#b9aaa3]">
          © {new Date().getFullYear()} Mini Luxe Parfum — Tous droits réservés.
        </p>

        <p className="text-xs text-[#b9aaa3]">
          L'élégance a son parfum.
        </p>
      </div>
    </div>
  );
};

export default Signe;