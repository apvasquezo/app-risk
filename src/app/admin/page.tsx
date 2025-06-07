"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RedirectToDashboard() {
  const router = useRouter();

  useEffect(() => {
    router.push("/admin/dashboard");
  }, [router]);

  return <p>Redirigiendo al dashboard...</p>;
}