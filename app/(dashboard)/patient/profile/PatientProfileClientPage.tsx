"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  User, 
  Phone, 
  MapPin, 
  CalendarDays, 
  AlertCircle, 
  CheckCircle2, 
  X, 
  ShieldCheck,
  UserCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { updatePatientProfile } from "@/actions/profile";

interface PatientProfileClientPageProps {
  patient: any;
}

export default function PatientProfileClientPage({ patient }: PatientProfileClientPageProps) {
  const router = useRouter();

  // Extract address parts
  const addressParts = patient.address ? patient.address.split(",") : [];
  const initialStreet = addressParts[0]?.trim() || "";
  const initialCity = addressParts[1]?.trim() || "";
  const initialProvince = addressParts[2]?.trim() || "";
  const initialPostalCode = addressParts[3]?.trim() || "";

  // Form states
  const [name, setName] = useState(patient.user?.name || "");
  const [dateOfBirth, setDateOfBirth] = useState(patient.dateOfBirth ? patient.dateOfBirth.split("T")[0] : "");
  const [gender, setGender] = useState(patient.gender || "Female");
  const [bloodType, setBloodType] = useState(patient.bloodType || "O+");
  
  const [phone, setPhone] = useState(patient.phone || "");
  const [email] = useState(patient.user?.email || "");

  const [streetAddress, setStreetAddress] = useState(initialStreet);
  const [city, setCity] = useState(initialCity);
  const [province, setProvince] = useState(initialProvince);
  const [postalCode, setPostalCode] = useState(initialPostalCode);

  // Status states
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleReset = () => {
    setName(patient.user?.name || "");
    setDateOfBirth(patient.dateOfBirth ? patient.dateOfBirth.split("T")[0] : "");
    setGender(patient.gender || "Female");
    setBloodType(patient.bloodType || "O+");
    setPhone(patient.phone || "");
    setStreetAddress(initialStreet);
    setCity(initialCity);
    setProvince(initialProvince);
    setPostalCode(initialPostalCode);
    setSuccessMsg("Changes reset to original values.");
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const handleCancel = () => {
    router.push("/patient");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg("Full name is required.");
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    // Combine address parts
    const combinedAddress = [streetAddress.trim(), city.trim(), province.trim(), postalCode.trim()]
      .filter(Boolean)
      .join(", ");

    const result = await updatePatientProfile({
      name,
      dateOfBirth: dateOfBirth || undefined,
      gender,
      bloodType,
      phone: phone || undefined,
      address: combinedAddress || undefined
    });

    if (result.error) {
      setErrorMsg(result.error);
    } else {
      setSuccessMsg("Profile updated successfully!");
      router.refresh();
      setTimeout(() => setSuccessMsg(null), 3000);
    }
    setIsLoading(false);
  };

  const userInitials = name
    ? name.split(" ").map((n: string) => n[0]).join("").toUpperCase().substring(0, 2)
    : "P";

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-4xl mx-auto font-sans text-slate-800">
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

      {/* Form Container */}
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Top Header Card */}
        <div className="flex justify-between items-center pb-4 border-b border-slate-200">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Edit Profile</h1>
            <p className="text-xs text-slate-500 font-light mt-0.5">Manage your personal details and residential address</p>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleCancel}
              className="rounded-xl border-slate-200 text-slate-600 font-semibold h-10 px-4"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading}
              className="bg-[#0a5c5f] hover:bg-[#084a4c] text-white font-semibold h-10 px-5 rounded-xl border-none shadow-sm"
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>

        {/* Profile Picture Card */}
        <Card className="border-slate-100 shadow-sm rounded-2xl bg-white overflow-hidden">
          <CardContent className="p-6 flex flex-col sm:flex-row items-center gap-6">
            <Avatar className="h-20 w-20 border border-slate-100 bg-[#0a5c5f]/5 text-[#0a5c5f] flex items-center justify-center text-xl font-bold">
              <AvatarFallback className="bg-[#0a5c5f]/5 text-[#0a5c5f]">
                {userInitials}
              </AvatarFallback>
            </Avatar>
            <div className="text-center sm:text-left space-y-2">
              <h3 className="font-extrabold text-slate-800 text-base">Profile Picture</h3>
              <p className="text-xs text-slate-400 font-light max-w-sm">
                Update your photo for better identification by your providers. Recommended size 400x400px.
              </p>
              <div className="flex items-center justify-center sm:justify-start gap-4 text-xs font-bold pt-1">
                <button type="button" className="text-teal-600 hover:underline">Change Photo</button>
                <span className="text-slate-300">•</span>
                <button type="button" className="text-rose-500 hover:underline">Remove</button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Personal Information Card */}
        <Card className="border-slate-100 shadow-sm rounded-2xl bg-white">
          <CardContent className="p-6 space-y-5">
            <h3 className="text-sm font-extrabold text-slate-900 tracking-tight flex items-center gap-2 pb-2 border-b border-slate-100 uppercase">
              <User className="h-4.5 w-4.5 text-[#0a5c5f]" />
              <span>Personal Information</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <Label htmlFor="fullname" className="text-xs font-bold text-slate-700">Full Name</Label>
                <Input 
                  type="text" 
                  id="fullname"
                  className="h-11 border-slate-200 focus:border-[#0a5c5f] focus:ring-[#0a5c5f]/10 rounded-xl text-sm"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="dob" className="text-xs font-bold text-slate-700">Date of Birth</Label>
                <div className="relative">
                  <Input 
                    type="date" 
                    id="dob"
                    className="h-11 border-slate-200 focus:border-[#0a5c5f] focus:ring-[#0a5c5f]/10 rounded-xl text-sm font-sans"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="gender" className="text-xs font-bold text-slate-700">Gender</Label>
                <select
                  id="gender"
                  className="w-full h-11 border border-slate-200 focus:border-[#0a5c5f] rounded-xl px-3.5 text-sm font-semibold text-slate-700 bg-white"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                >
                  <option>Female</option>
                  <option>Male</option>
                  <option>Other</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="bloodtype" className="text-xs font-bold text-slate-700">Blood Type</Label>
                <select
                  id="bloodtype"
                  className="w-full h-11 border border-slate-200 focus:border-[#0a5c5f] rounded-xl px-3.5 text-sm font-semibold text-slate-700 bg-white"
                  value={bloodType}
                  onChange={(e) => setBloodType(e.target.value)}
                >
                  <option>O+</option>
                  <option>O-</option>
                  <option>A+</option>
                  <option>A-</option>
                  <option>B+</option>
                  <option>B-</option>
                  <option>AB+</option>
                  <option>AB-</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Details Card */}
        <Card className="border-slate-100 shadow-sm rounded-2xl bg-white">
          <CardContent className="p-6 space-y-5">
            <h3 className="text-sm font-extrabold text-slate-900 tracking-tight flex items-center gap-2 pb-2 border-b border-slate-100 uppercase">
              <Phone className="h-4.5 w-4.5 text-[#0a5c5f]" />
              <span>Contact Details</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <Label htmlFor="phone" className="text-xs font-bold text-slate-700">Phone Number</Label>
                <Input 
                  type="text" 
                  id="phone"
                  placeholder="e.g. +63 917 123 4567"
                  className="h-11 border-slate-200 focus:border-[#0a5c5f] focus:ring-[#0a5c5f]/10 rounded-xl text-sm"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-bold text-slate-700">Email Address</Label>
                <Input 
                  type="email" 
                  id="email"
                  className="h-11 border-slate-100 bg-slate-50 text-slate-400 rounded-xl text-sm cursor-not-allowed"
                  value={email}
                  disabled
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Residential Address Card */}
        <Card className="border-slate-100 shadow-sm rounded-2xl bg-white">
          <CardContent className="p-6 space-y-5">
            <h3 className="text-sm font-extrabold text-slate-900 tracking-tight flex items-center gap-2 pb-2 border-b border-slate-100 uppercase">
              <MapPin className="h-4.5 w-4.5 text-[#0a5c5f]" />
              <span>Residential Address</span>
            </h3>
            
            <div className="space-y-5">
              <div className="space-y-1.5">
                <Label htmlFor="street" className="text-xs font-bold text-slate-700">Street Address</Label>
                <Input 
                  type="text" 
                  id="street"
                  placeholder="e.g. 123 Ayala Avenue, Unit 402, Tower One"
                  className="h-11 border-slate-200 focus:border-[#0a5c5f] focus:ring-[#0a5c5f]/10 rounded-xl text-sm"
                  value={streetAddress}
                  onChange={(e) => setStreetAddress(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="space-y-1.5">
                  <Label htmlFor="city" className="text-xs font-bold text-slate-700">City</Label>
                  <Input 
                    type="text" 
                    id="city"
                    placeholder="e.g. Makati City"
                    className="h-11 border-slate-200 focus:border-[#0a5c5f] focus:ring-[#0a5c5f]/10 rounded-xl text-sm"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="province" className="text-xs font-bold text-slate-700">Province</Label>
                  <Input 
                    type="text" 
                    id="province"
                    placeholder="e.g. Metro Manila"
                    className="h-11 border-slate-200 focus:border-[#0a5c5f] focus:ring-[#0a5c5f]/10 rounded-xl text-sm"
                    value={province}
                    onChange={(e) => setProvince(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="postal" className="text-xs font-bold text-slate-700">Postal Code</Label>
                  <Input 
                    type="text" 
                    id="postal"
                    placeholder="e.g. 1226"
                    className="h-11 border-slate-200 focus:border-[#0a5c5f] focus:ring-[#0a5c5f]/10 rounded-xl text-sm"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bottom Form Actions */}
        <div className="flex gap-4 pt-4 justify-end border-t border-slate-200">
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleReset}
            className="rounded-xl border-slate-200 text-slate-600 font-semibold h-11 px-6 bg-slate-100 hover:bg-slate-200 border-none shadow-none"
          >
            Reset Changes
          </Button>
          <Button 
            type="submit" 
            disabled={isLoading}
            className="bg-[#0a5c5f] hover:bg-[#084a4c] text-white font-semibold h-11 px-8 rounded-xl border-none shadow-md"
          >
            {isLoading ? "Saving Profile..." : "Update My Profile"}
          </Button>
        </div>

      </form>
    </div>
  );
}
