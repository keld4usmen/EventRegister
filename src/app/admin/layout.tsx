"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  QrCode,
  Armchair,
  MessageSquare,
  Award,
  Shield,
  LogOut,
  Menu,
} from "lucide-react";
import { useState } from "react";

const navigation = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Registrations", href: "/admin/attendees", icon: Users },
  { name: "Check-in", href: "/admin/check-in", icon: QrCode },
  { name: "Seating", href: "/admin/seating", icon: Armchair },
  { name: "Communications", href: "/admin/communications", icon: MessageSquare },
  { name: "Badges & Certs", href: "/admin/certificates", icon: Award },
  { name: "Users & Volunteers", href: "/admin/users", icon: Shield },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (status === "loading") {
    return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-[#004b87] text-white flex">
      {/* Mobile sidebar toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 bg-[#f26c22] rounded-md text-white"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 glass-card transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 transition-transform duration-300 ease-in-out flex flex-col`}
      >
        <div className="p-6">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-[#f26c22] to-[#00aeef] bg-clip-text text-transparent">
            INSPIRE 2026
          </h1>
          <p className="text-sm text-gray-300 mt-1">Management Platform</p>
        </div>

        <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive
                    ? "bg-[#00aeef]/20 text-[#00aeef] border border-[#00aeef]/30"
                    : "text-gray-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 mt-auto border-t border-white/10">
          <div className="mb-4 px-4">
            <p className="text-sm font-medium truncate">{session?.user?.name || "Admin"}</p>
            <p className="text-xs text-gray-400 truncate">{session?.user?.role}</p>
          </div>
          <button
            onClick={() => signOut()}
            className="flex items-center gap-3 px-4 py-2 w-full text-left text-red-400 hover:bg-red-400/10 rounded-xl transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        <main className="flex-1 p-6 lg:p-8">
          {children}
        </main>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
