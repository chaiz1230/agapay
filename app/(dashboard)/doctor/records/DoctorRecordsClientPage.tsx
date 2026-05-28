"use client";

import React, { useState } from "react";
import { 
  FileText, 
  Search, 
  ChevronRight, 
  Calendar,
  Activity,
  Heart,
  X,
  CheckCircle2,
  Stethoscope,
  ClipboardList,
  Pill,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";

interface DoctorRecordsClientPageProps {
  records: any[];
  doctorId: string;
}

export default function DoctorRecordsClientPage({ records, doctorId }: DoctorRecordsClientPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRecord, setSelectedRecord] = useState<any | null>(null);

  // Filter records
  const filteredRecords = records.filter((r) => {
    const query = searchQuery.toLowerCase();
    const patientName = r.patient?.user?.name.toLowerCase() || "";
    const diagnosis = r.diagnosis.toLowerCase();
    const treatment = r.treatment.toLowerCase();
    const notes = (r.notes || "").toLowerCase();

    return patientName.includes(query) || 
           diagnosis.includes(query) || 
           treatment.includes(query) || 
           notes.includes(query);
  });

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

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Patient EHR Records</h1>
          <p className="text-slate-500 font-light mt-1">Access clinical summaries, diagnoses, and treatment plans you logged</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
        <Input
          type="text"
          placeholder="Search by patient name, diagnosis, or treatment plan..."
          className="pl-10 h-11 border-slate-200 focus:border-[#0a5c5f] focus:ring-[#0a5c5f]/10 rounded-xl"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Records Timeline List */}
      <div className="space-y-4 relative before:absolute before:inset-y-0 before:left-4 before:w-[2px] before:bg-slate-200/60 pb-8">
        {filteredRecords.length === 0 ? (
          <div className="text-center py-16 bg-white border border-slate-100 rounded-3xl space-y-4 shadow-sm">
            <div className="p-4 bg-slate-50 rounded-full inline-block text-slate-400">
              <FileText className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">No medical records found</h3>
            <p className="text-slate-400 text-sm max-w-sm mx-auto">
              We couldn't find any matching records. Try adjusting your search term.
            </p>
          </div>
        ) : (
          filteredRecords.map((record) => {
            const dateStr = formatDate(record.createdAt);
            const timeStr = formatTime(record.createdAt);

            return (
              <div key={record.id} className="relative pl-12 space-y-4 group animate-fade-in">
                {/* Timeline Icon Marker */}
                <div className="absolute left-1 top-1.5 h-8 w-8 rounded-full border-4 border-slate-50 bg-white text-[#0a5c5f] flex items-center justify-center shadow-sm z-10">
                  <Calendar className="h-3.5 w-3.5" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                  {/* Left Details Panel */}
                  <Card className="lg:col-span-2 border-slate-100 shadow-sm rounded-2xl bg-white overflow-hidden hover:border-slate-200 transition-all">
                    <CardContent className="p-6 space-y-4">
                      {/* Provider / Patient Header */}
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10 border border-slate-100 bg-[#0a5c5f]/5 text-[#0a5c5f] flex items-center justify-center font-bold text-sm">
                            <span>{record.patient?.user?.name ? record.patient.user.name[0] : "P"}</span>
                          </Avatar>
                          <div>
                            <h4 className="font-extrabold text-slate-800 text-base">{record.diagnosis}</h4>
                            <p className="text-xs text-[#0a5c5f] font-semibold mt-0.5">
                              Patient: {record.patient?.user?.name} ({getAge(record.patient?.dateOfBirth)} Yrs • {record.patient?.gender})
                            </p>
                          </div>
                        </div>
                        <Badge className="bg-slate-100 text-slate-600 hover:bg-slate-100 font-semibold px-2.5 py-0.5 rounded border border-slate-200 text-[10px]">
                          EHR Record
                        </Badge>
                      </div>

                      {/* Summary Notes */}
                      <div className="p-4 bg-slate-50/50 border border-slate-100 rounded-xl">
                        <p className="text-slate-600 text-xs font-light leading-relaxed whitespace-pre-wrap">
                          <span className="font-bold text-slate-700 block mb-1">Treatment Plan:</span>
                          {record.treatment}
                        </p>
                      </div>

                      <div className="flex justify-between items-center text-xs text-slate-400 font-medium pt-2">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          <span>Logged on {dateStr} at {timeStr}</span>
                        </div>
                        <Button 
                          onClick={() => setSelectedRecord(record)}
                          variant="link" 
                          className="text-[#0a5c5f] hover:underline font-bold text-xs p-0 h-auto"
                        >
                          View Full Record Summary
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Session Details card */}
                  <Card className="border-slate-100 bg-slate-50/30 p-5 rounded-2xl text-left flex flex-col justify-start">
                    <div>
                      <h4 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">Session Details</h4>
                      <div className="mt-4 space-y-2 text-xs text-slate-600 font-semibold pt-1">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Duration:</span>
                          <span className="text-slate-800 font-bold">45 min</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Platform:</span>
                          <span className="text-slate-800 font-bold">Agapay Room</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Encryption:</span>
                          <span className="text-slate-800 font-bold">HIPAA Secure</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Record details popup */}
      <Dialog open={!!selectedRecord} onOpenChange={() => setSelectedRecord(null)}>
        {selectedRecord && (
          <DialogContent className="max-w-lg rounded-3xl p-6 bg-white border border-slate-100 font-sans">
            <DialogHeader className="pb-3 border-b border-slate-100">
              <DialogTitle className="text-xl font-extrabold text-slate-900">Clinical Record Summary</DialogTitle>
              <DialogDescription className="text-slate-500 text-xs font-light">Detailed view of the logged consultation EHR</DialogDescription>
            </DialogHeader>

            <div className="space-y-5 pt-3">
              {/* Patient Info Header */}
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <Avatar className="h-10 w-10 border border-slate-150 bg-[#0a5c5f]/5 text-[#0a5c5f] flex items-center justify-center font-bold text-sm">
                  <span>{selectedRecord.patient?.user?.name[0]}</span>
                </Avatar>
                <div>
                  <h4 className="font-bold text-slate-850 text-sm">{selectedRecord.patient?.user?.name}</h4>
                  <p className="text-[11px] text-slate-500 font-semibold">
                    Age: {getAge(selectedRecord.patient?.dateOfBirth)} • Gender: {selectedRecord.patient?.gender} • Blood Type: {selectedRecord.patient?.bloodType || "O+"}
                  </p>
                </div>
              </div>

              {/* Consultation Date */}
              <div className="flex justify-between items-center text-xs border-b border-slate-100 pb-3">
                <span className="text-slate-500 font-medium">Logged Date</span>
                <span className="text-slate-800 font-bold flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5 text-[#0a5c5f]" />
                  {formatDate(selectedRecord.createdAt)} • {formatTime(selectedRecord.createdAt)}
                </span>
              </div>

              {/* Diagnosis and Treatment */}
              <div className="space-y-3.5">
                <div className="space-y-1">
                  <Label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    <Stethoscope className="h-3.5 w-3.5 text-[#0a5c5f]" />
                    <span>Clinical Diagnosis</span>
                  </Label>
                  <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-100 text-xs text-slate-800 font-bold">
                    {selectedRecord.diagnosis}
                  </div>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    <ClipboardList className="h-3.5 w-3.5 text-[#0a5c5f]" />
                    <span>Treatment Plan</span>
                  </Label>
                  <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-100 text-xs text-slate-600 font-light leading-relaxed">
                    {selectedRecord.treatment}
                  </div>
                </div>

                {/* Prescriptions (Optional) */}
                {selectedRecord.prescription && (
                  <div className="space-y-1">
                    <Label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                      <Pill className="h-3.5 w-3.5 text-[#0a5c5f]" />
                      <span>Prescribed Medications</span>
                    </Label>
                    <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-100 text-xs text-slate-600 font-medium leading-relaxed whitespace-pre-wrap">
                      {selectedRecord.prescription}
                    </div>
                  </div>
                )}

                {/* Private Consultation Notes */}
                <div className="space-y-1">
                  <Label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    <FileText className="h-3.5 w-3.5 text-[#0a5c5f]" />
                    <span>Consultation Summary Notes</span>
                  </Label>
                  <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-100 text-xs text-slate-600 font-light leading-relaxed whitespace-pre-wrap">
                    {selectedRecord.notes || "No extra summary notes logged."}
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Button 
                  onClick={() => setSelectedRecord(null)}
                  className="w-full bg-[#0a5c5f] hover:bg-[#084a4c] text-white rounded-xl h-11 font-semibold"
                >
                  Close Record
                </Button>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
