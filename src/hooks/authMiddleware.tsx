"use client";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

interface MiddlewareProps {
  children: React.ReactNode;
  rolesAllowed: string[]; // Roles permitidos para acceder
}

const AuthMiddleware = ({ children, rolesAllowed }: MiddlewareProps) => {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user || !rolesAllowed.includes(user.role)) {
      // Redirige a la página principal si el usuario no tiene acceso
      router.push("/");
    }
  }, [user, rolesAllowed, router]);

  // Muestra el contenido solo si el usuario está autenticado y tiene el rol permitido
  if (!user || !rolesAllowed.includes(user.role)) {
    return null; // Puedes mostrar un loader o mensaje de espera aquí
  }

  return <>{children}</>;
};

export default AuthMiddleware;
