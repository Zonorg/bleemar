"use client";
import Link from "next/link";
import { FaUserCog } from "react-icons/fa";
import { FaUserPlus } from "react-icons/fa6";
import { roleRedirect } from "@/app/utils/redirect";

export default function page() {
  const isRedirected = roleRedirect();
  if (isRedirected) return null;

  return (
    <div className="flex gap-5 m-auto bg-white w-2/3 py-5 rounded-lg max-lg:w-full">
      <div className="links mx-auto flex gap-5">
        <Link
          href="/auth/register"
          className="bg-background-gray hover:bg-background-gray-hover p-4 rounded-lg mb-auto flex flex-col items-center w-36"
        >
          Crear usuario <FaUserPlus />
        </Link>
        <Link
          href="/users"
          className="bg-background-gray hover:bg-background-gray-hover p-4 rounded-lg mb-auto flex flex-col items-center w-36"
        >
          Modificar usuario <FaUserCog />
        </Link>
      </div>
    </div>
  );
}
