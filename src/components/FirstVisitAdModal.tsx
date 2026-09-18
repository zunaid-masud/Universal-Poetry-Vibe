import React, { useState, useEffect } from "react";
import { AD_URL } from "../config/sponsor";
import {
  ExternalLink,
  X,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  Gift,
} from "lucide-react";

const STORAGE_KEY = "uv_first_visit_ad_seen";

export const FirstVisitAdModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    try {
      const hasSeenAd = sessionStorage.getItem(STORAGE_KEY);
      if (!hasSeenAd) {
        setIsOpen(true);
      }
    } catch {
      // In case sessionStorage is blocked by browser privacy modes
      setIsOpen(false);
    }
  }, []);

  const handleClose = () => {
    try {
      sessionStorage.setItem(STORAGE_KEY, "true");
    } catch {
      // ignore
    }
    setIsOpen(false);
  };

  const handleOpenAd = () => {
    try {
      window.open(AD_URL, "_blank", "noopener,noreferrer");
    } catch {
      // fallback
    }
  };

  if (!isOpen) return null;

  return (
    <div
      id="first-visit-ad-overlay"
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-md animate-fadeIn overflow-y-auto"
    >
      <div className="relative w-full max-w-lg rounded-3xl bg-[#140e0b] border-2 border-[#d4af37]/60 p-6 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.95)] text-[#f5ebd7] text-center overflow-hidden my-auto">
        {/* Victorian corner decorations */}
        <div className="absolute top-2.5 left-2.5 w-7 h-7 border-t-2 border-l-2 border-[#d4af37]/70 rounded-tl pointer-events-none" />
        <div className="absolute top-2.5 right-2.5 w-7 h-7 border-t-2 border-r-2 border-[#d4af37]/70 rounded-tr pointer-events-none" />
        <div className="absolute bottom-2.5 left-2.5 w-7 h-7 border-b-2 border-l-2 border-[#d4af37]/70 rounded-bl pointer-events-none" />
        <div className="absolute bottom-2.5 right-2.5 w-7 h-7 border-b-2 border-r-2 border-[#d4af37]/70 rounded-br pointer-events-none" />

        {/* Prominent Close Button */}
        <button
          onClick={handleClose}
          id="close-first-visit-ad-btn"
          className="absolute top-3.5 right-3.5 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#241712] hover:bg-[#38231a] text-[#dfb76c] hover:text-white border border-[#d4af37]/40 text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer"
          aria-label="বন্ধ করুন (Close)"
        >
          <X className="w-4 h-4 stroke-[2.5]" />
          <span>✕ Close</span>
        </button>

        {/* Top Badge & Vintage Icon */}
        <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-gradient-to-br from-[#2b1812] to-[#180e0a] border border-[#d4af37]/50 flex items-center justify-center text-3xl shadow-inner mt-2">
          <span>✨</span>
        </div>

        {/* Modal Title & Welcome Notice */}
        <div className="space-y-2 mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#241712] border border-[#d4af37]/35 text-[11px] font-semibold text-[#dfb76c]">
            <Gift className="w-3.5 h-3.5 text-[#dfb76c]" />
            <span>স্পন্সর বার্তা ও শুভেচ্ছা অফার</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold font-bengali-serif text-[#fdf6e7]">
            Universal Poetry Vibe
          </h2>

          <p className="text-xs sm:text-sm text-[#d1c4b2] font-bengali-sans leading-relaxed px-2">
            ভিন্টেজ প্রেমের পোস্টকার্ড ও কবিতা জেনারেটরে আপনাকে স্বাগতম! আমাদের সাইটটি ফ্রিতে উপভোগ করার জন্য আমাদের স্পন্সর অফারটি ভিজিট করুন।
          </p>
        </div>

        {/* Interactive Ad Showcase Card */}
        <a
          href={AD_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleOpenAd}
          className="block p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-[#241510] via-[#1a100b] to-[#2b1812] border border-[#d4af37]/50 hover:border-[#dfb76c] shadow-lg transition-all transform hover:scale-[1.02] active:scale-[0.99] group text-left mb-6 cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#8b262d] text-[10px] font-bold text-white uppercase tracking-wider">
              Featured Sponsor Offer
            </span>
            <ExternalLink className="w-4 h-4 text-[#dfb76c] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>

          <h3 className="text-base sm:text-lg font-bold text-[#fdf6e7] group-hover:text-[#dfb76c] transition-colors line-clamp-2 font-serif">
            🌟 বিশেষ স্পন্সর অফারটি দেখতে এখানে ক্লিক করুন
          </h3>

          <p className="text-xs text-[#a89985] mt-1 line-clamp-2">
            আমাদের স্পন্সরের আকর্ষণীয় কন্টেন্ট ও অফার দেখতে নতুন ট্যাবে খুলুন।
          </p>

          <div className="mt-3 pt-2.5 border-t border-[#d4af37]/20 flex items-center justify-between text-xs text-[#dfb76c] font-semibold">
            <span>অফারটি খুলুন ➔</span>
            <span className="text-[10px] text-[#a89985]">External Link</span>
          </div>
        </a>

        {/* Action Buttons: 1. Open Sponsor, 2. Close & Enter Website */}
        <div className="space-y-3">
          <a
            href={AD_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleOpenAd}
            className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#8b262d] via-[#9e2b34] to-[#6d1b21] hover:brightness-110 text-white font-bold font-bengali-sans shadow-lg shadow-[#8b262d]/30 flex items-center justify-center gap-2 border border-[#d4af37]/40 text-sm transition-all transform active:scale-95 cursor-pointer"
          >
            <ExternalLink className="w-4 h-4 text-[#dfb76c]" />
            <span>👁️ স্পন্সর অফার দেখুন (View Sponsor)</span>
          </a>

          <button
            onClick={handleClose}
            className="w-full py-3 px-6 rounded-xl bg-[#241712] hover:bg-[#322019] text-[#e8dac7] hover:text-white font-semibold font-bengali-sans flex items-center justify-center gap-2 border border-[#d4af37]/30 text-xs sm:text-sm transition-all active:scale-95 cursor-pointer"
          >
            <span>ওয়েবসাইটে প্রবেশ করুন (Enter Website)</span>
            <ArrowRight className="w-4 h-4 text-[#dfb76c]" />
          </button>
        </div>

        {/* Bottom Trust Note */}
        <div className="mt-5 pt-3 border-t border-[#251913] flex items-center justify-center gap-1.5 text-[11px] text-[#8c7b6d]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#c5a059]" />
          <span>নিরাপদ ব্রাউজিং ও ১০০% ফ্রি পোস্টকার্ড সার্ভিস</span>
        </div>
      </div>
    </div>
  );
};
