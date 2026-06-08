import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Plus, 
  Minus, 
  X, 
  ShoppingBag, 
  Store, 
  Home, 
  Check, 
  MessageSquare, 
  AlertCircle, 
  Sparkles, 
  PlusCircle, 
  User, 
  MapPin, 
  Phone, 
  Hash,
  Trash2,
  Bookmark,
  ChevronRight
} from "lucide-react";

interface MedicineBookingProps {
  onSubmitInquiry: (formData: any) => Promise<any>;
  whatsappNumber: string;
  addToast: (type: "success" | "error" | "info" | "whatsapp", title: string, message: string) => void;
}

interface BookingItem {
  id: string;
  name: string;
  quantity: number;
  packType: string;
  packSize: string;
  strength: string;
}

export default function MedicineBooking({
  onSubmitInquiry,
  whatsappNumber,
  addToast
}: MedicineBookingProps) {
  
  // Local booking state
  const [bookingList, setBookingList] = useState<BookingItem[]>([]);

  // Manual entry states
  const [medName, setMedName] = useState("");
  const [medStrength, setMedStrength] = useState("");
  const [selectedPackType, setSelectedPackType] = useState("Tablets");
  const [customPackSize, setCustomPackSize] = useState("");
  const [medQty, setMedQty] = useState(10);

  // Delivery toggle mode
  const [deliveryMode, setDeliveryMode] = useState<"shop" | "home">("shop");

  // Form Details
  const [shopForm, setShopForm] = useState({
    shopName: "",
    contactPerson: "",
    phone: "",
    address: "",
    gstin: ""
  });

  const [homeForm, setHomeForm] = useState({
    fullName: "",
    phone: "",
    address: "",
    timeSlot: "Morning (9 AM - 1 PM)",
    instructions: ""
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const packTypes = ["Tablets", "Capsules", "Syrup", "Injection", "Ointment", "Other"];

  const handleAddMedicine = (e: React.FormEvent) => {
    e.preventDefault();
    if (!medName.trim()) {
      addToast("error", "Validation Error", "Medicine name is required.");
      return;
    }
    if (medQty <= 0) {
      addToast("error", "Validation Error", "Quantity must be at least 1.");
      return;
    }

    const id = "med_" + Date.now();
    const newItem: BookingItem = {
      id,
      name: medName.trim(),
      strength: medStrength.trim(),
      packType: selectedPackType,
      packSize: customPackSize.trim() || "Standard Pack",
      quantity: medQty
    };

    setBookingList(prev => [...prev, newItem]);
    
    // Reset inputs
    setMedName("");
    setMedStrength("");
    setCustomPackSize("");
    setMedQty(10);

    addToast("success", "Item Added", `"${newItem.name}" added to the booking list.`);
  };

  const handleRemoveItem = (id: string) => {
    const item = bookingList.find(i => i.id === id);
    setBookingList(prev => prev.filter(i => i.id !== id));
    if (item) {
      addToast("info", "Item Removed", `"${item.name}" removed from the list.`);
    }
  };

  const handleUpdateQty = (id: string, delta: number) => {
    setBookingList(prev =>
      prev.map(item => {
        if (item.id === id) {
          const newQty = item.quantity + delta;
          return { ...item, quantity: newQty < 1 ? 1 : newQty };
        }
        return item;
      })
    );
  };

  const handleClearAll = () => {
    setBookingList([]);
    addToast("info", "Container Cleared", "All items removed from the booking desk.");
  };

  // Dispatch WhatsApp Message
  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validations
    if (bookingList.length === 0) {
      const err = "Please add at least one medicine to your booking list.";
      setError(err);
      addToast("error", "Empty Booking Container", err);
      return;
    }

    let compiledDetails = "";
    let submissionName = "";
    let submissionPhone = "";
    let submissionCompany = "";
    let submissionAddress = "";

    if (deliveryMode === "shop") {
      const f = shopForm;
      if (!f.shopName || !f.contactPerson || !f.phone || !f.address) {
        const err = "Please fill in all required shop fields.";
        setError(err);
        addToast("error", "Validation Failed", err);
        return;
      }
      submissionName = f.contactPerson;
      submissionPhone = f.phone;
      submissionCompany = f.shopName;
      submissionAddress = f.address;

      compiledDetails = `*Order Type:* 🏪 *Shop Delivery*
*Shop/Pharmacy Name:* ${f.shopName}
*Contact Person:* ${f.contactPerson}
*Mobile Number:* ${f.phone}
*Shop Address:* ${f.address}
${f.gstin ? `*GSTIN / Drug License:* ${f.gstin}` : ""}`;
    } else {
      const f = homeForm;
      if (!f.fullName || !f.phone || !f.address) {
        const err = "Please fill in all required delivery fields.";
        setError(err);
        addToast("error", "Validation Failed", err);
        return;
      }
      submissionName = f.fullName;
      submissionPhone = f.phone;
      submissionCompany = "Home Delivery";
      submissionAddress = f.address;

      compiledDetails = `*Order Type:* 🏠 *Home Delivery*
*Customer Name:* ${f.fullName}
*Mobile Number:* ${f.phone}
*Delivery Address:* ${f.address}
*Preferred Time Slot:* ${f.timeSlot}
${f.instructions ? `*Delivery Instructions:* ${f.instructions}` : ""}`;
    }

    setIsSubmitting(true);

    // Formulate WhatsApp text
    const itemsText = bookingList.map((item, index) => {
      const strengthText = item.strength ? ` (${item.strength})` : "";
      return `${index + 1}. *${item.name}*${strengthText} - Qty: ${item.quantity} [${item.packType} / ${item.packSize}]`;
    }).join("\n");

    const messageContent = `*Sai Marketing Medical Agencies - Medicine Booking*
----------------------------------------
${compiledDetails}

*Booked Medicines:*
${itemsText}
----------------------------------------
_Submitted via Sai Marketing Premium Booking Desk_`;

    const cleanNum = whatsappNumber.replace(/[^\d+]/g, "");
    const cleanNumNoPlus = cleanNum.startsWith("+") ? cleanNum.slice(1) : cleanNum;
    const encoded = encodeURIComponent(messageContent);
    const waUrl = `https://wa.me/${cleanNumNoPlus}?text=${encoded}`;

    // Backend backup logging
    const apiPayload = {
      name: submissionName,
      phone: submissionPhone,
      companyName: submissionCompany,
      email: "info@saimarketing.com",
      message: `[${deliveryMode.toUpperCase()} ORDER] Address: ${submissionAddress}. \n\nDetails:\n${messageContent}`,
      products: bookingList.map(item => ({
        productId: "custom",
        productName: `${item.name}${item.strength ? ` (${item.strength})` : ""} [${item.packType} / ${item.packSize}]`,
        quantity: item.quantity
      }))
    };

    try {
      await onSubmitInquiry(apiPayload);
      setSuccess("Booking compiled successfully! Redirecting you to WhatsApp to complete dispatch...");
      addToast("whatsapp", "Opening WhatsApp", "Redirecting to dispatch desk...");
      
      // Clear forms
      setBookingList([]);
      setShopForm({ shopName: "", contactPerson: "", phone: "", address: "", gstin: "" });
      setHomeForm({ fullName: "", phone: "", address: "", timeSlot: "Morning (9 AM - 1 PM)", instructions: "" });

      setTimeout(() => {
        window.open(waUrl, "_blank");
      }, 1000);
    } catch (err: any) {
      console.warn("Background ledger non-blocking log error:", err);
      // Still open WhatsApp since it is the main requested medium
      window.open(waUrl, "_blank");
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalUnits = bookingList.reduce((acc, curr) => acc + curr.quantity, 0);

  return (
    <div id="booking-desk-section" className="bg-gradient-to-br from-brand-pale/40 via-white to-brand-pale/20 py-24 px-4 sm:px-6 lg:px-8 border-b border-brand-light/35 scroll-mt-24">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center space-y-4 mb-20">
          <motion.span 
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="px-4 py-1.5 bg-brand-pale/60 text-brand-deep border border-brand-light/60 font-black tracking-widest text-[10px] uppercase rounded-full inline-block font-mono"
          >
            Digital Dispatch Desk
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl sm:text-5xl font-sans font-light tracking-tight text-brand-deep"
          >
            Premium <span className="font-serif font-black italic text-brand-medium">Medicine Booking</span> Desk
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-sm text-brand-medium/80 max-w-2xl mx-auto font-sans leading-relaxed"
          >
            Add medicines manually with packaging details, manage volumes, enter delivery addresses, and instantly submit your wholesaling order directly via WhatsApp dispatch.
          </motion.p>
        </div>

        {/* Outer Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* LEFT COLUMN: Input Forms (7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Step 1: Medicine Entry Box */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white border border-brand-light/35 rounded-3xl p-6 sm:p-8 shadow-xl shadow-brand-deep/5 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-brand-deep via-brand-medium to-brand-sky"></div>
              
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-6">
                <div className="w-10 h-10 bg-brand-pale text-brand-deep rounded-xl flex items-center justify-center shadow-sm">
                  <Bookmark size={20} />
                </div>
                <div>
                  <h3 className="font-black text-base text-brand-deep tracking-tight">1. Add Medicine Item</h3>
                  <p className="text-[11px] text-brand-medium font-sans">Configure name, strength, and packaging manually</p>
                </div>
              </div>

              <form onSubmit={handleAddMedicine} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Medicine Name */}
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-black uppercase text-brand-medium tracking-widest">
                      Medicine / Item Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Paracetamol, Latex Gloves"
                      value={medName}
                      onChange={(e) => setMedName(e.target.value)}
                      className="w-full bg-slate-50/70 border border-brand-light/35 text-xs px-4 py-3 rounded-xl text-brand-deep placeholder-brand-medium/35 focus:outline-none focus:border-brand-sky focus:bg-white transition-all font-sans font-medium"
                    />
                  </div>

                  {/* Strength / Dosage */}
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-black uppercase text-brand-medium tracking-widest">
                      Strength / Dosage (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 650mg, 10ml, Medium"
                      value={medStrength}
                      onChange={(e) => setMedStrength(e.target.value)}
                      className="w-full bg-slate-50/70 border border-brand-light/35 text-xs px-4 py-3 rounded-xl text-brand-deep placeholder-brand-medium/35 focus:outline-none focus:border-brand-sky focus:bg-white transition-all font-sans font-medium"
                    />
                  </div>
                </div>

                {/* Packaging Chips */}
                <div className="space-y-2">
                  <label className="block text-[10px] font-black uppercase text-brand-medium tracking-widest">
                    Select Packaging Type
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {packTypes.map((type) => {
                      const isSelected = selectedPackType === type;
                      return (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setSelectedPackType(type)}
                          className={`px-4.5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border cursor-pointer select-none flex items-center gap-1.5 ${
                            isSelected
                              ? "bg-brand-deep text-white border-brand-deep shadow-sm"
                              : "bg-brand-pale/30 text-brand-deep border-brand-light/30 hover:bg-brand-pale/60"
                          }`}
                        >
                          {isSelected && <Check size={10} strokeWidth={3} />}
                          <span>{type}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Custom Pack Size */}
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-black uppercase text-brand-medium tracking-widest">
                      Pack Size / Custom Details
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Pack of 10, Box of 100, 100ml"
                      value={customPackSize}
                      onChange={(e) => setCustomPackSize(e.target.value)}
                      className="w-full bg-slate-50/70 border border-brand-light/35 text-xs px-4 py-3 rounded-xl text-brand-deep placeholder-brand-medium/35 focus:outline-none focus:border-brand-sky focus:bg-white transition-all font-sans font-medium"
                    />
                  </div>

                  {/* Quantity Stepper */}
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-black uppercase text-brand-medium tracking-widest">
                      Quantity (Packs / Units)
                    </label>
                    <div className="flex items-center">
                      <button
                        type="button"
                        onClick={() => setMedQty(prev => prev > 5 ? prev - 5 : 1)}
                        className="w-11 h-11 bg-brand-pale/40 text-brand-deep border border-brand-light/30 hover:bg-brand-pale hover:text-brand-deep rounded-l-xl flex items-center justify-center transition-colors cursor-pointer"
                      >
                        <Minus size={14} />
                      </button>
                      <input
                        type="number"
                        min="1"
                        value={medQty}
                        onChange={(e) => setMedQty(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-full h-11 bg-slate-50/70 border-y border-brand-light/35 text-center text-xs font-mono font-black text-brand-deep focus:outline-none focus:bg-white"
                      />
                      <button
                        type="button"
                        onClick={() => setMedQty(prev => prev + 5)}
                        className="w-11 h-11 bg-brand-pale/40 text-brand-deep border border-brand-light/30 hover:bg-brand-pale hover:text-brand-deep rounded-r-xl flex items-center justify-center transition-colors cursor-pointer"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    type="submit"
                    className="w-full py-3.5 bg-brand-deep hover:bg-brand-medium text-white text-xs font-black uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-brand-deep/10 transition-all"
                  >
                    <PlusCircle size={16} />
                    <span>Add to Booking Container</span>
                  </motion.button>
                </div>
              </form>
            </motion.div>

            {/* Step 2: Coordinates Details */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white border border-brand-light/35 rounded-3xl p-6 sm:p-8 shadow-xl shadow-brand-deep/5 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-brand-sky via-brand-light to-brand-pale"></div>
              
              {/* Title & Slider Switcher */}
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-slate-100 pb-4 mb-6">
                <div>
                  <h3 className="font-black text-base text-brand-deep tracking-tight">2. Delivery Coordinator</h3>
                  <p className="text-[11px] text-brand-medium font-sans">Setup Shop or Home dispatch details</p>
                </div>

                {/* Sliding Segment Control */}
                <div className="flex p-1 bg-brand-pale/40 rounded-2xl border border-brand-light/30 relative select-none w-full sm:w-64">
                  <button
                    type="button"
                    onClick={() => { setDeliveryMode("shop"); setError(null); }}
                    className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all relative z-10 cursor-pointer ${
                      deliveryMode === "shop" ? "text-brand-deep bg-white shadow-sm font-extrabold" : "text-brand-medium/70"
                    }`}
                  >
                    <Store size={12} />
                    <span>Shop Order</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => { setDeliveryMode("home"); setError(null); }}
                    className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all relative z-10 cursor-pointer ${
                      deliveryMode === "home" ? "text-brand-deep bg-white shadow-sm font-extrabold" : "text-brand-medium/70"
                    }`}
                  >
                    <Home size={12} />
                    <span>Home Delivery</span>
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-rose-50 border border-rose-100 text-rose-700 text-xs p-3.5 rounded-xl flex items-start gap-2.5 mb-4 font-sans leading-normal">
                  <AlertCircle size={15} className="shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {success && (
                <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs p-3.5 rounded-xl flex items-start gap-2.5 mb-4 font-sans leading-normal">
                  <Check size={15} className="shrink-0 mt-0.5 text-emerald-600" />
                  <span>{success}</span>
                </div>
              )}

              {/* Dynamic Delivery Form fields */}
              <form onSubmit={handleBookingSubmit} className="space-y-5">
                <AnimatePresence mode="wait">
                  {deliveryMode === "shop" ? (
                    <motion.div
                      key="shop-form"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-4"
                    >
                      {/* Shop Name */}
                      <div className="space-y-1">
                        <label className="block text-[10px] font-black uppercase text-brand-medium tracking-widest">
                          Shop / Pharmacy Name *
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            required
                            value={shopForm.shopName}
                            onChange={(e) => setShopForm({ ...shopForm, shopName: e.target.value })}
                            placeholder="e.g. Venkateswara Medicals"
                            className="w-full bg-slate-50/70 border border-brand-light/35 text-xs pl-10 pr-4 py-3 rounded-xl text-brand-deep placeholder-brand-medium/35 focus:outline-none focus:border-brand-sky focus:bg-white transition-all font-sans font-medium"
                          />
                          <Store className="absolute left-3.5 top-3.5 text-brand-sky" size={14} />
                        </div>
                      </div>

                      {/* Contact and Phone */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="block text-[10px] font-black uppercase text-brand-medium tracking-widest">
                            Contact Person *
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              required
                              value={shopForm.contactPerson}
                              onChange={(e) => setShopForm({ ...shopForm, contactPerson: e.target.value })}
                              placeholder="e.g. M. Krishna"
                              className="w-full bg-slate-50/70 border border-brand-light/35 text-xs pl-10 pr-4 py-3 rounded-xl text-brand-deep placeholder-brand-medium/35 focus:outline-none focus:border-brand-sky focus:bg-white transition-all font-sans font-medium"
                            />
                            <User className="absolute left-3.5 top-3.5 text-brand-sky" size={14} />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="block text-[10px] font-black uppercase text-brand-medium tracking-widest">
                            Mobile Number *
                          </label>
                          <div className="relative">
                            <input
                              type="tel"
                              required
                              value={shopForm.phone}
                              onChange={(e) => setShopForm({ ...shopForm, phone: e.target.value })}
                              placeholder="e.g. +91 85230 86151"
                              className="w-full bg-slate-50/70 border border-brand-light/35 text-xs pl-10 pr-4 py-3 rounded-xl text-brand-deep font-mono placeholder-brand-medium/35 focus:outline-none focus:border-brand-sky focus:bg-white transition-all"
                            />
                            <Phone className="absolute left-3.5 top-3.5 text-brand-sky" size={14} />
                          </div>
                        </div>
                      </div>

                      {/* GSTIN / DL */}
                      <div className="space-y-1">
                        <label className="block text-[10px] font-black uppercase text-brand-medium tracking-widest">
                          Shop GSTIN / Drug License (Optional)
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={shopForm.gstin}
                            onChange={(e) => setShopForm({ ...shopForm, gstin: e.target.value })}
                            placeholder="e.g. 37AAAAA0000A1Z5 / DL-12345"
                            className="w-full bg-slate-50/70 border border-brand-light/35 text-xs pl-10 pr-4 py-3 rounded-xl text-brand-deep font-mono placeholder-brand-medium/35 focus:outline-none focus:border-brand-sky focus:bg-white transition-all"
                          />
                          <Hash className="absolute left-3.5 top-3.5 text-brand-sky" size={14} />
                        </div>
                      </div>

                      {/* Address */}
                      <div className="space-y-1">
                        <label className="block text-[10px] font-black uppercase text-brand-medium tracking-widest">
                          Full Shop Address *
                        </label>
                        <div className="relative">
                          <textarea
                            required
                            value={shopForm.address}
                            onChange={(e) => setShopForm({ ...shopForm, address: e.target.value })}
                            placeholder="Shop No, Landmark, Doddapuram Colony, Tirupati..."
                            rows={3}
                            className="w-full bg-slate-50/70 border border-brand-light/35 text-xs pl-10 pr-4 py-3 rounded-xl text-brand-deep placeholder-brand-medium/35 focus:outline-none focus:border-brand-sky focus:bg-white transition-all resize-none font-sans font-medium"
                          />
                          <MapPin className="absolute left-3.5 top-4.5 text-brand-sky" size={14} />
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="home-form"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-4"
                    >
                      {/* Name & Phone */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="block text-[10px] font-black uppercase text-brand-medium tracking-widest">
                            Full Name *
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              required
                              value={homeForm.fullName}
                              onChange={(e) => setHomeForm({ ...homeForm, fullName: e.target.value })}
                              placeholder="e.g. Murali Krishna"
                              className="w-full bg-slate-50/70 border border-brand-light/35 text-xs pl-10 pr-4 py-3 rounded-xl text-brand-deep placeholder-brand-medium/35 focus:outline-none focus:border-brand-sky focus:bg-white transition-all font-sans font-medium"
                            />
                            <User className="absolute left-3.5 top-3.5 text-brand-sky" size={14} />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="block text-[10px] font-black uppercase text-brand-medium tracking-widest">
                            Mobile Number *
                          </label>
                          <div className="relative">
                            <input
                              type="tel"
                              required
                              value={homeForm.phone}
                              onChange={(e) => setHomeForm({ ...homeForm, phone: e.target.value })}
                              placeholder="e.g. +91 85230 86151"
                              className="w-full bg-slate-50/70 border border-brand-light/35 text-xs pl-10 pr-4 py-3 rounded-xl text-brand-deep font-mono placeholder-brand-medium/35 focus:outline-none focus:border-brand-sky focus:bg-white transition-all"
                            />
                            <Phone className="absolute left-3.5 top-3.5 text-brand-sky" size={14} />
                          </div>
                        </div>
                      </div>

                      {/* Time slot dropdown */}
                      <div className="space-y-1">
                        <label className="block text-[10px] font-black uppercase text-brand-medium tracking-widest">
                          Preferred Delivery Time Slot
                        </label>
                        <select
                          value={homeForm.timeSlot}
                          onChange={(e) => setHomeForm({ ...homeForm, timeSlot: e.target.value })}
                          className="w-full bg-slate-50/70 border border-brand-light/35 text-xs px-4 py-3 rounded-xl text-brand-deep focus:outline-none focus:border-brand-sky focus:bg-white transition-all font-sans font-medium"
                        >
                          <option value="Morning (9 AM - 1 PM)">Morning (9 AM - 1 PM)</option>
                          <option value="Afternoon (1 PM - 5 PM)">Afternoon (1 PM - 5 PM)</option>
                          <option value="Evening (5 PM - 8 PM)">Evening (5 PM - 8 PM)</option>
                        </select>
                      </div>

                      {/* Address */}
                      <div className="space-y-1">
                        <label className="block text-[10px] font-black uppercase text-brand-medium tracking-widest">
                          Delivery Address *
                        </label>
                        <div className="relative">
                          <textarea
                            required
                            value={homeForm.address}
                            onChange={(e) => setHomeForm({ ...homeForm, address: e.target.value })}
                            placeholder="Flat/D.No, Street, Landmark, Reddy Colony, Tirupati..."
                            rows={3}
                            className="w-full bg-slate-50/70 border border-brand-light/35 text-xs pl-10 pr-4 py-3 rounded-xl text-brand-deep placeholder-brand-medium/35 focus:outline-none focus:border-brand-sky focus:bg-white transition-all resize-none font-sans font-medium"
                          />
                          <MapPin className="absolute left-3.5 top-4.5 text-brand-sky" size={14} />
                        </div>
                      </div>

                      {/* Special Instructions */}
                      <div className="space-y-1">
                        <label className="block text-[10px] font-black uppercase text-brand-medium tracking-widest">
                          Special Instructions (Optional)
                        </label>
                        <input
                          type="text"
                          value={homeForm.instructions}
                          onChange={(e) => setHomeForm({ ...homeForm, instructions: e.target.value })}
                          placeholder="e.g. Leave at gate / Call before dispatching"
                          className="w-full bg-slate-50/70 border border-brand-light/35 text-xs px-4 py-3 rounded-xl text-brand-deep placeholder-brand-medium/35 focus:outline-none focus:border-brand-sky focus:bg-white transition-all font-sans font-medium"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Submit button inside Step 2 */}
                <div className="pt-4 border-t border-slate-100 hidden lg:block">
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-[#25D366] hover:bg-[#20ba5a] text-white font-black uppercase tracking-widest text-[11px] rounded-xl flex items-center justify-center gap-2.5 transition-all cursor-pointer shadow-lg shadow-[#25d366]/25 disabled:opacity-50"
                  >
                    <MessageSquare size={16} />
                    <span>{isSubmitting ? "Processing Order..." : "Confirm & Send via WhatsApp"}</span>
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </div>

          {/* RIGHT COLUMN: Medicine Book Container Sticky Cart (5 cols) */}
          <div className="lg:col-span-5 lg:sticky lg:top-24">
            
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-b from-white to-slate-50 border border-brand-light/40 rounded-3xl p-6 sm:p-8 shadow-xl shadow-brand-deep/5 relative"
            >
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-brand-medium via-brand-sky to-brand-pale"></div>
              
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 bg-brand-pale/75 text-brand-deep rounded-xl flex items-center justify-center shadow-sm">
                    <ShoppingBag size={20} />
                  </div>
                  <div>
                    <h3 className="font-black text-base text-brand-deep tracking-tight">Booking Container</h3>
                    <p className="text-[11px] text-brand-medium font-sans">Review manual orders configured</p>
                  </div>
                </div>
                {bookingList.length > 0 && (
                  <button
                    onClick={handleClearAll}
                    className="text-[10px] font-black uppercase tracking-wider text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-lg transition-colors cursor-pointer select-none"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {/* Dynamic scroll list */}
              <div className="space-y-3.5 max-h-[380px] overflow-y-auto pr-1.5 scrollbar-thin mb-6">
                <AnimatePresence initial={false}>
                  {bookingList.length === 0 ? (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-center py-16 border-2 border-dashed border-brand-light/25 rounded-2xl bg-white/50"
                    >
                      <ShoppingBag className="mx-auto text-brand-sky/60 mb-3 animate-pulse" size={36} />
                      <p className="text-sm font-extrabold text-brand-deep">No medicines added yet</p>
                      <p className="text-xs text-brand-medium/75 mt-1 max-w-[200px] mx-auto leading-relaxed">
                        Configure item details on the left and tap the add button to begin stacking your dispatch list.
                      </p>
                    </motion.div>
                  ) : (
                    bookingList.map((item) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 15, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 30, scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 350, damping: 25 }}
                        className="bg-white border border-brand-light/20 rounded-2xl p-4 flex items-center justify-between gap-4 shadow-sm hover:shadow-md transition-all group"
                      >
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-black text-brand-deep truncate tracking-tight uppercase">
                            {item.name} {item.strength && <span className="text-brand-medium font-sans font-medium">({item.strength})</span>}
                          </h4>
                          <div className="flex flex-wrap gap-1.5 items-center mt-1">
                            <span className="text-[9px] bg-brand-pale/60 text-brand-deep border border-brand-light/30 px-2 py-0.5 rounded font-mono font-black uppercase">
                              {item.packType}
                            </span>
                            <span className="text-[9px] text-brand-medium/80 font-sans truncate max-w-[120px]">
                              {item.packSize}
                            </span>
                          </div>
                        </div>

                        {/* Qty edit stepper */}
                        <div className="flex items-center gap-1.5 shrink-0 bg-slate-50 p-1 rounded-xl border border-slate-100">
                          <button
                            type="button"
                            onClick={() => handleUpdateQty(item.id, -5)}
                            className="w-6.5 h-6.5 bg-white hover:bg-rose-50 text-slate-500 hover:text-rose-600 border border-slate-200/60 rounded-lg flex items-center justify-center transition-all cursor-pointer shadow-sm active:scale-90"
                          >
                            <Minus size={10} />
                          </button>
                          <span className="w-8 text-center text-xs font-mono font-black text-brand-deep">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleUpdateQty(item.id, 5)}
                            className="w-6.5 h-6.5 bg-white hover:bg-brand-pale text-slate-500 hover:text-brand-deep border border-slate-200/60 rounded-lg flex items-center justify-center transition-all cursor-pointer shadow-sm active:scale-90"
                          >
                            <Plus size={10} />
                          </button>
                        </div>

                        {/* Remove trash */}
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(item.id)}
                          className="p-2 text-slate-350 hover:text-rose-650 rounded-xl hover:bg-rose-50/50 transition-colors cursor-pointer"
                        >
                          <Trash2 size={14} />
                        </button>
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>

              {/* Booking Summary Box */}
              {bookingList.length > 0 && (
                <div className="bg-brand-pale/25 border border-brand-light/30 rounded-2xl p-4.5 space-y-3 mb-6 font-sans">
                  <div className="flex justify-between items-center text-xs text-brand-deep font-semibold">
                    <span>Unique Items:</span>
                    <span className="font-mono font-black">{bookingList.length}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs text-brand-deep font-semibold border-t border-brand-light/20 pt-2.5">
                    <span>Total Quantities:</span>
                    <span className="font-mono font-black text-brand-medium text-sm">{totalUnits} Packs / Units</span>
                  </div>
                </div>
              )}

              {/* Order Submission Form on mobile, duplicate display trigger for desktop */}
              <div className="block lg:hidden">
                <button
                  type="button"
                  onClick={handleBookingSubmit}
                  disabled={isSubmitting || bookingList.length === 0}
                  className="w-full py-4 bg-[#25D366] hover:bg-[#20ba5a] text-white font-black uppercase tracking-widest text-[11px] rounded-xl flex items-center justify-center gap-2.5 transition-all cursor-pointer shadow-lg shadow-[#25d366]/25 disabled:opacity-50"
                >
                  <MessageSquare size={16} />
                  <span>{isSubmitting ? "Processing Order..." : "Confirm & Send via WhatsApp"}</span>
                </button>
              </div>
              <div className="lg:block hidden">
                <button
                  onClick={handleBookingSubmit}
                  disabled={isSubmitting || bookingList.length === 0}
                  className="w-full py-4 bg-brand-deep hover:bg-brand-medium text-white font-black uppercase tracking-widest text-[10px] rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md disabled:opacity-40"
                >
                  <span>Dispatch WhatsApp Coordinates</span>
                  <ChevronRight size={14} className="ml-1" />
                </button>
              </div>
              
              <div className="text-center mt-4">
                <span className="text-[9px] font-mono text-brand-medium/50 uppercase tracking-widest block">
                  Wholesaler Order Coordination System
                </span>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
}
