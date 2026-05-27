import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { 
  approveAppointment, 
  rescheduleAppointment 
} from "@/actions/appointments";
import { 
  Users, 
  Calendar, 
  Coins, 
  Clock, 
  ArrowRight, 
  CheckCircle2, 
  UserCheck, 
  TrendingUp,
  Star,
  Activity,
  UserPlus,
  Video
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// Action wrapper to handle server-side triggers from dashboard
async function handleApprove(formData: FormData) {
  "use server";
  const id = formData.get("appointmentId") as string;
  if (id) {
    await approveAppointment(id);
    revalidatePath("/doctor");
  }
}

export default async function DoctorDashboard() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  // Fetch doctor details
  const doctor = await prisma.doctor.findUnique({
    where: { userId: session.user.id },
    include: { user: true }
  });

  if (!doctor) {
    redirect("/api/auth/clear-stale-session");
  }

  // Fetch today's queue (CONFIRMED or COMPLETED appointments)
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  const queueAppointments = await prisma.appointment.findMany({
    where: {
      doctorId: doctor.id,
      dateTime: {
        gte: todayStart,
        lte: todayEnd,
      },
      status: {
        in: ["CONFIRMED", "COMPLETED"],
      }
    },
    include: {
      patient: {
        include: {
          user: {
            select: { name: true }
          }
        }
      }
    },
    orderBy: {
      dateTime: "asc"
    }
  });

  // Fetch pending approvals
  const pendingAppointments = await prisma.appointment.findMany({
    where: {
      doctorId: doctor.id,
      status: "PENDING"
    },
    include: {
      patient: {
        include: {
          user: {
            select: { name: true }
          }
        }
      }
    },
    orderBy: {
      dateTime: "asc"
    }
  });

  // Helper to format date
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Dashboard Overview</h1>
          <p className="text-slate-500 font-light mt-1">Hello Dr. {session.user.name}, here is your schedule for today</p>
        </div>
        <div className="flex gap-2 bg-white border border-slate-200 p-1 rounded-xl shadow-sm">
          <Badge className="bg-[#0a5c5f] text-white font-semibold hover:bg-[#0a5c5f] rounded-lg px-3 py-1.5 border-none">
            Today
          </Badge>
          <Badge className="bg-transparent text-slate-500 font-semibold hover:bg-slate-50 cursor-pointer rounded-lg px-3 py-1.5 border-none">
            Oct 24, 2024
          </Badge>
        </div>
      </div>

      {/* Metrics Row (Reference Image 6 layout) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-slate-100 shadow-sm rounded-2xl bg-white overflow-hidden">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-slate-400 text-xs font-bold uppercase tracking-wider block">Total Consultations</span>
              <p className="text-3xl font-black text-slate-900">1,284</p>
              <span className="text-xs text-emerald-500 font-bold block">↑ 12% vs last month</span>
            </div>
            <div className="p-3.5 bg-teal-50 text-[#0a5c5f] rounded-2xl">
              <Users className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-100 shadow-sm rounded-2xl bg-white overflow-hidden">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-slate-400 text-xs font-bold uppercase tracking-wider block">Monthly Revenue</span>
              <p className="text-3xl font-black text-slate-900">₱84.2k</p>
              <span className="text-xs text-emerald-500 font-bold block">↑ 8% growth</span>
            </div>
            <div className="p-3.5 bg-emerald-50 text-emerald-600 rounded-2xl">
              <Coins className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-100 shadow-sm rounded-2xl bg-white overflow-hidden">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-slate-400 text-xs font-bold uppercase tracking-wider block">Patient Satisfaction</span>
              <p className="text-3xl font-black text-slate-900">4.9</p>
              <span className="text-xs text-slate-400 font-light block">From 450+ reviews</span>
            </div>
            <div className="p-3.5 bg-amber-50/70 text-amber-500 rounded-2xl">
              <Star className="h-6 w-6 fill-current" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-100 shadow-sm rounded-2xl bg-white overflow-hidden">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-slate-400 text-xs font-bold uppercase tracking-wider block">New Patients</span>
              <p className="text-3xl font-black text-slate-900">32</p>
              <span className="text-xs text-rose-500 font-bold block">↓ 2% decrease</span>
            </div>
            <div className="p-3.5 bg-blue-50 text-blue-600 rounded-2xl">
              <UserPlus className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left column: Patient Queue & Traffic Chart */}
        <div className="lg:col-span-2 space-y-8">
          {/* Patient Queue */}
          <Card className="border-slate-100 shadow-sm rounded-2xl bg-white">
            <CardHeader className="flex flex-row justify-between items-center px-6 pt-6 pb-2">
              <div>
                <CardTitle className="text-xl font-bold text-slate-900">Patient Queue</CardTitle>
                <CardDescription className="text-slate-500 font-light mt-0.5">Manage consultations assigned for today</CardDescription>
              </div>
              <div className="flex gap-1.5 bg-slate-100 p-1 rounded-lg">
                <Badge className="bg-[#0a5c5f] text-white hover:bg-[#0a5c5f] rounded-md px-3 py-1 border-none text-[10px] cursor-pointer">Today</Badge>
                <Badge className="bg-transparent text-slate-500 hover:bg-slate-200 rounded-md px-3 py-1 border-none text-[10px] cursor-pointer">Week</Badge>
              </div>
            </CardHeader>
            <CardContent className="px-6 pb-6 space-y-4">
              {queueAppointments.length === 0 ? (
                // Seed mock patient queue if database is empty for visual showcase
                <>
                  {/* Mock Row 1 */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border border-slate-100 hover:border-slate-200 transition-all rounded-2xl bg-slate-50/50 gap-4">
                    <div className="flex items-center gap-4">
                      <div className="text-sm font-bold text-slate-500 w-16">
                        <span className="block">09:00</span>
                        <span className="text-[10px] text-slate-400 block font-normal uppercase">AM</span>
                      </div>
                      <Avatar className="h-10 w-10 border border-slate-100 bg-[#0a5c5f]/5 text-[#0a5c5f] flex items-center justify-center font-bold text-sm">
                        <span>MS</span>
                      </Avatar>
                      <div>
                        <h4 className="font-extrabold text-slate-800 text-sm">Mateo Sebastian</h4>
                        <p className="text-[11px] text-slate-500 font-medium">Routine Checkup • Video Call</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                      <Badge className="bg-teal-50 text-teal-700 hover:bg-teal-100 border border-teal-200 font-semibold px-2.5 py-0.5 rounded-full text-[10px]">
                        In-Progress
                      </Badge>
                      <Button asChild size="sm" className="bg-[#0a5c5f] hover:bg-[#084a4c] text-white rounded-lg h-9 px-4 text-xs font-semibold">
                        <Link href="/doctor/consultation/mock-1">Join Call</Link>
                      </Button>
                    </div>
                  </div>

                  {/* Mock Row 2 */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border border-slate-100 hover:border-slate-200 transition-all rounded-2xl bg-slate-50/50 gap-4">
                    <div className="flex items-center gap-4">
                      <div className="text-sm font-bold text-slate-500 w-16">
                        <span className="block">09:45</span>
                        <span className="text-[10px] text-slate-400 block font-normal uppercase">AM</span>
                      </div>
                      <Avatar className="h-10 w-10 border border-slate-100 bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
                        <span>CD</span>
                      </Avatar>
                      <div>
                        <h4 className="font-extrabold text-slate-800 text-sm">Carla Diaz</h4>
                        <p className="text-[11px] text-slate-500 font-medium">Follow-up • In-Clinic</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                      <Badge className="bg-slate-100 text-slate-600 border border-slate-200 font-semibold px-2.5 py-0.5 rounded-full text-[10px]">
                        Waiting
                      </Badge>
                    </div>
                  </div>

                  {/* Mock Row 3 */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border border-slate-100 hover:border-slate-200 transition-all rounded-2xl bg-slate-50/50 gap-4">
                    <div className="flex items-center gap-4">
                      <div className="text-sm font-bold text-slate-500 w-16">
                        <span className="block">08:15</span>
                        <span className="text-[10px] text-slate-400 block font-normal uppercase">AM</span>
                      </div>
                      <Avatar className="h-10 w-10 border border-slate-100 bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-sm">
                        <span>RB</span>
                      </Avatar>
                      <div>
                        <h4 className="font-extrabold text-slate-800 text-sm">Rafael Bautista</h4>
                        <p className="text-[11px] text-slate-500 font-medium">Heart Valve Review • Video Call</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                      <Badge className="bg-slate-100 text-slate-600 border border-slate-200 font-semibold px-2.5 py-0.5 rounded-full text-[10px]">
                        Completed
                      </Badge>
                    </div>
                  </div>
                </>
              ) : (
                queueAppointments.map((appt) => {
                  const cleanId = appt.id.replace(/[^a-z]/g, "");
                  const p1 = (cleanId.substring(0, 3) || "aga").padEnd(3, "a");
                  const p2 = (cleanId.substring(3, 7) || "meet").padEnd(4, "m");
                  const p3 = (cleanId.substring(7, 10) || "pay").padEnd(3, "p");
                  const meetUrl = `https://meet.google.com/${p1}-${p2}-${p3}`;

                  return (
                    <div key={appt.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border border-slate-100 hover:border-slate-200 transition-all rounded-2xl bg-slate-50/50 gap-4">
                      <div className="flex items-center gap-4">
                        <div className="text-sm font-bold text-slate-500 w-16 shrink-0">
                          <span className="block">{formatTime(appt.dateTime)}</span>
                        </div>
                        <Avatar className="h-10 w-10 border border-slate-100 bg-[#0a5c5f]/5 text-[#0a5c5f] flex items-center justify-center font-bold text-sm shrink-0">
                          <span>{appt.patient?.user?.name ? appt.patient.user.name[0] : "P"}</span>
                        </Avatar>
                        <div>
                          <h4 className="font-extrabold text-slate-800 text-sm">{appt.patient?.user?.name}</h4>
                          <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                            {appt.notes ? appt.notes.substring(0, 30) : "Consultation"} • Video Call
                          </p>
                          <a 
                            href={meetUrl} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-[10px] text-teal-600 hover:underline font-bold flex items-center gap-1 mt-1"
                          >
                            <Video className="h-3.5 w-3.5" />
                            <span>Google Meet: {meetUrl.replace("https://", "")}</span>
                          </a>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                        <Badge className="bg-teal-50 text-teal-700 hover:bg-teal-100 border border-teal-200 font-semibold px-2.5 py-0.5 rounded-full text-[10px]">
                          {appt.status}
                        </Badge>
                        {appt.status !== "COMPLETED" && (
                          <Button asChild size="sm" className="bg-[#0a5c5f] hover:bg-[#084a4c] text-white rounded-lg h-9 px-4 text-xs font-semibold">
                            <Link href={`/doctor/consultation/${appt.id}`}>Join Call</Link>
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>

          {/* Activity Chart Mockup (Reference Image 6) */}
          <Card className="border-slate-100 shadow-sm rounded-2xl bg-white p-6">
            <h3 className="text-sm font-bold text-slate-800 mb-6 uppercase tracking-wider">Activity & Patient Traffic</h3>
            <div className="flex justify-between items-end h-32 gap-3 pt-4 border-b border-slate-100">
              <div className="w-full bg-slate-100 h-[30%] rounded-t-md hover:bg-[#0a5c5f]/40 transition-colors" />
              <div className="w-full bg-slate-100 h-[50%] rounded-t-md hover:bg-[#0a5c5f]/40 transition-colors" />
              <div className="w-full bg-slate-100 h-[45%] rounded-t-md hover:bg-[#0a5c5f]/40 transition-colors" />
              <div className="w-full bg-slate-100 h-[80%] rounded-t-md hover:bg-[#0a5c5f]/40 transition-colors" />
              <div className="w-full bg-slate-100 h-[70%] rounded-t-md hover:bg-[#0a5c5f]/40 transition-colors" />
              <div className="w-full bg-slate-100 h-[50%] rounded-t-md hover:bg-[#0a5c5f]/40 transition-colors" />
              <div className="w-full bg-slate-100 h-[75%] rounded-t-md hover:bg-[#0a5c5f]/40 transition-colors" />
              <div className="w-full bg-slate-100 h-[35%] rounded-t-md hover:bg-[#0a5c5f]/40 transition-colors" />
              <div className="w-full bg-slate-100 h-[55%] rounded-t-md hover:bg-[#0a5c5f]/40 transition-colors" />
              <div className="w-full bg-slate-100 h-[65%] rounded-t-md hover:bg-[#0a5c5f]/40 transition-colors" />
            </div>
          </Card>
        </div>

        {/* Right column: Pending Approvals & Clinic Metrics */}
        <div className="space-y-8">
          {/* Pending Approvals */}
          <Card className="border-slate-100 shadow-sm rounded-2xl bg-white">
            <CardHeader className="flex flex-row justify-between items-center px-6 pt-6 pb-2">
              <div>
                <CardTitle className="text-lg font-bold text-slate-900">Pending Approval</CardTitle>
              </div>
              <Badge className="bg-rose-50 text-rose-600 border border-rose-200 font-semibold px-2 py-0.5 rounded text-[10px]">
                {pendingAppointments.length || "4"} New
              </Badge>
            </CardHeader>
            <CardContent className="px-6 pb-6 space-y-4">
              {pendingAppointments.length === 0 ? (
                // Seed mock pending request cards for visual showcase if db is empty
                <>
                  {/* Mock Card 1 */}
                  <div className="p-4 border border-slate-100 rounded-2xl bg-slate-50/30 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-extrabold text-slate-800 text-sm">Angela Tan</h4>
                        <p className="text-[10px] text-slate-500 font-medium">Consultation • Oct 26</p>
                      </div>
                      <Badge className="bg-slate-100 text-slate-500 border border-slate-200 text-[9px]">Video</Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1 bg-[#0a5c5f] hover:bg-[#084a4c] text-white text-xs rounded-xl h-9">
                        Approve
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1 border-slate-200 text-slate-600 text-xs rounded-xl h-9 bg-white">
                        Reschedule
                      </Button>
                    </div>
                  </div>

                  {/* Mock Card 2 */}
                  <div className="p-4 border border-slate-100 rounded-2xl bg-slate-50/30 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-extrabold text-slate-800 text-sm">Enrique Gil</h4>
                        <p className="text-[10px] text-slate-500 font-medium">Echo Test • Oct 27</p>
                      </div>
                      <Badge className="bg-slate-100 text-slate-500 border border-slate-200 text-[9px]">Clinic</Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1 bg-[#0a5c5f] hover:bg-[#084a4c] text-white text-xs rounded-xl h-9">
                        Approve
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1 border-slate-200 text-slate-600 text-xs rounded-xl h-9 bg-white">
                        Reschedule
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                pendingAppointments.map((appt) => (
                  <div key={appt.id} className="p-4 border border-slate-100 rounded-2xl bg-slate-50/30 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-extrabold text-slate-800 text-sm">{appt.patient?.user?.name}</h4>
                        <p className="text-[10px] text-slate-500 font-medium">
                          {appt.notes ? appt.notes.substring(0, 20) : "Consultation"} • {formatDate(appt.dateTime)}
                        </p>
                      </div>
                      <Badge className="bg-slate-100 text-slate-500 border border-slate-200 text-[9px]">Video</Badge>
                    </div>
                    <div className="flex gap-2">
                      {/* Active Server Actions Forms */}
                      <form action={handleApprove} className="flex-1">
                        <input type="hidden" name="appointmentId" value={appt.id} />
                        <Button type="submit" size="sm" className="w-full bg-[#0a5c5f] hover:bg-[#084a4c] text-white text-xs rounded-xl h-9">
                          Approve
                        </Button>
                      </form>
                      <Button size="sm" variant="outline" className="flex-1 border-slate-200 text-slate-600 text-xs rounded-xl h-9 bg-white">
                        Reschedule
                      </Button>
                    </div>
                  </div>
                ))
              )}

              <div className="pt-2 text-center">
                <Button variant="link" className="text-[#0a5c5f] font-semibold text-xs hover:underline">
                  View All Requests
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Clinic Health Metric (Reference Image 6 bottom-right) */}
          <Card className="bg-[#0a5c5f]/5 border border-[#0a5c5f]/15 rounded-2xl p-5 text-left space-y-4">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="h-4.5 w-4.5 text-[#0a5c5f]" />
              <span>Clinic Health Metric</span>
            </h4>
            <p className="text-slate-600 text-xs font-light leading-relaxed">
              Average consultation time is down by 4 minutes this week. Efficiency has improved by 15%.
            </p>
            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between items-center text-[10px] font-bold text-slate-500">
                <span>KPI TARGET</span>
                <span>75%</span>
              </div>
              <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-[#0a5c5f] rounded-full" style={{ width: "75%" }} />
              </div>
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
}