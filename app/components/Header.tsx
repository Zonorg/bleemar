"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

export default function Navbar() {
  const [loadingSession, setLoadingSession] = useState(true);
  const { data: session } = useSession();
  const pathname = usePathname();
  console.log(session)

  useEffect(() => {
    const fetchData = async () => {
      await getSession();
      setLoadingSession(false);
    };
    fetchData();
  }, []);

  const getSession = async () => {
    try {
      await session;
    } catch (error) {
      console.error("Error fetching session:", error);
    }
  };

  if (loadingSession || pathname === "/auth/login") return null;

  return (
    <div className="flex flex-col">
      <div className="flex gap-3 items-center">
        <span className="text-md py-2 px-4">
          Bienvenido,{" "}
          {session?.role === "Admin" && (
            <span style={{ color: "#09c184", fontWeight: "500" }}>Admin</span>
          )}
          {session?.role === "User" && (
            <span style={{ color: "#09c184", fontWeight: "500" }}>User</span>
          )}
        </span>
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
