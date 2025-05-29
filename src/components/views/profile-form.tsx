"use client";

import type React from "react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/axios";
import { useToast } from "@/hooks/use-toast";

export default function ProfileForm() {
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    username: "",
    role: "usuario",
    avatar: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await api.get("/api/profile/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFormData({
          username: res.data.username,
          role: res.data.role || "usuario",
          avatar: "",
          newPassword: "",
          confirmPassword: "",
        });
      } catch (err) {
        console.error("Error al cargar perfil", err);
      }
    };

    fetchProfile();
  }, []);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, avatar: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Las contraseñas no coinciden",
        variant: "destructive",
      });
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await api.put(
        "/api/profile/me",
        {
          username: formData.username,
          new_password: formData.newPassword || undefined,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      localStorage.removeItem("token");
      localStorage.removeItem("role");
      toast({
        title: "Perfil actualizado",
        description: "Inicia sesión nuevamente con tus nuevos datos.",
      });
      router.push("/login");
    } catch (error) {
      console.error("Error al actualizar perfil", error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el perfil",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-violet-900">Editar Perfil</h1>

        <Card className="p-6 shadow-lg border-t-4 border-violet-500">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Avatar */}
            <div className="flex items-center justify-center flex-col space-y-4 mb-6">
              <div className="relative w-32 h-32">
                {formData.avatar ? (
                  <Image
                    src={formData.avatar || "/placeholder.svg"}
                    alt="Avatar"
                    width={128}
                    height={128}
                    className="object-cover rounded-full border-4 border-violet-500 shadow-lg"
                  />
                ) : (
                  <FaUserCircle className="w-full h-full text-violet-200 rounded-full border-4 border-violet-300 shadow-lg" />
                )}
              </div>
              <span className="text-sm font-medium text-gray-700">
              </span>
              <Button variant="outline" className="text-violet-600 border-violet-600">
                <label htmlFor="avatar-upload" className="cursor-pointer">
                  Cambiar Avatar
                </label>
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleAvatarChange}
                />
              </Button>
            </div>

            {/* Sección de Datos del Usuario */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-orange-500">Datos de Usuario</h2>

              <div className="space-y-2">
                <label className="text-sm font-medium text-violet-700">Nombre de usuario</label>
                <Input
                  required
                  placeholder="Ingrese su nombre de usuario"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="border-violet-200 focus:ring-violet-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-violet-700">Rol</label>
                <Input
                  disabled
                  value={formData.role}
                  className="border-violet-200 focus:ring-violet-500 bg-gray-100"
                />
              </div>
            </div>

            {/* Cambio de Contraseña */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-violet-800">Cambio de Contraseña</h2>

              <div className="space-y-2">
                <label className="text-sm font-medium text-violet-700">Nueva contraseña</label>
                <Input
                  type="password"
                  required
                  value={formData.newPassword}
                  onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                  className="border-violet-200 focus:ring-violet-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-violet-700">Confirmar nueva contraseña</label>
                <Input
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="border-violet-200 focus:ring-violet-500"
                />
              </div>
            </div>

            {/* Botones */}
            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                className="text-violet-600 border-violet-600 hover:bg-violet-900 hover:text-white"
                onClick={() => {
                  if (user?.role === "super") {
                    router.push("/super");
                  } else {
                    router.push("/admin");
                  }
                }}
              >
                Volver
              </Button>
              <Button type="submit" className="bg-orange-500 text-white hover:bg-violet-900">
                Actualizar Perfil
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
