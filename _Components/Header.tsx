"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import Logo from "./Logo";
import NavLinks from "./NavLinks";
import NavLinksIcons from "./NavLinksIcons";
import { DataLinks } from "./DataLinks";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [mobileMenuOpen]);

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
        <div className="flex h-[78px] items-center justify-between gap-3 sm:gap-6">
          {/* LOGO */}
          <Logo />

          {/* NAVIGATION DESKTOP */}
          <div className="hidden md:block">
            <NavLinks />
          </div>

          {/* ACTIONS */}
          <div className="flex items-center gap-1 sm:gap-2">
            <NavLinksIcons />

            {/* MENU MOBILE */}
            <button
              type="button"
              aria-label={
                mobileMenuOpen
                  ? "Fermer le menu"
                  : "Ouvrir le menu"
              }
              aria-expanded={mobileMenuOpen}
              onClick={() => setMobileMenuOpen((open) => !open)}
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-full
                text-[#6f625d]
                transition-all
                duration-300
                hover:bg-[#f2e5e1]
                hover:text-[#a66a4c]
                md:hidden
              "
            >
              {mobileMenuOpen ? (
                <X size={21} strokeWidth={1.7} />
              ) : (
                <Menu size={21} strokeWidth={1.7} />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* MENU MOBILE */}
      {mobileMenuOpen && (
        <div
          className="
            border-t
            border-[#eadfd8]
            bg-[#fdfaf7]
            shadow-[0_12px_30px_rgba(86,55,42,0.08)]
            md:hidden
          "
        >
          <nav className="mx-auto max-w-7xl px-4 py-5 sm:px-6">
            <div className="flex flex-col">
              {DataLinks.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="
                    flex
                    items-center
                    justify-between
                    border-b
                    border-[#eadfd8]
                    py-4
                    text-sm
                    font-medium
                    tracking-[0.06em]
                    text-[#5a4740]
                    uppercase
                    transition-colors
                    duration-200
                    first:border-t
                    hover:text-[#a66a4c]
                  "
                >
                  <span>{item.name}</span>

                  <span className="text-lg text-[#d8b58a]">
                    →
                  </span>
                </Link>
              ))}
            </div>

            <div className="mt-5 rounded-2xl bg-[#f7f0e9] p-4">
              <p className="font-serif text-lg text-[#2b211f]">
                Mini Luxe Parfum
              </p>

              <p className="mt-1 text-xs leading-5 text-[#6f625d]">
                Découvrez notre sélection de parfums et
                trouvez votre signature olfactive.
              </p>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;