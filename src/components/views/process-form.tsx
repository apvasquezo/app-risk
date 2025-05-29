"use client";

import type React from "react"

import { useEffect, useState } from "react";
import { Edit3, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { transformProces } from "@/lib/transformers";
import { transformMacro } from "@/lib/transformers";
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
import api from "@/lib/axios";

interface Process {
  id: string;
  macroprocess_id: string;
  macro:string // nombre macroproceso
  description: string;
  personal_id: string
};
interface Macro {
  id_macro: number
  description: string
}

export default function ProcessManagement() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({ macro: "", description: "", personal_id:"" });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [errors, setErrors] = useState({ macro: false, description: false , personal_id:false});
  const [process, setProcess] = useState<Process[]>([]);
  const [macro , setMacro] = useState<Macro[]>([]);

  const MapMacroIdtoName = (macroId:number, macroList: Macro[]):string =>{
    const macro = macroList.find((mac) => mac.id_macro=== macroId)
    return macro ? macro.description : "Macroproceso no encontrado"
  }

  useEffect(() => {
        const fetchProcess= async () => {
          try {

            const responseMacro = await api.get("/macroprocesses" );
            const transformedMacro = transformMacro(responseMacro.data)
            setMacro(transformedMacro);

            const responseProces= await api.get("/processes")
            const transformedProces = transformProces(responseProces.data)
            const ProcesWithMacroames = transformedProces.map((process) => ({
              ...process,
              proces: MapMacroIdtoName(parseInt(process.macroprocess_id), transformedMacro),
            }))           
           
            setProcess(ProcesWithMacroames)

          } catch (error) {
            console.error(error);
            toast({
              variant: "destructive",
              title: "Error al cargar procesos",
              description: "No se pudo obtener el listado de procesos desde el servidor.",
            });
          }
        };
        fetchProcess();
      }, [toast]);

  const validateForm = () => {
    const newErrors = {
      macro: !formData.macro,
      description: !formData.description.trim(),
      personal_id: !formData.personal_id.trim(),
    }
    setErrors(newErrors);
    return !newErrors.macro && !newErrors.description && !newErrors.personal_id;
  };

  const resetForm = () => {
    setFormData({ macro: "", description: "", personal_id:"" });
    setEditingId(null);
    setErrors({ macro: false, description: false, personal_id:  false });
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
      const payload ={
        macroprocess_id: Number.parseInt(formData.macro),
        description: formData.description,
        personal_id: formData.personal_id,       
      }
      if (editingId) {
        await api.put(`/processes/${editingId}`, payload)
        setProcess(
          process.map((process) =>
            process.id === editingId 
          ? { ...process,
              macroprocess_id:formData.macro,
              macro: MapMacroIdtoName(parseInt(formData.macro), macro),
              description: formData.description,
              personal_id:formData.personal_id,
          } : process
          )
        );
        toast({
          title: "Proceso actualizado",
          description: "El proceso ha sido actualizado exitosamente.",
        });
      } else {
        const response = await api.post("/processes", payload)
        const newProcess = { 
          id: response.data.id_process,
          macroprocess_id: response.data.macroprocess_id,
          macro:MapMacroIdtoName(parseInt(formData.macro), macro),
          description: response.data.description,
          personal_id: response.data.personal_id,         
         };
        setProcess([...process, newProcess]);
        toast({
          title: "Proceso registrado",
          description: "El nuevo proceso ha sido registrado exitosamente.",
        });
      }
      resetForm();
    } catch (error){
      console.error(error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Ocurrió un error al procesar la solicitud.",
      });
    }
  };

  const handleEdit = (process: Process) => {
    setFormData({
      macro:process.macroprocess_id,
      description: process.description,
      personal_id:process.personal_id,
    });
    setEditingId(process.id);
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm("¿Estás segura de que deseas eliminar este tipo de riesgo?")
    if (!confirmDelete) return 
    try {
      await api.delete(`/risk-types/${id}`)   
      setProcess(process.filter((process) => process.id !== id));

      toast({
        title: "Proceso eliminado",
        description: "El proceso ha sido eliminado exitosamente.",
      });
      if (editingId === id) resetForm();
    } catch (error){
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo eliminar el proceso.",
      })     
    }
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
                value={formData.macro}
                onValueChange={(value) => {
                  setFormData({ ...formData, macro: value });
                  setErrors({ ...errors, macro: false });
                }}
              >
                <SelectTrigger
                  className={`w-full rounded-md p-2 bg-white text-black ${
                    errors.macro
                      ? "border-red-500"
                      : formData.macro
                      ? "border-violet-500"
                      : "border-violet-200"
                  }`}
                >
                  <SelectValue placeholder="Seleccione un microproceso" />
                </SelectTrigger>
                <SelectContent className="bg-white shadow-md border border-gray-200 rounded-md text-black">
                  {macro.map((item) => (
                    <SelectItem
                      key={item.id_macro}
                      value={item.id_macro.toString()}
                      className="hover:bg-violet-100 focus:bg-violet-200"
                    >
                      {item.description}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.macro && (
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
              {process.map((process) => (
                <TableRow key={process.id} className="hover:bg-violet-50">
                  <TableCell>{process.macro}</TableCell>
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