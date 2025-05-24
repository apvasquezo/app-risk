"use client";

import { useState } from "react";
import { useEffect } from "react";
import { UserPlus, Users, Pencil, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import axios from 'axios';

interface User {
  id: string;
  usuario: string;
  contraseña: string;
  rol: string;
}

export default function UserManagement() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    usuario: "",
    contraseña: "",
    rol: "super",
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [errors, setErrors] = useState({
    usuario: false,
    contraseña: false,
  });
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token"); 
        const response = await axios.get("http://localhost:8000/users", {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        });
        const rawUsers = response.data;
        const transformedUsers = rawUsers.map((user: any) => ({
          id: user.id_user,
          usuario: user.username,
          contraseña: "",
          rol: user.role_id === 1 ? "super" : "admin",
        }));
        console.log("Usuarios transformados:", transformedUsers);
        setUsers(transformedUsers);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error al cargar usuarios",
          description: "No se pudo obtener el listado de usuarios desde el servidor.",
        });
      }
    };
  
    fetchUsers();
  }, []);

  const validateForm = () => {
    const newErrors = {
      usuario: !formData.usuario.trim(),
      contraseña: !formData.contraseña.trim(),
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };

  const resetForm = () => {
    setFormData({
      usuario: "",
      contraseña: "",
      rol: "Supervisor",
    });
    setEditingId(null);
    setErrors({
      usuario: false,
      contraseña: false,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!validateForm()) {
      toast({
        variant: "destructive",
        title: "Error de validación",
        description: "Por favor complete todos los campos obligatorios correctamente.",
      });
      return;
    }
  
    const token = localStorage.getItem("token");
    if (!token) {
      toast({
        variant: "destructive",
        title: "No autorizado",
        description: "No se encontró un token de autenticación.",
      });
      return;
    }
  
    try {
      const payload = {
        username: formData.usuario,
        password: formData.contraseña,
        role_id: formData.rol === "super" ? 1 : 2 // Ajusta según IDs reales
      };
      console.log ("envia ", payload)
      if (editingId) {
        // Actualización (PUT)
        await axios.put(`http://localhost:8000/users/${editingId}`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        setUsers(users.map(user =>
          user.id === editingId ? { ...formData, id: editingId } : user
        ));
  
        toast({
          title: "Usuario actualizado",
          description: "Los datos del usuario han sido actualizados exitosamente.",
        });
  
      } else {
        // Registro (POST)
        const response = await axios.post("http://localhost:8000/users", payload, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        const newUser = response.data;

        const transformedUser = {
        id: newUser.id_user,
        usuario: newUser.username,
        contraseña: "",
        rol: newUser.role_id === 1 ? "super" : "admin", // ajustar según tus IDs reales
        };

        setUsers([...users, transformedUser]);
  
        toast({
          title: "Usuario registrado",
          description: "El nuevo usuario ha sido registrado exitosamente.",
        });
      }
  
      resetForm();
  
    } catch (error: any) {
      console.error("Error al procesar usuario:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.detail || "Ocurrió un error al procesar la solicitud.",
      });
    }
  };
  

  const handleEdit = (user: User) => {
    setFormData(user);
    setEditingId(user.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:8000/users/${id}`,{
        headers: {
            Authorization: `Bearer ${token}`,
          },
      });
      setUsers(users.filter(user => user.id !== id));
      if (editingId === id) resetForm();
  
      toast({
        title: "Usuario eliminado",
        description: "El usuario ha sido eliminado exitosamente.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Ocurrió un error al eliminar el usuario.",
      });
    }
  };
  

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center gap-4 ">
          <Users className="h-8 w-8 text-violet-600" />
          <h1 className="text-3xl font-bold text-violet-900">
            Gestión de Usuarios
          </h1>
        </div>

        <Card className="p-6 shadow-lg border-t-4 border-violet-500">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-violet-700">
                  Usuario <span className="text-red-500">*</span>
                </label>
                <Input
                  required
                  placeholder="Ingrese el usuario"
                  value={formData.usuario}
                  onChange={(e) => {
                    setFormData({ ...formData, usuario: e.target.value });
                    setErrors({ ...errors, usuario: false });
                  }}
                  className={`border-violet-200 focus:ring-violet-500 ${
                    errors.usuario ? "border-red-500" : ""
                  }`}
                />
                {errors.usuario && (
                  <p className="text-sm text-red-500">Este campo es obligatorio</p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-violet-700">
                  Contraseña <span className="text-red-500">*</span>
                </label>
                <Input
                  required
                  type="password"
                  placeholder="Ingrese la contraseña"
                  value={formData.contraseña}
                  onChange={(e) => {
                    setFormData({ ...formData, contraseña: e.target.value });
                    setErrors({ ...errors, contraseña: false });
                  }}
                  className={`border-violet-200 focus:ring-violet-500 ${
                    errors.contraseña ? "border-red-500" : ""
                  }`}
                />
                {errors.contraseña && (
                  <p className="text-sm text-red-500">Este campo es obligatorio</p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-violet-700">
                  Rol
                </label>
                <select
                  value={formData.rol}
                  onChange={(e) =>
                    setFormData({ ...formData, rol: e.target.value })
                  }
                  className="border-violet-200 focus:ring-violet-500 w-full rounded-md p-2"
                >
                  <option value="super">super</option>
                  <option value="admin">admin</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                type="submit"
                className="bg-orange-500 hover:bg-violet-900 text-white"
              >
                {editingId ? (
                  <>
                    <Pencil className="w-4 h-4 mr-2" />
                    Actualizar Usuario
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Registrar Usuario
                  </>
                )}
              </Button>
              {editingId && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetForm}
                  className="border-violet-600 text-violet-600 hover:bg-violet-50"
                >
                  Cancelar
                </Button>
              )}
            </div>
          </form>
        </Card>

        <Card className="p-6 shadow-lg border-t-4 border-orange-500">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-orange-900 flex items-center gap-2">
              <Users className="h-6 w-6" />
              Listado de Usuarios
            </h2>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="bg-violet-50 font-semibold text-violet-900">Usuario</TableHead>
                    <TableHead className="bg-violet-50 font-semibold text-violet-900">Rol</TableHead>
                    <TableHead className="bg-violet-50 font-semibold text-violet-900">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow 
                      key={user.id}
                      className={`border-b hover:bg-violet-50/50 transition-colors duration-200 ${
                        editingId === user.id ? "bg-violet-50" : ""
                      }`}
                    >
                      <TableCell>{user.usuario}</TableCell>
                      <TableCell>{user.rol}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-violet-600 border-violet-600 hover:bg-violet-50"
                            onClick={() => handleEdit(user)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-orange-600 border-orange-600 hover:bg-orange-50"
                            onClick={() => handleDelete(user.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}