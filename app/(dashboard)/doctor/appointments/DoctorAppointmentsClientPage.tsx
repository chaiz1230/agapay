"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Calendar, 
  Clock, 
  Video, 
  AlertCircle, 
  X, 
  ChevronRight, 
  Coins, 
  CalendarDays,
  User,
  CheckCircle2,
  Trash2,
  Search,
  SlidersHorizontal,
  ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { getMeetUrl } from "@/utils/meet";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar } from "@/components/ui/avatar";
import { approveAppointment, rescheduleAppointment } from "@/actions/appointments";

interface DoctorAppointmentsClientPageProps {
  appointments: any[];
  doctorId: string;
}

export default function DoctorAppointmentsClientPage({ appointments, doctorId }: DoctorAppointmentsClientPageProps) {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Reschedule state
  const [rescheduleTarget, setRescheduleTarget] = useState<any | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState("2026-05-28");
  const [rescheduleTime, setRescheduleTime] = useState("09:00 AM");
  
  // Loading & Notification state
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const timeslots = [
    "09:00 AM", "10:30 AM", "11:15 AM", "02:00 PM", "03:30 PM", "04:15 PM"
  ];

  // Filters mapping
  const filteredAppointments = appointments.filter((appt) => {
    const matchesSearch = appt.patient?.user?.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (appt.notes && appt.notes.toLowerCase().includes(searchQuery.toLowerCase()));
                          
    if (!matchesSearch) return false;

    if (activeFilter === "All") return true;
    if (activeFilter === "Pending") return appt.status === "PENDING";
    if (activeFilter === "Confirmed") return appt.status === "CONFIRMED";
    if (activeFilter === "Completed") return appt.status === "COMPLETED";
    if (activeFilter === "Cancelled") return appt.status === "CANCELLED";
    return true;
  });

  const handleApprove = async (appointmentId: string) => {
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    const result = await approveAppointment(appointmentId);

    if (result.error) {
      setErrorMessage(result.error);
    } else {
      setSuccessMessage("Appointment approved successfully.");
      router.refresh();
    }
    setIsLoading(false);
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

    const result = await rescheduleAppointment(rescheduleTarget.id, appointmentDate);

    if (result.error) {
      setErrorMessage(result.error);
    } else {
      setSuccessMessage("Reschedule request submitted successfully!");
      setRescheduleTarget(null);
      router.refresh();
    }
    setIsLoading(false);
  };

  const getAge = (dobString: string) => {
    if (!dobString) return "N/A";
    const today = new Date();
    const birthDate = new Date(dobString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Consultation Appointments</h1>
          <p className="text-slate-500 font-light mt-1">Review scheduled calls, approve new requests, and update bookings</p>
        </div>
      </div>

      {/* Floating Status Notification Toast */}
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

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
        <Input
          type="text"
          placeholder="Search by patient name or symptom note..."
          className="pl-10 h-11 border-slate-200 focus:border-[#0a5c5f] focus:ring-[#0a5c5f]/10 rounded-xl"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Tab Filter Navigation */}
      <div className="flex gap-2 overflow-x-auto pb-2 border-b border-slate-200">
        {["All", "Pending", "Confirmed", "Completed", "Cancelled"].map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-4 py-2.5 text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
              activeFilter === filter
                ? "border-[#0a5c5f] text-[#0a5c5f]"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            {filter === "All" ? "All Appointments" : filter}
          </button>
        ))}
      </div>

      {/* Appointments List */}
      {filteredAppointments.length === 0 ? (
        <div className="text-center py-16 bg-white border border-slate-100 rounded-3xl space-y-4 shadow-sm">
          <div className="p-4 bg-slate-50 rounded-full inline-block text-slate-400">
            <Calendar className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">No appointments found</h3>
          <p className="text-slate-400 text-sm max-w-sm mx-auto">
            You don't have any appointments under "{activeFilter}" status.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredAppointments.map((appt) => {
            const apptDate = new Date(appt.dateTime);
            const dateStr = apptDate.toLocaleDateString("en-US", { 
              weekday: "long", month: "short", day: "numeric", year: "numeric" 
            });
            const timeStr = apptDate.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

            const meetUrl = getMeetUrl(appt.id);

            const isPending = appt.status === "PENDING";
            const isConfirmed = appt.status === "CONFIRMED";
            const isCompleted = appt.status === "COMPLETED";

            return (
              <Card key={appt.id} className="border-slate-100 shadow-sm rounded-2xl bg-white overflow-hidden hover:shadow-md transition-shadow flex flex-col justify-between">
                <div className="p-5 space-y-4">
                  {/* Patient Info */}
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 border border-slate-100 bg-[#0a5c5f]/5 text-[#0a5c5f] flex items-center justify-center font-bold text-sm">
                        <span>{appt.patient?.user?.name ? appt.patient.user.name[0] : "P"}</span>
                      </Avatar>
                      <div>
                        <h4 className="font-extrabold text-slate-800 text-sm">{appt.patient?.user?.name}</h4>
                        <p className="text-[11px] text-slate-500 font-semibold">
                          {appt.patient ? `${getAge(appt.patient.dateOfBirth)} Yrs • ${appt.patient.gender}` : "Patient"}
                        </p>
                      </div>
                    </div>
                    <Badge className={`font-semibold px-2.5 py-0.5 rounded-full border-none uppercase text-[9px] ${
                      isConfirmed 
                        ? "bg-emerald-50 text-emerald-700" 
                        : isPending 
                        ? "bg-amber-50 text-amber-700"
                        : isCompleted
                        ? "bg-slate-100 text-slate-600"
                        : "bg-rose-50 text-rose-700"
                    }`}>
                      {appt.status}
                    </Badge>
                  </div>

                  {/* Scheduled DateTime Details */}
                  <div className="flex gap-4 p-3.5 bg-slate-50/50 border border-slate-100 rounded-xl text-xs text-slate-500 font-medium">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-4 w-4 text-[#0a5c5f]" />
                      <span>{dateStr}</span>
                    </div>
                    <div className="flex items-center gap-1.5 border-l border-slate-200 pl-4">
                      <Clock className="h-4 w-4 text-[#0a5c5f]" />
                      <span>{timeStr}</span>
                    </div>
                  </div>

                  {/* Consultation Notes */}
                  {appt.notes && (
                    <div className="text-xs text-slate-500 font-light italic leading-relaxed">
                      <span className="font-bold text-slate-700 not-italic block mb-0.5">Symptom Notes:</span>
                      "{appt.notes}"
                    </div>
                  )}

                  {/* Google Meet link details */}
                  {(isConfirmed || isPending) && (
                    <div className="p-3 bg-teal-50/30 border border-teal-200/40 rounded-xl space-y-1.5">
                      <span className="text-[9px] font-bold text-slate-400 block uppercase">Google Meet Link</span>
                      <a 
                        href={meetUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-xs text-teal-600 hover:underline font-bold flex items-center gap-1.5 break-all"
                      >
                        <Video className="h-4 w-4 shrink-0" />
                        <span>{meetUrl}</span>
                      </a>
                    </div>
                  )}
                </div>

                {/* Footer Buttons Actions */}
                <div className="px-5 pb-5 pt-3 border-t border-slate-100 flex gap-2">
                  {isPending && (
                    <>
                      <Button 
                        size="sm" 
                        disabled={isLoading}
                        onClick={() => handleApprove(appt.id)}
                        className="flex-1 bg-[#0a5c5f] hover:bg-[#084a4c] text-white text-xs rounded-xl h-10 font-bold"
                      >
                        Approve
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        disabled={isLoading}
                        onClick={() => {
                          setRescheduleTarget(appt);
                          setRescheduleDate(appt.dateTime.split("T")[0]);
                        }}
                        className="flex-1 rounded-xl h-10 border-slate-200 text-slate-600 text-xs font-semibold bg-white hover:bg-slate-50"
                      >
                        Reschedule
                      </Button>
                    </>
                  )}
                  {isConfirmed && (
                    <>
                      <Button asChild size="sm" className="flex-1 bg-[#0a5c5f] hover:bg-[#084a4c] text-white rounded-xl h-10 font-bold text-xs">
                        <Link href={`/doctor/consultation/${appt.id}`}>Start Consultation EHR</Link>
                      </Button>
                      <Button asChild variant="outline" size="sm" className="flex-1 rounded-xl h-10 border-slate-200 text-slate-600 text-xs font-semibold bg-white hover:bg-slate-50">
                        <a href={meetUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 mr-1" />
                          <span>Launch Meet</span>
                        </a>
                      </Button>
                    </>
                  )}
                  {isCompleted && (
                    <Button asChild size="sm" className="flex-1 bg-[#0a5c5f]/10 text-[#0a5c5f] hover:bg-[#0a5c5f]/20 font-bold text-xs h-10 rounded-xl border-none shadow-none">
                      <Link href="/doctor/records" className="flex items-center justify-center gap-1">
                        <span>View Saved Record</span>
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Reschedule Consultation Dialog */}
      <Dialog open={!!rescheduleTarget} onOpenChange={() => setRescheduleTarget(null)}>
        {rescheduleTarget && (
          <DialogContent className="max-w-md rounded-3xl p-6 bg-white border border-slate-100">
            <DialogHeader className="pb-3 border-b border-slate-100">
              <DialogTitle className="text-xl font-extrabold text-slate-900">Reschedule Consultation</DialogTitle>
              <DialogDescription className="text-slate-500 text-xs font-light">Propose a new date and timeslot for the patient</DialogDescription>
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
                    className="pl-10 h-11 border-slate-200 rounded-xl"
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
                  {isLoading ? "Saving..." : "Reschedule Appointment"}
                </Button>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
