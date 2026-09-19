import React, { useState, useEffect } from "react";
import { ActivePage, PostcardCustomData } from "../types";
import { POSTCARDS } from "../data/postcards";
import { PostcardCanvas } from "./PostcardCanvas";
import { Sparkles, Image as ImageIcon, RefreshCw, Heart } from "lucide-react";

interface HeroProps {
  setActivePage: (page: ActivePage) => void;
  onSelectTemplateForGenerator: (templateId: string) => void;
}

export const Hero: React.FC<HeroProps> = ({
  setActivePage,
  onSelectTemplateForGenerator,
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);

  // Rotate through featured hero postcards smoothly
  const heroTemplates = POSTCARDS.slice(0, 5);
  const activeTemplate = heroTemplates[currentIdx] || POSTCARDS[0];

  const heroCustomData: PostcardCustomData = {
    templateId: activeTemplate.id,
    recipient: activeTemplate.defaultRecipient || "প্রিয়তমা",
    quoteText: activeTemplate.defaultQuote,
    sender: activeTemplate.defaultSender || "ইতি, তোমার ভালোবাসার মানুষ",
    date: activeTemplate.defaultDate || "আজকের শুভক্ষণ",
    style: activeTemplate.style,
    effect: "warm_vintage",
    aspectRatio: "postcard",
  };

  const handleNextPreview = () => {
    setCurrentIdx((prev) => (prev + 1) % heroTemplates.length);
  };

  return (
    <section className="relative overflow-hidden pt-6 pb-12 sm:pt-8 sm:pb-16 md:pt-10 md:pb-20 lg:pt-14 lg:pb-24 border-b border-[#d4af37]/20">
      {/* Background cinematic glow & grain */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#8b262d]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-80 h-80 bg-[#d4af37]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-film-grain opacity-50 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-10 lg:gap-12 items-center">
          {/* Left Column: Headlines & CTAs */}
          <div className="lg:col-span-6 space-y-5 sm:space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-full bg-[#201511] border border-[#d4af37]/40 text-xs font-semibold text-[#dfb76c] shadow-sm">
              <span>💌</span>
              <span>Universal Love Postcard & Poetry Archive</span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold font-bengali-serif text-[#fdf6e7] leading-[1.3] md:leading-[1.25] tracking-tight">
              “পুরনো দিনের অনুভূতি, <br />
              <span className="text-[#dfb76c] drop-shadow-[0_2px_12px_rgba(212,175,55,0.3)]">
                আজকের ভালোবাসার জন্য।
              </span>”
            </h1>

            <p className="text-sm sm:text-base md:text-base lg:text-lg text-[#d6c7b2] font-bengali-sans leading-relaxed max-w-xl mx-auto lg:mx-0">
              আপনার প্রিয় মানুষটির জন্য তৈরি করুন সুন্দর Universal Poetry Vibe।
              ডিজাইন বেছে নিন, কবিতা জুড়ে দিন এবং এক ক্লিকে HD ডাউনলোড করুন।
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-2">
              <button
                onClick={() => {
                  onSelectTemplateForGenerator(activeTemplate.id);
                  setActivePage("generator");
                }}
                className="w-full sm:w-auto max-w-xs sm:max-w-none py-3 sm:py-3.5 px-6 sm:px-7 rounded-xl bg-gradient-to-r from-[#8b262d] via-[#a83232] to-[#7c1d24] hover:from-[#a02c34] hover:to-[#8b262d] text-[#fff7e6] text-sm sm:text-base font-bold font-bengali-sans shadow-[0_6px_25px_rgba(139,38,45,0.45)] border border-[#d4af37]/40 transition-all transform active:scale-95 flex items-center justify-center gap-2.5"
              >
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-[#dfb76c]" />
                <span>✨ পোস্টকার্ড তৈরি করুন</span>
              </button>

              <button
                onClick={() => setActivePage("gallery")}
                className="w-full sm:w-auto max-w-xs sm:max-w-none py-3 sm:py-3.5 px-5 sm:px-6 rounded-xl bg-[#1a120e] hover:bg-[#251a14] text-[#f5ebd7] text-sm sm:text-base font-semibold font-bengali-sans border border-[#d4af37]/35 shadow-md transition-all flex items-center justify-center gap-2"
              >
                <ImageIcon className="w-4 h-4 text-[#c5a059]" />
                <span>🖼️ Universal Gallery দেখুন</span>
              </button>
            </div>

            {/* Feature Highlights */}
            <div className="pt-4 grid grid-cols-3 gap-2 sm:gap-3 max-w-md mx-auto lg:mx-0 border-t border-[#2d1e18] text-center">
              <div className="p-2">
                <span className="block text-base sm:text-lg md:text-xl font-serif font-bold text-[#dfb76c]">
                  ১০০+
                </span>
                <span className="text-[10px] sm:text-[11px] text-[#a39380] font-bengali-sans">
                  ভিন্টেজ ডিজাইন
                </span>
              </div>
              <div className="p-2 border-x border-[#2d1e18]">
                <span className="block text-base sm:text-lg md:text-xl font-serif font-bold text-[#dfb76c]">
                  HD
                </span>
                <span className="text-[10px] sm:text-[11px] text-[#a39380] font-bengali-sans">
                  আল্ট্রা কোয়ালিটি
                </span>
              </div>
              <div className="p-2">
                <span className="block text-base sm:text-lg md:text-xl font-serif font-bold text-[#dfb76c]">
                  ১০০%
                </span>
                <span className="text-[10px] sm:text-[11px] text-[#a39380] font-bengali-sans">
                  ফ্রি ও ইনস্ট্যান্ট
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Realistic Floating Postcard Live Preview */}
          <div className="lg:col-span-6 relative flex flex-col items-center w-full">
            {/* Subtle floating tilt wrapper */}
            <div className="relative w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-lg transition-transform duration-700 ease-out hover:scale-[1.02]">
              {/* Backing paper stack shadow effect for depth */}
              <div className="absolute -inset-2 bg-gradient-to-r from-[#d4af37]/20 to-[#8b262d]/20 rounded-2xl blur-lg opacity-60 transform -rotate-1 pointer-events-none" />
              <div className="absolute inset-0 bg-[#120a07] rounded-xl transform rotate-2 border border-[#d4af37]/15 pointer-events-none opacity-80" />

              {/* The actual Postcard component */}
              <div className="relative z-10 w-full">
                <PostcardCanvas
                  customData={heroCustomData}
                  template={activeTemplate}
                />
              </div>

              {/* Floating interactive badge bar */}
              <div className="mt-4 flex flex-col sm:flex-row items-center justify-between bg-[#150e0b]/90 backdrop-blur-md border border-[#d4af37]/30 rounded-xl p-2.5 sm:p-3 shadow-lg gap-2.5 sm:gap-2">
                <div className="flex items-center gap-2 text-xs text-[#d1c4b2]">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping shrink-0" />
                  <span className="font-bengali-sans truncate">
                    লাইভ নমুনা: <strong>{activeTemplate.titleBn}</strong>
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={handleNextPreview}
                    className="py-1.5 px-3 rounded-lg bg-[#251711] hover:bg-[#321f18] text-[#dfb76c] text-xs font-semibold flex items-center gap-1 border border-[#d4af37]/25 transition-all"
                    title="পরবর্তী নমুনা দেখুন"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>অন্য ডিজাইন</span>
                  </button>

                  <button
                    onClick={() => {
                      onSelectTemplateForGenerator(activeTemplate.id);
                      setActivePage("generator");
                    }}
                    className="py-1.5 px-3 rounded-lg bg-[#8b262d] hover:bg-[#a83232] text-white text-xs font-semibold transition-all"
                  >
                    এই ডিজাইন নিন
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
