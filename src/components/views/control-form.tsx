"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Edit3, Trash2 } from "lucide-react"
import { Card } from "@/components/ui_prueba/card"
import { Input } from "@/components/ui_prueba/input"
import { Button } from "@/components/ui_prueba/button"
import { transformControls } from "@/lib/transformers"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui_prueba/table";
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui_prueba/select"
import api from "@/lib/axios";
interface Control {
  id: string
  tipoControl: string
  descripcion: string
  frecuencia: string
  responsable: string
}
const tipoControlOptions = ["Preventivo", "Detectivo", "Correctivo"];
const frecuenciaOptions = ["Diario", "Semanal", "Mensual", "Trimestral", "Anual"];

export default function ControlManagementForm() {
  const { toast } = useToast()

  const [formData, setFormData] = useState<Control>({
    id: "",
    tipoControl: "",
    descripcion: "",
    frecuencia: "",
    responsable: "",
  })
  const [editingId, setEditingId] = useState<string | null>(null)
  const [errors, setErrors] = useState({
    tipoControl: false,
    descripcion: false,
    frecuencia: false,
    responsable: false,
  })
  const [controlList, setControlList] = useState<Control[]>([])

  useEffect(() => {
    const fetchControls = async () => {
      try {
        const response = await api.get("/controls" );
        setControlList(transformControls(response.data));
      } catch (error) {
        console.error(error);
        toast({
          variant: "destructive",
          title: "Error al cargar controles",
          description: "No se pudo obtener el listado de controles desde el servidor.",
        });
      }
    };
    fetchControls();
  }, []);

  const validateForm = () => {
    const newErrors = {
      tipoControl: !formData.tipoControl.trim(),
      descripcion: !formData.descripcion.trim(),
      frecuencia: !formData.frecuencia.trim(),
      responsable: !formData.responsable.trim(),
    }
    setErrors(newErrors)
    return !Object.values(newErrors).some((error) => error)
  }

  const resetForm = () => {
    setFormData({
      id: "",
      tipoControl: "",
      descripcion: "",
      frecuencia: "",
      responsable: "",
    })
    setEditingId(null)
    setErrors({
      tipoControl: false,
      descripcion: false,
      frecuencia: false,
      responsable: false,
    })
  }

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
        await api.put(`/controls/${editingId}`, {
          tipo_control: formData.tipoControl,
          descripcion: formData.descripcion,
          frecuencia: formData.frecuencia,
          responsable: formData.responsable,
        });
  
        setControlList(prev =>
          prev.map(control =>
            control.id === editingId ? { ...formData, id: editingId } : control
          )
        );
  
        toast({
          title: "Control actualizado",
          description: "El control ha sido actualizado exitosamente.",
        });
      } else {
        const res = await api.post("/controls", {
          tipo_control: formData.tipoControl,
          descripcion: formData.descripcion,
          frecuencia: formData.frecuencia,
          responsable: formData.responsable,
        });
  
        const newControl = {
          id: res.data.id_control,
          tipoControl: res.data.tipo_control,
          descripcion: res.data.descripcion,
          frecuencia: res.data.frecuencia,
          responsable: res.data.responsable,
        };
  
        setControlList(prev => [...prev, newControl]);
  
        toast({
          title: "Control registrado",
          description: "El nuevo control ha sido registrado exitosamente.",
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
  }

  const handleEdit = (control: Control) => {
    setFormData(control)
    setEditingId(control.id)
  }

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/controls/${id}`);
  
      setControlList(prev => prev.filter(control => control.id !== id));
  
      toast({
        title: "Control eliminado",
        description: "El control ha sido eliminado exitosamente.",
      });
  
      if (editingId === id) resetForm();
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error al eliminar",
        description: "No se pudo eliminar el control.",
      });
    }
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold text-violet-900">Gestión de Controles</h1>
        </div>

        <Card className="p-6 shadow-lg border-t-4 border-violet-500">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-violet-700">
                Tipo de Control <span className="text-red-500">*</span>
              </label>
              <Select
                value={formData.tipoControl}
                onValueChange={(value) => {
                  setFormData({ ...formData, tipoControl: value })
                  setErrors({ ...errors, tipoControl: false })
                }}
              >
                <SelectTrigger
                  className={`border-violet-200 focus:ring-violet-500 ${errors.tipoControl ? "border-red-500" : ""}`}
                >
                  <SelectValue placeholder="Seleccione un tipo de control" />
                </SelectTrigger>
                <SelectContent>
                  {tipoControlOptions.map((tipo) => (
                    <SelectItem key={tipo} value={tipo}>
                      {tipo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.tipoControl && <p className="text-sm text-red-500">Este campo es obligatorio</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-violet-700">
                Descripción <span className="text-red-500">*</span>
              </label>
              <Input
                required
                placeholder="Ingrese la descripción del control"
                value={formData.descripcion}
                onChange={(e) => {
                  setFormData({ ...formData, descripcion: e.target.value })
                  setErrors({ ...errors, descripcion: false })
                }}
                className={`border-violet-200 focus:ring-violet-500 ${errors.descripcion ? "border-red-500" : ""}`}
              />
              {errors.descripcion && <p className="text-sm text-red-500">Este campo es obligatorio</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-violet-700">
                Frecuencia <span className="text-red-500">*</span>
              </label>
              <Select
                value={formData.frecuencia}
                onValueChange={(value) => {
                  setFormData({ ...formData, frecuencia: value })
                  setErrors({ ...errors, frecuencia: false })
                }}
              >
                <SelectTrigger
                  className={`border-violet-200 focus:ring-violet-500 ${errors.frecuencia ? "border-red-500" : ""}`}
                >
                  <SelectValue placeholder="Seleccione una frecuencia" />
                </SelectTrigger>
                <SelectContent>
                  {frecuenciaOptions.map((freq) => (
                    <SelectItem key={freq} value={freq}>
                      {freq}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.frecuencia && <p className="text-sm text-red-500">Este campo es obligatorio</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-violet-700">
                Responsable <span className="text-red-500">*</span>
              </label>
              <Input
                required
                placeholder="Ingrese el área o persona responsable"
                value={formData.responsable}
                onChange={(e) => {
                  setFormData({ ...formData, responsable: e.target.value })
                  setErrors({ ...errors, responsable: false })
                }}
                className={`border-violet-200 focus:ring-violet-500 ${errors.responsable ? "border-red-500" : ""}`}
              />
              {errors.responsable && <p className="text-sm text-red-500">Este campo es obligatorio</p>}
            </div>

            <div className="flex gap-4">
              <Button type="submit" className="bg-orange-500 hover:bg-violet-900 text-white">
                {editingId ? "Actualizar Control" : "Registrar Control"}
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
          <h2 className="text-2xl font-semibold text-orange-900 mb-4">Listado de Controles</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="bg-violet-50">Tipo de Control</TableHead>
                <TableHead className="bg-violet-50">Descripción</TableHead>
                <TableHead className="bg-violet-50">Frecuencia</TableHead>
                <TableHead className="bg-violet-50">Responsable</TableHead>
                <TableHead className="bg-violet-50">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {controlList.map((control) => (
                <TableRow key={control.id} className="hover:bg-violet-50">
                  <TableCell>{control.tipoControl}</TableCell>
                  <TableCell>{control.descripcion}</TableCell>
                  <TableCell>{control.frecuencia}</TableCell>
                  <TableCell>{control.responsable}</TableCell>
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
  )
}
