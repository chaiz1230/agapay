"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Video, 
  Mic, 
  MicOff, 
  VideoOff, 
  PhoneOff, 
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
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { finalizeConsultation } from "@/actions/appointments";

interface DoctorConsultationRoomClientProps {
  appointment: any;
}

export default function DoctorConsultationRoomClient({ appointment }: DoctorConsultationRoomClientProps) {
  const router = useRouter();

  // Call states
  const [isMuted, setIsMuted] = useState(false);
  const [isCamOff, setIsCamOff] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [pulseRate, setPulseRate] = useState(74);

  // Consultation form states
  const [diagnosis, setDiagnosis] = useState("");
  const [treatment, setTreatment] = useState("");
  const [prescription, setPrescription] = useState("");
  const [notes, setNotes] = useState("");

  // Submit states
  const [isFinalizing, setIsFinalizing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Timer simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Fluctuating patient pulse rate simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setPulseRate((prev) => {
        const diff = Math.floor(Math.random() * 5) - 2;
        const next = prev + diff;
        return next > 65 && next < 85 ? next : prev;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleHangUp = () => {
    router.push("/doctor");
  };

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
    <div className="flex h-screen bg-slate-900 text-white overflow-hidden flex-col md:flex-row">
      {/* Left Area: Main Video Room (2/3 width) */}
      <div className="flex-1 flex flex-col h-full overflow-hidden p-6 justify-between">
        
        {/* Top Header Session Bar */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-emerald-500/10 text-emerald-400 rounded-xl flex items-center justify-center border border-emerald-500/20">
              <Video className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <h1 className="text-base font-bold">Consultation with {appointment.patient?.user?.name || "Patient"}</h1>
              <p className="text-[10px] text-slate-400 font-medium">Ongoing Call • Elapsed Time: ({formatTime(elapsedTime)})</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold text-[9px] px-2.5 py-1">
              Encrypted Stream
            </Badge>
            <Button variant="outline" size="sm" className="bg-white/5 border-white/10 hover:bg-white/10 text-xs rounded-xl flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>Patient File</span>
            </Button>
          </div>
        </div>

        {/* Video Canvas Container (Reference Image 7 style) */}
        <div className="flex-1 relative my-6 bg-slate-950 rounded-3xl overflow-hidden border border-white/5 shadow-2xl flex items-center justify-center">
          
          {/* Main Video: Simulated Patient Stream */}
          <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-900 to-slate-950 flex flex-col items-center justify-center space-y-4">
            {/* Simulated Patient Video Feed avatar placeholder */}
            <div className="h-28 w-28 bg-[#0a5c5f]/10 border border-[#0a5c5f]/30 rounded-full flex items-center justify-center text-[#0a5c5f] relative shadow-lg">
              <Users className="h-14 w-14" />
              <div className="absolute right-1 bottom-1 h-4 w-4 rounded-full bg-emerald-500 border-2 border-slate-950 animate-pulse" />
            </div>
            <div className="text-center space-y-1">
              <h4 className="font-extrabold text-slate-200 text-sm">{appointment.patient?.user?.name || "Patient"}</h4>
              <p className="text-[10px] text-slate-400">Streaming Video • Patient Feed Connected</p>
            </div>

            {/* Rec Badge */}
            <div className="absolute left-6 top-6 bg-rose-600 text-white text-[9px] font-extrabold tracking-wider uppercase px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md">
              <div className="h-1.5 w-1.5 rounded-full bg-white animate-ping" />
              <span>REC • LIVE</span>
            </div>
          </div>

          {/* Self Video: Doctor Inset Pip */}
          <div className="absolute right-6 bottom-6 h-28 w-20 md:h-36 md:w-28 rounded-2xl overflow-hidden border-2 border-white/10 shadow-lg bg-slate-800">
            {isCamOff ? (
              <div className="w-full h-full flex items-center justify-center bg-slate-800 text-slate-500">
                <VideoOff className="h-6 w-6" />
              </div>
            ) : (
              <div className="relative w-full h-full bg-slate-950">
                <img 
                  src="/dr_elena_santos.png" 
                  alt="Dr. Elena Santos"
                  className="w-full h-full object-cover object-center opacity-80"
                />
                <div className="absolute bottom-2 left-2 bg-slate-900/60 text-white text-[8px] px-1 py-0.5 rounded font-mono">
                  You (Doctor)
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Call Controls & Simulated Patient Vitals Feed */}
        <div className="grid grid-cols-1 md:grid-cols-3 items-center justify-between gap-4 border-t border-white/10 pt-4">
          
          {/* Network status */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/5 rounded-xl text-emerald-400">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[9px] text-slate-400 block uppercase font-bold">Network Status</span>
              <span className="text-xs font-bold text-slate-100">Excellent (28ms)</span>
            </div>
          </div>

          {/* Call Controls */}
          <div className="flex items-center justify-center gap-4">
            <Button 
              onClick={() => setIsMuted(!isMuted)} 
              variant="outline" 
              size="icon" 
              className={`rounded-full h-11 w-11 border-none shadow-sm ${
                isMuted ? "bg-rose-600 text-white hover:bg-rose-700" : "bg-white/10 hover:bg-white/20 text-white"
              }`}
            >
              {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            </Button>
            <Button 
              onClick={() => setIsCamOff(!isCamOff)} 
              variant="outline" 
              size="icon" 
              className={`rounded-full h-11 w-11 border-none shadow-sm ${
                isCamOff ? "bg-rose-600 text-white hover:bg-rose-700" : "bg-white/10 hover:bg-white/20 text-white"
              }`}
            >
              {isCamOff ? <VideoOff className="h-5 w-5" /> : <Video className="h-5 w-5" />}
            </Button>
            <Button 
              onClick={handleHangUp} 
              className="rounded-full h-11 w-11 bg-rose-600 hover:bg-rose-700 text-white border-none shadow-md"
            >
              <PhoneOff className="h-5 w-5" />
            </Button>
          </div>

          {/* Heart rate monitor (vitals sensor simulator) */}
          <div className="flex items-center justify-end gap-3">
            <div className="p-2 bg-white/5 rounded-xl text-rose-500">
              <Heart className="h-5 w-5 fill-current animate-pulse" />
            </div>
            <div className="text-right">
              <span className="text-[9px] text-slate-400 block uppercase font-bold">Patient Pulse Sensor</span>
              <span className="text-xs font-bold text-slate-100">{pulseRate} BPM</span>
            </div>
          </div>

        </div>

      </div>

      {/* Right Area: EHR Notes and Finalize Form (1/3 width) */}
      <div className="w-full md:w-96 border-l border-white/10 bg-slate-900/60 h-full flex flex-col justify-between p-6 overflow-y-auto">
        <form onSubmit={handleFinalize} className="space-y-6 flex flex-col justify-between h-full">
          <div className="space-y-6">
            
            {/* Section Header */}
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Clinical Records EHR</h3>
              <h2 className="text-lg font-bold text-slate-200 mt-1">Consultation Summary</h2>
            </div>

            {/* Patient Vitals Quick Cards */}
            <Card className="bg-white/5 border-white/5 rounded-2xl">
              <CardContent className="p-4 space-y-3">
                <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wide">Patient Vitals Profile</span>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 font-light block">Age / Gender</span>
                    <span className="font-bold text-slate-200 block mt-0.5">
                      {getAge(appointment.patient?.dateOfBirth)} Years / {appointment.patient?.gender || "Male"}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-light block">Blood Type</span>
                    <span className="font-bold text-slate-200 block mt-0.5">
                      {appointment.patient?.bloodType || "O+"}
                    </span>
                  </div>
                  <div className="col-span-2 pt-1 border-t border-white/5">
                    <span className="text-[10px] text-slate-500 font-light block">Booking Symptoms Note</span>
                    <p className="text-[11px] text-slate-300 font-light italic mt-0.5 leading-relaxed">
                      "{appointment.notes || "No booking notes specified"}"
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Success and Error messages */}
            {errorMsg && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-300 rounded-xl text-xs font-medium">
                {errorMsg}
              </div>
            )}
            {successMsg && (
              <div className="p-3 bg-teal-500/10 border border-teal-500/20 text-teal-300 rounded-xl text-xs font-medium flex items-center gap-2">
                <CheckCircle2 className="h-4.5 w-4.5 text-teal-400 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Form Fields */}
            <div className="space-y-4 pt-1">
              
              {/* Diagnosis Field */}
              <div className="space-y-1.5">
                <Label htmlFor="diagnosis" className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Stethoscope className="h-3.5 w-3.5 text-[#0a5c5f]" />
                  <span>Clinical Diagnosis *</span>
                </Label>
                <Input 
                  type="text" 
                  id="diagnosis"
                  placeholder="e.g. Acute Bronchitis, Migraine..."
                  className="bg-white/5 border-white/10 text-white rounded-xl focus:border-[#0a5c5f] focus:ring-[#0a5c5f] h-10 text-xs placeholder:text-slate-500 focus:outline-none"
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  disabled={isFinalizing || successMsg !== null}
                />
              </div>

              {/* Treatment Field */}
              <div className="space-y-1.5">
                <Label htmlFor="treatment" className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <ClipboardList className="h-3.5 w-3.5 text-[#0a5c5f]" />
                  <span>Treatment Plan *</span>
                </Label>
                <Input 
                  type="text" 
                  id="treatment"
                  placeholder="e.g. Rest for 3 days, hydrate, keep warm..."
                  className="bg-white/5 border-white/10 text-white rounded-xl focus:border-[#0a5c5f] focus:ring-[#0a5c5f] h-10 text-xs placeholder:text-slate-500 focus:outline-none"
                  value={treatment}
                  onChange={(e) => setTreatment(e.target.value)}
                  disabled={isFinalizing || successMsg !== null}
                />
              </div>

              {/* Prescriptions Field */}
              <div className="space-y-1.5">
                <Label htmlFor="prescription" className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Pill className="h-3.5 w-3.5 text-[#0a5c5f]" />
                  <span>Prescribed Medications (Optional)</span>
                </Label>
                <textarea 
                  id="prescription"
                  rows={2}
                  placeholder="e.g. 1. Albuterol inhaler - 2 puffs q4h&#10;2. Paracetamol 500mg - 1 tab q6h PRN"
                  className="w-full bg-white/5 border border-white/10 text-white rounded-xl focus:border-[#0a5c5f] focus:ring-1 focus:ring-[#0a5c5f] p-3 text-xs placeholder:text-slate-500 focus:outline-none leading-relaxed"
                  value={prescription}
                  onChange={(e) => setPrescription(e.target.value)}
                  disabled={isFinalizing || successMsg !== null}
                />
              </div>

              {/* Private Session Notes Field */}
              <div className="space-y-1.5">
                <Label htmlFor="notes" className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5 text-[#0a5c5f]" />
                  <span>Consultation Notes (Optional)</span>
                </Label>
                <textarea 
                  id="notes"
                  rows={2}
                  placeholder="Private notes (history, details, lifestyle recommendations...)"
                  className="w-full bg-white/5 border border-white/10 text-white rounded-xl focus:border-[#0a5c5f] focus:ring-1 focus:ring-[#0a5c5f] p-3 text-xs placeholder:text-slate-500 focus:outline-none leading-relaxed"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  disabled={isFinalizing || successMsg !== null}
                />
              </div>

            </div>

          </div>

          {/* Form Actions */}
          <div className="pt-6 mt-8 border-t border-white/10 space-y-3">
            <Button
              type="submit"
              disabled={isFinalizing || successMsg !== null}
              className="w-full bg-[#0a5c5f] hover:bg-[#084a4c] text-white font-semibold h-11 rounded-xl flex items-center justify-center gap-2 border-none shadow-md"
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
            
            <div className="p-3 border border-white/5 bg-white/5 rounded-2xl flex items-start gap-2.5">
              <ShieldCheck className="h-5 w-5 text-teal-400 shrink-0 mt-0.5" />
              <div>
                <h5 className="text-[10px] font-bold text-slate-200">Electronic HIPAA Signature</h5>
                <p className="text-[9px] text-slate-400 font-light leading-relaxed mt-0.5">
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
