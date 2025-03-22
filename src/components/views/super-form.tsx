"use client";

import { FaArrowRight } from "react-icons/fa";

export default function Administrador() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-10">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-6">Administrador</h1>
      <p className="text-center text-gray-700 text-lg leading-relaxed max-w-3xl mb-6">
        Antes de usar la aplicación, <strong>configure los siguientes procesos</strong> para garantizar su correcto funcionamiento en la gestión de riesgos operativos.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
        {[
          "Asigne roles y permisos a los usuarios para controlar el acceso a las funcionalidades del sistema.",
          "Registre al personal y vincúlelo con áreas y responsabilidades específicas.",
          "Parametrize los servicios y productos para asociarlos con riesgos y controles.",
          "Defina los canales de comunicación críticos para la identificación de riesgos.",
          "Establezca macroprocesos organizacionales y asócielos con riesgos en la matriz.",
          "Configure las categorías de riesgo para una mejor clasificación de eventos.",
          "Identifique los factores de riesgo que pueden influir en los eventos.",
          "Defina criterios de probabilidad e impacto para evaluar los riesgos.",
          "Configure los tipos de control disponibles en el sistema."
        ].map((item, index) => (
          <div key={index} className="flex items-start space-x-2 bg-gray-100 p-4 rounded-lg shadow-sm">
            <FaArrowRight className="text-orange-500 mt-1 text-3xl" />
            <p className="text-gray-700 text-lg">{item}</p>
          </div>
        ))}
      </div>
      
      <p className="text-center text-gray-800 text-lg leading-relaxed mt-6 max-w-3xl">
        ✅ Estas configuraciones iniciales aseguran que el sistema funcione alineado con las necesidades de la organización. <span className="text-purple-700 font-bold">¡Valídelas antes de su uso!</span>
      </p>
    </div>
  );
}