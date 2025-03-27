"use client";

import { useState } from "react";
import { UserPlus, Edit3, Trash2 } from "lucide-react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface RiskType {
  id: string;
  category: string;
  description: string;
}

const predefinedCategories = ["Operativos", "Crédito", "Legal", "Reputación", "Mercado"];

export default function RiskTypes() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({ category: "", description: "" });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [errors, setErrors] = useState({ category: false, description: false });

  const [riskTypes, setRiskTypes] = useState<RiskType[]>([
    { id: "1", category: "Operativos", description: "Fallas en procesos internos." },
    { id: "2", category: "Crédito", description: "Incumplimiento de obligaciones financieras." },
  ]);

  const validateForm = () => {
    const newErrors = {
      category: !formData.category.trim(),
      description: !formData.description.trim(),
    };
    setErrors(newErrors);
    return !newErrors.category && !newErrors.description;
  };

  const resetForm = () => {
    setFormData({ category: "", description: "" });
    setEditingId(null);
    setErrors({ category: false, description: false });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      toast({
        variant: "destructive",
        title: "Error de validación",
        description: "Todos los campos son obligatorios.",
      });
      return;
    }

    try {
      if (editingId) {
        setRiskTypes(
          riskTypes.map((riskType) =>
            riskType.id === editingId ? { ...formData, id: editingId } : riskType
          )
        );
        toast({
          title: "Tipo de Riesgo actualizado",
          description: "El tipo de riesgo ha sido actualizado exitosamente.",
        });
      } else {
        const newRiskType = { ...formData, id: Date.now().toString() };
        setRiskTypes([...riskTypes, newRiskType]);
        toast({
          title: "Tipo de Riesgo registrado",
          description: "El nuevo tipo de riesgo ha sido registrado exitosamente.",
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

  const handleEdit = (riskType: RiskType) => {
    setFormData(riskType);
    setEditingId(riskType.id);
  };

  const handleDelete = (id: string) => {
    setRiskTypes(riskTypes.filter((riskType) => riskType.id !== id));
    toast({
      title: "Tipo de Riesgo eliminado",
      description: "El tipo de riesgo ha sido eliminado exitosamente.",
    });
    if (editingId === id) resetForm();
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold text-violet-900">Gestión Tipos de Riesgos</h1>
        </div>

        <Card className="p-6 shadow-lg border-t-4 border-violet-500">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-violet-700">
                Categoría de Riesgo <span className="text-red-500">*</span>
              </label>
              <Select
                onValueChange={(value) => {
                    setFormData({ ...formData, category: value });
                    setErrors({ ...errors, category: false });
                }}
                value={formData.category}
                >
                <SelectTrigger
                    className={`${
                    errors.category ? "border-red-500" : "border-violet-200 focus:ring-violet-500"
                    } w-full rounded-md p-2 bg-white text-black`}
                >
                    <SelectValue placeholder="Seleccione una categoría" />
                </SelectTrigger>
                <SelectContent className="bg-white shadow-md border border-gray-200 rounded-md">
                    {predefinedCategories.map((category) => (
                    <SelectItem
                        key={category}
                        value={category}
                        className="hover:bg-violet-100 focus:bg-violet-200"
                    >
                        {category}
                    </SelectItem>
                    ))}
                </SelectContent>
            </Select>
              {errors.category && (
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
            <Button type="submit" className="bg-orange-500 hover:bg-violet-900 text-white">
              {editingId ? "Actualizar Tipo de Riesgo" : "Registrar Tipo de Riesgo"}
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
          </form>
        </Card>

        <Card className="p-6 shadow-lg border-t-4 border-orange-500">
          <h2 className="text-2xl font-semibold text-orange-900">Listado de Tipos de Riesgos</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="bg-violet-50">Categoría</TableHead>
                <TableHead className="bg-violet-50">Descripción</TableHead>
                <TableHead className="bg-violet-50">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {riskTypes.map((riskType) => (
                <TableRow key={riskType.id} className="hover:bg-violet-50">
                  <TableCell>{riskType.category}</TableCell>
                  <TableCell>{riskType.description}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-violet-600 border-violet-600"
                        onClick={() => handleEdit(riskType)}
                      >
                        <Edit3 className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-orange-600 border-orange-600"
                        onClick={() => handleDelete(riskType.id)}
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