import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth, signOut } from "@/auth";
import { 
  LayoutDashboard, 
  Calendar, 
  Clock, 
  FileText, 
  Settings, 
  LogOut, 
  HeartPulse
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

import SidebarNav from "@/components/SidebarNav";
import NotificationBell from "@/components/NotificationBell";

export default async function DoctorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  const WHITELIST_EMAILS = [
    "anne.liangco@whitecloak.com",
    "donn.gamboa@whitecloak.com",
    "miguel.fermin@whitecloak.com",
    "thea.juego@whitecloak.com",
    "cherubim.citco@whitecloak.com"
  ];
  const isWhitelisted = session?.user?.email && WHITELIST_EMAILS.includes(session.user.email.toLowerCase());

  // Enforce session and doctor role (or bypass if whitelisted)
  if (!session || (!isWhitelisted && session.user.role !== "DOCTOR")) {
    redirect("/login");
  }

  const userInitials = session.user.name
    ? session.user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "D";

  const navItems = [
    {
      href: "/doctor",
      icon: <LayoutDashboard className="h-5 w-5" />,
      label: "Dashboard",
    },
    {
      href: "/doctor/appointments",
      icon: <Calendar className="h-5 w-5" />,
      label: "Appointments",
    },
    {
      href: "/doctor/schedule",
      icon: <Clock className="h-5 w-5" />,
      label: "Schedule",
    },
    {
      href: "/doctor/records",
      icon: <FileText className="h-5 w-5" />,
      label: "Medical Records",
    },
  ];

  if (isWhitelisted) {
    navItems.push({
      href: "/patient",
      icon: <HeartPulse className="h-5 w-5 text-teal-600" />,
      label: "Patient Module (Admin)",
    });
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 border-r border-slate-200 bg-white h-full justify-between p-6">
        <div className="space-y-8">
          {/* Logo Branding */}
          <div className="flex items-center justify-between px-4">
            <div className="flex items-center gap-3">
              <div className="p-1.5 bg-[#0a5c5f] rounded-lg text-white shrink-0">
                <HeartPulse className="h-6 w-6" />
              </div>
              <span className="text-xl font-bold text-[#0a5c5f] tracking-wide">AGAPAY</span>
            </div>
            <NotificationBell />
          </div>

          {/* Navigation Links */}
          <SidebarNav items={navItems} />
        </div>

        {/* Bottom Profile and Sign Out */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border border-[#0a5c5f]/10">
              <AvatarFallback className="bg-[#0a5c5f]/5 text-[#0a5c5f] font-semibold">
                {userInitials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-slate-900 truncate">
                {session.user.name}
              </p>
              <p className="text-xs text-slate-500 truncate">
                DOCTOR
              </p>
            </div>
            <Link href="/doctor/profile" className="text-slate-400 hover:text-slate-600">
              <Settings className="h-5 w-5" />
            </Link>
          </div>

          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/login" });
            }}
          >
            <button
              type="submit"
              className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 hover:text-red-600 rounded-xl transition-all text-left font-semibold"
            >
              <LogOut className="h-5 w-5" />
              <span className="text-sm">Log out</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-white">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-[#0a5c5f] rounded-lg text-white">
              <HeartPulse className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold text-[#0a5c5f] tracking-wide">AGAPAY</span>
          </div>

          <div className="flex items-center gap-3">
            <NotificationBell />
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-[#0a5c5f]/5 text-[#0a5c5f] text-xs font-semibold">
                {userInitials}
              </AvatarFallback>
            </Avatar>
          </div>
        </header>

        {/* Scrollable Container */}
        <main className="flex-1 overflow-y-auto bg-slate-50">
          {children}
        </main>
      </div>
    </div>
  );
}
