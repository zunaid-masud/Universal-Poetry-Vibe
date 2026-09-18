import React, { useState, useMemo } from "react";
import { POSTCARDS } from "../data/postcards";
import { QUOTES } from "../data/quotes";
import { GALLERY_ITEMS } from "../data/gallery";
import { CATEGORIES } from "../data/categories";
import { PostcardTemplate, QuoteItem, GalleryItem, ActivePage } from "../types";
import {
  Search,
  X,
  Sparkles,
  BookOpen,
  Image as ImageIcon,
  Mail,
  Grid,
  ArrowRight,
} from "lucide-react";

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPostcard: (template: PostcardTemplate) => void;
  onSelectQuote: (quote: QuoteItem) => void;
  onSelectGallery: (item: GalleryItem) => void;
  onSelectCategory: (catId: string) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectPostcard,
  onSelectQuote,
  onSelectGallery,
  onSelectCategory,
}) => {
  const [query, setQuery] = useState("");

  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return {
        postcards: [],
        quotes: [],
        gallery: [],
        categories: [],
      };
    }

    const matchedCategories = CATEGORIES.filter(
      (c) =>
        c.nameBn.toLowerCase().includes(q) ||
        c.nameEn.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q)
    );

    const matchedPostcards = POSTCARDS.filter(
      (p) =>
        p.titleBn.toLowerCase().includes(q) ||
        p.title.toLowerCase().includes(q) ||
        p.defaultQuote.toLowerCase().includes(q) ||
        p.categoryBn.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
    );

    const matchedQuotes = QUOTES.filter(
      (qt) =>
        qt.text.toLowerCase().includes(q) ||
        (qt.author && qt.author.toLowerCase().includes(q)) ||
        qt.categoryBn.toLowerCase().includes(q) ||
        qt.tags.some((t) => t.toLowerCase().includes(q))
    );

    const matchedGallery = GALLERY_ITEMS.filter(
      (g) =>
        g.title.toLowerCase().includes(q) ||
        g.quoteText.toLowerCase().includes(q) ||
        g.categoryBn.toLowerCase().includes(q) ||
        g.tags.some((t) => t.toLowerCase().includes(q))
    );

    return {
      categories: matchedCategories,
      postcards: matchedPostcards,
      quotes: matchedQuotes,
      gallery: matchedGallery,
    };
  }, [query]);

  if (!isOpen) return null;

  const totalResults =
    searchResults.categories.length +
    searchResults.postcards.length +
    searchResults.quotes.length +
    searchResults.gallery.length;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl rounded-2xl bg-[#140e0b] border border-[#d4af37]/40 shadow-2xl overflow-hidden text-[#f5ebd7] max-h-[80vh] flex flex-col">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-[#2d1e18] flex items-center gap-3 bg-[#1a120d]">
          <Search className="w-5 h-5 text-[#dfb76c] shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="উক্তি বা পোস্টকার্ড খুঁজুন... (যেমন: বৃষ্টি, বিরহ, রবীন্দ্রনাথ, গোলাপ)"
            className="w-full bg-transparent text-sm sm:text-base text-[#fdf6e7] placeholder-[#8c7b6c] focus:outline-none font-bengali-sans"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="text-xs text-[#a89985] hover:text-white px-2 py-1 rounded"
            >
              মুছুন
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#241711] hover:bg-[#321f18] text-[#a89985] hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Suggestion Tags when query is empty */}
        {!query.trim() && (
          <div className="p-6 space-y-4 text-center">
            <p className="text-xs text-[#a89985] font-bengali-sans">
              জনপ্রিয় অনুসন্ধান:
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {["বৃষ্টি", "প্রেমপত্র", "রবীন্দ্রনাথ", "স্মৃতি", "গোলাপ", "বিরহ", "জোছনা", "ক্যাফে"].map((tag) => (
                <button
                  key={tag}
                  onClick={() => setQuery(tag)}
                  className="px-3 py-1.5 rounded-xl bg-[#1e140f] hover:bg-[#8b262d] text-xs font-bengali-sans text-[#dfb76c] hover:text-white border border-[#d4af37]/20 transition-colors"
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results Container */}
        {query.trim() && (
          <div className="p-4 overflow-y-auto space-y-6 flex-1 pr-2">
            {totalResults === 0 ? (
              <div className="text-center py-12 text-[#a89985] font-bengali-sans text-sm">
                “{query}” দিয়ে কোনো ফলাফল পাওয়া যায়নি। অন্য শব্দ দিয়ে চেষ্টা করুন।
              </div>
            ) : (
              <>
                {/* Matched Categories */}
                {searchResults.categories.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#dfb76c] font-serif flex items-center gap-1.5">
                      <Grid className="w-3.5 h-3.5" />
                      <span>ক্যাটাগরি ({searchResults.categories.length})</span>
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {searchResults.categories.map((c) => (
                        <button
                          key={c.id}
                          onClick={() => {
                            onSelectCategory(c.id);
                            onClose();
                          }}
                          className="px-3 py-1.5 rounded-xl bg-[#221611] hover:bg-[#8b262d] border border-[#d4af37]/30 text-xs font-bengali-sans text-[#fdf6e7] flex items-center gap-1.5"
                        >
                          <span>{c.icon}</span>
                          <span>{c.nameBn}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Matched Postcards */}
                {searchResults.postcards.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#dfb76c] font-serif flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5" />
                      <span>পোস্টকার্ড টেমপ্লেট ({searchResults.postcards.length})</span>
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {searchResults.postcards.map((p) => (
                        <div
                          key={p.id}
                          onClick={() => {
                            onSelectPostcard(p);
                            onClose();
                          }}
                          className="p-2.5 rounded-xl bg-[#1a120d] hover:bg-[#251812] border border-[#d4af37]/20 flex items-center gap-3 cursor-pointer group transition-all"
                        >
                          <img
                            src={p.image}
                            alt={p.titleBn}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <span className="block text-xs font-bold font-bengali-serif text-[#fdf6e7] truncate group-hover:text-[#dfb76c]">
                              {p.titleBn}
                            </span>
                            <span className="block text-[10px] text-[#a89985] truncate">
                              {p.defaultQuote}
                            </span>
                          </div>
                          <Sparkles className="w-4 h-4 text-[#dfb76c] opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Matched Quotes */}
                {searchResults.quotes.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#dfb76c] font-serif flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>কবিতা ও উক্তি ({searchResults.quotes.length})</span>
                    </span>
                    <div className="space-y-2">
                      {searchResults.quotes.map((q) => (
                        <div
                          key={q.id}
                          onClick={() => {
                            onSelectQuote(q);
                            onClose();
                          }}
                          className="p-3 rounded-xl bg-[#1a120d] hover:bg-[#251812] border border-[#d4af37]/20 cursor-pointer group transition-all"
                        >
                          <p className="text-xs sm:text-sm font-bengali-serif text-[#f5ebd7] group-hover:text-[#dfb76c] line-clamp-2">
                            “{q.text}”
                          </p>
                          <div className="mt-1 flex items-center justify-between text-[10px] text-[#a89985]">
                            <span>{q.author || "উক্তি"}</span>
                            <span className="text-[#dfb76c]">ব্যবহার করুন →</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Matched Gallery */}
                {searchResults.gallery.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#dfb76c] font-serif flex items-center gap-1.5">
                      <ImageIcon className="w-3.5 h-3.5" />
                      <span>Vintage Gallery ({searchResults.gallery.length})</span>
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {searchResults.gallery.map((g) => (
                        <div
                          key={g.id}
                          onClick={() => {
                            onSelectGallery(g);
                            onClose();
                          }}
                          className="relative aspect-square rounded-xl overflow-hidden border border-[#d4af37]/20 cursor-pointer group"
                        >
                          <img
                            src={g.image}
                            alt={g.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent p-2 flex flex-col justify-end">
                            <span className="text-[10px] font-bengali-serif text-[#fdf6e7] line-clamp-1">
                              {g.title}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
