'use client'
import { FaShoppingCart, FaUserCog } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { MdHome } from "react-icons/md";
import { MdInventory } from "react-icons/md";
import { BiCategory } from "react-icons/bi";
import { FiSettings } from "react-icons/fi";
import { FiGlobe } from "react-icons/fi";
import { FiSliders } from "react-icons/fi";


type MenuItem1 = {
  name: string;
  href: string;
  icon: React.ReactNode;
};

export const DashboardMenu1: MenuItem1[] = [
  { name: "Home", href: "/dashboard", icon: <MdHome size={20} /> },
  { name: "Site", href: "/", icon: <FiGlobe size={20} /> },
];

type MenuItem2 = {
  name: string;
  href: string;
  icon: React.ReactNode;
};

export const DashboardMenu2: MenuItem2[] = [
  { name: "Produits", href: "/dashboard/produits", icon: <MdInventory size={18} /> },
  { name: "Commandes", href: "/dashboard/commande", icon: <FaShoppingCart size={18} /> },
  { name: "Catégories", href: "/dashboard/category", icon: <BiCategory size={18} /> },
  { name: "Slider", href: "/dashboard/slider", icon: <FiSliders size={18} /> },


];


type MenuItem3 = {
  name: string;
  href: string;
  icon: React.ReactNode;
};

export const DashboardMenu3: MenuItem3[] = [
  { name: "Réglages", href: "/dashboard/reglage", icon: <FiSettings size={18} /> },
  { name: "Deconnecte", href: "/", icon: <FiLogOut size={18} /> }
];