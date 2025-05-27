"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Edit3, Trash2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { transformTypeRisk } from "@/lib/transformers"
import { transformCategory } from "@/lib/transformers"
import api from "@/lib/axios"

interface RiskType {
  id_risk: string
  category: string // Nombre de la categoría
  description: string
  category_id: string // ID de la categoría
}

interface Category {
  id_category: string
  name: string
}

export default function RiskTypes() {
  const { toast } = useToast()
  const [formData, setFormData] = useState({ category: "", description: "" })
  const [editingId, setEditingId] = useState<string | null>(null)
  const [errors, setErrors] = useState({ category: false, description: false })
  const [categories, setCategories] = useState<Category[]>([])
  const [riskTypes, setRiskTypes] = useState<RiskType[]>([])

  const mapCategoryIdToName = (categoryId: string, categoriesList: Category[]): string => {
    const category = categoriesList.find((cat) => cat.id_category === categoryId)
    return category ? category.name : "Categoría no encontrada"
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseCat = await api.get("/risk-categories")
        const transformedCategories = transformCategory(responseCat.data)
        setCategories(transformedCategories)

        const responseTypes = await api.get("/risk-types")
        const transformedRiskTypes = transformTypeRisk(responseTypes.data)
        // Mapear categorías 
        const riskTypesWithCategoryNames = transformedRiskTypes.map((riskType) => ({
          ...riskType,
          category: mapCategoryIdToName(riskType.category_id, transformedCategories),
        }))

        setRiskTypes(riskTypesWithCategoryNames)
      } catch (error) {
        console.error(error)
        toast({
          variant: "destructive",
          title: "Error al cargar datos",
          description: "No se pudo obtener la información del servidor.",
        })
      }
    }
    fetchData()
  }, [toast])

  const validateForm = () => {
    const newErrors = {
      category: !formData.category.trim(),
      description: !formData.description.trim(),
    }
    setErrors(newErrors)
    return !newErrors.category && !newErrors.description
  }

  const resetForm = () => {
    setFormData({ category: "", description: "" })
    setEditingId(null)
    setErrors({ category: false, description: false })
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
        category_id: Number.parseInt(formData.category), // Convertir a número para la API
        description: formData.description,
      }

      if (editingId) {
        await api.put(`/risk-types/${editingId}`, payload)
        setRiskTypes(
          riskTypes.map((riskType) =>
            riskType.id_risk === editingId
              ? {
                  ...riskType,
                  description: formData.description,
                  category_id: formData.category,
                  category: mapCategoryIdToName(formData.category, categories),
                }
              : riskType,
          ),
        )

        toast({
          title: "Tipo de Riesgo actualizado",
          description: "El tipo de riesgo ha sido actualizado exitosamente.",
        })

      } else {
        const response = await api.post("/risk-types", payload)
        const newRiskType: RiskType = {
          id_risk: response.data.id_risktype?.toString() || Date.now().toString(),
          description: formData.description,
          category: mapCategoryIdToName(formData.category, categories),
          category_id: formData.category,
        }
        setRiskTypes([...riskTypes, newRiskType])

        toast({
          title: "Tipo de Riesgo registrado",
          description: "El nuevo tipo de riesgo ha sido registrado exitosamente.",
        })
      }
      resetForm()
    } catch (error) {
      console.error(error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Ocurrió un error al procesar la solicitud.",
      })
    }
  }

  const handleEdit = (riskType: RiskType) => {
    setFormData({
      category: riskType.category_id, // Usar el ID de la categoría
      description: riskType.description,
    })
    setEditingId(riskType.id_risk)
  }

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm("¿Estás segura de que deseas eliminar este tipo de riesgo?")
    if (!confirmDelete) return

    try {
      await api.delete(`/risk-types/${id}`)
      setRiskTypes(riskTypes.filter((riskType) => riskType.id_risk !== id))

      toast({
        title: "Tipo de Riesgo eliminado",
        description: "El tipo de riesgo ha sido eliminado exitosamente.",
      })
      if (editingId === id) resetForm()
    } catch (error) {
      console.error(error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo eliminar el tipo de riesgo.",
      })
    }
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold text-violet-900">Gestión Tipos de Riesgos</h1>
        </div>

        <Card className="p-6 shadow-lg border-t-4 border-violet-500">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-violet-700">
                Categoría de Riesgo <span className="text-red-500">*</span>
              </label>
              <Select
                onValueChange={(value) => {
                  setFormData({ ...formData, category: value })
                  setErrors({ ...errors, category: false })
                }}
                value={formData.category}
              >
                <SelectTrigger
                  className={`${
                    errors.category ? "border-red-500" : "border-violet-200 focus:ring-violet-500"
                  } w-full rounded-md p-2 bg-white text-black`}
                >
                  <SelectValue placeholder="Seleccione una categoría" />
                </SelectTrigger>
                <SelectContent className="bg-white shadow-md border border-gray-200 rounded-md">
                  {categories.map((category) => (
                    <SelectItem
                      key={category.id_category}
                      value={category.id_category}
                      className="hover:bg-violet-100 focus:bg-violet-200"
                    >
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && <p className="text-sm text-red-500">Este campo es obligatorio</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-violet-700">
                Tipo de Riesgo <span className="text-red-500">*</span>
              </label>
              <Input
                required
                placeholder="Ingrese el tipo de riesgo"
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
                {editingId ? "Actualizar Tipo de Riesgo" : "Registrar Tipo de Riesgo"}
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
          <h2 className="text-2xl font-semibold text-orange-900 mb-4">Listado de Tipos de Riesgos</h2>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="bg-violet-50">Categoría</TableHead>
                  <TableHead className="bg-violet-50">Tipo de Riesgo</TableHead>
                  <TableHead className="bg-violet-50">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {riskTypes.map((riskType) => (
                  <TableRow key={riskType.id_risk} className="hover:bg-violet-50">
                    <TableCell>{riskType.category}</TableCell>
                    <TableCell>{riskType.description}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-violet-600 border-violet-600 hover:bg-violet-50"
                          onClick={() => handleEdit(riskType)}
                        >
                          <Edit3 className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 border-red-600 hover:bg-red-50"
                          onClick={() => handleDelete(riskType.id_risk)}
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
