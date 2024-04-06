"use client";
import Link from "next/link";
import { RiScissors2Fill } from "react-icons/ri";
import { FaShirt, FaGear } from "react-icons/fa6";
import { IoIosExit } from "react-icons/io";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

export default function Sidebar() {
  const pathname = usePathname();
  if (pathname === "/auth/login") {
    return null;
  }

  const isActive = (href: string) => {
    return pathname === href;
  };

  return (
    <nav className="navigation bg-white h-full w-64 flex flex-col justify-start shadow-lg max-md:w-64 max-md:hidden">
      <div className="py-5 px-5">
        <Link href="/" className="text-2xl">
          BleeMar
        </Link>
      </div>
      <div className="flex flex-col justify-between h-full px-4">
        <div className="sidebar_top_menu flex flex-col ">
          <Link
            className={`flex items-center gap-2 hover:bg-background-gray p-2 rounded-md ${
              isActive("/prendas")
                ? "bg-green-s text-white hover:bg-green-s"
                : ""
            }`}
            href="/prendas"
          >
            <FaShirt size={18} />
            Prendas
          </Link>
          <Link
            className={`flex items-center gap-2 hover:bg-background-gray p-2 rounded-md ${
              isActive("/cortes")
                ? "bg-green-s text-white hover:bg-green-s"
                : ""
            }`}
            href="/cortes"
          >
            <RiScissors2Fill className="rotate-12" size={18} />
            Cortes
          </Link>
        </div>
        <div className="sidebar_bottom_menu flex flex-col">
          <Link
            className="flex items-center gap-2 hover:bg-background-gray p-2 rounded-md"
            href="#"
          >
            <FaGear size={16} />
            Panel de control
          </Link>
          <Link
            className="flex items-center gap-2 hover:bg-background-gray p-2 rounded-md"
            href="#"
            onClick={() => signOut()}
          >
            <IoIosExit size={18} />
            Salir
          </Link>
        </div>
      </div>
    </nav>
  );
}
