import React from "react";
import { motion } from "motion/react";
import { ArrowRight, ShieldCheck, Award, Zap, ThumbsUp, Landmark } from "lucide-react";
import { CompanySettings } from "../types";

interface HeroProps {
  setActiveTab: (tab: string) => void;
  settings: CompanySettings;
}

export default function Hero({ setActiveTab, settings }: HeroProps) {
  const stats = [
    { label: "Years of Trust", value: "12+" },
    { label: "B2B Clients Serviced", value: "350+" },
    { label: "Wholesale Products", value: "1,200+" },
    { label: "Regional Warehouses", value: "2" },
    { label: "Timely Delivery Support", value: "100%" }
  ];

  const features = [
    {
      icon: <Award className="w-6 h-6 text-brand-medium" />,
      title: "Trusted Distributor",
      description: "Direct tie-ups with top WHO-GMP certified pharma labs and chemical synthesis partners worldwide."
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-brand-medium" />,
      title: "Quality Authorized Products",
      description: "100% genuine medical equipment, precise testing-grade lab chemicals, and safe household formulas."
    },
    {
      icon: <Zap className="w-6 h-6 text-brand-medium" />,
      title: "Highly Competitive Pricing",
      description: "Optimized direct-bulk supply models enabling margins that beat standard regional open markets."
    },
    {
      icon: <Landmark className="w-6 h-6 text-brand-medium" />,
      title: "Timely Logistics & Delivery",
      description: "Dedicated transport vehicles facilitating secure, climate-controlled, safe supply runs directly to you."
    }
  ];

  return (
    <div className="bg-white text-brand-deep min-h-screen border-b border-brand-light/30 font-sans overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Main Editorial Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 border-x border-brand-light/20 min-h-[600px]">
          
          {/* Left Block: Column with editorial text (7 cols) */}
          <div className="lg:col-span-7 p-8 sm:p-12 lg:p-16 flex flex-col justify-center border-r border-brand-light/20 bg-white">
            <motion.span 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-brand-medium font-extrabold tracking-[0.3em] uppercase text-[11px] mb-5 block font-mono"
            >
              Tirupati's Certified Wholesaler
            </motion.span>
            
            <motion.h1 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-6xl lg:text-7xl font-sans font-light leading-[0.95] tracking-tight text-brand-deep mb-8"
            >
              Supplying <br/>
              <span className="font-serif font-black italic text-brand-medium">Health & Safety</span> <br/>
              to the Masses.
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="max-w-lg text-brand-deep/80 font-sans leading-relaxed text-sm sm:text-base mb-10"
            >
              Sai Marketing Medical Agencies specializes in the wholesale distribution of premium pharmaceutical supplies, surgical disposables, general sanitizers, and diagnostic tools across Andhra Pradesh. Est. Tirupati, secure terminal channels.
            </motion.p>

            {/* CTAs */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 pt-2"
            >
              <button
                onClick={() => {
                  const element = document.getElementById("booking-desk-section");
                  if (element) {
                    element.scrollIntoView({ behavior: "smooth", block: "start" });
                  } else {
                    setActiveTab("contact");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }
                }}
                className="flex-1 py-4 bg-brand-medium text-white text-xs font-black uppercase tracking-widest border border-brand-medium hover:bg-white hover:text-brand-medium hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 cursor-pointer text-center rounded-xl shadow-sm"
              >
                Go to Booking Desk
              </button>
              
              <button
                onClick={() => {
                  setActiveTab("contact");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="flex-1 py-4 bg-white text-brand-deep text-xs font-black uppercase tracking-widest border border-brand-deep hover:bg-brand-deep hover:text-white hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 cursor-pointer text-center rounded-xl shadow-sm"
              >
                Contact Bulk Desk
              </button>
            </motion.div>

            {/* Regulatory trust banners */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-wrap items-center gap-6 pt-10 mt-10 border-t border-brand-light/30 text-[11px] font-mono uppercase tracking-wider text-brand-deep/60"
            >
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-brand-medium" />
                <span>GSTIN Authorized Partner</span>
              </div>
              <div className="flex items-center gap-2">
                <ThumbsUp size={16} className="text-brand-medium" />
                <span>WHO-GMP Approved Labs</span>
              </div>
            </motion.div>
          </div>

          {/* Right Block: Image & Distribution list (5 cols) */}
          <div className="lg:col-span-5 flex flex-col bg-brand-pale border-t lg:border-t-0 border-brand-light/20">
            {/* Visual Image container (Top 45%) */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="h-48 sm:h-64 lg:h-[280px] relative overflow-hidden bg-brand-deep border-b border-brand-light/20"
            >
              <img
                src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800"
                alt="Medical Wholesaling Depot"
                className="w-full h-full object-cover grayscale brightness-90 hover:grayscale-0 transition-all duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-brand-deep/20"></div>
              
              {/* Founder Tag card */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.4 }}
                className="absolute bottom-4 right-4 bg-brand-deep text-white p-3.5 border-t-2 border-brand-medium shadow-xl rounded-xl"
              >
                <p className="text-[10px] font-black uppercase tracking-widest opacity-60">PROPRIETOR</p>
                <p className="text-base font-serif italic text-white font-semibold">{settings.ownerName || "Murali Krishna"}</p>
              </motion.div>
            </motion.div>

            {/* Verticals Index list (Bottom 55%) */}
            <div className="p-8 sm:p-10 flex-1 flex flex-col justify-between">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <h3 className="text-[11px] font-black uppercase tracking-[0.25em] text-brand-deep/80 mb-6 border-b border-brand-light/35 pb-2 font-mono">
                  Wholesale Categories
                </h3>
                
                <div className="space-y-4 font-sans">
                  <div className="flex justify-between items-center py-1 border-b border-brand-light/20">
                    <span className="text-sm font-semibold text-brand-deep/95">Pharmaceutical Intermediates</span>
                    <span className="text-[10px] font-mono text-brand-deep/50">[ 01 ]</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-brand-light/20">
                    <span className="text-sm font-semibold text-brand-deep/95">Surgical Disposables & Wear</span>
                    <span className="text-[10px] font-mono text-brand-deep/50">[ 02 ]</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-brand-light/20">
                    <span className="text-sm font-semibold text-brand-deep/95">Analytical Chemical Reagents</span>
                    <span className="text-[10px] font-mono text-brand-deep/50">[ 03 ]</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-brand-light/20">
                    <span className="text-sm font-semibold text-brand-deep/95">Household Hygiene Solutions</span>
                    <span className="text-[10px] font-mono text-brand-deep/50">[ 04 ]</span>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="text-[10px] font-mono text-brand-deep/60 leading-relaxed mt-6"
              >
                <span>Sai Marketing coordinates B2B supply lines directly with primary state clinics, diagnostic labs, and processing plants.</span>
              </motion.div>
            </div>

          </div>

        </div>

        {/* Business Statistics Counter Print Sheet */}
        <div className="bg-white border-x border-b border-brand-light/20 py-8 px-4 sm:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-0">
            {stats.map((stat, idx) => (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
                className={`text-center py-6 px-3 border-brand-light/20 transition-all duration-300 hover:bg-brand-pale/15
                  ${idx % 2 === 0 ? "border-r" : ""} 
                  lg:border-r lg:last:border-r-0
                  ${idx < 4 ? "border-b" : ""} 
                  lg:border-b-0 lg:py-0 lg:px-4
                  ${idx === 4 ? "col-span-2 lg:col-span-1 border-r-0" : ""}
                `}
              >
                <p className="text-3xl sm:text-4.5xl font-serif italic font-black text-brand-medium tracking-tight">
                  {stat.value}
                </p>
                <p className="text-[10px] font-bold text-slate-500 mt-1.5 uppercase tracking-widest leading-normal">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Core Value Proposition Section */}
        <div className="border-x border-b border-brand-light/20 py-16 sm:py-20 px-8 bg-brand-pale/10">
          <div className="text-center max-w-xl mx-auto space-y-4">
            <motion.h2 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-[11px] uppercase font-black tracking-[0.25em] text-brand-medium font-mono"
            >
              Why Partner With Us
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-3xl font-serif italic text-brand-deep font-bold"
            >
              Your wholesale supply chain, managed with modern integrity
            </motion.p>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-xs text-brand-deep/70 max-w-md mx-auto"
            >
              Sai Marketing Medical Agencies guarantees pure quality checks, automated GST logs, and direct transport runs from Reddy & Reddy Colony warehouse.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 border-t border-l border-brand-light/20 mt-12 bg-white rounded-3xl overflow-hidden shadow-sm">
            {features.map((feat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className="p-8 border-b border-r border-brand-light/20 flex flex-col justify-between group hover:bg-brand-pale/15 transition-colors duration-300"
              >
                <div>
                  <div className="text-[10px] font-mono text-brand-deep/40 mb-4 block">[ 0{idx + 1} ]</div>
                  <h3 className="text-sm font-black uppercase tracking-wider text-brand-deep mb-3">{feat.title}</h3>
                  <p className="text-xs text-brand-deep/70 leading-relaxed font-sans">{feat.description}</p>
                </div>
                <div className="mt-6 flex items-center justify-between text-[11px] font-mono text-brand-medium font-extrabold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>Verified Standard</span>
                  <span>✓</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
