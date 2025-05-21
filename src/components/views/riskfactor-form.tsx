"use client";

import { useState } from "react";
import { Edit3, Trash2 } from "lucide-react";
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

interface RiskFactor {
  id: string;
  type: string;
  description: string;
}

const predefinedRiskFactors = ["Fraude Interno", "Fraude Externo", "Clientes", "Fallas Tecnológicas"];

export default function RiskFactors() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({ type: "", description: "" });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [errors, setErrors] = useState({ type: false, description: false });

  const [riskFactors, setRiskFactors] = useState<RiskFactor[]>([
    { id: "1", type: "Fraude Interno", description: "Acciones fraudulentas cometidas por empleados." },
    { id: "2", type: "Fraude Externo", description: "Actos de fraude cometidos por externos a la organización." },
  ]);

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
        setRiskFactors(
          riskFactors.map((riskFactor) =>
            riskFactor.id === editingId ? { ...formData, id: editingId } : riskFactor
          )
        );
        toast({
          title: "Factor de Riesgo actualizado",
          description: "El factor de riesgo ha sido actualizado exitosamente.",
        });
      } else {
        const newRiskFactor = { ...formData, id: Date.now().toString() };
        setRiskFactors([...riskFactors, newRiskFactor]);
        toast({
          title: "Factor de Riesgo registrado",
          description: "El nuevo factor de riesgo ha sido registrado exitosamente.",
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

  const handleEdit = (riskFactor: RiskFactor) => {
    setFormData(riskFactor);
    setEditingId(riskFactor.id);
  };

  const handleDelete = (id: string) => {
    setRiskFactors(riskFactors.filter((riskFactor) => riskFactor.id !== id));
    toast({
      title: "Factor de Riesgo eliminado",
      description: "El factor de riesgo ha sido eliminado exitosamente.",
    });
    if (editingId === id) resetForm();
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold text-violet-900">Gestión Factores de Riesgos</h1>
        </div>

        <Card className="p-6 shadow-lg border-t-4 border-violet-500">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-violet-700">
                Tipo de Riesgo <span className="text-red-500">*</span>
              </label>
              <Select
                onValueChange={(value) => {
                  setFormData({ ...formData, type: value });
                  setErrors({ ...errors, type: false });
                }}
                value={formData.type}
              >
                <SelectTrigger
                  className={`$${
                    errors.type ? "border-red-500" : "border-violet-200 focus:ring-violet-500"
                  } w-full rounded-md p-2 bg-white text-black`}
                >
                  <SelectValue placeholder="Seleccione un tipo de riesgo" />
                </SelectTrigger>
                <SelectContent className="bg-white shadow-md border border-gray-200 rounded-md">
                  {predefinedRiskFactors.map((type) => (
                    <SelectItem
                      key={type}
                      value={type}
                      className="hover:bg-violet-100 focus:bg-violet-200"
                    >
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.type && (
                <p className="text-sm text-red-500">Este campo es obligatorio</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-violet-700">
                Factor de Riesgo <span className="text-red-500">*</span>
              </label>
              <Input
                required
                placeholder="Ingrese la descripción"
                value={formData.description}
                onChange={(e) => {
                  setFormData({ ...formData, description: e.target.value });
                  setErrors({ ...errors, description: false });
                }}
                className={`border-violet-200 focus:ring-violet-500 $${
                  errors.description ? "border-red-500" : ""
                }`}
              />
              {errors.description && (
                <p className="text-sm text-red-500">Este campo es obligatorio</p>
              )}
            </div>
            <Button type="submit" className="bg-orange-500 hover:bg-violet-900 text-white">
              {editingId ? "Actualizar Factor de Riesgo" : "Registrar Factor de Riesgo"}
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
          <h2 className="text-2xl font-semibold text-orange-900">Listado de Factores de Riesgos</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="bg-violet-50">Tipo de Riesgo</TableHead>
                <TableHead className="bg-violet-50">Factor de Riesgo</TableHead>
                <TableHead className="bg-violet-50">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {riskFactors.map((riskFactor) => (
                <TableRow key={riskFactor.id} className="hover:bg-violet-50">
                  <TableCell>{riskFactor.type}</TableCell>
                  <TableCell>{riskFactor.description}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-violet-600 border-violet-600"
                        onClick={() => handleEdit(riskFactor)}
                      >
                        <Edit3 className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-orange-600 border-orange-600"
                        onClick={() => handleDelete(riskFactor.id)}
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