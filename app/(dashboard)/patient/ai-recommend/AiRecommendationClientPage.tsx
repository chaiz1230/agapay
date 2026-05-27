"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { BrainCircuit, Sparkles, Stethoscope, Star, Coins, ChevronRight } from "lucide-react";
import { getRecommendedSpecialists } from "@/actions/doctors";
import { bookAppointment } from "@/actions/appointments";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface AiRecommendationClientPageProps {
  patientId: string;
}

const getDoctorImage = (name: string) => {
  const lowercaseName = name.toLowerCase();
  if (lowercaseName.includes("santos")) return "/dr_elena_santos.png";
  if (lowercaseName.includes("chen") || lowercaseName.includes("lim")) return "/dr_sofia_chen.png";
  if (lowercaseName.includes("rivera") || lowercaseName.includes("marcus")) return "/dr_marco_rivera.png";
  return "/dr_julian_reyes.png";
};

export default function AiRecommendationClientPage({ patientId }: AiRecommendationClientPageProps) {
  const router = useRouter();
  const [symptoms, setSymptoms] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  
  // Booking Dialog State
  const [selectedDoctor, setSelectedDoctor] = useState<any | null>(null);
  const [bookingDate, setBookingDate] = useState("2026-05-28");
  const [bookingTime, setBookingTime] = useState("");
  const [bookingNotes, setBookingNotes] = useState("");
  const [isBookingLoading, setIsBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState<string | null>(null);

  const timeslots = ["09:00 AM", "10:30 AM", "11:15 AM", "02:00 PM", "03:30 PM", "04:15 PM"];

  const handleGetRecommendation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptoms.trim()) return;

    setIsLoading(true);
    setResult(null);

    const res = await getRecommendedSpecialists(symptoms);
    if (res.success) {
      setResult({
        specialization: res.specialization,
        doctors: res.doctors || [],
      });
    }
    setIsLoading(false);
  };

  const handleBookAppointment = async () => {
    if (!selectedDoctor || !bookingTime) {
      setBookingError("Please select a timeslot.");
      return;
    }

    setIsBookingLoading(true);
    setBookingError(null);
    setBookingSuccess(null);

    const [time, modifier] = bookingTime.split(" ");
    let [hours, minutes] = time.split(":").map(Number);
    if (modifier === "PM" && hours < 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0;

    const appointmentDate = new Date(bookingDate);
    appointmentDate.setHours(hours, minutes, 0, 0);

    const res = await bookAppointment({
      patientId: patientId,
      doctorId: selectedDoctor.id,
      dateTime: appointmentDate,
      notes: bookingNotes || `Recommended by AI Assistant: ${symptoms}`,
      cost: Number(selectedDoctor.consultFee),
    });

    if (res.error) {
      setBookingError(res.error);
    } else {
      setBookingSuccess("Appointment requested successfully! Redirecting...");
      setTimeout(() => {
        setSelectedDoctor(null);
        setBookingNotes("");
        setBookingTime("");
        setBookingSuccess(null);
        router.push("/patient/appointments");
      }, 1500);
    }
    setIsBookingLoading(false);
  };

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-3 bg-gradient-to-tr from-[#0a5c5f] to-emerald-600 text-white rounded-2xl shadow-md">
          <BrainCircuit className="h-7 w-7 animate-pulse" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">AI Specialist Assistant</h1>
          <p className="text-slate-500 font-light mt-1">Input your symptoms to automatically find the correct specialist</p>
        </div>
      </div>

      {/* Symptoms form input */}
      <Card className="border-slate-100 rounded-3xl shadow-sm bg-white overflow-hidden relative">
        <div className="absolute right-0 top-0 opacity-[0.03] text-slate-900 pointer-events-none p-4">
          <BrainCircuit className="h-48 w-48" />
        </div>
        <CardContent className="p-6 md:p-8 space-y-6">
          <form onSubmit={handleGetRecommendation} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="symptoms" className="text-sm font-semibold text-slate-800">
                Describe what you are feeling:
              </label>
              <textarea
                id="symptoms"
                rows={3}
                placeholder="e.g. I have a dry cough and breathing is slightly difficult... or I have an itchy skin rash on my forearm..."
                className="w-full border border-slate-200 focus:border-[#0a5c5f] focus:ring-1 focus:ring-[#0a5c5f]/10 rounded-2xl p-4 text-sm focus:outline-none placeholder-slate-400 leading-relaxed"
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <Button
              type="submit"
              className="bg-gradient-to-r from-[#0a5c5f] to-teal-700 hover:from-[#084a4c] hover:to-teal-800 text-white flex items-center justify-center gap-2 rounded-xl h-11 px-6 shadow-sm w-full sm:w-auto"
              disabled={isLoading || !symptoms.trim()}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Analyzing symptoms...</span>
                </div>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>Analyze Symptoms</span>
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Results output */}
      {result && (
        <div className="space-y-6">
          <div className="p-5 bg-teal-50 border border-teal-200/60 rounded-2xl flex items-start gap-4">
            <div className="p-2.5 bg-white text-[#0a5c5f] border border-teal-200/50 rounded-xl shrink-0">
              <Stethoscope className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Symptom Diagnostic Suggestion</h3>
              <p className="text-sm font-semibold text-slate-800 mt-1 leading-relaxed">
                Based on your symptom details, we recommend scheduling a consultation with a:
              </p>
              <Badge className="bg-[#0a5c5f] text-white hover:bg-[#0a5c5f] font-extrabold text-xs px-3.5 py-1.5 rounded-full mt-2.5 border-none shadow-sm">
                {result.specialization}
              </Badge>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-base font-extrabold text-slate-900">Recommended Specialist Partners</h3>
            
            {result.doctors.length === 0 ? (
              <p className="text-sm text-slate-500 italic bg-white border border-slate-100 p-6 rounded-2xl text-center">
                No doctors registered under this specialization yet. You can browse all available specialists in our directory.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {result.doctors.map((doctor: any) => {
                  const docImage = getDoctorImage(doctor.user?.name || "");
                  
                  return (
                    <Card key={doctor.id} className="border-slate-100 rounded-2xl bg-white shadow-sm hover:shadow-md transition-all p-4 flex flex-col justify-start">
                      <div className="flex items-center gap-3.5">
                        <img
                          src={docImage}
                          alt={doctor.user?.name}
                          className="h-12 w-12 rounded-xl object-cover border border-slate-100 shadow-sm shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <h4 className="font-extrabold text-slate-800 text-sm truncate">Dr. {doctor.user?.name}</h4>
                          <p className="text-[10px] text-slate-500 font-semibold">{doctor.specialization} Specialist</p>
                          <div className="flex items-center gap-1 text-amber-500 text-[10px] font-bold mt-0.5">
                            <Star className="h-3 w-3 fill-current" />
                            <span>4.9</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between border-t border-slate-100 pt-2.5 mt-2.5 text-xs text-slate-500">
                        <div className="flex items-center gap-1 font-bold text-[#0a5c5f]">
                          <Coins className="h-3.5 w-3.5" />
                          <span>₱{Number(doctor.consultFee).toLocaleString()}</span>
                        </div>
                        <Button
                          onClick={() => {
                            setSelectedDoctor(doctor);
                            setBookingTime("");
                            setBookingError(null);
                            setBookingSuccess(null);
                          }}
                          size="sm"
                          className="bg-[#0a5c5f] hover:bg-[#084a4c] text-white rounded-xl px-4 h-8 flex items-center gap-1 text-xs font-semibold"
                        >
                          <span>Book Now</span>
                          <ChevronRight className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Booking Dialog Modal */}
      <Dialog open={!!selectedDoctor} onOpenChange={() => setSelectedDoctor(null)}>
        {selectedDoctor && (
          <DialogContent className="max-w-md rounded-3xl p-6 bg-white border border-slate-100">
            <DialogHeader className="pb-3 border-b border-slate-100">
              <DialogTitle className="text-xl font-extrabold text-slate-900">Confirm Specialist</DialogTitle>
              <DialogDescription className="text-slate-500 text-xs font-light">Confirm the consultation parameters below</DialogDescription>
            </DialogHeader>

            <div className="space-y-5 pt-3">
              {bookingError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs font-medium">
                  {bookingError}
                </div>
              )}
              {bookingSuccess && (
                <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl text-teal-700 text-xs font-medium">
                  {bookingSuccess}
                </div>
              )}

              <div className="flex items-center gap-4 p-4 border border-slate-100 rounded-2xl bg-slate-50/50">
                <img
                  src={getDoctorImage(selectedDoctor.user?.name || "")}
                  alt={selectedDoctor.user?.name}
                  className="h-16 w-16 rounded-xl object-cover border-2 border-white shadow-sm"
                />
                <div>
                  <h4 className="font-extrabold text-slate-800 text-base">Dr. {selectedDoctor.user?.name}</h4>
                  <Badge className="bg-[#0a5c5f]/10 text-[#0a5c5f] hover:bg-[#0a5c5f]/15 font-semibold px-2 py-0.5 rounded mt-1 border-none text-[10px]">
                    {selectedDoctor.specialization}
                  </Badge>
                  <p className="text-[10px] text-slate-400 mt-1 font-light">PRC License No. {selectedDoctor.licenseNumber}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 border border-slate-100 bg-slate-50/30 rounded-2xl text-left">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">Service Type</span>
                  <span className="text-sm font-extrabold text-slate-800 mt-1 block">Telehealth Call</span>
                  <span className="text-xs font-bold text-[#0a5c5f] mt-0.5 block">₱{Number(selectedDoctor.consultFee).toLocaleString()}</span>
                </div>
                <div className="p-4 border border-slate-100 bg-slate-50/30 rounded-2xl text-left">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">Duration</span>
                  <span className="text-sm font-extrabold text-slate-800 mt-1 block">45 Minutes</span>
                  <span className="text-xs font-light text-slate-400 mt-0.5 block">Google Meet link</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="date" className="text-xs font-bold text-slate-700">Choose Consultation Date</Label>
                <Input
                  type="date"
                  id="date"
                  className="h-11 border-slate-200 rounded-xl"
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  disabled={isBookingLoading}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold text-slate-700">Select Available Timeslot</Label>
                <div className="grid grid-cols-3 gap-2">
                  {timeslots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setBookingTime(slot)}
                      className={`py-2.5 rounded-xl text-xs font-bold border transition-all ${
                        bookingTime === slot
                          ? "bg-[#0a5c5f] text-white border-transparent shadow-sm"
                          : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                      }`}
                      disabled={isBookingLoading}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setSelectedDoctor(null)}
                  className="flex-1 rounded-xl h-11 border-slate-200 text-slate-500 font-semibold"
                  disabled={isBookingLoading}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleBookAppointment}
                  className="flex-1 bg-[#0a5c5f] hover:bg-[#084a4c] text-white rounded-xl h-11 font-semibold flex items-center justify-center"
                  disabled={isBookingLoading}
                >
                  {isBookingLoading ? "Processing..." : "Confirm & Book"}
                </Button>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
