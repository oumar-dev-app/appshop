'use client';

import { useState } from 'react';
import { DashboardMenu1, DashboardMenu2, DashboardMenu3 } from './DashboardMenu';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { MdMenu } from 'react-icons/md';

type Props = {
  mobile?: boolean;
};

const SliderBar = ({ mobile = false }: Props) => {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // =========================
  // 🔥 LOGOUT FUNCTION
  // =========================
  const handleLogout = () => {
    if (!confirm("Voulez-vous vraiment vous déconnecter ?")) return;

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    router.push("/");
  };

  // =========================
  // 📱 MOBILE NAV
  // =========================
if (mobile) {
  const allMenu = [
    ...DashboardMenu1,
    ...DashboardMenu2,
    ...DashboardMenu3,
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-t border-gray-700">

      <div className="flex justify-around items-center py-2">

        {allMenu.map((item) => {

          // LOGOUT
          if (item.action === "logout") {
            return (
              <button
                key={item.name}
                onClick={handleLogout}
                className="flex flex-col items-center justify-center gap-1 text-red-500 min-w-[60px]"
              >
                <div className="text-xl">
                  {item.icon}
                </div>

                <span className="text-[10px] leading-none text-center">
                  {item.name}
                </span>
              </button>
            );
          }

          // LIENS NORMAUX
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-1 min-w-[60px] transition ${
                pathname === item.href
                  ? "text-green-400"
                  : "text-white"
              }`}
            >
              <div className="text-xl">
                {item.icon}
              </div>

              <span className="text-[10px] leading-none text-center">
                {item.name}
              </span>
            </Link>
          );
        })}

      </div>
    </div>
  );
}

  // =========================
  // 💻 DESKTOP SIDEBAR
  // =========================
  return (
    <div className={`relative z-10 transition-all duration-100 shrink-0 ${
      isSidebarOpen ? "w-64" : "w-20"
    }`}>

      <div className="h-full bg-white shadow-lg text-black p-4 flex flex-col">

        {/* TOGGLE */}
        <button
          className="p-2 rounded-full hover:bg-gray-200 transition w-fit"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <MdMenu size={25} />
        </button>

        <nav className="mt-8 grow space-y-2">

          {/* ========================= */}
          {/* MENU 1 */}
          {/* ========================= */}
          {DashboardMenu1.map((item) => (
            <Link key={item.name} href={item.href}>
              <div
                className={`flex items-center p-3 rounded-lg hover:bg-green-200 transition ${
                  pathname === item.href ? "bg-green-200" : ""
                }`}
              >
                <div className="min-w-5">{item.icon}</div>

                {isSidebarOpen && (
                  <span className="ml-4">{item.name}</span>
                )}
              </div>
            </Link>
          ))}

          {/* ========================= */}
          {/* MENU 2 */}
          {/* ========================= */}
          {DashboardMenu2.map((item) => (
            <Link key={item.name} href={item.href}>
              <div
                className={`flex items-center p-3 rounded-lg hover:bg-green-200 transition ${
                  pathname === item.href ? "bg-green-200" : ""
                }`}
              >
                <div className="min-w-5">{item.icon}</div>

                {isSidebarOpen && (
                  <span className="ml-4">{item.name}</span>
                )}
              </div>
            </Link>
          ))}

          {/* ========================= */}
          {/* MENU 3 (SETTINGS + LOGOUT) */}
          {/* ========================= */}
          {DashboardMenu3.map((item) => {

            // 🔴 LOGOUT
            if (item.action === "logout") {
              return (
                <div
                  key={item.name}
                  onClick={handleLogout}
                  className="flex items-center p-3 rounded-lg hover:bg-red-200 cursor-pointer transition"
                >
                  <div className="min-w-5 text-red-500">
                    {item.icon}
                  </div>

                  {isSidebarOpen && (
                    <span className="ml-4 text-red-600">
                      {item.name}
                    </span>
                  )}
                </div>
              );
            }

            // 🟢 NORMAL LINKS
            return (
              <Link key={item.name} href={item.href}>
                <div
                  className={`flex items-center p-3 rounded-lg hover:bg-green-200 transition ${
                    pathname === item.href ? "bg-green-200" : ""
                  }`}
                >
                  <div className="min-w-5">{item.icon}</div>

                  {isSidebarOpen && (
                    <span className="ml-4">
                      {item.name}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}

        </nav>
      </div>
    </div>
  );
};

export default SliderBar;