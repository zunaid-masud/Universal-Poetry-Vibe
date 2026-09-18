import React from "react";
import { CATEGORIES } from "../data/categories";
import { CategoryId } from "../types";

interface CategoryPickerProps {
  selectedCategory: CategoryId;
  onSelectCategory: (catId: CategoryId) => void;
  layout?: "grid" | "horizontal";
}

export const CategoryPicker: React.FC<CategoryPickerProps> = ({
  selectedCategory,
  onSelectCategory,
  layout = "horizontal",
}) => {
  if (layout === "grid") {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`p-3.5 rounded-xl border text-left transition-all group flex flex-col justify-between min-h-[90px] ${
                isSelected
                  ? "bg-gradient-to-b from-[#2e1c15] to-[#1c110c] border-[#d4af37] shadow-[0_4px_20px_rgba(212,175,55,0.2)]"
                  : "bg-[#140e0b] border-[#d4af37]/20 hover:border-[#d4af37]/50 hover:bg-[#1a120e]"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl group-hover:scale-110 transition-transform">
                  {cat.icon}
                </span>
                {isSelected && (
                  <span className="w-2 h-2 rounded-full bg-[#dfb76c] animate-pulse" />
                )}
              </div>
              <div>
                <span className="block text-sm font-bold font-bengali-sans text-[#fdf6e7]">
                  {cat.nameBn}
                </span>
                <span className="block text-[11px] text-[#a89985] truncate">
                  {cat.nameEn}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    );
  }

  // Horizontal scrollable chip bar
  return (
    <div className="relative w-full">
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none scroll-smooth">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center gap-2 shrink-0 border ${
                isSelected
                  ? "bg-[#8b262d] text-[#fff6e6] border-[#d4af37] shadow-md"
                  : "bg-[#160f0c] text-[#d6c7b2] border-[#d4af37]/25 hover:border-[#d4af37]/60 hover:text-white hover:bg-[#201510]"
              }`}
            >
              <span>{cat.icon}</span>
              <span className="font-bengali-sans">{cat.nameBn}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
