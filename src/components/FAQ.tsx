import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "What regions do you actively serve for wholesale delivery?",
      a: "Our prime logistics network covers Tirupati City, Doddapuram, Chittoor, Madanapalle, Srikalahasti, and surrounding Rayalaseema districts of Andhra Pradesh. For bulk contract accounts, we arrange transport shipments directly across southern India."
    },
    {
      q: "What is the minimum order constraint for bulk pricing?",
      a: "Since we operate purely as wholesale distributors, our minimum order value for free regional logistics delivery is ₹5,000. However, first-time purchasers can buy sample crates at our Doddapuram counter with no limit restrictions."
    },
    {
      q: "Are the laboratory chemicals of certified analytical grade?",
      a: "Absolutely. All chemicals (such as high-pure Isopropyl Alcohol, reagents, laboratory compounds) are shipped directly in secure manufactures drums with complete Material Safety Data Sheets (MSDS) and purity test certifications."
    },
    {
      q: "Do you supply hospital supplies with legal GST taxable invoices?",
      a: "Yes. Sai Marketing Medical Agencies is fully registered with the state GST department. Every supply run includes authorized tax invoices for pharmacies and clinics to claim regulatory medical input credits smoothly."
    },
    {
      q: "How can we negotiate custom payment terms for specialty clinics?",
      a: "For recurring hospital supply frameworks, our Managing Proprietor, Murali Krishna, conducts physical board-room counseling meetings. We establish customized credit periods, pre-assigned monthly delivery runs, and competitive discount structures."
    },
    {
      q: "Can I place immediate orders via this web portal or WhatsApp?",
      a: "Yes! You can compile your requirements in our digital Inquiry Bag and tap submit, which files your interest immediately with our admin desk, or simply tap the floating green WhatsApp button to text Murali Krishna on +91 85230 86151 instantly."
    }
  ];

  return (
    <div className="bg-white py-16 sm:py-24 overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* FAQ Header */}
        <div className="text-center space-y-4 mb-16">
          <motion.span 
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs font-black text-brand-medium uppercase tracking-widest block font-mono"
          >
            Frequently Asked Questions
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-serif font-black italic text-brand-deep tracking-tight"
          >
            Got Questions? We Have Answers
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-brand-deep/80 font-sans text-xs sm:text-sm max-w-md mx-auto"
          >
            Review critical answers regarding credit systems, logistics, drug licenses, and chemical safety standards.
          </motion.p>
        </div>

        {/* Accordions */}
        <div className="space-y-4 font-sans">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="bg-slate-50 border border-slate-100 rounded-3xl overflow-hidden shadow-sm"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex justify-between items-center bg-slate-50 hover:bg-slate-100/50 transition-colors cursor-pointer focus:outline-none"
                >
                  <div className="flex items-start gap-3">
                    <HelpCircle size={18} className="text-brand-medium mt-0.5 shrink-0" />
                    <span className="font-extrabold text-brand-deep text-sm sm:text-base leading-snug">
                      {faq.q}
                    </span>
                  </div>
                  <div className="text-brand-medium/55">
                    {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="p-5 pt-0 bg-slate-50 text-brand-deep/75 text-xs sm:text-sm leading-relaxed border-t border-slate-100/30">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
