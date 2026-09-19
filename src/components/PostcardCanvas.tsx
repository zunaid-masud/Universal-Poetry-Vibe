import React, { forwardRef } from "react";
import {
  PostcardCustomData,
  PostcardTemplate,
  AspectRatioType,
  VintageEffectType,
  BorderStyle,
} from "../types";

interface PostcardCanvasProps {
  customData: PostcardCustomData;
  template?: PostcardTemplate;
  isExporting?: boolean;
}

export const PostcardCanvas = forwardRef<HTMLDivElement, PostcardCanvasProps>(
  ({ customData, template, isExporting = false }, ref) => {
    const {
      recipient,
      quoteText,
      sender,
      date,
      style,
      effect,
      aspectRatio,
    } = customData;

    // Aspect Ratio dimensions - maintaining exact proportions across all devices
    const getAspectRatioClasses = (ratio: AspectRatioType) => {
      switch (ratio) {
        case "square":
          return "aspect-square max-w-[560px]";
        case "story":
        case "status":
          return "aspect-[9/16] max-w-[360px] max-h-[75vh]";
        case "facebook":
          return "aspect-[1.91/1] max-w-[680px]";
        case "postcard":
        default:
          return "aspect-[3/2] max-w-[680px]";
      }
    };

    // Calculate responsive, proportional typography so text never overflows or gets cropped on mobile
    const getResponsiveFontSize = () => {
      const base = style.fontSize || 24;
      switch (aspectRatio) {
        case "facebook":
          return `clamp(11px, calc(${base * 0.038}cqw + 7px), ${Math.min(base, 22)}px)`;
        case "postcard":
          return `clamp(11.5px, calc(${base * 0.046}cqw + 7.5px), ${base}px)`;
        case "square":
          return `clamp(12.5px, calc(${base * 0.052}cqw + 8px), ${base}px)`;
        case "story":
        case "status":
        default:
          return `clamp(13px, calc(${base * 0.058}cqw + 8.5px), ${base + 2}px)`;
      }
    };

    // Vintage Effect CSS Filter class
    const getEffectClass = (eff: VintageEffectType) => {
      switch (eff) {
        case "sepia":
          return "effect-sepia";
        case "old_paper":
          return "effect-old-paper";
        case "faded":
          return "effect-faded";
        case "black_and_white":
          return "effect-bw";
        case "warm_vintage":
          return "effect-warm-vintage";
        case "film_grain":
          return "effect-film-grain";
        case "dust_scratches":
          return "effect-old-paper contrast-110";
        case "coffee_stain":
          return "effect-sepia contrast-115";
        case "original":
        default:
          return "";
      }
    };

    // Border styling
    const getBorderClass = (border?: BorderStyle) => {
      switch (border) {
        case "vintage_gold":
          return "border-2 border-[#d4af37]/80 shadow-[inset_0_0_0_4px_#18100c,inset_0_0_0_5px_rgba(212,175,55,0.7)]";
        case "postage_stamp":
          return "border-2 border-dashed border-[#d4af37]/90 p-1.5";
        case "classic_double":
          return "border-4 border-double border-[#d4af37]/90";
        case "ornate_royal":
          return "border-2 border-[#c5a059] shadow-[inset_0_0_0_6px_#120c09,inset_0_0_0_8px_#c5a059]";
        case "dashed_ticket":
          return "border border-dashed border-[#d4af37]/70";
        case "minimal_film":
          return "border border-[#d4af37]/30";
        case "none":
        default:
          return "border border-[#d4af37]/20";
      }
    };

    // Font Family CSS Class
    const getFontFamilyClass = (font: string) => {
      switch (font) {
        case "Galada":
          return "font-bengali-calligraphy";
        case "Hind Siliguri":
        case "Anek Bangla":
          return "font-bengali-sans";
        case "Tiro Bangla":
          return "font-bengali-tiro";
        case "Special Elite":
          return "font-typewriter";
        case "Playfair Display":
          return "font-playfair";
        case "Cormorant Garamond":
          return "font-garamond";
        case "Cinzel":
          return "font-cinzel";
        case "Alex Brush":
          return "font-script";
        case "Noto Serif Bengali":
        default:
          return "font-bengali-serif";
      }
    };

    // Positioning layout
    const getPositionClasses = () => {
      switch (style.position) {
        case "top_heavy":
          return "justify-start pt-8 pb-4";
        case "bottom_heavy":
          return "justify-end pb-8 pt-4";
        case "card_floating":
          return "justify-center p-6";
        case "letter_split":
          return "justify-between py-6 px-7";
        case "left_aligned":
          return "justify-center items-start text-left";
        case "center":
        default:
          return "justify-center items-center text-center";
      }
    };

    const bgImage = template?.image || "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?q=80&w=1200&auto=format&fit=crop";

    return (
      <div
        ref={ref}
        id="postcard-render-root"
        className={`relative w-full mx-auto overflow-hidden rounded-xl shadow-2xl select-none transition-all postcard-container ${getAspectRatioClasses(
          aspectRatio
        )} ${isExporting ? "" : "transform-gpu hover:shadow-[0_20px_50px_rgba(0,0,0,0.8)]"}`}
        style={{
          backgroundColor: "#16100c",
        }}
      >
        {/* Background Image with Vintage Effect */}
        <div
          className={`absolute inset-0 bg-cover bg-center transition-all duration-300 ${getEffectClass(
            effect
          )}`}
          style={{
            backgroundImage: `url(${bgImage})`,
          }}
        />

        {/* Vintage Dark Overlay for text legibility & mood */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/55 to-black/75 backdrop-blur-[0.5px]" />

        {/* Subtle Paper Texture Overlay */}
        <div className="absolute inset-0 bg-film-grain opacity-60 pointer-events-none mix-blend-overlay" />

        {/* Coffee stain visual effect if chosen */}
        {effect === "coffee_stain" && (
          <div
            className="absolute -top-10 -right-10 w-32 sm:w-44 h-32 sm:h-44 rounded-full border-[14px] sm:border-[18px] border-[#4a2e1b]/30 blur-[2px] pointer-events-none transform rotate-12"
          />
        )}

        {/* Dust & Scratch effect if chosen */}
        {effect === "dust_scratches" && (
          <div className="absolute inset-0 opacity-25 pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
        )}

        {/* Outer Frame Container */}
        <div
          className={`absolute inset-1.5 sm:inset-3 md:inset-4 rounded-lg flex flex-col pointer-events-none ${getBorderClass(
            style.borderStyle
          )}`}
        >
          {/* Victorian Corner Flourishes */}
          <div className="absolute top-0.5 left-0.5 sm:top-1 sm:left-1 w-3 sm:w-4 h-3 sm:h-4 border-t-2 border-l-2 border-[#d4af37]/60" />
          <div className="absolute top-0.5 right-0.5 sm:top-1 sm:right-1 w-3 sm:w-4 h-3 sm:h-4 border-t-2 border-r-2 border-[#d4af37]/60" />
          <div className="absolute bottom-0.5 left-0.5 sm:bottom-1 sm:left-1 w-3 sm:w-4 h-3 sm:h-4 border-b-2 border-l-2 border-[#d4af37]/60" />
          <div className="absolute bottom-0.5 right-0.5 sm:bottom-1 sm:right-1 w-3 sm:w-4 h-3 sm:h-4 border-b-2 border-r-2 border-[#d4af37]/60" />

          {/* Top Vintage Postmark & Stamp Bar */}
          <div className="flex items-start justify-between w-full p-1.5 sm:p-3 md:p-4 z-10 shrink-0">
            {/* Postmark cancellation stamp */}
            {style.showStamp !== false && (
              <div className="postmark-seal shadow-md opacity-90 origin-top-left">
                <span className="font-bold text-[7px] sm:text-[9px] tracking-wider text-[#dfb76c]">
                  POSTAGE
                </span>
                <span className="text-[5.5px] sm:text-[7px] text-[#e8d2a6] my-0.5">
                  {date || "1974 • DHAKA"}
                </span>
                <span className="text-[5px] sm:text-[6px] tracking-widest text-[#c5a059]">
                  ★ AIR MAIL ★
                </span>
              </div>
            )}

            {/* Stamp Artwork / Wax Seal */}
            {style.showStamp !== false && (
              <div className="flex items-center gap-1.5 sm:gap-2">
                {style.stampType === "wax_seal" ? (
                  <div className="wax-seal origin-top-right">
                    <span>💌</span>
                  </div>
                ) : style.stampType === "vintage_rose" ? (
                  <div className="w-8 h-10 sm:w-11 sm:h-14 md:w-13 md:h-16 rounded border-2 border-dashed border-[#d4af37]/70 bg-[#291712] p-0.5 sm:p-1 flex flex-col items-center justify-center text-center shadow-lg transform rotate-2">
                    <span className="text-xs sm:text-base md:text-lg">🌹</span>
                    <span className="text-[5px] sm:text-[7px] text-[#dfb76c] font-cinzel font-bold mt-0.5">
                      10 PAISA
                    </span>
                  </div>
                ) : (
                  <div className="w-8 h-10 sm:w-11 sm:h-14 md:w-13 md:h-16 rounded border border-[#d4af37]/60 bg-[#1c120c]/90 p-0.5 sm:p-1 flex flex-col items-center justify-between shadow-md transform -rotate-1">
                    <div className="text-[5px] sm:text-[6px] text-[#c5a059] font-serif tracking-tighter">
                      POSTAGE
                    </div>
                    <span className="text-xs sm:text-base md:text-lg">🕊️</span>
                    <div className="text-[5px] sm:text-[6px] text-[#dfb76c] font-mono">
                      25 Taka
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Central Postcard Content Area */}
          <div
            className={`flex-1 min-h-0 flex flex-col px-3 sm:px-6 md:px-8 z-10 py-1 sm:py-2 ${getPositionClasses()}`}
          >
            {/* Recipient line if present */}
            {recipient && (
              <div
                className={`mb-1 sm:mb-2 md:mb-3 font-semibold text-[10px] sm:text-xs md:text-sm tracking-wide opacity-90 shrink-0 ${getFontFamilyClass(
                  style.fontFamily
                )}`}
                style={{
                  color: style.textColor || "#f4e8cf",
                  textAlign: style.textAlign || "center",
                }}
              >
                {recipient.includes("প্রিয়") || recipient.includes("To")
                  ? recipient
                  : `প্রিয় ${recipient},`}
              </div>
            )}

            {/* Main Poetry / Quote Text with dynamic responsive scaling */}
            <div
              className={`leading-relaxed transition-all my-auto ${getFontFamilyClass(
                style.fontFamily
              )} ${style.isBold ? "font-bold" : "font-normal"} ${
                style.isItalic ? "italic" : "not-italic"
              }`}
              style={{
                fontSize: getResponsiveFontSize(),
                color: style.textColor || "#f5ebd7",
                textAlign: style.textAlign || "center",
                letterSpacing: `${style.letterSpacing || 0.2}px`,
                lineHeight: style.lineHeight || 1.5,
                textShadow: "0 2px 10px rgba(0,0,0,0.85)",
              }}
            >
              {quoteText ? (
                `“${quoteText.replace(/^“|”$/g, "")}”`
              ) : (
                <span className="opacity-60 italic text-xs sm:text-sm">
                  (উক্তি অথবা নিজের কবিতা লিখুন...)
                </span>
              )}
            </div>

            {/* Sender and Date Footnotes */}
            {(sender || date) && (
              <div
                className={`mt-1 sm:mt-2.5 md:mt-4 flex flex-col gap-0.5 text-[9.5px] sm:text-xs md:text-sm opacity-90 shrink-0 ${getFontFamilyClass(
                  style.fontFamily
                )}`}
                style={{
                  color: style.textColor || "#f4e8cf",
                  textAlign:
                    style.textAlign === "left"
                      ? "left"
                      : style.textAlign === "right"
                      ? "right"
                      : "center",
                }}
              >
                {sender && <span>{sender}</span>}
                {date && (
                  <span className="text-[8px] sm:text-[10px] md:text-xs opacity-75">
                    {date}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Bottom subtle aesthetic brand watermark */}
          <div className="p-1 sm:p-2 md:p-3 flex items-center justify-between text-[6.5px] sm:text-[8.5px] md:text-[10px] text-[#c5a059]/65 font-serif tracking-widest uppercase z-10 border-t border-[#d4af37]/15 shrink-0">
            <span>UNIVERSAL POETRY VIBE</span>
            <span>★ VINTAGE ARCHIVE ★</span>
          </div>
        </div>
      </div>
    );
  }
);

PostcardCanvas.displayName = "PostcardCanvas";
