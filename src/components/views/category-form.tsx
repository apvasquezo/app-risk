"use client";

import { useState, useEffect } from "react";
import { Edit3, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { transformCategories } from "@/lib/transformers";
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
  id_category: string;
  name: string;
}

export default function RiskCategories() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({ name: "" });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [errors, setErrors] = useState({ name: false });
  const [categories, setCategory] = useState<RiskCategory[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/risk-categories");
        setCategory(transformCategories(response.data));
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
    const newErrors = { name: !formData.name.trim() };
    setErrors(newErrors);
    return !newErrors.name;
  };

  const resetForm = () => {
    setFormData({ name: "" });
    setEditingId(null);
    setErrors({ name: false });
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
      if (editingId) {
        await api.put(`/risk-categories/${editingId}`, {
          description: formData.name,
        });
        setCategory(
          categories.map((cat) =>
            cat.id_category === editingId ? { ...cat, name: formData.name } : cat
          )
        );
        toast({
          title: "Categoría actualizada",
          description: "La categoría fue actualizada correctamente.",
        });
      } else {
        const response = await api.post("/risk-categories", {
          description: formData.name,
        });
        const newCategory = {
          id_category: response.data.id_category,
          name: response.data.description,
        };
        setCategory([...categories, newCategory]);
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
    setFormData({ name: category.name });
    setEditingId(category.id_category);
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm("¿Estás segura de que deseas eliminar esta categoria de riesgo?");
    if (!confirmDelete) return;
    try {
      await api.delete(`/risk-categories/${id}`);
      setCategory(categories.filter((cat) => cat.id_category !== id));
      toast({
        title: "Categoría eliminada",
        description: "La categoría ha sido eliminada exitosamente.",
      });
      if (editingId === id) resetForm();
    } catch {
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
                value={formData.name}
                onChange={(e) => {
                  setFormData({ name: e.target.value });
                  setErrors({ name: false });
                }}
                className={`border-violet-200 focus:ring-violet-500 ${
                  errors.name ? "border-red-500" : ""
                }`}
              />
              {errors.name && (
                <p className="text-sm text-red-500">Este campo es obligatorio</p>
              )}
            </div>
            <div className="flex gap-4">
              <Button type="submit" className="bg-orange-500 hover:bg-violet-900 text-white">
                {editingId ? "Actualizar Categoría" : "Registrar Categoría"}
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
          <h2 className="text-2xl font-semibold text-orange-900">Listado de Categorías</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="bg-violet-50">Nombre</TableHead>
                <TableHead className="bg-violet-50">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.id_category} className="hover:bg-violet-50">
                  <TableCell>{category.name}</TableCell>
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
                        onClick={() => handleDelete(category.id_category)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
}
