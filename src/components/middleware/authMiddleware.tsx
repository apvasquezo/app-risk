"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

interface MiddlewareProps {
  children: React.ReactNode;
  rolesAllowed: string[];
}

const AuthMiddleware = ({ children, rolesAllowed }: MiddlewareProps) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user || !rolesAllowed.includes(user.role)) {
        router.replace("/"); // Redirige si no está autorizado
      }
    }
  }, [user, loading, rolesAllowed, router]);

  if (loading || !user || !rolesAllowed.includes(user.role)) {
    return <div>Cargando...</div>;
  }

  return <>{children}</>;
};

export default AuthMiddleware;