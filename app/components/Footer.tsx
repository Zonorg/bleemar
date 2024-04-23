"use client";
import Link from "next/link";
import { GiRolledCloth } from "react-icons/gi";
import { FaShirt, FaGear } from "react-icons/fa6";
import { IoIosExit } from "react-icons/io";
import { signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  const { data: session } = useSession();

  if (pathname === "/auth/login") {
    return null;
  }

  const isActive = (href: string) => {
    return pathname.startsWith(href);
  };

  return (
    <footer className="footer fixed bottom-0	w-full h-16 flex items-center justify-around bg-blue-l lg:hidden text-white">
      <Link
        className={`flex flex-col items-center p-2 rounded-md ${
          isActive("/prendas") ? "text-green-xs" : ""
        }`}
        href="/prendas"
      >
        <FaShirt size={18} />
        Prendas
      </Link>
      {session?.user?.name === "Admin" && (
        <Link
          className={`flex flex-col items-center p-2 rounded-md ${
            isActive("/rollos") ? "text-green-xs" : ""
          }`}
          href="/rollos"
        >
          <GiRolledCloth size={18} />
          Rollos
        </Link>
      )}

      {session?.user?.name === "Admin" && (
        <Link
          className={`flex flex-col items-center p-2 rounded-md ${
            isActive("/settings") || isActive("/auth/register")
              ? "text-green-xs"
              : ""
          }`}
          href="/settings"
        >
          <FaGear size={18} />
          Configuración
        </Link>
      )}

      <Link
        href="#"
        onClick={() => signOut()}
        className="flex flex-col items-center p-2"
      >
        <IoIosExit size={18} />
        Salir
      </Link>
    </footer>
  );
}
