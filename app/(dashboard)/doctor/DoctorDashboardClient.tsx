"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Users, 
  Calendar, 
  Coins, 
  Clock, 
  CheckCircle2, 
  Star,
  Activity,
  UserPlus,
  Video,
  AlertCircle,
  X,
  CalendarDays,
  Check
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { approveAppointment, rescheduleAppointment } from "@/actions/appointments";

interface DoctorDashboardClientProps {
  doctor: any;
  queueAppointments: any[];
  pendingAppointments: any[];
}

export default function DoctorDashboardClient({
  doctor,
  queueAppointments,
  pendingAppointments,
}: DoctorDashboardClientProps) {
  const router = useRouter();

  // State to support mock appointment updates if DB is empty
  const [localPending, setLocalPending] = useState<any[]>(
    pendingAppointments.length === 0
      ? [
          {
            id: "mock-pending-1",
            isMock: true,
            patient: { user: { name: "Angela Tan" } },
            notes: "Consultation",
            dateTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            id: "mock-pending-2",
            isMock: true,
            patient: { user: { name: "Enrique Gil" } },
            notes: "Echo Test",
            dateTime: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
          },
        ]
      : pendingAppointments
  );

  // States
  const [rescheduleTarget, setRescheduleTarget] = useState<any | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState("2026-05-28");
  const [rescheduleTime, setRescheduleTime] = useState("09:00 AM");

  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const timeslots = [
    "09:00 AM", "10:30 AM", "11:15 AM", "02:00 PM", "03:30 PM", "04:15 PM"
  ];

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  // Actions
  const handleApprove = async (apptId: string, isMock?: boolean) => {
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    if (isMock) {
      // Simulate on mock cards
      setTimeout(() => {
        setLocalPending((prev) => prev.filter((p) => p.id !== apptId));
        setSuccessMessage("Appointment approved successfully! (Simulated)");
        setIsLoading(false);
      }, 800);
      return;
    }

    const result = await approveAppointment(apptId);

    if (result.error) {
      setErrorMessage(result.error);
    } else {
      setSuccessMessage("Appointment approved successfully.");
      router.refresh();
      // Also update local state in case the route takes a second to revalidate
      setLocalPending((prev) => prev.filter((p) => p.id !== apptId));
    }
    setIsLoading(false);
  };

  const handleRescheduleClick = (appt: any) => {
    setRescheduleTarget(appt);
    setRescheduleDate(appt.dateTime.split("T")[0]);
  };

  const handleRescheduleSubmit = async () => {
    if (!rescheduleTarget || !rescheduleTime) {
      setErrorMessage("Please select a timeslot.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    // Combine date and time
    const [time, modifier] = rescheduleTime.split(" ");
    let [hours, minutes] = time.split(":").map(Number);
    if (modifier === "PM" && hours < 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0;
    
    const appointmentDate = new Date(rescheduleDate);
    appointmentDate.setHours(hours, minutes, 0, 0);

    if (rescheduleTarget.isMock) {
      // Simulate on mock card
      setTimeout(() => {
        setLocalPending((prev) =>
          prev.map((p) =>
            p.id === rescheduleTarget.id
              ? { ...p, dateTime: appointmentDate.toISOString() }
              : p
          )
        );
        setSuccessMessage("Reschedule request submitted successfully! (Simulated)");
        setRescheduleTarget(null);
        setIsLoading(false);
      }, 800);
      return;
    }

    const result = await rescheduleAppointment(rescheduleTarget.id, appointmentDate);

    if (result.error) {
      setErrorMessage(result.error);
    } else {
      setSuccessMessage("Reschedule request submitted successfully! Awaiting approval.");
      setRescheduleTarget(null);
      router.refresh();
    }
    setIsLoading(false);
  };

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Toast notifications */}
      {successMessage && (
        <div className="fixed bottom-6 right-6 bg-[#0a5c5f] border border-[#084a4c] text-white rounded-2xl p-4 shadow-xl z-50 flex items-center gap-3 animate-bounce">
          <CheckCircle2 className="h-5 w-5 bg-teal-800 text-white rounded-full p-1 shrink-0" />
          <span className="text-sm font-semibold">{successMessage}</span>
          <button onClick={() => setSuccessMessage(null)} className="ml-2 hover:opacity-85 text-teal-200">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
      {errorMessage && (
        <div className="fixed bottom-6 right-6 bg-rose-600 border border-rose-700 text-white rounded-2xl p-4 shadow-xl z-50 flex items-center gap-3 animate-bounce">
          <AlertCircle className="h-5 w-5 bg-rose-800 text-white rounded-full p-1 shrink-0" />
          <span className="text-sm font-semibold">{errorMessage}</span>
          <button onClick={() => setErrorMessage(null)} className="ml-2 hover:opacity-85 text-rose-200">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Dashboard Overview</h1>
          <p className="text-slate-500 font-light mt-1">Hello Dr. {doctor.user.name}, here is your schedule for today</p>
        </div>
        <div className="flex gap-2 bg-white border border-slate-200 p-1 rounded-xl shadow-sm">
          <Badge className="bg-[#0a5c5f] text-white font-semibold hover:bg-[#0a5c5f] rounded-lg px-3 py-1.5 border-none">
            Today
          </Badge>
          <Badge className="bg-transparent text-slate-500 font-semibold hover:bg-slate-50 cursor-pointer rounded-lg px-3 py-1.5 border-none">
            {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
          </Badge>
        </div>
      </div>

      {/* Metrics Row */}
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
                        <Link href="/doctor/consultation/mock-1">Start EHR Summary</Link>
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
                            <Link href={`/doctor/consultation/${appt.id}`}>Start EHR Summary</Link>
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>

          {/* Activity Chart Mockup */}
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
                {localPending.length} New
              </Badge>
            </CardHeader>
            <CardContent className="px-6 pb-6 space-y-4">
              {localPending.length === 0 ? (
                <div className="text-center py-6 text-slate-400 text-xs">
                  No pending consultation approvals.
                </div>
              ) : (
                localPending.map((appt) => (
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
                      <Button 
                        disabled={isLoading}
                        onClick={() => handleApprove(appt.id, appt.isMock)}
                        size="sm" 
                        className="flex-1 bg-[#0a5c5f] hover:bg-[#084a4c] text-white text-xs rounded-xl h-9 font-semibold"
                      >
                        {isLoading ? "..." : "Approve"}
                      </Button>
                      <Button 
                        disabled={isLoading}
                        onClick={() => handleRescheduleClick(appt)}
                        size="sm" 
                        variant="outline" 
                        className="flex-1 border-slate-200 text-slate-600 text-xs rounded-xl h-9 bg-white hover:bg-slate-50 font-semibold"
                      >
                        Reschedule
                      </Button>
                    </div>
                  </div>
                ))
              )}

              <div className="pt-2 text-center">
                <Button asChild variant="link" className="text-[#0a5c5f] font-semibold text-xs hover:underline cursor-pointer">
                  <Link href="/doctor/appointments">View All Requests</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Clinic Health Metric */}
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

      {/* Reschedule Consultation Dialog */}
      <Dialog open={!!rescheduleTarget} onOpenChange={() => setRescheduleTarget(null)}>
        {rescheduleTarget && (
          <DialogContent className="max-w-md rounded-3xl p-6 bg-white border border-slate-100">
            <DialogHeader className="pb-3 border-b border-slate-100">
              <DialogTitle className="text-xl font-extrabold text-slate-900">Reschedule Consultation</DialogTitle>
              <DialogDescription className="text-slate-500 text-xs font-light font-sans">Propose a new date and timeslot for the patient</DialogDescription>
            </DialogHeader>

            <div className="space-y-5 pt-3">
              {/* Date selection input */}
              <div className="space-y-1.5">
                <Label htmlFor="resched-date" className="text-xs font-bold text-slate-700">Choose New Date</Label>
                <div className="relative">
                  <CalendarDays className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input 
                    type="date" 
                    id="resched-date"
                    className="pl-10 h-11 border-slate-200 rounded-xl font-sans"
                    value={rescheduleDate}
                    onChange={(e) => setRescheduleDate(e.target.value)}
                  />
                </div>
              </div>

              {/* Time slots grid selector */}
              <div className="space-y-2">
                <Label className="text-xs font-bold text-slate-700">Select Available Timeslot</Label>
                <div className="grid grid-cols-3 gap-2">
                  {timeslots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setRescheduleTime(slot)}
                      className={`py-2.5 rounded-xl text-xs font-bold border transition-all ${
                        rescheduleTime === slot
                          ? "bg-[#0a5c5f] text-white border-transparent shadow-sm"
                          : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button 
                  variant="outline" 
                  onClick={() => setRescheduleTarget(null)}
                  className="flex-1 rounded-xl h-11 border-slate-200"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleRescheduleSubmit}
                  disabled={isLoading}
                  className="flex-1 bg-[#0a5c5f] hover:bg-[#084a4c] text-white rounded-xl h-11 font-semibold"
                >
                  {isLoading ? "Submitting..." : "Reschedule"}
                </Button>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
