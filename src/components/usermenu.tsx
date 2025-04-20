import { useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';

export default function UserMenu() {
  const [open, setOpen] = useState(false);

  const handleToggle = () => setOpen(!open);
  const handleProfile = () => {
    // Redireccionar a la página de perfil
    console.log("Ir al perfil");
  };
  const handleLogout = () => {
    // Aquí agregas tu lógica de logout
    console.log("Cerrar sesión");
  };

  return (
    <div className="relative inline-block text-left">
      <div onClick={handleToggle} className="cursor-pointer text-yellow-500 text-3xl">
        <FaUserCircle />
      </div>

      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-orange-100 border border-orange-300 rounded-md shadow-md z-50absolute right-0 mt-2 w-40 border border-orange-300 rounded-md shadow-md z-50 bg-transparent backdrop-blur-sm">
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
    </div>
  );
}
