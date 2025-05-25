"use client"

import React, { useState, useEffect } from "react"
import { Edit3, Trash2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { transformCauses } from "@/lib/transformers"
import { transformConsequences } from "@/lib/transformers"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast"
import api from "@/lib/axios";

interface Cause {
  id: number
  description: string
}

interface Consequence {
  id: number
  description: string
}

export default function CausesConsequencesForm() {
  const { toast } = useToast()
  const [causeForm, setCauseForm] = useState({ description: "" })
  const [consequenceForm, setConsequenceForm] = useState({ description: "" })
  const [editingCauseId, setEditingCauseId] = useState<number | null>(null)
  const [editingConsequenceId, setEditingConsequenceId] = useState<number | null>(null)
  const [causeList, setCauseList] = useState<Cause[]>([])
  const [consequenceList, setConsequenceList] = useState<Consequence[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [causeRes, consequenceRes] = await Promise.all([
          api.get("/causes"),
          api.get("/consequences")
        ])
        setCauseList(transformCauses(causeRes.data));
        setConsequenceList(transformConsequences(consequenceRes.data));
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error al cargar datos",
          description: "No se pudieron obtener las causas o consecuencias."
        })
      }
    }
    fetchData()
  }, [toast])

  const handleSubmit = async (
    e: React.FormEvent,
    type: "cause" | "consequence"
  ) => {
    e.preventDefault()
    const form = type === "cause" ? causeForm : consequenceForm
    const editingId = type === "cause" ? editingCauseId : editingConsequenceId

    if (!form.description.trim()) {
      toast({
        variant: "destructive",
        title: "Error de validación",
        description: "La descripción es obligatoria."
      })
      return
    }

    try {
      if (editingId !== null) {
        await api.put(
          `/${type === "cause" ? "causes" : "consequences"}/${editingId}`,
          { description: form.description },
        )
        if (type === "cause") {
          setCauseList(prev =>
            prev.map(item =>
              item.id === editingId ? { ...item, description: form.description } : item
            )
          )
          setEditingCauseId(null)
        } else {
          setConsequenceList(prev =>
            prev.map(item =>
              item.id === editingId ? { ...item, description: form.description } : item
            )
          )
          setEditingConsequenceId(null)
        }
        toast({
          title: "Actualización exitosa",
          description: `${type === "cause" ? "Causa" : "Consecuencia"} actualizada correctamente.`
        })
      } else {
        const res = await api.post(
          `/${type === "cause" ? "causes" : "consequences"}`,
          { description: form.description },
        )
        const newItem = {
          id: res.data.id_cause || res.data.id_consequence,
          description: res.data.description
        }
        if (type === "cause") setCauseList(prev => [...prev, newItem])
        else setConsequenceList(prev => [...prev, newItem])
        toast({
          title: "Registro exitoso",
          description: `${type === "cause" ? "Causa" : "Consecuencia"} registrada.`
        })
      }
      if (type === "cause") setCauseForm({ description: "" })
      else setConsequenceForm({ description: "" })
    } catch  {
      toast({
        variant: "destructive",
        title: "Error al guardar",
        description: "No se pudo procesar la solicitud."
      })
    }
  }

  const handleEdit = (item: Cause | Consequence, type: "cause" | "consequence") => {
    if (type === "cause") {
      setCauseForm({ description: item.description })
      setEditingCauseId(item.id)
    } else {
      setConsequenceForm({ description: item.description })
      setEditingConsequenceId(item.id)
    }
  }

  const handleDelete = async (id: number, type: "cause" | "consequence") => {
    try {
      await api.delete(
        `/${type === "cause" ? "causes" : "consequences"}/${id}`,
      )
      if (type === "cause") {
        setCauseList(prev => prev.filter(item => item.id !== id))
        if (editingCauseId === id) setEditingCauseId(null)
      } else {
        setConsequenceList(prev => prev.filter(item => item.id !== id))
        if (editingConsequenceId === id) setEditingConsequenceId(null)
      }
      toast({
        title: "Eliminación exitosa",
        description: `${type === "cause" ? "Causa" : "Consecuencia"} eliminada correctamente.`
      })
    } catch {
      toast({
        variant: "destructive",
        title: "Error al eliminar",
        description: "No se pudo eliminar el registro."
      })
    }
  }

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
                  onChange={(e) => setCauseForm({ ...causeForm, description: e.target.value })}
                  placeholder="Descripción de la causa"
                  className="border-violet-200 focus:ring-violet-500"
                />
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
