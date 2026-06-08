import React from "react";
import { motion } from "motion/react";
import { Truck, ShieldAlert, Layers, Building, RefreshCw, FileCheck } from "lucide-react";

interface ServicesProps {
  setActiveTab: (tab: string) => void;
}

export default function Services({ setActiveTab }: ServicesProps) {
  const serviceList = [
    {
      icon: <Layers className="w-10 h-10 text-brand-medium" />,
      title: "Medical Product Distribution",
      description: "Direct-to-hospital and clinical supply runs delivering high-filtration masks, sterile latex/nitrile gloves, disposable syringes, infusion sets, custom surgery kits, and premium PPE solutions in bulk volumes."
    },
    {
      icon: <ShieldAlert className="w-10 h-10 text-brand-medium" />,
      title: "Pharmaceutical Supply Pipelines",
      description: "Secure, temperature-monitored transportation of bulk oral medications, antibiotic containers, health syrups, active tablets, emergency injections, and general prescription drug supply lines to authorized pharmacies."
    },
    {
      icon: <Building className="w-10 h-10 text-brand-medium" />,
      title: "Chemical Wholesale Supply",
      description: "Authorized distribution of high-purity laboratory diagnostic reagents, industrial-grade cleaning solvents, pure Isopropyl Alcohol, acids, and clinical testing compounds designed for diagnostic centers."
    },
    {
      icon: <Truck className="w-10 h-10 text-brand-medium" />,
      title: "Household Goods Distribution",
      description: "Providing public offices, hotel kitchens, business complexes, and households with top-tier floor surface cleaners, disinfectant fluids, liquid detergents, hand soaps, and sanitizing materials."
    },
    {
      icon: <RefreshCw className="w-10 h-10 text-brand-medium" />,
      title: "Bulk Order Management",
      description: "Custom supply packaging and volume adjustments suited to your monthly run rates, ensuring hospital systems and chemists maintain zero stockout anomalies throughout critical operations."
    },
    {
      icon: <FileCheck className="w-10 h-10 text-brand-medium" />,
      title: "B2B Supply Service Accounts",
      description: "Authorized invoicing systems, periodic audit reports, pre-arranged dispatch schedules, post-sales customer support, and tailored terms for established institutions and regular buyers."
    }
  ];

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="bg-slate-50 py-16 sm:py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Services Heading */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <motion.span 
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs font-black text-brand-medium uppercase tracking-widest block font-mono"
          >
            Capabilities & Services
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl font-serif font-black italic text-brand-deep tracking-tight"
          >
            Comprehensive B2B Wholesaling & Fast Logistics Integration
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-brand-deep/75 font-sans text-xs sm:text-sm leading-relaxed"
          >
            We operate fully equipped logistics networks that meet strict pharmaceutical grade storage principles. We manage the supply run from point of order to physical delivery.
          </motion.p>
        </div>

        {/* Services Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16"
        >
          {serviceList.map((service, idx) => (
            <motion.div
              key={idx}
              variants={cardVariants}
              className="bg-white rounded-3xl p-8 border border-slate-100 hover:border-brand-light/40 hover:shadow-lg shadow-sm transition-all duration-300 group"
            >
              <div className="w-16 h-16 rounded-2xl bg-brand-pale/50 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-300">
                {service.icon}
              </div>
              <h3 className="text-base font-black text-brand-deep mb-3 uppercase tracking-tight">{service.title}</h3>
              <p className="text-xs sm:text-sm text-brand-deep/80 leading-relaxed font-sans">{service.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Banner CTA Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-20 bg-brand-deep text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-xl"
        >
          <div className="absolute top-0 right-0 w-48 h-48 bg-brand-sky/15 rounded-full filter blur-2xl"></div>
          <div className="relative z-10 lg:flex lg:items-center lg:justify-between gap-8">
            <div className="space-y-3 max-w-2xl font-sans">
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight">Need a customized wholesale distribution partnership?</h3>
              <p className="text-xs sm:text-sm text-brand-pale/80 font-sans leading-relaxed">
                Our owner, Murali Krishna, schedules dedicated on-site consulting with super specialty hospital purchasing boards and regional pharmacy chain directors to negotiate tailored credit terms, monthly logistics quotas and delivery cycles.
              </p>
            </div>
            <div className="mt-6 lg:mt-0 shrink-0">
              <button
                onClick={() => {
                  setActiveTab("contact");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="bg-white text-brand-deep hover:bg-brand-pale hover:shadow-md text-[10px] font-black uppercase tracking-widest px-6 py-4 rounded-xl transition-all cursor-pointer shadow-sm select-none"
              >
                Inquire for Institutional Tie-ups
              </button>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
