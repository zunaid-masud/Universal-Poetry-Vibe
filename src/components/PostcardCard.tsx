import React, { useState, useEffect } from "react";
import { PostcardTemplate } from "../types";
import { isFavoriteItem, toggleFavoritePostcard } from "../utils/favorites";
import { Heart, Sparkles, Eye } from "lucide-react";

interface PostcardCardProps {
  template: PostcardTemplate;
  onUseTemplate: (template: PostcardTemplate) => void;
  onQuickPreview?: (template: PostcardTemplate) => void;
}

export const PostcardCard: React.FC<PostcardCardProps> = ({
  template,
  onUseTemplate,
  onQuickPreview,
}) => {
  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    setIsFav(isFavoriteItem("postcard", template.id));

    const handleFavUpdate = () => {
      setIsFav(isFavoriteItem("postcard", template.id));
    };

    window.addEventListener("uv_favorites_updated", handleFavUpdate);
    return () => {
      window.removeEventListener("uv_favorites_updated", handleFavUpdate);
    };
  }, [template.id]);

  const handleToggleFav = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newStatus = toggleFavoritePostcard(template.id);
    setIsFav(newStatus);
  };

  return (
    <div className="group relative rounded-2xl bg-[#140e0b] border border-[#d4af37]/25 hover:border-[#d4af37]/70 transition-all duration-300 overflow-hidden shadow-lg hover:shadow-[0_12px_30px_rgba(0,0,0,0.8)] flex flex-col justify-between">
      {/* Top Image Preview Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#1f1510]">
        <img
          src={template.image}
          alt={template.titleBn}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Vintage Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

        {/* Category & Badge */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 z-10">
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold font-bengali-sans bg-black/60 backdrop-blur-md text-[#dfb76c] border border-[#d4af37]/30">
            {template.categoryBn}
          </span>
          {template.badge && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#8b262d] text-white border border-[#d4af37]/40">
              {template.badge}
            </span>
          )}
        </div>

        {/* Favorite Button */}
        <button
          onClick={handleToggleFav}
          className="absolute top-2.5 right-2.5 p-2 rounded-full bg-black/60 backdrop-blur-md text-[#e05252] hover:bg-black/90 border border-white/10 transition-transform active:scale-90 z-10"
          aria-label="পছন্দ করুন"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isFav ? "fill-[#e05252] text-[#e05252]" : "text-white/80"
            }`}
          />
        </button>

        {/* Floating Quote Snippet inside image */}
        <div className="absolute bottom-2.5 inset-x-3 text-center pointer-events-none">
          <p className="text-xs sm:text-sm font-bengali-serif text-[#fdf6e7] line-clamp-2 drop-shadow-md leading-snug">
            “{template.defaultQuote}”
          </p>
        </div>
      </div>

      {/* Card Body & Actions */}
      <div className="p-4 flex flex-col gap-3 flex-1 justify-between bg-gradient-to-b from-[#140e0b] to-[#1a120e]">
        <div>
          <h4 className="text-base font-bold font-bengali-serif text-[#fdf6e7] group-hover:text-[#dfb76c] transition-colors">
            {template.titleBn}
          </h4>
          <p className="text-xs text-[#a39380] font-sans">
            {template.title}
          </p>
        </div>

        {/* Action Button */}
        <div className="pt-1 flex items-center gap-2">
          {onQuickPreview && (
            <button
              onClick={() => onQuickPreview(template)}
              className="p-2.5 rounded-xl bg-[#231712] hover:bg-[#2e1f18] text-[#d6c7b2] border border-[#d4af37]/30 transition-colors"
              title="প্রিভিউ দেখুন"
            >
              <Eye className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={() => onUseTemplate(template)}
            className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#8b262d] to-[#6d1b21] hover:from-[#a02c34] hover:to-[#812027] text-[#fff7e6] text-xs sm:text-sm font-semibold font-bengali-sans shadow-md hover:shadow-[#8b262d]/40 transition-all flex items-center justify-center gap-1.5 border border-[#d4af37]/30 active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#dfb76c]" />
            <span>ব্যবহার করুন</span>
          </button>
        </div>
      </div>
    </div>
  );
};
