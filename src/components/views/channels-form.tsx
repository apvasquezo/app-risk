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
import { useToast } from "@/hooks/use-toast";

interface Channel {
  id: string;
  name: string;
}

export default function Channels() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({ name: "" });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [errors, setErrors] = useState({ name: false });

  const [channels, setChannels] = useState<Channel[]>([
    { id: "1", name: "Canal de Noticias" },
    { id: "2", name: "Canal Deportivo" },
  ]);

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
        description: "El name del canal es obligatorio.",
      });
      return;
    }

    try {
      if (editingId) {
        setChannels(
          channels.map((channel) =>
            channel.id === editingId ? { ...formData, id: editingId } : channel
          )
        );
        toast({
          title: "Canal actualizado",
          description: "El canal ha sido actualizado exitosamente.",
        });
      } else {
        const newChannel = { ...formData, id: Date.now().toString() };
        setChannels([...channels, newChannel]);
        toast({
          title: "Canal registrado",
          description: "El nuevo canal ha sido registrado exitosamente.",
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

  const handleEdit = (channel: Channel) => {
    setFormData(channel);
    setEditingId(channel.id);
  };

  const handleDelete = (id: string) => {
    setChannels(channels.filter((channel) => channel.id !== id));
    toast({
      title: "Canal eliminado",
      description: "El canal ha sido eliminado exitosamente.",
    });
    if (editingId === id) resetForm();
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold text-violet-900">Gestión de Canales</h1>
        </div>

        <Card className="p-6 shadow-lg border-t-4 border-violet-500">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-violet-700">
                name del Canal <span className="text-red-500">*</span>
              </label>
              <Input
                required
                placeholder="Ingrese el name del canal"
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
              {editingId ? "Actualizar Canal" : "Registrar Canal"}
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
          <h2 className="text-2xl font-semibold text-orange-900">Listado de Canales</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="bg-violet-50">name</TableHead>
                <TableHead className="bg-violet-50">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {channels.map((channel) => (
                <TableRow key={channel.id} className="hover:bg-violet-50">
                  <TableCell>{channel.name}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-violet-600 border-violet-600"
                        onClick={() => handleEdit(channel)}
                      >
                        <Edit3 className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-orange-600 border-orange-600"
                        onClick={() => handleDelete(channel.id)}
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