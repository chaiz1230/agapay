"use client";

import React from "react";
import { Star, Clock, Coins, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface DoctorCardProps {
  doctor?: any;
  onBook?: (doctor: any) => void;
  isLoading?: boolean;
}

export const getDoctorImage = (name: string) => {
  const lowercaseName = name.toLowerCase();
  if (lowercaseName.includes("santos")) return "/dr_elena_santos.png";
  if (lowercaseName.includes("chen") || lowercaseName.includes("lim")) return "/dr_sofia_chen.png";
  if (lowercaseName.includes("rivera") || lowercaseName.includes("marcus")) return "/dr_marco_rivera.png";
  return "/dr_julian_reyes.png";
};

export default function DoctorCard({ doctor, onBook, isLoading = false }: DoctorCardProps) {
  if (isLoading) {
    return (
      <Card className="border-slate-100 rounded-2xl bg-white overflow-hidden shadow-sm animate-pulse flex flex-col justify-between h-[390px]">
        <div>
          <div className="bg-slate-200 h-48 w-full" />
          <div className="p-5 space-y-3">
            <div className="h-6 bg-slate-200 rounded w-2/3" />
            <div className="h-4 bg-slate-200 rounded w-1/2" />
            <div className="h-8 bg-slate-200 rounded w-full pt-4" />
          </div>
        </div>
      </Card>
    );
  }

  const docImage = getDoctorImage(doctor.user?.name || "");

  return (
    <Card className="border-slate-100 rounded-2xl bg-white overflow-hidden shadow-sm hover:shadow-md transition-all group flex flex-col justify-between">
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
          onClick={() => onBook(doctor)}
          className="w-full bg-[#0a5c5f] hover:bg-[#084a4c] text-white flex items-center justify-center gap-1.5 rounded-xl h-11 font-semibold"
        >
          <span>Book Consultation</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
}
