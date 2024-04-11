"use client";
import { useEffect, useState } from "react";

interface Order {
  id: number;
  username: string;
  role: string;
}

export default function UserData() {
  const [users, setUsers] = useState<Order[]>([]);

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
    <div className="overflow-x-auto h-screen py-2">
      <table className="w-full bg-white rounded-lg">
        <thead>
          <tr>
            <th className="px-4 py-2 text-start">ID</th>
            <th className="px-4 py-2 text-start">Nombre de usuario</th>
            <th className="px-4 py-2 text-start">Rol</th>
            <th className="px-4 py-2 text-start">Acciones</th>
          </tr>
        </thead>
        <tbody className="align-top">
          {users.map((order, index) => (
            <tr key={index} className="border-b">
              <td className="px-4 py-2">{index + 1}</td>
              <td className="px-4 py-2">{order.username}</td>
              <td className="px-4 py-2">{order.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
