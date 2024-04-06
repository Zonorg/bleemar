"use client";
import { useState, FormEvent, ChangeEvent } from "react";
import { useRouter } from "next/navigation";

interface FormData {
  username: string;
  password: string;
  confirm_password: string;
}

interface Errors {
  username: string;
  password: string;
  confirm_password: string;
}

export default function Register() {
  const router = useRouter();

  const [formData, setFormData] = useState<FormData>({
    username: "",
    password: "",
    confirm_password: "",
  });

  const [errors, setErrors] = useState<Errors>({
    username: "",
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
          router.push("/");
        }
      } catch (error) {
        console.log("Error", error);
      }
    }
  };

  return (
    <div className="m-auto">
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <input
          className="p-1"
          type="text"
          name="username"
          placeholder="Nombre de usuario"
          value={formData.username}
          onChange={handleChange}
        />
        {errors.username && (
          <span className="text-red-500 text-sm">{errors.username}</span>
        )}
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
          className="bg-green-s text-white font-bold px-4 py-2 rounded-lg"
        >
          Crear usuario
        </button>
      </form>
    </div>
  );
}
