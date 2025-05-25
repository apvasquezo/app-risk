"use client"

import type React from "react"

import { useState } from "react"
import { Edit3, Trash2, Lightbulb } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Label } from "@/components/ui/label"
import { ExportButtons } from "@/components/ui/export-buttons"

interface EventEntry {
  id: string
  eventId: string
  fechaInicio: string
  fechaFinal: string
  fechaDescubrimiento: string
  fechaContabilizacion: string
  cuantia: string
  cuantiaRecuperada: string
  cuantiaRecuperadaSeguros: string
  factorRiesgo: string
  cuentaContable: string
  productoServicio: string
  proceso: string
  descripcion: string
  canal: string
  ciudad: string
  responsable: string
  estado: string
}

const predefinedFactorRiesgo = [
  "Fraude Interno",
  "Fraude Externo",
  "Relaciones Laborales",
  "Clientes",
  "Daños a Activos",
  "Fallas Tecnológicas",
  "Ejecución de Procesos",
]
const predefinedProcesos = ["Operativo", "Administrativo", "Financiero", "Comercial", "Tecnológico"]
const predefinedCanales = ["Oficina", "Internet", "Móvil", "Cajero", "Corresponsal", "Call Center"]
const predefinedEstados = ["Controlado", "En Proceso", "Pendiente"]

export default function EventManagement() {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    eventId: "",
    fechaInicio: "",
    fechaFinal: "",
    fechaDescubrimiento: "",
    fechaContabilizacion: "",
    cuantia: "",
    cuantiaRecuperada: "",
    cuantiaRecuperadaSeguros: "",
    factorRiesgo: "",
    cuentaContable: "",
    productoServicio: "",
    proceso: "",
    descripcion: "",
    canal: "",
    ciudad: "",
    responsable: "",
    estado: "",
  })

  const [editingId, setEditingId] = useState<string | null>(null)
  const [errors, setErrors] = useState({
    eventId: false,
    fechaInicio: false,
    fechaFinal: false,
    fechaDescubrimiento: false,
    fechaContabilizacion: false,
    cuantia: false,
    factorRiesgo: false,
    descripcion: false,
    proceso: false,
    responsable: false,
    estado: false,
  })

  const [eventEntries, setEventEntries] = useState<EventEntry[]>([
    {
      id: "1",
      eventId: "EV-001",
      fechaInicio: "2023-04-15T10:30",
      fechaFinal: "2023-04-15T14:45",
      fechaDescubrimiento: "2023-04-16T08:20",
      fechaContabilizacion: "2023-04-20T11:00",
      cuantia: "1500000",
      cuantiaRecuperada: "500000",
      cuantiaRecuperadaSeguros: "750000",
      factorRiesgo: "Fraude Externo",
      cuentaContable: "61950505",
      productoServicio: "Cuenta de Ahorros",
      proceso: "Operativo",
      descripcion: "Suplantación de identidad para retiro de fondos",
      canal: "Oficina",
      ciudad: "Bogotá",
      responsable: "Juan Pérez",
      estado: "Controlado",
    },
    {
      id: "2",
      eventId: "EV-002",
      fechaInicio: "2023-05-10T09:15",
      fechaFinal: "2023-05-10T11:30",
      fechaDescubrimiento: "2023-05-10T16:00",
      fechaContabilizacion: "2023-05-15T10:00",
      cuantia: "800000",
      cuantiaRecuperada: "0",
      cuantiaRecuperadaSeguros: "650000",
      factorRiesgo: "Fallas Tecnológicas",
      cuentaContable: "61950510",
      productoServicio: "Banca Virtual",
      proceso: "Tecnológico",
      descripcion: "Caída del sistema durante transacciones",
      canal: "Internet",
      ciudad: "Medellín",
      responsable: "Ana Gómez",
      estado: "En Proceso",
    },
  ])

  const validateForm = () => {
    const newErrors = {
      eventId: !formData.eventId.trim(),
      fechaInicio: !formData.fechaInicio.trim(),
      fechaFinal: !formData.fechaFinal.trim(),
      fechaDescubrimiento: !formData.fechaDescubrimiento.trim(),
      fechaContabilizacion: !formData.fechaContabilizacion.trim(),
      cuantia: !formData.cuantia.trim(),
      factorRiesgo: !formData.factorRiesgo.trim(),
      descripcion: !formData.descripcion.trim(),
      proceso: !formData.proceso.trim(),
      responsable: !formData.responsable.trim(),
      estado: !formData.estado.trim(),
    }
    setErrors(newErrors)
    return Object.values(newErrors).every((error) => !error)
  }

  const resetForm = () => {
    setFormData({
      eventId: "",
      fechaInicio: "",
      fechaFinal: "",
      fechaDescubrimiento: "",
      fechaContabilizacion: "",
      cuantia: "",
      cuantiaRecuperada: "",
      cuantiaRecuperadaSeguros: "",
      factorRiesgo: "",
      cuentaContable: "",
      productoServicio: "",
      proceso: "",
      descripcion: "",
      canal: "",
      ciudad: "",
      responsable: "",
      estado: "",
    })
    setEditingId(null)
    setErrors({
      eventId: false,
      fechaInicio: false,
      fechaFinal: false,
      fechaDescubrimiento: false,
      fechaContabilizacion: false,
      cuantia: false,
      factorRiesgo: false,
      descripcion: false,
      proceso: false,
      responsable: false,
      estado: false,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) {
      toast({
        variant: "destructive",
        title: "Error de validación",
        description: "Todos los campos obligatorios deben ser completados.",
      })
      return
    }

    if (editingId) {
      setEventEntries(eventEntries.map((entry) => (entry.id === editingId ? { ...formData, id: editingId } : entry)))
      toast({
        title: "Evento actualizado",
        description: "El registro del evento ha sido actualizado exitosamente.",
      })
    } else {
      const newEntry = { ...formData, id: Date.now().toString() }
      setEventEntries([...eventEntries, newEntry])
      toast({
        title: "Evento agregado",
        description: "El nuevo evento ha sido registrado exitosamente.",
      })
    }
    resetForm()
  }

  const handleEdit = (entry: EventEntry) => {
    setFormData(entry)
    setEditingId(entry.id)
  }

  const handleDelete = (id: string) => {
    setEventEntries(eventEntries.filter((entry) => entry.id !== id))
    toast({
      title: "Evento eliminado",
      description: "El registro ha sido eliminado exitosamente.",
    })
    if (editingId === id) resetForm()
  }

  const formatCurrency = (value: string) => {
    if (!value) return ""
    return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP" }).format(Number(value))
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-violet-900">Registro de Riesgos</h1>

        <Card className="p-6 shadow-lg border-t-4 border-violet-500">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Primera columna */}
            <div className="space-y-6">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-violet-700">
                  Id (Código del evento) <span className="text-red-500">*</span>
                </Label>
                <Input
                  placeholder="Ingrese el código"
                  value={formData.eventId}
                  onChange={(e) => {
                    setFormData({ ...formData, eventId: e.target.value })
                    setErrors({ ...errors, eventId: false })
                  }}
                  className={errors.eventId ? "border-red-500" : "border-violet-200"}
                />
                {errors.eventId && <p className="text-sm text-red-500">Este campo es obligatorio</p>}
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-violet-700">
                  Fecha inicio <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="datetime-local"
                  value={formData.fechaInicio}
                  onChange={(e) => {
                    setFormData({ ...formData, fechaInicio: e.target.value })
                    setErrors({ ...errors, fechaInicio: false })
                  }}
                  className={errors.fechaInicio ? "border-red-500" : "border-violet-200"}
                />
                {errors.fechaInicio && <p className="text-sm text-red-500">Este campo es obligatorio</p>}
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-violet-700">
                  Fecha Final <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="datetime-local"
                  value={formData.fechaFinal}
                  onChange={(e) => {
                    setFormData({ ...formData, fechaFinal: e.target.value })
                    setErrors({ ...errors, fechaFinal: false })
                  }}
                  className={errors.fechaFinal ? "border-red-500" : "border-violet-200"}
                />
                {errors.fechaFinal && <p className="text-sm text-red-500">Este campo es obligatorio</p>}
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-violet-700">
                  Fecha descubrimiento <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="datetime-local"
                  value={formData.fechaDescubrimiento}
                  onChange={(e) => {
                    setFormData({ ...formData, fechaDescubrimiento: e.target.value })
                    setErrors({ ...errors, fechaDescubrimiento: false })
                  }}
                  className={errors.fechaDescubrimiento ? "border-red-500" : "border-violet-200"}
                />
                {errors.fechaDescubrimiento && <p className="text-sm text-red-500">Este campo es obligatorio</p>}
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-violet-700">
                  Fecha contabilización <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="datetime-local"
                  value={formData.fechaContabilizacion}
                  onChange={(e) => {
                    setFormData({ ...formData, fechaContabilizacion: e.target.value })
                    setErrors({ ...errors, fechaContabilizacion: false })
                  }}
                  className={errors.fechaContabilizacion ? "border-red-500" : "border-violet-200"}
                />
                {errors.fechaContabilizacion && <p className="text-sm text-red-500">Este campo es obligatorio</p>}
              </div>
            </div>

            {/* Segunda columna */}
            <div className="space-y-6">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-violet-700">
                  Cuantía <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="number"
                  placeholder="Valor de la pérdida"
                  value={formData.cuantia}
                  onChange={(e) => {
                    setFormData({ ...formData, cuantia: e.target.value })
                    setErrors({ ...errors, cuantia: false })
                  }}
                  className={errors.cuantia ? "border-red-500" : "border-violet-200"}
                />
                {errors.cuantia && <p className="text-sm text-red-500">Este campo es obligatorio</p>}
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-violet-700">Cuantía Recuperada</Label>
                <Input
                  type="number"
                  placeholder="Valor recuperado"
                  value={formData.cuantiaRecuperada}
                  onChange={(e) => {
                    setFormData({ ...formData, cuantiaRecuperada: e.target.value })
                  }}
                  className="border-violet-200"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-violet-700">Cuantía recuperada por seguros</Label>
                <Input
                  type="number"
                  placeholder="Valor recuperado por seguros"
                  value={formData.cuantiaRecuperadaSeguros}
                  onChange={(e) => {
                    setFormData({ ...formData, cuantiaRecuperadaSeguros: e.target.value })
                  }}
                  className="border-violet-200"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-violet-700">
                  Factor de riesgo <span className="text-red-500">*</span>
                </Label>
                <Select
                  onValueChange={(value) => {
                    setFormData({ ...formData, factorRiesgo: value })
                    setErrors({ ...errors, factorRiesgo: false })
                  }}
                  value={formData.factorRiesgo}
                >
                  <SelectTrigger
                    className={`p-2 bg-white text-black rounded-md border ${
                      errors.factorRiesgo ? "border-red-500" : "border-violet-200"
                    }`}
                  >
                    <SelectValue placeholder="Seleccione un factor de riesgo" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-300 shadow-md rounded-lg">
                    {predefinedFactorRiesgo.map((option) => (
                      <SelectItem
                        key={option}
                        value={option}
                        className="hover:bg-violet-100 focus:bg-violet-200 text-black"
                      >
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.factorRiesgo && <p className="text-sm text-red-500">Este campo es obligatorio</p>}
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-violet-700">Cuenta Contable afectada</Label>
                <Input
                  placeholder="Cuenta contable"
                  value={formData.cuentaContable}
                  onChange={(e) => {
                    setFormData({ ...formData, cuentaContable: e.target.value })
                  }}
                  className="border-violet-200"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-violet-700">Producto/servicio afectado</Label>
                <Input
                  placeholder="Producto o servicio"
                  value={formData.productoServicio}
                  onChange={(e) => {
                    setFormData({ ...formData, productoServicio: e.target.value })
                  }}
                  className="border-violet-200"
                />
              </div>
            </div>

            {/* Tercera columna */}
            <div className="space-y-6">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-violet-700">
                  Proceso <span className="text-red-500">*</span>
                </Label>
                <Select
                  onValueChange={(value) => {
                    setFormData({ ...formData, proceso: value })
                    setErrors({ ...errors, proceso: false })
                  }}
                  value={formData.proceso}
                >
                  <SelectTrigger
                    className={`p-2 bg-white text-black rounded-md border ${
                      errors.proceso ? "border-red-500" : "border-violet-200"
                    }`}
                  >
                    <SelectValue placeholder="Seleccione un proceso" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-300 shadow-md rounded-lg">
                    {predefinedProcesos.map((option) => (
                      <SelectItem
                        key={option}
                        value={option}
                        className="hover:bg-violet-100 focus:bg-violet-200 text-black"
                      >
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.proceso && <p className="text-sm text-red-500">Este campo es obligatorio</p>}
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-violet-700">Canal</Label>
                <Select
                  onValueChange={(value) => {
                    setFormData({ ...formData, canal: value })
                  }}
                  value={formData.canal}
                >
                  <SelectTrigger className="p-2 bg-white text-black rounded-md border border-violet-200">
                    <SelectValue placeholder="Seleccione un canal" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-300 shadow-md rounded-lg">
                    {predefinedCanales.map((option) => (
                      <SelectItem
                        key={option}
                        value={option}
                        className="hover:bg-violet-100 focus:bg-violet-200 text-black"
                      >
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-violet-700">Ciudad</Label>
                <Input
                  placeholder="Ciudad o zona geográfica"
                  value={formData.ciudad}
                  onChange={(e) => {
                    setFormData({ ...formData, ciudad: e.target.value })
                  }}
                  className="border-violet-200"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-violet-700">
                  Responsable <span className="text-red-500">*</span>
                </Label>
                <Input
                  placeholder="Persona responsable"
                  value={formData.responsable}
                  onChange={(e) => {
                    setFormData({ ...formData, responsable: e.target.value })
                    setErrors({ ...errors, responsable: false })
                  }}
                  className={errors.responsable ? "border-red-500" : "border-violet-200"}
                />
                {errors.responsable && <p className="text-sm text-red-500">Este campo es obligatorio</p>}
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-violet-700">
                  Estado <span className="text-red-500">*</span>
                </Label>
                <Select
                  onValueChange={(value) => {
                    setFormData({ ...formData, estado: value })
                    setErrors({ ...errors, estado: false })
                  }}
                  value={formData.estado}
                >
                  <SelectTrigger
                    className={`p-2 bg-white text-black rounded-md border ${
                      errors.estado ? "border-red-500" : "border-violet-200"
                    }`}
                  >
                    <SelectValue placeholder="Seleccione un estado" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-300 shadow-md rounded-lg">
                    {predefinedEstados.map((option) => (
                      <SelectItem
                        key={option}
                        value={option}
                        className="hover:bg-violet-100 focus:bg-violet-200 text-black"
                      >
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.estado && <p className="text-sm text-red-500">Este campo es obligatorio</p>}
              </div>
            </div>

            {/* Descripción - Ocupa todo el ancho */}
            <div className="md:col-span-3 space-y-2">
              <Label className="text-sm font-medium text-violet-700">
                Descripción <span className="text-red-500">*</span>
              </Label>
              <Textarea
                placeholder="Descripción detallada del evento"
                value={formData.descripcion}
                onChange={(e) => {
                  setFormData({ ...formData, descripcion: e.target.value })
                  setErrors({ ...errors, descripcion: false })
                }}
                className={`min-h-24 ${errors.descripcion ? "border-red-500" : "border-violet-200"}`}
              />
              {errors.descripcion && <p className="text-sm text-red-500">Este campo es obligatorio</p>}
            </div>

            {/* Botones de acción */}
            <div className="md:col-span-3 flex gap-2">
              <Button type="submit" className="bg-orange-500 hover:bg-violet-900 text-white">
                {editingId ? "Actualizar Riesgo" : "Registrar Riesgo"}
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
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsLoadingModal(true)
                  setShowSuggestionModal(true)
                  setTimeout(() => setIsLoadingModal(false), 1500)
                }}
                className="ml-auto text-emerald-600 border-emerald-600 hover:bg-emerald-50"
              >
                <Lightbulb className="w-4 h-4 mr-2" />
                Sugerir Control
              </Button>
            </div>
          </form>
        </Card>

        <Card className="p-6 shadow-lg border-t-4 border-orange-500">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-orange-900">Listado de Riesgos</h2>
            <ExportButtons data={eventEntries} fileName="listado-riesgos" />
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Fecha Inicio</TableHead>
                  <TableHead>Cuantía</TableHead>
                  <TableHead>Factor de Riesgo</TableHead>
                  <TableHead>Proceso</TableHead>
                  <TableHead>Responsable</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {eventEntries.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell>{entry.eventId}</TableCell>
                    <TableCell>{new Date(entry.fechaInicio).toLocaleString("es-CO")}</TableCell>
                    <TableCell>{formatCurrency(entry.cuantia)}</TableCell>
                    <TableCell>{entry.factorRiesgo}</TableCell>
                    <TableCell>{entry.proceso}</TableCell>
                    <TableCell>{entry.responsable}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          entry.estado === "Controlado"
                            ? "bg-green-100 text-green-800"
                            : entry.estado === "En Proceso"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        {entry.estado}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(entry)}
                          className="text-violet-600 border-violet-600"
                        >
                          <Edit3 className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(entry.id)}
                          className="text-orange-600 border-orange-600"
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
