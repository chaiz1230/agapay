"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, Star, Clock, Video, ChevronRight, CalendarDays, Coins, Filter } from "lucide-react";
import { getSpecialistDoctors } from "@/actions/doctors";
import { bookAppointment } from "@/actions/appointments";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";

interface BrowseDoctorsClientPageProps {
  patientId: string;
}

// Fallback images matching our generated assets
const getDoctorImage = (name: string) => {
  const lowercaseName = name.toLowerCase();
  if (lowercaseName.includes("santos")) return "/dr_elena_santos.png";
  if (lowercaseName.includes("chen") || lowercaseName.includes("lim")) return "/dr_sofia_chen.png";
  if (lowercaseName.includes("rivera") || lowercaseName.includes("marcus")) return "/dr_marco_rivera.png";
  return "/dr_julian_reyes.png";
};

export default function BrowseDoctorsClientPage({ patientId }: BrowseDoctorsClientPageProps) {
  const router = useRouter();
  const [doctors, setDoctors] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("All Specialists");
  
  // Advanced filters local states
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [maxFee, setMaxFee] = useState<number>(2500);
  const [minExperience, setMinExperience] = useState<number>(0);

  const filteredDoctors = doctors.filter((doc) => {
    const fee = Number(doc.consultFee);
    const exp = Number(doc.experienceYears);
    return fee <= maxFee && exp >= minExperience;
  });
  
  // Booking Dialog state
  const [selectedDoctor, setSelectedDoctor] = useState<any | null>(null);
  const [bookingDate, setBookingDate] = useState("2026-05-28");
  const [bookingTime, setBookingTime] = useState("");
  const [bookingNotes, setBookingNotes] = useState("");
  const [isBookingLoading, setIsBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState<string | null>(null);

  // Standard specializations from reference design
  const specialties = [
    "All Specialists",
    "Cardiology",
    "Pediatrics",
    "Dermatology",
    "Neurology",
    "Psychiatry",
    "Pulmonology",
    "Orthopedics",
    "Oncology"
  ];

  // Simulated timeslots
  const timeslots = [
    "09:00 AM",
    "10:30 AM",
    "11:15 AM",
    "02:00 PM",
    "03:30 PM",
    "04:15 PM"
  ];

  const fetchDoctors = async () => {
    setIsLoading(true);
    const result = await getSpecialistDoctors(searchQuery, selectedSpecialty);
    if (result.success) {
      setDoctors(result.doctors || []);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchDoctors();
  }, [searchQuery, selectedSpecialty]);

  const handleBookAppointment = async () => {
    if (!selectedDoctor || !bookingTime) {
      setBookingError("Please select a timeslot.");
      return;
    }

    setIsBookingLoading(true);
    setBookingError(null);
    setBookingSuccess(null);

    // Combine date and time
    // Simulated time conversion e.g. "10:30 AM" -> Date object
    const [time, modifier] = bookingTime.split(" ");
    let [hours, minutes] = time.split(":").map(Number);
    if (modifier === "PM" && hours < 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0;
    
    const appointmentDate = new Date(bookingDate);
    appointmentDate.setHours(hours, minutes, 0, 0);

    const result = await bookAppointment({
      patientId: patientId,
      doctorId: selectedDoctor.id,
      dateTime: appointmentDate,
      notes: bookingNotes,
      cost: Number(selectedDoctor.consultFee),
    });

    if (result.error) {
      setBookingError(result.error);
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
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Discover Expert Care</h1>
        <p className="text-slate-500 font-light mt-1">Search and connect with top telehealth specialists instantly</p>
      </div>

      {/* Filters and Search Bar */}
      <div className="flex flex-col gap-4">
        {/* Search */}
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
            <Input
              type="text"
              placeholder="Search by doctor name, specialty, or clinic..."
              className="pl-10 h-11 border-slate-200 focus:border-[#0a5c5f] focus:ring-[#0a5c5f]/10 rounded-xl"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button 
            variant="outline" 
            onClick={() => setIsFilterModalOpen(true)}
            className="flex items-center gap-2 border-slate-200 hover:bg-slate-100 rounded-xl h-11 px-4"
          >
            <Filter className="h-4 w-4 text-slate-500" />
            <span className="hidden sm:inline">Advanced Filters</span>
          </Button>
        </div>

        {/* Categories Tab Selector */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {specialties.map((spec) => (
            <button
              key={spec}
              onClick={() => setSelectedSpecialty(spec)}
              className={`px-5 py-2.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${
                selectedSpecialty === spec
                  ? "bg-[#0a5c5f] text-white border-transparent"
                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
              }`}
            >
              {spec}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Doctor Cards */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <Card key={n} className="border-slate-100 rounded-2xl bg-white overflow-hidden shadow-sm animate-pulse">
              <div className="bg-slate-200 h-48 w-full" />
              <div className="p-5 space-y-3">
                <div className="h-6 bg-slate-200 rounded w-2/3" />
                <div className="h-4 bg-slate-200 rounded w-1/2" />
                <div className="h-8 bg-slate-200 rounded w-full pt-4" />
              </div>
            </Card>
          ))}
        </div>
      ) : filteredDoctors.length === 0 ? (
        <div className="text-center py-16 bg-white border border-slate-100 rounded-3xl space-y-4">
          <div className="p-4 bg-slate-50 rounded-full inline-block text-slate-400">
            <Search className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">No specialists found</h3>
          <p className="text-slate-400 text-sm max-w-sm mx-auto">
            Try adjusting your search keywords or switching filters to find other medical experts.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map((doctor) => {
            const docImage = getDoctorImage(doctor.user?.name || "");
            
            return (
              <Card key={doctor.id} className="border-slate-100 rounded-2xl bg-white overflow-hidden shadow-sm hover:shadow-md transition-all group flex flex-col justify-between">
                <div>
                  {/* Card Banner Image */}
                  <div className="relative h-48 bg-slate-100 overflow-hidden">
                    <img
                      src={docImage}
                      alt={doctor.user?.name}
                      className="object-cover w-full h-full object-center group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute left-4 top-4 bg-emerald-500 text-white text-[10px] font-bold uppercase px-2.5 py-1 rounded-full shadow-sm">
                      Available Today
                    </div>
                    <div className="absolute right-4 top-4 bg-white/90 backdrop-blur-md text-slate-800 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                      <Star className="h-3.5 w-3.5 text-amber-500 fill-current" />
                      <span>4.9</span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-5 space-y-3">
                    <div>
                      <h3 className="font-extrabold text-slate-800 text-lg leading-tight group-hover:text-[#0a5c5f] transition-colors">
                        Dr. {doctor.user?.name}
                      </h3>
                      <p className="text-xs text-slate-500 font-semibold mt-1">{doctor.specialization} Specialist</p>
                    </div>

                    <p className="text-slate-500 text-xs font-light line-clamp-2 leading-relaxed">
                      {doctor.bio || `Specializing in ${doctor.specialization.toLowerCase()} with a patient-centric, empathetic healthcare framework.`}
                    </p>

                    <div className="flex gap-4 pt-2 border-t border-slate-100 text-xs text-slate-500 font-medium">
                      <div className="flex items-center gap-1">
                        <Coins className="h-4 w-4 text-[#0a5c5f]" />
                        <span>₱{Number(doctor.consultFee).toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-[#0a5c5f]" />
                        <span>{doctor.experienceYears} Years Exp.</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <Button
                    onClick={() => {
                      setSelectedDoctor(doctor);
                      setBookingTime("");
                      setBookingError(null);
                      setBookingSuccess(null);
                    }}
                    className="w-full bg-[#0a5c5f] hover:bg-[#084a4c] text-white flex items-center justify-center gap-1.5 rounded-xl h-11 font-semibold"
                  >
                    <span>Book Consultation</span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Advanced Filters Dialog Modal */}
      <Dialog open={isFilterModalOpen} onOpenChange={setIsFilterModalOpen}>
        <DialogContent className="max-w-md rounded-3xl p-6 bg-white border border-slate-100">
          <DialogHeader className="pb-3 border-b border-slate-100">
            <DialogTitle className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <Filter className="h-5 w-5 text-[#0a5c5f]" />
              <span>Advanced Doctor Filters</span>
            </DialogTitle>
            <DialogDescription className="text-slate-500 text-xs font-light">
              Refine specialists by consultation fee and clinical experience
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 pt-3">
            {/* Consultation fee filter */}
            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-700">Maximum Consultation Fee</Label>
              <div className="grid grid-cols-2 gap-2">
                {[1000, 1500, 2000, 2500].map((fee) => (
                  <button
                    key={fee}
                    type="button"
                    onClick={() => setMaxFee(fee)}
                    className={`py-2.5 rounded-xl text-xs font-bold border transition-all ${
                      maxFee === fee
                        ? "bg-[#0a5c5f] text-white border-transparent shadow-sm"
                        : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    ₱{fee.toLocaleString()} or less
                  </button>
                ))}
              </div>
            </div>

            {/* Experience filter */}
            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-700">Minimum Experience (Years)</Label>
              <div className="grid grid-cols-2 gap-2">
                {[0, 5, 10, 15].map((years) => (
                  <button
                    key={years}
                    type="button"
                    onClick={() => setMinExperience(years)}
                    className={`py-2.5 rounded-xl text-xs font-bold border transition-all ${
                      minExperience === years
                        ? "bg-[#0a5c5f] text-white border-transparent shadow-sm"
                        : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    {years === 0 ? "Any experience" : `${years}+ Years`}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-slate-100 mt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setMaxFee(2500);
                  setMinExperience(0);
                  setIsFilterModalOpen(false);
                }}
                className="flex-1 rounded-xl h-11 border-slate-200 text-slate-500 font-semibold"
              >
                Reset
              </Button>
              <Button
                onClick={() => setIsFilterModalOpen(false)}
                className="flex-1 bg-[#0a5c5f] hover:bg-[#084a4c] text-white rounded-xl h-11 font-semibold"
              >
                Apply Filters
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

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

              {/* Doctor Details card representation */}
              <div className="flex items-center gap-4 p-4 border border-slate-100 rounded-2xl bg-slate-50/50">
                <Avatar className="h-16 w-16 border-2 border-white shadow-sm">
                  <img
                    src={getDoctorImage(selectedDoctor.user?.name || "")}
                    alt={selectedDoctor.user?.name}
                    className="object-cover w-full h-full object-center"
                  />
                </Avatar>
                <div>
                  <h4 className="font-extrabold text-slate-800 text-base">Dr. {selectedDoctor.user?.name}</h4>
                  <Badge className="bg-[#0a5c5f]/10 text-[#0a5c5f] hover:bg-[#0a5c5f]/15 font-semibold px-2 py-0.5 rounded mt-1 border-none text-[10px]">
                    {selectedDoctor.specialization}
                  </Badge>
                  <p className="text-[10px] text-slate-400 mt-1 font-light">PRC License No. {selectedDoctor.licenseNumber}</p>
                </div>
              </div>

              {/* Service Type and Duration Details */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 border border-slate-100 bg-slate-50/30 rounded-2xl text-left">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">Service Type</span>
                  <span className="text-sm font-extrabold text-slate-800 mt-1 block">Telehealth Call</span>
                  <span className="text-xs font-bold text-[#0a5c5f] mt-0.5 block">₱{Number(selectedDoctor.consultFee).toLocaleString()}</span>
                </div>
                <div className="p-4 border border-slate-100 bg-slate-50/30 rounded-2xl text-left">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">Duration</span>
                  <span className="text-sm font-extrabold text-slate-800 mt-1 block">45 Minutes</span>
                  <span className="text-xs font-light text-slate-400 mt-0.5 block flex items-center gap-1">
                    <Video className="h-3 w-3 text-slate-400" />
                    <span>Google Meet link</span>
                  </span>
                </div>
              </div>

              {/* Date Input */}
              <div className="space-y-1.5">
                <Label htmlFor="date" className="text-xs font-bold text-slate-700">Choose Consultation Date</Label>
                <div className="relative">
                  <CalendarDays className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    type="date"
                    id="date"
                    className="pl-10 h-11 border-slate-200 rounded-xl"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    disabled={isBookingLoading}
                  />
                </div>
              </div>

              {/* Timeslots Selector */}
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

              {/* Symptoms Input */}
              <div className="space-y-1.5">
                <Label htmlFor="notes" className="text-xs font-bold text-slate-700">Consultation Notes (Optional)</Label>
                <textarea
                  id="notes"
                  placeholder="Describe your symptoms or attach general requests..."
                  rows={2}
                  className="w-full border border-slate-200 focus:border-[#0a5c5f] focus:ring-1 focus:ring-[#0a5c5f]/10 rounded-xl p-3 text-sm focus:outline-none placeholder-slate-400"
                  value={bookingNotes}
                  onChange={(e) => setBookingNotes(e.target.value)}
                  disabled={isBookingLoading}
                />
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
                  className="flex-1 bg-[#0a5c5f] hover:bg-[#084a4c] text-white rounded-xl h-11 font-semibold flex items-center justify-center gap-1"
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
