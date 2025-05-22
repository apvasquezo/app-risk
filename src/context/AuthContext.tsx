"use client";

import { createContext, useContext } from "react";

// Define la estructura del usuario
export interface User {
  role: string;
}

// Define los tipos para el contexto
export interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  loading: boolean;
}

// Crea el contexto
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook personalizado para consumir el contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
};
