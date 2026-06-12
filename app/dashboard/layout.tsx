import React from "react";
import HeaderDashboard from "@/_Components/HeaderDashboard";
import SliderBar from "@/_Components/SliderBar";

export default function Dashboard({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      {/* BACKGROUND */}
      <div
        style={{ backgroundImage: 'url("/openShop.jpg")' }}
        className="bg-cover bg-center"
      >
        {/* OVERLAY */}
        <div className="absolute inset-0 bg-black/90 pointer-events-none z-0"></div>

        {/* MAIN WRAPPER */}
        <div className="relative z-10 text-white flex h-screen overflow-hidden">

          {/* SIDEBAR DESKTOP */}
          <div className="hidden md:flex">
            <SliderBar />
          </div>

          {/* CONTENT */}
          <div className="relative flex flex-col flex-1 overflow-auto pb-16 md:pb-0">
            <HeaderDashboard />

            <div className="pb-16 md:pb-0">
              <main>{children}</main>
            </div>
          </div>

          {/* BOTTOM NAV MOBILE */}
          <div className="fixed bottom-0 left-0 right-0 md:hidden z-50">
            <SliderBar mobile />
          </div>

        </div>
      </div>
    </div>
  );
}