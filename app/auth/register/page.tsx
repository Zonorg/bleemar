"use client";
import { useState, FormEvent, ChangeEvent } from "react";
import { RoleRedirect } from "@/app/utils/redirect";
import { IoArrowBack } from "react-icons/io5";
import Link from "next/link";

interface FormData {
  username: string;
  password: string;
  // name: string;
  confirm_password: string;
}

interface Errors {
  username: string;
  // name: string;
  password: string;
  confirm_password: string;
}

export default function Register() {
  const [formData, setFormData] = useState<FormData>({
    username: "",
    // name: "",
    password: "",
    confirm_password: "",
  });

  const [errors, setErrors] = useState<Errors>({
    username: "",
    // name: "",
    password: "",
    confirm_password: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    let formIsValid = true;
    const newErrors: Errors = { ...errors };

    if (!formData.username.trim()) {
      formIsValid = false;
      newErrors.username = "Escribe un nombre de usuario";
    } else {
      newErrors.username = "";
    }

    // if (!formData.name.trim()) {
    //   formIsValid = false;
    //   newErrors.name = "Escribe un nombre";
    // } else {
    //   newErrors.name = "";
    // }

    if (!formData.password.trim()) {
      formIsValid = false;
      newErrors.password = "Escribe una contraseña válida";
    } else {
      newErrors.password = "";
    }

    if (formData.password !== formData.confirm_password) {
      formIsValid = false;
      newErrors.confirm_password = "Las contraseñas no coinciden";
    } else {
      newErrors.confirm_password = "";
    }

    setErrors(newErrors);

    if (formIsValid) {
      try {
        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: {
            "Content-Type": "aplication/json",
          },
          body: JSON.stringify(formData),
        });
        if (response.ok) {
          alert("Usuario creado con éxito");
          setFormData({
            username: "",
            // name: "",
            password: "",
            confirm_password: "",
          });
        }
      } catch (error) {
        console.log("Error", error);
      }
    }
  };

  return (
    <>
      <RoleRedirect />
      <div className="flex flex-col gap-5 justify-center items-center h-screen">
        <h2 className="font-medium text-xl">Crear usuario</h2>
        <div className="bg-white p-8 rounded-lg shadow-md w-80">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="input-container">
              <input
                className="p-2 border border-gray-300 rounded-md w-full"
                type="text"
                name="username"
                placeholder="Usuario"
                value={formData.username}
                onChange={handleChange}
              />
              {errors.username && (
                <span className="text-red-500 text-xs">{errors.username}</span>
              )}
            </div>
            <div className="input-container">
              <input
                className="p-2 border border-gray-300 rounded-md w-full"
                type="password"
                name="password"
                placeholder="Contraseña"
                autoComplete="off"
                value={formData.password}
                onChange={handleChange}
              />
              {errors.password && (
                <span className="text-red-500 text-xs">{errors.password}</span>
              )}
            </div>
            <div className="input-container">
              <input
                className="p-2 border border-gray-300 rounded-md w-full"
                type="password"
                name="confirm_password"
                placeholder="Confirmar Contraseña"
                autoComplete="off"
                value={formData.confirm_password}
                onChange={handleChange}
              />
              {errors.confirm_password && (
                <span className="text-red-500 text-xs">
                  {errors.confirm_password}
                </span>
              )}
            </div>
            <button
              type="submit"
              className="bg-green-s text-white font-bold px-4 py-2 rounded hover:bg-green-m"
            >
              Crear usuario
            </button>
          </form>
        </div>
        <Link
          href="/settings"
          className="flex gap-2 items-center font-medium hover:text-green-s"
        >
          <IoArrowBack />
          Ir atrás
        </Link>
      </div>
    </>
  );
}
