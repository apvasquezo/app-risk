"use client";

import Image from "next/image";

export default function Administrador() {
  return (
    <div className="min-h-screen bg-white px-6 md:px-20 lg:px-32">
      {/* Texto centrado */}
      <div className="absolute top-40 left-10 right-0 mx-auto max-w-3xl text-center">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-10">Supervisor</h1>
        <p className="text-gray-700 text-2xl leading-relaxed text-justify px-4 md:px-20">
          La parametrización adecuada es crucial para garantizar la funcionalidad óptima de la aplicación y permitir que los usuarios realicen sus tareas de manera eficiente. Sin estos datos configurados, los usuarios se encuentran con limitaciones que afectan negativamente su experiencia y productividad.
        </p>
      </div>

      {/* Imagen responsive en esquina inferior derecha */}
      <div className="relative"> {/* contexto relativo para posicionamiento */}
        <div className="absolute bottom-10 right-10 w-32 sm:w-40 md:w-52 lg:w-60 aspect-square opacity-50">
          <Image
            src="/configuration.png"
            alt="Configuración"
            fill
            className="object-contain"
            sizes="(max-width: 640px) 8rem, (max-width: 768px) 10rem, (max-width: 1024px) 13rem, 15rem"
          />
        </div>
      </div>
    </div>
  );
}
