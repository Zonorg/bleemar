"use client";
import { useState, FormEvent, ChangeEvent } from "react";
import { roleRedirect } from "@/app/utils/redirect";

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
  const isRedirected = roleRedirect();
  if (isRedirected) return null;

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
    <div className="m-auto bg-white  w-64 h-64">
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <input
          className="p-1"
          type="text"
          name="username"
          placeholder="Usuario"
          value={formData.username}
          onChange={handleChange}
        />
        {errors.username && (
          <span className="text-red-500 text-sm">{errors.username}</span>
        )}
        {/* <input
          className="p-1"
          type="text"
          name="name"
          placeholder="Nombre"
          value={formData.name}
          onChange={handleChange}
        />
        {errors.name && (
          <span className="text-red-500 text-sm">{errors.name}</span>
        )} */}
        <input
          className="p-1"
          type="password"
          name="password"
          placeholder="Contraseña"
          value={formData.password}
          onChange={handleChange}
        />
        {errors.password && (
          <span className="text-red-500 text-sm">{errors.password}</span>
        )}
        <input
          className="p-1"
          type="password"
          name="confirm_password"
          placeholder="Confirmar Contraseña"
          value={formData.confirm_password}
          onChange={handleChange}
        />
        {errors.confirm_password && (
          <span className="text-red-500 text-sm">
            {errors.confirm_password}
          </span>
        )}
        <button
          type="submit"
          className="bg-green-s text-white font-bold px-4 py-2 rounded"
        >
          Crear usuario
        </button>
      </form>
    </div>
  );
}
