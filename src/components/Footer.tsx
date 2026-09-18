import React, { useState } from "react";
import { ActivePage, CategoryId } from "../types";
import { Heart, Sparkles, Mail, Shield, FileText, Info } from "lucide-react";

interface FooterProps {
  setActivePage: (page: ActivePage) => void;
  onSelectCategory?: (catId: CategoryId) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActivePage, onSelectCategory }) => {
  const [activeModal, setActiveModal] = useState<"privacy" | "terms" | "contact" | null>(null);

  const handleLink = (page: ActivePage) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <footer className="relative bg-[#090605] border-t border-[#d4af37]/25 text-[#d6c8b4] pt-14 pb-10 overflow-hidden">
        {/* Subtle decorative background film grain & glow */}
        <div className="absolute inset-0 bg-film-grain opacity-40 pointer-events-none" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-[#8b262d]/10 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-[#2b1c15]">
            {/* Brand column */}
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-[#221612] border border-[#d4af37]/40 flex items-center justify-center text-xl shadow-inner">
                  💌
                </div>
                <span className="text-xl font-bold font-serif tracking-wide text-[#fdf6e7]">
                  Universal Poetry Vibe
                </span>
              </div>

              <p className="text-base font-bengali-serif text-[#dfb76c] italic leading-relaxed">
                “পুরনো দিনের অনুভূতি, আজকের ভালোবাসার জন্য।”
              </p>

              <p className="text-xs text-[#a39380] leading-relaxed max-w-md font-bengali-sans">
                একটি চিরন্তন ভিন্টেজ পোস্টকার্ড ও প্রেমের কবিতার ডিজিটাল আর্কাইভ।
                প্রিয় মানুষটিকে পাঠিয়ে দিন ভালোবাসার ছোঁয়া ও অমলিন স্মৃতির এক টুকরো চিঠি।
              </p>
            </div>

            {/* Quick Navigation */}
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-[#dfb76c] mb-4 font-serif">
                নেভিগেশন
              </h4>
              <ul className="space-y-2.5 text-sm font-bengali-sans">
                <li>
                  <button
                    onClick={() => handleLink("home")}
                    className="hover:text-[#dfb76c] transition-colors"
                  >
                    Home (হোম)
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleLink("postcards")}
                    className="hover:text-[#dfb76c] transition-colors"
                  >
                    Postcards (পোস্টকার্ড)
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleLink("poetry")}
                    className="hover:text-[#dfb76c] transition-colors"
                  >
                    Poetry (কবিতা ও উক্তি)
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleLink("gallery")}
                    className="hover:text-[#dfb76c] transition-colors"
                  >
                    Universal Gallery (গ্যালারি)
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleLink("categories")}
                    className="hover:text-[#dfb76c] transition-colors"
                  >
                    Categories (ক্যাটাগরি)
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleLink("favorites")}
                    className="hover:text-[#dfb76c] transition-colors"
                  >
                    Favorites (আমার পছন্দ)
                  </button>
                </li>
              </ul>
            </div>

            {/* Legal & Policy Links */}
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-[#dfb76c] mb-4 font-serif">
                তথ্য ও নীতিমালা
              </h4>
              <ul className="space-y-2.5 text-sm font-bengali-sans">
                <li>
                  <button
                    onClick={() => setActiveModal("privacy")}
                    className="hover:text-[#dfb76c] transition-colors flex items-center gap-1.5"
                  >
                    <Shield className="w-3.5 h-3.5 text-[#c5a059]" />
                    <span>Privacy Policy</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveModal("terms")}
                    className="hover:text-[#dfb76c] transition-colors flex items-center gap-1.5"
                  >
                    <FileText className="w-3.5 h-3.5 text-[#c5a059]" />
                    <span>Terms & Conditions</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveModal("contact")}
                    className="hover:text-[#dfb76c] transition-colors flex items-center gap-1.5"
                  >
                    <Mail className="w-3.5 h-3.5 text-[#c5a059]" />
                    <span>Contact Us (যোগাযোগ)</span>
                  </button>
                </li>
                <li className="pt-2">
                  <div className="p-3 rounded-lg bg-[#160e0a] border border-[#d4af37]/20 text-[11px] text-[#a89985]">
                    HD এক্সপোর্ট ও ভিন্টেজ কার্ড সম্পূর্ণ বিনামূল্যে ব্যবহারযোগ্য।
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom copyright line */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8c7a68]">
            <p className="flex items-center gap-1.5">
              <span>© {new Date().getFullYear()} Universal Poetry Vibe. সর্বস্বত্ব সংরক্ষিত।</span>
            </p>
            <p className="flex items-center gap-1">
              <span>Crafted with</span>
              <Heart className="w-3.5 h-3.5 text-[#e05252] fill-[#e05252]" />
              <span>for timeless love & Bengali vintage nostalgia.</span>
            </p>
          </div>
        </div>
      </footer>

      {/* Info Modals */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-lg bg-[#150f0c] border border-[#d4af37]/40 rounded-2xl p-6 shadow-2xl text-[#f5ebd7] max-h-[85vh] overflow-y-auto">
            <h3 className="text-xl font-bold font-serif text-[#dfb76c] mb-3 flex items-center gap-2">
              <Info className="w-5 h-5 text-[#d4af37]" />
              <span>
                {activeModal === "privacy" && "গোপনীয়তা নীতিমালা (Privacy Policy)"}
                {activeModal === "terms" && "ব্যবহারের শর্তাবলী (Terms & Conditions)"}
                {activeModal === "contact" && "যোগাযোগ (Contact)"}
              </span>
            </h3>

            <div className="text-sm font-bengali-sans text-[#d1c4b2] space-y-3 leading-relaxed">
              {activeModal === "privacy" && (
                <>
                  <p>
                    <strong>Universal Poetry Vibe</strong> ব্যবহারকারীর ব্যক্তিগত তথ্য সুরক্ষিত রাখতে অঙ্গীকারবদ্ধ।
                  </p>
                  <p>
                    আমাদের অ্যাপ্লিকেশনে ব্যবহারকারীর পছন্দের পোস্টকার্ড বা বুকমার্ক সংরক্ষণ করতে ব্রাউজারের লোকাল স্টোরেজ (localStorage) ব্যবহার করা হয়। কোনো প্রকার ব্যক্তিগত ডেটা আমাদের সার্ভারে জমা হয় না।
                  </p>
                  <p>
                    পোস্টকার্ড রেন্ডারিং এবং ডাউনলোড সম্পূর্ণ ক্লায়েন্ট-সাইড ব্রাউজার প্রক্রিয়ায় সম্পন্ন হয়।
                  </p>
                </>
              )}

              {activeModal === "terms" && (
                <>
                  <p>
                    সকল পোস্টকার্ড টেমপ্লেট ও কবিতার উক্তি প্রেম ও নান্দনিক বার্তা আদান-প্রদানের জন্য উন্মুক্ত।
                  </p>
                  <p>
                    ডাউনলোড সম্পন্ন করার আগে স্পন্সর পেজ ভিউ করার নিয়ম প্রযোজ্য হতে পারে। অ্যাপ্লিকেশনটি অরিজিনাল আর্টওয়ার্ক ও ভিন্টেজ আর্টিকেলের সম্মানার্থে প্রস্তুতকৃত।
                  </p>
                </>
              )}

              {activeModal === "contact" && (
                <>
                  <p>
                    আপনার কোনো জিজ্ঞাসা, কবিতা যোগ করার অনুরোধ অথবা মতামত থাকলে আমাদের সাথে যোগাযোগ করুন:
                  </p>
                  <div className="p-3 bg-[#241712] rounded-lg border border-[#d4af37]/30 text-xs">
                    📧 ইমেইল:{" "}
                    <a
                      href="mailto:universalpoetryvibe@gmail.com"
                      className="text-[#dfb76c] font-mono hover:underline"
                    >
                      universalpoetryvibe@gmail.com
                    </a>
                  </div>
                </>
              )}
            </div>

            <div className="mt-6 text-right">
              <button
                onClick={() => setActiveModal(null)}
                className="px-5 py-2 rounded-xl bg-[#8b262d] text-white text-sm font-semibold hover:bg-[#a83232] transition-colors"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
