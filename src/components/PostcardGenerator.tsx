import React, { useState, useRef, useEffect } from "react";
import {
  PostcardTemplate,
  QuoteItem,
  PostcardCustomData,
  FontFamilyType,
  AspectRatioType,
  VintageEffectType,
  TextPositionType,
  BorderStyle,
} from "../types";
import { POSTCARDS } from "../data/postcards";
import { QUOTES } from "../data/quotes";
import { CATEGORIES } from "../data/categories";
import { PostcardCanvas } from "./PostcardCanvas";
import { DownloadSponsorModal } from "./DownloadSponsorModal";
import { downloadElementAsImage } from "../utils/exporter";
import { isFavoriteItem, toggleFavoritePostcard } from "../utils/favorites";
import {
  Sparkles,
  Download,
  Dices,
  RotateCcw,
  Type,
  Sliders,
  Palette,
  Layout,
  Maximize2,
  Share2,
  Check,
  Heart,
  Search,
  PenTool,
  Wand2,
  Stamp,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Eye,
} from "lucide-react";

interface PostcardGeneratorProps {
  initialTemplateId?: string;
  initialQuoteId?: string;
}

export const PostcardGenerator: React.FC<PostcardGeneratorProps> = ({
  initialTemplateId,
  initialQuoteId,
}) => {
  // Find initial template
  const defaultTemplate =
    POSTCARDS.find((p) => p.id === initialTemplateId) || POSTCARDS[0];

  // Active step / tab in editor
  const [activeTab, setActiveTab] = useState<"design" | "text" | "typography" | "effects">("design");

  // Postcard State
  const [selectedTemplate, setSelectedTemplate] = useState<PostcardTemplate>(defaultTemplate);
  const [customData, setCustomData] = useState<PostcardCustomData>({
    templateId: defaultTemplate.id,
    recipient: defaultTemplate.defaultRecipient || "প্রিয়তমা",
    quoteText: defaultTemplate.defaultQuote,
    sender: defaultTemplate.defaultSender || "ইতি, তোমার ভালোবাসার মানুষ",
    date: defaultTemplate.defaultDate || "আজকের এক মিষ্টি মুহূর্ত",
    style: { ...defaultTemplate.style },
    effect: "warm_vintage",
    aspectRatio: "postcard",
  });

  // Filters for templates
  const [templateSearch, setTemplateSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [quoteSearch, setQuoteSearch] = useState("");
  const [quoteCategory, setQuoteCategory] = useState<string>("all");

  // Download & Modal states
  const [isSponsorModalOpen, setIsSponsorModalOpen] = useState(false);
  const [downloadFormat, setDownloadFormat] = useState<"png" | "jpeg">("png");
  const [isExporting, setIsExporting] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Hidden / live export DOM ref
  const postcardRef = useRef<HTMLDivElement>(null);

  // Sync initial props if changed
  useEffect(() => {
    if (initialTemplateId) {
      const found = POSTCARDS.find((p) => p.id === initialTemplateId);
      if (found) {
        setSelectedTemplate(found);
        setCustomData((prev) => ({
          ...prev,
          templateId: found.id,
          recipient: prev.recipient || found.defaultRecipient || "প্রিয়তমা",
          quoteText: prev.quoteText || found.defaultQuote,
          sender: prev.sender || found.defaultSender || "ইতি, তোমার...",
          style: { ...found.style },
        }));
      }
    }
  }, [initialTemplateId]);

  useEffect(() => {
    if (initialQuoteId) {
      const foundQuote = QUOTES.find((q) => q.id === initialQuoteId);
      if (foundQuote) {
        setCustomData((prev) => ({
          ...prev,
          quoteText: foundQuote.text,
        }));
      }
    }
  }, [initialQuoteId]);

  // Handle template selection
  const handleSelectTemplate = (template: PostcardTemplate) => {
    setSelectedTemplate(template);
    setCustomData((prev) => ({
      ...prev,
      templateId: template.id,
      quoteText: prev.quoteText || template.defaultQuote,
      style: {
        ...template.style,
        // preserve user's modified text color/size if already customized
        fontFamily: prev.style.fontFamily || template.style.fontFamily,
      },
    }));
  };

  // 🎲 Surprise Me generator logic
  const handleSurpriseMe = () => {
    const randomTemplate =
      POSTCARDS[Math.floor(Math.random() * POSTCARDS.length)];
    const randomQuote = QUOTES[Math.floor(Math.random() * QUOTES.length)];
    const effects: VintageEffectType[] = [
      "warm_vintage",
      "sepia",
      "old_paper",
      "film_grain",
      "faded",
    ];
    const randomEffect = effects[Math.floor(Math.random() * effects.length)];
    const borders: BorderStyle[] = [
      "vintage_gold",
      "postage_stamp",
      "classic_double",
      "ornate_royal",
    ];
    const randomBorder = borders[Math.floor(Math.random() * borders.length)];

    setSelectedTemplate(randomTemplate);
    setCustomData({
      templateId: randomTemplate.id,
      recipient: randomTemplate.defaultRecipient || "প্রিয়তমা",
      quoteText: randomQuote.text,
      sender: randomTemplate.defaultSender || "ইতি, তোমার চিরদিনের আমি",
      date: randomTemplate.defaultDate || "স্মৃতির পাতা থেকে",
      style: {
        ...randomTemplate.style,
        borderStyle: randomBorder,
        fontSize: Math.floor(Math.random() * 6) + 24,
      },
      effect: randomEffect,
      aspectRatio: "postcard",
    });
  };

  // Reset typography to template defaults
  const handleResetTextStyle = () => {
    setCustomData((prev) => ({
      ...prev,
      style: { ...selectedTemplate.style },
      effect: "warm_vintage",
    }));
  };

  // Initiate download flow (opens sponsor gate first)
  const handleInitiateDownload = (format: "png" | "jpeg") => {
    setDownloadFormat(format);
    setIsSponsorModalOpen(true);
  };

  // Real HD download execution when sponsor countdown unlocks
  const handleExecuteDownload = async () => {
    if (!postcardRef.current) return;
    setIsExporting(true);
    try {
      await downloadElementAsImage({
        element: postcardRef.current,
        format: downloadFormat,
        filename: `UniversalPoetryVibe-${selectedTemplate.title.replace(/\s+/g, "_")}`,
        quality: 0.98,
      });
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 4000);
    } catch (err) {
      console.error("Export failed:", err);
    } finally {
      setIsExporting(false);
      setIsSponsorModalOpen(false);
    }
  };

  // Filtered lists
  const filteredTemplates = POSTCARDS.filter((t) => {
    const matchCat =
      selectedCategory === "all" || t.category === selectedCategory;
    const matchSearch =
      !templateSearch.trim() ||
      t.title.toLowerCase().includes(templateSearch.toLowerCase()) ||
      t.titleBn.toLowerCase().includes(templateSearch.toLowerCase()) ||
      t.tags.some((tag) =>
        tag.toLowerCase().includes(templateSearch.toLowerCase())
      );
    return matchCat && matchSearch;
  });

  const filteredQuotes = QUOTES.filter((q) => {
    const matchCat = quoteCategory === "all" || q.category === quoteCategory;
    const matchSearch =
      !quoteSearch.trim() ||
      q.text.toLowerCase().includes(quoteSearch.toLowerCase()) ||
      (q.author && q.author.toLowerCase().includes(quoteSearch.toLowerCase()));
    return matchCat && matchSearch;
  });

  // Color palette presets
  const colorPresets = [
    { label: "Warm Cream", value: "#fdf6e7" },
    { label: "Golden Dust", value: "#dfb76c" },
    { label: "Pure Amber", value: "#ffedd5" },
    { label: "Antique White", value: "#faeed7" },
    { label: "Rose Petal", value: "#fce7f3" },
    { label: "Sepia Ink", value: "#382417" },
    { label: "Deep Crimson", value: "#8b262d" },
  ];

  // Aspect ratio options
  const aspectRatios: { id: AspectRatioType; label: string; icon: string }[] = [
    { id: "postcard", label: "Postcard (3:2)", icon: "💌" },
    { id: "square", label: "Instagram Square (1:1)", icon: "📷" },
    { id: "story", label: "Instagram Story (9:16)", icon: "📱" },
    { id: "facebook", label: "Facebook Post (1.91:1)", icon: "📘" },
    { id: "status", label: "WhatsApp Status (9:16)", icon: "💬" },
  ];

  // Font family options
  const fontFamilies: { id: FontFamilyType; label: string; group: string }[] = [
    { id: "Noto Serif Bengali", label: "Elegant Bengali Serif (নোটো সেরিফ)", group: "বাংলা" },
    { id: "Galada", label: "Bengali Calligraphy (গালাদা)", group: "বাংলা" },
    { id: "Tiro Bangla", label: "Vintage Bengali (তিরো বাংলা)", group: "বাংলা" },
    { id: "Hind Siliguri", label: "Modern Bengali (হিন্দ শিলিগুড়ি)", group: "বাংলা" },
    { id: "Anek Bangla", label: "Clean Bengali (অনেক বাংলা)", group: "বাংলা" },
    { id: "Special Elite", label: "Typewriter / Old Paper (টাইপরাইটার)", group: "English / Vintage" },
    { id: "Playfair Display", label: "Classic Serif (প্লেফেয়ার)", group: "English / Vintage" },
    { id: "Cormorant Garamond", label: "Royal Garamond (গারামন্ড)", group: "English / Vintage" },
    { id: "Cinzel", label: "Imperial Roman (সিনজেল)", group: "English / Vintage" },
    { id: "Alex Brush", label: "Handwritten Script (স্ক্রিপ্ট)", group: "English / Vintage" },
  ];

  // Vintage effect options
  const vintageEffects: { id: VintageEffectType; label: string; icon: string }[] = [
    { id: "original", label: "Original (মূল রূপ)", icon: "✨" },
    { id: "warm_vintage", label: "Warm Vintage (উষ্ণ ভিন্টেজ)", icon: "🕯️" },
    { id: "sepia", label: "Sepia (সেপিয়া)", icon: "🍂" },
    { id: "old_paper", label: "Old Paper (হলুদ কাগজ)", icon: "📜" },
    { id: "film_grain", label: "Film Grain (সিনেমা গ্রেইন)", icon: "🎞️" },
    { id: "black_and_white", label: "Black & White (সাদা-কালো)", icon: "📷" },
    { id: "faded", label: "Faded (ফিকে অতীত)", icon: "🌫️" },
    { id: "dust_scratches", label: "Dust & Scratches (ধূলো ও স্ক্র্যাচ)", icon: "⏳" },
    { id: "coffee_stain", label: "Coffee Stain (কফির দাগ)", icon: "☕" },
  ];

  // Border styles
  const borderStyles: { id: BorderStyle; label: string }[] = [
    { id: "vintage_gold", label: "Vintage Gold Foil (স্বর্ণালী বর্ডার)" },
    { id: "postage_stamp", label: "Postage Stamp Dashed (ডাকটিকিট ফ্রেম)" },
    { id: "classic_double", label: "Classic Double Line (ডাবল লাইন)" },
    { id: "ornate_royal", label: "Victorian Royal Ornate (রাজকীয় ফ্রেম)" },
    { id: "dashed_ticket", label: "Vintage Ticket Dashed (টিকিট ফ্রেম)" },
    { id: "minimal_film", label: "Minimal Film (মিনিমাল বর্ডার)" },
    { id: "none", label: "No Frame (বর্ডারহীন)" },
  ];

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-[#d4af37]/20">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#201511] border border-[#d4af37]/40 text-xs font-semibold text-[#dfb76c] mb-2">
            <span>💌</span>
            <span>Universal Postcard Studio</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-bengali-serif text-[#fdf6e7]">
            পোস্টকার্ড জেনারেটর ও কাস্টমাইজেশন
          </h2>
          <p className="text-xs sm:text-sm text-[#a89985] font-bengali-sans">
            ডিজাইন নির্বাচন করুন → উক্তি বা নিজের কবিতা যোগ করুন → ইফেক্ট দিন → HD ডাউনলোড করুন।
          </p>
        </div>

        {/* Surprise Me Quick Action */}
        <button
          onClick={handleSurpriseMe}
          className="w-full sm:w-auto py-2.5 px-5 rounded-xl bg-gradient-to-r from-[#b3832c] to-[#996f1d] hover:brightness-110 text-[#140e0b] font-bold text-sm font-bengali-sans shadow-md flex items-center justify-center gap-2 transition-transform active:scale-95 shrink-0"
        >
          <Dices className="w-4 h-4" />
          <span>🎲 Surprise Me (এলোমেলো নির্বাচন)</span>
        </button>
      </div>

      {/* Main Two-Column Generator Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Controls & Editor Steps */}
        <div className="lg:col-span-6 space-y-6 order-2 lg:order-1">
          {/* Step Navigation Tabs */}
          <div className="grid grid-cols-4 gap-1.5 p-1.5 rounded-2xl bg-[#140e0b] border border-[#d4af37]/25">
            <button
              onClick={() => setActiveTab("design")}
              className={`py-2.5 px-2 rounded-xl text-xs sm:text-sm font-semibold font-bengali-sans transition-all flex flex-col sm:flex-row items-center justify-center gap-1.5 ${
                activeTab === "design"
                  ? "bg-[#8b262d] text-white shadow-md border border-[#d4af37]/40"
                  : "text-[#c2b29e] hover:bg-[#1f1510] hover:text-white"
              }`}
            >
              <Layout className="w-3.5 h-3.5" />
              <span>১. ডিজাইন</span>
            </button>

            <button
              onClick={() => setActiveTab("text")}
              className={`py-2.5 px-2 rounded-xl text-xs sm:text-sm font-semibold font-bengali-sans transition-all flex flex-col sm:flex-row items-center justify-center gap-1.5 ${
                activeTab === "text"
                  ? "bg-[#8b262d] text-white shadow-md border border-[#d4af37]/40"
                  : "text-[#c2b29e] hover:bg-[#1f1510] hover:text-white"
              }`}
            >
              <PenTool className="w-3.5 h-3.5" />
              <span>২. কবিতা ও লেখা</span>
            </button>

            <button
              onClick={() => setActiveTab("typography")}
              className={`py-2.5 px-2 rounded-xl text-xs sm:text-sm font-semibold font-bengali-sans transition-all flex flex-col sm:flex-row items-center justify-center gap-1.5 ${
                activeTab === "typography"
                  ? "bg-[#8b262d] text-white shadow-md border border-[#d4af37]/40"
                  : "text-[#c2b29e] hover:bg-[#1f1510] hover:text-white"
              }`}
            >
              <Type className="w-3.5 h-3.5" />
              <span>৩. টাইপোগ্রাফি</span>
            </button>

            <button
              onClick={() => setActiveTab("effects")}
              className={`py-2.5 px-2 rounded-xl text-xs sm:text-sm font-semibold font-bengali-sans transition-all flex flex-col sm:flex-row items-center justify-center gap-1.5 ${
                activeTab === "effects"
                  ? "bg-[#8b262d] text-white shadow-md border border-[#d4af37]/40"
                  : "text-[#c2b29e] hover:bg-[#1f1510] hover:text-white"
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>৪. ভিন্টেজ ইফেক্ট</span>
            </button>
          </div>

          {/* TAB 1: DESIGN SELECTION */}
          {activeTab === "design" && (
            <div className="space-y-4 p-5 rounded-2xl bg-[#140e0b] border border-[#d4af37]/25 shadow-lg">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold font-bengali-serif text-[#fdf6e7] flex items-center gap-2">
                  <Layout className="w-4 h-4 text-[#dfb76c]" />
                  <span>পোস্টকার্ড টেমপ্লেট নির্বাচন করুন</span>
                </h3>
                <span className="text-xs text-[#a89985]">
                  নির্বাচিত: <strong>{selectedTemplate.titleBn}</strong>
                </span>
              </div>

              {/* Search & Category Filter */}
              <div className="space-y-2.5">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a89985]" />
                  <input
                    type="text"
                    value={templateSearch}
                    onChange={(e) => setTemplateSearch(e.target.value)}
                    placeholder="টেমপ্লেট খুঁজুন..."
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#1c120d] border border-[#d4af37]/20 text-xs text-[#f5ebd7] placeholder-[#8c7b6c] focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-none">
                  {CATEGORIES.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setSelectedCategory(c.id)}
                      className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all border ${
                        selectedCategory === c.id
                          ? "bg-[#8b262d] text-white border-[#d4af37]"
                          : "bg-[#1b120d] text-[#c2b29e] border-[#d4af37]/15 hover:border-[#d4af37]/40"
                      }`}
                    >
                      {c.nameBn}
                    </button>
                  ))}
                </div>
              </div>

              {/* Template Thumbnails Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[360px] overflow-y-auto pr-1">
                {filteredTemplates.map((template) => {
                  const isSelected = selectedTemplate.id === template.id;
                  return (
                    <button
                      key={template.id}
                      onClick={() => handleSelectTemplate(template)}
                      className={`relative aspect-[4/3] rounded-xl overflow-hidden border text-left transition-all group ${
                        isSelected
                          ? "border-[#dfb76c] ring-2 ring-[#dfb76c]/40 shadow-lg scale-[1.02]"
                          : "border-[#d4af37]/20 hover:border-[#d4af37]/60 opacity-80 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={template.image}
                        alt={template.titleBn}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                      <div className="absolute bottom-1.5 inset-x-2">
                        <span className="block text-[11px] font-bold font-bengali-serif text-[#fdf6e7] truncate">
                          {template.titleBn}
                        </span>
                        <span className="block text-[9px] text-[#dfb76c]">
                          {template.categoryBn}
                        </span>
                      </div>
                      {isSelected && (
                        <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-[#dfb76c] text-[#140e0b] flex items-center justify-center text-xs font-bold shadow-md">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: TEXT & QUOTE SELECTION / WRITE YOUR OWN */}
          {activeTab === "text" && (
            <div className="space-y-5 p-5 rounded-2xl bg-[#140e0b] border border-[#d4af37]/25 shadow-lg">
              <h3 className="text-base font-bold font-bengali-serif text-[#fdf6e7] flex items-center gap-2">
                <PenTool className="w-4 h-4 text-[#dfb76c]" />
                <span>উক্তি নির্বাচন করুন অথবা নিজের মতো লিখুন</span>
              </h3>

              {/* Ready-made Quote Selector Drawer / Accordion */}
              <div className="p-3.5 rounded-xl bg-[#1a120d] border border-[#d4af37]/20 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#dfb76c] font-bengali-sans">
                    📜 রেডিমেড প্রেমের উক্তি থেকে বেছে নিন:
                  </span>
                  <span className="text-[10px] text-[#a89985]">
                    {filteredQuotes.length} টি উক্তি
                  </span>
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                  {CATEGORIES.slice(0, 8).map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setQuoteCategory(cat.id)}
                      className={`px-2.5 py-0.5 rounded-lg text-[11px] whitespace-nowrap transition-all border ${
                        quoteCategory === cat.id
                          ? "bg-[#8b262d] text-white border-[#d4af37]"
                          : "bg-[#241711] text-[#c2b29e] border-[#d4af37]/15"
                      }`}
                    >
                      {cat.nameBn}
                    </button>
                  ))}
                </div>

                <div className="max-h-40 overflow-y-auto space-y-2 pr-1">
                  {filteredQuotes.map((q) => (
                    <div
                      key={q.id}
                      onClick={() =>
                        setCustomData((prev) => ({
                          ...prev,
                          quoteText: q.text,
                        }))
                      }
                      className="p-2.5 rounded-lg bg-[#140e0b] hover:bg-[#281912] border border-[#d4af37]/15 hover:border-[#dfb76c]/50 text-left transition-all cursor-pointer group"
                    >
                      <p className="text-xs font-bengali-serif text-[#f5ebd7] group-hover:text-[#dfb76c] line-clamp-2">
                        “{q.text}”
                      </p>
                      {q.author && (
                        <span className="text-[10px] text-[#a89985] block mt-0.5 text-right">
                          — {q.author}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Form Fields: Recipient, Main Quote, Sender, Date */}
              <div className="space-y-3.5 pt-1">
                <div>
                  <label className="block text-xs font-semibold font-bengali-sans text-[#dfb76c] mb-1">
                    প্রাপক (Recipient):
                  </label>
                  <input
                    type="text"
                    value={customData.recipient}
                    onChange={(e) =>
                      setCustomData((prev) => ({
                        ...prev,
                        recipient: e.target.value,
                      }))
                    }
                    placeholder="যেমন: প্রিয়তমা, হৃদয়েশ্বরী..."
                    className="w-full px-3.5 py-2 rounded-xl bg-[#1a120d] border border-[#d4af37]/25 text-sm text-[#fdf6e7] placeholder-[#7d6b5b] focus:outline-none focus:border-[#d4af37] font-bengali-sans"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold font-bengali-sans text-[#dfb76c] mb-1">
                    মূল কবিতা বা উক্তি (Main Poetry / Quote):
                  </label>
                  <textarea
                    rows={4}
                    value={customData.quoteText}
                    onChange={(e) =>
                      setCustomData((prev) => ({
                        ...prev,
                        quoteText: e.target.value,
                      }))
                    }
                    placeholder="এখানে আপনার নিজের লেখা বা কবিতা লিখুন..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#1a120d] border border-[#d4af37]/25 text-sm text-[#fdf6e7] placeholder-[#7d6b5b] focus:outline-none focus:border-[#d4af37] font-bengali-serif leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold font-bengali-sans text-[#dfb76c] mb-1">
                      প্রেরক (Sender):
                    </label>
                    <input
                      type="text"
                      value={customData.sender}
                      onChange={(e) =>
                        setCustomData((prev) => ({
                          ...prev,
                          sender: e.target.value,
                        }))
                      }
                      placeholder="যেমন: ইতি, তোমার মেঘবালক"
                      className="w-full px-3 py-2 rounded-xl bg-[#1a120d] border border-[#d4af37]/25 text-xs text-[#fdf6e7] placeholder-[#7d6b5b] focus:outline-none focus:border-[#d4af37] font-bengali-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold font-bengali-sans text-[#dfb76c] mb-1">
                      তারিখ / স্থান (Date / Location):
                    </label>
                    <input
                      type="text"
                      value={customData.date}
                      onChange={(e) =>
                        setCustomData((prev) => ({
                          ...prev,
                          date: e.target.value,
                        }))
                      }
                      placeholder="যেমন: শ্রাবণ, ১৪৩১ • ঢাকা"
                      className="w-full px-3 py-2 rounded-xl bg-[#1a120d] border border-[#d4af37]/25 text-xs text-[#fdf6e7] placeholder-[#7d6b5b] focus:outline-none focus:border-[#d4af37] font-bengali-sans"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: TYPOGRAPHY & TEXT STYLING */}
          {activeTab === "typography" && (
            <div className="space-y-4 p-5 rounded-2xl bg-[#140e0b] border border-[#d4af37]/25 shadow-lg">
              <div className="flex items-center justify-between pb-2 border-b border-[#261913]">
                <h3 className="text-base font-bold font-bengali-serif text-[#fdf6e7] flex items-center gap-2">
                  <Type className="w-4 h-4 text-[#dfb76c]" />
                  <span>টাইপোগ্রাফি ও লেখার স্টাইল</span>
                </h3>
                <button
                  onClick={handleResetTextStyle}
                  className="text-xs text-[#dfb76c] hover:underline flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>রিসেট স্টাইল</span>
                </button>
              </div>

              {/* Font Family Selection */}
              <div>
                <label className="block text-xs font-semibold font-bengali-sans text-[#dfb76c] mb-1.5">
                  ফন্ট নির্বাচন (Font Style):
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                  {fontFamilies.map((font) => {
                    const isSelected =
                      customData.style.fontFamily === font.id;
                    return (
                      <button
                        key={font.id}
                        onClick={() =>
                          setCustomData((prev) => ({
                            ...prev,
                            style: { ...prev.style, fontFamily: font.id },
                          }))
                        }
                        className={`p-2 rounded-xl text-left border text-xs transition-all ${
                          isSelected
                            ? "bg-[#2b1812] border-[#dfb76c] text-[#dfb76c] font-bold shadow-sm"
                            : "bg-[#18100c] border-[#d4af37]/20 text-[#d1c4b2] hover:bg-[#20140f]"
                        }`}
                      >
                        <span className="block truncate">{font.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Font Size & Alignment Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold font-bengali-sans text-[#dfb76c]">
                      ফন্ট সাইজ ({customData.style.fontSize}px):
                    </label>
                  </div>
                  <input
                    type="range"
                    min={18}
                    max={36}
                    value={customData.style.fontSize}
                    onChange={(e) =>
                      setCustomData((prev) => ({
                        ...prev,
                        style: {
                          ...prev.style,
                          fontSize: Number(e.target.value),
                        },
                      }))
                    }
                    className="w-full accent-[#8b262d] bg-[#221610] h-2 rounded-lg cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold font-bengali-sans text-[#dfb76c] mb-1">
                    টেক্সট ফরম্যাটিং ও অ্যালাইনমেন্ট:
                  </label>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() =>
                        setCustomData((prev) => ({
                          ...prev,
                          style: {
                            ...prev.style,
                            isBold: !prev.style.isBold,
                          },
                        }))
                      }
                      className={`p-2 rounded-lg border ${
                        customData.style.isBold
                          ? "bg-[#8b262d] text-white border-[#dfb76c]"
                          : "bg-[#1a120d] text-[#a89985] border-[#d4af37]/20"
                      }`}
                      title="Bold"
                    >
                      <Bold className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() =>
                        setCustomData((prev) => ({
                          ...prev,
                          style: {
                            ...prev.style,
                            isItalic: !prev.style.isItalic,
                          },
                        }))
                      }
                      className={`p-2 rounded-lg border ${
                        customData.style.isItalic
                          ? "bg-[#8b262d] text-white border-[#dfb76c]"
                          : "bg-[#1a120d] text-[#a89985] border-[#d4af37]/20"
                      }`}
                      title="Italic"
                    >
                      <Italic className="w-3.5 h-3.5" />
                    </button>

                    <div className="w-px h-6 bg-[#332219] mx-1" />

                    <button
                      onClick={() =>
                        setCustomData((prev) => ({
                          ...prev,
                          style: { ...prev.style, textAlign: "left" },
                        }))
                      }
                      className={`p-2 rounded-lg border ${
                        customData.style.textAlign === "left"
                          ? "bg-[#8b262d] text-white border-[#dfb76c]"
                          : "bg-[#1a120d] text-[#a89985] border-[#d4af37]/20"
                      }`}
                      title="Left Align"
                    >
                      <AlignLeft className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() =>
                        setCustomData((prev) => ({
                          ...prev,
                          style: { ...prev.style, textAlign: "center" },
                        }))
                      }
                      className={`p-2 rounded-lg border ${
                        customData.style.textAlign === "center"
                          ? "bg-[#8b262d] text-white border-[#dfb76c]"
                          : "bg-[#1a120d] text-[#a89985] border-[#d4af37]/20"
                      }`}
                      title="Center Align"
                    >
                      <AlignCenter className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() =>
                        setCustomData((prev) => ({
                          ...prev,
                          style: { ...prev.style, textAlign: "right" },
                        }))
                      }
                      className={`p-2 rounded-lg border ${
                        customData.style.textAlign === "right"
                          ? "bg-[#8b262d] text-white border-[#dfb76c]"
                          : "bg-[#1a120d] text-[#a89985] border-[#d4af37]/20"
                      }`}
                      title="Right Align"
                    >
                      <AlignRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Text Color Palette */}
              <div className="pt-2">
                <label className="block text-xs font-semibold font-bengali-sans text-[#dfb76c] mb-1.5">
                  টেক্সট কালার (Text Color):
                </label>
                <div className="flex flex-wrap items-center gap-2">
                  {colorPresets.map((col) => (
                    <button
                      key={col.value}
                      onClick={() =>
                        setCustomData((prev) => ({
                          ...prev,
                          style: { ...prev.style, textColor: col.value },
                        }))
                      }
                      className={`px-3 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-2 transition-all ${
                        customData.style.textColor === col.value
                          ? "border-[#dfb76c] bg-[#241711] shadow-sm"
                          : "border-[#d4af37]/20 bg-[#160e0a]"
                      }`}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-black/40 shadow-inner"
                        style={{ backgroundColor: col.value }}
                      />
                      <span className="text-[#e2d5c4]">{col.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Text Position Layout */}
              <div className="pt-2">
                <label className="block text-xs font-semibold font-bengali-sans text-[#dfb76c] mb-1.5">
                  টেক্সট প্লেসমেন্ট (Text Position):
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {(
                    [
                      { id: "center", label: "মাঝখানে (Center)" },
                      { id: "bottom_heavy", label: "নিচে (Bottom)" },
                      { id: "top_heavy", label: "উপরে (Top)" },
                      { id: "letter_split", label: "চিঠি স্টাইল (Letter Split)" },
                      { id: "card_floating", label: "কার্ড বক্স (Card Box)" },
                      { id: "left_aligned", label: "বামপাশে (Left Align)" },
                    ] as { id: TextPositionType; label: string }[]
                  ).map((pos) => (
                    <button
                      key={pos.id}
                      onClick={() =>
                        setCustomData((prev) => ({
                          ...prev,
                          style: { ...prev.style, position: pos.id },
                        }))
                      }
                      className={`p-2 rounded-xl text-xs border text-center transition-all ${
                        customData.style.position === pos.id
                          ? "bg-[#8b262d] text-white border-[#dfb76c] font-semibold"
                          : "bg-[#18100c] text-[#c2b29e] border-[#d4af37]/20 hover:bg-[#221611]"
                      }`}
                    >
                      {pos.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: VINTAGE EFFECTS & BORDERS */}
          {activeTab === "effects" && (
            <div className="space-y-5 p-5 rounded-2xl bg-[#140e0b] border border-[#d4af37]/25 shadow-lg">
              <h3 className="text-base font-bold font-bengali-serif text-[#fdf6e7] flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#dfb76c]" />
                <span>ভিন্টেজ ইফেক্ট ও ফ্রেম নির্বাচন</span>
              </h3>

              {/* Vintage Color Effects */}
              <div>
                <label className="block text-xs font-semibold font-bengali-sans text-[#dfb76c] mb-2">
                  ভিন্টেজ ফটো ইফেক্ট (Vintage Filter):
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {vintageEffects.map((eff) => {
                    const isSelected = customData.effect === eff.id;
                    return (
                      <button
                        key={eff.id}
                        onClick={() =>
                          setCustomData((prev) => ({
                            ...prev,
                            effect: eff.id,
                          }))
                        }
                        className={`p-2.5 rounded-xl border text-left text-xs transition-all flex items-center gap-2 ${
                          isSelected
                            ? "bg-[#8b262d] text-white border-[#dfb76c] font-semibold shadow-md"
                            : "bg-[#19110d] text-[#d6c7b2] border-[#d4af37]/20 hover:bg-[#241712]"
                        }`}
                      >
                        <span className="text-base">{eff.icon}</span>
                        <span className="truncate">{eff.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Border Styles */}
              <div className="pt-2">
                <label className="block text-xs font-semibold font-bengali-sans text-[#dfb76c] mb-2">
                  বর্ডার ও ফ্রেম স্টাইল (Border Style):
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {borderStyles.map((b) => {
                    const isSelected = customData.style.borderStyle === b.id;
                    return (
                      <button
                        key={b.id}
                        onClick={() =>
                          setCustomData((prev) => ({
                            ...prev,
                            style: { ...prev.style, borderStyle: b.id },
                          }))
                        }
                        className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                          isSelected
                            ? "bg-[#291712] text-[#dfb76c] border-[#dfb76c] font-bold shadow-sm"
                            : "bg-[#19110d] text-[#c2b29e] border-[#d4af37]/20 hover:bg-[#201510]"
                        }`}
                      >
                        {b.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Postage Stamp & Seal Toggle */}
              <div className="pt-2 p-3.5 rounded-xl bg-[#19110d] border border-[#d4af37]/20 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Stamp className="w-5 h-5 text-[#dfb76c]" />
                  <div>
                    <span className="block text-xs font-bold font-bengali-sans text-[#fdf6e7]">
                      ডাকটিকিট ও ভিন্টেজ সিল (Postage Seal)
                    </span>
                    <span className="block text-[10px] text-[#a89985]">
                      পোস্টকার্ডে ক্লাসিক ডাকটিকিট ও পোস্টমার্ক সিল দেখান
                    </span>
                  </div>
                </div>

                <input
                  type="checkbox"
                  checked={customData.style.showStamp !== false}
                  onChange={(e) =>
                    setCustomData((prev) => ({
                      ...prev,
                      style: {
                        ...prev.style,
                        showStamp: e.target.checked,
                      },
                    }))
                  }
                  className="w-4 h-4 accent-[#8b262d] rounded cursor-pointer"
                />
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Live Realistic Postcard Preview & Download Panel */}
        <div className="lg:col-span-6 space-y-6 order-1 lg:order-2 lg:sticky lg:top-24">
          <div className="p-3 sm:p-5 md:p-6 rounded-2xl bg-[#140e0b] border border-[#d4af37]/30 shadow-2xl space-y-4 w-full">
            {/* Top Aspect Ratio Picker */}
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#dfb76c] font-serif flex items-center gap-1.5">
                  <span>📏</span>
                  <span>এক্সপোর্ট সাইজ (Aspect Ratio)</span>
                </span>
                <span className="text-[11px] text-[#a89985] shrink-0 font-bengali-sans">
                  HD রেজোলিউশন
                </span>
              </div>

              {/* Horizontally scrollable aspect ratio buttons with touch padding & visible touch targets */}
              <div className="relative -mx-1 px-1">
                <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-0.5 scrollbar-thin scrollbar-thumb-[#382417] scrollbar-track-transparent touch-pan-x overscroll-x-contain">
                  {aspectRatios.map((ratio) => {
                    const isSelected = customData.aspectRatio === ratio.id;
                    return (
                      <button
                        key={ratio.id}
                        type="button"
                        onClick={() =>
                          setCustomData((prev) => ({
                            ...prev,
                            aspectRatio: ratio.id,
                          }))
                        }
                        className={`min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all border flex items-center gap-2 shrink-0 select-none active:scale-95 ${
                          isSelected
                            ? "bg-[#8b262d] text-white border-[#dfb76c] shadow-[0_2px_12px_rgba(139,38,45,0.5)] font-semibold ring-1 ring-[#dfb76c]/40"
                            : "bg-[#1c120e] text-[#c2b29e] border-[#d4af37]/20 hover:border-[#d4af37]/50 hover:bg-[#251712] hover:text-[#f5ebd7]"
                        }`}
                      >
                        <span className="text-sm">{ratio.icon}</span>
                        <span>{ratio.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* LIVE POSTCARD PREVIEW CANVAS */}
            <div className="p-2 sm:p-4 rounded-xl bg-[#0a0705] border border-[#d4af37]/20 flex items-center justify-center overflow-hidden w-full max-w-full">
              <PostcardCanvas
                ref={postcardRef}
                customData={customData}
                template={selectedTemplate}
              />
            </div>

            {/* DOWNLOAD TRIGGER ACTIONS */}
            <div className="space-y-3 pt-2 border-t border-[#261913]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                <button
                  type="button"
                  onClick={() => handleInitiateDownload("png")}
                  className="min-h-[48px] py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#8b262d] via-[#a83232] to-[#6d1b21] hover:brightness-110 text-white font-bold font-bengali-sans shadow-[0_4px_20px_rgba(139,38,45,0.4)] transition-all transform active:scale-95 flex items-center justify-center gap-2 border border-[#d4af37]/35 text-xs sm:text-sm"
                >
                  <Download className="w-4 h-4 text-[#dfb76c] shrink-0" />
                  <span>⬇️ HD PNG ডাউনলোড করুন</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleInitiateDownload("jpeg")}
                  className="min-h-[48px] py-3.5 px-4 rounded-xl bg-[#221611] hover:bg-[#2d1e18] text-[#f5ebd7] font-semibold font-bengali-sans border border-[#d4af37]/35 transition-all transform active:scale-95 flex items-center justify-center gap-2 text-xs sm:text-sm"
                >
                  <Download className="w-4 h-4 text-[#c5a059] shrink-0" />
                  <span>⬇️ JPG ডাউনলোড করুন</span>
                </button>
              </div>

              {downloadSuccess && (
                <div className="p-3 rounded-xl bg-[#1b3320] border border-[#2e7d32] text-xs text-[#81c784] font-semibold flex items-center justify-center gap-2 animate-fadeIn">
                  <Check className="w-4 h-4" />
                  <span>আপনার পোস্টকার্ড সফলভাবে ডাউনলোড হয়েছে!</span>
                </div>
              )}

              <p className="text-[11px] text-[#8c7b6c] text-center font-bengali-sans">
                ডাউনলোড করা ইমেজে কোনো প্রকার ওয়াটারমার্ক বা ওয়েবসাইট কন্ট্রোল থাকবে না।
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 8-SECOND DOWNLOAD SPONSOR GATE MODAL */}
      <DownloadSponsorModal
        isOpen={isSponsorModalOpen}
        onClose={() => setIsSponsorModalOpen(false)}
        onReadyToDownload={handleExecuteDownload}
        format={downloadFormat}
        isDownloading={isExporting}
      />
    </div>
  );
};
