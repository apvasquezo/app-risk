"use client";

import { useState, useEffect } from "react";
import { Users, Pencil, Trash2, UserPlus } from "lucide-react";
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
import api from "@/lib/axios";

interface Macroprocess {
  id: number;
  description: string;
}

interface RawMacro {
  id_macro: number;
  description: string;
}

export default function MacroprocessPage() {
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    description: "",
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [errors, setErrors] = useState({
    description: false,
  });
  const [macroprocesses, setMacroprocesses] = useState<Macroprocess[]>([]);

  useEffect(() => {
    const fetchMacroprocesses = async () => {
      try {
        const response = await api.get("/macroprocesses");
        const mapped: Macroprocess[] = response.data.map((item: RawMacro) => ({
          id: item.id_macro,
          description: item.description,
        }));
        setMacroprocesses(mapped);
      } catch (error) {
        console.error(error);
        toast({
          variant: "destructive",
          title: "Error al cargar macroprocesos",
          description: "No se pudo obtener el listado de macroprocesos del servidor.",
        });
      }
    };
    fetchMacroprocesses();
  }, [toast]);

  const validateForm = () => {
    const newErrors = {
      description: !formData.description.trim(),
    };
    setErrors(newErrors);
    return !newErrors.description;
  };

  const resetForm = () => {
    setFormData({ description: "" });
    setEditingId(null);
    setErrors({ description: false });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      toast({
        variant: "destructive",
        title: "Error de validación",
        description: "La descripción es obligatoria.",
      });
      return;
    }

    try {
      if (editingId !== null) {
        await api.put(`/macroprocesses/${editingId}`, {
          description: formData.description,
        });

        setMacroprocesses(
          macroprocesses.map((mp) =>
            mp.id === editingId
              ? { id: editingId, description: formData.description }
              : mp
          )
        );

        toast({
          title: "Macroproceso actualizado",
          description: "Los datos del macroproceso han sido actualizados exitosamente.",
        });
      } else {
        const response = await api.post("/macroprocesses", {
          description: formData.description,
        });

        const newMacroprocess: Macroprocess = {
          id: response.data.id_macro,
          description: response.data.description,
        };

        setMacroprocesses([...macroprocesses, newMacroprocess]);

        toast({
          title: "Macroproceso registrado",
          description: "El nuevo macroproceso ha sido registrado exitosamente.",
        });
      }

      resetForm();
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Ocurrió un error al procesar la solicitud.",
      });
    }
  };

  const handleEdit = (macroprocess: Macroprocess) => {
    setFormData({ description: macroprocess.description });
    setEditingId(macroprocess.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete =async (id: number) => {
    const confirmDelete = window.confirm("¿Estás segura de que deseas eliminar este macroproceso?");
    if (!confirmDelete) return;
    try {
      await api.delete(`/macroprocesses/${id}`);
      setMacroprocesses(macroprocesses.filter((mp) => mp.id !== id));
      if (editingId === id) resetForm();

      toast({
        title: "Macroproceso eliminado",
        description: "El macroproceso ha sido eliminado exitosamente.",
      });
    } catch (error) {
      console.error(error);
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
          <h1 className="text-3xl font-bold text-violet-900">Gestión de Macroprocesos</h1>
        </div>

        <Card className="p-6 shadow-lg border-t-4 border-violet-500">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-violet-700">
                Descripción <span className="text-red-500">*</span>
              </label>
              <Input
                required
                placeholder="Ingrese la descripción"
                value={formData.description}
                onChange={(e) => {
                  setFormData({ description: e.target.value });
                  setErrors({ description: false });
                }}
                className={`border-violet-200 focus:ring-violet-500 ${
                  errors.description ? "border-red-500" : ""
                }`}
              />
              {errors.description && (
                <p className="text-sm text-red-500">Este campo es obligatorio</p>
              )}
            </div>

            <div className="flex gap-2">
              <Button type="submit" className="bg-orange-500 hover:bg-violet-900 text-white">
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
                    <TableHead className="bg-violet-50 font-semibold text-violet-900">
                      Descripción
                    </TableHead>
                    <TableHead className="bg-violet-50 font-semibold text-violet-900">
                      Acciones
                    </TableHead>
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
