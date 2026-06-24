'use client'
import VenteFlashMenu from "./VenteFlashMenu";
import { useEffect } from "react";

const VenteFlash = () => {

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

        <div className=''>
            <div className="fade-item max-w-7xl mx-auto mt-6 m-3">
                <div className="rounded-lg">
                    <div className="max-w-7xl mx-auto mt-6">
                        <div className="fade-item flex flex-col gap-15">
                            <VenteFlashMenu />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VenteFlash;