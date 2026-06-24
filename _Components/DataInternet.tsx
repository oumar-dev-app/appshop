'use client'
import { AiFillTikTok } from "react-icons/ai";
import { FiFacebook, FiInstagram } from "react-icons/fi";

type MenuItem = {
    name: string;
    href: string;
    icon: React.ReactNode;
};

export const DataInternet: MenuItem[] = [
    { name: "TikTok", href: "/dashboard", icon: <AiFillTikTok size={22} /> },
    { name: "Instagram", href: "/", icon: <FiInstagram size={22} /> },
    { name: "Facebook", href: "/", icon: <FiFacebook size={22} /> },
];