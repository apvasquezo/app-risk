"use client"

import type React from "react"

import { useState } from "react"
import { Edit3, Trash2, Lightbulb, Save, X } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Label } from "@/components/ui/label"
import { ExportButtons } from "@/components/ui/export-buttons"
import ControlSuggestionModal from "@/components/views/ControlSuggestionModal"
import { cn } from "@/lib/utils"

interface EventEntry {
  [key: string]: unknown
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
  causa1?: string
  causa2?: string
  consecuencia1?: string
  consecuencia2?: string
}

// Definir el tipo para los datos del riesgo
interface RiskData {
  field1: string // Tipo de Riesgo
  field2: string // Factor de Riesgo  
  field3: string // Proceso
  field4: string // Canal
  field5: string // Evento
}

const predefinedEstados = ["Controlado", "En Proceso", "Pendiente"]
const procesos = ["Ventas", "Operaciones", "Finanzas", "Recursos Humanos", "Tecnología", "Legal"]
const canales = ["Presencial", "Digital", "Telefónico", "Correo", "Otro"]
const ciudades = ["Bogotá", "Medellín", "Cali", "Barranquilla", "Cartagena", "Otra"]
const causas = [
  "Falta de capacitación",
  "Error humano",
  "Falla de sistema",
  "Proceso inadecuado",
  "Falta de supervisión",
  "Comunicación deficiente",
  "Recursos insuficientes",
  "Otra",
]
const consecuencias = [
  "Pérdida financiera",
  "Daño reputacional",
  "Incumplimiento regulatorio",
  "Interrupción operativa",
  "Pérdida de clientes",
  "Riesgo legal",
  "Impacto ambiental",
  "Otra",
]
const servicios = ["Crédito", "Ahorro", "Inversión", "Seguros", "Tarjetas", "Transferencias", "Consultoría", "Otro"]

export default function EventRisk() {
  const { toast } = useToast()
  const [formData, setFormData] = useState<EventEntry>({
    id: "",
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
    causa1: "",
    causa2: "",
    consecuencia1: "",
    consecuencia2: "",
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
  const [showSuggestionModal, setShowSuggestionModal] = useState(false)
  const [isLoadingModal, setIsLoadingModal] = useState(false)
  const [eventEntries, setEventEntries] = useState<EventEntry[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [riskData, setRiskData] = useState<RiskData>({
    field1: "", // Tipo de Riesgo
    field2: "", // Factor de Riesgo  
    field3: "", // Proceso
    field4: "", // Canal
    field5: ""  // Evento
  })
  // Al abrir el modal con datos
  const openSuggestionsModal = (data: RiskData) => {
    setRiskData(data)
    setShowSuggestionModal(true) // Activar el flag
    setModalOpen(true)
  }

  // Función para cerrar el modal
  const closeSuggestionsModal = () => {
    setModalOpen(false)
    setShowSuggestionModal(false) // Desactivar el flag
    setRiskData({
      field1: "",
      field2: "",
      field3: "",
      field4: "",
      field5: ""
    })
  }

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
      id: "",
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
      causa1: "",
      causa2: "",
      consecuencia1: "",
      consecuencia2: "",
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

  const handleSuggestControl = () => {
    setIsLoadingModal(true)
    setShowSuggestionModal(true)
    // Simulate loading for the modal
    setTimeout(() => {
      setIsLoadingModal(false)
    }, 1000)
  }

  const handleCancel = () => {
    resetForm()
    toast({
      title: "Operación cancelada",
      description: "Se ha cancelado la edición del registro.",
    })
  }

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gray-50">
      <div className="max-w-6xl mx-auto space-y-8">
        <h1 className="text-2xl md:text-3xl font-bold text-violet-900">Registro de Riesgos</h1>

        <Card className="p-4 md:p-6 shadow-lg border-t-4 border-violet-500">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {/* Columna 1 */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="eventId" className="text-sm font-medium text-violet-700">
                  Id (Código del evento) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="eventId"
                  value={formData.eventId}
                  onChange={(e) => setFormData({ ...formData, eventId: e.target.value })}
                  placeholder="Ingrese el código"
                  className={cn(errors.eventId ? "border-red-500" : "border-violet-200")}
                />
                {errors.eventId && <p className="text-xs text-red-500">Este campo es obligatorio</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="descripcion" className="text-sm font-medium text-violet-700">
                  Descripción <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="descripcion"
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  placeholder="Descripción detallada del evento"
                  className={cn("min-h-24", errors.descripcion ? "border-red-500" : "border-violet-200")}
                />
                {errors.descripcion && <p className="text-xs text-red-500">Este campo es obligatorio</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="fechaInicio" className="text-sm font-medium text-violet-700">
                  Fecha inicio <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="fechaInicio"
                  type="date"
                  value={formData.fechaInicio}
                  onChange={(e) => setFormData({ ...formData, fechaInicio: e.target.value })}
                  className={cn(errors.fechaInicio ? "border-red-500" : "border-violet-200")}
                />
                {errors.fechaInicio && <p className="text-xs text-red-500">Este campo es obligatorio</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="fechaFinal" className="text-sm font-medium text-violet-700">
                  Fecha Final <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="fechaFinal"
                  type="date"
                  value={formData.fechaFinal}
                  onChange={(e) => setFormData({ ...formData, fechaFinal: e.target.value })}
                  className={cn(errors.fechaFinal ? "border-red-500" : "border-violet-200")}
                />
                {errors.fechaFinal && <p className="text-xs text-red-500">Este campo es obligatorio</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="fechaDescubrimiento" className="text-sm font-medium text-violet-700">
                  Fecha descubrimiento <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="fechaDescubrimiento"
                  type="date"
                  value={formData.fechaDescubrimiento}
                  onChange={(e) => setFormData({ ...formData, fechaDescubrimiento: e.target.value })}
                  className={cn(errors.fechaDescubrimiento ? "border-red-500" : "border-violet-200")}
                />
                {errors.fechaDescubrimiento && <p className="text-xs text-red-500">Este campo es obligatorio</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="fechaContabilizacion" className="text-sm font-medium text-violet-700">
                  Fecha contabilización <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="fechaContabilizacion"
                  type="date"
                  value={formData.fechaContabilizacion}
                  onChange={(e) => setFormData({ ...formData, fechaContabilizacion: e.target.value })}
                  className={cn(errors.fechaContabilizacion ? "border-red-500" : "border-violet-200")}
                />
                {errors.fechaContabilizacion && <p className="text-xs text-red-500">Este campo es obligatorio</p>}
              </div>
            </div>

            {/* Columna 2 */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="proceso" className="text-sm font-medium text-violet-700">
                  Proceso <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.proceso}
                  onValueChange={(value) => setFormData({ ...formData, proceso: value })}
                >
                  <SelectTrigger className={cn(errors.proceso ? "border-red-500" : "border-violet-200")}>
                    <SelectValue placeholder="Seleccione un proceso" />
                  </SelectTrigger>
                  <SelectContent>
                    {procesos.map((proceso) => (
                      <SelectItem key={proceso} value={proceso}>
                        {proceso}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.proceso && <p className="text-xs text-red-500">Este campo es obligatorio</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="canal" className="text-sm font-medium text-violet-700">
                  Canal
                </Label>
                <Select value={formData.canal} onValueChange={(value) => setFormData({ ...formData, canal: value })}>
                  <SelectTrigger className="border-violet-200">
                    <SelectValue placeholder="Seleccione un canal" />
                  </SelectTrigger>
                  <SelectContent>
                    {canales.map((canal) => (
                      <SelectItem key={canal} value={canal}>
                        {canal}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ciudad" className="text-sm font-medium text-violet-700">
                  Ciudad
                </Label>
                <Select value={formData.ciudad} onValueChange={(value) => setFormData({ ...formData, ciudad: value })}>
                  <SelectTrigger className="border-violet-200">
                    <SelectValue placeholder="Seleccione una ciudad" />
                  </SelectTrigger>
                  <SelectContent>
                    {ciudades.map((ciudad) => (
                      <SelectItem key={ciudad} value={ciudad}>
                        {ciudad}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="responsable" className="text-sm font-medium text-violet-700">
                  Responsable <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="responsable"
                  value={formData.responsable}
                  onChange={(e) => setFormData({ ...formData, responsable: e.target.value })}
                  placeholder="Nombre del responsable"
                  className={cn(errors.responsable ? "border-red-500" : "border-violet-200")}
                />
                {errors.responsable && <p className="text-xs text-red-500">Este campo es obligatorio</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="estado" className="text-sm font-medium text-violet-700">
                  Estado <span className="text-red-500">*</span>
                </Label>
                <Select value={formData.estado} onValueChange={(value) => setFormData({ ...formData, estado: value })}>
                  <SelectTrigger className={cn(errors.estado ? "border-red-500" : "border-violet-200")}>
                    <SelectValue placeholder="Seleccione un estado" />
                  </SelectTrigger>
                  <SelectContent>
                    {predefinedEstados.map((estado) => (
                      <SelectItem key={estado} value={estado}>
                        {estado}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.estado && <p className="text-xs text-red-500">Este campo es obligatorio</p>}
              </div>
            </div>

            {/* Columna 3 */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cuantia" className="text-sm font-medium text-violet-700">
                  Cuantía <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="cuantia"
                  type="number"
                  value={formData.cuantia}
                  onChange={(e) => setFormData({ ...formData, cuantia: e.target.value })}
                  placeholder="Valor en COP"
                  className={cn(errors.cuantia ? "border-red-500" : "border-violet-200")}
                />
                {errors.cuantia && <p className="text-xs text-red-500">Este campo es obligatorio</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="cuantiaRecuperada" className="text-sm font-medium text-violet-700">
                  Cuantía Recuperada
                </Label>
                <Input
                  id="cuantiaRecuperada"
                  type="number"
                  value={formData.cuantiaRecuperada}
                  onChange={(e) => setFormData({ ...formData, cuantiaRecuperada: e.target.value })}
                  placeholder="Valor en COP"
                  className="border-violet-200"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cuantiaRecuperadaSeguros" className="text-sm font-medium text-violet-700">
                  Cuantía recuperada por seguros
                </Label>
                <Input
                  id="cuantiaRecuperadaSeguros"
                  type="number"
                  value={formData.cuantiaRecuperadaSeguros}
                  onChange={(e) => setFormData({ ...formData, cuantiaRecuperadaSeguros: e.target.value })}
                  placeholder="Valor en COP"
                  className="border-violet-200"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="factorRiesgo" className="text-sm font-medium text-violet-700">
                  Factor de riesgo <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="factorRiesgo"
                  value={formData.factorRiesgo}
                  onChange={(e) => setFormData({ ...formData, factorRiesgo: e.target.value })}
                  placeholder="Ingrese el factor de riesgo"
                  className={cn(errors.factorRiesgo ? "border-red-500" : "border-violet-200")}
                />
                {errors.factorRiesgo && <p className="text-xs text-red-500">Este campo es obligatorio</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="cuentaContable" className="text-sm font-medium text-violet-700">
                  Cuenta Contable
                </Label>
                <Input
                  id="cuentaContable"
                  value={formData.cuentaContable}
                  onChange={(e) => setFormData({ ...formData, cuentaContable: e.target.value })}
                  placeholder="Número de cuenta"
                  className="border-violet-200"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="productoServicio" className="text-sm font-medium text-violet-700">
                  Servicio
                </Label>
                <Select
                  value={formData.productoServicio}
                  onValueChange={(value) => setFormData({ ...formData, productoServicio: value })}
                >
                  <SelectTrigger className="border-violet-200">
                    <SelectValue placeholder="Seleccione un servicio" />
                  </SelectTrigger>
                  <SelectContent>
                    {servicios.map((servicio) => (
                      <SelectItem key={servicio} value={servicio}>
                        {servicio}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Sección de Causas y Consecuencias */}
            <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div className="space-y-4">
                <Label className="text-sm font-medium text-violet-700">Causas del evento</Label>
                <div className="space-y-2">
                  <Select
                    value={formData.causa1 || ""}
                    onValueChange={(value) => setFormData({ ...formData, causa1: value })}
                  >
                    <SelectTrigger className="border-violet-200">
                      <SelectValue placeholder="Seleccione causa 1" />
                    </SelectTrigger>
                    <SelectContent>
                      {causas.map((causa) => (
                        <SelectItem key={causa} value={causa}>
                          {causa}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select
                    value={formData.causa2 || ""}
                    onValueChange={(value) => setFormData({ ...formData, causa2: value })}
                  >
                    <SelectTrigger className="border-violet-200">
                      <SelectValue placeholder="Seleccione causa 2" />
                    </SelectTrigger>
                    <SelectContent>
                      {causas.map((causa) => (
                        <SelectItem key={causa} value={causa}>
                          {causa}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-4">
                <Label className="text-sm font-medium text-violet-700">Consecuencias del evento</Label>
                <div className="space-y-2">
                  <Select
                    value={formData.consecuencia1 || ""}
                    onValueChange={(value) => setFormData({ ...formData, consecuencia1: value })}
                  >
                    <SelectTrigger className="border-violet-200">
                      <SelectValue placeholder="Seleccione consecuencia 1" />
                    </SelectTrigger>
                    <SelectContent>
                      {consecuencias.map((consecuencia) => (
                        <SelectItem key={consecuencia} value={consecuencia}>
                          {consecuencia}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select
                    value={formData.consecuencia2 || ""}
                    onValueChange={(value) => setFormData({ ...formData, consecuencia2: value })}
                  >
                    <SelectTrigger className="border-violet-200">
                      <SelectValue placeholder="Seleccione consecuencia 2" />
                    </SelectTrigger>
                    <SelectContent>
                      {consecuencias.map((consecuencia) => (
                        <SelectItem key={consecuencia} value={consecuencia}>
                          {consecuencia}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Botones */}
            <div className="md:col-span-3 flex flex-wrap gap-2">
              <Button type="submit" className="bg-orange-500 hover:bg-violet-900 text-white flex items-center gap-1">
                <Save className="w-4 h-4" />
                {editingId ? "Actualizar Riesgo" : "Registrar Riesgo"}
              </Button>

              {editingId && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  className="border-orange-500 text-orange-500 hover:bg-orange-50 flex items-center gap-1"
                >
                  <X className="w-4 h-4" />
                  Cancelar
                </Button>
              )}

              <Button
                type="button"
                variant="outline"
                onClick={() => openSuggestionsModal({
                  field1: "Valor del campo 1",
                  field2: "Valor del campo 2",
                  field3: "Valor del campo 3",
                  field4: "Valor del campo 4",
                  field5: "Valor del campo 5"
                })}
                className="bg-violet-900 border-violet-500 text-white hover:bg-orange-500 flex items-center gap-1 ml-auto"
              >
                <Lightbulb className="w-4 h-4" />
                Sugerir Control
              </Button>
            </div>
          </form>
        </Card>

        <Card className="p-4 md:p-6 shadow-lg border-t-4 border-orange-500">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-2">
            <h2 className="text-xl md:text-2xl font-semibold text-orange-900">Listado de Riesgos</h2>
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
                {eventEntries.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-4 text-gray-500">
                      No hay registros disponibles
                    </TableCell>
                  </TableRow>
                ) : (
                  eventEntries.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell>{entry.eventId}</TableCell>
                      <TableCell>{new Date(entry.fechaInicio).toLocaleDateString("es-CO")}</TableCell>
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
                            className="text-violet-600 border-violet-600 h-8 w-8 p-0"
                          >
                            <Edit3 className="w-4 h-4" />
                            <span className="sr-only">Editar</span>
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(entry.id)}
                            className="text-orange-600 border-orange-600 h-8 w-8 p-0"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span className="sr-only">Eliminar</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </Card>

        {showSuggestionModal && (
        <ControlSuggestionModal
          open={modalOpen}
          onClose={closeSuggestionsModal} // Usar la función de cierre personalizada
          loading={false}
          field1={riskData.field1}
          field2={riskData.field2}
          field3={riskData.field3}
          field4={riskData.field4}
          field5={riskData.field5}
        />
        )}
      </div>
    </div>
  )
}
