"use client";
import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();
  console.log(session?.user?.name);
  const pathname = usePathname();
  if (pathname === "/auth/login") return null;
  return (
    <div className="flex flex-col">
      <div className="flex gap-3 items-center">
        <span className="text-md py-2 px-4">Bienvenido, User</span>
        <Link className="text-blue-400 font-medium md:hidden" href="/cortes">
          Cortes
        </Link>
        <Link className="text-blue-400 font-medium md:hidden" href="/prendas">
          Prendas
        </Link>
      </div>

      <hr className="w-full border-zinc-500" />
    </div>
  );
}
