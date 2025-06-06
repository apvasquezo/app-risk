"use client"

import type React from "react"

import { useState, useEffect, useMemo, useCallback } from "react"
import { Edit3, Trash2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  transformRiskFactors,
  transformProbability,
  transformImpact,
  transformTypeRisk,
  transformEvent,
} from "@/lib/transformers"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import api from "@/lib/axios"

interface RiskFactor {
  id: string
  type_id: string
  description: string
}

interface RiskType {
  id_risk: string
  category_id: string
  description: string
}

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
interface RiskEntry {
  id: string
  t_riesgo: string
  factor_id: string
  description: string
  probabilidad: string
  impacto: string
}

export default function RiskManagement() {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    t_riesgo: "",
    factor_id: "",
    description: "",
    probabilidad: "",
    impacto: "",
  })
  const [editingId, setEditingId] = useState<string | null>(null)
  const [errors, setErrors] = useState({
    t_riesgo: false,
    factor_id: false,
    description: false,
    probabilidad: false,
    impacto: false,
  })

  const [riskEntries, setRiskEntries] = useState<RiskEntry[]>([])
  const [riskTypes, setRiskTypes] = useState<RiskType[]>([])
  const [riskFactors, setRiskFactors] = useState<RiskFactor[]>([])
  const [probList, setProbList] = useState<Prob[]>([])
  const [impactList, setImpactList] = useState<Impact[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchEvent = async () => {
      setIsLoading(true)
      try {
        
        const responseTypes = await api.get("/risk-types")
        setRiskTypes(transformTypeRisk(responseTypes.data))

        const responseFactors = await api.get("/risk-factors")
        setRiskFactors(transformRiskFactors(responseFactors.data))

        const responseProb = await api.get("/probabilities")
        setProbList(transformProbability(responseProb.data))

        const responseImp = await api.get("/impacts")
        setImpactList(transformImpact(responseImp.data))

        const responseEvent = await api.get("/events")
        setRiskEntries(transformEvent(responseEvent.data))
      } catch (error) {
        console.error(error)
        toast({
          variant: "destructive",
          title: "Error al cargar datos",
          description: "No se pudo obtener los listados.",
        })
      } finally {
        setIsLoading(false)
      }
    }
    fetchEvent()
  }, [toast])

  // Helper functions to get descriptions from IDs
  const getRiskTypeDescription = (id: string) => {
    const riskType = riskTypes.find((type) => type.id_risk === id)
    return riskType ? riskType.description : id
  }

  const getRiskFactorDescription = (id: string) => {
    const factor = riskFactors.find((factor) => factor.id === id)
    return factor ? factor.description : id
  }

  const getProbabilityDescription = (level: string) => {
    const prob = probList.find((p) => p.level.toString() === level)
    return prob ? prob.description : level
  }

  const getImpactDescription = (level: string) => {
    const impact = impactList.find((i) => i.level.toString() === level)
    return impact ? impact.description : level
  }

  const validateForm = useCallback(() => {
    const newErrors = {
      t_riesgo: !formData.t_riesgo.trim(),
      factor_id: !formData.factor_id.trim(),
      description: !formData.description.trim(),
      probabilidad: !formData.probabilidad.trim(),
      impacto: !formData.impacto.trim(),
    }
    setErrors(newErrors)
    return !Object.values(newErrors).some(Boolean)
  }, [formData])

  const resetForm = useCallback(() => {
    setFormData({
      t_riesgo: "",
      factor_id: "",
      description: "",
      probabilidad: "",
      impacto: "",
    })
    setEditingId(null)
    setErrors({
      t_riesgo: false,
      factor_id: false,
      description: false,
      probabilidad: false,
      impacto: false,
    })
  }, [])

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      if (!validateForm()) {
        console.log("los datos del formulario ", formData)
        toast({
          variant: "destructive",
          title: "Error de validación",
          description: "Todos los campos son obligatorios.",
        })
        return
      }

      setIsLoading(true)
      try {
        const payload = {
          risk_type_id: formData.t_riesgo,
          factor_id: formData.factor_id,
          description: formData.description,
          probability_id: formData.probabilidad,
          impact_id: formData.impacto,
        }

        if (editingId) {
          await api.put(`/events/${editingId}`, payload)
          setRiskEntries((prev) =>
            prev.map((entry) => (entry.id === editingId ? { ...formData, id: editingId } : entry)),
          )
          toast({
            title: "Evento actualizado",
            description: "El registro de evento ha sido actualizado exitosamente.",
          })
        } else {
          const response = await api.post("/events", payload)
          const newEntry = {
            id: response.data.id_event,
            t_riesgo: getRiskTypeDescription(response.data.risk_type_id).toString(),
            factor_id: getRiskFactorDescription(response.data.factor_id).toString(),
            description: response.data.description,
            probabilidad:getProbabilityDescription(response.data.probability_id).toString(),
            impacto: getImpactDescription(response.data.impact_id).toString()
          }
          setRiskEntries((prev) => [...prev, newEntry])
          toast({
            title: "Evento registrado",
            description: "El nuevo evento ha sido registrado exitosamente.",
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
      } finally {
        setIsLoading(false)
      }
    },
    [formData, editingId, validateForm, resetForm, toast],
  )

  const handleEdit = useCallback((entry: RiskEntry) => {
    setFormData(entry)
    setEditingId(entry.id)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [])

  const handleDelete = useCallback(
    async (id: string) => {
      const confirmDelete = window.confirm("¿Estás segura de que deseas eliminar este evento?")
      if (!confirmDelete) return

      setIsLoading(true)
      try {
        await api.delete(`/events/${id}`)
        setRiskEntries((prev) => prev.filter((entry) => entry.id !== id))
        if (editingId === id) {
          resetForm()
        }
        toast({
          title: "Registro eliminado",
          description: "El registro ha sido eliminado exitosamente.",
        })
      } catch (error) {
        console.error(error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Ocurrió un error al eliminar el evento.",
        })
      } finally {
        setIsLoading(false)
      }
    },
    [editingId, resetForm, toast],
  )

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-violet-900">Registro de Eventos</h1>

        <Card className="p-6 shadow-lg border-t-4 border-violet-500">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { label: "Tipo de Riesgo", key: "t_riesgo", options: riskTypes },
              { label: "Factor", key: "factor_id", options: riskFactors },
              { label: "Probabilidad", key: "probabilidad", options: probList },
              { label: "Impacto", key: "impacto", options: impactList },
            ].map(({ label, key, options }) => (
              <div key={key} className="space-y-2">
                <label className="text-sm font-medium text-violet-700">
                  {label} <span className="text-red-500">*</span>
                </label>
                <Select
                  onValueChange={(value) => {
                    setFormData({ ...formData, [key]: value })
                    setErrors({ ...errors, [key]: false })
                  }}
                  value={formData[key as keyof typeof formData] || ""}
                >
                  <SelectTrigger
                    className={`p-2 bg-white text-black rounded-md border ${
                      errors[key as keyof typeof errors] ? "border-red-500" : "border-violet-200"
                    }`}
                  >
                    <SelectValue placeholder={`Seleccione un ${label.toLowerCase()}`} />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-300 shadow-md rounded-lg">
                    {key === "t_riesgo" &&
                      riskTypes.map((option) => (
                        <SelectItem
                          key={option.id_risk}
                          value={option.id_risk}
                          className="hover:bg-violet-100 focus:bg-violet-200 text-black"
                        >
                          {option.description}
                        </SelectItem>
                      ))}
                    {key === "factor_id" &&
                      riskFactors.map((option) => (
                        <SelectItem
                          key={option.id}
                          value={option.id}
                          className="hover:bg-violet-100 focus:bg-violet-200 text-black"
                        >
                          {option.description}
                        </SelectItem>
                      ))}
                    {key === "probabilidad" &&
                      probList.map((option) => (
                        <SelectItem
                          key={option.level}
                          value={option.level.toString()}
                          className="hover:bg-violet-100 focus:bg-violet-200 text-black"
                        >
                          {option.description}
                        </SelectItem>
                      ))}
                    {key === "impacto" &&
                      impactList.map((option) => (
                        <SelectItem
                          key={option.level}
                          value={option.level.toString()}
                          className="hover:bg-violet-100 focus:bg-violet-200 text-black"
                        >
                          {option.description}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                {errors[key as keyof typeof errors] && (
                  <p className="text-sm text-red-500">Este campo es obligatorio</p>
                )}
              </div>
            ))}

            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-medium text-violet-700">
                Descripción <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="Ingrese la descripción"
                value={formData.description}
                onChange={(e) => {
                  setFormData({ ...formData, description: e.target.value })
                  setErrors({ ...errors, description: false })
                }}
                className={errors.description ? "border-red-500" : "border-violet-200"}
                disabled={isLoading}
              />
              {errors.description && <p className="text-sm text-red-500">Este campo es obligatorio</p>}
            </div>
            <div className="flex gap-2">
              <Button type="submit" className="bg-orange-500 hover:bg-violet-900 text-white" disabled={isLoading}>
              {isLoading ? "Procesando..." : editingId ? "Actualizar Evento" : "Registrar Evento"}
              </Button>
              {editingId && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetForm}
                  className="text-violet-600 border-violet-600"
                  disabled={isLoading}
                >
                  Cancelar
                </Button>
              )}
            </div>
          </form>
        </Card>

        <Card className="p-6 shadow-lg border-t-4 border-orange-500">
          <h2 className="text-2xl font-semibold text-orange-900">Listado de Eventos</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tipo</TableHead>
                <TableHead>Factor</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Probabilidad</TableHead>
                <TableHead>Impacto</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {riskEntries.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell>{getRiskTypeDescription(entry.t_riesgo)}</TableCell>
                  <TableCell>{getRiskFactorDescription(entry.factor_id)}</TableCell>
                  <TableCell>{entry.description}</TableCell>
                  <TableCell>{getProbabilityDescription(entry.probabilidad)}</TableCell>
                  <TableCell>{getImpactDescription(entry.impacto)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(entry)}
                        className="text-violet-600 border-violet-600"
                        disabled={isLoading}
                      >
                        <Edit3 className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(entry.id)}
                        className="text-orange-600 border-orange-600"
                        disabled={isLoading}
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
  )
}