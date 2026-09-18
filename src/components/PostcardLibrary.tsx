import React, { useState, useMemo } from "react";
import { PostcardTemplate, CategoryId } from "../types";
import { POSTCARDS } from "../data/postcards";
import { CATEGORIES } from "../data/categories";
import { PostcardCard } from "./PostcardCard";
import { PostcardCanvas } from "./PostcardCanvas";
import { Search, Sparkles, Filter, X, Eye } from "lucide-react";

interface PostcardLibraryProps {
  onUseTemplate: (template: PostcardTemplate) => void;
  selectedCategoryId?: CategoryId;
}

export const PostcardLibrary: React.FC<PostcardLibraryProps> = ({
  onUseTemplate,
  selectedCategoryId = "all",
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState<CategoryId>(selectedCategoryId);
  const [badgeFilter, setBadgeFilter] = useState<string>("all");
  const [previewTemplate, setPreviewTemplate] = useState<PostcardTemplate | null>(null);

  const filteredTemplates = useMemo(() => {
    return POSTCARDS.filter((template) => {
      const matchCat = category === "all" || template.category === category;
      const matchBadge =
        badgeFilter === "all" || template.badge === badgeFilter;
      const matchSearch =
        !searchQuery.trim() ||
        template.titleBn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.defaultQuote.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.tags.some((t) =>
          t.toLowerCase().includes(searchQuery.toLowerCase())
        );
      return matchCat && matchBadge && matchSearch;
    });
  }, [category, badgeFilter, searchQuery]);

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Top Banner */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#201511] border border-[#d4af37]/40 text-xs font-semibold text-[#dfb76c]">
          <span>💌</span>
          <span>পোস্টকার্ড আর্কাইভ ও টেমপ্লেট লাইব্রেরি</span>
        </div>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-bengali-serif text-[#fdf6e7]">
          ভিন্টেজ পোস্টকার্ড টেমপ্লেট লাইব্রেরি
        </h2>
        <p className="text-sm sm:text-base text-[#c2b29e] font-bengali-sans">
          আপনার ভালোবাসার অনুভূতির সাথে মানানসই সেরা ভিন্টেজ আর্ট ফ্রেমটি বেছে নিন।
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-[#140e0b] border border-[#d4af37]/30 shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a89985]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="পোস্টকার্ডের নাম বা ট্যাগ দিয়ে খুঁজুন..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#1c130e] border border-[#d4af37]/25 text-sm text-[#f5ebd7] placeholder-[#8c7b6c] focus:outline-none focus:border-[#d4af37] font-bengali-sans"
            />
          </div>

          {/* Badge filter pills */}
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
            {["all", "জনপ্রিয়", "নতুন", "রোমান্টিক", "বৃষ্টি", "ক্লাসিক"].map((b) => (
              <button
                key={b}
                onClick={() => setBadgeFilter(b)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all border ${
                  badgeFilter === b
                    ? "bg-[#8b262d] text-white border-[#d4af37]"
                    : "bg-[#1c130e] text-[#c2b29e] border-[#d4af37]/20 hover:bg-[#251812]"
                }`}
              >
                {b === "all" ? "সব ব্যাজ" : b}
              </button>
            ))}
          </div>
        </div>

        {/* Categories Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none border-t border-[#251913] pt-3">
          {CATEGORIES.map((cat) => {
            const isSelected = category === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={`whitespace-nowrap px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 shrink-0 border ${
                  isSelected
                    ? "bg-[#8b262d] text-white border-[#d4af37]"
                    : "bg-[#160f0c] text-[#d6c7b2] border-[#d4af37]/20 hover:border-[#d4af37]/50"
                }`}
              >
                <span>{cat.icon}</span>
                <span className="font-bengali-sans">{cat.nameBn}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of Postcards */}
      {filteredTemplates.length === 0 ? (
        <div className="text-center py-16 bg-[#140e0b] border border-[#d4af37]/20 rounded-2xl p-6">
          <p className="text-base text-[#c2b29e] font-bengali-sans">
            আপনার পছন্দের ফিল্টারে কোনো পোস্টকার্ড পাওয়া যায়নি।
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setCategory("all");
              setBadgeFilter("all");
            }}
            className="mt-3 text-xs text-[#dfb76c] underline"
          >
            সব টেমপ্লেট পুনরায় দেখুন
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredTemplates.map((template) => (
            <PostcardCard
              key={template.id}
              template={template}
              onUseTemplate={onUseTemplate}
              onQuickPreview={(t) => setPreviewTemplate(t)}
            />
          ))}
        </div>
      )}

      {/* Quick Preview Lightbox Modal */}
      {previewTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-xl bg-[#140e0b] border border-[#d4af37]/50 rounded-2xl p-6 shadow-2xl text-[#f5ebd7]">
            <button
              onClick={() => setPreviewTemplate(null)}
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/70 text-[#dfb76c] hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold font-bengali-serif text-[#dfb76c] mb-3">
              {previewTemplate.titleBn} (লাইভ প্রিভিউ)
            </h3>

            <div className="rounded-xl overflow-hidden shadow-inner my-2">
              <PostcardCanvas
                customData={{
                  templateId: previewTemplate.id,
                  recipient: previewTemplate.defaultRecipient || "প্রিয়তমা",
                  quoteText: previewTemplate.defaultQuote,
                  sender: previewTemplate.defaultSender || "ইতি, তোমার...",
                  date: previewTemplate.defaultDate || "আজকের দিন",
                  style: previewTemplate.style,
                  effect: "warm_vintage",
                  aspectRatio: "postcard",
                }}
                template={previewTemplate}
              />
            </div>

            <div className="mt-4 flex items-center justify-end gap-3">
              <button
                onClick={() => setPreviewTemplate(null)}
                className="px-4 py-2 rounded-xl bg-[#251812] text-[#d6c7b2] text-xs font-semibold"
              >
                বন্ধ করুন
              </button>
              <button
                onClick={() => {
                  const t = previewTemplate;
                  setPreviewTemplate(null);
                  onUseTemplate(t);
                }}
                className="px-5 py-2.5 rounded-xl bg-[#8b262d] text-white text-xs font-bold font-bengali-sans shadow-lg flex items-center gap-1.5"
              >
                <Sparkles className="w-4 h-4 text-[#dfb76c]" />
                <span>এই টেমপ্লেট দিয়ে পোস্টকার্ড বানান</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
