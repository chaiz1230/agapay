"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  FileText, 
  Pill, 
  CreditCard, 
  Plus, 
  Download, 
  Video, 
  Eye, 
  Calendar,
  CheckSquare,
  TrendingUp,
  X,
  Clock,
  Coins,
  ShieldCheck,
  Activity,
  Heart,
  Droplet
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { getMeetUrl } from "@/utils/meet";

interface PatientDashboardClientProps {
  firstName: string;
  appointments: any[];
  records: any[];
}

export default function PatientDashboardClient({ firstName, appointments, records }: PatientDashboardClientProps) {
  // Modal Popups states
  const [activePopup, setActivePopup] = useState<null | "prescriptions" | "billing" | "calendar">(null);
  const [isExporting, setIsExporting] = useState(false);
  const [exportToast, setExportToast] = useState(false);
  const [isHistoryPopupOpen, setIsHistoryPopupOpen] = useState(false);

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);

      // Generate medical record content
      const content = `AGAPAY TELEHEALTH - MEDICAL RECORD EXPORT\n` +
        `Generated on: ${new Date().toLocaleDateString()}\n` +
        `Patient: Jane Doe\n\n` +
        `========================================\n` +
        `ACTIVE PRESCRIPTIONS\n` +
        `- Albuterol Inhaler (Dr. Elena Santos): 2 puffs every 4-6 hours as needed\n` +
        `- Paracetamol 500mg (Dr. Sofia Chen): 1 tablet every 6 hours as needed\n\n` +
        `========================================\n` +
        `VITALS SUMMARY\n` +
        `- Heart Rate: 72 bpm\n` +
        `- Blood Pressure: 120/80 mmHg\n` +
        `- Wellness Index: 84/100\n\n` +
        `========================================\n` +
        `RECENT CONSULTATIONS HISTORY\n` +
        (records.length === 0
          ? `- No consultations recorded yet.\n`
          : records.map(rec => {
              const recDate = new Date(rec.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
              return `- ${recDate}: Dr. ${rec.doctor.user?.name} (${rec.doctor.specialization}) - Diagnosis: ${rec.diagnosis}\n  Treatment: ${rec.treatment}\n  Notes: ${rec.notes || "N/A"}\n`;
            }).join("\n")
        ) +
        `\n========================================\n` +
        `This record is securely encrypted and HIPAA-compliant.\n`;

      const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "Agapay_Medical_Record_Summary.txt";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setExportToast(true);
      setTimeout(() => setExportToast(false), 3000);
    }, 1500);
  };

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <p className="text-sm font-medium text-[#0a5c5f]">Welcome back, {firstName}</p>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">Your Health Overview</h1>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={handleExport}
            disabled={isExporting}
            className="flex items-center gap-2 border-slate-200 hover:bg-slate-100 rounded-xl h-11"
          >
            {isExporting ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4 text-slate-500" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Exporting...</span>
              </span>
            ) : (
              <>
                <Download className="h-4 w-4" />
                <span>Export Records</span>
              </>
            )}
          </Button>
          <Button asChild className="bg-[#0a5c5f] hover:bg-[#084a4c] text-white flex items-center gap-2 rounded-xl h-11 font-semibold">
            <Link href="/patient/doctors">
              <Plus className="h-4 w-4" />
              <span>Book New Consultation</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Floating Export Success Toast */}
      {exportToast && (
        <div className="fixed bottom-6 right-6 bg-[#0a5c5f] border border-[#084a4c] text-white rounded-2xl p-4 shadow-xl z-50 flex items-center gap-3 animate-bounce">
          <CheckSquare className="h-5 w-5 bg-teal-800 text-white rounded-full p-1 shrink-0" />
          <span className="text-sm font-semibold">Agapay_Health_Summary.pdf exported successfully!</span>
        </div>
      )}

      {/* Metrics Row (Making cards fully clickable & interactive) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Clickable Medical Records */}
        <Link href="/patient/records" className="block">
          <Card className="border-slate-100 shadow-sm hover:shadow-md hover:border-[#0a5c5f]/30 transition-all rounded-2xl bg-white overflow-hidden group h-full">
            <CardContent className="p-6 flex items-start gap-4">
              <div className="p-3.5 bg-teal-50 text-[#0a5c5f] rounded-2xl group-hover:bg-[#0a5c5f]/10 transition-colors shrink-0">
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-lg group-hover:text-[#0a5c5f] transition-colors">Medical Records</h3>
                <p className="text-slate-500 text-sm mt-1 leading-relaxed font-light">
                  Access your lab results, summaries, pathology logs, and historic health data.
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Clickable Prescriptions Popup */}
        <div onClick={() => setActivePopup("prescriptions")} className="cursor-pointer">
          <Card className="border-slate-100 shadow-sm hover:shadow-md hover:border-[#0a5c5f]/30 transition-all rounded-2xl bg-white overflow-hidden group h-full">
            <CardContent className="p-6 flex items-start gap-4">
              <div className="p-3.5 bg-teal-50 text-[#0a5c5f] rounded-2xl group-hover:bg-[#0a5c5f]/10 transition-colors shrink-0">
                <Pill className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-lg group-hover:text-[#0a5c5f] transition-colors">Prescriptions</h3>
                <p className="text-slate-500 text-sm mt-1 leading-relaxed font-light">
                  Renew or view active medication instructions prescribed by your telehealth specialist.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Clickable Billing Popup */}
        <div onClick={() => setActivePopup("billing")} className="cursor-pointer">
          <Card className="border-slate-100 shadow-sm hover:shadow-md hover:border-[#0a5c5f]/30 transition-all rounded-2xl bg-white overflow-hidden group h-full">
            <CardContent className="p-6 flex items-start gap-4">
              <div className="p-3.5 bg-teal-50 text-[#0a5c5f] rounded-2xl group-hover:bg-[#0a5c5f]/10 transition-colors shrink-0">
                <CreditCard className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-lg group-hover:text-[#0a5c5f] transition-colors">Billing & Invoices</h3>
                <p className="text-slate-500 text-sm mt-1 leading-relaxed font-light">
                  Manage your invoices, payments, consult fees receipt logs, and transaction status.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Appointments & Consultations */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Upcoming Appointments */}
          <Card className="border-slate-100 shadow-sm rounded-2xl bg-white">
            <CardHeader className="flex flex-row justify-between items-center px-6 pt-6 pb-2">
              <div>
                <CardTitle className="text-xl font-bold text-slate-900">Upcoming Appointments</CardTitle>
                <CardDescription className="text-slate-500 font-light mt-0.5">Your scheduled telehealth calls and meetings</CardDescription>
              </div>
              <Button 
                variant="link" 
                onClick={() => setActivePopup("calendar")}
                className="text-[#0a5c5f] font-bold hover:underline px-0"
              >
                View Calendar
              </Button>
            </CardHeader>
            <CardContent className="px-6 pb-6 space-y-4">
              {appointments.length === 0 ? (
                <div className="text-center py-10 bg-slate-50/50 border border-dashed border-slate-200 rounded-2xl p-6">
                  <Video className="h-8 w-8 text-slate-400 mx-auto mb-2 animate-pulse" />
                  <h4 className="font-bold text-slate-700 text-sm">No scheduled consultations</h4>
                  <p className="text-xs text-slate-400 font-light mt-1">Book your first telehealth consultation with a specialist.</p>
                  <Button asChild size="sm" className="bg-[#0a5c5f] hover:bg-[#084a4c] text-white rounded-lg h-9 px-4 mt-4 font-semibold">
                    <Link href="/patient/doctors">Book Consultation</Link>
                  </Button>
                </div>
              ) : (
                appointments.map((appt) => {
                  const apptDate = new Date(appt.dateTime);
                  const month = apptDate.toLocaleDateString("en-US", { month: "short" });
                  const day = apptDate.toLocaleDateString("en-US", { day: "numeric" });
                  const timeRange = apptDate.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

                  const meetUrl = getMeetUrl(appt.id);

                  return (
                    <div key={appt.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border border-slate-100 hover:border-slate-200 transition-colors rounded-2xl bg-slate-50/50 gap-4">
                      <div className="flex items-center gap-4">
                        <div className="flex flex-col items-center justify-center bg-white border border-slate-200 h-16 w-16 rounded-xl shadow-sm shrink-0">
                          <span className="text-[10px] uppercase font-bold text-slate-400">{month}</span>
                          <span className="text-xl font-extrabold text-[#0a5c5f]">{day}</span>
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-800">Dr. {appt.doctor.user?.name}</h4>
                          <p className="text-xs text-slate-500 font-semibold">{appt.doctor.specialization} Specialist • Telehealth</p>
                          <div className="text-[11px] text-slate-400 mt-1 font-light flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                            <span>{timeRange}</span>
                            <a 
                              href={meetUrl}
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-teal-600 hover:underline font-bold flex items-center gap-1"
                            >
                              <Video className="h-3.5 w-3.5" />
                              <span>Google Meet: {meetUrl.replace("https://", "")}</span>
                            </a>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
                        <Badge className={`font-semibold px-2.5 py-0.5 rounded-full border-none ${
                          appt.status === "CONFIRMED" 
                            ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100" 
                            : "bg-amber-50 text-amber-700 hover:bg-amber-100"
                        }`}>
                          {appt.status}
                        </Badge>
                        {appt.status === "CONFIRMED" && (
                          <Button asChild size="sm" className="bg-[#0a5c5f] hover:bg-[#084a4c] text-white flex items-center gap-1.5 rounded-lg h-9 px-4">
                            <a href={meetUrl} target="_blank" rel="noopener noreferrer">Join Call</a>
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>

          {/* Recent Consultations History Table */}
          <Card className="border-slate-100 shadow-sm rounded-2xl bg-white overflow-hidden">
            <CardHeader className="px-6 pt-6 pb-2">
              <CardTitle className="text-xl font-bold text-slate-900">Recent Consultations</CardTitle>
              <CardDescription className="text-slate-500 font-light mt-0.5">Summary of your past consultations and outcomes</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {records.length === 0 ? (
                <div className="p-6 text-center text-slate-400 italic text-xs">
                  No consultation history available.
                </div>
              ) : (
                <Table>
                  <TableHeader className="bg-slate-50">
                    <TableRow>
                      <TableHead className="px-6 py-3 font-semibold text-slate-700">DATE</TableHead>
                      <TableHead className="font-semibold text-slate-700">PROVIDER</TableHead>
                      <TableHead className="font-semibold text-slate-700">SPECIALTY</TableHead>
                      <TableHead className="font-semibold text-slate-700">DIAGNOSIS</TableHead>
                      <TableHead className="text-center font-semibold text-slate-700">ACTIONS</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {records.map((rec) => {
                      const recDate = new Date(rec.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
                      return (
                        <TableRow key={rec.id} className="hover:bg-slate-50/50">
                          <TableCell className="px-6 py-4 text-slate-600 font-medium">{recDate}</TableCell>
                          <TableCell className="text-slate-800 font-bold">Dr. {rec.doctor.user?.name}</TableCell>
                          <TableCell className="text-slate-600">{rec.doctor.specialization}</TableCell>
                          <TableCell>
                            <Badge className="bg-teal-50 text-[#0a5c5f] hover:bg-teal-100 border border-teal-200 font-medium rounded-full text-[10px]">
                              {rec.diagnosis}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            <Button asChild variant="ghost" size="icon" className="hover:bg-[#0a5c5f]/5 text-[#0a5c5f]">
                              <Link href="/patient/records">
                                <Eye className="h-4 w-4" />
                              </Link>
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
              <div className="py-4 border-t border-slate-100 text-center">
                <Button 
                  onClick={() => setIsHistoryPopupOpen(true)}
                  variant="ghost" 
                  className="text-[#0a5c5f] hover:bg-[#0a5c5f]/5 font-bold text-xs rounded-lg px-6"
                >
                  See full history
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Side: Discover Specialists & Reminders */}
        <div className="space-y-8">
          
          {/* Daily Reminders */}
          <Card className="border-slate-100 shadow-sm rounded-2xl bg-white">
            <CardHeader className="px-6 pt-6 pb-2">
              <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <CheckSquare className="h-5 w-5 text-[#0a5c5f]" />
                <span>Daily Reminders</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-6 space-y-4">
              <div className="flex gap-3 items-start p-3 border border-slate-50 rounded-xl bg-slate-50/50">
                <input type="checkbox" defaultChecked className="mt-1 h-4.5 w-4.5 rounded border-slate-300 text-[#0a5c5f] focus:ring-[#0a5c5f]" />
                <div>
                  <h5 className="text-sm font-bold text-slate-800 line-through decoration-slate-300">Stay hydrated</h5>
                  <p className="text-[11px] text-slate-400 font-light mt-0.5">Target: 2.5L today. You've logged 1.2L.</p>
                </div>
              </div>
              <div className="flex gap-3 items-start p-3 border border-slate-50 rounded-xl bg-slate-50/50">
                <input type="checkbox" defaultChecked className="mt-1 h-4.5 w-4.5 rounded border-slate-300 text-[#0a5c5f] focus:ring-[#0a5c5f]" />
                <div>
                  <h5 className="text-sm font-bold text-slate-800 line-through decoration-slate-300">Take Vitamin C</h5>
                  <p className="text-[11px] text-slate-400 font-light mt-0.5">Post-lunch dosage recommended by Dr. Chen.</p>
                </div>
              </div>
              <div className="flex gap-3 items-start p-3 border border-slate-50 rounded-xl bg-slate-50/50">
                <input type="checkbox" className="mt-1 h-4.5 w-4.5 rounded border-slate-300 text-[#0a5c5f] focus:ring-[#0a5c5f]" />
                <div>
                  <h5 className="text-sm font-bold text-slate-800">Evening Walk</h5>
                  <p className="text-[11px] text-slate-400 font-light mt-0.5">15-minute light cardio for heart health.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Seeded Specialists Quick Link */}
          <Card className="border-slate-100 shadow-sm rounded-2xl bg-white">
            <CardHeader className="px-6 pt-6 pb-2">
              <CardTitle className="text-lg font-bold text-slate-900">Expert Care Partners</CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-6 space-y-4">
              <div className="flex justify-between items-center gap-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 border border-slate-100">
                    <img src="/dr_elena_santos.png" alt="Elena" className="object-cover w-full h-full object-center" />
                  </Avatar>
                  <div>
                    <h5 className="text-sm font-bold text-slate-800">Dr. Elena Santos</h5>
                    <p className="text-[10px] text-slate-400 font-semibold">Cardiology Specialist</p>
                  </div>
                </div>
                <Button asChild size="icon" variant="ghost" className="hover:bg-[#0a5c5f]/5 text-[#0a5c5f] rounded-lg">
                  <Link href="/patient/doctors">
                    <Plus className="h-4 w-4" />
                  </Link>
                </Button>
              </div>

              <div className="flex justify-between items-center gap-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 border border-slate-100">
                    <img src="/dr_sofia_chen.png" alt="Sofia" className="object-cover w-full h-full object-center" />
                  </Avatar>
                  <div>
                    <h5 className="text-sm font-bold text-slate-800">Dr. Sofia Chen</h5>
                    <p className="text-[10px] text-slate-400 font-semibold">Pediatrics Specialist</p>
                  </div>
                </div>
                <Button asChild size="icon" variant="ghost" className="hover:bg-[#0a5c5f]/5 text-[#0a5c5f] rounded-lg">
                  <Link href="/patient/doctors">
                    <Plus className="h-4 w-4" />
                  </Link>
                </Button>
              </div>

              <Button asChild variant="outline" className="w-full text-[#0a5c5f] hover:bg-[#0a5c5f]/5 hover:text-[#0a5c5f] border-slate-200 font-semibold text-xs rounded-xl h-10 mt-2">
                <Link href="/patient/doctors">
                  <span>Discover All Specialists</span>
                </Link>
              </Button>
            </CardContent>
          </Card>

        </div>

      </div>

      {/* Wellness Score Card - Full Width at Bottom with No Buttons */}
      <Card className="bg-[#0a5c5f] text-white rounded-3xl shadow-sm border-none overflow-hidden relative p-8">
        <div className="absolute right-0 bottom-0 opacity-5 pointer-events-none transform translate-x-12 translate-y-12">
          <TrendingUp className="h-96 w-96" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-center relative z-10">
          {/* Main big score */}
          <div className="space-y-3">
            <span className="text-[10px] font-bold tracking-wider bg-white/10 px-3 py-1 rounded-full uppercase">Wellness Index Score</span>
            <div className="flex items-baseline gap-1 pt-1">
              <span className="text-6xl font-black tracking-tight">84</span>
              <span className="text-teal-200 text-xl font-bold">/ 100</span>
            </div>
            <p className="text-teal-100 text-xs font-light leading-relaxed">
              Your overall health index has improved by 12% since last month. Consistent sleep schedules and daily hydration are contributing positively.
            </p>
          </div>

          {/* Activity vitals parameters */}
          <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-2">
              <span className="text-[9px] font-bold text-teal-200 uppercase block">Sleep Duration</span>
              <span className="text-lg font-black block">7.5 Hours</span>
              <span className="text-[10px] text-emerald-400 font-semibold block">↑ 8% vs last week</span>
            </div>
            
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-2">
              <span className="text-[9px] font-bold text-teal-200 uppercase block">Heart HRV</span>
              <span className="text-lg font-black block flex items-center gap-1">
                <Heart className="h-4.5 w-4.5 text-rose-400 fill-current animate-pulse shrink-0" />
                <span>62 ms</span>
              </span>
              <span className="text-[10px] text-teal-200 font-light block">Vitals Stable</span>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-2">
              <span className="text-[9px] font-bold text-teal-200 uppercase block">Active Steps</span>
              <span className="text-lg font-black block">8,421</span>
              <div className="h-1.5 w-full bg-white/15 rounded-full overflow-hidden mt-1">
                <div className="h-full bg-emerald-400" style={{ width: "84%" }} />
              </div>
              <span className="text-[9px] text-teal-100 font-light block mt-1">Goal: 10,000 steps</span>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-2">
              <span className="text-[9px] font-bold text-teal-200 uppercase block">Daily Hydration</span>
              <span className="text-lg font-black block flex items-center gap-1">
                <Droplet className="h-4.5 w-4.5 text-blue-400 fill-current shrink-0" />
                <span>1.5 Liters</span>
              </span>
              <span className="text-[10px] text-teal-200 font-light block">Goal: 2.5L</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Interactive Prescriptions Modal popup */}
      <Dialog open={activePopup === "prescriptions"} onOpenChange={() => setActivePopup(null)}>
        <DialogContent className="max-w-md rounded-3xl p-6 bg-white border border-slate-100">
          <DialogHeader className="pb-3 border-b border-slate-100">
            <DialogTitle className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <Pill className="h-5 w-5 text-[#0a5c5f]" />
              <span>Active Prescriptions</span>
            </DialogTitle>
            <DialogDescription className="text-slate-500 text-xs font-light">Prescriptions issued by your verified physicians</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-3">
            <div className="border border-slate-100 p-4 rounded-2xl bg-slate-50/50 space-y-2">
              <div className="flex justify-between items-center">
                <h4 className="font-extrabold text-slate-800 text-sm">Albuterol Inhaler</h4>
                <Badge className="bg-[#0a5c5f]/10 text-[#0a5c5f] border-none text-[9px]">Active</Badge>
              </div>
              <p className="text-xs text-slate-600 font-light leading-relaxed">
                Dosage: 2 puffs every 4-6 hours as needed for chest tightness or shortness of breath.
              </p>
              <div className="text-[10px] text-slate-400 font-semibold border-t border-slate-100 pt-1.5 mt-2">
                Prescribed by Dr. Elena Santos • Cardiology
              </div>
            </div>

            <div className="border border-slate-100 p-4 rounded-2xl bg-slate-50/50 space-y-2">
              <div className="flex justify-between items-center">
                <h4 className="font-extrabold text-slate-800 text-sm">Paracetamol 500mg</h4>
                <Badge className="bg-[#0a5c5f]/10 text-[#0a5c5f] border-none text-[9px]">Active</Badge>
              </div>
              <p className="text-xs text-slate-600 font-light leading-relaxed">
                Dosage: 1 tablet every 6 hours as needed for fever or headaches. Max 4 tabs/day.
              </p>
              <div className="text-[10px] text-slate-400 font-semibold border-t border-slate-100 pt-1.5 mt-2">
                Prescribed by Dr. Sofia Chen • Pediatrics
              </div>
            </div>

            <Button 
              onClick={() => setActivePopup(null)} 
              className="w-full bg-[#0a5c5f] hover:bg-[#084a4c] text-white rounded-xl h-11 font-semibold"
            >
              Close Prescriptions
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Interactive Billing Modal popup */}
      <Dialog open={activePopup === "billing"} onOpenChange={() => setActivePopup(null)}>
        <DialogContent className="max-w-md rounded-3xl p-6 bg-white border border-slate-100">
          <DialogHeader className="pb-3 border-b border-slate-100">
            <DialogTitle className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-[#0a5c5f]" />
              <span>Billing & Payments</span>
            </DialogTitle>
            <DialogDescription className="text-slate-500 text-xs font-light">Your consultation fee invoices and transaction receipts</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-3">
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 border border-slate-100 rounded-xl bg-slate-50/50">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">Inv-2026-9081</span>
                  <span className="text-[10px] text-slate-400 font-light block">Dr. Elena Santos (Cardiology)</span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-black text-slate-800 block">₱1,500.00</span>
                  <Badge className="bg-emerald-50 text-emerald-700 border-none text-[8px] mt-1 font-bold">Paid</Badge>
                </div>
              </div>

              <div className="flex justify-between items-center p-3 border border-slate-100 rounded-xl bg-slate-50/50">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">Inv-2026-8712</span>
                  <span className="text-[10px] text-slate-400 font-light block">Dr. Sofia Chen (Pediatrics)</span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-black text-slate-800 block">₱800.00</span>
                  <Badge className="bg-emerald-50 text-emerald-700 border-none text-[8px] mt-1 font-bold">Paid</Badge>
                </div>
              </div>
            </div>

            <div className="p-3 bg-teal-50/50 border border-teal-200 rounded-2xl flex items-start gap-2.5">
              <ShieldCheck className="h-5 w-5 text-[#0a5c5f] shrink-0 mt-0.5" />
              <div>
                <h5 className="text-xs font-bold text-slate-800">Outstanding Balance: ₱0.00</h5>
                <p className="text-[10px] text-slate-500 font-light leading-relaxed mt-0.5">
                  All accounts are fully paid. Invoices are automatically cleared using your synced insurance.
                </p>
              </div>
            </div>

            <Button 
              onClick={() => setActivePopup(null)} 
              className="w-full bg-[#0a5c5f] hover:bg-[#084a4c] text-white rounded-xl h-11 font-semibold"
            >
              Close Invoices
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Interactive Calendar Modal popup */}
      <Dialog open={activePopup === "calendar"} onOpenChange={() => setActivePopup(null)}>
        <DialogContent className="max-w-md rounded-3xl p-6 bg-white border border-slate-100">
          <DialogHeader className="pb-3 border-b border-slate-100">
            <DialogTitle className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-[#0a5c5f]" />
              <span>Consultation Calendar</span>
            </DialogTitle>
            <DialogDescription className="text-slate-500 text-xs font-light">Calendar view of upcoming and recent appointments</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-3">
            {/* Simple simulated monthly grid (May 2026) */}
            <div className="border border-slate-100 p-4 rounded-2xl bg-slate-50/30">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-extrabold text-slate-800">May 2026</span>
                <span className="text-[9px] text-slate-400 font-bold uppercase">Telehealth Shifts</span>
              </div>
              <div className="grid grid-cols-7 gap-1.5 text-center text-[10px] font-bold text-slate-400 mb-2">
                <span>SU</span><span>MO</span><span>TU</span><span>WE</span><span>TH</span><span>FR</span><span>SA</span>
              </div>
              <div className="grid grid-cols-7 gap-1.5 text-center text-xs font-semibold text-slate-700">
                {/* Pad first week slots */}
                <span className="text-slate-300">26</span><span className="text-slate-300">27</span><span className="text-slate-300">28</span><span className="text-slate-300">29</span><span className="text-slate-300">30</span>
                <span>1</span><span>2</span>
                <span>3</span><span>4</span><span>5</span><span>6</span><span>7</span><span>8</span><span>9</span>
                <span>10</span><span>11</span><span>12</span><span>13</span><span>14</span><span className="bg-[#0a5c5f] text-white rounded-full flex items-center justify-center h-6 w-6 mx-auto relative shadow-sm cursor-pointer" title="Seeded Doctor Shift">15</span><span>16</span>
                <span>17</span><span>18</span><span>19</span><span>20</span><span>21</span><span>22</span><span>23</span>
                <span>24</span><span>25</span><span>26</span><span className="bg-[#0a5c5f] text-white rounded-full flex items-center justify-center h-6 w-6 mx-auto relative shadow-sm cursor-pointer" title="Booked Consultation Slot">27</span><span className="border border-[#0a5c5f] text-[#0a5c5f] rounded-full flex items-center justify-center h-6 w-6 mx-auto relative" title="Today">28</span><span>29</span><span>30</span>
                <span>31</span><span className="text-slate-300">1</span><span className="text-slate-300">2</span><span className="text-slate-300">3</span><span className="text-slate-300">4</span><span className="text-slate-300">5</span><span className="text-slate-300">6</span>
              </div>
            </div>

            <div className="p-3 bg-teal-50/50 border border-teal-200 rounded-xl flex items-start gap-2.5">
              <div className="h-2 w-2 rounded-full bg-[#0a5c5f] mt-1.5 shrink-0 animate-pulse" />
              <p className="text-[10px] text-slate-500 font-light leading-relaxed">
                Highlighted days indicate active booked consultations. Hover or click dates to review slots.
              </p>
            </div>

            <Button 
              onClick={() => setActivePopup(null)} 
              className="w-full bg-[#0a5c5f] hover:bg-[#084a4c] text-white rounded-xl h-11 font-semibold"
            >
              Close Calendar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Full History Dialog popup */}
      <Dialog open={isHistoryPopupOpen} onOpenChange={setIsHistoryPopupOpen}>
        <DialogContent className="max-w-2xl rounded-3xl p-6 bg-white border border-slate-100">
          <DialogHeader className="pb-3 border-b border-slate-100">
            <DialogTitle className="text-xl font-extrabold text-[#0a5c5f] flex items-center gap-2">
              <FileText className="h-5 w-5 text-[#0a5c5f]" />
              <span>Full Consultation History</span>
            </DialogTitle>
            <DialogDescription className="text-slate-500 text-xs font-light">Complete record of your past telehealth visits</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-3 max-h-[400px] overflow-y-auto pr-1">
            {records.length === 0 ? (
              <p className="text-sm text-slate-400 italic text-center py-6">No consultation history available.</p>
            ) : (
              <div className="space-y-3">
                {records.map((rec) => {
                  const recDate = new Date(rec.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
                  return (
                    <div key={rec.id} className="p-4 border border-slate-100 rounded-2xl bg-slate-50/50 space-y-2 text-left">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-xs font-bold text-slate-800 block">Dr. {rec.doctor.user?.name}</span>
                          <span className="text-[10px] text-slate-400 font-light block">{rec.doctor.specialization} • {recDate}</span>
                        </div>
                        <Badge className="bg-teal-50 text-[#0a5c5f] hover:bg-teal-100 border border-teal-200 font-semibold rounded-full text-[9px] border-none shadow-none">
                          {rec.diagnosis}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-600 font-light leading-relaxed border-t border-slate-100 pt-2 mt-1 whitespace-pre-wrap">
                        <span className="font-bold block text-slate-700 mb-0.5">Treatment & Notes:</span>
                        {rec.treatment}
                        {rec.notes ? `\n\nNotes: ${rec.notes}` : ""}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
            <Button 
              onClick={() => setIsHistoryPopupOpen(false)} 
              className="w-full bg-[#0a5c5f] hover:bg-[#084a4c] text-white rounded-xl h-11 font-semibold mt-4"
            >
              Close History
            </Button>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
}
