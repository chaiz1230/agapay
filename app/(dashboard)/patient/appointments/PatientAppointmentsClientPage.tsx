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
  Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cancelAppointment, rescheduleAppointment } from "@/actions/appointments";
import { getMeetUrl } from "@/utils/meet";

interface PatientAppointmentsClientPageProps {
  appointments: any[];
  patientId: string;
}

const getDoctorImage = (name: string) => {
  const lowercaseName = name.toLowerCase();
  if (lowercaseName.includes("santos")) return "/dr_elena_santos.png";
  if (lowercaseName.includes("chen")) return "/dr_sofia_chen.png";
  if (lowercaseName.includes("rivera")) return "/dr_marco_rivera.png";
  return "/dr_julian_reyes.png";
};

export default function PatientAppointmentsClientPage({ appointments, patientId }: PatientAppointmentsClientPageProps) {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState("All");
  
  // Reschedule state
  const [rescheduleTarget, setRescheduleTarget] = useState<any | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState("2026-05-28");
  const [rescheduleTime, setRescheduleTime] = useState("09:00 AM");
  
  // Loading & Notification state
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Active prescription modal target
  const [selectedPrescriptionAppt, setSelectedPrescriptionAppt] = useState<any | null>(null);

  const timeslots = [
    "09:00 AM", "10:30 AM", "11:15 AM", "02:00 PM", "03:30 PM", "04:15 PM"
  ];

  // Filters mapping
  const filteredAppointments = appointments.filter((appt) => {
    if (activeFilter === "All") return true;
    if (activeFilter === "Pending") return appt.status === "PENDING";
    if (activeFilter === "Confirmed") return appt.status === "CONFIRMED";
    if (activeFilter === "Completed") return appt.status === "COMPLETED";
    if (activeFilter === "Cancelled") return appt.status === "CANCELLED";
    return true;
  });

  const handleCancel = async (appointmentId: string) => {
    if (!confirm("Are you sure you want to cancel this consultation appointment?")) return;

    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    const result = await cancelAppointment(appointmentId);

    if (result.error) {
      setErrorMessage(result.error);
    } else {
      setSuccessMessage("Appointment cancelled successfully.");
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
      setSuccessMessage("Reschedule request submitted successfully! Awaiting doctor approval.");
      setRescheduleTarget(null);
      router.refresh();
    }
    setIsLoading(false);
  };

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Your Consultations</h1>
          <p className="text-slate-500 font-light mt-1">Manage your active bookings, view schedule details, or cancel appointments</p>
        </div>
        <Button asChild className="bg-[#0a5c5f] hover:bg-[#084a4c] text-white flex items-center gap-2 rounded-xl h-11">
          <Link href="/patient/doctors">
            <Calendar className="h-4 w-4" />
            <span>Book New Appointment</span>
          </Link>
        </Button>
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
            {filter === "All" ? "All Bookings" : filter}
          </button>
        ))}
      </div>

      {/* Appointments List Layout */}
      {filteredAppointments.length === 0 ? (
        <div className="text-center py-16 bg-white border border-slate-100 rounded-3xl space-y-4">
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
            const docImage = getDoctorImage(appt.doctor.user?.name || "");

            const meetUrl = getMeetUrl(appt.id);

            const isPending = appt.status === "PENDING";
            const isConfirmed = appt.status === "CONFIRMED";
            const isCompleted = appt.status === "COMPLETED";

            return (
              <Card key={appt.id} className="border-slate-100 shadow-sm rounded-2xl bg-white overflow-hidden hover:shadow-md transition-shadow flex flex-col justify-between">
                <div className="p-5 space-y-4">
                  {/* Doctor Profile info */}
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3.5">
                      <img 
                        src={docImage} 
                        alt={appt.doctor.user?.name}
                        className="h-12 w-12 rounded-xl object-cover border border-slate-100 shadow-sm"
                      />
                      <div>
                        <h4 className="font-extrabold text-slate-800 text-sm">Dr. {appt.doctor.user?.name}</h4>
                        <p className="text-[11px] text-slate-500 font-semibold">{appt.doctor.specialization} Specialist</p>
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
                      <span className="text-[9px] font-bold text-slate-400 block uppercase">Google Meet Session Link</span>
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
                  {(isPending || isConfirmed) && (
                    <>
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
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        disabled={isLoading}
                        onClick={() => handleCancel(appt.id)}
                        className="rounded-xl h-10 w-10 p-0 text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                  {isConfirmed && (
                    <Button asChild size="sm" className="flex-1 bg-[#0a5c5f] hover:bg-[#084a4c] text-white rounded-xl h-10 font-bold text-xs">
                      <a href={meetUrl} target="_blank" rel="noopener noreferrer">Join Call Room</a>
                    </Button>
                  )}
                  {isCompleted && (
                    <div className="flex w-full gap-2">
                      <Button asChild size="sm" className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs h-10 rounded-xl border-none shadow-none">
                        <Link href="/patient/records" className="flex items-center justify-center gap-1">
                          <span>View EHR Record</span>
                          <ChevronRight className="h-4 w-4" />
                        </Link>
                      </Button>
                      {appt.prescription && (
                        <Button 
                          size="sm" 
                          onClick={() => setSelectedPrescriptionAppt(appt)}
                          className="flex-1 bg-[#0a5c5f]/10 text-[#0a5c5f] hover:bg-[#0a5c5f]/20 font-bold text-xs h-10 rounded-xl border-none shadow-none"
                        >
                          View Prescription
                        </Button>
                      )}
                    </div>
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
              <DialogDescription className="text-slate-500 text-xs font-light">Propose a new date and timeslot for your visit</DialogDescription>
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
                  className="flex-1 bg-[#0a5c5f] hover:bg-[#084a4c] text-white rounded-xl h-11 font-semibold"
                >
                  Request Reschedule
                </Button>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>

      {/* View Prescription Dialog */}
      <Dialog open={!!selectedPrescriptionAppt} onOpenChange={() => setSelectedPrescriptionAppt(null)}>
        {selectedPrescriptionAppt && (
          <DialogContent className="max-w-lg rounded-3xl p-6 bg-white border border-slate-100 font-sans">
            <DialogHeader className="pb-3 border-b border-slate-100 text-center">
              <div className="mx-auto bg-[#0a5c5f]/5 p-2 rounded-2xl w-fit mb-2">
                <span className="text-[#0a5c5f] font-black tracking-widest text-lg">AGAPAY CLINICAL CARE</span>
              </div>
              <DialogTitle className="text-sm font-bold text-slate-500 uppercase tracking-widest">Electronic Prescription</DialogTitle>
              <DialogDescription className="text-xs text-slate-400 font-light">Verified digital Rx prescription document</DialogDescription>
            </DialogHeader>

            <div className="py-6 space-y-6">
              {/* Doctor and License Info */}
              <div className="flex justify-between items-start text-xs border-b border-slate-100 pb-4">
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">Dr. {selectedPrescriptionAppt.doctor.user.name}</h4>
                  <p className="text-slate-500">{selectedPrescriptionAppt.doctor.specialization} Specialist</p>
                  <p className="text-[10px] text-slate-400 mt-1">PRC License No: {selectedPrescriptionAppt.doctor.licenseNumber || "N/A"}</p>
                </div>
                <div className="text-right text-slate-500">
                  <p className="font-semibold">Date Issued:</p>
                  <p className="text-slate-800 font-bold">{new Date(selectedPrescriptionAppt.dateTime).toLocaleDateString("en-US", {
                    month: "long", day: "numeric", year: "numeric"
                  })}</p>
                </div>
              </div>

              {/* Rx prescription pad details */}
              <div className="relative bg-slate-50/50 p-6 rounded-2xl border border-slate-100 space-y-4">
                <span className="absolute top-2 left-4 text-slate-200 font-serif text-6xl select-none font-bold italic">Rx</span>
                <div className="pt-6 pl-4 space-y-3 z-10 relative">
                  <p className="text-xs font-bold text-slate-700 uppercase tracking-wide">Medication & Dosage Instructions</p>
                  <div className="text-sm text-slate-600 leading-relaxed font-mono bg-white border border-slate-100 p-4 rounded-xl shadow-sm whitespace-pre-line">
                    {selectedPrescriptionAppt.prescription}
                  </div>
                </div>
              </div>

              {/* Footer details / verification */}
              <div className="text-center space-y-2 border-t border-slate-100 pt-4">
                <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold px-3 py-1 rounded-full">
                  <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                  <span>Electronically Signed & Secured</span>
                </div>
                <p className="text-[10px] text-slate-400 font-light">
                  This document serves as an official electronic prescription. If you require a printed copy for pharmacy presentation, please click print or take a screenshot.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => setSelectedPrescriptionAppt(null)}
                className="flex-1 rounded-xl h-11 border-slate-200"
              >
                Close
              </Button>
              <Button 
                onClick={() => window.print()}
                className="flex-1 bg-[#0a5c5f] hover:bg-[#084a4c] text-white rounded-xl h-11 font-semibold flex items-center justify-center gap-2"
              >
                Print Prescription
              </Button>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
