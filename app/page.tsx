import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { 
  HeartPulse, 
  Video, 
  ShieldCheck, 
  Pill, 
  Sparkles, 
  Star, 
  ArrowRight,
  TrendingUp,
  MessageSquare
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface DoctorCardProps {
  name: string;
  specialization: string;
  experience: string;
  rating: string;
  reviews: string;
}

const getDoctorImage = (name: string) => {
  const lowercaseName = name.toLowerCase();
  if (lowercaseName.includes("santos")) return "/dr_elena_santos.png";
  if (lowercaseName.includes("chen")) return "/dr_sofia_chen.png";
  if (lowercaseName.includes("rivera")) return "/dr_marco_rivera.png";
  return "/dr_julian_reyes.png";
};

function DoctorCard({ name, specialization, experience, rating, reviews }: DoctorCardProps) {
  const imageUrl = getDoctorImage(name);
  return (
    <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center">
      <Avatar className="h-24 w-24 border border-slate-100 mb-4 bg-teal-50 text-[#0a5c5f] flex items-center justify-center font-bold text-xl overflow-hidden relative">
        <AvatarImage src={imageUrl} alt={name} className="object-cover w-full h-full object-center" />
        <AvatarFallback>{name.split(" ").slice(-1)[0][0]}</AvatarFallback>
      </Avatar>
      <h3 className="font-bold text-slate-800 text-lg">{name}</h3>
      <p className="text-xs text-slate-500 font-medium mt-1">{specialization} • {experience}</p>
      <div className="flex items-center gap-1 mt-2 text-amber-500 text-xs font-bold">
        <Star className="h-3.5 w-3.5 fill-current" />
        <span>{rating}</span>
        <span className="text-slate-400 font-light">({reviews} reviews)</span>
      </div>
      <Button asChild size="sm" className="w-full bg-[#0a5c5f] hover:bg-[#084a4c] text-white mt-5 rounded-xl h-9">
        <Link href="/register">Book Now</Link>
      </Button>
    </div>
  );
}

interface TestimonialCardProps {
  quote: string;
  name: string;
  location: string;
  initials: string;
}

function TestimonialCard({ quote, name, location, initials }: TestimonialCardProps) {
  return (
    <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm flex flex-col justify-between h-full">
      <p className="text-slate-600 text-sm leading-relaxed italic font-light">
        "{quote}"
      </p>
      <div className="flex items-center gap-3 mt-6">
        <Avatar className="h-9 w-9 bg-teal-50 text-[#0a5c5f] font-bold text-xs">
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <div>
          <h4 className="text-xs font-bold text-slate-800">{name}</h4>
          <p className="text-[10px] text-slate-400 font-medium">{location}</p>
        </div>
      </div>
    </div>
  );
}

export default async function HomePage() {
  const session = await auth();

  // If already logged in, redirect straight to portal
  if (session) {
    redirect(session.user.role === "DOCTOR" ? "/doctor" : "/patient");
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Header / Navbar */}
      <header className="border-b border-slate-200 bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="p-1.5 bg-[#0a5c5f] rounded-lg text-white">
                <HeartPulse className="h-5 w-5" />
              </div>
              <span className="text-lg font-bold text-[#0a5c5f] tracking-wide">AGAPAY</span>
            </Link>

          </div>

          <div className="flex items-center gap-4">
            <Button asChild className="bg-[#0a5c5f] hover:bg-[#084a4c] text-white rounded-xl px-6 h-10 font-semibold shadow-sm transition-all">
              <Link href="/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 md:py-24 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0a5c5f]/5 text-[#0a5c5f] text-xs font-semibold">
            <HeartPulse className="h-3.5 w-3.5" />
            <span>Philippines' AI Telehealth Ecosystem</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Healthcare that stays <br className="hidden md:inline" />
            <span className="italic text-[#0a5c5f]">beside</span> you.
          </h1>

          <p className="text-slate-600 text-lg leading-relaxed font-light">
            AGAPAY connects patients and doctors through accessible, modern, and compassionate online healthcare. Seamlessly manage your health from any device.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <Button asChild className="bg-[#0a5c5f] hover:bg-[#084a4c] text-white rounded-xl px-6 h-12 font-semibold">
              <Link href="/register">Book Consultation</Link>
            </Button>
            <Button asChild variant="outline" className="border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl px-6 h-12 font-semibold">
              <Link href="/register">Find a Doctor</Link>
            </Button>
          </div>

          {/* Specialities count */}
          <div className="flex items-center gap-4 pt-6 border-t border-slate-200">
            <div className="flex -space-x-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-8 w-8 rounded-full border-2 border-white bg-slate-300 flex items-center justify-center text-[10px] font-bold text-slate-600">
                  U{i}
                </div>
              ))}
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800">500+ Licensed Specialists</p>
              <p className="text-[10px] text-slate-400">Available for instant consultation</p>
            </div>
          </div>
        </div>

        {/* Hero Image Mockup (Clean CSS representation) */}
        <div className="relative h-[400px] lg:h-[480px] bg-gradient-to-tr from-teal-900 via-[#0a5c5f] to-emerald-800 rounded-3xl overflow-hidden shadow-lg p-8 flex flex-col justify-between text-white">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent pointer-events-none" />
          
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl max-w-[240px] shadow-sm">
            <div className="flex items-center gap-2 text-xs font-semibold">
              <div className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Next Session</span>
            </div>
            <p className="text-sm font-bold mt-1">Today, 2:00 PM</p>
          </div>

          <div className="my-auto text-center space-y-4 max-w-sm mx-auto">
            <div className="h-16 w-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto text-teal-200">
              <Video className="h-8 w-8" />
            </div>
            <h3 className="text-2xl font-bold">Virtual Specialist Consultation</h3>
            <p className="text-xs text-teal-100 font-light">Secure video calling and real-time medical chart integration.</p>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-white/10">
            <span className="text-xs text-teal-200">100% HIPAA Protected Connection</span>
            <div className="bg-emerald-500 text-white text-[10px] font-bold uppercase px-2 py-0.5 rounded-full">
              Live
            </div>
          </div>
        </div>
      </section>

      {/* Value Propositions / Features Section */}
      <section className="bg-white py-16 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-6 text-center space-y-12">
          <div className="max-w-xl mx-auto space-y-2">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Care designed around your life</h2>
            <p className="text-slate-500 font-light text-sm">We've removed the barriers to quality healthcare. Experience a seamless journey from diagnosis to recovery.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-50 border border-slate-100 p-8 rounded-2xl text-left space-y-4 hover:border-slate-200 transition-colors">
              <div className="p-3 bg-teal-50 text-[#0a5c5f] rounded-xl inline-block">
                <Video className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-slate-800 text-lg">HD Virtual Consults</h3>
              <p className="text-slate-500 text-sm leading-relaxed font-light">
                Crystal clear video calls with built-in medical file sharing and real-time chat.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-100 p-8 rounded-2xl text-left space-y-4 hover:border-slate-200 transition-colors">
              <div className="p-3 bg-teal-50 text-[#0a5c5f] rounded-xl inline-block">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-slate-800 text-lg">Bank-Grade Security</h3>
              <p className="text-slate-500 text-sm leading-relaxed font-light">
                Your health data is encrypted with AES-256 standards, ensuring total privacy and HIPAA compliance.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-100 p-8 rounded-2xl text-left space-y-4 hover:border-slate-200 transition-colors">
              <div className="p-3 bg-teal-50 text-[#0a5c5f] rounded-xl inline-block">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-slate-800 text-lg">AI Health Assistant</h3>
              <p className="text-slate-500 text-sm leading-relaxed font-light">
                A 24/7 intelligent companion to help you track symptoms and suggest medical specialists.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Specialist Partners Section */}
      <section className="py-16 max-w-7xl mx-auto px-6 space-y-12">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Meet our Specialist Partners</h2>
            <p className="text-slate-500 font-light text-sm mt-1">Every doctor on AGAPAY undergoes a rigorous verification process.</p>
          </div>
          <Link href="/register" className="text-[#0a5c5f] hover:underline font-bold text-sm flex items-center gap-1">
            <span>View All Specialists</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <DoctorCard name="Dr. Elena Santos" specialization="Cardiologist" experience="12 yrs exp." rating="4.9" reviews="128" />
          <DoctorCard name="Dr. Marco Rivera" specialization="Pediatrician" experience="8 yrs exp." rating="4.7" reviews="92" />
          <DoctorCard name="Dr. Sofia Chen" specialization="Dermatologist" experience="15 yrs exp." rating="4.8" reviews="210" />
          <DoctorCard name="Dr. Julian Reyes" specialization="Psychiatrist" experience="10 yrs exp." rating="4.9" reviews="88" />
        </div>
      </section>

      {/* Testimonials / Healing Stories */}
      <section className="py-16 bg-slate-100/50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          <h2 className="text-3xl font-bold text-slate-900 text-center tracking-tight">Healing Stories</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <TestimonialCard 
              quote="The mental health support I received through AGAPAY was life-changing. Finding a therapist who truly understood my context was so easy." 
              name="Maria L." 
              location="Manila, PH" 
              initials="ML" 
            />
            <TestimonialCard 
              quote="Agapay lives up to its name. They were literally beside me during my recovery. The video quality is amazing, and my doctor was incredibly attentive." 
              name="Robert C." 
              location="Cebu City, PH" 
              initials="RC" 
            />
            <TestimonialCard 
              quote="As a busy mom, being able to talk to a pediatrician at 8 PM without leaving the house is a blessing. AGAPAY is now our primary family care tool." 
              name="Althea T." 
              location="Davao, PH" 
              initials="AT" 
            />
          </div>
        </div>
      </section>

      {/* CTA Footer Banner */}
      <section className="py-16 max-w-7xl mx-auto px-6">
        <div className="bg-[#0a5c5f] text-white rounded-3xl p-12 text-center space-y-6 relative overflow-hidden">
          <div className="absolute left-0 top-0 opacity-10 pointer-events-none transform -translate-x-12 -translate-y-12">
            <TrendingUp className="h-64 w-64" />
          </div>

          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Ready to start your journey to better health?</h2>
          <p className="text-teal-50 max-w-lg mx-auto font-light leading-relaxed">
            Join thousands of patients who have found their medical partner through AGAPAY.
          </p>

          <div className="flex justify-center gap-4 pt-4">
            <Button asChild className="bg-white hover:bg-slate-100 text-[#0a5c5f] font-bold rounded-xl px-6 h-12 shadow-md">
              <Link href="/register">Sign Up for Free</Link>
            </Button>
            <Button asChild variant="outline" className="border-white/20 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl px-6 h-12">
              <Link href="#">Talk to Support</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 text-white">
              <div className="p-1.5 bg-[#0a5c5f] rounded-lg text-white">
                <HeartPulse className="h-5 w-5" />
              </div>
              <span className="text-lg font-bold tracking-wide">AGAPAY</span>
            </Link>
            <p className="text-xs leading-relaxed font-light">
              Empowering healthcare through digital excellence and Filipino compassion. Side-by-side in your healing journey.
            </p>
          </div>
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4">Solutions</h4>
            <ul className="space-y-2 text-xs font-light">
              <li><Link href="#" className="hover:text-white">Telemedicine</Link></li>
              <li><Link href="#" className="hover:text-white">Mental Health</Link></li>
              <li><Link href="#" className="hover:text-white">Lab Results</Link></li>
              <li><Link href="#" className="hover:text-white">Prescriptions</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4">Company</h4>
            <ul className="space-y-2 text-xs font-light">
              <li><Link href="#" className="hover:text-white">About Us</Link></li>
              <li><Link href="#" className="hover:text-white">Careers</Link></li>
              <li><Link href="#" className="hover:text-white">Partners</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4">Legal</h4>
            <ul className="space-y-2 text-xs font-light">
              <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white">Terms of Service</Link></li>
              <li><Link href="#" className="hover:text-white">Compliance</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-8 pt-8 border-t border-slate-800 text-center text-xs font-light">
          © 2026 AGAPAY Telehealth Ecosystem. All rights reserved.
        </div>
      </footer>
    </div>
  );
}