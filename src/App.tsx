import React, { useState, useEffect } from "react";
import { ActivePage, CategoryId, PostcardTemplate, QuoteItem, GalleryItem } from "./types";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { Hero } from "./components/Hero";
import { CategoryPicker } from "./components/CategoryPicker";
import { FeaturedPostcards } from "./components/FeaturedPostcards";
import { PoetrySection } from "./components/PoetrySection";
import { GallerySection } from "./components/GallerySection";
import { PostcardGenerator } from "./components/PostcardGenerator";
import { PostcardLibrary } from "./components/PostcardLibrary";
import { CategoriesView } from "./components/CategoriesView";
import { FavoritesView } from "./components/FavoritesView";
import { GlobalSearchModal } from "./components/GlobalSearchModal";
import { POSTCARDS } from "./data/postcards";
import { QUOTES } from "./data/quotes";
import { Sparkles, Dices, ArrowRight, Heart, Shield, HelpCircle } from "lucide-react";

export function App() {
  const [activePage, setActivePage] = useState<ActivePage>("home");
  const [selectedCategoryId, setSelectedCategoryId] = useState<CategoryId>("all");
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | undefined>(undefined);
  const [selectedQuoteId, setSelectedQuoteId] = useState<string | undefined>(undefined);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Scroll to top on page switch
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activePage]);

  // Handle template selection from home, cards library or search
  const handleUseTemplate = (template: PostcardTemplate) => {
    setSelectedTemplateId(template.id);
    setActivePage("generator");
  };

  // Handle quote selection to load into generator
  const handleUseQuote = (quote: QuoteItem) => {
    setSelectedQuoteId(quote.id);
    setActivePage("generator");
  };

  // Handle category selection
  const handleSelectCategory = (catId: CategoryId) => {
    setSelectedCategoryId(catId);
    setActivePage("postcards");
  };

  // 🎲 Global Surprise Me
  const handleSurpriseMe = () => {
    const randomTemplate =
      POSTCARDS[Math.floor(Math.random() * POSTCARDS.length)];
    const randomQuote = QUOTES[Math.floor(Math.random() * QUOTES.length)];
    setSelectedTemplateId(randomTemplate.id);
    setSelectedQuoteId(randomQuote.id);
    setActivePage("generator");
  };

  return (
    <div className="min-h-screen bg-[#0d0907] text-[#f5ebd7] flex flex-col selection:bg-[#8b262d] selection:text-white font-bengali-sans relative overflow-x-hidden">
      {/* Subtle global film grain & vignette */}
      <div className="fixed inset-0 bg-film-grain opacity-40 pointer-events-none z-0" />
      <div className="fixed inset-0 bg-gradient-radial from-transparent via-[#0d0907]/40 to-[#0d0907] pointer-events-none z-0" />

      {/* Main Top Header Navigation */}
      <div className="relative z-30">
        <Navbar
          activePage={activePage}
          setActivePage={setActivePage}
          onOpenSearch={() => setIsSearchOpen(true)}
        />
      </div>

      {/* Main Page Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10">
        {/* VIEW 1: HOME PAGE */}
        {activePage === "home" && (
          <div className="space-y-12">
            {/* Hero Section */}
            <Hero
              setActivePage={setActivePage}
              onSelectTemplateForGenerator={(id) => setSelectedTemplateId(id)}
            />

            {/* Category Quick Selector */}
            <CategoryPicker
              selectedCategory={selectedCategoryId}
              onSelectCategory={(catId) => {
                setSelectedCategoryId(catId);
                setActivePage("postcards");
              }}
            />

            {/* Featured Postcard Collections */}
            <FeaturedPostcards
              onUseTemplate={handleUseTemplate}
              onViewAllPostcards={() => setActivePage("postcards")}
            />

            {/* Quick Poetry Highlight Section */}
            <div className="pt-8 border-t border-[#2d1e18]">
              <PoetrySection
                onUseQuote={handleUseQuote}
                onSurpriseMe={handleSurpriseMe}
              />
            </div>

            {/* Step-by-Step "How It Works" Banner */}
            <section className="py-12 px-6 rounded-3xl bg-gradient-to-b from-[#18100c] to-[#120b08] border border-[#d4af37]/25 shadow-xl text-center space-y-8">
              <div className="max-w-2xl mx-auto space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#dfb76c] font-serif">
                  সহজ ও স্বাচ্ছন্দ্যময় প্রক্রিয়া
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold font-bengali-serif text-[#fdf6e7]">
                  কীভাবে তৈরি করবেন আপনার ভিন্টেজ পোস্টকার্ড?
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-left">
                <div className="p-5 rounded-2xl bg-[#140e0b] border border-[#d4af37]/20 space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-[#8b262d] text-white flex items-center justify-center font-bold text-lg">
                    ১
                  </div>
                  <h4 className="text-base font-bold font-bengali-serif text-[#fdf6e7]">
                    ডিজাইন নির্বাচন
                  </h4>
                  <p className="text-xs text-[#a89985] leading-relaxed">
                    রক্তগোলাপ, বৃষ্টিভেজা কদম কিংবা ক্লাসিক চিঠির ফ্রেম থেকে পছন্দের ভিন্টেজ আর্টওয়ার্ক বেছে নিন।
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-[#140e0b] border border-[#d4af37]/20 space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-[#8b262d] text-white flex items-center justify-center font-bold text-lg">
                    ২
                  </div>
                  <h4 className="text-base font-bold font-bengali-serif text-[#fdf6e7]">
                    কবিতা বা নিজের লেখা
                  </h4>
                  <p className="text-xs text-[#a89985] leading-relaxed">
                    সংগ্রহের সেরা প্রেমের কবিতা থেকে নির্বাচন করুন অথবা প্রাপক ও প্রেরকের নামসহ নিজের কবিতা লিখুন।
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-[#140e0b] border border-[#d4af37]/20 space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-[#8b262d] text-white flex items-center justify-center font-bold text-lg">
                    ৩
                  </div>
                  <h4 className="text-base font-bold font-bengali-serif text-[#fdf6e7]">
                    ভিন্টেজ ইফেক্ট দিন
                  </h4>
                  <p className="text-xs text-[#a89985] leading-relaxed">
                    সেপিয়া, ওল্ড পেপার, সিনেমা গ্রেইন কিংবা গোল্ডেন ফ্রেম দিয়ে পোস্টকার্ডে আনুন পুরনো দিনের স্নিগ্ধ রূপ।
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-[#140e0b] border border-[#d4af37]/20 space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-[#8b262d] text-white flex items-center justify-center font-bold text-lg">
                    ৪
                  </div>
                  <h4 className="text-base font-bold font-bengali-serif text-[#fdf6e7]">
                    এক ক্লিকে HD ডাউনলোড
                  </h4>
                  <p className="text-xs text-[#a89985] leading-relaxed">
                    ইনস্ট্যান্ট হাই কোয়ালিটি PNG/JPG ডাউনলোড করুন এবং প্রিয়জনকে পাঠিয়ে দিন হৃদয়ের অনুভূতি।
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setActivePage("generator")}
                  className="py-3.5 px-8 rounded-xl bg-gradient-to-r from-[#8b262d] to-[#6d1b21] hover:from-[#a02c34] hover:to-[#812027] text-white font-bold font-bengali-sans shadow-lg border border-[#d4af37]/35 active:scale-95 transition-all inline-flex items-center gap-2 text-sm"
                >
                  <Sparkles className="w-4 h-4 text-[#dfb76c]" />
                  <span>এখনই পোস্টকার্ড তৈরি শুরু করুন</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </section>
          </div>
        )}

        {/* VIEW 2: POSTCARD GENERATOR STUDIO */}
        {activePage === "generator" && (
          <PostcardGenerator
            initialTemplateId={selectedTemplateId}
            initialQuoteId={selectedQuoteId}
          />
        )}

        {/* VIEW 3: TEMPLATES LIBRARY */}
        {activePage === "postcards" && (
          <PostcardLibrary
            onUseTemplate={handleUseTemplate}
            selectedCategoryId={selectedCategoryId}
          />
        )}

        {/* VIEW 4: POETRY ARCHIVE */}
        {activePage === "poetry" && (
          <PoetrySection
            onUseQuote={handleUseQuote}
            onSurpriseMe={handleSurpriseMe}
          />
        )}

        {/* VIEW 5: UNIVERSAL GALLERY */}
        {activePage === "gallery" && <GallerySection />}

        {/* VIEW 6: CATEGORIES DIRECTORY */}
        {activePage === "categories" && (
          <CategoriesView onSelectCategory={handleSelectCategory} />
        )}

        {/* VIEW 7: FAVORITES */}
        {activePage === "favorites" && (
          <FavoritesView
            onUseTemplate={handleUseTemplate}
            onUseQuote={handleUseQuote}
          />
        )}
      </main>

      {/* Global Search Modal */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectPostcard={(t) => {
          setSelectedTemplateId(t.id);
          setActivePage("generator");
        }}
        onSelectQuote={(q) => {
          setSelectedQuoteId(q.id);
          setActivePage("generator");
        }}
        onSelectGallery={() => {
          setActivePage("gallery");
        }}
        onSelectCategory={(catId) => {
          setSelectedCategoryId(catId as CategoryId);
          setActivePage("postcards");
        }}
      />

      {/* Main Footer */}
      <Footer
        setActivePage={setActivePage}
        onSelectCategory={(catId) => {
          setSelectedCategoryId(catId);
          setActivePage("postcards");
        }}
      />
    </div>
  );
}

export default App;
