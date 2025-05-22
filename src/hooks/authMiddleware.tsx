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
        router.push("/");
      }
    }
  }, [user, rolesAllowed, router, loading]);

  if (loading) return <div>Cargando...</div>;

  if (!user || !rolesAllowed.includes(user.role)) return null;

  return <>{children}</>;
};

export default AuthMiddleware;
