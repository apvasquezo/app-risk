'use client';

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

interface Item {
  id: string;
  description: string;
  definition: string;
  criterion: string;
}

export default function ProbabilityImpactForm() {
  const { toast } = useToast();

  const [probForm, setProbForm] = useState({ description: "", definition: "", criterion: "" });
  const [impactForm, setImpactForm] = useState({ description: "", definition: "", criterion: "" });

  const [probList, setProbList] = useState<Item[]>([{
    id: "1",
    description: "Inusual",
    definition: "Puede ocurrir sólo en circunstancias excepcionales",
    criterion: "5%",
  }]);

  const [impactList, setImpactList] = useState<Item[]>([{
    id: "1",
    description: "Bajo",
    definition: "No genera perjuicio",
    criterion: "1 SMLV",
  }]);

  const [editingProbId, setEditingProbId] = useState<string | null>(null);
  const [editingImpactId, setEditingImpactId] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent, type: 'prob' | 'impact') => {
    e.preventDefault();
    const form = type === 'prob' ? probForm : impactForm;
    const setList = type === 'prob' ? setProbList : setImpactList;
    const list = type === 'prob' ? probList : impactList;
    const setForm = type === 'prob' ? setProbForm : setImpactForm;
    const editingId = type === 'prob' ? editingProbId : editingImpactId;
    const setEditingId = type === 'prob' ? setEditingProbId : setEditingImpactId;

    if (!form.description || !form.definition || !form.criterion) {
      toast({
        variant: "destructive",
        title: "Error de validación",
        description: "Todos los campos son obligatorios.",
      });
      return;
    }

    if (editingId) {
      setList(list.map((item) => item.id === editingId ? { ...form, id: editingId } : item));
      toast({
        title: `${type === 'prob' ? "Probabilidad" : "Impacto"} actualizado`,
        description: "Se actualizó correctamente.",
      });
    } else {
      setList([...list, { ...form, id: Date.now().toString() }]);
      toast({
        title: `${type === 'prob' ? "Probabilidad" : "Impacto"} registrada`,
        description: "Se ha registrado exitosamente.",
      });
    }

    setForm({ description: "", definition: "", criterion: "" });
    setEditingId(null);
  };

  const handleEdit = (item: Item, type: 'prob' | 'impact') => {
    if (type === 'prob') {
      setProbForm(item);
      setEditingProbId(item.id);
    } else {
      setImpactForm(item);
      setEditingImpactId(item.id);
    }
  };

  const handleDelete = (id: string, type: 'prob' | 'impact') => {
    const confirmDelete = window.confirm("¿Estás segura de que deseas eliminar la probabilidad e impacto?");
    if (!confirmDelete) return;
    const setList = type === 'prob' ? setProbList : setImpactList;
    const list = type === 'prob' ? probList : impactList;
    setList(list.filter((item) => item.id !== id));
  
    if ((type === 'prob' && editingProbId === id) || (type === 'impact' && editingImpactId === id)) {
      if (type === 'prob') {
        setEditingProbId(null);
      } else {
        setEditingImpactId(null);
      }
    }
  
    toast({
      title: `${type === 'prob' ? "Probabilidad" : "Impacto"} eliminada`,
      description: "Se ha eliminado exitosamente.",
    });
  };
  

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Probabilidad */}
        <div>
          <h1 className="text-3xl font-bold text-violet-900">Gestión de Probabilidad</h1>
          <Card className="p-6 shadow-lg border-t-4 border-violet-500 mt-4">
            <form onSubmit={(e) => handleSubmit(e, 'prob')} className="space-y-6">
              {["Nombre", "Descripción", "Criterio %"].map((label, index) => {
                const key = ["description", "definition", "criterion"][index] as keyof typeof probForm;
                return (
                  <div className="space-y-2" key={key}>
                    <label className="text-sm font-medium text-violet-700">
                      {label} <span className="text-red-500">*</span>
                    </label>
                    <Input
                      value={probForm[key]}
                      onChange={(e) => setProbForm({ ...probForm, [key]: e.target.value })}
                      placeholder={label}
                      className="border-violet-200 focus:ring-violet-500"
                    />
                  </div>
                );
              })}
              <Button type="submit" className="bg-orange-500 hover:bg-violet-900 text-white">
                {editingProbId ? "Actualizar Probabilidad" : "Registrar Probabilidad"}
              </Button>
            </form>
          </Card>

          <Card className="p-6 shadow-lg border-t-4 border-orange-500 mt-6">
            <h2 className="text-2xl font-semibold text-orange-900 mb-4">Listado de Probabilidad</h2>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="bg-violet-50">Nombre</TableHead>
                  <TableHead className="bg-violet-50">Descripción</TableHead>
                  <TableHead className="bg-violet-50">Criterio %</TableHead>
                  <TableHead className="bg-violet-50">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {probList.map((item) => (
                  <TableRow key={item.id} className="hover:bg-violet-50">
                    <TableCell>{item.description}</TableCell>
                    <TableCell>{item.definition}</TableCell>
                    <TableCell>{item.criterion}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-violet-600 border-violet-600"
                          onClick={() => handleEdit(item, 'prob')}
                        >
                          <Edit3 className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-orange-600 border-orange-600"
                          onClick={() => handleDelete(item.id, 'prob')}
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

        {/* Impacto */}
        <div>
          <h1 className="text-3xl font-bold text-violet-900">Gestión de Impacto</h1>
          <Card className="p-6 shadow-lg border-t-4 border-violet-500 mt-4">
            <form onSubmit={(e) => handleSubmit(e, 'impact')} className="space-y-6">
              {["Nombre", "Descripción", "Criterio SMLV"].map((label, index) => {
                const key = ["description", "definition", "criterion"][index] as keyof typeof impactForm;
                return (
                  <div className="space-y-2" key={key}>
                    <label className="text-sm font-medium text-violet-700">
                      {label} <span className="text-red-500">*</span>
                    </label>
                    <Input
                      value={impactForm[key]}
                      onChange={(e) => setImpactForm({ ...impactForm, [key]: e.target.value })}
                      placeholder={label}
                      className="border-violet-200 focus:ring-violet-500"
                    />
                  </div>
                );
              })}
              <Button type="submit" className="bg-orange-500 hover:bg-violet-900 text-white">
                {editingImpactId ? "Actualizar Impacto" : "Registrar Impacto"}
              </Button>
            </form>
          </Card>

          <Card className="p-6 shadow-lg border-t-4 border-orange-500 mt-6">
            <h2 className="text-2xl font-semibold text-orange-900 mb-4">Listado de Impacto</h2>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="bg-violet-50">Nombre</TableHead>
                  <TableHead className="bg-violet-50">Descripción</TableHead>
                  <TableHead className="bg-violet-50">Criterio SMLV</TableHead>
                  <TableHead className="bg-violet-50">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {impactList.map((item) => (
                  <TableRow key={item.id} className="hover:bg-violet-50">
                    <TableCell>{item.description}</TableCell>
                    <TableCell>{item.definition}</TableCell>
                    <TableCell>{item.criterion}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-violet-600 border-violet-600"
                          onClick={() => handleEdit(item, 'impact')}
                        >
                          <Edit3 className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-orange-600 border-orange-600"
                          onClick={() => handleDelete(item.id, 'impact')}
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
  );
}
