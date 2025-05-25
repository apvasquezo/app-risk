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

interface RiskEntry {
  id: string;
  t_riesgo: string;
  factor: string;
  description: string;
  probabilidad: string;
  impacto: string;
}

const predefinedTRiesgo = ["Operacional", "Financiero", "Legal", "Reputacional"];
const predefinedFactor = ["Fraude", "Errores Humanos", "Fallas Técnicas"];
const predefinedProbabilidad = ["Baja", "Media", "Alta"];
const predefinedImpacto = ["Bajo", "Moderado", "Alto"];

export default function RiskManagement() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    t_riesgo: "",
    factor: "",
    description: "",
    probabilidad: "",
    impacto: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [errors, setErrors] = useState({
    t_riesgo: false,
    factor: false,
    description: false,
    probabilidad: false,
    impacto: false,
  });

  const [riskEntries, setRiskEntries] = useState<RiskEntry[]>([
    {
      id: "1",
      t_riesgo: "Operacional",
      factor: "Fraude",
      description: "Acceso no autorizado a sistemas",
      probabilidad: "Alta",
      impacto: "Alto",
    },
    {
      id: "2",
      t_riesgo: "Financiero",
      factor: "Errores Humanos",
      description: "Errores en la conciliación bancaria",
      probabilidad: "Media",
      impacto: "Moderado",
    },
    {
      id: "3",
      t_riesgo: "Legal",
      factor: "Fallas Técnicas",
      description: "Incumplimiento en regulaciones",
      probabilidad: "Baja",
      impacto: "Bajo",
    },
  ]);

  const validateForm = () => {
    const newErrors = {
      t_riesgo: !formData.t_riesgo.trim(),
      factor: !formData.factor.trim(),
      description: !formData.description.trim(),
      probabilidad: !formData.probabilidad.trim(),
      impacto: !formData.impacto.trim(),
    };
    setErrors(newErrors);
    return Object.values(newErrors).every((error) => !error);
  };

  const resetForm = () => {
    setFormData({ t_riesgo: "", factor: "", description: "", probabilidad: "", impacto: "" });
    setEditingId(null);
    setErrors({ t_riesgo: false, factor: false, description: false, probabilidad: false, impacto: false });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      toast({
        variant: "destructive",
        title: "Error de validación",
        description: "Todos los campos son obligatorios.",
      });
      return;
    }

    if (editingId) {
      setRiskEntries(
        riskEntries.map((entry) =>
          entry.id === editingId ? { ...formData, id: editingId } : entry
        )
      );
      toast({
        title: "Registro actualizado",
        description: "El registro de riesgo ha sido actualizado exitosamente.",
      });
    } else {
      const newEntry = { ...formData, id: Date.now().toString() };
      setRiskEntries([...riskEntries, newEntry]);
      toast({
        title: "Registro agregado",
        description: "El nuevo registro de riesgo ha sido agregado exitosamente.",
      });
    }
    resetForm();
  };

  const handleEdit = (entry: RiskEntry) => {
    setFormData(entry);
    setEditingId(entry.id);
  };

  const handleDelete = (id: string) => {
    setRiskEntries(riskEntries.filter((entry) => entry.id !== id));
    toast({
      title: "Registro eliminado",
      description: "El registro ha sido eliminado exitosamente.",
    });
    if (editingId === id) resetForm();
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-violet-900">Registro de Eventos</h1>

        <Card className="p-6 shadow-lg border-t-4 border-violet-500">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { label: "Tipo de Riesgo", key: "t_riesgo", options: predefinedTRiesgo },
              { label: "Factor", key: "factor", options: predefinedFactor },
              { label: "Probabilidad", key: "probabilidad", options: predefinedProbabilidad },
              { label: "Impacto", key: "impacto", options: predefinedImpacto },
            ].map(({ label, key, options }) => (
              <div key={key} className="space-y-2">
                <label className="text-sm font-medium text-violet-700">
                  {label} <span className="text-red-500">*</span>
                </label>
                <Select
                  onValueChange={(value) => {
                    setFormData({ ...formData, [key]: value });
                    setErrors({ ...errors, [key]: false });
                  }}
                  value={formData[key]}
                >
                <SelectTrigger
                className={`p-2 bg-white text-black rounded-md border ${
                    errors[key] ? "border-red-500" : "border-violet-200"
                }`}
                >
                <SelectValue placeholder={`Seleccione un ${label.toLowerCase()}`} />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-300 shadow-md rounded-lg">
                {options.map((option) => (
                    <SelectItem
                    key={option}
                    value={option}
                    className="hover:bg-violet-100 focus:bg-violet-200 text-black"
                    >
                    {option}
                    </SelectItem>
                ))}
                </SelectContent>
                </Select>
                {errors[key] && <p className="text-sm text-red-500">Este campo es obligatorio</p>}
              </div>
            ))}

            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-medium text-violet-700">
                Descripción <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="Ingrese la descripción"
                value={formData.description}
                onChange={(e) => {
                  setFormData({ ...formData, description: e.target.value });
                  setErrors({ ...errors, description: false });
                }}
                className={errors.description ? "border-red-500" : "border-violet-200"}
              />
              {errors.description && (
                <p className="text-sm text-red-500">Este campo es obligatorio</p>
              )}
            </div>
            <div className="flex gap-2">
                <Button type="submit" className="bg-orange-500 hover:bg-violet-900 text-white">
                {editingId ? "Actualizar Evento" : "Registrar Evento"}
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
          <h2 className="text-2xl font-semibold text-orange-900">Listado de Eventos</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tipo</TableHead>
                <TableHead>Factor</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Probabilidad</TableHead>
                <TableHead>Impacto</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {riskEntries.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell>{entry.t_riesgo}</TableCell>
                  <TableCell>{entry.factor}</TableCell>
                  <TableCell>{entry.description}</TableCell>
                  <TableCell>{entry.probabilidad}</TableCell>
                  <TableCell>{entry.impacto}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(entry)}
                        className="text-violet-600 border-violet-600"
                      >
                        <Edit3 className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(entry.id)}
                        className="text-orange-600 border-orange-600"
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