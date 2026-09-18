import React, { useState, useMemo } from "react";
import { QuoteItem, CategoryId } from "../types";
import { QUOTES } from "../data/quotes";
import { CATEGORIES } from "../data/categories";
import { isFavoriteItem, toggleFavoriteQuote } from "../utils/favorites";
import {
  Search,
  Dices,
  Sparkles,
  Heart,
  Copy,
  Check,
  BookOpen,
} from "lucide-react";

interface PoetrySectionProps {
  onUseQuote: (quote: QuoteItem) => void;
  onSurpriseMe: () => void;
}

export const PoetrySection: React.FC<PoetrySectionProps> = ({
  onUseQuote,
  onSurpriseMe,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [favQuotes, setFavQuotes] = useState<string[]>([]);

  // Sync favorites
  React.useEffect(() => {
    const updateFavs = () => {
      const activeFavs = QUOTES.filter((q) => isFavoriteItem("quote", q.id)).map(
        (q) => q.id
      );
      setFavQuotes(activeFavs);
    };
    updateFavs();
    window.addEventListener("uv_favorites_updated", updateFavs);
    return () => window.removeEventListener("uv_favorites_updated", updateFavs);
  }, []);

  const handleToggleFav = (quoteId: string) => {
    toggleFavoriteQuote(quoteId);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredQuotes = useMemo(() => {
    return QUOTES.filter((quote) => {
      const matchCategory =
        selectedCategory === "all" || quote.category === selectedCategory;
      const matchSearch =
        !searchQuery.trim() ||
        quote.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (quote.author &&
          quote.author.toLowerCase().includes(searchQuery.toLowerCase())) ||
        quote.tags.some((t) =>
          t.toLowerCase().includes(searchQuery.toLowerCase())
        );
      return matchCategory && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner & Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#201511] border border-[#d4af37]/40 text-xs font-semibold text-[#dfb76c]">
          <BookOpen className="w-3.5 h-3.5" />
          <span>চিরায়ত বাংলা কবিতার সংগ্রহশালা</span>
        </div>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-bengali-serif text-[#fdf6e7]">
          প্রেমের কবিতা ও স্মরণীয় উক্তি
        </h2>
        <p className="text-sm sm:text-base text-[#c2b29e] font-bengali-sans">
          পছন্দের কবিতা বা উক্তিটি বেছে নিয়ে সরাসরি পোস্টকার্ডে জুড়ে দিন অথবা কপি করুন।
        </p>
      </div>

      {/* Action Bar: Search + Surprise Me */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-[#140e0b] border border-[#d4af37]/30 shadow-lg">
        {/* Search Input */}
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a89985]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="কবিতা বা কবির নাম দিয়ে খুঁজুন..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#1c130e] border border-[#d4af37]/25 text-sm text-[#f5ebd7] placeholder-[#8c7b6c] focus:outline-none focus:border-[#d4af37] font-bengali-sans transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#a89985] hover:text-white"
            >
              মুছুন
            </button>
          )}
        </div>

        {/* 🎲 Surprise Me Button */}
        <button
          onClick={onSurpriseMe}
          className="w-full sm:w-auto py-2.5 px-5 rounded-xl bg-gradient-to-r from-[#b3832c] via-[#d4af37] to-[#996f1d] hover:brightness-110 text-[#140e0b] font-bold text-sm font-bengali-sans shadow-md flex items-center justify-center gap-2 transition-transform active:scale-95 shrink-0"
        >
          <Dices className="w-4 h-4" />
          <span>🎲 Surprise Me (ম্যাজিক সিলেকশন)</span>
        </button>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`whitespace-nowrap px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 shrink-0 border ${
                isSelected
                  ? "bg-[#8b262d] text-[#fff6e6] border-[#d4af37]"
                  : "bg-[#160f0c] text-[#d6c7b2] border-[#d4af37]/20 hover:border-[#d4af37]/50"
              }`}
            >
              <span>{cat.icon}</span>
              <span className="font-bengali-sans">{cat.nameBn}</span>
            </button>
          );
        })}
      </div>

      {/* Quotes Grid */}
      {filteredQuotes.length === 0 ? (
        <div className="text-center py-16 bg-[#140e0b] border border-[#d4af37]/20 rounded-2xl p-6">
          <p className="text-base text-[#c2b29e] font-bengali-sans">
            দুঃখিত, আপনার অনুসন্ধানের সাথে মিলে এমন কোনো উক্তি পাওয়া যায়নি।
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("all");
            }}
            className="mt-3 text-xs text-[#dfb76c] underline"
          >
            সব উক্তি পুনরায় দেখুন
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {filteredQuotes.map((quote) => {
            const isFav = favQuotes.includes(quote.id);
            const isCopied = copiedId === quote.id;

            return (
              <div
                key={quote.id}
                className="group relative rounded-2xl bg-[#140e0b] border border-[#d4af37]/25 hover:border-[#d4af37]/60 p-5 shadow-lg hover:shadow-[0_8px_25px_rgba(0,0,0,0.7)] transition-all flex flex-col justify-between"
              >
                {/* Top Category Badge & Actions */}
                <div className="flex items-center justify-between pb-3 border-b border-[#251812]">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#221611] text-[#dfb76c] border border-[#d4af37]/20 font-bengali-sans">
                    {quote.categoryBn}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleCopy(quote.text, quote.id)}
                      className="p-1.5 rounded-lg bg-[#1e140f] hover:bg-[#2c1c14] text-[#a89985] hover:text-white transition-colors"
                      title="কপি করুন"
                      aria-label="উক্তি কপি করুন"
                    >
                      {isCopied ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>

                    <button
                      onClick={() => handleToggleFav(quote.id)}
                      className="p-1.5 rounded-lg bg-[#1e140f] hover:bg-[#2c1c14] text-[#a89985] transition-colors"
                      title="পছন্দের তালিকায় রাখুন"
                      aria-label="পছন্দ করুন"
                    >
                      <Heart
                        className={`w-3.5 h-3.5 ${
                          isFav
                            ? "fill-[#e05252] text-[#e05252]"
                            : "text-[#a89985] hover:text-white"
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Main Quote Text */}
                <div className="py-4">
                  <p className="text-base font-bengali-serif text-[#fdf6e7] leading-relaxed italic">
                    “{quote.text}”
                  </p>
                  {quote.author && (
                    <p className="mt-2 text-right text-xs text-[#dfb76c] font-bengali-sans font-medium">
                      — {quote.author}
                    </p>
                  )}
                </div>

                {/* Bottom Action: "ব্যবহার করুন" */}
                <div className="pt-3 border-t border-[#251812]">
                  <button
                    onClick={() => onUseQuote(quote)}
                    className="w-full py-2.5 px-3 rounded-xl bg-[#201410] hover:bg-[#8b262d] text-[#dfb76c] hover:text-white text-xs sm:text-sm font-semibold font-bengali-sans border border-[#d4af37]/30 hover:border-transparent transition-all flex items-center justify-center gap-1.5 active:scale-95"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>পোস্টকার্ডে ব্যবহার করুন</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
