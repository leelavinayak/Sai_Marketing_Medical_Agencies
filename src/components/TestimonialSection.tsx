import React from "react";
import { motion } from "motion/react";
import { Star, MessageSquare } from "lucide-react";
import { Testimonial } from "../types";

interface TestimonialSectionProps {
  testimonials: Testimonial[];
}

export default function TestimonialSection({ testimonials }: TestimonialSectionProps) {
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1
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
        
        {/* Header Block */}
        <div className="text-center max-w-xl mx-auto space-y-4 mb-16">
          <motion.span 
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs font-black text-brand-medium uppercase tracking-widest block font-mono"
          >
            Client Testimonials
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-serif font-black italic text-brand-deep tracking-tight"
          >
            What Our Partners Say
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-brand-deep/75 font-sans text-xs sm:text-sm max-w-md mx-auto"
          >
            We value partnerships with medical organizations, pharmacies, and educational institutes. Over a decade of wholesaling builds serious local credibility.
          </motion.p>
        </div>

        {/* Testimonials Grid representation */}
        {testimonials.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-100 p-8">
            <p className="text-sm text-slate-500 font-medium">No testimonials posted yet.</p>
          </div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {testimonials.map((t) => (
              <motion.div
                key={t.id}
                variants={cardVariants}
                className="bg-white rounded-3xl p-8 border border-slate-100 flex flex-col justify-between shadow-sm relative group hover:border-brand-light/40 hover:shadow-md transition-all duration-300"
              >
                {/* Decorative quotes icon */}
                <div className="absolute top-6 right-8 text-brand-pale opacity-60 group-hover:text-brand-light transition-colors pointer-events-none">
                  <MessageSquare size={36} />
                </div>

                <div className="space-y-4">
                  {/* Rating Stars */}
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, idx) => (
                      <Star
                        key={idx}
                        size={14}
                        className={`${
                          idx < t.rating
                            ? "fill-amber-400 text-amber-400"
                            : "text-slate-200 fill-slate-200"
                        }`}
                      />
                    ))}
                  </div>

                  <p className="text-brand-deep/80 leading-relaxed font-sans text-xs sm:text-sm italic">
                    "{t.feedback}"
                  </p>
                </div>

                {/* Author Block */}
                <div className="pt-6 border-t border-slate-50 mt-6 flex items-center gap-3 font-sans">
                  <div className="w-10 h-10 rounded-full bg-brand-pale/50 text-brand-deep font-bold text-xs flex items-center justify-center border border-brand-light/35 shrink-0">
                    {t.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-extrabold text-brand-deep text-sm leading-tight truncate">{t.name}</h4>
                    <p className="text-[10px] text-brand-medium/80 font-medium font-sans mt-0.5 truncate">
                      {t.role}, <span className="font-bold text-brand-deep/70">{t.company}</span>
                    </p>
                  </div>
                </div>

              </motion.div>
            ))}
          </motion.div>
        )}

      </div>
    </div>
  );
}
