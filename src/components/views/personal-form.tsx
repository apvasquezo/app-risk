"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { UserPlus, Users, Pencil, Trash2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import api from "@/lib/axios"
import { transformEmployees } from "@/lib/transformers"

interface Employee {
  cedula: string
  name: string
  cargo: string
  area: string
  correo: string
  notifica: boolean
}

export default function Personal() {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    cedula: "",
    name: "",
    cargo: "",
    area: "",
    correo: "",
    notifica: false,
  })
  const [editingId, setEditingId] = useState<string | null>(null)
  const [errors, setErrors] = useState({
    cedula: false,
    name: false,
    correo: false,
  })
  const [employees, setEmployees] = useState<Employee[]>([])

  useEffect(() => {
    const fetchEmployes = async () => {
      try {
        const response = await api.get("/personal")
        console.log ("personal ", response.data)
        setEmployees(transformEmployees(response.data))
      } catch (error) {
        console.error(error)
        toast({
          variant: "destructive",
          title: "Error al cargar personal",
          description: "No se pudo obtener el listado de personal desde el servidor.",
        })
      }
    }
    fetchEmployes()
  }, [toast])

  const validateForm = () => {
    const newErrors = {
      cedula: !formData.cedula.trim(),
      name: !formData.name.trim(),
      correo: !formData.correo.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo),
    }
    setErrors(newErrors)
    return !Object.values(newErrors).some(Boolean)
  }

  const resetForm = () => {
    setFormData({
      cedula: "",
      name: "",
      cargo: "",
      area: "",
      correo: "",
      notifica: false,
    })
    setEditingId(null)
    setErrors({
      cedula: false,
      name: false,
      correo: false,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) {
      toast({
        variant: "destructive",
        title: "Error de validación",
        description: "Por favor complete todos los campos obligatorios correctamente.",
      })
      return;
    }
    try {
      if (editingId) {
        await api.put(`/personal/${editingId}`, {
          id_personal: formData.cedula,
          name: formData.name,
          position: formData.cargo,
          area: formData.area,
          email: formData.correo,
          notify: formData.notifica 
        })
        setEmployees(
          employees.map((emp) =>
            emp.cedula === editingId
              ? { ...formData, cedula: editingId } 
              : emp,
          ),
        )
        toast({
          title: "Empleado actualizado",
          description: "Los datos del empleado han sido actualizados exitosamente.",
        })
      } else {
        const response = await api.post("/personal", {
          id_personal: formData.cedula,
          name: formData.name,
          position: formData.cargo,
          area: formData.area,
          email: formData.correo,
          notify: formData.notifica 
        })
        if (employees.some((emp) => emp.cedula === formData.cedula)) {
          toast({
            variant: "destructive",
            title: "Empleado duplicado",
            description: "Ya existe un empleado con esa cédula.",
          })
          return
        }
        const newEmployee = {
          cedula: response.data.id_personal,
          name: response.data.name,
          cargo: response.data.position,
          area: response.data.area,
          correo: response.data.email,
          notifica: response.data.notify,
        }
        setEmployees([...employees, newEmployee])
        toast({
          title: "Empleado registrado",
          description: "El nuevo empleado ha sido registrado exitosamente.",
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

  const handleEdit = (employee: Employee) => {
    setFormData(employee)
    setEditingId(employee.cedula)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleDelete = async (cedula: string) => {
    const confirmDelete = window.confirm("¿Estás segura de que deseas eliminar este personal?");
    if (!confirmDelete) return;
    try {
      await api.delete(`/personal/${cedula}`)
      setEmployees(employees.filter((emp) => emp.cedula !== cedula))
      if (editingId === cedula) {
        resetForm()
      }
      toast({
        title: "Empleado eliminado",
        description: "El empleado ha sido eliminado exitosamente.",
      })
    } catch (error) {
      console.error(error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Ocurrió un error al eliminar el empleado.",
      })
    }
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center gap-4">
          <Users className="h-8 w-8 text-violet-600" />
          <h1 className="text-3xl font-bold text-violet-900">Gestión de Empleados</h1>
        </div>

        <Card className="p-6 shadow-lg border-t-4 border-violet-500">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-violet-700">
                  Cédula <span className="text-red-500">*</span>
                </label>
                <Input
                  required
                  type="number"
                  placeholder="Ingrese la cédula"
                  value={formData.cedula}
                  disabled={!!editingId}
                  onChange={(e) => {
                    setFormData({ ...formData, cedula: e.target.value })
                    setErrors({ ...errors, cedula: false })
                  }}
                  className={`border-violet-200 focus:ring-violet-500 ${
                    errors.cedula ? "border-red-500" : ""
                  } ${editingId ? "bg-gray-50 cursor-not-allowed text-gray-500 border-gray-300" : ""}`}
                />
                {errors.cedula && <p className="text-sm text-red-500">Este campo es obligatorio</p>}
                {editingId && (
                  <p className="text-sm text-gray-500 italic">La cédula no puede modificarse durante la edición</p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-violet-700">
                  Nombre <span className="text-red-500">*</span>
                </label>
                <Input
                  required
                  type="text"
                  placeholder="Ingrese el nombre"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value })
                    setErrors({ ...errors, name: false })
                  }}
                  className={`border-violet-200 focus:ring-violet-500 ${errors.name ? "border-red-500" : ""}`}
                />
                {errors.name && <p className="text-sm text-red-500">Este campo es obligatorio</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-violet-700">Cargo</label>
                <Input
                  type="text"
                  placeholder="Ingrese el cargo"
                  value={formData.cargo}
                  onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
                  className="border-violet-200 focus:ring-violet-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-violet-700">Área</label>
                <Input
                  placeholder="Ingrese el área"
                  type="text"
                  value={formData.area}
                  onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                  className="border-violet-200 focus:ring-violet-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-violet-700">
                  Correo <span className="text-red-500">*</span>
                </label>
                <Input
                  required
                  type="email"
                  placeholder="Ingrese el correo"
                  value={formData.correo}
                  onChange={(e) => {
                    setFormData({ ...formData, correo: e.target.value })
                    setErrors({ ...errors, correo: false })
                  }}
                  className={`border-violet-200 focus:ring-violet-500 ${errors.correo ? "border-red-500" : ""}`}
                />
                {errors.correo && (
                  <p className="text-sm text-red-500">
                    {!formData.correo.trim() ? "Este campo es obligatorio" : "Ingrese un correo válido"}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-violet-700">
                  Notificaciones
                </label>
                <div className="flex items-center space-x-2 pt-2">
                  <Checkbox
                    id="notifica"
                    checked={formData.notifica}
                    onCheckedChange={(checked) => {
                      setFormData({ ...formData, notifica: checked as boolean })
                    }}
                  />
                  <label htmlFor="notifica" className="text-sm text-violet-700 cursor-pointer">
                    Recibir notificaciones por correo
                  </label>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button type="submit" className="bg-orange-500 hover:bg-violet-900 text-white">
                {editingId ? (
                  <>
                    <Pencil className="w-4 h-4 mr-2" />
                    Actualizar Empleado
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Registrar Empleado
                  </>
                )}
              </Button>
              {editingId && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetForm}
                  className="border-violet-600 text-violet-600 hover:bg-violet-50"
                >
                  Cancelar
                </Button>
              )}
            </div>
          </form>
        </Card>

        <Card className="p-6 shadow-lg border-t-4 border-orange-500">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-orange-900 flex items-center gap-2">
              <Users className="h-6 w-6" />
              Listado de Empleados
            </h2>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="bg-violet-50 font-semibold text-violet-900">Cédula</TableHead>
                    <TableHead className="bg-violet-50 font-semibold text-violet-900">Nombre</TableHead>
                    <TableHead className="bg-violet-50 font-semibold text-violet-900">Cargo</TableHead>
                    <TableHead className="bg-violet-50 font-semibold text-violet-900">Área</TableHead>
                    <TableHead className="bg-violet-50 font-semibold text-violet-900">Correo</TableHead>
                    <TableHead className="bg-violet-50 font-semibold text-violet-900">Notificaciones</TableHead>
                    <TableHead className="bg-violet-50 font-semibold text-violet-900">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {employees.map((employee) => (
                    <TableRow
                      key={employee.cedula}
                      className={`border-b hover:bg-violet-50/50 transition-colors duration-200 ${
                        editingId === employee.cedula ? "bg-violet-50" : ""
                      }`}
                    >
                      <TableCell>{employee.cedula}</TableCell>
                      <TableCell>{employee.name}</TableCell>
                      <TableCell>{employee.cargo}</TableCell>
                      <TableCell>{employee.area}</TableCell>
                      <TableCell>{employee.correo}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            employee.notifica ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {employee.notifica ? "Activa" : "Desactivo"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-violet-600 border-violet-600 hover:bg-violet-50"
                            onClick={() => handleEdit(employee)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-orange-600 border-orange-600 hover:bg-orange-50"
                            onClick={() => handleDelete(employee.cedula)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
