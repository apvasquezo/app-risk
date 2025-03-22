"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff, Lock, Mail } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { toast } from "sonner";

export default function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Aquí iría la lógica de autenticación
    if (email === "admin@example.com" && password === "admin123") {
      toast.success("Inicio de sesión exitoso");
      router.push("/admin");
    } else {
      toast.error("Credenciales inválidas");
    }    
    console.log({ email, password, rememberMe })
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
                Correo electrónico
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-[#b47de4]" />
                <Input
                  id="email"
                  type="email"
                  placeholder="nombre@ejemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  placeholder="••••••••"
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
              <Link href="#" className="text-sm text-orange-100 hover:text-black">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            <Button type="submit" className="w-full bg-orange-500 hover:bg-[#cc90f7] text-white">
              Iniciar sesión
            </Button>

            <div className="mt-6 text-center">
              <p className="text-orange-100">
                ¿No tienes una cuenta?{"    "}
                <Link href="#" className="font-medium text-white hover:text-black">
                  Regístrate
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}