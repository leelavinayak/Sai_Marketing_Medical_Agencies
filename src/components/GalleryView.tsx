import React, { useState } from "react";
import { Image, X, ZoomIn, Eye } from "lucide-react";
import { GalleryImage } from "../types";

interface GalleryViewProps {
  gallery: GalleryImage[];
}

export default function GalleryView({ gallery }: GalleryViewProps) {
  const [selectedTag, setSelectedTag] = useState("all");
  const [activeLightboxImage, setActiveLightboxImage] = useState<GalleryImage | null>(null);

  const tags = ["all", "Warehouse", "Office", "Products", "Operations"];

  const filteredGallery = gallery.filter((img) => {
    if (selectedTag === "all") return true;
    return img.category.toLowerCase() === selectedTag.toLowerCase();
  });

  return (
    <div className="bg-white py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Gallery Headers */}
        <div className="text-center max-w-xl mx-auto space-y-4 mb-12">
          <span className="text-xs font-bold text-teal-600 uppercase tracking-widest block">Operations Portfolio</span>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Our Professional Facilities</h2>
          <p className="text-sm text-slate-500 font-sans">
            Take a visual tour of our sanitized wholesale storehouses, office desks, and direct product consignment sorting activities in Tirupati.
          </p>
        </div>

        {/* Categories navigation tags */}
        <div className="flex justify-center gap-2 mb-10 overflow-x-auto pb-2 scrollbar-none">
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border whitespace-nowrap ${
                selectedTag === tag
                  ? "bg-teal-650 text-white bg-teal-605 bg-teal-600 border-teal-600"
                  : "bg-slate-50 text-slate-500 border-slate-100 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              {tag === "all" ? "All Photos" : tag}
            </button>
          ))}
        </div>

        {/* Gallery Image Grid */}
        {filteredGallery.length === 0 ? (
          <div className="text-center py-20 bg-slate-50 rounded-2xl border border-dashed text-slate-400">
            <Image size={32} className="mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-800">No images available</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredGallery.map((img) => (
              <div
                key={img.id}
                onClick={() => setActiveLightboxImage(img)}
                className="group relative h-64 bg-slate-100 border border-slate-100 rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-md transition-shadow"
              >
                <img
                  src={img.url}
                  alt={img.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                
                {/* Overlay details */}
                <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5 text-white">
                  <div className="flex justify-between items-end gap-2">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-teal-600/90 text-white px-2 py-0.5 rounded">
                        {img.category}
                      </span>
                      <h4 className="font-bold text-sm mt-1.5 line-clamp-1">{img.title}</h4>
                    </div>
                    <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg text-white">
                      <Eye size={16} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* LIGHTBOX LAYOUT */}
      {activeLightboxImage && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setActiveLightboxImage(null)}
        >
          <div className="relative max-w-4xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row">
            
            {/* Image side */}
            <div className="flex-1 max-h-[500px] bg-black">
              <img
                src={activeLightboxImage.url}
                alt={activeLightboxImage.title}
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Info side */}
            <div className="p-6 md:w-80 bg-white flex flex-col justify-between" onClick={(e) => e.stopPropagation()}>
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-teal-600">
                    {activeLightboxImage.category}
                  </span>
                  <button
                    onClick={() => setActiveLightboxImage(null)}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-900 transition-colors cursor-pointer"
                  >
                    <X size={20} />
                  </button>
                </div>
                <h3 className="text-lg font-bold text-slate-900 leading-tight">{activeLightboxImage.title}</h3>
                <p className="text-xs text-slate-500 font-sans leading-relaxed">
                  Shot directly at our facilities in Doddapuram Street, Reddy colony. This confirms physical storage sizes and active logistics standards.
                </p>
              </div>

              <div className="pt-6 border-t border-slate-100 text-[10px] text-slate-400 font-mono">
                <span>Sai Marketing Agencies Record Logs</span>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
