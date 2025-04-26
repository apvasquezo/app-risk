"use client";

import { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

export default function ProfileForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    username: "",
    role: "usuario", // Rol por defecto
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    avatar: "",
  });

  const [error, setError] = useState(false);

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

  const validateForm = () => {
    const hasError =
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.username ||
      !formData.currentPassword ||
      !formData.newPassword ||
      formData.newPassword !== formData.confirmPassword;
    setError(hasError);
    return !hasError;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      alert("Hay errores en el formulario.");
      return;
    }

    // Aquí agregarías la lógica para guardar los datos del perfil, cambiar la contraseña, etc.
    console.log("Perfil actualizado:", formData);
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
                  <img
                    src={formData.avatar}
                    alt="Avatar"
                    className="w-full h-full object-cover rounded-full border-4 border-violet-500 shadow-lg"
                  />
                ) : (
                  <FaUserCircle className="w-full h-full text-violet-700 rounded-full border-4 border-violet-500 shadow-lg" />
                )}
              </div>
              <Button variant="outline" className="text-violet-600 border-violet-600">
                <label htmlFor="avatar-upload" className="cursor-pointer">Cambiar Avatar</label>
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleAvatarChange}
                />
              </Button>
            </div>

            {/* Sección de Datos Personales */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-violet-800">Datos Personales</h2>

              <div className="space-y-2">
                <label className="text-sm font-medium text-violet-700">Nombre</label>
                <Input
                  required
                  placeholder="Ingrese su nombre"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="border-violet-200 focus:ring-violet-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-violet-700">Apellido</label>
                <Input
                  required
                  placeholder="Ingrese su apellido"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="border-violet-200 focus:ring-violet-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-violet-700">Correo electrónico</label>
                <Input
                  required
                  type="email"
                  placeholder="Ingrese su correo electrónico"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="border-violet-200 focus:ring-violet-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-violet-700">Teléfono</label>
                <Input
                  placeholder="Ingrese su teléfono"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="border-violet-200 focus:ring-violet-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-violet-700">Dirección</label>
                <Input
                  placeholder="Ingrese su dirección"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="border-violet-200 focus:ring-violet-500"
                />
              </div>
            </div>

            {/* Sección de Datos del Usuario */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-violet-800">Datos de Usuario</h2>

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

              {/* Cambio de Contraseña */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-violet-700">Contraseña actual</label>
                <Input
                  type="password"
                  required
                  value={formData.currentPassword}
                  onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                  className="border-violet-200 focus:ring-violet-500"
                />
              </div>
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

            <Button type="submit" className="bg-orange-500 text-white hover:bg-violet-900">
              Actualizar Perfil
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
