"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  Bell,
  ChevronDown,
  HelpCircle,
  LayoutDashboard,
  Menu,
  Settings,
  AlertCircle,
  FileText,
  List,
  BarChart2,
  FileBarChart,
  Info,
} from "lucide-react"
import { Button } from "@/components/UI/button"
import { cn } from "@/lib/utils"

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <div>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}

        {/* Main content area */}
        <main className="flex-1 overflow-auto bg-gray-50">
          <div className="container mx-auto p-6">
            {/* Page header */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Riesgos</h1>
              <p className="text-gray-600">Visualiza los riesgos creados y toma acción sobre ellos</p>
            </div>

            {/* Main content with illustration */}
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5">
              <div className="lg:col-span-3">
                <div className="mb-8">
                  <h2 className="mb-4 text-3xl font-bold text-gray-900">Identifica los riesgos de tu organización</h2>
                  <p className="mb-6 text-gray-600">
                    Registra los riesgos de tu compañía para estar alerta sobre los eventos que podrían ocurrir en la
                    empresa y su repercusión.
                  </p>

                  {/* Agent button */}
                  <div className="mb-6">
                    <Button className="rounded-full bg-[#4CAF50] hover:bg-[#45a049] text-white px-6 py-2 flex items-center gap-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#FF8A00]">
                        <svg viewBox="0 0 24 24" className="h-4 w-4 text-purple-900">
                          <circle cx="12" cy="12" r="10" fill="#FF8A00" />
                        </svg>
                      </div>
                      <span>Soy O-Risk, tu agente inteligente. ¡Creemos riesgos!</span>
                    </Button>
                  </div>

                  {/* Create risks button */}
                  <Button variant="outline" className="border-purple-900 text-purple-900 hover:bg-purple-100">
                    Quiero crear mis propios riesgos
                  </Button>
                </div>
              </div>

              <div className="lg:col-span-2">
                <div className="relative h-full w-full min-h-[300px]">
                  <div className="absolute right-0 top-0 h-full w-full">
                    <div className="relative h-full w-full">
                      <div className="absolute right-0 top-0 h-[400px] w-[400px] rounded-full bg-gray-100"></div>
                      <div className="absolute bottom-0 right-20 h-[300px]">
                        <Image
                          src="/placeholder.svg?height=400&width=300"
                          alt="Person analyzing risks"
                          width={300}
                          height={400}
                          className="object-contain"
                        />
                      </div>
                      <div className="absolute right-40 top-20 h-[200px] w-[200px] rounded-lg bg-white p-4 shadow-lg">
                        <div className="grid grid-cols-4 gap-2">
                          {[...Array(16)].map((_, i) => (
                            <div
                              key={i}
                              className={cn(
                                "h-8 w-8 rounded",
                                i % 5 === 0
                                  ? "bg-[#FF8A00]"
                                  : i % 4 === 0
                                    ? "bg-purple-900"
                                    : i % 3 === 0
                                      ? "bg-green-500"
                                      : i % 2 === 0
                                        ? "bg-yellow-400"
                                        : "bg-red-500",
                              )}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
        </div>
      </div>
    </div>
  )
}