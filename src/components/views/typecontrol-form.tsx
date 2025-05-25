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
import { useToast } from "@/hooks/use-toast";
import { transformTypeControl } from "@/lib/transformers"
interface ControlType {
  id: string;
  description: string;
}

export default function ControlTypes() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({ description: "" });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState(false);

  const [controlTypes, setControlTypes] = useState<ControlType[]>([
    { id: "1", description: "Preventivo" },
    { id: "2", description: "Detectivo" },
    { id: "3", description: "Correctivo" },
  ]);

  const validateForm = () => {
    const hasError = !formData.description.trim();
    setError(hasError);
    return !hasError;
  };

  const resetForm = () => {
    setFormData({ description: "" });
    setEditingId(null);
    setError(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      toast({
        variant: "destructive",
        title: "Error de validación",
        description: "La descripción es obligatoria.",
      });
      return;
    }

    if (editingId) {
      setControlTypes(
        controlTypes.map((control) =>
          control.id === editingId ? { ...formData, id: editingId } : control
        )
      );
      toast({
        title: "Tipo de Control actualizado",
        description: "El tipo de control ha sido actualizado exitosamente.",
      });
    } else {
      const newControl = { ...formData, id: Date.now().toString() };
      setControlTypes([...controlTypes, newControl]);
      toast({
        title: "Tipo de Control registrado",
        description: "El nuevo tipo de control ha sido registrado exitosamente.",
      });
    }

    resetForm();
  };

  const handleEdit = (control: ControlType) => {
    setFormData({ description: control.description });
    setEditingId(control.id);
  };

  const handleDelete = (id: string) => {
    setControlTypes(controlTypes.filter((control) => control.id !== id));
    toast({
      title: "Tipo de Control eliminado",
      description: "El tipo de control ha sido eliminado exitosamente.",
    });
    if (editingId === id) resetForm();
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold text-violet-900">Gestión Tipos de Control</h1>
        </div>

        <Card className="p-6 shadow-lg border-t-4 border-violet-500">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-violet-700">
                Tipo de Control <span className="text-red-500">*</span>
              </label>
              <Input
                required
                placeholder="Ingrese la descripción del tipo de control"
                value={formData.description}
                onChange={(e) => {
                  setFormData({ description: e.target.value });
                  setError(false);
                }}
                className={`border-violet-200 focus:ring-violet-500 ${error ? "border-red-500" : ""}`}
              />
              {error && <p className="text-sm text-red-500">Este campo es obligatorio</p>}
            </div>
            <Button type="submit" className="bg-orange-500 hover:bg-violet-900 text-white">
              {editingId ? "Actualizar Tipo de Control" : "Registrar Tipo de Control"}
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
          <h2 className="text-2xl font-semibold text-orange-900">Listado de Tipos de Control</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="bg-violet-50">Tipo de Control</TableHead>
                <TableHead className="bg-violet-50">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {controlTypes.map((control) => (
                <TableRow key={control.id} className="hover:bg-violet-50">
                  <TableCell>{control.description}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-violet-600 border-violet-600"
                        onClick={() => handleEdit(control)}
                      >
                        <Edit3 className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-orange-600 border-orange-600"
                        onClick={() => handleDelete(control.id)}
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
