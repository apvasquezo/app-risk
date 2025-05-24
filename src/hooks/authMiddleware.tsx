"use client";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

interface MiddlewareProps {
  children: React.ReactNode;
  rolesAllowed: number[]; // Roles permitidos como números
}

const AuthMiddleware = ({ children, rolesAllowed }: MiddlewareProps) => {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/");
      return;
    }

    if (!rolesAllowed.includes(user.role)) {
      router.push("/");
    }
  }, [user, rolesAllowed, router]);

  if (!user || !rolesAllowed.includes(user.role)) {
    return null; // Loader opcional
  }

  return <>{children}</>;
};

export default AuthMiddleware;
