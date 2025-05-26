"use client";

import { useState, useEffect } from "react";
import { Edit3, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { transformRiskFactors } from "@/lib/transformers";
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
import api from "@/lib/axios";

interface RiskFactor {
  id: string;
  type: string;
  description: string;
}

const predefinedRiskFactors = ["Fraude Interno", "Fraude Externo", "Cumplimiento"];

export default function RiskFactors() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({ type: "", description: "" });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [errors, setErrors] = useState({ type: false, description: false });
  const [riskFactors, setRiskFactors] = useState<RiskFactor[]>([]);

  useEffect(() => {
    const fetchRiskFactors = async () => {
      try {
        const response = await api.get("/risk-factors");
        setRiskFactors(transformRiskFactors(response.data));
      } catch (error) {
        console.error(error);
        toast({
          variant: "destructive",
          title: "Error al cargar factores de riesgo",
          description: "No se pudo obtener el listado desde el servidor.",
        });
      }
    };
    fetchRiskFactors();
  }, [toast]);

  const validateForm = () => {
    const newErrors = {
      type: !formData.type.trim(),
      description: !formData.description.trim(),
    };
    setErrors(newErrors);
    return !newErrors.type && !newErrors.description;
  };

  const resetForm = () => {
    setFormData({ type: "", description: "" });
    setEditingId(null);
    setErrors({ type: false, description: false });
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
        await api.put(`/risk-factors/${editingId}`, formData);
        const updatedRiskFactors = riskFactors.map((factor) =>
          factor.id === editingId ? { ...factor, ...formData } : factor
        );
        setRiskFactors(updatedRiskFactors);
        toast({ title: "Actualizado", description: "El factor fue actualizado." });
      } else {
        const response = await api.post("/risk-factors", formData);
        setRiskFactors([...riskFactors, response.data]);
        toast({ title: "Registrado", description: "Nuevo factor registrado con éxito." });
      }
      resetForm();
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Ocurrió un problema al guardar los datos.",
      });
    }
  };

  const handleEdit = (factor: RiskFactor) => {
    setFormData(factor);
    setEditingId(factor.id);
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm("¿Estás segura de que deseas eliminar este factor de riesgo?");
    if (!confirmDelete) return;
    try {
      await api.delete(`/risk-factors/${id}`);
      setRiskFactors(riskFactors.filter((factor) => factor.id !== id));
      toast({ title: "Eliminado", description: "El factor fue eliminado con éxito." });
      if (editingId === id) resetForm();
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error al eliminar",
        description: "No se pudo eliminar el factor.",
      });
    }
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-violet-900">Gestión Factores de Riesgos</h1>

        <Card className="p-6 shadow-lg border-t-4 border-violet-500">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-violet-700">
                Tipo de Riesgo <span className="text-red-500">*</span>
              </label>
              <Select
                onValueChange={(value) => setFormData({ ...formData, type: value })}
                value={formData.type}
              >
                <SelectTrigger className={`border-violet-200 ${errors.type && "border-red-500"}`}>
                  <SelectValue placeholder="Seleccione un tipo de riesgo" />
                </SelectTrigger>
                <SelectContent>
                  {predefinedRiskFactors.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.type && <p className="text-sm text-red-500">Campo obligatorio</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-violet-700">
                Descripción <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="Descripción del riesgo"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className={`border-violet-200 ${errors.description && "border-red-500"}`}
              />
              {errors.description && <p className="text-sm text-red-500">Campo obligatorio</p>}
            </div>

            <div className="flex gap-4">
              <Button type="submit" className="bg-violet-500 text-white">
                {editingId ? "Actualizar" : "Registrar"}
              </Button>
              {editingId && (
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancelar
                </Button>
              )}
            </div>
          </form>
        </Card>

        <Card className="p-6 shadow-lg border-t-4 border-orange-500">
          <h2 className="text-2xl font-semibold text-orange-900">Listado de Factores</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tipo</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {riskFactors.map((factor) => (
                <TableRow key={factor.id}>
                  <TableCell>{factor.type}</TableCell>
                  <TableCell>{factor.description}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(factor)}>
                        <Edit3 />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(factor.id)}
                      >
                        <Trash2 />
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
