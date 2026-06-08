import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Phone, Mail, MapPin, Clock, Send, MessageCircle, AlertCircle, CheckCircle2, ChevronUp } from "lucide-react";
import { CompanySettings } from "../types";

interface ContactUsProps {
  settings: CompanySettings;
  onSubmitInquiry: (formData: any) => Promise<any>;
  addToast?: (type: "success" | "error" | "info" | "whatsapp", title: string, message: string) => void;
}

export default function ContactUs({ settings, onSubmitInquiry, addToast }: ContactUsProps) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "info@saimarketing.com",
    companyName: "",
    message: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const toggleScrollTop = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener("scroll", toggleScrollTop);
    return () => window.removeEventListener("scroll", toggleScrollTop);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.message) {
      const errMsg = "Please provide your name, phone number, and query details.";
      setErrorMsg(errMsg);
      if (addToast) addToast("error", "Validation Required", errMsg);
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await onSubmitInquiry({
        ...formData,
        products: [] // General contact inquiry without items
      });
      const successMsgReceived = res.message || "Thank you! Your inquiry was sent successfully. Our office will get in touch soon.";
      setSuccessMsg(successMsgReceived);
      if (addToast) {
        addToast("success", "Message Forwarded", "Your wholesale inquiry was logged directly to Doddapuram St. desk");
      }
      setFormData({ name: "", phone: "", email: "info@saimarketing.com", companyName: "", message: "" });
    } catch (err: any) {
      const errMsg = err.message || "An error occurred. Please try again.";
      setErrorMsg(errMsg);
      if (addToast) addToast("error", "Error Submitting", errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsAppRedirect = () => {
    const cleanPhone = settings.whatsappNumber.replace(/[^0-9]/g, "");
    const msg = encodeURIComponent("Hello Sai Marketing Agencies, I would like to inquire about wholesale medical products.");
    if (addToast) {
      addToast("whatsapp", "Direct WhatsApp Line", "Launching chat with Sai Marketing Bulk Desk...");
    }
    window.open(`https://wa.me/${cleanPhone}?text=${msg}`, "_blank");
  };

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="bg-slate-50 py-16 sm:py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Contact Header */}
        <div className="text-center max-w-xl mx-auto space-y-4">
          <motion.span 
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs font-black text-brand-medium uppercase tracking-widest block font-mono"
          >
            Contact Information
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-serif font-black italic text-brand-deep tracking-tight"
          >
            Connect With Our Wholesale Desk
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-brand-deep/80 font-sans text-xs sm:text-sm max-w-md mx-auto"
          >
            Ready to place a bulk clinical order or purchase chemical reagents? Ring us, mail us, or submit this digital interest form.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start font-sans">
          
          {/* Details Column (5 Cols) */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 space-y-8"
          >
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-6">
              <h3 className="font-extrabold text-base text-brand-deep uppercase tracking-tight">Agency Coordinates</h3>
              
              <div className="space-y-6 font-sans text-xs sm:text-sm">
                {/* Address */}
                <div className="flex gap-4 items-start">
                  <div className="p-3 bg-brand-pale/50 rounded-xl text-brand-deep shrink-0">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <h4 className="font-black text-[11px] text-brand-medium uppercase tracking-wider font-mono">Address Location</h4>
                    <p className="text-brand-deep/80 leading-relaxed mt-1">
                      {settings.address}
                    </p>
                  </div>
                </div>

                {/* Mobile */}
                <div className="flex gap-4 items-start">
                  <div className="p-3 bg-brand-pale/50 rounded-xl text-brand-deep shrink-0">
                    <Phone size={18} />
                  </div>
                  <div>
                    <h4 className="font-black text-[11px] text-brand-medium uppercase tracking-wider font-mono">Primary Phone No</h4>
                    <a
                      href={`tel:${settings.phone}`}
                      className="font-bold text-brand-medium font-mono hover:underline block mt-1"
                    >
                      {settings.phone}
                    </a>
                    <span className="text-[10px] text-brand-medium/60 mt-0.5 block">Call for on-site sales dispatching support</span>
                  </div>
                </div>

                {/* Email */}
                <div className="flex gap-4 items-start">
                  <div className="p-3 bg-brand-pale/50 rounded-xl text-brand-deep shrink-0">
                    <Mail size={18} />
                  </div>
                  <div>
                    <h4 className="font-black text-[11px] text-brand-medium uppercase tracking-wider font-mono">Corporate Email</h4>
                    <a
                      href={`mailto:${settings.email}`}
                      className="font-bold text-brand-medium font-mono hover:underline block mt-1"
                    >
                      {settings.email}
                    </a>
                  </div>
                </div>

                {/* Office hours */}
                <div className="flex gap-4 items-start">
                  <div className="p-3 bg-brand-pale/50 rounded-xl text-brand-deep shrink-0">
                    <Clock size={18} />
                  </div>
                  <div>
                    <h4 className="font-black text-[11px] text-brand-medium uppercase tracking-wider font-mono">Working Office Hours</h4>
                    <p className="text-brand-deep/80 mt-1">{settings.officeHours}</p>
                  </div>
                </div>
              </div>

              {/* WhatsApp direct contact button */}
              <div className="pt-4 border-t border-slate-100">
                <button
                  onClick={handleWhatsAppRedirect}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-3.5 px-4 rounded-xl text-[11px] uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-emerald-50 transition-colors cursor-pointer select-none"
                >
                  <MessageCircle size={16} />
                  <span>Text Murali Krishna on WhatsApp</span>
                </button>
              </div>
            </div>

            {/* Newsletter form simulation */}
            <div className="bg-brand-deep text-slate-100 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
              <h4 className="font-black text-[11px] uppercase tracking-widest text-brand-sky font-mono">Wholesale Newsletter</h4>
              <p className="text-xs text-brand-pale/80 leading-relaxed font-sans">
                Stay updated with regulatory pharma announcements, stock replenishment cycles, and chemical price sheets.
              </p>
              <div className="flex gap-2 font-sans pt-1">
                <input
                  type="email"
                  placeholder="Enter email to subscribe"
                  className="bg-brand-medium/20 border-none text-xs rounded-xl px-3.5 py-3 flex-1 placeholder-brand-pale/45 focus:outline-none focus:ring-1 focus:ring-brand-sky text-white font-medium"
                />
                <button
                  onClick={() => alert("Successfully joined Sai Marketing Mailing List!")}
                  className="bg-brand-medium text-white hover:bg-brand-sky text-[10px] px-4 py-3 font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer select-none"
                >
                  Join
                </button>
              </div>
            </div>
          </motion.div>

          {/* Form Column (7 Cols) */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-6"
          >
            <h3 className="font-extrabold text-base text-brand-deep uppercase tracking-tight">Send Bulk Query</h3>
            
            {successMsg && (
              <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs p-4 rounded-xl flex items-start gap-3 leading-relaxed">
                <CheckCircle2 className="mt-0.5 shrink-0 text-emerald-600" size={16} />
                <span>{successMsg}</span>
              </div>
            )}

            {errorMsg && (
              <div className="bg-rose-50 border border-rose-100 text-rose-800 text-xs p-4 rounded-xl flex items-start gap-3 leading-relaxed">
                <AlertCircle className="mt-0.5 shrink-0 text-rose-600" size={16} />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleContactSubmit} className="space-y-5 font-sans text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[10px] font-black uppercase text-brand-medium tracking-widest">Your Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g. Murali Krishna"
                    className="w-full bg-slate-50 border border-slate-200 text-xs px-4 py-3 rounded-xl text-brand-deep placeholder-brand-medium/35 focus:outline-none focus:border-brand-sky focus:bg-white transition-all font-medium"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] font-black uppercase text-brand-medium tracking-widest">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g. +91 85230 86151"
                    className="w-full bg-slate-50 border border-slate-200 text-xs px-4 py-3 rounded-xl text-brand-deep placeholder-brand-medium/35 focus:outline-none focus:border-brand-sky focus:bg-white transition-all font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[10px] font-black uppercase text-brand-medium tracking-widest">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="e.g. muralikrishna@gmail.com"
                    className="w-full bg-slate-50 border border-slate-200 text-xs px-4 py-3 rounded-xl text-brand-deep placeholder-brand-medium/35 focus:outline-none focus:border-brand-sky focus:bg-white transition-all font-medium"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] font-black uppercase text-brand-medium tracking-widest">Company/Hospital/Pharma Name</label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    placeholder="e.g. Sri Venkateswara Hospital"
                    className="w-full bg-slate-50 border border-slate-200 text-xs px-4 py-3 rounded-xl text-brand-deep placeholder-brand-medium/35 focus:outline-none focus:border-brand-sky focus:bg-white transition-all font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-black uppercase text-brand-medium tracking-widest">Detailed Message / List of Products *</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  placeholder="Describe your wholesale order details, bulk sizes, items, and scheduled dispatch address..."
                  className="w-full bg-slate-50 border border-slate-200 text-xs px-4 py-3 rounded-xl text-brand-deep placeholder-brand-medium/35 focus:outline-none focus:border-brand-sky focus:bg-white transition-all resize-none font-medium leading-relaxed"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-brand-deep hover:bg-brand-medium text-white font-black uppercase tracking-widest text-[11px] py-4 rounded-xl flex items-center justify-center gap-2 shadow-md transition-colors cursor-pointer select-none"
              >
                <Send size={15} />
                <span>{isSubmitting ? "Sending..." : "Submit General Bulk Query"}</span>
              </button>
            </form>
          </motion.div>

        </div>

        {/* GOOGLE MAPS EMBEDDED INTEGRATION */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm"
        >
          <div className="p-6 border-b border-slate-50">
            <h4 className="font-extrabold text-brand-deep text-base uppercase tracking-tight">Find Our Physical Counters</h4>
            <p className="text-xs text-brand-medium/80 font-sans mt-0.5">Located at Doddapuram Street, Reddy colony. Stop by for authorized cash-and-carry handovers.</p>
          </div>
          <div className="h-96 w-full">
            <iframe
              src="https://maps.google.com/maps?q=D.No.%2010-5-268,%20Doddapuram%20Street,%20Reddy%20and%20Reddy's%20Colony,%20Tirupati,%20Andhra%20Pradesh%20%E2%80%93%20517501,%20India&t=&z=16&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              title="Sai Marketing Medical Agencies Google location map on Doddapuram Street, Tirupati"
            ></iframe>
          </div>
        </motion.div>

      </div>

      {/* DYNAMIC WHATSAPP FLOATING SPEED FLUTTER CHAT BUTTON */}
      <button
        onClick={handleWhatsAppRedirect}
        className="fixed bottom-6 right-6 z-40 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white p-4 rounded-full shadow-2xl transition-transform duration-300 flex items-center justify-center cursor-pointer border-4 border-white"
        title="Chat on WhatsApp"
      >
        <MessageCircle size={28} className="animate-pulse" />
      </button>

      {/* BACK TO TOP TRIGGER */}
      {showScrollTop && (
        <button
          onClick={handleScrollToTop}
          className="fixed bottom-24 right-7 z-40 bg-white/90 backdrop-blur-md hover:bg-brand-pale/40 text-brand-deep p-2.5 rounded-full border border-slate-200/80 shadow-md transition-transform flex items-center justify-center cursor-pointer animate-in fade-in duration-300"
          title="Scroll to Top"
        >
          <ChevronUp size={16} />
        </button>
      )}

    </div>
  );
}
