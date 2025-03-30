"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

export default function ProcesoForm() {
  const [descripcion, setDescripcion] = useState("");
  const [tipo, setTipo] = useState("");

  return (
    <div className="flex items-center justify-center h-[90vh] p-70">
      <div className="w-full max-w-lg bg-white p-6 rounded-lg shadow-lg shadow-violet-500">
        {/* Título */}
        <div className="mb-4">
          <h1 className="text-xl font-bold text-orange-500 text-center mb-4">PROCESO</h1>
          <p className="text-gray-600 text-sm text-justify">
            Un proceso es un conjunto de actividades planificadas que implican la participación de personas y recursos materiales coordinados para 
            conseguir un objetivo previamente identificado.
          </p>
        </div>

        {/* Campos del formulario */}
        <div className="space-y-4">
          {/* name del proceso */}
          <div className="space-y-1">
            <Label htmlFor="name">Nombre</Label>
            <Input 
              id="name" 
              placeholder="Escribe el name" 
              className="border-orange-500 focus:border-violet-700 focus:ring-2 focus:ring-violet-500"
            />
          </div>

          {/* Tipo - Dropdown */}
          <div className="space-y-1">
            <Label htmlFor="tipo">Tipo</Label>
            <Select onValueChange={setTipo} defaultValue="">
              <SelectTrigger 
                id="tipo" 
                className="w-full border-orange-500 focus:border-violet-700 focus:ring-2 focus:ring-violet-500"
              >
                <SelectValue placeholder="Seleccionar" />
              </SelectTrigger>
              <SelectContent className="z-50 bg-white border border-orange-500 shadow-lg rounded-md">
                <SelectItem value="misional">Misional</SelectItem>
                <SelectItem value="estrategico">Estratégico</SelectItem>
                <SelectItem value="apoyo">De Apoyo</SelectItem>
                <SelectItem value="otros">Otros</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Descripción */}
          <div className="space-y-1">
            <Label htmlFor="descripcion">Descripción</Label>
            <div className="relative">
              <Textarea
                id="descripcion"
                placeholder="Máx. 4000 caracteres."
                className="min-h-24 resize-none pr-16 border-orange-500 focus:border-violet-700 focus:ring-2 focus:ring-violet-500"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                maxLength={4000}
              />
              <div className="absolute bottom-1 right-2 text-xs text-gray-400">{descripcion.length}/4000</div>
            </div>
          </div>

          {/* Responsable */}
          <div className="space-y-1">
            <Label htmlFor="responsable">Responsable</Label>
            <Input 
              id="responsable" 
              placeholder="name del responsable" 
              className="border-orange-500 focus:border-violet-700 focus:ring-2 focus:ring-violet-500"
            />
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" size="sm">Cancelar</Button>
            <Button className="bg-orange-600 hover:bg-violet-800 text-white text-sm px-4">Crear</Button>
          </div>
        </div>
      </div>
    </div>
  );
}