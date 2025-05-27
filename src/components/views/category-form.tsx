"use client";

import { useState, useEffect } from "react";
import { Edit3, Trash2, Users } from "lucide-react";
import { Pencil, UserPlus } from "lucide-react";
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

interface RiskCategory {
  id: number;
  description: string;
}

interface RawCategory {
  id_riskcategory: number
  description: string
}

export default function RiskCategories() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({ description: "" });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [errors, setErrors] = useState({ description: false });
  const [categories, setCategories] = useState<RiskCategory[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/risk-categories");
        console.log("Recibo ", response.data);
        const mapped: RiskCategory[] = response.data.map((item: RawCategory) => ({
          id: item.id_riskcategory,
          description: item.description,
        }));
        console.log("mapea ", mapped);
        setCategories(mapped);
      } catch {
        toast({
          variant: "destructive",
          title: "Error al cargar categorías",
          description: "No se pudo obtener el listado de categorías.",
        });
      }
    };
    fetchCategories();
  }, [toast]);

  const validateForm = () => {
    const newErrors = { 
      description: !formData.description.trim() };
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
        description: "El nombre de la categoría es obligatorio.",
      });
      return;
    }
    try {
      if (editingId!== null) {
        await api.put(`/risk-categories/${editingId}`, {
          description: formData.description,
        });
        setCategories(
          categories.map((cat) =>
            cat.id === editingId ? { id:editingId, description: formData.description } : cat
          )
        );
        toast({
          title: "Categoría actualizada",
          description: "La categoría fue actualizada correctamente.",
        });
      } else {
        const response = await api.post("/risk-categories", {
          description: formData.description,
        });
        const newCategory : RiskCategory = {
          id: response.data.id_category,
          description: response.data.description,
        };
        setCategories([...categories, newCategory]);
        toast({
          title: "Categoría registrada",
          description: "La nueva categoría fue registrada correctamente.",
        });
      }
      resetForm();
    } catch {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Ocurrió un error al procesar la solicitud.",
      });
    }
  };

  const handleEdit = (category: RiskCategory) => {
    setFormData({ description: category.description });
    setEditingId(category.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm("¿Estás segura de que deseas eliminar esta categoria de riesgo?");
    if (!confirmDelete) return;
    try {
      await api.delete(`/risk-categories/${id}`);
      setCategories(categories.filter((cat) => cat.id !== id));
      if (editingId === id) resetForm();      
      toast({
        title: "Categoría eliminada",
        description: "La categoría ha sido eliminada exitosamente.",
      });

    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error al eliminar",
        description: "No se pudo eliminar la categoría.",
      });
    }
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold text-violet-900">Gestión de Categorías de Riesgos</h1>
        </div>

        <Card className="p-6 shadow-lg border-t-4 border-violet-500">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-violet-700">
                Nombre de la Categoría <span className="text-red-500">*</span>
              </label>
              <Input
                required
                placeholder="Ingrese el nombre de la categoría"
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
            <div className="flex gap-4">
              <Button type="submit" className="bg-orange-500 hover:bg-violet-900 text-white">
                {editingId ? (
                  <>
                  <Pencil className="w-4 h-4 mr-2" />
                  Actualizar Categoria
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Registrar Categoria
                </>
                )}
              </Button>
              {editingId && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetForm}
                  className="text-violet-600 border-violet-600"
                >
                  Cancelar
                </Button>
              )}
            </div>
          </form>
        </Card>

        <Card className="p-6 shadow-lg border-t-4 border-orange-500">
          <h2 className="text-2xl font-semibold text-orange-900">
            <Users className="h-6 w-6" />
            Listado de Categorías</h2>
            <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="bg-violet-50">Nombre</TableHead>
                  <TableHead className="bg-violet-50">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => (
                  <TableRow 
                    key={category.id}
                    className={`border-b hover:bg-violet-50/50 transition-colors duration-200 ${
                      editingId === category.id ? "bg-violet-50" : ""
                    }`}
                  >
                    <TableCell>{category.description}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-violet-600 border-violet-600"
                          onClick={() => handleEdit(category)}
                        >
                          <Edit3 className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-orange-600 border-orange-600"
                          onClick={() => handleDelete(category.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </div>
  );
}