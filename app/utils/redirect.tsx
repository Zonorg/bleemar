"use client";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

export const RoleRedirect = () => {
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user?.name !== "Admin") {
      router.push("/prendas");
    }
  }, [session, router]);

  return null;
};
