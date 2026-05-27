"use client";

import React, { useState, useEffect } from "react";
import { 
  Clock, 
  Calendar, 
  Check, 
  Save, 
  Coffee, 
  Sun, 
  Moon, 
  CalendarDays, 
  AlertCircle, 
  Trash2, 
  Plus, 
  ChevronRight,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface ScheduleClientPageProps {
  doctor: any;
}

export default function ScheduleClientPage({ doctor }: ScheduleClientPageProps) {
  // Days of the week configuration
  const [activeDays, setActiveDays] = useState<string[]>([
    "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"
  ]);

  // Working shift details
  const [shiftStart, setShiftStart] = useState("09:00 AM");
  const [shiftEnd, setShiftEnd] = useState("05:00 PM");
  const [slotDuration, setSlotDuration] = useState("45"); // 45 minutes
  const [breakStart, setBreakStart] = useState("12:00 PM");
  const [breakEnd, setBreakEnd] = useState("01:00 PM");
  
  // Custom blocked out timeslots (simulated)
  const [blockedSlots, setBlockedSlots] = useState<string[]>(["11:15 AM"]);
  // Simulated booked timeslots (e.g. booked by patient appointments)
  const [bookedSlots] = useState<string[]>(["02:00 PM"]);

  // Specific custom holidays / blockout dates
  const [blockoutDates, setBlockoutDates] = useState<Array<{ date: string; reason: string }>>([
    { date: "2026-06-12", reason: "Independence Day Holiday" }
  ]);
  const [newBlockoutDate, setNewBlockoutDate] = useState("");
  const [newBlockoutReason, setNewBlockoutReason] = useState("");

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [generatedSlots, setGeneratedSlots] = useState<string[]>([]);

  const weekdays = [
    "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
  ];

  // Simple slot generator helper
  useEffect(() => {
    // Generate simulated standard timeslots based on inputs
    const slots = [
      "09:00 AM",
      "09:45 AM",
      "10:30 AM",
      "11:15 AM",
      "01:00 PM",
      "01:45 PM",
      "02:30 PM",
      "03:15 PM",
      "04:00 PM",
      "04:45 PM"
    ];
    setGeneratedSlots(slots);
  }, [shiftStart, shiftEnd, slotDuration]);

  const toggleDay = (day: string) => {
    if (activeDays.includes(day)) {
      setActiveDays(activeDays.filter((d) => d !== day));
    } else {
      setActiveDays([...activeDays, day]);
    }
  };

  const handleSlotClick = (slot: string) => {
    if (bookedSlots.includes(slot)) return; // Can't block a booked slot
    if (blockedSlots.includes(slot)) {
      setBlockedSlots(blockedSlots.filter((s) => s !== slot));
    } else {
      setBlockedSlots([...blockedSlots, slot]);
    }
  };

  const handleAddBlockoutDate = () => {
    if (!newBlockoutDate || !newBlockoutReason) return;
    setBlockoutDates([...blockoutDates, { date: newBlockoutDate, reason: newBlockoutReason }]);
    setNewBlockoutDate("");
    setNewBlockoutReason("");
  };

  const handleRemoveBlockoutDate = (index: number) => {
    setBlockoutDates(blockoutDates.filter((_, i) => i !== index));
  };

  const handleSaveSchedule = () => {
    setIsLoading(true);
    setToastMessage(null);
    
    // Simulate API database save
    setTimeout(() => {
      setIsLoading(false);
      setToastMessage("Schedule configuration updated successfully!");
      
      // Auto clear toast
      setTimeout(() => {
        setToastMessage(null);
      }, 3000);
    }, 1200);
  };

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Schedule Management</h1>
          <p className="text-slate-500 font-light mt-1">Configure your weekly availability shifts and custom consultation slots</p>
        </div>
        <Button 
          onClick={handleSaveSchedule}
          disabled={isLoading}
          className="bg-[#0a5c5f] hover:bg-[#084a4c] text-white flex items-center gap-2 rounded-xl h-11 px-5 shadow-sm font-semibold transition-all"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Saving...</span>
            </span>
          ) : (
            <>
              <Save className="h-4 w-4" />
              <span>Save Changes</span>
            </>
          )}
        </Button>
      </div>

      {/* Floating Success Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-[#0a5c5f] border border-[#084a4c] text-white rounded-2xl p-4 shadow-xl z-50 flex items-center gap-3 animate-bounce">
          <Check className="h-5 w-5 bg-teal-800 text-white rounded-full p-1 shrink-0" />
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (Weekly Shift Preferences) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Weekly Days Toggle Card */}
          <Card className="border-slate-100 shadow-sm rounded-2xl bg-white">
            <CardHeader className="px-6 pt-6 pb-2">
              <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-[#0a5c5f]" />
                <span>Working Days</span>
              </CardTitle>
              <CardDescription className="text-slate-500 font-light mt-0.5">Toggle weekdays where you are actively holding telehealth appointments</CardDescription>
            </CardHeader>
            <CardContent className="px-6 pb-6 pt-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                {weekdays.map((day) => {
                  const isActive = activeDays.includes(day);
                  return (
                    <button
                      key={day}
                      onClick={() => toggleDay(day)}
                      type="button"
                      className={`p-4 rounded-2xl border text-center transition-all flex flex-col justify-between items-center gap-3 ${
                        isActive
                          ? "bg-[#0a5c5f]/5 border-[#0a5c5f] text-[#0a5c5f] font-semibold"
                          : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                      }`}
                    >
                      <span className="text-xs uppercase font-extrabold tracking-wider">{day.substring(0, 3)}</span>
                      <div className={`h-5 w-5 rounded-full flex items-center justify-center border ${
                        isActive ? "bg-[#0a5c5f] border-transparent text-white" : "border-slate-300 bg-white"
                      }`}>
                        {isActive && <Check className="h-3 w-3" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Shift Details (Hours and Duration) */}
          <Card className="border-slate-100 shadow-sm rounded-2xl bg-white">
            <CardHeader className="px-6 pt-6 pb-2">
              <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Clock className="h-5 w-5 text-[#0a5c5f]" />
                <span>Shift Parameters</span>
              </CardTitle>
              <CardDescription className="text-slate-500 font-light mt-0.5">Define your daily hours and break durations</CardDescription>
            </CardHeader>
            <CardContent className="px-6 pb-6 pt-4 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                {/* Working Hours */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Working Hours</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="shift-start" className="text-xs font-semibold text-slate-600">Start Time</Label>
                      <select 
                        id="shift-start"
                        value={shiftStart}
                        onChange={(e) => setShiftStart(e.target.value)}
                        className="w-full h-11 border border-slate-200 focus:border-[#0a5c5f] rounded-xl px-3.5 text-sm font-semibold text-slate-700 bg-white"
                      >
                        <option>08:00 AM</option>
                        <option>09:00 AM</option>
                        <option>10:00 AM</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="shift-end" className="text-xs font-semibold text-slate-600">End Time</Label>
                      <select 
                        id="shift-end"
                        value={shiftEnd}
                        onChange={(e) => setShiftEnd(e.target.value)}
                        className="w-full h-11 border border-slate-200 focus:border-[#0a5c5f] rounded-xl px-3.5 text-sm font-semibold text-slate-700 bg-white"
                      >
                        <option>04:00 PM</option>
                        <option>05:00 PM</option>
                        <option>06:00 PM</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Break Interval */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Midday Break</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="break-start" className="text-xs font-semibold text-slate-600">Start Time</Label>
                      <select 
                        id="break-start"
                        value={breakStart}
                        onChange={(e) => setBreakStart(e.target.value)}
                        className="w-full h-11 border border-slate-200 focus:border-[#0a5c5f] rounded-xl px-3.5 text-sm font-semibold text-slate-700 bg-white"
                      >
                        <option>12:00 PM</option>
                        <option>12:30 PM</option>
                        <option>01:00 PM</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="break-end" className="text-xs font-semibold text-slate-600">End Time</Label>
                      <select 
                        id="break-end"
                        value={breakEnd}
                        onChange={(e) => setBreakEnd(e.target.value)}
                        className="w-full h-11 border border-slate-200 focus:border-[#0a5c5f] rounded-xl px-3.5 text-sm font-semibold text-slate-700 bg-white"
                      >
                        <option>01:00 PM</option>
                        <option>01:30 PM</option>
                        <option>02:00 PM</option>
                      </select>
                    </div>
                  </div>
                </div>

              </div>

              {/* Consultation Slot Duration selector */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Consultation Slot Duration</h4>
                <div className="grid grid-cols-4 gap-3">
                  {["15", "30", "45", "60"].map((mins) => {
                    const isSelected = slotDuration === mins;
                    return (
                      <button
                        key={mins}
                        onClick={() => setSlotDuration(mins)}
                        type="button"
                        className={`py-3.5 rounded-xl border text-center transition-all ${
                          isSelected
                            ? "bg-[#0a5c5f] text-white border-transparent shadow-sm font-extrabold"
                            : "bg-white border-slate-200 text-slate-600 font-bold hover:bg-slate-50"
                        }`}
                      >
                        <span className="block text-sm">{mins} Min</span>
                      </button>
                    );
                  })}
                </div>
              </div>

            </CardContent>
          </Card>

          {/* Interactive Timeslots Grid */}
          <Card className="border-slate-100 shadow-sm rounded-2xl bg-white">
            <CardHeader className="px-6 pt-6 pb-2">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-xl font-bold text-slate-900">Active Slots Planner</CardTitle>
                  <CardDescription className="text-slate-500 font-light mt-0.5">Click slots to toggle their daily blocked/available status</CardDescription>
                </div>
                <Badge className="bg-[#0a5c5f]/5 text-[#0a5c5f] border-none font-bold text-[10px] px-2.5 py-1">
                  Dynamic Schedule
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="px-6 pb-6 pt-4 space-y-6">
              
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
                {generatedSlots.map((slot) => {
                  const isBooked = bookedSlots.includes(slot);
                  const isBlocked = blockedSlots.includes(slot);
                  
                  return (
                    <button
                      key={slot}
                      onClick={() => handleSlotClick(slot)}
                      type="button"
                      disabled={isBooked}
                      className={`p-3.5 rounded-2xl border text-center transition-all flex flex-col justify-center items-center gap-1.5 min-h-[75px] relative ${
                        isBooked
                          ? "bg-slate-50 border-slate-100 text-slate-400 cursor-not-allowed"
                          : isBlocked
                          ? "bg-rose-50 border-rose-200 text-rose-600"
                          : "bg-white border-slate-200 text-slate-700 hover:border-[#0a5c5f] hover:bg-slate-50/50"
                      }`}
                    >
                      <span className="text-xs font-black">{slot.split(" ")[0]}</span>
                      <span className="text-[9px] font-bold uppercase tracking-wider">{slot.split(" ")[1]}</span>
                      
                      {/* Status indicator pill */}
                      <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full mt-1.5 uppercase ${
                        isBooked
                          ? "bg-slate-100 text-slate-400"
                          : isBlocked
                          ? "bg-rose-100 text-rose-600"
                          : "bg-teal-50 text-teal-700"
                      }`}>
                        {isBooked ? "Booked" : isBlocked ? "Blocked" : "Free"}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Guide Legend */}
              <div className="flex gap-4 pt-4 border-t border-slate-100 text-[10px] text-slate-500 font-bold justify-center">
                <span className="flex items-center gap-1.5">
                  <div className="h-3 w-3 bg-white border border-slate-200 rounded" />
                  <span>Available / Free</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <div className="h-3 w-3 bg-rose-50 border border-rose-200 rounded" />
                  <span>Blocked / Personal Off</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <div className="h-3 w-3 bg-slate-100 border border-slate-100 rounded" />
                  <span>Already Booked</span>
                </span>
              </div>

            </CardContent>
          </Card>

        </div>

        {/* Right Column (Block-out Custom Dates / Holidays settings) */}
        <div className="space-y-8">
          
          {/* Quick Stats Overview */}
          <Card className="bg-gradient-to-tr from-[#0a5c5f] to-teal-700 text-white border-none rounded-2xl overflow-hidden relative shadow-md">
            <div className="absolute right-0 top-0 opacity-10 pointer-events-none p-4">
              <Sparkles className="h-36 w-36" />
            </div>
            <CardContent className="p-6 space-y-4">
              <span className="text-[10px] font-extrabold uppercase tracking-wider bg-white/10 px-2 py-0.5 rounded-full">Weekly Workload</span>
              <div className="space-y-1">
                <h4 className="text-3xl font-black">30h Slots</h4>
                <p className="text-xs text-teal-100 font-light">Calculated availability for upcoming week</p>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10 text-xs font-semibold">
                <div>
                  <span className="block text-teal-100/70 text-[9px] uppercase">Active Shift</span>
                  <span className="block text-sm font-extrabold mt-0.5">8 Hours/Day</span>
                </div>
                <div>
                  <span className="block text-teal-100/70 text-[9px] uppercase">Break Break</span>
                  <span className="block text-sm font-extrabold mt-0.5">1 Hour/Day</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Blockout Dates Card */}
          <Card className="border-slate-100 shadow-sm rounded-2xl bg-white">
            <CardHeader className="px-6 pt-6 pb-2">
              <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Calendar className="h-4.5 w-4.5 text-[#0a5c5f]" />
                <span>Holidays & Off Days</span>
              </CardTitle>
              <CardDescription className="text-slate-500 font-light mt-0.5">Block out full days from schedule</CardDescription>
            </CardHeader>
            <CardContent className="px-6 pb-6 space-y-4 pt-4">
              
              {/* Blockout Dates list */}
              <div className="space-y-2">
                {blockoutDates.map((item, index) => (
                  <div key={item.date} className="flex justify-between items-center p-3 border border-slate-100 rounded-xl bg-slate-50/50 gap-2">
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">
                        {new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </span>
                      <span className="text-[10px] text-slate-500 font-light mt-0.5 block">{item.reason}</span>
                    </div>
                    <button 
                      onClick={() => handleRemoveBlockoutDate(index)}
                      className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add blockout form */}
              <div className="p-4 border border-slate-100 rounded-2xl bg-slate-50/20 space-y-3 pt-3">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Add Custom Off Day</span>
                <div className="space-y-1.5">
                  <Label htmlFor="blockout-date" className="text-[10px] font-semibold text-slate-500">Select Date</Label>
                  <Input 
                    type="date"
                    id="blockout-date"
                    className="h-10 border-slate-200 rounded-lg text-xs"
                    value={newBlockoutDate}
                    onChange={(e) => setNewBlockoutDate(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="blockout-reason" className="text-[10px] font-semibold text-slate-500">Reason</Label>
                  <Input 
                    type="text"
                    id="blockout-reason"
                    placeholder="e.g. Medical Conference"
                    className="h-10 border-slate-200 rounded-lg text-xs"
                    value={newBlockoutReason}
                    onChange={(e) => setNewBlockoutReason(e.target.value)}
                  />
                </div>
                <Button 
                  type="button"
                  onClick={handleAddBlockoutDate}
                  disabled={!newBlockoutDate || !newBlockoutReason}
                  className="w-full bg-[#0a5c5f]/10 text-[#0a5c5f] hover:bg-[#0a5c5f]/20 hover:text-[#084a4c] font-bold text-xs h-9 rounded-lg flex items-center justify-center gap-1 mt-2 border-none shadow-none"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Exception</span>
                </Button>
              </div>

            </CardContent>
          </Card>

        </div>

      </div>
    </div>
  );
}
