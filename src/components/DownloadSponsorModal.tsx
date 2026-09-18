import React, { useState, useEffect } from "react";
import { SPONSOR_URL } from "../config/sponsor";
import {
  ExternalLink,
  Download,
  Lock,
  CheckCircle2,
  X,
  Sparkles,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";

interface DownloadSponsorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReadyToDownload: () => void;
  format: "png" | "jpeg";
  isDownloading?: boolean;
}

export const DownloadSponsorModal: React.FC<DownloadSponsorModalProps> = ({
  isOpen,
  onClose,
  onReadyToDownload,
  format,
  isDownloading = false,
}) => {
  // States: "initial" | "counting" | "ready"
  const [step, setStep] = useState<"initial" | "counting" | "ready">("initial");
  const [countdown, setCountdown] = useState<number>(8);
  const [popupBlocked, setPopupBlocked] = useState<boolean>(false);

  // Reset states whenever modal opens
  useEffect(() => {
    if (isOpen) {
      setStep("initial");
      setCountdown(8);
      setPopupBlocked(false);
    }
  }, [isOpen]);

  // Countdown timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === "counting" && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (step === "counting" && countdown === 0) {
      setStep("ready");
    }
    return () => clearTimeout(timer);
  }, [step, countdown]);

  if (!isOpen) return null;

  const handleOpenSponsor = () => {
    try {
      const opened = window.open(SPONSOR_URL, "_blank", "noopener,noreferrer");
      if (!opened || opened.closed || typeof opened.closed === "undefined") {
        setPopupBlocked(true);
      }
    } catch {
      setPopupBlocked(true);
    }

    // Start 8-second countdown
    setStep("counting");
    setCountdown(8);
  };

  const handleExecuteDownload = () => {
    onReadyToDownload();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md rounded-2xl bg-[#140e0b] border border-[#d4af37]/40 p-6 md:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.9)] text-[#f5ebd7] text-center overflow-hidden">
        {/* Vintage corner accents */}
        <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-[#d4af37]/50 rounded-tl-sm pointer-events-none" />
        <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-[#d4af37]/50 rounded-tr-sm pointer-events-none" />
        <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-[#d4af37]/50 rounded-bl-sm pointer-events-none" />
        <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-[#d4af37]/50 rounded-br-sm pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#c5a059] hover:text-white p-1 rounded-full transition-colors"
          aria-label="বন্ধ করুন"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Icon */}
        <div className="mx-auto mb-4 w-14 h-14 rounded-full bg-[#241712] border border-[#d4af37]/30 flex items-center justify-center text-2xl shadow-inner">
          {step === "ready" ? "✨" : "💌"}
        </div>

        {/* STEP 1: Initial */}
        {step === "initial" && (
          <div className="space-y-4">
            <h3 className="text-xl md:text-2xl font-bold font-bengali-serif text-[#fdf6e7]">
              আপনার পোস্টকার্ড প্রস্তুত
            </h3>
            <p className="text-sm md:text-base text-[#d1c4b2] font-bengali-sans leading-relaxed">
              ডাউনলোড চালু করার আগে Sponsor Page দেখুন।
            </p>
            <p className="text-xs text-[#a89985]">
              ফরম্যাট: <span className="text-[#d4af37] font-semibold uppercase">{format}</span> (Ultra HD Resolution)
            </p>

            <div className="pt-3">
              <button
                onClick={handleOpenSponsor}
                className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#8b262d] to-[#6d1b21] hover:from-[#a02c34] hover:to-[#812027] text-[#fff7e6] font-semibold font-bengali-sans shadow-lg hover:shadow-[#8b262d]/40 transition-all transform active:scale-95 flex items-center justify-center gap-2 border border-[#d4af37]/30"
              >
                <ExternalLink className="w-4 h-4 text-[#dfb76c]" />
                <span>👁️ Sponsor দেখুন</span>
              </button>
            </div>

            <div className="text-[11px] text-[#8c7b6d] flex items-center justify-center gap-1.5 pt-2">
              <ShieldCheck className="w-3.5 h-3.5 text-[#c5a059]" />
              <span>নিরাপদ ও বিজ্ঞাপনমুক্ত ডাউনলোড প্রক্রিয়া</span>
            </div>
          </div>
        )}

        {/* STEP 2: Counting Down */}
        {step === "counting" && (
          <div className="space-y-5">
            <h3 className="text-xl font-bold font-bengali-serif text-[#fdf6e7]">
              Download প্রস্তুত হচ্ছে...
            </h3>

            {/* Circular Timer Visual */}
            <div className="relative mx-auto w-24 h-24 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-[#2d1e18] animate-pulse" />
              <div className="text-3xl font-mono font-bold text-[#dfb76c] tracking-wider">
                0{countdown}
              </div>
            </div>

            <p className="text-xs text-[#c2b29d] font-bengali-sans">
              অনুগ্রহ করে অপেক্ষা করুন, হাই-রেজোলিউশন ইমেজ রেন্ডারিং ও এনকোডিং চলছে...
            </p>

            {popupBlocked && (
              <div className="p-2.5 rounded-lg bg-[#2b1812] border border-[#a83232]/40 text-xs text-[#eed7ce] flex items-center gap-2 text-left">
                <AlertCircle className="w-4 h-4 shrink-0 text-[#e67373]" />
                <span>
                  পপ-আপ ব্লক হলে{" "}
                  <a
                    href={SPONSOR_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="underline text-[#dfb76c] font-semibold"
                  >
                    এখানে ক্লিক করে
                  </a>{" "}
                  স্পন্সর পেজটি খুলুন।
                </span>
              </div>
            )}

            <button
              disabled
              className="w-full py-3.5 px-6 rounded-xl bg-[#231813] text-[#7d6c5d] font-semibold cursor-not-allowed flex items-center justify-center gap-2 border border-[#3e2c24]"
            >
              <Lock className="w-4 h-4 text-[#7d6c5d]" />
              <span>🔒 Download Locked (অপেক্ষা করুন...)</span>
            </button>
          </div>
        )}

        {/* STEP 3: Ready for Download */}
        {step === "ready" && (
          <div className="space-y-5">
            <div className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full bg-[#1b3320] border border-[#2e7d32] text-xs font-semibold text-[#81c784]">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>✓ READY FOR HD DOWNLOAD</span>
            </div>

            <h3 className="text-xl md:text-2xl font-bold font-bengali-serif text-[#fdf6e7]">
              ✅ Download Ready!
            </h3>

            <p className="text-sm text-[#d1c4b2] font-bengali-sans">
              আপনার পোস্টকার্ডটি প্রস্তুত হয়ে গেছে। নিচের বাটনে ক্লিক করে ফাইলটি সংরক্ষণ করুন।
            </p>

            <button
              onClick={handleExecuteDownload}
              disabled={isDownloading}
              className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#c5a059] to-[#b38e42] hover:brightness-110 text-[#140e0b] font-bold font-bengali-sans shadow-[0_4px_20px_rgba(212,175,55,0.4)] transition-all transform active:scale-95 flex items-center justify-center gap-2 text-base"
            >
              {isDownloading ? (
                <>
                  <Sparkles className="w-5 h-5 animate-spin" />
                  <span>সংরক্ষণ করা হচ্ছে...</span>
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  <span>⬇️ DOWNLOAD NOW</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
