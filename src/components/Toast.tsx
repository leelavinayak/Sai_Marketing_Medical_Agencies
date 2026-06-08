import React, { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle2, AlertCircle, X, Sparkles, MessageSquare } from "lucide-react";

export type ToastType = "success" | "error" | "info" | "whatsapp";

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  message: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  removeToast: (id: string) => void;
}

export default function ToastContainer({ toasts, removeToast }: ToastProps) {
  return (
    <div className="fixed top-24 right-6 z-[9999] flex flex-col gap-3.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} removeToast={removeToast} />
        ))}
      </AnimatePresence>
    </div>
  );
}

function ToastItem({ toast, removeToast }: { toast: ToastMessage; removeToast: (id: string) => void; key?: string }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      removeToast(toast.id);
    }, 6000); // Auto-dismiss after 6s
    return () => clearTimeout(timer);
  }, [toast.id, removeToast]);

  const config = {
    success: {
      bg: "bg-white border-[#2A9D8F]/20 shadow-[#2A9D8F]/5",
      accent: "bg-[#2A9D8F]",
      icon: <CheckCircle2 className="text-[#2A9D8F]" size={18} />,
      titleColor: "text-editorial-blue",
    },
    whatsapp: {
      bg: "bg-white border-[#25D366]/20 shadow-[#25D366]/5",
      accent: "bg-[#25D366]",
      icon: <MessageSquare className="text-[#25D366]" size={18} />,
      titleColor: "text-editorial-blue",
    },
    error: {
      bg: "bg-white border-rose-200 shadow-rose-100/10",
      accent: "bg-rose-500",
      icon: <AlertCircle className="text-rose-500" size={18} />,
      titleColor: "text-rose-700",
    },
    info: {
      bg: "bg-white border-sky-100 shadow-sky-100/10",
      accent: "bg-sky-500",
      icon: <Sparkles className="text-sky-500" size={18} />,
      titleColor: "text-sky-900",
    },
  }[toast.type];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.2 } }}
      transition={{ type: "spring", stiffness: 350, damping: 25 }}
      className={`pointer-events-auto w-full border p-4 shadow-xl relative overflow-hidden backdrop-blur-md flex gap-3.5 items-start ${config.bg}`}
    >
      {/* Accent pill strip left bar */}
      <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${config.accent}`} />
      
      <div className="shrink-0 mt-0.5">
        {config.icon}
      </div>

      <div className="flex-1 space-y-1 select-none pr-3">
        <h4 className={`text-xs font-black uppercase tracking-widest font-sans ${config.titleColor}`}>
          {toast.title}
        </h4>
        <p className="text-[11px] text-editorial-blue/70 font-sans leading-relaxed">
          {toast.message}
        </p>
      </div>

      <button
        onClick={() => removeToast(toast.id)}
        className="shrink-0 p-1 text-editorial-blue/30 hover:text-editorial-blue hover:bg-slate-50 transition-all cursor-pointer rounded-none"
      >
        <X size={13} />
      </button>
    </motion.div>
  );
}
