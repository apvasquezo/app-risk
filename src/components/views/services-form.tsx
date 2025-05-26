"use client";

import { useState, useEffect } from "react";
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
import api from "@/lib/axios"

interface Service {
  id: number;
  name: string;
}
interface RawProduct {
  id_product: number;
  description: string;
}


export default function Services() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({ name: "" });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [errors, setErrors] = useState({ name: false });
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    const fetchRiskFactors = async () => {
      try {
        const response = await api.get("/products");
        const mapped: Service[] = response.data.map((item: RawProduct) => ({
          id: item.id_product,
          name: item.description,
        }));
        setServices(mapped);
      } catch (error) {
        console.error(error);
        toast({
          variant: "destructive",
          title: "Error al cargar servicios",
          description: "No se pudo obtener el listado de servicios el servidor.",
        });
      }
    };
    fetchRiskFactors();
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
        description: "El nombre del servicio es obligatorio.",
      });
      return;
    }
  
    try {
      if (editingId !== null) {
        await api.put(`/products/${editingId}`, {
          description: formData.name,
        });
        setServices(
          services.map((service) =>
            service.id === editingId ? { id: editingId, name: formData.name } : service
          )
        );
        toast({
          title: "Servicio actualizado",
          description: "El servicio ha sido actualizado exitosamente.",
        });
      } else {
        const response = await api.post("/products", {
          description: formData.name,
        });
        const newService: Service = {
          id: response.data.id_product,
          name: response.data.description,
        };
        setServices([...services, newService]);
        toast({
          title: "Servicio registrado",
          description: "El nuevo servicio ha sido registrado exitosamente.",
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

  const handleEdit = (service: Service) => {
    setFormData({ name: service.name });
    setEditingId(service.id);
  };

  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm("¿Estás segura de que deseas eliminar este servicio?");
    if (!confirmDelete) return;
    try {
      await api.delete(`/products/${id}`);
      setServices(services.filter((service) => service.id !== id));
      toast({
        title: "Servicio eliminado",
        description: "El servicio ha sido eliminado exitosamente.",
      });
      if (editingId === id) resetForm();
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Ocurrió un error al eliminar el servicio",
      });
    }
  };
  

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold text-violet-900">Gestión de Servicios</h1>
        </div>

        <Card className="p-6 shadow-lg border-t-4 border-violet-500">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-violet-700">
                Nombre del Servicio <span className="text-red-500">*</span>
              </label>
              <Input
                required
                placeholder="Ingrese el nombre del servicio"
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
            <Button type="submit" className="bg-orange-500 hover:bg-violet-900 text-white">
              {editingId ? "Actualizar Servicio" : "Registrar Servicio"}
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
          <h2 className="text-2xl font-semibold text-orange-900">Listado de Servicios</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="bg-violet-50">Nombre</TableHead>
                <TableHead className="bg-violet-50">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {services.map((service) => (
                <TableRow key={service.id} className="hover:bg-violet-50">
                  <TableCell>{service.name}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-violet-600 border-violet-600"
                        onClick={() => handleEdit(service)}
                      >
                        <Edit3 className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-orange-600 border-orange-600"
                        onClick={() => handleDelete(service.id)}
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