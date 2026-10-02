import React from "react";
import { DataLinks } from "./DataLinks";
import Link from "next/link";

const NavLinks = () => {
  return (
    <nav className="flex items-center gap-8">
      {DataLinks.map((item) => (
        <Link
          key={item.name}
          href={item.href}
          className="
            group
            relative
            py-2
            text-[13px]
            font-medium
            tracking-[0.08em]
            text-[#6f625d]
            uppercase
            transition-colors
            duration-300
            hover:text-[#a66a4c]
          "
        >
          {item.name}

          <span
            className="
              absolute
              -bottom-0.5
              left-1/2
              h-px
              w-0
              -translate-x-1/2
              bg-[#a66a4c]
              transition-all
              duration-300
              group-hover:w-full
            "
          />
        </Link>
      ))}
    </nav>
  );
};

export default NavLinks;