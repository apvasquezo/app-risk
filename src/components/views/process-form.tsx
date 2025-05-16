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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface Process {
  id: string;
  subprocess: string;
  description: string;
}

const predefinedSubprocesses = [
  "Procesos estratégicos",
  "Procesos misionales",
  "Procesos de apoyo y control",
];

export default function ProcessManagement() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({ subprocess: "", description: "" });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [errors, setErrors] = useState({ subprocess: false, description: false });

  const [processes, setProcesses] = useState<Process[]>([
    {
      id: "1",
      subprocess: "Procesos estratégicos",
      description: "Procesos orientados a definir la dirección institucional.",
    },
    {
      id: "2",
      subprocess: "Procesos misionales",
      description: "Procesos centrales relacionados con el cumplimiento del objeto institucional.",
    },
  ]);

  const validateForm = () => {
    const newErrors = {
      subprocess: !formData.subprocess.trim(),
      description: !formData.description.trim(),
    };
    setErrors(newErrors);
    return !newErrors.subprocess && !newErrors.description;
  };

  const resetForm = () => {
    setFormData({ subprocess: "", description: "" });
    setEditingId(null);
    setErrors({ subprocess: false, description: false });
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

    try {
      if (editingId) {
        setProcesses(
          processes.map((process) =>
            process.id === editingId ? { ...formData, id: editingId } : process
          )
        );
        toast({
          title: "Proceso actualizado",
          description: "El proceso ha sido actualizado exitosamente.",
        });
      } else {
        const newProcess = { ...formData, id: Date.now().toString() };
        setProcesses([...processes, newProcess]);
        toast({
          title: "Proceso registrado",
          description: "El nuevo proceso ha sido registrado exitosamente.",
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

  const handleEdit = (process: Process) => {
    setFormData(process);
    setEditingId(process.id);
  };

  const handleDelete = (id: string) => {
    setProcesses(processes.filter((p) => p.id !== id));
    toast({
      title: "Proceso eliminado",
      description: "El proceso ha sido eliminado exitosamente.",
    });
    if (editingId === id) resetForm();
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-violet-900">Procesos</h1>
        <p className="text-sm text-gray-600">
        </p>

        <Card className="p-6 shadow-lg border-t-4 border-violet-500 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-violet-700">
                Macroprocesos <span className="text-red-500">*</span>
              </label>
              <Select
                value={formData.subprocess}
                onValueChange={(value) => {
                  setFormData({ ...formData, subprocess: value });
                  setErrors({ ...errors, subprocess: false });
                }}
              >
                <SelectTrigger
                  className={`w-full rounded-md p-2 bg-white text-black ${
                    errors.subprocess
                      ? "border-red-500"
                      : formData.subprocess
                      ? "border-violet-500"
                      : "border-violet-200"
                  }`}
                >
                  <SelectValue placeholder="Seleccione un microproceso" />
                </SelectTrigger>
                <SelectContent className="bg-white shadow-md border border-gray-200 rounded-md text-black">
                  {predefinedSubprocesses.map((item) => (
                    <SelectItem
                      key={item}
                      value={item}
                      className="hover:bg-violet-100 focus:bg-violet-200"
                    >
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.subprocess && (
                <p className="text-sm text-red-500">Este campo es obligatorio</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-violet-700">
                Nombre del Proceso <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="Ingrese el nombre del proceso"
                value={formData.description}
                onChange={(e) => {
                  setFormData({ ...formData, description: e.target.value });
                  setErrors({ ...errors, description: false });
                }}
                className={`${
                  errors.description ? "border-red-500" : "border-violet-200"
                }`}
              />
              {errors.description && (
                <p className="text-sm text-red-500">Este campo es obligatorio</p>
              )}
            </div>

            <div className="flex gap-2">
              <Button type="submit" className="bg-orange-500 hover:bg-violet-900 text-white">
                {editingId ? "Actualizar Proceso" : "Registrar Proceso"}
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
          <h2 className="text-2xl font-semibold text-orange-900 mb-4">Listado de Procesos</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="bg-violet-50">Macroproceso</TableHead>
                <TableHead className="bg-violet-50">Nombre del Proceso</TableHead>
                <TableHead className="bg-violet-50">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {processes.map((process) => (
                <TableRow key={process.id} className="hover:bg-violet-50">
                  <TableCell>{process.subprocess}</TableCell>
                  <TableCell>{process.description}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-violet-600 border-violet-600"
                        onClick={() => handleEdit(process)}
                      >
                        <Edit3 className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-orange-600 border-orange-600"
                        onClick={() => handleDelete(process.id)}
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