import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth, signOut } from "@/auth";
import { 
  LayoutDashboard, 
  Calendar, 
  FileText, 
  MessageSquare, 
  Pill, 
  Settings, 
  LogOut, 
  User,
  HeartPulse
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface SidebarLinkProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
}

function SidebarLink({ href, icon, label, isActive }: SidebarLinkProps) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
        isActive
          ? "bg-[#0a5c5f]/5 text-[#0a5c5f] font-semibold border-l-4 border-[#0a5c5f]"
          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
      }`}
    >
      {icon}
      <span className="text-sm">{label}</span>
    </Link>
  );
}

export default async function PatientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Enforce session and patient role
  if (!session || session.user.role !== "PATIENT") {
    redirect("/login");
  }

  // Get user initials for fallback avatar
  const userInitials = session.user.name
    ? session.user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "P";

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 border-r border-slate-200 bg-white h-full justify-between p-6">
        <div className="space-y-8">
          {/* Logo Branding */}
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-[#0a5c5f] rounded-lg text-white">
              <HeartPulse className="h-6 w-6" />
            </div>
            <span className="text-xl font-bold text-[#0a5c5f] tracking-wide">AGAPAY</span>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1">
            <SidebarLink 
              href="/patient" 
              icon={<LayoutDashboard className="h-5 w-5" />} 
              label="Dashboard" 
              isActive={true} // Hardcoded for index path, but can be updated dynamically
            />
            <SidebarLink 
              href="/patient/appointments" 
              icon={<Calendar className="h-5 w-5" />} 
              label="Appointments" 
            />
            <SidebarLink 
              href="/patient/records" 
              icon={<FileText className="h-5 w-5" />} 
              label="Records" 
            />
            <SidebarLink 
              href="/patient/doctors" 
              icon={<User className="h-5 w-5" />} 
              label="Doctors" 
            />
            <SidebarLink 
              href="#" 
              icon={<MessageSquare className="h-5 w-5" />} 
              label="Messages" 
            />
            <SidebarLink 
              href="#" 
              icon={<Pill className="h-5 w-5" />} 
              label="Prescriptions" 
            />
          </nav>
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
                PATIENT
              </p>
            </div>
            <Link href="/patient/profile" className="text-slate-400 hover:text-slate-600">
              <Settings className="h-5 w-5" />
            </Link>
          </div>

          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/login" });
            }}
          >
            <Button
              variant="ghost"
              type="submit"
              className="w-full flex items-center justify-start gap-3 h-10 px-3 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
            >
              <LogOut className="h-5 w-5" />
              <span className="text-sm font-medium">Log out</span>
            </Button>
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

          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-[#0a5c5f]/5 text-[#0a5c5f] text-xs font-semibold">
              {userInitials}
            </AvatarFallback>
          </Avatar>
        </header>

        {/* Scrollable Container */}
        <main className="flex-1 overflow-y-auto bg-slate-50">
          {children}
        </main>
      </div>
    </div>
  );
}
