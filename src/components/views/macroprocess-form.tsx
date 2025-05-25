"use client";

import { useState } from "react";
import { UserPlus, Users, Pencil, Trash2 } from "lucide-react";
import { Card } from "@/components/ui_prueba/card";
import { Input } from "@/components/ui_prueba/input";
import { Button } from "@/components/ui_prueba/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui_prueba/table";
import { useToast } from "@/hooks/use-toast";

interface Macroprocess {
  id: string;
  name: string;
  description: string;
}

export default function Macroprocess() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const [editingId, setEditingId] = useState<string | null>(null);

  const [errors, setErrors] = useState({
    name: false,
    description: false,
  });

  const [macroprocesses, setMacroprocesses] = useState<Macroprocess[]>([
    {id: "1",
    name: "Gestión Estratégica",
    description: "Incluye la planificación y dirección estratégica de la organización.",
  },
  {
    id: "2",
    name: "Misionales",
    description: "Engloba los procesos relacionados directamente con la misión de la organización.",
  },
  ]);

  const validateForm = () => {
    const newErrors = {
      name: !formData.name.trim(),
      description: !formData.description.trim(),
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
    });
    setEditingId(null);
    setErrors({
      name: false,
      description: false,
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

    try {
      if (editingId) {
        setMacroprocesses(macroprocesses.map(mp => 
          mp.id === editingId 
            ? { ...formData, id: editingId } 
            : mp
        ));
        toast({
          title: "Macroproceso actualizado",
          description: "Los datos del macroproceso han sido actualizados exitosamente.",
        });
      } else {
        const newMacroprocess = {
          ...formData,
          id: Date.now().toString(),
        };
        setMacroprocesses([...macroprocesses, newMacroprocess]);
        toast({
          title: "Macroproceso registrado",
          description: "El nuevo macroproceso ha sido registrado exitosamente.",
        });
      }
      resetForm();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Ocurrió un error al procesar la solicitud.",
      });
    }
  };

  const handleEdit = (macroprocess: Macroprocess) => {
    setFormData(macroprocess);
    setEditingId(macroprocess.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id: string) => {
    try {
      setMacroprocesses(macroprocesses.filter(mp => mp.id !== id));
      if (editingId === id) {
        resetForm();
      }
      toast({
        title: "Macroproceso eliminado",
        description: "El macroproceso ha sido eliminado exitosamente.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Ocurrió un error al eliminar el macroproceso.",
      });
    }
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center gap-4">
          <Users className="h-8 w-8 text-violet-600" />
          <h1 className="text-3xl font-bold text-violet-900">
            Gestión de Macroprocesos
          </h1>
        </div>

        <Card className="p-6 shadow-lg border-t-4 border-violet-500">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-violet-700">
                  Nombre del Macroproceso <span className="text-red-500">*</span>
                </label>
                <Input
                  required
                  placeholder="Ingrese el macroproceso"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value });
                    setErrors({ ...errors, name: false });
                  }}
                  className={`border-violet-200 focus:ring-violet-500 ${
                    errors.name ? "border-red-500" : ""
                  }`}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">Este campo es obligatorio</p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-violet-700">
                  Descripción <span className="text-red-500">*</span>
                </label>
                <Input
                  required
                  placeholder="Ingrese la descripción"
                  value={formData.description}
                  onChange={(e) => {
                    setFormData({ ...formData, description: e.target.value });
                    setErrors({ ...errors, description: false });
                  }}
                  className={`border-violet-200 focus:ring-violet-500 ${
                    errors.description ? "border-red-500" : ""
                  }`}
                />
                {errors.description && (
                  <p className="text-sm text-red-500">Este campo es obligatorio</p>
                )}
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
                    Actualizar Macroproceso
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Registrar Macroproceso
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
              Listado de Macroprocesos
            </h2>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="bg-violet-50 font-semibold text-violet-900">Nombre</TableHead>
                    <TableHead className="bg-violet-50 font-semibold text-violet-900">Descripción</TableHead>
                    <TableHead className="bg-violet-50 font-semibold text-violet-900">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {macroprocesses.map((macroprocess) => (
                    <TableRow 
                      key={macroprocess.id}
                      className={`border-b hover:bg-violet-50/50 transition-colors duration-200 ${
                        editingId === macroprocess.id ? "bg-violet-50" : ""
                      }`}
                    >
                      <TableCell>{macroprocess.name}</TableCell>
                      <TableCell>{macroprocess.description}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-violet-600 border-violet-600 hover:bg-violet-50"
                            onClick={() => handleEdit(macroprocess)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-orange-600 border-orange-600 hover:bg-orange-50"
                            onClick={() => handleDelete(macroprocess.id)}
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