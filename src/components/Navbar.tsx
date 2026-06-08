import React, { useState, useEffect } from "react";
import { Menu, X, Phone, Clock, ArrowRight } from "lucide-react";
import { CompanySettings } from "../types";

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  settings: CompanySettings;
}

export default function Navbar({
  activeTab,
  setActiveTab,
  settings,
}: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Home", id: "home" },
    { name: "About Us", id: "about" },
    { name: "Services", id: "services" },
    { name: "Testimonials", id: "testimonials" },
    { name: "Contact Us", id: "contact" },
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setIsOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleOrderRedirect = () => {
    setActiveTab("home");
    setIsOpen(false);
    setTimeout(() => {
      const element = document.getElementById("booking-desk-section");
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        window.scrollTo({ top: 900, behavior: "smooth" });
      }
    }, 150);
  };

  return (
    <>
      {/* Premium Top Bar with Location Coordinates */}
      <div className="bg-brand-deep text-white text-[11px] py-2.5 px-4 transition-all duration-300 hidden md:block border-b border-brand-medium/20">
        <div className="max-w-7xl mx-auto flex justify-between items-center font-sans tracking-wide">
          <div className="flex items-center gap-4">
            <span className="bg-brand-sky text-[8px] text-brand-deep font-black uppercase px-2 py-0.5 tracking-widest rounded-sm">
              OFFICIAL WHOLESALER
            </span>
            <span className="truncate opacity-80 font-medium font-sans">
              Sai Marketing Medical Agencies • Secure Pharmaceutical & Laboratory Chemical Supply Chain
            </span>
          </div>
          <div className="flex items-center gap-6 text-xs">
            <a
              href={`tel:${settings.phone}`}
              className="flex items-center gap-1.5 hover:text-brand-light font-mono transition-colors tracking-tight"
            >
              <Phone size={11} className="text-brand-sky" />
              {settings.phone}
            </a>
            <div className="flex items-center gap-1.5 opacity-80 font-mono text-[10px]">
              <Clock size={11} className="text-brand-sky" />
              <span>Office hours: 9AM - 8PM</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Main Header */}
      <nav
        id="navbar"
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-sm py-3 border-b border-brand-light/35"
            : "bg-white py-4 border-b border-brand-light/25"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center bg-white">
            
            {/* Logo brand stamp */}
            <div
              className="flex items-center gap-2.5 cursor-pointer select-none group"
              onClick={() => handleNavClick("home")}
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-brand-deep hover:bg-brand-medium flex items-center justify-center text-white font-serif text-lg sm:text-xl font-extrabold shadow-sm group-hover:scale-105 transition-all duration-300 rounded-lg">
                <span>S</span>
              </div>
              <div>
                <h1 className="text-base sm:text-lg font-black text-brand-deep leading-none tracking-tight uppercase font-sans group-hover:text-brand-medium transition-colors duration-300">
                  Sai Marketing
                </h1>
              </div>
            </div>

            {/* Premium Desktop navigation routes */}
            <div className="hidden lg:flex items-center gap-1.5 font-sans">
              {navItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`relative px-3.5 py-2 text-[11px] font-bold uppercase tracking-widest transition-all duration-300 cursor-pointer hover:text-brand-deep hover:-translate-y-[0.5px] active:translate-y-0
                      ${isActive 
                        ? "text-brand-medium after:absolute after:bottom-0 after:left-3 px-3.5 after:right-3 after:h-[2px] after:bg-brand-medium after:scale-x-100"
                        : "text-slate-500 after:absolute after:bottom-0 after:left-3 after:right-3 after:h-[2px] after:bg-brand-medium after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-center"
                      }
                    `}
                  >
                    {item.name}
                  </button>
                );
              })}

              <div className="h-4 w-[1px] bg-slate-200 mx-2"></div>

              {/* Order Caller CTA right on the premium nav line */}
              <button
                onClick={handleOrderRedirect}
                className="flex items-center gap-2 px-5 py-2.5 bg-brand-deep hover:bg-brand-medium hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 text-white text-[10px] font-black uppercase tracking-widest transition-all duration-300 cursor-pointer rounded-lg shadow-sm"
              >
                <span>Booking Desk</span>
                <ArrowRight size={12} />
              </button>
            </div>

            {/* Mobile nav actions */}
            <div className="lg:hidden flex items-center gap-2 select-none">
              <button
                onClick={handleOrderRedirect}
                className="px-3.5 py-2 bg-brand-deep text-white text-[10px] font-black uppercase tracking-wider cursor-pointer rounded-lg shadow-sm"
              >
                Book
              </button>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-1.5 text-brand-deep hover:bg-brand-pale transition-colors focus:outline-none cursor-pointer rounded-lg"
              >
                {isOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile slide open drawer */}
        {isOpen && (
          <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-1 shadow-inner animate-in fade-in duration-200">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full text-left px-4 py-3 text-xs font-black uppercase tracking-widest rounded-none transition-colors cursor-pointer ${
                  activeTab === item.id
                    ? "text-brand-medium bg-brand-pale/50 border-l-2 border-brand-medium"
                    : "text-slate-600 hover:text-brand-deep hover:bg-slate-50"
                }`}
              >
                {item.name}
              </button>
            ))}

            <div className="h-[1px] bg-slate-100 my-3"></div>

            <div className="px-4 pt-1">
              <button
                onClick={handleOrderRedirect}
                className="w-full py-3 text-center text-[10px] font-black uppercase tracking-widest text-white bg-brand-deep hover:bg-brand-medium transition-colors cursor-pointer rounded-lg"
              >
                Go to Medicine Booking
              </button>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
