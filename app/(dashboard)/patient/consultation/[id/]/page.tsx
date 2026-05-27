"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
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
  BadgeAlert,
  Loader2
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const getDoctorImage = (name: string) => {
  const lowercaseName = name.toLowerCase();
  if (lowercaseName.includes("santos")) return "/dr_elena_santos.png";
  if (lowercaseName.includes("chen") || lowercaseName.includes("lim")) return "/dr_sofia_chen.png";
  if (lowercaseName.includes("rivera") || lowercaseName.includes("marcus")) return "/dr_marco_rivera.png";
  return "/dr_julian_reyes.png";
};

export default function PatientConsultationRoom() {
  const params = useParams();
  const router = useRouter();
  const appointmentId = params.id as string;

  const [isMuted, setIsMuted] = useState(false);
  const [isCamOff, setIsCamOff] = useState(false);
  const [pulseRate, setPulseRate] = useState(72);
  const [elapsedTime, setElapsedTime] = useState(0);

  // Fluctuating simulated pulse rate
  useEffect(() => {
    const interval = setInterval(() => {
      setPulseRate((prev) => {
        const diff = Math.floor(Math.random() * 5) - 2; // fluctuate by -2 to +2
        const next = prev + diff;
        return next > 65 && next < 85 ? next : prev;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Timer simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleLeaveCall = () => {
    router.push("/patient/appointments");
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
              <h1 className="text-base font-bold">Session with Dr. Elena Santos</h1>
              <p className="text-[10px] text-slate-400 font-medium">Scheduled: 2:00 PM - 2:45 PM • Ongoing ({formatTime(elapsedTime)})</p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="bg-white/5 border-white/10 hover:bg-white/10 text-xs rounded-xl flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>Invite Family</span>
          </Button>
        </div>

        {/* Video Canvas Container (Reference Image 7) */}
        <div className="flex-1 relative my-6 bg-slate-950 rounded-3xl overflow-hidden border border-white/5 shadow-2xl flex items-center justify-center">
          
          {/* Main Video: Simulated Doctor Stream */}
          <div className="absolute inset-0">
            <img 
              src="/dr_elena_santos.png" 
              alt="Dr. Elena Santos"
              className="w-full h-full object-cover object-center opacity-85 blur-[0.5px]"
            />
            {/* Live indicator badge */}
            <div className="absolute left-6 top-6 bg-rose-600 text-white text-[9px] font-extrabold tracking-wider uppercase px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md">
              <div className="h-1.5 w-1.5 rounded-full bg-white animate-ping" />
              <span>REC • LIVE</span>
            </div>
          </div>

          {/* Self Video (Small Inset Pip) */}
          <div className="absolute right-6 bottom-6 h-28 w-20 md:h-36 md:w-28 rounded-2xl overflow-hidden border-2 border-white/10 shadow-lg bg-slate-800">
            {isCamOff ? (
              <div className="w-full h-full flex items-center justify-center bg-slate-800 text-slate-500">
                <VideoOff className="h-6 w-6" />
              </div>
            ) : (
              <div className="relative w-full h-full bg-teal-900/40">
                {/* Silhouette avatar placeholder for patient self-cam */}
                <div className="absolute inset-0 flex items-center justify-center text-teal-300/30">
                  <Users className="h-10 w-10" />
                </div>
                <div className="absolute bottom-2 left-2 bg-slate-900/60 text-white text-[8px] px-1 py-0.5 rounded font-mono">
                  You (Patient)
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Call Controls & Simulated Bio Sensor */}
        <div className="grid grid-cols-1 md:grid-cols-3 items-center justify-between gap-4 border-t border-white/10 pt-4">
          
          {/* Network status */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/5 rounded-xl text-emerald-400">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[9px] text-slate-400 block uppercase font-bold">Network Status</span>
              <span className="text-xs font-bold text-slate-100">Excellent (32ms)</span>
            </div>
          </div>

          {/* Controls */}
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
              onClick={handleLeaveCall} 
              className="rounded-full h-11 w-11 bg-rose-600 hover:bg-rose-700 text-white border-none shadow-md"
            >
              <PhoneOff className="h-5 w-5" />
            </Button>
          </div>

          {/* Pulse rate simulator */}
          <div className="flex items-center justify-end gap-3">
            <div className="p-2 bg-white/5 rounded-xl text-[#0a5c5f]">
              <Heart className="h-5 w-5 text-rose-500 fill-current animate-pulse" />
            </div>
            <div className="text-right">
              <span className="text-[9px] text-slate-400 block uppercase font-bold">Simulated Pulse Rate</span>
              <span className="text-xs font-bold text-slate-100">{pulseRate} BPM</span>
            </div>
          </div>

        </div>

      </div>

      {/* Right Area: Medical Records History Drawer (1/3 width) */}
      <div className="w-full md:w-96 border-l border-white/10 bg-slate-900/60 h-full flex flex-col justify-between p-6">
        
        {/* Navigation tabs */}
        <Tabs defaultValue="history" className="w-full h-full flex flex-col overflow-hidden">
          <TabsList className="grid grid-cols-2 bg-white/5 rounded-xl p-1 mb-6 border border-white/5 shrink-0">
            <TabsTrigger value="history" className="rounded-lg text-xs font-bold py-2 data-[state=active]:bg-[#0a5c5f] data-[state=active]:text-white">
              History
            </TabsTrigger>
            <TabsTrigger value="session" className="rounded-lg text-xs font-bold py-2 data-[state=active]:bg-[#0a5c5f] data-[state=active]:text-white">
              Live Session
            </TabsTrigger>
          </TabsList>

          {/* Tab 1: Medical History */}
          <TabsContent value="history" className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-none outline-none">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Recent Medical Records</h3>
            
            <Card className="bg-white/5 border-white/5 rounded-2xl">
              <CardContent className="p-4 space-y-2">
                <div className="flex justify-between items-center text-[10px] text-slate-400 font-semibold">
                  <span>Cardiology Report</span>
                  <span>Mar 12, 2024</span>
                </div>
                <p className="text-xs text-slate-300 font-light leading-relaxed">
                  Patient reported mild palpitations during exercise. Previous ECG showed normal sinus rhythm with occasional PVCs.
                </p>
                <Link href="/patient/records" className="text-[10px] font-bold text-teal-400 hover:underline inline-block pt-1">
                  View Full Report
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/5 rounded-2xl">
              <CardContent className="p-4 space-y-3">
                <div className="flex justify-between items-center text-[10px] text-slate-400 font-semibold">
                  <span>Lab Results: Lipid Profile</span>
                  <span>Feb 28, 2024</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[9px] px-2 py-0.5 rounded font-bold">
                    HIGH CHOLESTEROL
                  </span>
                  <span className="bg-white/5 text-slate-300 text-[9px] px-2 py-0.5 rounded">
                    LDL: 160mg/dL
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/5 rounded-2xl">
              <CardContent className="p-4 space-y-2">
                <span className="text-[10px] text-slate-400 block font-bold uppercase">Chronic Conditions</span>
                <ul className="list-disc pl-4 text-xs text-slate-300 space-y-1 font-light">
                  <li>Hypertension (Stage 1)</li>
                  <li>Type 2 Diabetes Mellitus</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab 2: Live session status */}
          <TabsContent value="session" className="flex-1 overflow-y-auto flex flex-col justify-between pr-1 outline-none">
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Notes</h3>
              <div className="p-5 border border-white/5 bg-white/5 rounded-2xl text-center space-y-3">
                <Loader2 className="h-6 w-6 text-teal-400 animate-spin mx-auto" />
                <p className="text-xs text-slate-300 leading-relaxed font-light">
                  Dr. Elena Santos is currently compile-writing your diagnosis notes and active prescriptions.
                </p>
                <p className="text-[10px] text-slate-400">
                  These records will instantly sync to your dashboard timeline once the call concludes.
                </p>
              </div>
            </div>

            <div className="p-4 border border-teal-500/20 bg-[#0a5c5f]/5 rounded-2xl flex items-start gap-2.5 mt-8">
              <ShieldCheck className="h-5 w-5 text-teal-400 shrink-0 mt-0.5" />
              <div>
                <h5 className="text-xs font-bold text-slate-200">Security Parameters</h5>
                <p className="text-[10px] text-slate-400 font-light leading-relaxed mt-0.5">
                  Your telemedicine connection is encrypted end-to-end and complies with HIPAA compliance regulations.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>

      </div>
    </div>
  );
}
