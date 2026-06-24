'use client';

import { FaShoppingCart } from "react-icons/fa";
import { FiLogOut, FiSettings, FiGlobe, FiSliders } from "react-icons/fi";
import { MdHome, MdInventory } from "react-icons/md";
import { BiCategory } from "react-icons/bi";

type MenuItem = {
  name: string;
  href: string;
  icon: React.ReactNode;
  action?: "logout"; // 👈 optionnel
};

export const DashboardMenu1: MenuItem[] = [
  { name: "Home", href: "/dashboard", icon: <MdHome size={20} /> },
  { name: "Site", href: "/", icon: <FiGlobe size={20} /> },
];

export const DashboardMenu2: MenuItem[] = [
  { name: "Produits", href: "/dashboard/produits", icon: <MdInventory size={18} /> },
  { name: "Commandes", href: "/dashboard/commande", icon: <FaShoppingCart size={18} /> },
  { name: "Catégories", href: "/dashboard/category", icon: <BiCategory size={18} /> },
  { name: "Slider", href: "/dashboard/slider", icon: <FiSliders size={18} /> },
];

export const DashboardMenu3 = [
  {
    name: "Réglages",
    href: "/dashboard/reglage",
    icon: <FiSettings size={18} />,
  },
  {
    name: "Déconnexion",
    href: "#",
    icon: <FiLogOut size={18} />,
    action: "logout",
  },
];