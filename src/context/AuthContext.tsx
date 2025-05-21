"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Define la estructura del usuario
interface User {
  role: string;
}

// Define los tipos para el contexto
interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

// Crea el contexto con un valor predeterminado como `undefined`
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Define el tipo de las props del AuthProvider
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1])); // Decodifica el token
      setUser({ role: payload.role }); // Establece el usuario con el rol
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
};
