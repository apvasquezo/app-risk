"use client";

import { cn } from "@/lib/utils";
import {
  AlertCircle,
  FileText,
  AlertTriangle,
  Square,
  Shapes,
  Users,
  User,
  Rss,
  Bell,
  Shield,
  ChartBarIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import UserMenu from "@/components/views/usermenu";
import AuthMiddleware from "@/components/middleware/authMiddleware"; // 👈 Protección agregada

const sidebarItems = [
  { title: "Usuarios", icon: User, href: "/super/users" },
  { title: "Personal", icon: Users, href: "/super/personal" },
  { title: "Servicios y/o Productos", icon: Shapes, href: "/super/services" },
  { title: "Canales", icon: Rss, href: "/super/channels" },
  { title: "MacroProcesos", icon: Square, href: "/super/macroprocess" },
  { title: "Categoria de Riesgos", icon: Shield, href: "/super/riskcategory" },
  { title: "Tipo de Riesgos", icon: AlertTriangle, href: "/super/typerisk" },
  { title: "Factores de Riesgo", icon: FileText, href: "/super/riskfactor" },
  { title: "Probabilidad e Impacto", icon: ChartBarIcon, href: "/super/probability" },
  { title: "Tipo de Control", icon: AlertCircle, href: "/super/typecontrol" },
];

export default function SuperLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <AuthMiddleware rolesAllowed={["super"]}>
      <div className="min-h-screen">
        {/* Top Navigation */}
        <nav className="bg-white border-b border-gray-200 fixed w-full z-30 top-0">
          <div className="px-20 h-16 flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Image
                src="/logo_orisk.png"
                alt="O-Risk Logo"
                width={125}
                height={75}
                className="h-auto w-full"
                priority
              />
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <Bell className="h-5 w-5 text-gray-600" />
              </button>
              <UserMenu />
            </div>
          </div>
        </nav>

        {/* Sidebar */}
        <aside className="fixed left-0 top-10 w-73 h-[calc(110vh-4rem)] bg-purple-900 border-r border-gray-200">
          <div className="p-2">
            <div className="mt-5 space-y-1">
              {sidebarItems.map((item) => (
                <Link
                  key={item.title}
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-3 px-3 py-3 rounded-lg text-lg font-medium transition-colors",
                    pathname === item.href
                      ? "bg-orange-500 text-white"
                      : "text-gray-200 hover:bg-orange-500"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.title}</span>
                </Link>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="pt-16 pl-64">
          <div className="p-6">{children}</div>
        </main>
      </div>
    </AuthMiddleware>
  );
}
