"use client";

import { useEffect, useState } from "react";
import Logo from "./Logo";
import NavLinks from "./NavLinks";
import NavLinksIcons from "./NavLinksIcons";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={`
        sticky top-0 z-50
        border-b
        transition-all duration-300
        ${
          scrolled
            ? "border-[#eadfd8] bg-[#fdfaf7]/95 shadow-[0_4px_24px_rgba(86,55,42,0.08)] backdrop-blur-md"
            : "border-transparent bg-[#fdfaf7]"
        }
      `}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-[78px] items-center justify-between gap-6">
          {/* LOGO */}
          <Logo />

          {/* NAVIGATION DESKTOP */}
          <div className="hidden md:block">
            <NavLinks />
          </div>

          {/* ACTIONS */}
          <NavLinksIcons />
        </div>
      </div>
    </header>
  );
};

export default Header;