"use client";

import { cn } from "@/lib/utils";
import { 
  AlertCircle, 
  BarChart2, 
  FileText, 
  AlertTriangle, 
  List, 
  Settings, 
  HelpCircle,
  FileBarChart,
  Bell
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const sidebarItems = [
  {
    title: "Dashboard",
    icon: BarChart2,
    href: "/admin"
  },
  {
    title: "Procesos",
    icon: List,
    href: "/admin/process"
  },
  {
    title: "Riesgos",
    icon: AlertTriangle,
    href: "/admin/risk"
  },
  {
    title: "Causas y Consecuencias",
    icon: AlertTriangle,
    href: "/admin/cause"
  },
  {
    title: "Controles",
    icon: AlertTriangle,
    href: "/admin/control"
  },
  {
    title: "Eventos",
    icon: AlertCircle ,
    href: "/admin/event"
  },
  {
    title: "Planes de Acción",
    icon: FileBarChart,
    href: "/admin/plans"
  },
  {
    title: "Reportes",
    icon: FileText,
    href: "/admin/reports"
  }
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
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
              <HelpCircle className="h-5 w-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <Bell className="h-5 w-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <Settings className="h-5 w-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <Avatar>
                <AvatarImage src="/user.gif" />
              </Avatar> 
            </button>           
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <aside className="fixed left-0 top-16 w-73 h-[calc(100vh-4rem)] bg-purple-900 border-r border-gray-200">
        <div className="mt-6 p-2">
          <div className="space-y-1">
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
  );
}