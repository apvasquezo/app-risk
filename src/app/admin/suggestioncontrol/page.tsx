
"use client"

import { useState, useEffect } from "react"
import ControlSuggestionModal from "@/components/views/ControlSuggestionModal"

export default function SugerenciaControlesPage() {
  const [open, setOpen] = useState(true)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false)
    }, 1500)

    return () => clearTimeout(timeout)
  }, [])

  return (
    <ControlSuggestionModal
      open={open}
      onClose={() => setOpen(false)}
      loading={loading}
    />
  )
}
