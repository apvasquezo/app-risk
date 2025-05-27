"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Edit3, Trash2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { transformProbability, transformImpact } from "@/lib/transformers"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import api from "@/lib/axios"

interface Prob {
  level: number
  description: string
  definition: string
  criteria_por: number
}

interface Impact {
  level: number
  description: string
  definition: string
  criteria_smlv: number
}

export default function ProbabilityImpactForm() {
  const { toast } = useToast()
  const [probForm, setProbForm] = useState({ level: "", description: "", definition: "", criterion: "" })
  const [impactForm, setImpactForm] = useState({ level: "", description: "", definition: "", criterion: "" })

  const [probList, setProbList] = useState<Prob[]>([])
  const [impactList, setImpactList] = useState<Impact[]>([])
  const [editingProbLevel, setEditingProbLevel] = useState<number | null>(null)
  const [editingImpactLevel, setEditingImpactLevel] = useState<number | null>(null)

  const [probErrors, setProbErrors] = useState({
    level: false,
    description: false,
    definition: false,
    criterion: false,
  })
  const [impactErrors, setImpactErrors] = useState({
    level: false,
    description: false,
    definition: false,
    criterion: false,
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Cargar probabilidades
        const responseProb = await api.get("/probabilities")
        setProbList(transformProbability(responseProb.data))

        // Cargar impactos
        const responseImp = await api.get("/impacts")
        setImpactList(transformImpact(responseImp.data))
      } catch (error) {
        console.error(error)
        toast({
          variant: "destructive",
          title: "Error al cargar datos",
          description: "No se pudo obtener el listado de probabilidades e impactos desde el servidor.",
        })
      }
    }
    fetchData()
  }, [toast])

  const validateForm = (form: typeof probForm, type: "prob" | "impact") => {
    const newErrors = {
      level: !form.level.trim() || isNaN(Number(form.level)),
      description: !form.description.trim(),
      definition: !form.definition.trim(),
      criterion: !form.criterion.trim() || isNaN(Number(form.criterion)),
    }

    // Validar que el level no esté duplicado
    if (form.level.trim() && !isNaN(Number(form.level))) {
      const editingLevel = type === "prob" ? editingProbLevel : editingImpactLevel
      const list = type === "prob" ? probList : impactList
      const levelNumber = Number(form.level)
      const isDuplicate = list.some((item) => item.level === levelNumber && item.level !== editingLevel)

      if (isDuplicate) {
        newErrors.level = true
        toast({
          variant: "destructive",
          title: "Error de validación",
          description: `Ya existe un ${type === "prob" ? "probabilidad" : "impacto"} con este nivel.`,
        })
      }
    }

    if (type === "prob") {
      setProbErrors(newErrors)
    } else {
      setImpactErrors(newErrors)
    }

    return !newErrors.description && !newErrors.definition && !newErrors.criterion && !newErrors.level
  }

  const resetForm = (type: "prob" | "impact") => {
    if (type === "prob") {
      setProbForm({ level: "", description: "", definition: "", criterion: "" })
      setEditingProbLevel(null)
      setProbErrors({ level: false, description: false, definition: false, criterion: false })
    } else {
      setImpactForm({ level: "", description: "", definition: "", criterion: "" })
      setEditingImpactLevel(null)
      setImpactErrors({ level: false, description: false, definition: false, criterion: false })
    }
  }

  const handleSubmit = async (e: React.FormEvent, type: "prob" | "impact") => {
    e.preventDefault()
    const form = type === "prob" ? probForm : impactForm
    const editingLevel = type === "prob" ? editingProbLevel : editingImpactLevel
    console.log("level ", editingLevel)

    if (!validateForm(form, type)) {
      return
    }

    try {
      const payload =
        type === "prob"
          ? {
              level: Number.parseInt(form.level),
              description: form.description,
              definition: form.definition,
              criteria_por: Number.parseFloat(form.criterion),
            }
          : {
              level: Number.parseInt(form.level),
              description: form.description,
              definition: form.definition,
              criteria_smlv: Number.parseFloat(form.criterion),
            }

      const endpoint = type === "prob" ? "/probabilities" : "/impacts"
      const itemName = type === "prob" ? "Probabilidad" : "Impacto"

      console.log("Payload enviado:", payload)
      console.log("Endpoint:", endpoint)

      if (editingLevel != null) {
        // Actualizar elemento existente usando el level como identificador
        await api.put(`${endpoint}/${editingLevel}`, payload)

        if (type === "prob") {
          setProbList(
            probList.map((item) =>
              item.level === editingLevel
                ? {
                    ...item,
                    level: Number.parseInt(form.level),
                    description: form.description,
                    definition: form.definition,
                    criteria_por: Number.parseFloat(form.criterion),
                  }
                : item,
            ),
          )
        } else {
          setImpactList(
            impactList.map((item) =>
              item.level === editingLevel
                ? {
                    ...item,
                    level: Number.parseInt(form.level),
                    description: form.description,
                    definition: form.definition,
                    criteria_smlv: Number.parseFloat(form.criterion),
                  }
                : item,
            ),
          )
        }

        toast({
          title: `${itemName} actualizada`,
          description: `La ${itemName.toLowerCase()} ha sido actualizada exitosamente.`,
        })
      } else {
        // Crear nuevo elemento
        console.log("lo que voy a grabar ", payload)
        const response = await api.post(endpoint, payload)
        console.log("Respuesta del servidor:", response.data)

        if (type === "prob") {
          const newProb: Prob = {
            level: Number.parseInt(form.level),
            description: form.description,
            definition: form.definition,
            criteria_por: Number.parseFloat(form.criterion),
          }
          setProbList([...probList, newProb])
        } else {
          const newImpact: Impact = {
            level: Number.parseInt(form.level),
            description: form.description,
            definition: form.definition,
            criteria_smlv: Number.parseFloat(form.criterion),
          }
          setImpactList([...impactList, newImpact])
        }

        toast({
          title: `${itemName} registrada`,
          description: `La nueva ${itemName.toLowerCase()} ha sido registrada exitosamente.`,
        })
      }

      resetForm(type)
    } catch (error) {
      console.error("Error en la operación:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Ocurrió un problema al guardar los datos.",
      })
    }
  }

  const handleEdit = (item: Prob | Impact, type: "prob" | "impact") => {
    if (type === "prob") {
      const probItem = item as Prob
      setProbForm({
        level: probItem.level.toString(),
        description: probItem.description,
        definition: probItem.definition,
        criterion: probItem.criteria_por.toString(),
      })
      setEditingProbLevel(probItem.level)
    } else {
      const impactItem = item as Impact
      setImpactForm({
        level: impactItem.level.toString(),
        description: impactItem.description,
        definition: impactItem.definition,
        criterion: impactItem.criteria_smlv.toString(),
      })
      setEditingImpactLevel(impactItem.level)
    }
  }

  const handleDelete = async (level: number, type: "prob" | "impact") => {
    const itemName = type === "prob" ? "probabilidad" : "impacto"
    const confirmDelete = window.confirm(`¿Estás segura de que deseas eliminar esta ${itemName} con nivel "${level}"?`)
    if (!confirmDelete) return

    try {
      const endpoint = type === "prob" ? "/probabilities" : "/impacts"
      await api.delete(`${endpoint}/${level}`)

      if (type === "prob") {
        setProbList(probList.filter((item) => item.level !== level))
      } else {
        setImpactList(impactList.filter((item) => item.level !== level))
      }

      // Limpiar formulario si se está editando el elemento eliminado
      if ((type === "prob" && editingProbLevel === level) || (type === "impact" && editingImpactLevel === level)) {
        resetForm(type)
      }

      toast({
        title: `${itemName.charAt(0).toUpperCase() + itemName.slice(1)} eliminada`,
        description: `La ${itemName} con nivel "${level}" ha sido eliminada exitosamente.`,
      })
    } catch (error) {
      console.error("Error al eliminar:", error)
      toast({
        variant: "destructive",
        title: "Error al eliminar",
        description: `No se pudo eliminar la ${itemName}.`,
      })
    }
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Probabilidad */}
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-violet-900">Gestión de Probabilidad</h1>

          <Card className="p-6 shadow-lg border-t-4 border-violet-500">
            <form onSubmit={(e) => handleSubmit(e, "prob")} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-violet-700">
                  Nivel <span className="text-red-500">*</span>
                </label>
                <Input
                  type="number"
                  value={probForm.level}
                  onChange={(e) => {
                    setProbForm({ ...probForm, level: e.target.value })
                    setProbErrors({ ...probErrors, level: false })
                  }}
                  placeholder="Nivel de la probabilidad (número único)"
                  className={`border-violet-200 focus:ring-violet-500 ${probErrors.level ? "border-red-500" : ""}`}
                />
                {probErrors.level && (
                  <p className="text-sm text-red-500">Este campo es obligatorio, debe ser un número único</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-violet-700">
                  Nombre <span className="text-red-500">*</span>
                </label>
                <Input
                  value={probForm.description}
                  onChange={(e) => {
                    setProbForm({ ...probForm, description: e.target.value })
                    setProbErrors({ ...probErrors, description: false })
                  }}
                  placeholder="Nombre de la probabilidad"
                  className={`border-violet-200 focus:ring-violet-500 ${
                    probErrors.description ? "border-red-500" : ""
                  }`}
                />
                {probErrors.description && <p className="text-sm text-red-500">Este campo es obligatorio</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-violet-700">
                  Descripción <span className="text-red-500">*</span>
                </label>
                <Input
                  value={probForm.definition}
                  onChange={(e) => {
                    setProbForm({ ...probForm, definition: e.target.value })
                    setProbErrors({ ...probErrors, definition: false })
                  }}
                  placeholder="Descripción de la probabilidad"
                  className={`border-violet-200 focus:ring-violet-500 ${probErrors.definition ? "border-red-500" : ""}`}
                />
                {probErrors.definition && <p className="text-sm text-red-500">Este campo es obligatorio</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-violet-700">
                  Criterio % <span className="text-red-500">*</span>
                </label>
                <Input
                  type="number"
                  step="0.01"
                  value={probForm.criterion}
                  onChange={(e) => {
                    setProbForm({ ...probForm, criterion: e.target.value })
                    setProbErrors({ ...probErrors, criterion: false })
                  }}
                  placeholder="Criterio en porcentaje"
                  className={`border-violet-200 focus:ring-violet-500 ${probErrors.criterion ? "border-red-500" : ""}`}
                />
                {probErrors.criterion && (
                  <p className="text-sm text-red-500">Este campo es obligatorio y debe ser un número</p>
                )}
              </div>

              <div className="flex gap-4">
                <Button type="submit" className="bg-orange-500 hover:bg-violet-700 text-white">
                  {editingProbLevel ? "Actualizar Probabilidad" : "Registrar Probabilidad"}
                </Button>
                {editingProbLevel && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => resetForm("prob")}
                    className="text-violet-600 border-violet-600 hover:bg-violet-50"
                  >
                    Cancelar
                  </Button>
                )}
              </div>
            </form>
          </Card>

          <Card className="p-6 shadow-lg border-t-4 border-orange-500">
            <h2 className="text-2xl font-semibold text-orange-900 mb-4">Listado de Probabilidades</h2>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="bg-violet-50">Nivel</TableHead>
                    <TableHead className="bg-violet-50">Nombre</TableHead>
                    <TableHead className="bg-violet-50">Descripción</TableHead>
                    <TableHead className="bg-violet-50">Criterio %</TableHead>
                    <TableHead className="bg-violet-50">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {probList.map((item) => (
                    <TableRow key={item.level} className="hover:bg-violet-50">
                      <TableCell className="font-semibold text-violet-700">{item.level}</TableCell>
                      <TableCell>{item.description}</TableCell>
                      <TableCell>{item.definition}</TableCell>
                      <TableCell>{item.criteria_por}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-violet-600 border-violet-600 hover:bg-violet-50"
                            onClick={() => handleEdit(item, "prob")}
                          >
                            <Edit3 className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 border-red-600 hover:bg-red-50"
                            onClick={() => handleDelete(item.level, "prob")}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </div>

        {/* Impacto */}
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-violet-900">Gestión de Impacto</h1>

          <Card className="p-6 shadow-lg border-t-4 border-violet-500">
            <form onSubmit={(e) => handleSubmit(e, "impact")} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-violet-700">
                  Nivel <span className="text-red-500">*</span>
                </label>
                <Input
                  type="number"
                  value={impactForm.level}
                  onChange={(e) => {
                    setImpactForm({ ...impactForm, level: e.target.value })
                    setImpactErrors({ ...impactErrors, level: false })
                  }}
                  placeholder="Nivel del impacto (número único)"
                  className={`border-violet-200 focus:ring-violet-500 ${impactErrors.level ? "border-red-500" : ""}`}
                />
                {impactErrors.level && (
                  <p className="text-sm text-red-500">Este campo es obligatorio, debe ser un número único</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-violet-700">
                  Nombre <span className="text-red-500">*</span>
                </label>
                <Input
                  value={impactForm.description}
                  onChange={(e) => {
                    setImpactForm({ ...impactForm, description: e.target.value })
                    setImpactErrors({ ...impactErrors, description: false })
                  }}
                  placeholder="Nombre del impacto"
                  className={`border-violet-200 focus:ring-violet-500 ${
                    impactErrors.description ? "border-red-500" : ""
                  }`}
                />
                {impactErrors.description && <p className="text-sm text-red-500">Este campo es obligatorio</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-violet-700">
                  Descripción <span className="text-red-500">*</span>
                </label>
                <Input
                  value={impactForm.definition}
                  onChange={(e) => {
                    setImpactForm({ ...impactForm, definition: e.target.value })
                    setImpactErrors({ ...impactErrors, definition: false })
                  }}
                  placeholder="Descripción del impacto"
                  className={`border-violet-200 focus:ring-violet-500 ${
                    impactErrors.definition ? "border-red-500" : ""
                  }`}
                />
                {impactErrors.definition && <p className="text-sm text-red-500">Este campo es obligatorio</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-violet-700">
                  Criterio SMLV <span className="text-red-500">*</span>
                </label>
                <Input
                  type="number"
                  step="0.01"
                  value={impactForm.criterion}
                  onChange={(e) => {
                    setImpactForm({ ...impactForm, criterion: e.target.value })
                    setImpactErrors({ ...impactErrors, criterion: false })
                  }}
                  placeholder="Criterio en SMLV"
                  className={`border-violet-200 focus:ring-violet-500 ${impactErrors.criterion ? "border-red-500" : ""}`}
                />
                {impactErrors.criterion && (
                  <p className="text-sm text-red-500">Este campo es obligatorio y debe ser un número</p>
                )}
              </div>

              <div className="flex gap-4">
                <Button type="submit" className="bg-orange-500 hover:bg-violet-700 text-white">
                  {editingImpactLevel ? "Actualizar Impacto" : "Registrar Impacto"}
                </Button>
                {editingImpactLevel && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => resetForm("impact")}
                    className="text-violet-600 border-violet-600 hover:bg-violet-50"
                  >
                    Cancelar
                  </Button>
                )}
              </div>
            </form>
          </Card>

          <Card className="p-6 shadow-lg border-t-4 border-orange-500">
            <h2 className="text-2xl font-semibold text-orange-900 mb-4">Listado de Impactos</h2>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="bg-violet-50">Nivel</TableHead>
                    <TableHead className="bg-violet-50">Nombre</TableHead>
                    <TableHead className="bg-violet-50">Descripción</TableHead>
                    <TableHead className="bg-violet-50">Criterio SMLV</TableHead>
                    <TableHead className="bg-violet-50">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {impactList.map((item) => (
                    <TableRow key={item.level} className="hover:bg-violet-50">
                      <TableCell className="font-semibold text-violet-700">{item.level}</TableCell>
                      <TableCell>{item.description}</TableCell>
                      <TableCell>{item.definition}</TableCell>
                      <TableCell>{item.criteria_smlv}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-violet-600 border-violet-600 hover:bg-violet-50"
                            onClick={() => handleEdit(item, "impact")}
                          >
                            <Edit3 className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 border-red-600 hover:bg-red-50"
                            onClick={() => handleDelete(item.level, "impact")}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
