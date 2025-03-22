"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Edit, Trash2 } from "lucide-react"

// Definir el tipo de usuario
type User = {
  id: number
  username: string
  password: string
  role: string
}

export default function UserManagement() {
  // Estado para el formulario
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("")
  const [editingId, setEditingId] = useState<number | null>(null)

  // Estado para la lista de usuarios
  const [users, setUsers] = useState<User[]>([
    { id: 1, username: "admin", password: "******", role: "Administrador" },
    { id: 2, username: "usuario1", password: "******", role: "Editor" },
    { id: 3, username: "usuario2", password: "******", role: "Visualizador" },
  ])

  // Función para guardar usuario
  const handleSave = () => {
    if (!username || !password || !role) return

    if (editingId) {
      // Actualizar usuario existente
      setUsers(users.map((user) => (user.id === editingId ? { ...user, username, password, role } : user)))
      setEditingId(null)
    } else {
      // Crear nuevo usuario
      const newUser: User = {
        id: users.length ? Math.max(...users.map((u) => u.id)) + 1 : 1,
        username,
        password,
        role,
      }
      setUsers([...users, newUser])
    }

    // Limpiar formulario
    setUsername("")
    setPassword("")
    setRole("")
  }

  // Función para editar usuario
  const handleEdit = (user: User) => {
    setUsername(user.username)
    setPassword(user.password)
    setRole(user.role)
    setEditingId(user.id)
  }

  // Función para eliminar usuario
  const handleDelete = (id: number) => {
    setUsers(users.filter((user) => user.id !== id))
  }

  return (
    <div className="container mx-auto py-20 px-10">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Formulario de usuario */}
        <Card
        className="w-full max-w-lg bg-white p-6 rounded-lg shadow-lg shadow-violet-500 border-none"
        >
          <CardHeader>
            <CardTitle>Gestión de Usuarios</CardTitle>
            <CardDescription>{editingId ? "Editar usuario existente" : "Agregar nuevo usuario"}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="username">Usuario</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Ingrese nombre de usuario"
                  className="border-orange-500 focus:border-violet-700 focus:ring-2 focus:ring-violet-500"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Ingrese contraseña"
                  className="border-orange-500 focus:border-violet-700 focus:ring-2 focus:ring-violet-500"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="role">Rol</Label>
                <Select value={role} onValueChange={setRole}>
                  <SelectTrigger id="role"
                  className="w-full border-orange-500 focus:border-violet-700 focus:ring-2 focus:ring-violet-500"
                  >
                    <SelectValue placeholder="Seleccione un rol" />
                  </SelectTrigger>
                  <SelectContent className="z-50 bg-white border border-orange-500 shadow-lg rounded-md">
                    <SelectItem value="Administrador">Administrador</SelectItem>
                    <SelectItem value="Editor">Editor</SelectItem>
                    <SelectItem value="Visualizador">Visualizador</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={handleSave} size="sm" className="bg-orange-600 hover:bg-violet-800 text-white text-sm px-4">
                {editingId ? "Actualizar" : "Crear"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Lista de usuarios */}
        <Card
        className="w-full max-w-lg bg-white p-6 rounded-lg shadow-lg shadow-violet-500 border-none"
        >
          <CardHeader>
            <CardTitle>Listado de Usuarios</CardTitle>
            <CardDescription>Usuarios registrados en el sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-8 w-8 text-purple-900 border-purple-900 hover:bg-violet-100"
                          onClick={() => handleEdit(user)}
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Editar</span>
                        </Button>
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-8 w-8 text-orange-500 border-orange-500 hover:bg-orange-100"
                          onClick={() => handleDelete(user.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Eliminar</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}