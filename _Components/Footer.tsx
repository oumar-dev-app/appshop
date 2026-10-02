"use client";

import { useEffect } from "react";
import FooterLinks from "./FooterLinks";
import Signe from "./Signe";
import FooterCategory from "./FooterCategory";
import LogoFooter from "./LogoFooter";

const Footer = () => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
          }
        });
      },
      { threshold: 0.15 }
    );

    const elements = document.querySelectorAll(".fade-item");
    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  return (
    <footer className="mt-24 border-t border-[#eadfd8] bg-[#2b211f]">
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-6 lg:px-8">
        <div className="fade-item grid grid-cols-1 gap-12 md:grid-cols-3">
          <div className="md:col-span-1">
            <LogoFooter />
          </div>

          <FooterLinks />

          <FooterCategory />
        </div>

        <div className="mt-12">
          <Signe />
        </div>
      </div>
    </footer>
  );
};

export default Footer;