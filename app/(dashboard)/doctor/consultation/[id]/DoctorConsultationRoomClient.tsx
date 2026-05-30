"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Video, 
  Activity, 
  Heart, 
  ShieldCheck, 
  Users, 
  FileText,
  CheckCircle2,
  ClipboardList,
  Pill,
  Loader2,
  Stethoscope,
  ExternalLink,
  Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { finalizeConsultation } from "@/actions/appointments";
import { getMeetUrl } from "@/utils/meet";

interface DoctorConsultationRoomClientProps {
  appointment: any;
}

export default function DoctorConsultationRoomClient({ appointment }: DoctorConsultationRoomClientProps) {
  const router = useRouter();

  // Consultation form states
  const [diagnosis, setDiagnosis] = useState("");
  const [treatment, setTreatment] = useState("");
  const [prescription, setPrescription] = useState("");
  const [notes, setNotes] = useState("");

  // Submit states
  const [isFinalizing, setIsFinalizing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const meetUrl = getMeetUrl(appointment.id);

  // Submit final EHR report
  const handleFinalize = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!diagnosis.trim() || !treatment.trim()) {
      setErrorMsg("Diagnosis and Treatment plan are required to sign off this session.");
      return;
    }

    setIsFinalizing(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    const result = await finalizeConsultation({
      appointmentId: appointment.id,
      diagnosis,
      treatment,
      prescription: prescription || undefined,
      notes: notes || undefined
    });

    if (result.error) {
      setErrorMsg(result.error);
      setIsFinalizing(false);
    } else {
      setSuccessMsg("EHR consultation summary signed and submitted successfully!");
      setIsFinalizing(false);
      setTimeout(() => {
        router.push("/doctor");
      }, 2000);
    }
  };

  // Calculate age helper
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
    <div className="flex h-screen bg-slate-50 text-slate-850 overflow-hidden flex-col md:flex-row font-sans">
      {/* Left Area: Patient Vitals & Google Meet Launcher (2/3 width) */}
      <div className="flex-1 flex flex-col h-full overflow-y-auto p-6 md:p-8 space-y-6">
        
        {/* Top Header Bar */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-teal-50 text-[#0a5c5f] rounded-xl flex items-center justify-center border border-teal-100">
              <Stethoscope className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900">Consultation Session</h1>
              <p className="text-xs text-slate-500 font-medium">Patient: {appointment.patient?.user?.name || "Patient"}</p>
            </div>
          </div>
          <Badge className="bg-teal-50 text-teal-700 border border-teal-200 font-bold text-[10px] px-2.5 py-1 rounded-full">
            HIPAA Compliant Room
          </Badge>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Google Meet Launcher Card */}
          <Card className="bg-white border-slate-100 rounded-2xl shadow-sm flex flex-col justify-between overflow-hidden">
            <CardContent className="p-6 space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-teal-600 font-bold text-sm">
                  <Video className="h-5 w-5" />
                  <span>Video Call Integration</span>
                </div>
                <h3 className="text-base font-extrabold text-slate-850">Telehealth Google Meet Session</h3>
                <p className="text-xs text-slate-500 font-light leading-relaxed">
                  Click the button below to launch the video call with your patient. Please keep this portal open to log diagnosis, treatment plans, and prescriptions side-by-side.
                </p>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 font-mono text-[10px] text-teal-750 break-all select-all flex items-center justify-between gap-2">
                  <span>{meetUrl}</span>
                </div>
              </div>
              
              <Button asChild className="w-full bg-[#0a5c5f] hover:bg-[#084a4c] text-white font-semibold h-11 rounded-xl flex items-center justify-center gap-2 mt-4 border-none shadow-md cursor-pointer">
                <a href={meetUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" />
                  <span>Launch Google Meet</span>
                </a>
              </Button>
            </CardContent>
          </Card>

          {/* Patient Profile & Vitals Card */}
          <Card className="bg-white border-slate-100 rounded-2xl shadow-sm">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-2 text-rose-600 font-bold text-sm">
                <Heart className="h-5 w-5" />
                <span>Patient Profile & Vitals</span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/60">
                  <span className="text-[10px] text-slate-450 font-bold block uppercase">Age / Gender</span>
                  <span className="font-extrabold text-slate-800 block mt-1">
                    {getAge(appointment.patient?.dateOfBirth)} Years / {appointment.patient?.gender || "Male"}
                  </span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/60">
                  <span className="text-[10px] text-slate-450 font-bold block uppercase">Blood Type</span>
                  <span className="font-extrabold text-slate-800 block mt-1">
                    {appointment.patient?.bloodType || "O+"}
                  </span>
                </div>
                <div className="col-span-2 bg-slate-50 p-3.5 rounded-xl border border-slate-200/60">
                  <span className="text-[10px] text-slate-450 font-bold block uppercase">Booking Symptoms Note</span>
                  <p className="text-xs text-slate-600 font-light italic mt-1.5 leading-relaxed">
                    "{appointment.notes || "No booking notes specified"}"
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Previous Consultation History log */}
        <Card className="bg-white border-slate-100 rounded-2xl shadow-sm flex-1 min-h-[220px]">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-2 text-amber-600 font-bold text-sm">
              <FileText className="h-5 w-5" />
              <span>Patient Medical History Timeline</span>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-4 p-4 border border-slate-100 rounded-xl bg-slate-50/50">
                <div className="p-2 bg-slate-100 rounded-lg text-slate-500 mt-0.5">
                  <Calendar className="h-4 w-4" />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between items-center gap-4">
                    <span className="text-xs font-bold text-slate-800">Post-Surgical Follow-up</span>
                    <span className="text-[10px] text-slate-450 font-bold">14 Days Ago</span>
                  </div>
                  <p className="text-xs text-slate-500 font-light leading-relaxed">
                    Patient shows excellent recovery post-appendectomy. Wound site is healing cleanly with no signs of infection. Recommended continuation of light physical activity.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 border border-slate-100 rounded-xl bg-slate-50/50">
                <div className="p-2 bg-slate-100 rounded-lg text-slate-500 mt-0.5">
                  <Calendar className="h-4 w-4" />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between items-center gap-4">
                    <span className="text-xs font-bold text-slate-800">General Health Assessment</span>
                    <span className="text-[10px] text-slate-450 font-bold">8 Months Ago</span>
                  </div>
                  <p className="text-xs text-slate-500 font-light leading-relaxed">
                    Cardiovascular response is excellent. Normal sinus rhythm observed on resting ECG. Blood pressure stable.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>

      {/* Right Area: EHR Notes and Finalize Form (1/3 width) */}
      <div className="w-full md:w-96 border-l border-slate-200 bg-white h-full flex flex-col justify-between p-6 overflow-y-auto shrink-0">
        <form onSubmit={handleFinalize} className="space-y-6 flex flex-col justify-between h-full">
          <div className="space-y-6">
            
            {/* Section Header */}
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Clinical Records EHR</h3>
              <h2 className="text-lg font-bold text-slate-800 mt-1">Consultation Summary</h2>
            </div>

            {/* Success and Error messages */}
            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-medium">
                {errorMsg}
              </div>
            )}
            {successMsg && (
              <div className="p-3 bg-[#0a5c5f]/5 border border-[#0a5c5f]/15 text-teal-700 rounded-xl text-xs font-medium flex items-center gap-2">
                <CheckCircle2 className="h-4.5 w-4.5 text-teal-600 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Form Fields */}
            <div className="space-y-4 pt-1">
              
              {/* Diagnosis Field */}
              <div className="space-y-1.5">
                <Label htmlFor="diagnosis" className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Stethoscope className="h-3.5 w-3.5 text-teal-600" />
                  <span>Clinical Diagnosis *</span>
                </Label>
                <Input 
                  type="text" 
                  id="diagnosis"
                  placeholder="e.g. Acute Bronchitis, Migraine..."
                  className="bg-white border-slate-200 text-slate-800 rounded-xl focus:border-[#0a5c5f] focus:ring-[#0a5c5f]/10 h-10 text-xs placeholder:text-slate-400 focus:outline-none"
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  disabled={isFinalizing || successMsg !== null}
                  required
                />
              </div>

              {/* Treatment Field */}
              <div className="space-y-1.5">
                <Label htmlFor="treatment" className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <ClipboardList className="h-3.5 w-3.5 text-teal-600" />
                  <span>Treatment Plan *</span>
                </Label>
                <Input 
                  type="text" 
                  id="treatment"
                  placeholder="e.g. Rest for 3 days, hydrate, keep warm..."
                  className="bg-white border-slate-200 text-slate-800 rounded-xl focus:border-[#0a5c5f] focus:ring-[#0a5c5f]/10 h-10 text-xs placeholder:text-slate-400 focus:outline-none"
                  value={treatment}
                  onChange={(e) => setTreatment(e.target.value)}
                  disabled={isFinalizing || successMsg !== null}
                  required
                />
              </div>

              {/* Prescriptions Field */}
              <div className="space-y-1.5">
                <Label htmlFor="prescription" className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Pill className="h-3.5 w-3.5 text-teal-600" />
                  <span>Prescribed Medications (Optional)</span>
                </Label>
                <textarea 
                  id="prescription"
                  rows={3}
                  placeholder="e.g. 1. Albuterol inhaler - 2 puffs q4h&#10;2. Paracetamol 500mg - 1 tab q6h PRN"
                  className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl focus:border-[#0a5c5f] focus:ring-1 focus:ring-[#0a5c5f] p-3 text-xs placeholder:text-slate-400 focus:outline-none leading-relaxed"
                  value={prescription}
                  onChange={(e) => setPrescription(e.target.value)}
                  disabled={isFinalizing || successMsg !== null}
                />
              </div>

              {/* Private Session Notes Field */}
              <div className="space-y-1.5">
                <Label htmlFor="notes" className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5 text-teal-600" />
                  <span>Consultation Notes (Optional)</span>
                </Label>
                <textarea 
                  id="notes"
                  rows={3}
                  placeholder="Private notes (history, details, lifestyle recommendations...)"
                  className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl focus:border-[#0a5c5f] focus:ring-1 focus:ring-[#0a5c5f] p-3 text-xs placeholder:text-slate-400 focus:outline-none leading-relaxed"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  disabled={isFinalizing || successMsg !== null}
                />
              </div>

            </div>

          </div>

          {/* Form Actions */}
          <div className="pt-6 border-t border-slate-200 space-y-3 shrink-0">
            <Button
              type="submit"
              disabled={isFinalizing || successMsg !== null}
              className="w-full bg-[#0a5c5f] hover:bg-[#084a4c] text-white font-semibold h-11 rounded-xl flex items-center justify-center gap-2 border-none shadow-md cursor-pointer"
            >
              {isFinalizing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Finalizing Records...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="h-4 w-4" />
                  <span>Finalize & Sign Session</span>
                </>
              )}
            </Button>
            
            <div className="p-3 border border-slate-200 bg-slate-50 rounded-2xl flex items-start gap-2.5">
              <ShieldCheck className="h-5 w-5 text-teal-600 shrink-0 mt-0.5" />
              <div>
                <h5 className="text-[10px] font-bold text-slate-800">Electronic HIPAA Signature</h5>
                <p className="text-[9px] text-slate-500 font-light leading-relaxed mt-0.5">
                  Signing finalizes patient billing and adds this diagnosis into the patient timeline.
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
