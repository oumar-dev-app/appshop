'use client'
import { useEffect } from 'react'
import FooterLinks from './FooterLinks';
import Signe from './Signe';
import FooterCategory from './FooterCategory';
import SuivezNous from './SuivezNous';
import ServiceClientel from './ServiceClientel';

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
      { threshold: 0.2 }
    );

    const elements = document.querySelectorAll(".fade-item");
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <footer className=' bg-black mt-20 p-6'>
      <div className="fade-item max-w-7xl m-auto">

        {/* GRID PROPRE */}
        <div className='m-auto grid grid-cols-1 lg:grid-cols-4 gap-10 px-4'>
          <FooterLinks />
          <FooterCategory />
          <SuivezNous/>
          <ServiceClientel/>
        </div>

        {/* SIGNATURE */}
        <div className="mt-10">
          <Signe />
        </div>

      </div>
    </footer>
  )
}

export default Footer;