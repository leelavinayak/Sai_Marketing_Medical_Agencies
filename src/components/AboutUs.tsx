import React from "react";
import { motion } from "motion/react";
import { Shield, Target, Landmark, Award, BookOpen } from "lucide-react";
import { CompanySettings } from "../types";

interface AboutUsProps {
  settings: CompanySettings;
  setActiveTab: (tab: string) => void;
}

export default function AboutUs({ settings, setActiveTab }: AboutUsProps) {
  const values = [
    {
      icon: <Shield className="w-5 h-5 text-brand-medium" />,
      title: "Unyielding Integrity",
      description: "We source healthcare essentials exclusively from regulatory compliance validated supply channels."
    },
    {
      icon: <Award className="w-5 h-5 text-brand-medium" />,
      title: "Certified Purity & Quality",
      description: "All products undergo secondary screening criteria to guarantee physical safety and authentic compounds."
    },
    {
      icon: <Landmark className="w-5 h-5 text-brand-medium" />,
      title: "Local Civic Dedication",
      description: "Deeply rooted in Tirupati, directly powering health chains in Doddapuram, Reddy & Reddy Colony, and surrounding districts."
    },
    {
      icon: <BookOpen className="w-5 h-5 text-brand-medium" />,
      title: "Business Transparency",
      description: "Fair wholesale rates, crystal-clear invoicing systems, and dedicated GST-compliant account operations."
    }
  ];

  return (
    <div className="bg-white py-16 sm:py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        
        {/* Company Overview Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center font-sans">
          
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <span className="text-xs font-black text-brand-medium uppercase tracking-widest block font-mono">Corporate Profile</span>
            <h2 className="text-3xl sm:text-4xl font-serif font-black italic text-brand-deep tracking-tight leading-tight">
              A Trusted Pillar in Rayalaseema Region's Healthcare Supply Grid
            </h2>
            <p className="text-brand-deep/80 leading-relaxed text-sm sm:text-base font-sans">
              Established with a clear focus on the bulk pharmaceutical trade, Sai Marketing Medical Agencies has evolved into Tirupati's most reliable provider of healthcare disposable medical gear, laboratory-tested active chemist supplies, and commercial bulk household sanitization concentrates.
            </p>
            <p className="text-brand-deep/80 leading-relaxed text-sm sm:text-base font-sans">
              We act as the primary supply layer linking premium manufacturers with regional multi-specialty hospitals, local family pharmacies, educational institution test laboratories, and commercial businesses.
            </p>

            <div className="bg-brand-pale/20 border border-brand-light/30 p-5 rounded-2xl flex items-start gap-4">
              <div className="p-3 bg-brand-pale text-brand-deep rounded-xl">
                <Target size={24} />
              </div>
              <div>
                <h4 className="font-bold text-brand-deep text-sm">Tirupati's Authorized Wholesale Destination</h4>
                <p className="text-xs text-brand-medium/90 font-sans mt-0.5 leading-relaxed">
                  Serving Reddy Colony, Doddapuram Street, and the wider Chittoor district with licensed pharmaceutical and general industrial chemical distribution licenses.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-brand-medium/10 rounded-3xl rotate-2 transform scale-98"></div>
            <img
              src="https://images.unsplash.com/photo-1579684389782-64d84b5e901a?auto=format&fit=crop&q=80&w=800"
              alt="Quality checking medical supplies"
              className="w-full h-[380px] object-cover rounded-3xl shadow-lg border border-brand-light/20 relative z-10 grayscale hover:grayscale-0 transition-all duration-550"
              referrerPolicy="no-referrer"
            />
          </motion.div>
        </div>

        {/* Mission & Vision Rows */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 font-sans">
          
          {/* Mission Box */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-slate-50 border border-slate-100 p-8 rounded-3xl relative overflow-hidden group hover:border-brand-light/50 transition-colors"
          >
            <div className="w-12 h-12 bg-brand-pale text-brand-deep rounded-xl flex items-center justify-center mb-6">
              <Target size={24} />
            </div>
            <h3 className="text-xl font-bold text-brand-deep mb-3">Our Core Mission</h3>
            <p className="text-xs sm:text-sm text-brand-deep/80 leading-relaxed font-sans">
              To democratize access to exceptional, tested medical devices, active compound pharmaceuticals, and clean laboratory chemicals by providing an error-free regional logistics network. We strive to offer our retailers and healthcare institutions bulk margins that bolster their continuous community serving roles.
            </p>
          </motion.div>

          {/* Vision Box */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-slate-50 border border-slate-100 p-8 rounded-3xl relative overflow-hidden group hover:border-brand-light/50 transition-colors"
          >
            <div className="w-12 h-12 bg-brand-pale text-brand-deep rounded-xl flex items-center justify-center mb-6">
              <Shield size={24} />
            </div>
            <h3 className="text-xl font-bold text-brand-deep mb-3">Our Vision</h3>
            <p className="text-xs sm:text-sm text-brand-deep/80 leading-relaxed font-sans">
              To be recognized as the benchmark partner in full-stack B2B wholesale storage and regional transport networks across southern Andhra Pradesh, by expanding into digitally mapped warehouses while retaining our hyper-responsive, personal family brokerage service values.
            </p>
          </motion.div>

        </div>

        {/* Owner Information Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-brand-pale/35 rounded-3xl p-8 lg:p-12 border border-brand-light/40 font-sans"
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            
            <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-4">
              <div className="w-20 h-20 rounded-full bg-brand-deep text-white flex items-center justify-center font-bold text-3xl shadow-md border-4 border-white font-serif italic">
                MK
              </div>
              <div>
                <h3 className="text-xl font-bold text-brand-deep">{settings.ownerName}</h3>
                <p className="text-[10px] uppercase tracking-widest text-brand-medium font-black mt-0.5">Founder & Managing Proprietor</p>
                <div className="mt-3 space-y-1 text-xs text-brand-deep/70 font-mono">
                  <p>M: {settings.phone}</p>
                  <p>E: {settings.email}</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-4 text-brand-deep/80 font-sans text-sm sm:text-base leading-relaxed border-t lg:border-t-0 lg:border-l border-brand-light/45 pt-6 lg:pt-0 lg:pl-8">
              <p className="italic font-medium">
                "Welcome to Sai Marketing Medical Agencies. Over the past decade, we have stayed committed to one goal: ensuring that hospitals, medical stores, and chemical operators never face supply delays or product compromises. We run our distribution operation with absolute dedication to customer satisfaction, fast dispatch schedules, and honest, fair bulk pricing structures."
              </p>
              <p className="font-bold text-brand-deep text-xs">
                — Murali Krishna, Proprietor
              </p>
              <div className="pt-4">
                <button
                  onClick={() => {
                    setActiveTab("contact");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="bg-brand-deep text-white text-[11px] font-black uppercase tracking-widest px-5 py-3 rounded-xl hover:bg-brand-medium hover:-translate-y-0.5 active:translate-y-0 transition-all shadow shadow-brand-pale cursor-pointer"
                >
                  Schedule Personal Business Meeting
                </button>
              </div>
            </div>

          </div>
        </motion.div>

        {/* Key Business core values */}
        <div className="space-y-8 font-sans">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h3 className="text-xs uppercase tracking-widest text-brand-medium font-black font-mono">Uncompromising Values</h3>
            <h2 className="text-2xl font-serif font-black italic text-brand-deep">What Guides Our Everyday Operations</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, idx) => (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="bg-slate-50 border border-slate-100 p-6 rounded-2xl hover:bg-brand-pale/25 hover:border-brand-light/40 transition-all shadow-sm"
              >
                <div className="mb-4 text-brand-medium">{v.icon}</div>
                <h4 className="font-extrabold text-brand-deep text-sm mb-1">{v.title}</h4>
                <p className="text-xs text-brand-medium/95 font-sans leading-relaxed">{v.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
