import React, { useState, useEffect } from "react";
import { FavoriteItems, PostcardTemplate, QuoteItem, GalleryItem } from "../types";
import { getStoredFavorites, saveFavorites } from "../utils/favorites";
import { POSTCARDS } from "../data/postcards";
import { QUOTES } from "../data/quotes";
import { GALLERY_ITEMS } from "../data/gallery";
import { PostcardCard } from "./PostcardCard";
import { DownloadSponsorModal } from "./DownloadSponsorModal";
import { downloadRemoteImage } from "../utils/exporter";
import {
  Heart,
  Mail,
  BookOpen,
  Image as ImageIcon,
  Sparkles,
  Copy,
  Check,
  Trash2,
  Download,
} from "lucide-react";

interface FavoritesViewProps {
  onUseTemplate: (template: PostcardTemplate) => void;
  onUseQuote: (quote: QuoteItem) => void;
}

export const FavoritesView: React.FC<FavoritesViewProps> = ({
  onUseTemplate,
  onUseQuote,
}) => {
  const [favorites, setFavorites] = useState<FavoriteItems>({
    postcards: [],
    quotes: [],
    gallery: [],
  });
  const [activeTab, setActiveTab] = useState<"postcards" | "quotes" | "gallery">(
    "postcards"
  );
  const [copiedQuoteId, setCopiedQuoteId] = useState<string | null>(null);

  // Gallery Download
  const [downloadingGalleryItem, setDownloadingGalleryItem] = useState<GalleryItem | null>(null);
  const [isSponsorModalOpen, setIsSponsorModalOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    setFavorites(getStoredFavorites());

    const handleUpdate = () => {
      setFavorites(getStoredFavorites());
    };

    window.addEventListener("uv_favorites_updated", handleUpdate);
    return () => window.removeEventListener("uv_favorites_updated", handleUpdate);
  }, []);

  const handleClearAll = () => {
    if (window.confirm("আপনি কি নিশ্চিত যে সমস্ত ফেভারিট মুছে ফেলতে চান?")) {
      const empty: FavoriteItems = { postcards: [], quotes: [], gallery: [] };
      saveFavorites(empty);
      setFavorites(empty);
    }
  };

  const handleCopyQuote = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedQuoteId(id);
    setTimeout(() => setCopiedQuoteId(null), 2000);
  };

  const handleInitiateGalleryDownload = (item: GalleryItem) => {
    setDownloadingGalleryItem(item);
    setIsSponsorModalOpen(true);
  };

  const handleExecuteGalleryDownload = async () => {
    if (!downloadingGalleryItem) return;
    setIsDownloading(true);
    try {
      await downloadRemoteImage(
        downloadingGalleryItem.image,
        `UniversalPoetryVibe-Fav-${downloadingGalleryItem.id}`
      );
    } catch (err) {
      console.error(err);
    } finally {
      setIsDownloading(false);
      setIsSponsorModalOpen(false);
    }
  };

  // Resolved entities
  const favPostcards = POSTCARDS.filter((p) =>
    favorites.postcards.includes(p.id)
  );
  const favQuotes = QUOTES.filter((q) => favorites.quotes.includes(q.id));
  const favGallery = GALLERY_ITEMS.filter((g) =>
    favorites.gallery.includes(g.id)
  );

  const totalFavs =
    favPostcards.length + favQuotes.length + favGallery.length;

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-[#d4af37]/20">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#201511] border border-[#d4af37]/40 text-xs font-semibold text-[#dfb76c] mb-2">
            <Heart className="w-3.5 h-3.5 fill-[#e05252] text-[#e05252]" />
            <span>আমার সংরক্ষিত পছন্দসমূহ</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-bengali-serif text-[#fdf6e7]">
            ♡ আমার পছন্দ (Favorites)
          </h2>
          <p className="text-xs sm:text-sm text-[#a89985] font-bengali-sans">
            আপনার পছন্দের সব পোস্টকার্ড, কবিতা ও গ্যালারি আর্টওয়ার্ক ব্রাউজারে সংরক্ষিত রয়েছে।
          </p>
        </div>

        {totalFavs > 0 && (
          <button
            onClick={handleClearAll}
            className="py-2 px-4 rounded-xl bg-[#231510] hover:bg-[#8b262d] text-[#e05252] hover:text-white border border-[#d4af37]/20 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>সব মুছুন</span>
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-[#140e0b] border border-[#d4af37]/25 max-w-md">
        <button
          onClick={() => setActiveTab("postcards")}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold font-bengali-sans transition-all flex items-center justify-center gap-1.5 ${
            activeTab === "postcards"
              ? "bg-[#8b262d] text-white shadow-md border border-[#d4af37]/40"
              : "text-[#c2b29e] hover:bg-[#1f1510]"
          }`}
        >
          <Mail className="w-3.5 h-3.5" />
          <span>পোস্টকার্ড ({favPostcards.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("quotes")}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold font-bengali-sans transition-all flex items-center justify-center gap-1.5 ${
            activeTab === "quotes"
              ? "bg-[#8b262d] text-white shadow-md border border-[#d4af37]/40"
              : "text-[#c2b29e] hover:bg-[#1f1510]"
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>কবিতা ও উক্তি ({favQuotes.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("gallery")}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold font-bengali-sans transition-all flex items-center justify-center gap-1.5 ${
            activeTab === "gallery"
              ? "bg-[#8b262d] text-white shadow-md border border-[#d4af37]/40"
              : "text-[#c2b29e] hover:bg-[#1f1510]"
          }`}
        >
          <ImageIcon className="w-3.5 h-3.5" />
          <span>গ্যালারি ({favGallery.length})</span>
        </button>
      </div>

      {/* TAB 1: POSTCARDS */}
      {activeTab === "postcards" && (
        <div>
          {favPostcards.length === 0 ? (
            <div className="text-center py-16 bg-[#140e0b] rounded-2xl border border-[#d4af37]/20 p-6 space-y-3">
              <Mail className="w-10 h-10 text-[#a89985] mx-auto opacity-50" />
              <p className="text-sm text-[#d1c4b2] font-bengali-sans">
                আপনি এখনো কোনো পোস্টকার্ড ফেভারিট হিসেবে চিহ্নিত করেননি।
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {favPostcards.map((template) => (
                <PostcardCard
                  key={template.id}
                  template={template}
                  onUseTemplate={onUseTemplate}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: QUOTES */}
      {activeTab === "quotes" && (
        <div>
          {favQuotes.length === 0 ? (
            <div className="text-center py-16 bg-[#140e0b] rounded-2xl border border-[#d4af37]/20 p-6 space-y-3">
              <BookOpen className="w-10 h-10 text-[#a89985] mx-auto opacity-50" />
              <p className="text-sm text-[#d1c4b2] font-bengali-sans">
                আপনার পছন্দের কোনো উক্তি সংরক্ষিত নেই।
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {favQuotes.map((quote) => {
                const isCopied = copiedQuoteId === quote.id;
                return (
                  <div
                    key={quote.id}
                    className="p-5 rounded-2xl bg-[#140e0b] border border-[#d4af37]/30 flex flex-col justify-between space-y-4 shadow-md"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#201510] text-[#dfb76c] border border-[#d4af37]/20">
                          {quote.categoryBn}
                        </span>
                        <button
                          onClick={() => handleCopyQuote(quote.text, quote.id)}
                          className="p-1.5 rounded-lg bg-[#201510] text-[#a89985] hover:text-white"
                          title="কপি করুন"
                        >
                          {isCopied ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                      <p className="text-base font-bengali-serif text-[#fdf6e7] italic leading-relaxed">
                        “{quote.text}”
                      </p>
                      {quote.author && (
                        <span className="block text-right text-xs text-[#dfb76c] mt-2 font-medium">
                          — {quote.author}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => onUseQuote(quote)}
                      className="w-full py-2.5 px-3 rounded-xl bg-[#241712] hover:bg-[#8b262d] text-[#dfb76c] hover:text-white text-xs font-semibold font-bengali-sans border border-[#d4af37]/30 transition-all flex items-center justify-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>পোস্টকার্ডে ব্যবহার করুন</span>
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: GALLERY */}
      {activeTab === "gallery" && (
        <div>
          {favGallery.length === 0 ? (
            <div className="text-center py-16 bg-[#140e0b] rounded-2xl border border-[#d4af37]/20 p-6 space-y-3">
              <ImageIcon className="w-10 h-10 text-[#a89985] mx-auto opacity-50" />
              <p className="text-sm text-[#d1c4b2] font-bengali-sans">
                আপনার পছন্দের কোনো গ্যালারি আর্টওয়ার্ক সংরক্ষিত নেই।
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {favGallery.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl bg-[#140e0b] border border-[#d4af37]/25 overflow-hidden shadow-lg flex flex-col justify-between"
                >
                  <div className="relative aspect-[4/5] bg-[#1d140e]">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent p-3 flex flex-col justify-end text-center">
                      <p className="text-xs font-bengali-serif text-[#fdf6e7] line-clamp-2">
                        “{item.quoteText}”
                      </p>
                    </div>
                  </div>

                  <div className="p-3 bg-[#18110d] flex items-center justify-between gap-2 border-t border-[#261913]">
                    <span className="text-[11px] text-[#dfb76c] font-bengali-sans truncate">
                      {item.categoryBn}
                    </span>
                    <button
                      onClick={() => handleInitiateGalleryDownload(item)}
                      className="py-1.5 px-3 rounded-lg bg-[#8b262d] hover:bg-[#a83232] text-white text-xs font-semibold flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Sponsor Gate Modal for Gallery items */}
      <DownloadSponsorModal
        isOpen={isSponsorModalOpen}
        onClose={() => setIsSponsorModalOpen(false)}
        onReadyToDownload={handleExecuteGalleryDownload}
        format="jpeg"
        isDownloading={isDownloading}
      />
    </div>
  );
};
