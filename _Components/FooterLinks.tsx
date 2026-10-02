import Link from "next/link";
import { DataLinks } from "./DataLinks";

const FooterLinks = () => {
  return (
    <div className="flex flex-col">
      <h2 className="font-[family-name:var(--font-playfair)] text-xl font-semibold text-[#f3dfc3]">
        Navigation
      </h2>

      <div className="mt-5 flex flex-col gap-3">
        {DataLinks.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="w-fit text-sm text-[#d9cbc4] transition-colors duration-300 hover:text-[#d8b58a]"
          >
            {item.name}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default FooterLinks;