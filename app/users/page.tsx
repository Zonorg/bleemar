"use client";
import { useEffect, useState } from "react";
import { RoleRedirect } from "@/app/utils/redirect";

interface User {
  id: number;
  username: string;
  name: string;
  // role: string;
}

export default function UserData() {
  const [users, setUsers] = useState<User[]>([]);

  async function fetchData() {
    try {
      const res = await fetch("/api/users");
      if (res.ok) {
        const users = await res.json();
        setUsers(users);
      } else {
        console.error("Error fetching users:", res.statusText);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <RoleRedirect />
      <div className="overflow-x-auto h-screen py-2">
        <table className="w-full bg-white rounded-lg">
          <thead>
            <tr>
              <th className="px-4 py-2 text-start">ID</th>
              <th className="px-4 py-2 text-start">Nombre de usuario</th>
              {/* <th className="px-4 py-2 text-start">Nombre</th> */}
              <th className="px-4 py-2 text-start">Rol</th>
              <th className="px-4 py-2 text-start">Acciones</th>
            </tr>
          </thead>
          <tbody className="align-top">
            {users.map((user, index) => (
              <tr key={index} className="border-b">
                <td className="px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2">{user.username}</td>
                <td className="px-4 py-2">{user.name}</td>
                {/* <td className="px-4 py-2">{order.role}</td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
