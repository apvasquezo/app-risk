"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

// Definición de usuario (puedes ampliarlo si lo necesitas)
interface User {
  username: string;
  role: number;
  exp?: number; // Expiración del token (opcional)
}

// Tipo del contexto
interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  logout: () => void;
}

// Crear el contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Props para el proveedor
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);

  // Función para cerrar sesión (puedes reutilizarla desde un botón)
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setUser(null);
  };

  // Cargar usuario desde el token al iniciar
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));

        // Comprobar si el token expiró (opcional)
        const isExpired =
          payload.exp && Date.now() >= payload.exp * 1000;

        if (isExpired) {
          logout(); // Eliminar si está vencido
        } else {
          setUser({
            username: payload.sub,
            role: payload.role,
            exp: payload.exp,
          });
        }
      } catch (err) {
        console.error("Error decodificando token:", err);
        logout();
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para consumir el contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
};
