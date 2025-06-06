"use client"

import { useState } from "react"
import ControlSuggestionModal from "@/components/views/ControlSuggestionModal"

export default function SugerenciaControlesPage() {
  const [open, setOpen] = useState(true)
  const [loading, setLoading] = useState(false)

  return (
    <main className="p-4">
      <ControlSuggestionModal
        open={open}
        onClose={() => setOpen(false)}
        loading={loading}
        field1="Fraude interno"
        field2="Falta de segregación de funciones"
        field3="Proceso de pagos"
        field4="Canal digital"
        field5="Pérdida financiera"
      />      
    </main>
  )
}

