"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { signIn } from "next-auth/react";

interface Errors {
  username: string;
  password: string;
}

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [errors, setErrors] = useState<Errors>({
    username: "",
    password: "",
  });

  const [loginError, setLoginError] = useState<string | null>(null);

  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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

    setErrors(newErrors);

    if (formIsValid)
      try {
        const response = await signIn("credentials", {
          username: formData.username,
          password: formData.password,
          redirect: false,
        });

        if (response?.ok) {
          setLoading(true);
          router.push("/prendas");
        } else {
          setLoading(true);
          setLoginError(response?.error ?? "Error desconocido");
          setTimeout(() => {
            setLoading(false);
          }, 1000);
        }
      } catch (error) {
        console.error("Error al iniciar sesión:", error);
      }
  };

  return (
    <div className="m-auto w-1/4 h-screen px-2 max-md:w-full max-xl:w-1/2">
      <h1 className="text-2xl text-center">Gestión BleeMar</h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-5 m-auto justify-between bg-white p-5 mt-5"
      >
        <h2 className="text-xl text-center">Iniciar Sesión</h2>
        {loginError && (
          <div className="bg-red-500 text-white p-1 rounded">{loginError}</div>
        )}
        <div className="flex flex-col gap-5">
          <input
            className="p-1 border rounded"
            type="text"
            name="username"
            autoComplete="username"
            placeholder="Nombre de usuario"
            value={formData.username}
            onChange={handleChange}
          />
          {errors.username && (
            <span className="text-red-500 text-sm">{errors.username}</span>
          )}
          <input
            className="p-1 border rounded"
            type="password"
            name="password"
            autoComplete="current-password"
            placeholder="Contraseña"
            value={formData.password}
            onChange={handleChange}
          />
          {errors.password && (
            <span className="text-red-500 text-sm">{errors.password}</span>
          )}
        </div>
        <button
          type="submit"
          className="bg-green-s text-white font-bold px-4 py-2 rounded hover:bg-green-m"
        >
          {loading ? (
            <span className="loader">Cargando...</span>
          ) : (
            <span>Iniciar sesión</span>
          )}
        </button>
      </form>
    </div>
  );
}
