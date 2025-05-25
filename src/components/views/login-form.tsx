"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useAuth } from "@/context/AuthContext";
import { Eye, EyeOff, Lock, User } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { toast } from "sonner";
import axios from "axios"

export default function LoginForm() {
  const { setUser } = useAuth();
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      const response = await axios.post("http://localhost:8000/auth/login", {
        username,
        password
      });
  
      const { access_token, role } = response.data;
      localStorage.setItem("token", access_token);
      localStorage.setItem("role",role)
      setUser({ role });
      console.log("este es mi rol", role)
      switch (role) {
        case "super":
          console.log("Redirigiendo a", role);
          window.location.href = "/super";
          break;
        case "admin":
          router.push("/admin");
          break;
        default:
          router.push("/login");
          break;
      }
  
      toast.success("Inicio de sesión exitoso");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error en el inicio de sesión:", error.response?.data?.detail || error.message);
      } else {
        console.error("Error inesperado:", error);
      }
      toast.error("Credenciales inválidas");
    }
  }

  return (
    <div className="flex w-full flex-col md:flex-row">
      {/* Lado izquierdo con logo */}
      <div className="flex w-full items-center justify-center bg-gradient-to-br  p-8 md:w-5/12 md:p-12 lg:p-16">
        <div className="max-w-md text-center">
          <div className="mb-8 flex justify-center">
            {/* Placeholder para el logo de O-Risk */}
            <div className="relative w-full max-w-[400px]">
              <Image
                src="/logo_orisk.png"
                alt="O-Risk Logo"
                width={600}
                height={200}
                className="h-auto w-full"
                priority
              />
            </div>
          </div>
          <h2 className="mb-4 text-2xl font-bold text-purple-900 md:text-3xl">Gestión de Riesgos Operativos</h2>
          <p className="text-lg text-gray/80">
            Soluciones integrales para la identificación, evaluación y control de riesgos empresariales.
          </p>
        </div>
      </div>

      {/* Lado derecho con formulario */}
      <div className="flex w-full items-center justify-center p-8 md:w-7/12 md:p-12 lg:p-16 bg-purple-800 ">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-white">Bienvenido</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-orange-100">
                Nombre de usuario
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-[#b47de4]" />
                <Input
                  id="username"
                  type="text"
                  placeholder="Ingresa tu usuario"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-10 border-[#d4b6f0] focus:border-[#9c44dc] focus:ring-[#9c44dc]"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-orange-100">
                Contraseña
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-[#b47de4]" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Ingresa tu contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 border-[#d4b6f0] focus:border-[#9c44dc] focus:ring-[#9c44dc]"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-[#b47de4] hover:text-[#9c44dc]"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked === true)}
                  className="border-[#fc8b21] text-[#9c44dc] focus:ring-[#9c44dc]"
                />
                <Label htmlFor="remember" className="text-sm text-gray-50">
                  Recordarme
                </Label>
              </div>
              <Link href="/recoverpassword" className="text-sm text-orange-100 hover:text-black">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            <Button type="submit" className="w-full bg-orange-500 hover:bg-[#cc90f7] text-white">
              Iniciar sesión
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
