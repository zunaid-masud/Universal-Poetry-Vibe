import React, { useState, useMemo } from "react";
import { GalleryItem, CategoryId } from "../types";
import { GALLERY_ITEMS } from "../data/gallery";
import { CATEGORIES } from "../data/categories";
import { isFavoriteItem, toggleFavoriteGallery } from "../utils/favorites";
import { downloadRemoteImage } from "../utils/exporter";
import {
  Search,
  Eye,
  Download,
  Heart,
  Image as ImageIcon,
  X,
  Sparkles,
  Share2,
  Loader2,
} from "lucide-react";

export const GallerySection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewingItem, setViewingItem] = useState<GalleryItem | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [favItems, setFavItems] = useState<string[]>([]);

  // Sync favorites
  React.useEffect(() => {
    const updateFavs = () => {
      const activeFavs = GALLERY_ITEMS.filter((g) =>
        isFavoriteItem("gallery", g.id)
      ).map((g) => g.id);
      setFavItems(activeFavs);
    };
    updateFavs();
    window.addEventListener("uv_favorites_updated", updateFavs);
    return () => window.removeEventListener("uv_favorites_updated", updateFavs);
  }, []);

  const handleToggleFav = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    toggleFavoriteGallery(id);
  };

  const handleInitiateDownload = async (item: GalleryItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setDownloadingId(item.id);
    try {
      await downloadRemoteImage(
        item.image,
        `UniversalPoetryVibe-Gallery-${item.id}`
      );
    } catch (err) {
      console.error("Download failed:", err);
    } finally {
      setDownloadingId(null);
    }
  };

  const filteredItems = useMemo(() => {
    return GALLERY_ITEMS.filter((item) => {
      const matchCat =
        selectedCategory === "all" || item.category === selectedCategory;
      const matchSearch =
        !searchQuery.trim() ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.quoteText.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags.some((t) =>
          t.toLowerCase().includes(searchQuery.toLowerCase())
        );
      return matchCat && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#201511] border border-[#d4af37]/40 text-xs font-semibold text-[#dfb76c]">
          <ImageIcon className="w-3.5 h-3.5" />
          <span>প্রি-ডিজাইনড ভিন্টেজ আর্টওয়ার্ক কালেকশন</span>
        </div>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-bengali-serif text-[#fdf6e7]">
          Universal Gallery
        </h2>
        <p className="text-sm sm:text-base text-[#c2b29e] font-bengali-sans">
          নান্দনিক কবিতার চিত্রকর্মসমূহ সরাসরি দেখুন এবং উচ্চ রেজোলিউশনে ডাউনলোড করে
          সোশ্যাল মিডিয়ায় শেয়ার করুন।
        </p>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-[#140e0b] border border-[#d4af37]/30 shadow-lg">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a89985]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="গ্যালারির আর্টওয়ার্ক বা উক্তি খুঁজুন..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#1c130e] border border-[#d4af37]/25 text-sm text-[#f5ebd7] placeholder-[#8c7b6c] focus:outline-none focus:border-[#d4af37] font-bengali-sans"
          />
        </div>

        <div className="text-xs text-[#a89985] font-bengali-sans">
          মোট <strong>{filteredItems.length}</strong> টি আর্টওয়ার্ক পাওয়া গেছে
        </div>
      </div>

      {/* Category Filter Chips */}
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

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {filteredItems.map((item) => {
          const isFav = favItems.includes(item.id);
          return (
            <div
              key={item.id}
              className="group relative rounded-2xl bg-[#140e0b] border border-[#d4af37]/25 hover:border-[#d4af37]/70 overflow-hidden shadow-lg hover:shadow-[0_12px_30px_rgba(0,0,0,0.8)] transition-all flex flex-col justify-between"
            >
              {/* Image Preview */}
              <div
                onClick={() => setViewingItem(item)}
                className="relative aspect-[4/5] w-full overflow-hidden bg-[#1d140e] cursor-pointer"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />

                {/* Dark Vignette Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                {/* Category Badge */}
                <div className="absolute top-3 left-3 z-10">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-black/60 backdrop-blur-md text-[#dfb76c] border border-[#d4af37]/30">
                    {item.categoryBn}
                  </span>
                </div>

                {/* Favorite Heart */}
                <button
                  onClick={(e) => handleToggleFav(item.id, e)}
                  className="absolute top-3 right-3 p-2 rounded-full bg-black/60 backdrop-blur-md text-[#e05252] hover:bg-black/90 border border-white/10 z-10 transition-transform active:scale-90"
                  aria-label="পছন্দ করুন"
                >
                  <Heart
                    className={`w-4 h-4 ${
                      isFav ? "fill-[#e05252] text-[#e05252]" : "text-white/80"
                    }`}
                  />
                </button>

                {/* Central Poetry Quote on Card */}
                <div className="absolute bottom-4 inset-x-4 text-center pointer-events-none space-y-1">
                  <p className="text-sm sm:text-base font-bengali-serif text-[#fdf6e7] drop-shadow-md leading-snug line-clamp-3 italic">
                    “{item.quoteText}”
                  </p>
                  {item.author && (
                    <span className="block text-[11px] text-[#dfb76c] font-sans opacity-90">
                      — {item.author}
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-3.5 bg-gradient-to-b from-[#140e0b] to-[#1c120d] flex items-center justify-between gap-2 border-t border-[#251913]">
                <button
                  onClick={() => setViewingItem(item)}
                  className="py-2 px-3 rounded-xl bg-[#241712] hover:bg-[#321f18] text-[#d6c7b2] hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors border border-[#d4af37]/25"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View</span>
                </button>

                <button
                  onClick={(e) => handleInitiateDownload(item, e)}
                  disabled={downloadingId === item.id}
                  className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-[#8b262d] to-[#6d1b21] hover:from-[#a02c34] hover:to-[#812027] text-white text-xs font-semibold font-bengali-sans shadow-md flex items-center justify-center gap-1.5 border border-[#d4af37]/30 active:scale-95 transition-all disabled:opacity-75"
                >
                  {downloadingId === item.id ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-[#dfb76c]" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-3.5 h-3.5 text-[#dfb76c]" />
                      <span>Download</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Fullscreen Artwork Lightbox Modal */}
      {viewingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-2xl bg-[#140e0b] border border-[#d4af37]/50 rounded-2xl overflow-hidden shadow-2xl text-[#f5ebd7]">
            {/* Close Button */}
            <button
              onClick={() => setViewingItem(null)}
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/70 text-[#dfb76c] hover:text-white border border-white/10"
              aria-label="বন্ধ করুন"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Artwork Image */}
            <div className="relative aspect-[4/5] sm:aspect-[1/1] w-full max-h-[60vh] overflow-hidden bg-black flex items-center justify-center">
              <img
                src={viewingItem.image}
                alt={viewingItem.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/40" />

              <div className="absolute inset-x-6 bottom-6 text-center space-y-2">
                <p className="text-lg sm:text-2xl font-bold font-bengali-serif text-[#fdf6e7] leading-relaxed drop-shadow-lg">
                  “{viewingItem.quoteText}”
                </p>
                {viewingItem.author && (
                  <p className="text-sm text-[#dfb76c] font-medium">
                    — {viewingItem.author}
                  </p>
                )}
              </div>
            </div>

            {/* Modal Bottom Controls */}
            <div className="p-5 flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#18110d] border-t border-[#d4af37]/20">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#261712] text-[#dfb76c] border border-[#d4af37]/30">
                  {viewingItem.categoryBn}
                </span>
                <span className="text-xs text-[#a89985]">
                  HD রেজোলিউশন আর্টওয়ার্ক
                </span>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={() => handleToggleFav(viewingItem.id)}
                  className="p-3 rounded-xl bg-[#241712] hover:bg-[#321f18] text-[#e05252] border border-[#d4af37]/30"
                  title="পছন্দ"
                >
                  <Heart
                    className={`w-5 h-5 ${
                      favItems.includes(viewingItem.id)
                        ? "fill-[#e05252]"
                        : "text-white/80"
                    }`}
                  />
                </button>

                <button
                  onClick={() => {
                    const item = viewingItem;
                    setViewingItem(null);
                    handleInitiateDownload(item);
                  }}
                  className="flex-1 sm:flex-initial py-3 px-6 rounded-xl bg-gradient-to-r from-[#8b262d] to-[#6d1b21] hover:brightness-110 text-white font-bold font-bengali-sans shadow-lg flex items-center justify-center gap-2 border border-[#d4af37]/40"
                >
                  <Download className="w-4 h-4 text-[#dfb76c]" />
                  <span>⬇️ HD আর্টওয়ার্ক ডাউনলোড করুন</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
