import React, { useState } from "react";
import { Search, Plus, AlertCircle, Sparkles } from "lucide-react";
import { Product, Category } from "../types";

interface ProductsProps {
  products: Product[];
  categories: Category[];
  onAddToBooking: (product: Product) => void;
}

export default function Products({
  products,
  categories,
  onAddToBooking
}: ProductsProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Filter products by category and search query
  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory === "all" || p.category === selectedCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.manufacturer && p.manufacturer.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleAdd = (product: Product) => {
    onAddToBooking(product);
  };

  return (
    <div className="bg-white py-20 border-b border-brand-light/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Block */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 border-b border-brand-light/20 pb-8 mb-12">
          <div className="space-y-2 max-w-xl">
            <span className="text-xs font-black text-brand-medium uppercase tracking-widest block font-mono">Product Catalog</span>
            <h2 className="text-3xl sm:text-4xl font-serif font-black italic text-brand-deep tracking-tight">Browse Authorized Supplies</h2>
            <p className="text-xs sm:text-sm text-brand-medium/80 leading-relaxed font-sans">
              All listed pharmaceuticals, chemical reagents, and healthcare items are available for bulk distribution with flexible contract arrangements.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Sparkles className="text-brand-sky animate-pulse" size={18} />
            <span className="text-xs font-mono font-bold text-brand-medium uppercase tracking-wider bg-brand-pale text-brand-deep px-3 py-1.5 rounded-full border border-brand-light/40">
              Select below to add to booking container
            </span>
          </div>
        </div>

        {/* Filters and Search Bar Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-12 items-center">
          
          {/* Category Scroller/Pills */}
          <div className="lg:col-span-8 overflow-x-auto scrollbar-none flex gap-2 pb-2">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-4.5 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider whitespace-nowrap transition-all border cursor-pointer ${
                selectedCategory === "all"
                  ? "bg-brand-deep text-white border-brand-deep shadow-sm"
                  : "bg-brand-pale/50 text-brand-deep border-brand-light/30 hover:bg-brand-pale"
              }`}
            >
              All Categories
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`px-4.5 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider whitespace-nowrap transition-all border cursor-pointer ${
                  selectedCategory === cat.slug
                    ? "bg-brand-deep text-white border-brand-deep shadow-sm"
                    : "bg-brand-pale/50 text-brand-deep border-brand-light/30 hover:bg-brand-pale"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="lg:col-span-4 relative">
            <input
              type="text"
              placeholder="Search products or brands..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-brand-light/30 text-brand-deep placeholder-brand-medium/40 placeholder:font-sans text-xs pl-10 pr-4 py-2.5 rounded-xl focus:outline-none focus:border-brand-sky focus:bg-white transition-all font-sans font-medium"
            />
            <Search className="absolute left-3.5 top-3.5 text-brand-medium/40" size={14} />
          </div>

        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-24 bg-brand-pale/10 rounded-3xl border-2 border-dashed border-brand-light/30">
            <AlertCircle className="mx-auto text-brand-sky mb-3 animate-pulse" size={36} />
            <p className="text-sm font-extrabold text-brand-deep">No products found</p>
            <p className="text-xs text-brand-medium/70 font-sans mt-1">Try altering your filters or search keywords.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredProducts.map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-3xl border border-brand-light/25 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col group justify-between"
              >
                <div>
                  {/* Photo area */}
                  <div className="relative overflow-hidden aspect-video bg-brand-pale/35">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 grayscale group-hover:grayscale-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-3 right-3">
                      <span
                        className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          p.inStock
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                            : "bg-slate-100 text-slate-600 border border-slate-200"
                        }`}
                      >
                        {p.inStock ? "In Stock" : "On Request"}
                      </span>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-5 space-y-3">
                    <span className="text-[9px] font-black tracking-widest text-brand-medium uppercase font-mono">
                      {p.category.replace("-", " ")}
                    </span>
                    <h3 className="text-sm font-black text-brand-deep group-hover:text-brand-medium transition-colors line-clamp-1 leading-snug">
                      {p.name}
                    </h3>
                    <p className="text-[11px] text-brand-medium/75 font-sans leading-relaxed line-clamp-2">
                      {p.description}
                    </p>

                    <div className="pt-2 grid grid-cols-2 gap-2 text-[10px] text-brand-medium border-t border-slate-55 font-sans">
                      <div>
                        <span className="block text-[8px] text-brand-medium/50 uppercase tracking-widest font-mono">Pack size</span>
                        <span className="font-extrabold text-brand-deep truncate block mt-0.5">{p.packSize || "Bulk Pack"}</span>
                      </div>
                      <div>
                        <span className="block text-[8px] text-brand-medium/50 uppercase tracking-widest font-mono">Origin</span>
                        <span className="font-extrabold text-brand-deep truncate block mt-0.5">{p.manufacturer || "Sai Agencies"}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer CTA */}
                <div className="p-5 bg-slate-50/50 border-t border-brand-light/15 flex items-center justify-between gap-2">
                  <span className="text-xs font-black text-brand-deep font-mono">
                    {p.price || "Wholesale"}
                  </span>
                  
                  <button
                    onClick={() => handleAdd(p)}
                    className="bg-brand-pale hover:bg-brand-sky/20 text-brand-deep border border-brand-light/40 text-[10px] font-black uppercase tracking-wider px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                  >
                    <Plus size={12} strokeWidth={3} className="text-brand-medium" />
                    <span>Book Medicine</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
