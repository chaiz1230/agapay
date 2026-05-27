"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { 
  FileText, 
  Search, 
  Upload, 
  SlidersHorizontal,
  Calendar,
  Activity,
  Heart,
  ChevronDown,
  X,
  CheckCircle2,
  FileUp,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";

interface PatientRecordsClientPageProps {
  initialRecords: any[];
  patientId: string;
}



export default function PatientRecordsClientPage({ initialRecords, patientId }: PatientRecordsClientPageProps) {
  // Map DB records
  const dbRecords = useMemo(() => initialRecords.map((r) => ({
    id: r.id,
    date: new Date(r.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    time: new Date(r.createdAt).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
    title: r.diagnosis,
    provider: `Dr. ${r.doctor.user?.name} • ${r.doctor.specialization}`,
    type: "CONSULTATION",
    status: "Completed",
    notes: r.treatment + (r.notes ? `\n\nNotes: ${r.notes}` : ""),
    files: []
  })), [initialRecords]);

  // Setup dynamic relative dates for mock records to make date range filters work accurately
  const dynamicMockRecords = useMemo(() => [
    {
      id: "mock-1",
      date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      time: "10:30 AM",
      title: "Post-Surgical Follow-up",
      provider: "Dr. Mateo Rivera • General Surgery",
      type: "CONSULTATION",
      status: "Confirmed",
      notes: "Patient shows excellent recovery post-appendectomy. Wound site is healing cleanly with no signs of infection. Recommended continuation of light physical activity and gradual return to normal diet.",
      files: [
        { name: "Prescription_Followup.pdf", description: "Bronchodilator inhaler and paracetamol schedule." },
        { name: "Pathology_Report.pdf", description: "Complete blood count panel and lipid counts showing normal ranges." }
      ],
      vitals: {
        bp: "120/80",
        hr: "72 bpm"
      }
    },
    {
      id: "mock-2",
      date: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      time: "08:00 AM",
      title: "Annual Blood Panel",
      provider: "St. Jude Medical Laboratories",
      type: "LAB",
      status: "Archive",
      notes: "Routine lipid profile and blood chemistry completed. Cholesterol counts show mild elevation, advice given regarding dietary adjustments.",
      files: [
        { name: "Complete_Panel_Blood.pdf", description: "Complete metabolic panel scans and thyroid analysis report." },
        { name: "Summary_Notes.pdf", description: "Doctor's analysis of lipid balance changes." }
      ]
    },
    {
      id: "mock-3",
      date: new Date(Date.now() - 240 * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      time: "03:00 PM",
      title: "General Health Assessment",
      provider: "Dr. Elena Santos • Cardiology",
      type: "CONSULTATION",
      status: "Completed",
      notes: "Cardiovascular response is excellent. Normal sinus rhythm observed on resting ECG. Blood pressure stable.",
      files: []
    }
  ], []);

  // Combine DB & mock records in local state to allow new additions
  const [records, setRecords] = useState<any[]>([]);

  useEffect(() => {
    setRecords([...dbRecords, ...dynamicMockRecords]);
  }, [dbRecords, dynamicMockRecords]);
  
  // Filtering & searching states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("All Records");
  const [isAdvancedFiltersOpen, setIsAdvancedFiltersOpen] = useState(false);

  // Advanced filters choices
  const [filterSpecialty, setFilterSpecialty] = useState("All");
  const [filterDateRange, setFilterDateRange] = useState("All");
  const [filterHasVitals, setFilterHasVitals] = useState(false);

  // Upload modal states
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadNotes, setUploadNotes] = useState("");
  const [uploadFileName, setUploadFileName] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [successToast, setSuccessToast] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleZoneClick = () => {
    fileInputRef.current?.click();
  };

  // Drag and Drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setUploadFileName(file.name);
    }
  };

  const handleFileUploadSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadFileName(e.target.files[0].name);
    }
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadTitle || !uploadFileName) return;

    const newRecord = {
      id: `uploaded-${Date.now()}`,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      time: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
      title: uploadTitle,
      provider: "Patient Self Upload",
      type: "LAB",
      status: "Archive",
      notes: uploadNotes || "Self-submitted document scan.",
      files: [
        { name: uploadFileName, description: "Uploaded by patient for clinic review." }
      ]
    };

    setRecords([newRecord, ...records]);
    setUploadTitle("");
    setUploadNotes("");
    setUploadFileName("");
    setIsUploadOpen(false);
    
    setSuccessToast(true);
    setTimeout(() => setSuccessToast(false), 3000);
  };

  // Filter application
  const filteredRecords = records.filter((record) => {
    // Search query match
    const matchesSearch = 
      record.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.notes.toLowerCase().includes(searchQuery.toLowerCase());
      
    // Tab category match
    const matchesType = 
      selectedType === "All Records" ||
      (selectedType === "Consultations" && record.type === "CONSULTATION") ||
      (selectedType === "Labs" && record.type === "LAB") ||
      (selectedType === "Prescriptions" && record.files?.some((f: any) => f.name.toLowerCase().includes("prescription")));

    // Advanced specialty match
    const matchesSpecialty = 
      filterSpecialty === "All" ||
      record.provider.toLowerCase().includes(filterSpecialty.toLowerCase());

    // Advanced vitals match
    const matchesVitals = !filterHasVitals || !!record.vitals;

    // Advanced date range match (using date comparisons)
    let matchesDate = true;
    if (filterDateRange !== "All") {
      const recordDate = new Date(record.date);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - recordDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (filterDateRange === "Last 30 Days") {
        matchesDate = diffDays <= 30;
      } else if (filterDateRange === "Last 6 Months") {
        matchesDate = diffDays <= 180;
      }
    }

    return matchesSearch && matchesType && matchesSpecialty && matchesVitals && matchesDate;
  });

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Medical Records</h1>
          <p className="text-slate-500 font-light mt-1">Access your complete health history and diagnostic assets</p>
        </div>
        <Button 
          onClick={() => setIsUploadOpen(true)}
          className="bg-[#0a5c5f] hover:bg-[#084a4c] text-white flex items-center gap-2 rounded-xl h-11"
        >
          <Upload className="h-4 w-4" />
          <span>Upload Record</span>
        </Button>
      </div>

      {/* Floating Success Toast */}
      {successToast && (
        <div className="fixed bottom-6 right-6 bg-[#0a5c5f] border border-[#084a4c] text-white rounded-2xl p-4 shadow-xl z-50 flex items-center gap-3 animate-bounce">
          <CheckCircle2 className="h-5 w-5 bg-teal-800 text-white rounded-full p-1 shrink-0" />
          <span className="text-sm font-semibold">Document uploaded to timeline successfully!</span>
        </div>
      )}

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
          <Input
            type="text"
            placeholder="Search by diagnosis, doctor, or keyword..."
            className="pl-10 h-11 border-slate-200 focus:border-[#0a5c5f] focus:ring-[#0a5c5f]/10 rounded-xl"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-3">
          <div className="relative min-w-[160px]">
            <select
              className="w-full h-11 border border-slate-200 focus:border-[#0a5c5f] rounded-xl px-4 text-sm font-bold text-slate-700 bg-white focus:outline-none appearance-none cursor-pointer"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option>All Records</option>
              <option>Consultations</option>
              <option>Labs</option>
              <option>Prescriptions</option>
            </select>
            <ChevronDown className="absolute right-3.5 top-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
          </div>
          
          <Button 
            variant="outline" 
            onClick={() => setIsAdvancedFiltersOpen(true)}
            className="flex items-center gap-2 border-slate-200 hover:bg-slate-100 rounded-xl h-11 px-4"
          >
            <SlidersHorizontal className="h-4 w-4 text-slate-500" />
            <span>Advanced Filters</span>
          </Button>
        </div>
      </div>

      {/* Main Records Timeline */}
      <div className="space-y-10 relative before:absolute before:inset-y-0 before:left-4 before:w-[2px] before:bg-slate-200/60 pb-8">
        {filteredRecords.length === 0 ? (
          <div className="text-center py-16 bg-white border border-slate-100 rounded-3xl space-y-4">
            <div className="p-4 bg-slate-50 rounded-full inline-block text-slate-400">
              <FileText className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">No medical records found</h3>
            <p className="text-slate-400 text-sm max-w-sm mx-auto">
              We couldn't find any matching records. Try adjusting your search terms or filters.
            </p>
          </div>
        ) : (
          filteredRecords.map((record, index) => {
            const dateParts = record.date.split(",");
            const monthYear = dateParts[0].split(" ")[0] + " " + (dateParts[1]?.trim() || "");

            return (
              <div key={record.id} className="relative pl-12 space-y-4 group animate-fade-in">
                {/* Timeline Icon Marker */}
                <div className="absolute left-1 top-1.5 h-8 w-8 rounded-full border-4 border-slate-50 bg-white text-[#0a5c5f] flex items-center justify-center shadow-sm z-10">
                  <Calendar className="h-3.5 w-3.5" />
                </div>

                {/* Header Month divider */}
                {index === 0 || records[index - 1].date.split(",")[1] !== record.date.split(",")[1] ? (
                  <h3 className="text-lg font-extrabold text-slate-900 tracking-tight pb-1">
                    {monthYear}
                  </h3>
                ) : null}

                {/* Main Card Item */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                  
                  {/* Left details panel (2/3 width) */}
                  <Card className="lg:col-span-2 border-slate-100 shadow-sm rounded-2xl bg-white overflow-hidden hover:border-slate-200 transition-all">
                    <CardContent className="p-6 space-y-4">
                      {/* Provider Header */}
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10 border border-slate-100 bg-[#0a5c5f]/5 text-[#0a5c5f] flex items-center justify-center font-bold text-sm">
                            <span>{record.provider.split(" ").slice(-1)[0][0] || "C"}</span>
                          </Avatar>
                          <div>
                            <h4 className="font-extrabold text-slate-800 text-base">{record.title}</h4>
                            <p className="text-xs text-[#0a5c5f] font-semibold mt-0.5">{record.provider}</p>
                          </div>
                        </div>
                        <Badge className="bg-slate-100 text-slate-600 hover:bg-slate-100 font-semibold px-2.5 py-0.5 rounded border border-slate-200 text-[10px]">
                          {record.status}
                        </Badge>
                      </div>

                      {/* Summary Notes */}
                      <div className="p-4 bg-slate-50/50 border border-slate-100 rounded-xl">
                        <p className="text-slate-600 text-xs font-light leading-relaxed whitespace-pre-wrap">
                          {record.notes}
                        </p>
                      </div>

                      {/* File details (Instead of broken PDF download links) */}
                      {record.files && record.files.length > 0 && (
                        <div className="space-y-2 mt-3 pt-3 border-t border-slate-100">
                          <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wide">Attached Pathology / Prescriptions Files</span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {record.files.map((file: any) => (
                              <div key={file.name} className="p-3 border border-slate-100 bg-slate-50/50 rounded-xl text-left">
                                <span className="text-xs font-bold text-slate-800 block">{file.name}</span>
                                <span className="text-[10px] text-slate-500 font-light mt-0.5 block">{file.description}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Vitals Sidebar / Session details card (Static cards - No View Report buttons) */}
                  {record.vitals ? (
                    <Card className="border-slate-100 bg-slate-50/30 shadow-sm rounded-2xl p-5 text-left space-y-4">
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                        <Activity className="h-4 w-4 text-[#0a5c5f]" />
                        <span>Vitals Recorded</span>
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white p-3.5 border border-slate-100 rounded-xl shadow-sm">
                          <span className="text-[10px] text-slate-400 font-bold block uppercase">Blood Pressure</span>
                          <span className="text-base font-extrabold text-slate-800 mt-1 block">{record.vitals.bp}</span>
                        </div>
                        <div className="bg-white p-3.5 border border-slate-100 rounded-xl shadow-sm">
                          <span className="text-[10px] text-slate-400 font-bold block uppercase">Heart Rate</span>
                          <span className="text-base font-extrabold text-slate-800 mt-1 block flex items-center gap-1">
                            <Heart className="h-4 w-4 text-rose-500 fill-current animate-pulse" />
                            <span>{record.vitals.hr}</span>
                          </span>
                        </div>
                      </div>
                    </Card>
                  ) : (
                    <Card className="border-slate-100 bg-slate-50/30 p-5 rounded-2xl text-left flex flex-col justify-between h-full min-h-[140px]">
                      <div>
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Session Details</h4>
                        <p className="text-xs text-slate-500 font-light mt-2 leading-relaxed">
                          Consultation notes compiled electronically during the telehealth video session.
                        </p>
                        <div className="mt-4 space-y-1 text-[10px] text-slate-400 font-semibold border-t border-slate-100/60 pt-2">
                          <div className="flex justify-between"><span>Duration:</span><span>45 min</span></div>
                          <div className="flex justify-between"><span>Platform:</span><span>Agapay Room</span></div>
                          <div className="flex justify-between"><span>Encryption:</span><span>HIPAA Secure</span></div>
                        </div>
                      </div>
                    </Card>
                  )}

                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Advanced Filters Dialog popup */}
      <Dialog open={isAdvancedFiltersOpen} onOpenChange={() => setIsAdvancedFiltersOpen(false)}>
        <DialogContent className="max-w-md rounded-3xl p-6 bg-white border border-slate-100">
          <DialogHeader className="pb-3 border-b border-slate-100">
            <DialogTitle className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <SlidersHorizontal className="h-5 w-5 text-[#0a5c5f]" />
              <span>Advanced Records Filters</span>
            </DialogTitle>
            <DialogDescription className="text-slate-500 text-xs font-light">Refine the clinical records shown in your timeline</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-3">
            {/* Specialty select filter */}
            <div className="space-y-1.5">
              <Label htmlFor="adv-spec" className="text-xs font-bold text-slate-700">Filter by Specialty / Provider</Label>
              <select
                id="adv-spec"
                className="w-full h-11 border border-slate-200 focus:border-[#0a5c5f] rounded-xl px-3.5 text-sm font-semibold text-slate-700 bg-white"
                value={filterSpecialty}
                onChange={(e) => setFilterSpecialty(e.target.value)}
              >
                <option value="All">All Specialties</option>
                <option value="Cardiology">Cardiology</option>
                <option value="Surgery">General Surgery</option>
                <option value="Pediatrics">Pediatrics</option>
                <option value="Laboratories">Labs</option>
              </select>
            </div>

            {/* Date range filter */}
            <div className="space-y-1.5">
              <Label htmlFor="adv-date" className="text-xs font-bold text-slate-700">Filter by Date Range</Label>
              <select
                id="adv-date"
                className="w-full h-11 border border-slate-200 focus:border-[#0a5c5f] rounded-xl px-3.5 text-sm font-semibold text-slate-700 bg-white"
                value={filterDateRange}
                onChange={(e) => setFilterDateRange(e.target.value)}
              >
                <option value="All">All Time</option>
                <option value="Last 30 Days">Last 30 Days</option>
                <option value="Last 6 Months">Last 6 Months</option>
              </select>
            </div>

            {/* Vitals checkbox filter */}
            <div className="flex items-center gap-2 pt-2">
              <input 
                type="checkbox" 
                id="adv-vitals" 
                className="h-4.5 w-4.5 rounded border-slate-300 text-[#0a5c5f] focus:ring-[#0a5c5f]"
                checked={filterHasVitals}
                onChange={(e) => setFilterHasVitals(e.target.checked)}
              />
              <Label htmlFor="adv-vitals" className="text-xs font-semibold text-slate-700">Only show reports with vital signs</Label>
            </div>

            <div className="flex gap-3 pt-4 border-t border-slate-100 mt-4">
              <Button 
                variant="outline" 
                onClick={() => {
                  setFilterSpecialty("All");
                  setFilterDateRange("All");
                  setFilterHasVitals(false);
                  setIsAdvancedFiltersOpen(false);
                }}
                className="flex-1 rounded-xl h-11 border-slate-200"
              >
                Reset
              </Button>
              <Button 
                onClick={() => setIsAdvancedFiltersOpen(false)}
                className="flex-1 bg-[#0a5c5f] hover:bg-[#084a4c] text-white rounded-xl h-11 font-semibold"
              >
                Apply Filters
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Upload Records Modal popup (With functional drag and drop) */}
      <Dialog open={isUploadOpen} onOpenChange={() => setIsUploadOpen(false)}>
        <DialogContent className="max-w-md rounded-3xl p-6 bg-white border border-slate-100">
          <DialogHeader className="pb-3 border-b border-slate-100">
            <DialogTitle className="text-xl font-extrabold text-slate-900">Upload Medical Record</DialogTitle>
            <DialogDescription className="text-slate-500 text-xs font-light">Attach laboratory results, diagnostic scans, or prescriptions</DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleUploadSubmit} className="space-y-4 pt-3">
            <div className="space-y-1.5">
              <Label htmlFor="doc-title" className="text-xs font-bold text-slate-700">Document Title *</Label>
              <Input
                type="text"
                id="doc-title"
                placeholder="e.g. Thyroid Scan Report, Blood Chemistry"
                className="h-10 border-slate-200 rounded-xl text-xs"
                value={uploadTitle}
                onChange={(e) => setUploadTitle(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="doc-notes" className="text-xs font-bold text-slate-700">Description Notes</Label>
              <textarea
                id="doc-notes"
                placeholder="Summary description of report contents..."
                rows={2}
                className="w-full border border-slate-200 focus:border-[#0a5c5f] focus:ring-1 focus:ring-[#0a5c5f] rounded-xl p-3 text-xs placeholder:text-slate-400 focus:outline-none"
                value={uploadNotes}
                onChange={(e) => setUploadNotes(e.target.value)}
              />
            </div>

             {/* Drag and Drop Zone */}
             <div className="space-y-1.5">
               <Label className="text-xs font-bold text-slate-700">Attach Scan File *</Label>
               <div 
                 onClick={handleZoneClick}
                 onDragOver={handleDragOver}
                 onDragLeave={handleDragLeave}
                 onDrop={handleDrop}
                 className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-colors relative ${
                   isDragging 
                     ? "border-[#0a5c5f] bg-[#0a5c5f]/5" 
                     : uploadFileName 
                     ? "border-emerald-300 bg-emerald-50/20"
                     : "border-slate-200 hover:border-[#0a5c5f]"
                 }`}
               >
                 <input 
                   type="file" 
                   ref={fileInputRef}
                   className="hidden"
                   onChange={handleFileUploadSelect}
                   accept=".pdf,.png,.jpg,.jpeg"
                 />
                 <div className="space-y-2 pointer-events-none">
                   <FileUp className={`h-8 w-8 mx-auto ${uploadFileName ? "text-emerald-500" : "text-slate-400"}`} />
                   {uploadFileName ? (
                     <div>
                       <p className="text-xs font-bold text-emerald-700">Selected: {uploadFileName}</p>
                       <p className="text-[10px] text-slate-400 font-light mt-0.5">Click or drag to replace file</p>
                     </div>
                   ) : (
                     <div>
                       <p className="text-xs font-bold text-slate-800">Drag & drop or click to choose file</p>
                       <p className="text-[10px] text-slate-400 font-light mt-0.5">Supports PDF, PNG, or JPG up to 10MB</p>
                     </div>
                   )}
                 </div>
               </div>
             </div>

            <div className="flex gap-3 pt-2">
              <Button 
                type="button"
                variant="outline" 
                className="flex-1 rounded-xl h-11 border-slate-200" 
                onClick={() => {
                  setUploadTitle("");
                  setUploadNotes("");
                  setUploadFileName("");
                  setIsUploadOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={!uploadTitle || !uploadFileName}
                className="flex-1 bg-[#0a5c5f] hover:bg-[#084a4c] text-white rounded-xl h-11 font-semibold"
              >
                Save Document
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
