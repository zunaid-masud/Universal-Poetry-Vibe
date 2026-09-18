import React from "react";
import { CATEGORIES } from "../data/categories";
import { POSTCARDS } from "../data/postcards";
import { QUOTES } from "../data/quotes";
import { GALLERY_ITEMS } from "../data/gallery";
import { CategoryId } from "../types";
import { ArrowRight, Grid, Sparkles } from "lucide-react";

interface CategoriesViewProps {
  onSelectCategory: (catId: CategoryId) => void;
}

export const CategoriesView: React.FC<CategoriesViewProps> = ({
  onSelectCategory,
}) => {
  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Top Banner */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#201511] border border-[#d4af37]/40 text-xs font-semibold text-[#dfb76c]">
          <Grid className="w-3.5 h-3.5" />
          <span>অনুভূতির শ্রেণিবিন্যাস</span>
        </div>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-bengali-serif text-[#fdf6e7]">
          ক্যাটাগরি বেছে নিন
        </h2>
        <p className="text-sm sm:text-base text-[#c2b29e] font-bengali-sans">
          ভালোবাসা, বৃষ্টি, বিরহ কিংবা স্মৃতির পাতায় হারিয়ে যেতে যেকোনো একটি ক্যাটাগরি বেছে নিন।
        </p>
      </div>

      {/* Grid of 14 Categories */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {CATEGORIES.filter((c) => c.id !== "all").map((cat) => {
          const postcardCount = POSTCARDS.filter(
            (p) => p.category === cat.id
          ).length;
          const quoteCount = QUOTES.filter((q) => q.category === cat.id).length;
          const galleryCount = GALLERY_ITEMS.filter(
            (g) => g.category === cat.id
          ).length;

          return (
            <div
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className="group relative rounded-2xl bg-[#140e0b] border border-[#d4af37]/25 hover:border-[#d4af37]/70 p-5 shadow-lg hover:shadow-[0_10px_30px_rgba(0,0,0,0.8)] transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-3xl p-2.5 rounded-2xl bg-[#221611] border border-[#d4af37]/20 group-hover:scale-110 transition-transform">
                    {cat.icon}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#221611] text-[#dfb76c] border border-[#d4af37]/20">
                    {postcardCount} পোস্টকার্ড
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold font-bengali-serif text-[#fdf6e7] group-hover:text-[#dfb76c] transition-colors">
                    {cat.nameBn}
                  </h3>
                  <span className="text-xs text-[#a89985] font-sans block mb-1">
                    {cat.nameEn}
                  </span>
                  <p className="text-xs text-[#c2b29e] font-bengali-sans leading-relaxed">
                    {cat.description}
                  </p>
                </div>
              </div>

              {/* Bottom statistics and click prompt */}
              <div className="pt-4 mt-4 border-t border-[#251913] flex items-center justify-between text-xs text-[#dfb76c] font-bengali-sans">
                <span>{quoteCount} উক্তি • {galleryCount} আর্টওয়ার্ক</span>
                <div className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  <span>দেখুন</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
