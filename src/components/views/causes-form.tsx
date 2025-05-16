"use client"

import type React from "react"

import { useState } from "react"
import { Edit3, Trash2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"

interface Item {
  id: string
  description: string
}

export default function CausesConsequencesForm() {
  const { toast } = useToast()

  const [causeForm, setCauseForm] = useState({ description: "" })
  const [consequenceForm, setConsequenceForm] = useState({ description: "" })

  const [causeList, setCauseList] = useState<Item[]>([
    {
      id: "1",
      description: "Falta de mantenimiento preventivo",
    },
  ])

  const [consequenceList, setConsequenceList] = useState<Item[]>([
    {
      id: "1",
      description: "Pérdida de productividad",
    },
  ])

  const [editingCauseId, setEditingCauseId] = useState<string | null>(null)
  const [editingConsequenceId, setEditingConsequenceId] = useState<string | null>(null)

  const isEditing = (id: string, type: "cause" | "consequence") =>
    type === "cause" ? editingCauseId === id : editingConsequenceId === id

  const handleSubmit = (e: React.FormEvent, type: "cause" | "consequence") => {
    e.preventDefault()
    const form = type === "cause" ? causeForm : consequenceForm
    const setList = type === "cause" ? setCauseList : setConsequenceList
    const list = type === "cause" ? causeList : consequenceList
    const setForm = type === "cause" ? setCauseForm : setConsequenceForm
    const editingId = type === "cause" ? editingCauseId : editingConsequenceId
    const setEditingId = type === "cause" ? setEditingCauseId : setEditingConsequenceId

    if (!form.description) {
      toast({
        variant: "destructive",
        title: "Error de validación",
        description: "El campo descripción es obligatorio.",
      })
      return
    }

    if (editingId) {
      setList(list.map((item) => (item.id === editingId ? { ...form, id: editingId } : item)))
      toast({
        title: `${type === "cause" ? "Causa" : "Consecuencia"} actualizada`,
        description: "Se actualizó correctamente.",
      })
    } else {
      setList([...list, { ...form, id: Date.now().toString() }])
      toast({
        title: `${type === "cause" ? "Causa" : "Consecuencia"} registrada`,
        description: "Se ha registrado exitosamente.",
      })
    }

    setForm({ description: "" })
    setEditingId(null)
  }

  const handleEdit = (item: Item, type: "cause" | "consequence") => {
    if (type === "cause") {
      setCauseForm(item)
      setEditingCauseId(item.id)
    } else {
      setConsequenceForm(item)
      setEditingConsequenceId(item.id)
    }
  }

  const handleDelete = (id: string, type: "cause" | "consequence") => {
    const setList = type === "cause" ? setCauseList : setConsequenceList
    const list = type === "cause" ? causeList : consequenceList
    setList(list.filter((item) => item.id !== id))

    if ((type === "cause" && editingCauseId === id) || (type === "consequence" && editingConsequenceId === id)) {
      type === "cause" ? setEditingCauseId(null) : setEditingConsequenceId(null)
    }

    toast({
      title: `${type === "cause" ? "Causa" : "Consecuencia"} eliminada`,
      description: "Se ha eliminado exitosamente.",
    })
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
