"use client";

import { useEffect, useState } from "react";
import { UserPlus, FolderKanban } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Microproceso {
  id: string;
  name: string;
}

export default function ProcesoForm() {
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    microprocesoId: "",
  });

  const [errors, setErrors] = useState({
    name: false,
    description: false,
    microprocesoId: false,
  });

  const [microprocesos, setMicroprocesos] = useState<Microproceso[]>([]);

  useEffect(() => {
    // Simulamos fetch a microprocesos del superusuario
    setMicroprocesos([
      { id: "1", name: "Análisis de Riesgos" },
      { id: "2", name: "Evaluación de Controles" },
      { id: "3", name: "Gestión Documental" },
    ]);
  }, []);

  const validateForm = () => {
    const newErrors = {
      name: !formData.name.trim(),
      description: !formData.description.trim(),
      microprocesoId: !formData.microprocesoId,
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
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
      // Aquí iría tu lógica para enviar el proceso al backend
      toast({
        title: "Proceso registrado",
        description: "El proceso ha sido registrado exitosamente.",
      });

      setFormData({ name: "", description: "", microprocesoId: "" });
      setErrors({ name: false, description: false, microprocesoId: false });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Ocurrió un error al procesar la solicitud.",
      });
    }
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center gap-4">
          <FolderKanban className="h-8 w-8 text-violet-600" />
          <h1 className="text-3xl font-bold text-violet-900">
            Proceso
          </h1>
        </div>

        <Card className="p-6 shadow-lg border-t-4 border-violet-500">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <p className="text-gray-600 text-sm text-justify mb-4">
              Un proceso es un conjunto de actividades planificadas que implican la participación de personas y recursos materiales coordinados para 
              conseguir un objetivo previamente identificado.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-violet-700">
                  Nombre del Proceso <span className="text-red-500">*</span>
                </label>
                <Input
                  placeholder="Ingrese el nombre del proceso"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
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
                  placeholder="Ingrese la descripción del proceso"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className={`border-violet-200 focus:ring-violet-500 ${
                    errors.description ? "border-red-500" : ""
                  }`}
                />
                {errors.description && (
                  <p className="text-sm text-red-500">Este campo es obligatorio</p>
                )}
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-medium text-violet-700">
                  Microproceso Asociado <span className="text-red-500">*</span>
                </label>
                <Select
                  value={formData.microprocesoId}
                  onValueChange={(value) => {
                    setFormData({ ...formData, microprocesoId: value });
                    setErrors({ ...errors, microprocesoId: false });
                  }}
                >
                  <SelectTrigger
                    className={`border-violet-200 focus:ring-violet-500 w-full ${
                      errors.microprocesoId ? "border-red-500" : ""
                    }`}
                  >
                    <SelectValue placeholder="Seleccione un microproceso" />
                  </SelectTrigger>
                  <SelectContent>
                    {microprocesos.map((mp) => (
                      <SelectItem key={mp.id} value={mp.id}>
                        {mp.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.microprocesoId && (
                  <p className="text-sm text-red-500">Debe seleccionar un microproceso</p>
                )}
              </div>
            </div>

            <Button
              type="submit"
              className="bg-orange-500 hover:bg-violet-900 text-white"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Registrar Proceso
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
