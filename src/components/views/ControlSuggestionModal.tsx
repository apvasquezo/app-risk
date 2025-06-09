"use client"
import { Fragment, useState } from 'react'
import { Dialog, Transition, Tab } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'

interface RiskControlModalProps {
  isOpen: boolean
  onClose: () => void
  riskData: {
    field1: string
    field2: string
    field3: string
    field4: string
    field5: string
  }
}

export default function RiskControlModal({ isOpen, onClose, riskData }: RiskControlModalProps) {
  const [controls, setControls] = useState<{
    preventivo: string
    detectivo: string
    correctivo: string
  } | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchControls = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await fetch('/api/risk_controls', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(riskData),
      })
      console.log("Lo que llega de riesgos ", riskData)
      if (!response.ok) {
        throw new Error('Error al obtener controles')
      }

      const data = await response.json()
      console.log("Controles recibidos:", data);
      setControls(data)
    } catch (err) {
      setError('Error al generar los controles')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = () => {
    if (!controls) return

    const content = `Controles Sugeridos:
      Preventivo: ${controls.preventivo}
      Detectivo: ${controls.detectivo}
      Correctivo: ${controls.correctivo}`

    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'controles-sugeridos.txt'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10 " onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-opacity-0 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0 ">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6 border-1 border-violet-900">
                <div className="absolute right-0 top-0 pr-4 pt-4">
                  <button
                    type="button"
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500"
                    onClick={onClose}
                  >
                    <span className="sr-only">Cerrar</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <Dialog.Title as="h3" className="text-lg font-semibold leading-6 text-gray-900">
                      Controles Sugeridos
                    </Dialog.Title>

                    {!controls && !loading && (
                      <button
                        onClick={fetchControls}
                        className="mt-4 w-full rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                      >
                        Generar Controles
                      </button>
                    )}

                    {loading && (
                      <div className="mt-4 text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                        <p className="mt-2 text-sm text-gray-500">Generando controles...</p>
                      </div>
                    )}

                    {error && (
                      <p className="mt-4 text-sm text-red-600">{error}</p>
                    )}

                    {controls && (
                      <>
                        <Tab.Group>
                          <Tab.List className="mt-4 flex space-x-1 rounded-xl bg-indigo-100 p-1">
                            <Tab
                              className={({ selected }) =>
                                `w-full rounded-lg py-2.5 text-sm font-medium leading-5
                                ${selected
                                  ? 'bg-white text-indigo-700 shadow'
                                  : 'text-indigo-500 hover:bg-white/[0.12] hover:text-indigo-600'
                                }`
                              }
                            >
                              Preventivo
                            </Tab>
                            <Tab
                              className={({ selected }) =>
                                `w-full rounded-lg py-2.5 text-sm font-medium leading-5
                                ${selected
                                  ? 'bg-white text-indigo-700 shadow'
                                  : 'text-indigo-500 hover:bg-white/[0.12] hover:text-indigo-600'
                                }`
                              }
                            >
                              Detectivo
                            </Tab>
                            <Tab
                              className={({ selected }) =>
                                `w-full rounded-lg py-2.5 text-sm font-medium leading-5
                                ${selected
                                  ? 'bg-white text-indigo-700 shadow'
                                  : 'text-indigo-500 hover:bg-white/[0.12] hover:text-indigo-600'
                                }`
                              }
                            >
                              Correctivo
                            </Tab>
                          </Tab.List>
                          <Tab.Panels className="mt-4">
                            <Tab.Panel className="rounded-xl bg-white p-3">
                              <p className="text-gray-700">{controls.preventivo}</p>
                            </Tab.Panel>
                            <Tab.Panel className="rounded-xl bg-white p-3">
                              <p className="text-gray-700">{controls.detectivo}</p>
                            </Tab.Panel>
                            <Tab.Panel className="rounded-xl bg-white p-3">
                              <p className="text-gray-700">{controls.correctivo}</p>
                            </Tab.Panel>
                          </Tab.Panels>
                        </Tab.Group>

                        <button
                          onClick={handleDownload}
                          className="mt-4 w-full rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                        >
                          Descargar Controles
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}