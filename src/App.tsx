import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";
import {
  Testimonial,
  CompanySettings,
  Product,
  Category,
} from "./types";

// Modular Component Views
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import AboutUs from "./components/AboutUs";
import Services from "./components/Services";
import TestimonialSection from "./components/TestimonialSection";
import FAQ from "./components/FAQ";
import ContactUs from "./components/ContactUs";
import MedicineBooking from "./components/MedicineBooking";
import ToastContainer, { ToastMessage, ToastType } from "./components/Toast";

export default function App() {
  const [activeTab, setActiveTab] = useState<string>("home");

  // Toast notifications state
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: ToastType, title: string, message: string) => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 5);
    setToasts((prev) => [...prev, { id, type, title, message }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  // Datasets from API Server
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  const [settings, setSettings] = useState<CompanySettings>({
    companyName: "Sai Marketing Medical Agencies",
    ownerName: "Murali Krishna",
    phone: "+91 85230 86151",
    email: "muralikrisnna@gmail.com",
    address:
      "D.No. 10-5-268, Doddapuram Street, Reddy and Reddy's Colony, Tirupati, Andhra Pradesh – 517501, India",
    whatsappNumber: "+918523086151",
    facebookUrl: "https://facebook.com",
    twitterUrl: "https://twitter.com",
    linkedinUrl: "https://linkedin.com",
    officeHours: "Monday - Saturday: 9:00 AM - 8:00 PM (Sunday Closed)",
    announcement:
      "Rayalaseema's premier certified medical supplies and laboratory chemicals wholesale terminal.",
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);



  // General loader from Express API
  const fetchAllData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [testRes, setRes] = await Promise.all([
        fetch("/api/testimonials"),
        fetch("/api/settings"),
      ]);

      if (testRes.ok) setTestimonials(await testRes.json());
      if (setRes.ok) setSettings(await setRes.json());
    } catch (err) {
      console.error("Failed to parse wholesale dataset from server:", err);
      setError(
        "Unable to connect to the backend server. Please verify connections.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Universal Inquiry Submission Channel
  const handleSubmitInquiry = async (formData: any) => {
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Submission unsuccessful.");
      }
      return data;
    } catch (err: any) {
      throw new Error(err.message || "Connection timeout to Sai network desk.");
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col font-sans select-none antialiased">
      {/* Premium Sticky Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        settings={settings}
      />

      {/* Main Content Layout Sheet */}
      <main className="flex-1">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-48 space-y-4 font-sans">
            <div className="w-10 h-10 rounded-full border-4 border-slate-200 border-t-brand-medium animate-spin"></div>
            <p className="text-xs text-brand-deep/60 font-black tracking-widest uppercase font-mono">
              Assembling certified data lines...
            </p>
          </div>
        ) : error ? (
          <div className="max-w-md mx-auto text-center py-24 px-4 space-y-4 font-sans">
            <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-none flex items-center justify-center mx-auto border border-rose-100 shadow">
              <ShieldCheck size={24} />
            </div>
            <p className="font-bold text-brand-deep">
              Connection Interrupted
            </p>
            <p className="text-xs text-brand-deep/70 leading-relaxed">
              {error}
            </p>
            <button
              onClick={fetchAllData}
              className="bg-brand-deep text-white font-bold text-[10px] uppercase tracking-widest px-6 py-3 cursor-pointer rounded-xl transition-all hover:bg-brand-medium"
            >
              Retry Connection
            </button>
          </div>
        ) : (
          <div className="animate-in fade-in duration-300">
            {activeTab === "home" && (
              <>
                <Hero setActiveTab={setActiveTab} settings={settings} />

                {/* Modern Medicine Booking container */}
                <MedicineBooking
                  onSubmitInquiry={handleSubmitInquiry}
                  whatsappNumber={settings.whatsappNumber}
                  addToast={addToast}
                />

                <TestimonialSection testimonials={testimonials} />
                <FAQ />
              </>
            )}

            {activeTab === "about" && (
              <AboutUs settings={settings} setActiveTab={setActiveTab} />
            )}

            {activeTab === "services" && (
              <Services setActiveTab={setActiveTab} />
            )}

            {activeTab === "testimonials" && (
              <TestimonialSection testimonials={testimonials} />
            )}

            {activeTab === "contact" && (
              <ContactUs
                settings={settings}
                onSubmitInquiry={handleSubmitInquiry}
                addToast={addToast}
              />
            )}
          </div>
        )}
      </main>

      {/* Global Regulatory Footer */}
      <footer className="bg-brand-deep text-slate-100 border-t border-brand-medium/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 font-sans">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
            {/* Branding Column (6 cols) */}
            <div className="lg:col-span-6 space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-brand-medium flex items-center justify-center text-white">
                  <span className="font-extrabold text-xl leading-none font-serif">
                    S
                  </span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-white tracking-tight leading-tight uppercase font-sans">
                    Sai Marketing
                  </h3>
                  <p className="text-[10px] font-medium tracking-widest text-brand-light uppercase font-mono">
                    Medical Agencies
                  </p>
                </div>
              </div>

              <p className="text-xs text-slate-350 leading-relaxed max-w-md font-sans">
                Sai Marketing Medical Agencies, based in Reddy & Reddy Colony,
                Tirupati, is AP's accredited wholesale terminal distributing
                certified medical, pharmaceutical, lab chemicals, and cleaning
                concentrates.
              </p>

              <div className="text-[10px] text-slate-400 font-mono flex items-center gap-2 pt-2">
                <ShieldCheck size={14} className="text-brand-sky" />
                <span>GSTIN & Drug Control Registered Partner</span>
              </div>
            </div>

            {/* Links Column (3 cols) */}
            <div className="lg:col-span-3 space-y-4">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-200 font-mono">
                Wholesale Portfolios
              </h4>
              <ul className="text-xs text-slate-400 space-y-2.5">
                <li>Pharma Disposables</li>
                <li>Laboratory Chemicals</li>
                <li>Hospital Textiles</li>
                <li>Hygiene Formulations</li>
              </ul>
            </div>

            {/* Geography Column (3 cols) */}
            <div className="lg:col-span-3 space-y-4 text-xs font-sans">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-200 font-mono">
                Coordinates
              </h4>
              <div className="space-y-3 text-slate-400">
                <div className="flex gap-2.5 items-start">
                  <MapPin
                    size={14}
                    className="text-brand-sky shrink-0 mt-0.5"
                  />
                  <span className="leading-relaxed text-[11px]">
                    {settings.address}
                  </span>
                </div>
                <div className="flex gap-2.5 items-start">
                  <Phone size={14} className="text-brand-sky shrink-0 mt-0.5" />
                  <span className="font-mono text-[11px]">
                    {settings.phone} ({settings.ownerName})
                  </span>
                </div>
                <div className="flex gap-2.5 items-start">
                  <Mail size={14} className="text-brand-sky shrink-0 mt-0.5" />
                  <span className="font-mono text-[11px] truncate">
                    {settings.email}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Subfooter bottom copyright area */}
          <div className="mt-12 lg:mt-16 pt-8 border-t border-brand-medium/20 flex flex-col sm:flex-row justify-between items-center gap-4 text-slate-400 text-[10px]">
            <div>
              <p>
                © {new Date().getFullYear()} Sai Marketing Medical Agencies. All
                rights reserved. Tirupati, India.
              </p>
            </div>
            <div className="font-mono flex items-center gap-3">
              <p>Designed For Secure Wholesale Dispatch</p>
            </div>
          </div>
        </div>
      </footer>

      {/* Global premium interactive toast system container */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
}
