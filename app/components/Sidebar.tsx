"use client";
import Link from "next/link";
import { GiRolledCloth } from "react-icons/gi";
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
    return pathname.startsWith(href);
  };

  return (
    <>
      <nav className="navigation z-1 fixed bg-white h-screen w-64 flex flex-col justify-start shadow-lg max-lg:hidden">
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
                isActive("/rollos")
                  ? "bg-green-s text-white hover:bg-green-s"
                  : ""
              }`}
              href="/rollos"
            >
              <GiRolledCloth className="rotate-12" size={18} />
              Rollos
            </Link>
          </div>
          <div className="sidebar_bottom_menu flex flex-col">
            <Link
              className={`flex items-center gap-2 hover:bg-background-gray p-2 rounded-md ${
                isActive("/settings")
                  ? "bg-green-s text-white hover:bg-green-s"
                  : ""
              }`}
              href="/settings"
            >
              <FaGear size={16} />
              Configuración
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
      <div className="z-0 bg-white h-0 w-64 max-lg:hidden"></div>
    </>
  );
}
