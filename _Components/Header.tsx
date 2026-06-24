'use client';
import { useEffect, useState } from "react";
import Logo from "./Logo";
import NavLinks from "./NavLinks";
import NavLinksIcons from "./NavLinksIcons";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled ? "bg-white shadow-md" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-3">
        <div className="flex items-center justify-between">
          <Logo />

          {/* desktop */}
          <div className="hidden md:flex">
            <NavLinks />
          </div>

          {/* icons toujours visibles */}
          <NavLinksIcons />
        </div>
      </div>
    </header>
  );
};

export default Header;