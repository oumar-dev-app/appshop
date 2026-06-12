'use client';

import { useState } from 'react';
import { DashboardMenu1, DashboardMenu2, DashboardMenu3 } from './DashboardMenu';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MdMenu } from 'react-icons/md';

type Props = {
  mobile?: boolean;
};

const SliderBar = ({ mobile = false }: Props) => {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // 📱 MOBILE NAV (BOTTOM BAR)
  if (mobile) {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-around items-center bg-black/90 p-2 backdrop-blur-md border-t border-gray-700 py-2">
        
        {[...DashboardMenu1, ...DashboardMenu2, ...DashboardMenu3].map((item) => (
          <Link key={item.name} href={item.href}>
            <div
              className={`flex flex-col items-center text-xs ${
                pathname === item.href ? "text-green-400" : "text-white"
              }`}
            >
              <div>{item.icon}</div>
            </div>
          </Link>
        ))}

      </div>
    );
  }

  // 💻 DESKTOP SIDEBAR (ton code actuel)
  return (
    <div
      className={`relative z-10 transition-all duration-100 ease-in-out shrink-0 ${
        isSidebarOpen ? "w-64" : "w-20"
      }`}
    >
      <div className="h-full backdrop-blur-md p-4 flex flex-col border-r border-gray-600">

        {/* TOGGLE */}
        <button
          className="p-2 rounded-full hover:bg-white/25 transition-colors max-w-fit cursor-pointer"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <MdMenu size={25} />
        </button>

        <nav className="mt-8 grow">

          {/* MENU 1 */}
          {DashboardMenu1.map((item) => (
            <Link key={item.name} href={item.href}>
              <div
                className={`flex items-center p-4 text-sm font-medium rounded-lg hover:bg-white/25 transition-colors ${
                  pathname === item.href ? "bg-white/25" : ""
                }`}
              >
                <div style={{ minWidth: "20px" }}>{item.icon}</div>

                {isSidebarOpen && (
                  <span className="ml-4 whitespace-nowrap">
                    {item.name}
                  </span>
                )}
              </div>
            </Link>
          ))}

          {/* MENU 2 */}
          <div>
            <h1 className="text-white/25 p-4">Boutique</h1>
            {DashboardMenu2.map((item) => (
              <Link key={item.name} href={item.href}>
                <div
                  className={`flex items-center p-4 text-sm font-medium rounded-lg hover:bg-white/25 transition-colors ${
                    pathname === item.href ? "bg-white/25" : ""
                  }`}
                >
                  <div style={{ minWidth: "20px" }}>{item.icon}</div>

                  {isSidebarOpen && (
                    <span className="ml-4 whitespace-nowrap">
                      {item.name}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>

          {/* MENU 3 */}
          <div>
            <h1 className="text-white/25 p-4">Paramètres</h1>
            {DashboardMenu3.map((item) => (
              <Link key={item.name} href={item.href}>
                <div
                  className={`flex items-center p-4 text-sm font-medium rounded-lg hover:bg-white/25 transition-colors ${
                    pathname === item.href ? "bg-white/25" : ""
                  }`}
                >
                  <div style={{ minWidth: "20px" }}>{item.icon}</div>

                  {isSidebarOpen && (
                    <span className="ml-4 whitespace-nowrap">
                      {item.name}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>

        </nav>
      </div>
    </div>
  );
};

export default SliderBar;