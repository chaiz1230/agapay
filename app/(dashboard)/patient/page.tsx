import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { 
  FileText, 
  Pill, 
  CreditCard, 
  Plus, 
  Download, 
  Video, 
  Eye, 
  Search,
  CheckSquare,
  ArrowRight,
  TrendingUp
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

export default async function PatientDashboard() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const firstName = session.user.name ? session.user.name.split(" ")[0] : "Patient";

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <p className="text-sm font-medium text-[#0a5c5f]">Welcome back, {firstName}</p>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">Your Health Overview</h1>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="flex items-center gap-2 border-slate-200 hover:bg-slate-100 rounded-xl h-11">
            <Download className="h-4 w-4" />
            <span>Export Records</span>
          </Button>
          <Button asChild className="bg-[#0a5c5f] hover:bg-[#084a4c] text-white flex items-center gap-2 rounded-xl h-11">
            <Link href="/patient/doctors">
              <Plus className="h-4 w-4" />
              <span>Book New Consultation</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-slate-100 shadow-sm hover:shadow-md transition-shadow rounded-2xl bg-white overflow-hidden group">
          <CardContent className="p-6 flex items-start gap-4">
            <div className="p-3.5 bg-teal-50 text-[#0a5c5f] rounded-2xl group-hover:bg-[#0a5c5f]/10 transition-colors">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-lg">Medical Records</h3>
              <p className="text-slate-500 text-sm mt-1 leading-relaxed">
                Access your lab results, summaries and vaccination history.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-100 shadow-sm hover:shadow-md transition-shadow rounded-2xl bg-white overflow-hidden group">
          <CardContent className="p-6 flex items-start gap-4">
            <div className="p-3.5 bg-teal-50 text-[#0a5c5f] rounded-2xl group-hover:bg-[#0a5c5f]/10 transition-colors">
              <Pill className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-lg">Prescriptions</h3>
              <p className="text-slate-500 text-sm mt-1 leading-relaxed">
                Renew or view active medications prescribed by your doctors.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-100 shadow-sm hover:shadow-md transition-shadow rounded-2xl bg-white overflow-hidden group">
          <CardContent className="p-6 flex items-start gap-4">
            <div className="p-3.5 bg-teal-50 text-[#0a5c5f] rounded-2xl group-hover:bg-[#0a5c5f]/10 transition-colors">
              <CreditCard className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-lg">Billing</h3>
              <p className="text-slate-500 text-sm mt-1 leading-relaxed">
                Manage your consultation invoices, payments, and insurance details.
              </p>
            </div>
          </CardContent>
        </Card>
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
                <CardDescription className="text-slate-500 font-light mt-0.5">Your scheduled telehealth calls</CardDescription>
              </div>
              <Button variant="link" className="text-[#0a5c5f] font-semibold hover:underline px-0">
                View Calendar
              </Button>
            </CardHeader>
            <CardContent className="px-6 pb-6 space-y-4">
              {/* Appointment 1 */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border border-slate-100 hover:border-slate-200 transition-colors rounded-2xl bg-slate-50/50 gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-center justify-center bg-white border border-slate-200 h-16 w-16 rounded-xl shadow-sm">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Oct</span>
                    <span className="text-2xl font-extrabold text-[#0a5c5f]">24</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800">Dr. Elena Santos</h4>
                    <p className="text-xs text-slate-500 font-medium">Cardiology • Follow-up Consultation</p>
                    <p className="text-xs text-slate-400 mt-1 font-light">10:30 AM - 11:00 AM</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
                  <Badge className="bg-[#0a5c5f]/10 text-[#0a5c5f] hover:bg-[#0a5c5f]/15 font-semibold px-3 py-1 rounded-full border-none">
                    Confirmed
                  </Badge>
                  <Button size="sm" className="bg-[#0a5c5f] hover:bg-[#084a4c] text-white flex items-center gap-1.5 rounded-lg h-9 px-4">
                    <Video className="h-4 w-4" />
                    <span className="text-xs">Join Call</span>
                  </Button>
                </div>
              </div>

              {/* Appointment 2 */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border border-slate-100 hover:border-slate-200 transition-colors rounded-2xl bg-slate-50/50 gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-center justify-center bg-white border border-slate-200 h-16 w-16 rounded-xl shadow-sm">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Nov</span>
                    <span className="text-2xl font-extrabold text-[#0a5c5f]">02</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800">Dr. Marcus Chen</h4>
                    <p className="text-xs text-slate-500 font-medium">Dermatology • Initial Screening</p>
                    <p className="text-xs text-slate-400 mt-1 font-light flex items-center gap-1">
                      <Video className="h-3 w-3" />
                      <span>Video Call Link Pending</span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
                  <Badge className="bg-rose-50 text-rose-600 hover:bg-rose-100 font-semibold px-3 py-1 rounded-full border border-rose-200">
                    Pending Payment
                  </Badge>
                  <Button variant="ghost" className="text-rose-600 hover:text-rose-800 hover:bg-rose-50 font-bold text-xs h-9 px-4 rounded-lg">
                    Pay Now
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Consultations */}
          <Card className="border-slate-100 shadow-sm rounded-2xl bg-white overflow-hidden">
            <CardHeader className="px-6 pt-6 pb-2">
              <CardTitle className="text-xl font-bold text-slate-900">Recent Consultations</CardTitle>
              <CardDescription className="text-slate-500 font-light mt-0.5">Summary of your past consultations and outcomes</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead className="px-6 py-3 font-semibold text-slate-700">DATE</TableHead>
                    <TableHead className="font-semibold text-slate-700">PROVIDER</TableHead>
                    <TableHead className="font-semibold text-slate-700">SPECIALTY</TableHead>
                    <TableHead className="font-semibold text-slate-700">OUTCOME</TableHead>
                    <TableHead className="text-center font-semibold text-slate-700">ACTIONS</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow className="hover:bg-slate-50/50">
                    <TableCell className="px-6 py-4 text-slate-600 font-medium">Oct 12, 2024</TableCell>
                    <TableCell className="text-slate-800 font-bold">Dr. Elena Santos</TableCell>
                    <TableCell className="text-slate-600">Cardiology</TableCell>
                    <TableCell>
                      <Badge className="bg-teal-50 text-[#0a5c5f] hover:bg-teal-100 border border-teal-200 font-medium rounded-full">
                        PRESCRIPTION ISSUED
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Button variant="ghost" size="icon" className="hover:bg-[#0a5c5f]/5 text-[#0a5c5f]">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow className="hover:bg-slate-50/50">
                    <TableCell className="px-6 py-4 text-slate-600 font-medium">Sep 28, 2024</TableCell>
                    <TableCell className="text-slate-800 font-bold">Dr. Sarah Vane</TableCell>
                    <TableCell className="text-slate-600">General Practice</TableCell>
                    <TableCell>
                      <Badge className="bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200 font-medium rounded-full">
                        ROUTINE CHECKUP
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Button variant="ghost" size="icon" className="hover:bg-[#0a5c5f]/5 text-[#0a5c5f]">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <div className="py-4 border-t border-slate-100 text-center">
                <Button variant="ghost" className="text-[#0a5c5f] hover:bg-[#0a5c5f]/5 font-semibold text-sm rounded-lg px-6">
                  See full history
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Side: Reminders, Specialists & Health Score */}
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
                  <p className="text-[11px] text-slate-400 font-light mt-0.5">Post-lunch dosage recommended by Dr. Vane.</p>
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

          {/* Recommended Specialists */}
          <Card className="border-slate-100 shadow-sm rounded-2xl bg-white">
            <CardHeader className="px-6 pt-6 pb-2">
              <CardTitle className="text-lg font-bold text-slate-900">Recommended for You</CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-6 space-y-4">
              {/* Doctor 1 */}
              <div className="flex justify-between items-center gap-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 border border-slate-100">
                    <AvatarFallback className="bg-emerald-50 text-emerald-600 font-bold text-xs">JK</AvatarFallback>
                  </Avatar>
                  <div>
                    <h5 className="text-sm font-bold text-slate-800">Dr. Julian Kwok</h5>
                    <p className="text-[10px] text-slate-400 font-medium">Nutritionist • Weight Management</p>
                    <p className="text-[10px] text-amber-500 font-bold mt-0.5">★ 4.9 <span className="text-slate-400 font-light">(128 reviews)</span></p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="hover:bg-[#0a5c5f]/5 text-[#0a5c5f] rounded-lg">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {/* Doctor 2 */}
              <div className="flex justify-between items-center gap-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 border border-slate-100">
                    <AvatarFallback className="bg-blue-50 text-blue-600 font-bold text-xs">AS</AvatarFallback>
                  </Avatar>
                  <div>
                    <h5 className="text-sm font-bold text-slate-800">Dr. Anya Sharma</h5>
                    <p className="text-[10px] text-slate-400 font-medium">Endocrinologist • Thyroid Care</p>
                    <p className="text-[10px] text-amber-500 font-bold mt-0.5">★ 5.0 <span className="text-slate-400 font-light">(84 reviews)</span></p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="hover:bg-[#0a5c5f]/5 text-[#0a5c5f] rounded-lg">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <Button asChild variant="outline" className="w-full text-[#0a5c5f] hover:bg-[#0a5c5f]/5 hover:text-[#0a5c5f] border-slate-200 font-semibold text-xs rounded-xl h-10 mt-2">
                <Link href="/patient/doctors">
                  <span>Discover more specialists</span>
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Wellness Score Card */}
          <Card className="bg-[#0a5c5f] text-white rounded-2xl shadow-sm border-none overflow-hidden relative">
            <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-x-6 translate-y-6">
              <TrendingUp className="h-48 w-48" />
            </div>
            <CardHeader className="p-6 pb-2">
              <CardTitle className="text-white font-medium text-sm tracking-wider uppercase">Wellness Score</CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0 space-y-4">
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-extrabold tracking-tight">84</span>
                <span className="text-teal-200 text-lg">/ 100</span>
              </div>
              <p className="text-teal-50 text-xs font-light leading-relaxed">
                Your health metrics have improved by 12% since last month. Great job on the consistent activity!
              </p>
              <Button className="w-full bg-white hover:bg-slate-100 text-[#0a5c5f] font-bold text-xs h-10 rounded-xl transition-all shadow-sm">
                View Detailed Analysis
              </Button>
            </CardContent>
          </Card>

        </div>

      </div>
    </div>
  );
}