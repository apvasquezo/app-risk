"use client";

import React, { useState, useEffect } from "react";
import { Edit3, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { transformCauses, transformConsequences } from "@/lib/transformers";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import api from "@/lib/axios";

interface Cause {
  id: number;
  description: string;
}

interface Consequence {
  id: number;
  description: string;
}

export default function CausesConsequencesForm() {
  const { toast } = useToast();
  const [causeForm, setCauseForm] = useState({ description: "" });
  const [consequenceForm, setConsequenceForm] = useState({ description: "" });
  const [editingCauseId, setEditingCauseId] = useState<number | null>(null);
  const [editingConsequenceId, setEditingConsequenceId] = useState<number | null>(null);
  const [causeList, setCauseList] = useState<Cause[]>([]);
  const [consequenceList, setConsequenceList] = useState<Consequence[]>([]);

  const [errors, setErrors] = useState({description: false})
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        //carga causas
        const responseCause = await api.get("/causes");
        console.log("Causas ", responseCause)
        setCauseList(transformCauses(responseCause.data));
        const responseConse = await api.get("/consequences"); 
        setConsequenceList(transformConsequences(responseConse.data));
      } catch (error) {
        console.error(error);
        toast({
          variant: "destructive",
          title: "Error al cargar datos",
          description: "No se pudieron obtener las causas o consecuencias.",
        });
      }
    };
    fetchData();
  }, [toast]);

  const validateForm = (form: typeof causeForm, type: "cause" | "consequence") => {
    const newErrors = {
      description: !form.description.trim(),
    }
    if (type === "cause") {
      setErrors(newErrors)
    } else {
      setErrors(newErrors)
    }

    return !newErrors.description
  }

  const resetForm = (type: "cause" | "consequense") => {
    if (type === "cause") {
      setCauseForm({ description: ""})
      setEditingCauseId(null)
      setErrors({ description: false })
    } else {
      setConsequenceForm({ description: "" })
      setEditingConsequenceId(null)
      setErrors({ description: false })
    }
  }


  const handleSubmit = async (e: React.FormEvent, type: "cause" | "consequence") => {
    e.preventDefault();
    const form = type === "cause" ? causeForm : consequenceForm;
    const editingId = type === "cause" ? editingCauseId : editingConsequenceId;

    if (!validateForm(form, type)) {
      return
    }

    try {
      const payload =
      type==="cause" 
      ?{
        description:form.description,
      }
      :{
        description:form.description,
      }
      const endpoint = type === "cause" ? "/causes" : "/consequences"
    
      if (editingId !== null) {
        console.log (" a donde va ", endpoint)
        console.log (" cual es cual ", editingId)
        await api.put(`/${type}s/${editingId}`, payload);
              
        const updatedList = (type === "cause" ? causeList : consequenceList).map((item) =>
          item.id === editingId ? { ...item, description: form.description } : item
        );
        if (type === "cause") {
          setCauseList(updatedList) 
          setEditingCauseId(null)
         } else { 
          setConsequenceList(updatedList)
          setEditingConsequenceId(null)
         };
        toast({ 
          title: "Actualización exitosa", 
          description: `${type} actualizado correctamente.` });

      } else {
        console.log("payload ", payload)
        const res = await api.post(`/${type}s`, payload);
        console.log ("lo que envia ", res.data)
        const newItem = {
          id: type === "cause" ? res.data.id_cause : res.data.id_consequence,
          description: res.data.description
        };
        if (type === "cause") {
          setCauseList((prev) => [...prev, newItem])
        } else {
           setConsequenceList((prev) => [...prev, newItem])
        }
        toast({ title: "Registro exitoso", description: `${type} registrado correctamente.` });
      }
      type === "cause" ? setCauseForm({ description: "" }) : setConsequenceForm({ description: "" });
      resetForm
    } catch (error) {
      console.log(error);
      toast({
        variant: "destructive",
        title: "Error al guardar",
        description: "No se pudo procesar la solicitud.",
      });
    }
  };

  const handleEdit = (item: Cause | Consequence, type: "cause" | "consequence") => {
    if (type === "cause") {
      setCauseForm({ description: item.description });
      setEditingCauseId(item.id);
    } else {
      setConsequenceForm({ description: item.description });
      setEditingConsequenceId(item.id);
    }
  };

  const handleDelete = async (id: number, type: "cause" | "consequence") => {
    const confirmDelete = window.confirm("¿Estás segura de que deseas eliminar este tipo de riesgo?")
    if (!confirmDelete) return    
    try {
      await api.delete(`/${type}s/${id}`);
      const updatedList = (type === "cause" ? causeList : consequenceList).filter(
        (item) => item.id !== id
      );
      if (type === "cause") { 
        setCauseList(updatedList) 
      } else {
        setConsequenceList(updatedList)
      }
      toast({ title: "Eliminación exitosa", description: `${type} eliminado correctamente.` });
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error al eliminar",
        description: "No se pudo eliminar el registro.",
      });
    }
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Columna de Causas */}
        <div>
          <h1 className="text-3xl font-bold text-violet-900">Gestión de Causas</h1>
          <Card className="p-6 shadow-lg border-t-4 border-violet-500 mt-4">
            <form onSubmit={(e) => handleSubmit(e, "cause")} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-violet-700">
                  Descripción <span className="text-red-500">*</span>
                </label>
                <Input
                  value={causeForm.description}
                  onChange={(e) => {setCauseForm({ ...causeForm, description: e.target.value })
                  setErrors({description: false});
                }}
                  placeholder="Descripción de la causa"
                  className={`border-violet-200 focus:ring-violet-500 ${
                    errors.description ? "border-red-500" : ""
                  }`}
                />
              {errors.description && (
                <p className="text-sm text-red-500">Este campo es obligatorio</p>
              )}                
              </div>
              <Button type="submit" className="bg-orange-500 hover:bg-violet-900 text-white">
                {editingCauseId ? "Actualizar Causa" : "Registrar Causa"}
              </Button>
            </form>
          </Card>

          <Card className="p-6 shadow-lg border-t-4 border-orange-500 mt-6">
            <h2 className="text-2xl font-semibold text-orange-900 mb-4">Listado de Causas</h2>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="bg-violet-50">Descripción Causas</TableHead>
                  <TableHead className="bg-violet-50">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {causeList.map((item) => (
                  <TableRow key={item.id} className="hover:bg-violet-50">
                    <TableCell>{item.description}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-violet-600 border-violet-600"
                          onClick={() => handleEdit(item, "cause")}
                        >
                          <Edit3 className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-orange-600 border-orange-600"
                          onClick={() => handleDelete(item.id, "cause")}
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

        {/* Columna de Consecuencias */}
        <div>
          <h1 className="text-3xl font-bold text-violet-900">Gestión de Consecuencias</h1>
          <Card className="p-6 shadow-lg border-t-4 border-violet-500 mt-4">
            <form onSubmit={(e) => handleSubmit(e, "consequence")} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-violet-700">
                  Descripción <span className="text-red-500">*</span>
                </label>
                <Input
                  value={consequenceForm.description}
                  onChange={(e) => setConsequenceForm({ ...consequenceForm, description: e.target.value })}
                  placeholder="Descripción de la consecuencia"
                  className="border-violet-200 focus:ring-violet-500"
                />
              </div>
              <Button type="submit" className="bg-orange-500 hover:bg-violet-900 text-white">
              
                {editingConsequenceId ? "Actualizar Consecuencia" : "Registrar Consecuencia"}
              </Button>
            </form>
          </Card>

          <Card className="p-6 shadow-lg border-t-4 border-orange-500 mt-6">
            <h2 className="text-2xl font-semibold text-orange-900 mb-4">Listado de Consecuencias</h2>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="bg-violet-50">Descripción Consecuencias</TableHead>
                  <TableHead className="bg-violet-50">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {consequenceList.map((item) => (
                  <TableRow key={item.id} className="hover:bg-violet-50">
                    <TableCell>{item.description}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-violet-600 border-violet-600"
                          onClick={() => handleEdit(item, "consequence")}
                        >
                          <Edit3 className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-orange-600 border-orange-600"
                          onClick={() => handleDelete(item.id, "consequence")}
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
    </div>
  )
}
