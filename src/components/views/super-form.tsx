"use client";

import { FaArrowRight } from "react-icons/fa";

export default function Administrador() {
  return (
    <div className="min-h-screen bg-white px-130">
      {/* Contenedor principal para el contenido */}
      <div className="absolute top-40 left-10 right-0 mx-auto max-w-3xl text-center">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-10">Supervisor</h1>
        <p className="text-gray-700 text-2xl leading-relaxed text-justify px-20">
          La parametrización adecuada es crucial para garantizar la funcionalidad óptima de la aplicación y permitir que los usuarios realicen sus tareas de manera eficiente. Sin estos datos configurados, los usuarios se encuentran con limitaciones que afectan negativamente su experiencia y productividad.
        </p>
      </div>
      <img
        src="/configuration.png"
        alt="Configuración"
        className="absolute bottom-10 right-10 opacity-50 w-40 h-40"
      />
    </div>
  );
}