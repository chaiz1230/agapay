"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Stethoscope, 
  Sparkles, 
  Coins, 
  CalendarDays, 
  AlertCircle, 
  CheckCircle2, 
  X, 
  TrendingUp,
  FileText,
  UserCheck,
  Star,
  Settings,
  HelpCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { updateDoctorProfileDetails } from "@/actions/profile";

interface DoctorProfileClientPageProps {
  doctor: any;
  computedRevenue: number;
  computedConsultations: number;
}

export default function DoctorProfileClientPage({ 
  doctor, 
  computedRevenue, 
  computedConsultations 
}: DoctorProfileClientPageProps) {
  const router = useRouter();

  // Form states
  const [name, setName] = useState(doctor.user?.name || "");
  const [specialization, setSpecialization] = useState(doctor.specialization || "");
  const [experienceYears, setExperienceYears] = useState(doctor.experienceYears || 0);
  const [bio, setBio] = useState(doctor.bio || "");
  const [consultFee, setConsultFee] = useState(doctor.consultFee || 0);
  const [subSpecialties, setSubSpecialties] = useState("Echocardiography, Hypertension Management, Pediatric Heart Health");
  const [acceptingPatients, setAcceptingPatients] = useState(true);

  // Status states
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleDiscard = () => {
    setName(doctor.user?.name || "");
    setSpecialization(doctor.specialization || "");
    setExperienceYears(doctor.experienceYears || 0);
    setBio(doctor.bio || "");
    setConsultFee(doctor.consultFee || 0);
    setSuccessMsg("Changes discarded.");
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!name.trim() || !specialization.trim()) {
      setErrorMsg("Name and Specialization are required.");
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    const result = await updateDoctorProfileDetails({
      name,
      specialization,
      experienceYears: Number(experienceYears),
      bio: bio || undefined,
      consultFee: Number(consultFee)
    });

    if (result.error) {
      setErrorMsg(result.error);
    } else {
      setSuccessMsg("Provider profile updated successfully!");
      router.refresh();
      setTimeout(() => setSuccessMsg(null), 3000);
    }
    setIsLoading(false);
  };

  // Profile photo mapping based on doctor's name
  const nameLower = name.toLowerCase();
  let docImage = "/dr_elena_santos.png"; // default fallback
  if (nameLower.includes("chen") || nameLower.includes("sofia")) {
    docImage = "/dr_sofia_chen.png";
  } else if (nameLower.includes("reyes") || nameLower.includes("julian")) {
    docImage = "/dr_julian_reyes.png";
  } else if (nameLower.includes("rivera") || nameLower.includes("marco")) {
    docImage = "/dr_marco_rivera.png";
  }

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto font-sans text-slate-800">
      {/* Toast alerts */}
      {successMsg && (
        <div className="fixed bottom-6 right-6 bg-[#0a5c5f] border border-[#084a4c] text-white rounded-2xl p-4 shadow-xl z-50 flex items-center gap-3 animate-bounce">
          <CheckCircle2 className="h-5 w-5 bg-teal-800 text-white rounded-full p-1 shrink-0" />
          <span className="text-sm font-semibold">{successMsg}</span>
          <button onClick={() => setSuccessMsg(null)} className="ml-2 hover:opacity-85 text-teal-200">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
      {errorMsg && (
        <div className="fixed bottom-6 right-6 bg-rose-600 border border-rose-700 text-white rounded-2xl p-4 shadow-xl z-50 flex items-center gap-3 animate-bounce">
          <AlertCircle className="h-5 w-5 bg-rose-800 text-white rounded-full p-1 shrink-0" />
          <span className="text-sm font-semibold">{errorMsg}</span>
          <button onClick={() => setErrorMsg(null)} className="ml-2 hover:opacity-85 text-rose-200">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Edit Provider Profile</h1>
          <p className="text-xs text-slate-500 font-light mt-0.5">Configure specialties, public bio, and scheduling settings</p>
        </div>
        <div className="flex gap-4 text-xs font-bold text-slate-500 items-center">
          <span className="hover:text-slate-800 cursor-pointer">Solutions</span>
          <span className="hover:text-slate-800 cursor-pointer">Providers</span>
          <span className="hover:text-slate-800 cursor-pointer">Pricing</span>
        </div>
      </div>

      {/* Main Grid split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Columns (Forms summary settings) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Header Provider Card */}
          <Card className="border-slate-100 shadow-sm rounded-2xl bg-white overflow-hidden">
            <CardContent className="p-6 flex flex-col sm:flex-row justify-between items-center gap-6">
              <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
                <div className="relative h-24 w-24 rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-100">
                  <img src={docImage} alt={name} className="h-full w-full object-cover object-center" />
                  <div className="absolute bottom-1.5 right-1.5 bg-[#0a5c5f] text-white p-1 rounded-lg cursor-pointer shadow hover:bg-[#084a4c]">
                    <Settings className="h-3.5 w-3.5" />
                  </div>
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-800">{name}, MD</h2>
                  <p className="text-xs text-slate-500 font-light mt-1">Senior {specialization} & Internal Medicine Specialist</p>
                  <div className="flex items-center justify-center sm:justify-start gap-2 mt-3">
                    <Badge className="bg-teal-50 text-teal-700 hover:bg-teal-50 border border-teal-200 font-semibold px-2 py-0.5 rounded-full text-[9px]">
                      Verified Provider
                    </Badge>
                    <Badge className="bg-slate-50 text-slate-600 hover:bg-slate-50 border border-slate-200 font-semibold px-2 py-0.5 rounded-full text-[9px]">
                      98% Satisfaction
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="flex gap-2.5 shrink-0">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleDiscard}
                  className="rounded-xl border-slate-200 text-slate-600 font-semibold h-11 px-5 bg-white hover:bg-slate-50 shadow-sm"
                >
                  Discard Changes
                </Button>
                <Button 
                  onClick={() => handleSubmit()} 
                  disabled={isLoading}
                  className="bg-[#0a5c5f] hover:bg-[#084a4c] text-white font-semibold h-11 px-6 rounded-xl border-none shadow-sm cursor-pointer"
                >
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Professional Summary */}
          <Card className="border-slate-100 shadow-sm rounded-2xl bg-white">
            <CardContent className="p-6 space-y-6">
              <h3 className="text-sm font-extrabold text-slate-900 tracking-tight flex items-center gap-2 pb-2 border-b border-slate-100 uppercase">
                <FileText className="h-4.5 w-4.5 text-[#0a5c5f]" />
                <span>Professional Summary</span>
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <Label htmlFor="specialty" className="text-xs font-bold text-slate-700">Primary Specialization</Label>
                  <Input 
                    type="text" 
                    id="specialty"
                    className="h-11 border-slate-200 focus:border-[#0a5c5f] focus:ring-[#0a5c5f]/10 rounded-xl text-sm"
                    value={specialization}
                    onChange={(e) => setSpecialization(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="exp" className="text-xs font-bold text-slate-700">Years of Experience</Label>
                  <Input 
                    type="number" 
                    id="exp"
                    className="h-11 border-slate-200 focus:border-[#0a5c5f] focus:ring-[#0a5c5f]/10 rounded-xl text-sm"
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(Number(e.target.value))}
                    required
                  />
                </div>

                <div className="col-span-1 sm:col-span-2 space-y-1.5">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="bio" className="text-xs font-bold text-slate-700">Medical Bio</Label>
                    <span className="text-[10px] text-slate-400 font-bold">{bio.length}/500 words</span>
                  </div>
                  <textarea
                    id="bio"
                    rows={4}
                    placeholder="Describe your medical research, experience, and clinical approach..."
                    className="w-full border border-slate-200 focus:border-[#0a5c5f] focus:ring-1 focus:ring-[#0a5c5f] rounded-xl p-3 text-sm placeholder:text-slate-400 focus:outline-none leading-relaxed"
                    value={bio}
                    onChange={(e) => setBio(e.target.value.substring(0, 500))}
                  />
                </div>

                <div className="col-span-1 sm:col-span-2 space-y-1.5">
                  <Label htmlFor="subspecialties" className="text-xs font-bold text-slate-700">Sub-specialties (Comma separated)</Label>
                  <Input 
                    type="text" 
                    id="subspecialties"
                    className="h-11 border-slate-200 focus:border-[#0a5c5f] focus:ring-[#0a5c5f]/10 rounded-xl text-sm"
                    value={subSpecialties}
                    onChange={(e) => setSubSpecialties(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Consultation Settings */}
          <Card className="border-slate-100 shadow-sm rounded-2xl bg-white">
            <CardContent className="p-6 space-y-6">
              <h3 className="text-sm font-extrabold text-slate-900 tracking-tight flex items-center gap-2 pb-2 border-b border-slate-100 uppercase">
                <Stethoscope className="h-4.5 w-4.5 text-[#0a5c5f]" />
                <span>Consultation Settings</span>
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <Label htmlFor="fee" className="text-xs font-bold text-slate-700">Consultation Fee (₱)</Label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-3.5 text-slate-400 font-bold text-sm">₱</span>
                    <Input 
                      type="number" 
                      id="fee"
                      className="pl-8 h-11 border-slate-200 focus:border-[#0a5c5f] focus:ring-[#0a5c5f]/10 rounded-xl text-sm font-bold"
                      value={consultFee}
                      onChange={(e) => setConsultFee(Number(e.target.value))}
                      required
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium block mt-1">Standard rate for a 20-minute video session.</span>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-700">Availability Status</Label>
                  <div className="flex items-center gap-3 p-3 border border-slate-100 bg-slate-50/50 rounded-2xl h-11">
                    <input 
                      type="checkbox" 
                      id="availability-switch"
                      className="h-5 w-9 rounded-full bg-slate-200 checked:bg-teal-600 appearance-none relative cursor-pointer outline-none transition-colors before:content-[''] before:h-4 before:w-4 before:rounded-full before:bg-white before:absolute before:left-0.5 before:top-0.5 before:transition-transform checked:before:translate-x-4 border border-slate-300 checked:border-transparent"
                      checked={acceptingPatients}
                      onChange={(e) => setAcceptingPatients(e.target.checked)}
                    />
                    <Label htmlFor="availability-switch" className="text-xs font-bold text-slate-700 cursor-pointer">
                      {acceptingPatients ? "Accepting New Patients" : "Not Accepting Patients"}
                    </Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Right Sidebar */}
        <div className="space-y-8">
          
          {/* Monthly Revenue Card */}
          <Card className="bg-gradient-to-tr from-[#0a5c5f] to-teal-700 text-white border-none rounded-2xl overflow-hidden relative shadow-md">
            <div className="absolute right-0 top-0 opacity-10 pointer-events-none p-4">
              <TrendingUp className="h-32 w-32" />
            </div>
            <CardContent className="p-6 space-y-4">
              <span className="text-[10px] font-extrabold uppercase tracking-wider bg-white/10 px-2.5 py-1 rounded-full">Monthly Performance</span>
              <div className="space-y-1">
                <p className="text-[10px] text-teal-100/70 font-bold block uppercase tracking-wider">Estimated Revenue</p>
                <h4 className="text-3xl font-black">₱{(computedRevenue || 142500).toLocaleString("en-US", { minimumFractionDigits: 2 })}</h4>
              </div>
              <div className="pt-3 border-t border-white/10 flex justify-between items-center text-xs font-semibold">
                <div>
                  <span className="block text-teal-100/70 text-[9px] uppercase">Consultations</span>
                  <span className="block text-sm font-extrabold mt-0.5">{computedConsultations || 48}</span>
                </div>
                <div className="p-2 bg-white/10 rounded-xl">
                  <TrendingUp className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Profile Strength Checklist */}
          <Card className="border-slate-100 shadow-sm rounded-2xl bg-white">
            <CardContent className="p-6 space-y-4">
              <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Profile Strength</span>
              <div className="space-y-1">
                <div className="flex justify-between items-center text-sm font-extrabold">
                  <span className="text-slate-800">85%</span>
                  <span className="text-[#0a5c5f] text-xs">Almost there!</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#0a5c5f] rounded-full" style={{ width: "85%" }} />
                </div>
              </div>

              <div className="space-y-2.5 pt-2 text-xs font-semibold text-slate-600">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4.5 w-4.5 text-teal-500 fill-teal-50" />
                  <span>Basic Info Completed</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4.5 w-4.5 text-teal-500 fill-teal-50" />
                  <span>License Verified</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <div className="h-4.5 w-4.5 rounded-full border-2 border-slate-200" />
                  <span>Add Hospital Affiliations</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Preview Card */}
          <Card className="border-slate-100 shadow-sm rounded-2xl bg-white overflow-hidden p-5 text-center space-y-4">
            <div className="relative h-16 w-16 mx-auto rounded-full overflow-hidden border border-slate-100">
              <img src={docImage} alt={name} className="h-full w-full object-cover object-center" />
            </div>
            <div className="space-y-0.5">
              <h4 className="font-extrabold text-slate-850 text-sm">Dr. {name}</h4>
              <p className="text-[10px] text-slate-400 font-semibold">{specialization} • {experienceYears} Yrs Exp</p>
            </div>
            <div className="flex items-center justify-center gap-1 text-[11px] font-bold text-slate-600">
              <Star className="h-4.5 w-4.5 text-amber-400 fill-current" />
              <span>4.9 (210 Reviews)</span>
            </div>
            <Button variant="outline" className="w-full rounded-xl border-slate-200 text-slate-700 font-semibold h-10 text-xs bg-white hover:bg-slate-50">
              View Public Profile
            </Button>
          </Card>

        </div>

      </div>

      {/* Bottom Footer Actions */}
      <div className="flex justify-between items-center pt-6 border-t border-slate-200 text-xs text-slate-400">
        <span>Last updated: October 24, 2023 • 09:42 AM</span>
      </div>

    </div>
  );
}
