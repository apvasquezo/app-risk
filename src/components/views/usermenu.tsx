"use client";

import { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation"; 

export default function UserMenu() {
  const [open, setOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const router = useRouter(); 

  const handleToggle = () => setOpen(!open);
  const handleProfile = () => {
    console.log("Ir al perfil");
    router.push("/profile");
  };
  const handleLogout = () => {
    setShowModal(true);
  };

  const confirmLogout = () => {
    console.log("Cerrar sesión");
    setShowModal(false);
    router.push("/"); 
  };

  const cancelLogout = () => {
    setShowModal(false);
  };

  return (
    <div className="relative inline-block text-left">
      <div onClick={handleToggle} className="cursor-pointer text-yellow-500 text-3xl">
        <FaUserCircle />
      </div>

      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-orange-100 border border-orange-300 rounded-md shadow-md z-50 backdrop-blur-sm">
          <button
            onClick={handleProfile}
            className="block w-full text-left px-4 py-2 text-sm text-purple-700 hover:bg-gray-100"
          >
            Perfil
          </button>
          <button
            onClick={handleLogout}
            className="block w-full text-left px-4 py-2 text-sm text-purple-700 hover:bg-gray-100"
          >
            Cerrar sesión
          </button>
        </div>
      )}

      {/* Modal de confirmación de cierre de sesión */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 ">
          <div className="bg-white p-6 rounded-lg border border-violet-900 shadow-lg max-w-sm w-full">
            <h2 className="text-xl font-semibold text-center text-violet-900">
              ¿Estás seguro de que deseas cerrar sesión?
            </h2>
            <div className="flex justify-between mt-4 gap-2">
              <Button
                onClick={cancelLogout}
                className="bg-orange-500 text-white hover:bg-violet-900 w-1/2"
              >
                Cancelar
              </Button>
              <Button
                onClick={confirmLogout}
                className="bg-violet-900 text-white hover:bg-orange-500 w-1/2"
              >
                Confirmar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}