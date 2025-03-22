"use client";

import { useState } from "react";
import { UserPlus, Users, Pencil, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";

interface Employee {
  id: string;
  cedula: string;
  nombre: string;
  cargo: string;
  area: string;
  correo: string;
}

export default function Home() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    cedula: "",
    nombre: "",
    cargo: "",
    area: "",
    correo: "",
  });

  const [editingId, setEditingId] = useState<string | null>(null);

  const [errors, setErrors] = useState({
    cedula: false,
    nombre: false,
    correo: false,
  });

  // Temporary mock data - will be replaced with API data
  const [employees, setEmployees] = useState<Employee[]>([
    {
      id: "1",
      cedula: "123456789",
      nombre: "Juan Pérez",
      cargo: "Desarrollador",
      area: "TI",
      correo: "juan@example.com",
    },
    {
      id: "2",
      cedula: "987654321",
      nombre: "María González",
      cargo: "Diseñadora UX",
      area: "Diseño",
      correo: "maria@example.com",
    }
  ]);

  const validateForm = () => {
    const newErrors = {
      cedula: !formData.cedula.trim(),
      nombre: !formData.nombre.trim(),
      correo: !formData.correo.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo),
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };

  const resetForm = () => {
    setFormData({
      cedula: "",
      nombre: "",
      cargo: "",
      area: "",
      correo: "",
    });
    setEditingId(null);
    setErrors({
      cedula: false,
      nombre: false,
      correo: false,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        variant: "destructive",
        title: "Error de validación",
        description: "Por favor complete todos los campos obligatorios correctamente.",
      });
      return;
    }

    try {
      if (editingId) {
        // Update existing employee
        setEmployees(employees.map(emp => 
          emp.id === editingId 
            ? { ...formData, id: editingId }
            : emp
        ));
        toast({
          title: "Empleado actualizado",
          description: "Los datos del empleado han sido actualizados exitosamente.",
        });
      } else {
        // Add new employee
        const newEmployee = {
          ...formData,
          id: Date.now().toString(), // Temporary ID generation
        };
        setEmployees([...employees, newEmployee]);
        toast({
          title: "Empleado registrado",
          description: "El nuevo empleado ha sido registrado exitosamente.",
        });
      }
      resetForm();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Ocurrió un error al procesar la solicitud.",
      });
    }
  };

  const handleEdit = (employee: Employee) => {
    setFormData(employee);
    setEditingId(employee.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id: string) => {
    try {
      setEmployees(employees.filter(emp => emp.id !== id));
      if (editingId === id) {
        resetForm();
      }
      toast({
        title: "Empleado eliminado",
        description: "El empleado ha sido eliminado exitosamente.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Ocurrió un error al eliminar el empleado.",
      });
    }
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center gap-4">
          <Users className="h-8 w-8 text-violet-600" />
          <h1 className="text-3xl font-bold text-violet-900">
            Gestión de Empleados
          </h1>
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
                  placeholder="Ingrese la cédula"
                  value={formData.cedula}
                  onChange={(e) => {
                    setFormData({ ...formData, cedula: e.target.value });
                    setErrors({ ...errors, cedula: false });
                  }}
                  className={`border-violet-200 focus:ring-violet-500 ${
                    errors.cedula ? "border-red-500" : ""
                  }`}
                />
                {errors.cedula && (
                  <p className="text-sm text-red-500">Este campo es obligatorio</p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-violet-700">
                  Nombre <span className="text-red-500">*</span>
                </label>
                <Input
                  required
                  placeholder="Ingrese el nombre"
                  value={formData.nombre}
                  onChange={(e) => {
                    setFormData({ ...formData, nombre: e.target.value });
                    setErrors({ ...errors, nombre: false });
                  }}
                  className={`border-violet-200 focus:ring-violet-500 ${
                    errors.nombre ? "border-red-500" : ""
                  }`}
                />
                {errors.nombre && (
                  <p className="text-sm text-red-500">Este campo es obligatorio</p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-violet-700">
                  Cargo
                </label>
                <Input
                  placeholder="Ingrese el cargo"
                  value={formData.cargo}
                  onChange={(e) =>
                    setFormData({ ...formData, cargo: e.target.value })
                  }
                  className="border-violet-200 focus:ring-violet-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-violet-700">
                  Área
                </label>
                <Input
                  placeholder="Ingrese el área"
                  value={formData.area}
                  onChange={(e) =>
                    setFormData({ ...formData, area: e.target.value })
                  }
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
                    setFormData({ ...formData, correo: e.target.value });
                    setErrors({ ...errors, correo: false });
                  }}
                  className={`border-violet-200 focus:ring-violet-500 ${
                    errors.correo ? "border-red-500" : ""
                  }`}
                />
                {errors.correo && (
                  <p className="text-sm text-red-500">
                    {!formData.correo.trim()
                      ? "Este campo es obligatorio"
                      : "Ingrese un correo válido"}
                  </p>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                type="submit"
                className="bg-orange-500 hover:bg-violet-900 text-white"
              >
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
                    <TableHead className="bg-violet-50 font-semibold text-violet-900">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {employees.map((employee) => (
                    <TableRow 
                      key={employee.id}
                      className={`border-b hover:bg-violet-50/50 transition-colors duration-200 ${
                        editingId === employee.id ? "bg-violet-50" : ""
                      }`}
                    >
                      <TableCell>{employee.cedula}</TableCell>
                      <TableCell>{employee.nombre}</TableCell>
                      <TableCell>{employee.cargo}</TableCell>
                      <TableCell>{employee.area}</TableCell>
                      <TableCell>{employee.correo}</TableCell>
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
                            onClick={() => handleDelete(employee.id)}
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
  );
}