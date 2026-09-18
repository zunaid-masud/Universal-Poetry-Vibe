import React from "react";
import { PostcardTemplate } from "../types";
import { POSTCARDS } from "../data/postcards";
import { PostcardCard } from "./PostcardCard";
import { Flame, Sparkles, Heart, CloudRain, Mail, ArrowRight } from "lucide-react";

interface FeaturedPostcardsProps {
  onUseTemplate: (template: PostcardTemplate) => void;
  onViewAllPostcards: () => void;
}

export const FeaturedPostcards: React.FC<FeaturedPostcardsProps> = ({
  onUseTemplate,
  onViewAllPostcards,
}) => {
  // Filter collections
  const popularPostcards = POSTCARDS.filter((p) => p.badge === "জনপ্রিয়").slice(0, 4);
  const newPostcards = POSTCARDS.filter((p) => p.badge === "নতুন").slice(0, 4);
  const romanticPostcards = POSTCARDS.filter((p) => p.category === "romantic" || p.badge === "রোমান্টিক").slice(0, 4);
  const rainyPostcards = POSTCARDS.filter((p) => p.category === "rain" || p.badge === "বৃষ্টি").slice(0, 4);
  const letterPostcards = POSTCARDS.filter((p) => p.category === "love_letter" || p.category === "classic_vintage").slice(0, 4);

  const renderSection = (
    title: string,
    subtitle: string,
    icon: React.ReactNode,
    items: PostcardTemplate[]
  ) => {
    if (items.length === 0) return null;
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#221611] border border-[#d4af37]/30 text-lg">
              {icon}
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-bold font-bengali-serif text-[#fdf6e7]">
                {title}
              </h3>
              <p className="text-xs sm:text-sm text-[#a89985] font-bengali-sans">
                {subtitle}
              </p>
            </div>
          </div>

          <button
            onClick={onViewAllPostcards}
            className="text-xs sm:text-sm font-semibold font-bengali-sans text-[#dfb76c] hover:text-[#f5ebd7] flex items-center gap-1 group transition-colors"
          >
            <span>সবগুলো দেখুন</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {items.map((template) => (
            <PostcardCard
              key={template.id}
              template={template}
              onUseTemplate={onUseTemplate}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <section className="py-12 md:py-16 space-y-16">
      {/* 1. 🔥 জনপ্রিয় পোস্টকার্ড */}
      {renderSection(
        "জনপ্রিয় পোস্টকার্ড",
        "প্রেমিক-প্রেমিকাদের সবচেয়ে পছন্দের ক্লাসিক ডিজাইনসমূহ",
        <Flame className="w-5 h-5 text-[#f97316]" />,
        popularPostcards
      )}

      {/* 2. ✨ নতুন পোস্টকার্ড */}
      {renderSection(
        "নতুন পোস্টকার্ড",
        "সাম্প্রতিক সময়ে যুক্ত হওয়া মায়াবী ও আকর্ষণীয় ফ্রেম",
        <Sparkles className="w-5 h-5 text-[#dfb76c]" />,
        newPostcards
      )}

      {/* 3. ❤️ Romantic Collection */}
      {renderSection(
        "Romantic Collection",
        "রক্তগোলাপ ও চিরন্তন প্রেমের নিবিড় ছোঁয়া",
        <Heart className="w-5 h-5 text-[#e05252]" />,
        romanticPostcards
      )}

      {/* 4. 🌧️ Rainy Love Collection */}
      {renderSection(
        "Rainy Love Collection",
        "শ্রাবণের মেঘ, কদম ফুল ও বৃষ্টিভেজা অনুভূতির কাব্য",
        <CloudRain className="w-5 h-5 text-[#38bdf8]" />,
        rainyPostcards
      )}

      {/* 5. 💌 Vintage Letter Collection */}
      {renderSection(
        "Vintage Letter Collection",
        "হলুদ খাম, ডাকটিকিট ও স্মৃতির প্রেমপত্র",
        <Mail className="w-5 h-5 text-[#dfb76c]" />,
        letterPostcards
      )}
    </section>
  );
};
