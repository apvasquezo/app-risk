"use client"

import type React from "react"

import { useEffect, useState, useCallback } from "react"
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
import RiskControlModal from "@/components/views/ControlSuggestionModal"
import { cn } from "@/lib/utils"
import {
  transformProces,
  transformChannels,
  transformConsequences,
  transformCauses,
  transformEvent,
  transformEventLog,
  transformService,
  transformEmployees
} from "@/lib/transformers"
import api from "@/lib/axios"

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
  causa1: string
  causa2: string
  consecuencia1: string
  consecuencia2: string
}

interface RiskEntry {
  id: string
  t_riesgo: string
  factor_id: string
  description: string
  probabilidad: string
  impacto: string
}

interface Cause {
  id: number;
  description: string;
}

interface Consequence {
  id: number;
  description: string;
}

interface Channel {
  id: string;
  name: string;
}

interface Process {
  id: string
  macroprocess_id: string
  macro: string // nombre macroproceso
  description: string
  personal_id: string
}
interface Service {
  id: string
  name: string
}

interface Employee {
  cedula: string
  name: string
  cargo: string
  area: string
  correo: string
  notifica: boolean
}

const predefinedEstados = ["Controlado", "En Proceso", "Pendiente"]

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
    productoServicio: false,
    proceso: false,
    canal:false,
    responsable: false,
    estado: false,
    causa1: false,
    consecuencia1: false,
  })
  const [procesList, setProcesList] = useState<Process[]>([])
  const [channelLis, setChannelList] = useState<Channel[]>([]);
  const [causeList, setCauseList] = useState<Cause[]>([]);
  const [consequenceList, setConsequenceList] = useState<Consequence[]>([]); 
  const [riskEntries, setRiskEntries] = useState<RiskEntry[]>([])
  const [serviceList, setServiceList] = useState<Service[]>([]);
  const [personalList, setPersonalList] = useState<Employee[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const riskData = {
    field1: "Operativo",
    field2: "Procesos",
    field3: "Ventas",
    field4: "Online",
    field5: "Pérdida de datos"
  }
  const [eventEntries, setEventEntries] = useState<EventEntry[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const getProcesDescription = (id_proces: string) => {
    const proces = procesList.find((type) => type.id === id_proces)
    return proces ? proces.description : id_proces
  }

  const getChanelDescription = (id_chanel: string) => {
    const chanel = channelLis.find((type) => type.id === id_chanel)
    return chanel ? chanel.name : id_chanel
  }

  const getCauseDescription = (id_cause: string) => {
    const cause = causeList.find((type) => type.id.toString() === id_cause)
    return cause ? cause.description : id_cause
  }

  const getConseDescription = (id_conse: string) => {
    const conse = consequenceList.find((type) => type.id.toString() === id_conse)
    return conse ? conse.description : id_conse
  }

  const getEventDescription = (id_event: string) => {
    const event = riskEntries.find((type) => type.id === id_event)
    return event ? event.description : id_event
  }

  const getServiceDescription = (id_service: string) => {
    const service = serviceList.find((type) => type.id.toString() === id_service)
    return service ? service.name : id_service
  }

  useEffect(() => {
    const fetchEventLog = async () =>{
      setIsLoading(true)
      try {
        const responseEvent = await api.get("/events")
        setRiskEntries(transformEvent(responseEvent.data))
        const responseCause = await api.get("/causes");
        setCauseList(transformCauses(responseCause.data));
        const responseConse = await api.get("/consequences"); 
        setConsequenceList(transformConsequences(responseConse.data));
        const responseChanel = await api.get("/channels" );
        setChannelList(transformChannels(responseChanel.data));
        const responseProces = await api.get("/processes");
        setProcesList(transformProces(responseProces.data));
        const responseService = await api.get("/products");
        setServiceList(transformService(responseService.data))
        const responsePersonal = await api.get("/personal/notify")
        setPersonalList(transformEmployees(responsePersonal.data))
        const response = await api.get("/event_logs")
        setEventEntries(transformEventLog(response.data))
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
    fetchEventLog()
  }, [toast])

  const validateForm = useCallback(() => {
    const newErrors = {
      eventId: !formData.eventId.trim(),
      fechaInicio: !formData.fechaInicio.trim(),
      fechaFinal: !formData.fechaFinal.trim(),
      fechaDescubrimiento: !formData.fechaDescubrimiento.trim(),
      fechaContabilizacion: !formData.fechaContabilizacion.trim(),
      cuantia: !formData.cuantia.trim(),
      factorRiesgo: !formData.factorRiesgo.trim(),
      descripcion: !formData.descripcion.trim(),
      productoServicio: !formData.productoServicio.trim(),
      proceso: !formData.proceso.trim(),
      canal:!formData.canal.trim(),
      responsable: !formData.responsable.trim(),
      estado: !formData.estado.trim(),
      causa1: !formData.causa1.trim(),
      consecuencia1: !formData.consecuencia1.trim(),
    }
    setErrors(newErrors)
    return Object.values(newErrors).every((error) => !error)
  }, [formData])

  const resetForm = useCallback( () => {
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
      productoServicio: false,
      proceso: false,
      canal:false,
      responsable: false,
      estado: false,
      causa1: false,
      consecuencia1: false,
    })
  }, [])

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      toast({
        variant: "destructive",
        title: "Error de validación",
        description: "Todos los campos obligatorios deben ser completados.",
      })
      return
    }
    setIsLoading(true)
    try {
      const payload = {
        event_id: parseInt(formData.eventId, 10),
        description: formData.descripcion,
        start_date: formData.fechaFinal,
        end_date: formData.fechaFinal,
        discovery_date: formData.fechaDescubrimiento,
        accounting_date: formData.fechaContabilizacion,
        amount: parseFloat(formData.cuantia) || 0, // Asegura que sea un número flotante
        recovered_amount: parseFloat(formData.cuantiaRecuperada) || 0,
        insurance_recovery: parseFloat(formData.cuantiaRecuperadaSeguros) || 0,
        acount: parseInt(formData.cuentaContable, 10) || 0, 
        product_id: parseInt(formData.productoServicio, 10),
        process_id: parseInt(formData.proceso, 10),
        channel_id: parseInt(formData.canal, 10),
        city: formData.ciudad, 
        responsible_id: formData.responsable,
        status: formData.estado,
        cause1_id: parseInt(formData.causa1, 10),
        cause2_id: parseInt(formData.causa2, 10) || null,
        conse1_id: parseInt(formData.consecuencia1, 10),
        conse2_id: parseInt(formData.consecuencia2, 10) || null, 
      };
      
      if (editingId) {
        await api.put(`/event_logs/${editingId}`, payload)
        setEventEntries(eventEntries.map((entry) => (entry.id === editingId ? { ...formData, id: editingId } : entry)))
        toast({
          title: "Evento actualizado",
          description: "El registro del evento ha sido actualizado exitosamente.",
        })
      } else {
        const responseEventlog = await api.post ("/event_logs", payload)

        personalList.forEach(async (persona) => {
          const payloadEmail = {
            email_send: persona.correo,
            description: formData.descripcion,
            personal:formData.responsable,
          }
          await api.post("/email", payloadEmail)
        })
        
        const newEntry = {
          id: responseEventlog.data.id_eventlog,
          eventId: getEventDescription(responseEventlog.data.event_id),
          fechaInicio: responseEventlog.data.start_date,
          fechaFinal: responseEventlog.data.end_date,
          fechaDescubrimiento: responseEventlog.data.discovery_date,
          fechaContabilizacion: responseEventlog.data.account_date,
          cuantia: responseEventlog.data.amount,
          cuantiaRecuperada: responseEventlog.data.recovered_amount,
          cuantiaRecuperadaSeguros: responseEventlog.data.insurance_recovery,
          factorRiesgo: formData.factorRiesgo,
          cuentaContable: responseEventlog.data.acount,
          productoServicio: getServiceDescription(responseEventlog.data.product_id),
          proceso: getProcesDescription(responseEventlog.data.process_id),
          descripcion: responseEventlog.data.description,
          canal: getChanelDescription(responseEventlog.data.chanel_id),
          ciudad: responseEventlog.data.city,
          responsable: responseEventlog.data.responsible_id,
          estado: responseEventlog.data.status,
          causa1: getCauseDescription(responseEventlog.data.cause1_id),
          causa2: getCauseDescription(responseEventlog.data.cause2_id),
          consecuencia1: getConseDescription(responseEventlog.data.conse1_id),
          consecuencia2: getConseDescription(responseEventlog.data.conse2_id),          
        }
        setEventEntries([...eventEntries, newEntry])

        toast({
          title: "Riesgo agregado",
          description: "El nuevo Riesgo ha sido registrado exitosamente.",
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

  const handleEdit = useCallback((entry: EventEntry) => {
    setFormData(entry)
    setEditingId(entry.id)
  }, [])

  const handleDelete = useCallback(
    async(id: string) => {
      const confirmDelete = window.confirm("¿Estás segura de que deseas eliminar este evento?")
      if (!confirmDelete) return

      setIsLoading(true)  
      try {
        await api.delete(`/event_logs/${id}`)      
        setEventEntries(eventEntries.filter((entry) => entry.id !== id))
        if (editingId === id) {
          resetForm()
        }        
        toast({
          title: "Riesgo eliminado",
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
    }, [editingId, resetForm, toast],
  )

  const formatCurrency = (value: string) => {
    if (!value) return ""
    return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP" }).format(Number(value))
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
                <Label htmlFor="riskEntry" className="text-sm font-medium text-violet-700">
                  Riesgo <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.eventId}
                  onValueChange={(value) => setFormData({ ...formData, eventId: value })}
                >
                  <SelectTrigger className={cn(errors.eventId ? "border-red-500" : "border-violet-200")}>
                    <SelectValue placeholder="Seleccione un riesgo" />
                  </SelectTrigger>
                  <SelectContent className="bg-white shadow-md border border-gray-200 rounded-md">
                    {riskEntries.map((risk) => (
                      <SelectItem 
                        key={risk.id} 
                        value={risk.id} 
                        className="hover:bg-violet-100 focus:bg-violet-200 text-black"
                      >
                        {risk.description}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                  <SelectContent className="bg-white shadow-md border border-gray-200 rounded-md">
                    {procesList.map((proceso) => (
                      <SelectItem key={proceso.id} value={proceso.id} 
                      className="hover:bg-violet-100 focus:bg-violet-200 text-black">
                        {proceso.description}
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
                  <SelectContent className="bg-white shadow-md border border-gray-200 rounded-md">
                    {channelLis.map((canal) => (
                      <SelectItem key={canal.id} value={canal.id}
                      className="hover:bg-violet-100 focus:bg-violet-200 text-black">
                        {canal.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ciudad" className="text-sm font-medium text-violet-700">
                  Ciudad
                </Label>
                <input
                  type="text"
                  id="ciudad"
                  name="ciudad"
                  className="w-full border border-violet-200 rounded-md p-2 text-sm"
                  placeholder="Ingrese una ciudad"
                  value={formData.ciudad}
                  onChange={(e) => setFormData({ ...formData, ciudad: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="responsable" className="text-sm font-medium text-violet-700">
                  Responsable <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="responsable"
                  value={formData.responsable}
                  onChange={(e) => setFormData({ ...formData, responsable: e.target.value })}
                  placeholder="ID del responsable"
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
                  <SelectContent className="bg-white shadow-md border border-gray-200 rounded-md">
                    {predefinedEstados.map((estado) => (
                      <SelectItem key={estado} value={estado}
                      className="hover:bg-violet-100 focus:bg-violet-200 text-black">
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
                  <SelectContent className="bg-white shadow-md border border-gray-200 rounded-md">
                    {serviceList.map((servicio) => (
                      <SelectItem key={servicio.id} value={servicio.id.toString()}
                      className="hover:bg-violet-100 focus:bg-violet-200 text-black">
                        {servicio.name}
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
                    <SelectContent className="bg-white shadow-md border border-gray-200 rounded-md">
                      {causeList.map((causa) => (
                        <SelectItem key={causa.id} value={causa.id.toString()}
                        className="hover:bg-violet-100 focus:bg-violet-200 text-black">
                          {causa.description}
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
                    <SelectContent className="bg-white shadow-md border border-gray-200 rounded-md">
                      {causeList.map((causa) => (
                        <SelectItem key={causa.id} value={causa.id.toString()}
                        className="hover:bg-violet-100 focus:bg-violet-200 text-black">
                          {causa.description}
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
                    <SelectContent className="bg-white shadow-md border border-gray-200 rounded-md">
                      {consequenceList.map((consecuencia) => (
                        <SelectItem key={consecuencia.id} value={consecuencia.id.toString()}
                        className="hover:bg-violet-100 focus:bg-violet-200 text-black">
                          {consecuencia.description}
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
                    <SelectContent className="bg-white shadow-md border border-gray-200 rounded-md">
                      {consequenceList.map((consecuencia) => (
                        <SelectItem key={consecuencia.id} value={consecuencia.id.toString()}
                        className="hover:bg-violet-100 focus:bg-violet-200 text-black">
                          {consecuencia.description}
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
                onClick={() => setIsModalOpen(true)}
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
        <RiskControlModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        riskData={riskData}
        />
      </div>
    </div>
  )
}
