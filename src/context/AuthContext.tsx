"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

// Define la estructura del usuario
interface User {
  role: string;
}

// Define los tipos para el contexto
interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  loading: boolean;
}

// Crea el contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Define el tipo de las props del AuthProvider
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1])); // Decodifica el payload
        if (payload && payload.role) {
          setUser({ role: payload.role });
        }
      } catch (error) {
        console.error("Error al decodificar el token:", error);
        setUser(null); // En caso de error, se borra el usuario
      }
    }
    setLoading(false); // Ya sea con o sin token, se termina de cargar
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para consumir el contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
};

