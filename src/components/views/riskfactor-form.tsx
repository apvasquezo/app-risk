"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Edit3, Trash2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { transformRiskFactors } from "@/lib/transformers"
import { transformTypeRisk } from "@/lib/transformers"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import api from "@/lib/axios"

interface RiskFactor {
  id: string
  type: string // nombre tipo de riesgo
  type_id: string // ID tipo de riesgo
  description: string
}

interface RiskType {
  id_risk: string
  category_id: string
  description: string
}

export default function RiskFactors() {
  const { toast } = useToast()
  const [formData, setFormData] = useState({ type: "", description: "" })
  const [editingId, setEditingId] = useState<string | null>(null)
  const [errors, setErrors] = useState({ type: false, description: false })
  const [riskTypes, setRiskTypes] = useState<RiskType[]>([])
  const [riskFactors, setRiskFactors] = useState<RiskFactor[]>([])

  const mapRiskTypeIdToName = (risktypeId: string, risktypeList: RiskType[]): string => {
    const risktype = risktypeList.find((risk) => risk.id_risk === risktypeId)
    return risktype ? risktype.description : "Tipo de riesgo no encontrado"
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseTypes = await api.get("/risk-types")
        const transformedRiskTypes = transformTypeRisk(responseTypes.data)
        setRiskTypes(transformedRiskTypes)

        const responseFactors = await api.get("/risk-factors")
        const transformedFactors = transformRiskFactors(responseFactors.data)

        const factorsWithTypeNames = transformedFactors.map((factor) => ({
          ...factor,
          type: mapRiskTypeIdToName(factor.type_id, transformedRiskTypes),
        }))

        setRiskFactors(factorsWithTypeNames)
      } catch (error) {
        console.error(error)
        toast({
          variant: "destructive",
          title: "Error al cargar factores de riesgo",
          description: "No se pudo obtener el listado desde el servidor.",
        })
      }
    }
    fetchData()
  }, [toast])

  const validateForm = () => {
    const newErrors = {
      type: !formData.type.trim(),
      description: !formData.description.trim(),
    }
    setErrors(newErrors)
    return !newErrors.type && !newErrors.description
  }

  const resetForm = () => {
    setFormData({ type: "", description: "" })
    setEditingId(null)
    setErrors({ type: false, description: false })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) {
      toast({
        variant: "destructive",
        title: "Error de validación",
        description: "Todos los campos son obligatorios.",
      })
      return
    }

    try {
      const payload = {
        risk_type_id: Number.parseInt(formData.type), // Usar el nombre correcto del campo
        description: formData.description,
      }

      if (editingId) {
        await api.put(`/risk-factors/${editingId}`, payload)
        setRiskFactors(
          riskFactors.map((riskFactor) =>
            riskFactor.id === editingId
              ? {
                  ...riskFactor,
                  description: formData.description,
                  type_id: formData.type,
                  type: mapRiskTypeIdToName(formData.type, riskTypes),
                }
              : riskFactor,
          ),
        )
        toast({
          title: "Factor actualizado",
          description: "El factor de riesgo fue actualizado exitosamente.",
        })
      } else {
        const response = await api.post("/risk-factors", payload)
        const newFactor: RiskFactor = {
          id: response.data.id_factor?.toString(),
          description: formData.description,
          type: mapRiskTypeIdToName(formData.type, riskTypes),
          type_id: formData.type,
        }

        setRiskFactors([...riskFactors, newFactor])
        toast({
          title: "Factor registrado",
          description: "Nuevo factor de riesgo registrado con éxito.",
        })
      }
      resetForm()
    } catch (error) {
      console.error(error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Ocurrió un problema al guardar los datos.",
      })
    }
  }

  const handleEdit = (factor: RiskFactor) => {
    setFormData({
      type: factor.type_id,
      description: factor.description,
    })
    setEditingId(factor.id)
  }

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm("¿Estás segura de que deseas eliminar este factor de riesgo?")
    if (!confirmDelete) return

    try {
      await api.delete(`/risk-factors/${id}`)
      setRiskFactors(riskFactors.filter((factor) => factor.id !== id))
      toast({
        title: "Factor eliminado",
        description: "El factor de riesgo fue eliminado con éxito.",
      })
      if (editingId === id) resetForm()
    } catch (error) {
      console.error(error)
      toast({
        variant: "destructive",
        title: "Error al eliminar",
        description: "No se pudo eliminar el factor de riesgo.",
      })
    }
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold text-violet-900">Gestión Factores de Riesgos</h1>
        </div>

        <Card className="p-6 shadow-lg border-t-4 border-violet-500">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-violet-700">
                Tipo de Riesgo <span className="text-red-500">*</span>
              </label>
              <Select
                onValueChange={(value) => {
                  setFormData({ ...formData, type: value })
                  setErrors({ ...errors, type: false })
                }}
                value={formData.type}
              >
                <SelectTrigger
                  className={`border-violet-200 focus:ring-violet-500 ${errors.type ? "border-red-500" : ""}`}
                >
                  <SelectValue placeholder="Seleccione un tipo de riesgo" />
                </SelectTrigger>
                <SelectContent className="bg-white shadow-md border border-gray-200 rounded-md">
                  {riskTypes.map((riskType) => (
                    <SelectItem
                      key={riskType.id_risk}
                      value={riskType.id_risk}
                      className="hover:bg-violet-100 focus:bg-violet-200"
                    >
                      {riskType.description}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.type && <p className="text-sm text-red-500">Este campo es obligatorio</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-violet-700">
                Descripción del Factor <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="Ingrese la descripción del factor de riesgo"
                value={formData.description}
                onChange={(e) => {
                  setFormData({ ...formData, description: e.target.value })
                  setErrors({ ...errors, description: false })
                }}
                className={`border-violet-200 focus:ring-violet-500 ${errors.description ? "border-red-500" : ""}`}
              />
              {errors.description && <p className="text-sm text-red-500">Este campo es obligatorio</p>}
            </div>

            <div className="flex gap-4">
              <Button type="submit" className="bg-orange-500 hover:bg-violet-700 text-white">
                {editingId ? "Actualizar Factor" : "Registrar Factor"}
              </Button>
              {editingId && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetForm}
                  className="text-violet-600 border-violet-600 hover:bg-violet-50"
                >
                  Cancelar
                </Button>
              )}
            </div>
          </form>
        </Card>

        <Card className="p-6 shadow-lg border-t-4 border-orange-500">
          <h2 className="text-2xl font-semibold text-orange-900 mb-4">Listado de Factores de Riesgo</h2>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="bg-violet-50">Tipo de Riesgo</TableHead>
                  <TableHead className="bg-violet-50">Descripción del Factor</TableHead>
                  <TableHead className="bg-violet-50">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {riskFactors.map((factor) => (
                  <TableRow key={factor.id} className="hover:bg-violet-50">
                    <TableCell>{factor.type}</TableCell>
                    <TableCell>{factor.description}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-violet-600 border-violet-600 hover:bg-violet-50"
                          onClick={() => handleEdit(factor)}
                        >
                          <Edit3 className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 border-red-600 hover:bg-red-50"
                          onClick={() => handleDelete(factor.id)}
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
  )
}
