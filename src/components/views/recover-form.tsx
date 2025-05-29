"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Mail, ArrowLeft, User } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

export default function RecuperarContrasena() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
  });
  const [isSent, setIsSent] = useState(false);
  const [loading, setLoading] = useState(false);  
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

  
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      toast.error("Por favor ingresa un correo válido.");
      return;
    }

    setLoading(true);  

    try {
      const response = await fetch("http://localhost:8000/recoverpassword", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Error en la solicitud");

      setIsSent(true);
      toast.success("Se han enviado las instrucciones a tu correo.");
    } catch (error) {
      toast.error("Usuario o correo incorrecto.");
      console.error("Error en la recuperación de contraseña:", error);
    } finally {
      setLoading(false);  
    }
  };

  if (isSent) {
    return (
      <div className="min-h-screen w-screen flex items-center justify-center p-4 bg-white">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <div className="relative w-full max-w-[200px] mx-auto">
              <Image
                src="/logo_orisk.png"
                alt="O-Risk Logo"
                width={200}
                height={50}
                className="h-auto w-full"
                priority
              />
            </div>
          </div>
          <Card className="p-8 bg-white border border-gray-300 text-center">
            <Mail className="w-12 h-12 text-orange-400 mx-auto" />
            <h2 className="text-xl font-semibold text-gray-800">Revisa tu correo</h2>
            <p className="text-gray-600">
              Hemos enviado las instrucciones para recuperar tu contraseña a {formData.email}
            </p>
            <Button
              onClick={() => router.push("/login")}
              className="w-full bg-orange-500 hover:bg-violet-900 text-white mt-4"
            >
              Volver al inicio de sesión
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-screen flex items-center justify-center p-4 bg-white">
      <div className="w-full max-w-md space-y-8 px-10 flex flex-col items-center">
        <div className="text-center">
          <div className="relative w-full max-w-[200px] mx-auto mb-5">
            <Image
              src="/logo_orisk.png"
              alt="O-Risk Logo"
              width={200}
              height={50}
              className="h-auto w-full"
              priority
            />
          </div>
          <h2 className="text-2xl font-semibold text-orange-400">Recuperar Contraseña</h2>
          <p className="mt-2 text-gray-600">
            Ingresa tu usuario y correo electrónico registrado
          </p>
        </div>

        <Card className="p-8 bg-purple-900 border border-gray-300 w-full">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5 text-orange-400" />
                <label className="text-gray-100">Usuario</label>
              </div>
              <Input
                type="text"
                value={formData.username}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, username: e.target.value }))
                }
                className="bg-gray-50 border border-gray-300 text-gray-900 w-full"
                placeholder="admin"
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Mail className="w-5 h-5 text-orange-400" />
                <label className="text-gray-100">Email</label>
              </div>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, email: e.target.value }))
                }
                className="bg-gray-50 border border-gray-300 text-gray-900 w-full"
                placeholder="admin@example.com"
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white"
              disabled={loading} 
            >
              {loading ? "Cargando..." : "Enviar instrucciones"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Button
              onClick={() => router.push("/login")}
              variant="ghost"
              className="text-gray-100 hover:text-orange-400 w-full"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al inicio de sesión
            </Button>
          </div>

          <div className="mt-4 text-center">
            <p className="text-sm text-gray-100">
              Credenciales de prueba:
              <br />
              Usuario: admin
              <br />
              Email: admin@example.com
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
