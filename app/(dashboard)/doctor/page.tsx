import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { 
  Users, 
  Calendar, 
  Coins, 
  Video, 
  FileText, 
  Clock, 
  ArrowRight, 
  Plus, 
  CheckCircle2, 
  UserCheck 
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

export default async function DoctorDashboard() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  // Fetch doctor details from database
  const doctor = await prisma.doctor.findUnique({
    where: { userId: session.user.id },
    include: { user: true }
  });

  const doctorName = session.user.name || "Doctor";
  const specialization = doctor?.specialization || "General Medicine";
  const consultFee = doctor?.consultFee ? Number(doctor.consultFee) : 500;
  const experienceYears = doctor?.experienceYears || 0;

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <p className="text-sm font-medium text-[#0a5c5f]">Welcome back, Dr. {doctorName.split(" ").slice(-1)[0]}</p>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">Your Practice Overview</h1>
        </div>
        <div className="flex gap-3">
          <Button asChild className="bg-[#0a5c5f] hover:bg-[#084a4c] text-white flex items-center gap-2 rounded-xl h-11">
            <Link href="/doctor/schedule">
              <Clock className="h-4 w-4" />
              <span>Configure Schedule</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Professional Info Banner */}
      <div className="bg-[#0a5c5f]/5 border border-[#0a5c5f]/10 p-4 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12 border border-[#0a5c5f]/20 bg-[#0a5c5f]/10 flex items-center justify-center text-[#0a5c5f]">
            <AvatarFallback className="font-bold">Dr</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-bold text-slate-900 text-lg">Dr. {doctorName}</h3>
            <p className="text-sm text-slate-600 font-medium">{specialization} Specialist • {experienceYears} Years Exp.</p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div>
            <span className="text-xs text-slate-500 block uppercase font-bold">Consultation Fee</span>
            <span className="text-xl font-extrabold text-[#0a5c5f] mt-0.5">₱{consultFee.toLocaleString()}</span>
          </div>
          <div>
            <span className="text-xs text-slate-500 block uppercase font-bold">PRC License No.</span>
            <span className="text-slate-800 font-mono font-semibold">{doctor?.licenseNumber || "N/A"}</span>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-slate-100 shadow-sm rounded-2xl bg-white overflow-hidden">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-slate-500 text-sm font-medium">Total Consultations</span>
              <p className="text-4xl font-extrabold text-slate-900">142</p>
            </div>
            <div className="p-4 bg-teal-50 text-[#0a5c5f] rounded-2xl">
              <Users className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-100 shadow-sm rounded-2xl bg-white overflow-hidden">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-slate-500 text-sm font-medium">Upcoming Today</span>
              <p className="text-4xl font-extrabold text-slate-900">5</p>
            </div>
            <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl">
              <Calendar className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-100 shadow-sm rounded-2xl bg-white overflow-hidden">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-slate-500 text-sm font-medium">Monthly Earnings</span>
              <p className="text-4xl font-extrabold text-slate-900">₱42,500</p>
            </div>
            <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl">
              <Coins className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Today's Consultations */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="border-slate-100 shadow-sm rounded-2xl bg-white">
            <CardHeader className="flex flex-row justify-between items-center px-6 pt-6 pb-2">
              <div>
                <CardTitle className="text-xl font-bold text-slate-900">Today's Patients</CardTitle>
                <CardDescription className="text-slate-500 font-light mt-0.5">Your schedule for May 27, 2026</CardDescription>
              </div>
              <Badge className="bg-emerald-50 text-emerald-600 border border-emerald-200 font-semibold px-3 py-1 rounded-full">
                Active Session
              </Badge>
            </CardHeader>
            <CardContent className="px-6 pb-6 space-y-4">
              {/* Patient 1 */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border border-slate-100 hover:border-slate-200 transition-all rounded-2xl bg-slate-50/50 gap-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12 border border-slate-200">
                    <AvatarFallback className="bg-[#0a5c5f]/5 text-[#0a5c5f] font-bold">MS</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-bold text-slate-800">Maria Santos</h4>
                    <p className="text-xs text-slate-500 font-medium">Symptom: Persistent palpitations and mild fatigue</p>
                    <p className="text-xs text-slate-400 mt-1 font-light flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>10:30 AM - 11:00 AM (Follow-up)</span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
                  <Badge className="bg-emerald-50 text-emerald-600 border border-emerald-200 font-semibold px-2.5 py-0.5 rounded-full">
                    Ready
                  </Badge>
                  <Button size="sm" className="bg-[#0a5c5f] hover:bg-[#084a4c] text-white flex items-center gap-1.5 rounded-lg h-9 px-4">
                    <Video className="h-4 w-4" />
                    <span className="text-xs">Start Call</span>
                  </Button>
                </div>
              </div>

              {/* Patient 2 */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border border-slate-100 hover:border-slate-200 transition-all rounded-2xl bg-slate-50/50 gap-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12 border border-slate-200">
                    <AvatarFallback className="bg-blue-50 text-blue-600 font-bold">JD</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-bold text-slate-800">John Doe</h4>
                    <p className="text-xs text-slate-500 font-medium">Symptom: Sore throat and persistent low-grade fever</p>
                    <p className="text-xs text-slate-400 mt-1 font-light flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>11:15 AM - 11:45 AM (Initial Consultation)</span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
                  <Badge className="bg-slate-100 text-slate-600 border border-slate-200 font-semibold px-2.5 py-0.5 rounded-full">
                    Confirmed
                  </Badge>
                  <Button size="sm" variant="outline" className="border-slate-200 text-slate-600 hover:bg-slate-100 flex items-center gap-1.5 rounded-lg h-9 px-4">
                    <Video className="h-4 w-4" />
                    <span className="text-xs">Call Link</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Practice History Table */}
          <Card className="border-slate-100 shadow-sm rounded-2xl bg-white overflow-hidden">
            <CardHeader className="px-6 pt-6 pb-2">
              <CardTitle className="text-xl font-bold text-slate-900">Recent Consultations</CardTitle>
              <CardDescription className="text-slate-500 font-light mt-0.5">Records of your recently completed consult sessions</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead className="px-6 py-3 font-semibold text-slate-700">DATE</TableHead>
                    <TableHead className="font-semibold text-slate-700">PATIENT</TableHead>
                    <TableHead className="font-semibold text-slate-700">DIAGNOSIS</TableHead>
                    <TableHead className="font-semibold text-slate-700">STATUS</TableHead>
                    <TableHead className="text-center font-semibold text-slate-700">ACTIONS</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow className="hover:bg-slate-50/50">
                    <TableCell className="px-6 py-4 text-slate-600 font-medium">May 25, 2026</TableCell>
                    <TableCell className="text-slate-800 font-bold">Ana Pascual</TableCell>
                    <TableCell className="text-slate-600">Acute Bronchitis</TableCell>
                    <TableCell>
                      <Badge className="bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-200 font-medium rounded-full">
                        COMPLETED
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Button variant="ghost" size="icon" className="hover:bg-[#0a5c5f]/5 text-[#0a5c5f]">
                        <FileText className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Right Side: Quick Actions & Schedule */}
        <div className="space-y-8">
          {/* Quick Actions */}
          <Card className="border-slate-100 shadow-sm rounded-2xl bg-white">
            <CardHeader className="px-6 pt-6 pb-2">
              <CardTitle className="text-lg font-bold text-slate-900">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-6 space-y-3">
              <Button asChild variant="outline" className="w-full border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 justify-between px-4 rounded-xl h-11">
                <Link href="/doctor/schedule">
                  <span className="text-sm font-semibold">Update Weekly Hours</span>
                  <ArrowRight className="h-4 w-4 text-slate-400" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 justify-between px-4 rounded-xl h-11">
                <Link href="/doctor/records">
                  <span className="text-sm font-semibold">Write Consultation Notes</span>
                  <ArrowRight className="h-4 w-4 text-slate-400" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Schedule parameters */}
          <Card className="border-slate-100 shadow-sm rounded-2xl bg-white">
            <CardHeader className="px-6 pt-6 pb-2">
              <CardTitle className="text-lg font-bold text-slate-900">Active Schedule</CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-6 space-y-4">
              <div className="flex justify-between items-center py-2.5 border-b border-slate-100">
                <span className="text-sm font-semibold text-slate-700">Monday</span>
                <span className="text-xs text-slate-500 font-mono">09:00 AM - 05:00 PM</span>
              </div>
              <div className="flex justify-between items-center py-2.5 border-b border-slate-100">
                <span className="text-sm font-semibold text-slate-700">Wednesday</span>
                <span className="text-xs text-slate-500 font-mono">09:00 AM - 05:00 PM</span>
              </div>
              <div className="flex justify-between items-center py-2.5">
                <span className="text-sm font-semibold text-slate-700">Friday</span>
                <span className="text-xs text-slate-500 font-mono">09:00 AM - 05:00 PM</span>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}