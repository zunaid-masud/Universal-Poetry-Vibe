import React, { useState, useEffect } from "react";
import { ActivePage, FavoriteItems } from "../types";
import { getStoredFavorites } from "../utils/favorites";
import {
  Menu,
  X,
  Search,
  Heart,
  Sparkles,
  BookOpen,
  Image as ImageIcon,
  Grid,
  Mail,
  Home,
} from "lucide-react";

interface NavbarProps {
  activePage: ActivePage;
  setActivePage: (page: ActivePage) => void;
  onOpenSearch: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activePage,
  setActivePage,
  onOpenSearch,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [favCount, setFavCount] = useState<number>(0);

  useEffect(() => {
    const updateCount = () => {
      const favs: FavoriteItems = getStoredFavorites();
      const total =
        (favs.postcards?.length || 0) +
        (favs.quotes?.length || 0) +
        (favs.gallery?.length || 0);
      setFavCount(total);
    };

    updateCount();
    window.addEventListener("uv_favorites_updated", updateCount);
    return () => {
      window.removeEventListener("uv_favorites_updated", updateCount);
    };
  }, []);

  const navItems: { id: ActivePage; label: React.ReactNode; icon: React.ReactNode }[] = [
    { id: "home", label: <span>Home</span>, icon: <Home className="w-3.5 h-3.5 lg:w-4 lg:h-4 shrink-0" /> },
    { id: "postcards", label: <span>Postcards</span>, icon: <Mail className="w-3.5 h-3.5 lg:w-4 lg:h-4 shrink-0" /> },
    { id: "poetry", label: <span>Poetry</span>, icon: <BookOpen className="w-3.5 h-3.5 lg:w-4 lg:h-4 shrink-0" /> },
    {
      id: "gallery",
      label: (
        <span>
          <span className="hidden xl:inline">Universal </span>Gallery
        </span>
      ),
      icon: <ImageIcon className="w-3.5 h-3.5 lg:w-4 lg:h-4 shrink-0" />,
    },
    { id: "categories", label: <span>Categories</span>, icon: <Grid className="w-3.5 h-3.5 lg:w-4 lg:h-4 shrink-0" /> },
    {
      id: "favorites",
      label: <span>Favorites</span>,
      icon: (
        <span className="relative inline-flex items-center">
          <Heart className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-[#e05252] shrink-0" />
          {favCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-[#8b262d] text-white text-[9px] md:text-[8px] lg:text-[10px] font-bold rounded-full w-3.5 h-3.5 md:w-3.5 md:h-3.5 lg:w-4 lg:h-4 flex items-center justify-center border border-[#d4af37]">
              {favCount}
            </span>
          )}
        </span>
      ),
    },
  ];

  const handleNavClick = (page: ActivePage) => {
    setActivePage(page);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0e0a08]/95 backdrop-blur-md border-b border-[#d4af37]/20 shadow-md">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-3 lg:px-6 xl:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18 gap-1.5 sm:gap-2 md:gap-1.5 lg:gap-3">
          {/* Logo & Brand */}
          <button
            onClick={() => handleNavClick("home")}
            className="flex items-center gap-2 lg:gap-2.5 text-left group shrink-0"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 rounded-xl bg-[#221612] border border-[#d4af37]/40 flex items-center justify-center text-base sm:text-lg lg:text-xl shadow-inner group-hover:border-[#d4af37] transition-all shrink-0">
              💌
            </div>
            <div>
              <span className="text-sm sm:text-base md:text-sm lg:text-lg xl:text-xl font-bold font-serif tracking-tight text-[#fdf6e7] flex items-center gap-1 whitespace-nowrap">
                Universal Poetry Vibe
              </span>
              <span className="hidden xl:block text-[10px] text-[#c5a059] font-bengali-sans tracking-wide">
                পুরনো দিনের অনুভূতি, আজকের ভালোবাসার জন্য
              </span>
            </div>
          </button>

          {/* Desktop & Tablet Navigation */}
          <nav className="hidden md:flex items-center gap-0.5 lg:gap-1 xl:gap-2 shrink">
            {navItems.map((item) => {
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-2 py-1.5 md:px-1.5 md:py-1 lg:px-2.5 lg:py-2 rounded-lg text-xs md:text-[11.5px] lg:text-xs xl:text-sm font-medium transition-all flex items-center gap-1 lg:gap-1.5 shrink-0 whitespace-nowrap ${
                    isActive
                      ? "bg-[#251813] text-[#dfb76c] border border-[#d4af37]/40 shadow-sm font-semibold"
                      : "text-[#d6c7b2] hover:text-[#fdf6e7] hover:bg-[#1a110d]"
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Action Buttons: Search + Create Postcard */}
          <div className="hidden md:flex items-center gap-1.5 lg:gap-2.5 shrink-0">
            <button
              onClick={onOpenSearch}
              className="p-1.5 sm:p-2 lg:p-2.5 rounded-lg bg-[#19110d] border border-[#d4af37]/30 text-[#d1c4b2] hover:text-white hover:border-[#d4af37] transition-all shrink-0"
              title="খুঁজুন (Search)"
              aria-label="উক্তি বা পোস্টকার্ড খুঁজুন"
            >
              <Search className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
            </button>

            <button
              onClick={() => handleNavClick("generator")}
              className="py-1.5 px-2.5 md:py-1.5 md:px-2.5 lg:py-2.5 lg:px-4 rounded-xl bg-gradient-to-r from-[#8b262d] via-[#a83232] to-[#7c1d24] text-[#fdf6e7] text-xs lg:text-sm font-semibold shadow-md hover:shadow-[#8b262d]/40 border border-[#d4af37]/40 transition-all transform active:scale-95 flex items-center gap-1.5 lg:gap-2 shrink-0 whitespace-nowrap"
            >
              <Sparkles className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-[#dfb76c] shrink-0" />
              <span>
                <span className="hidden xl:inline">✨ </span>Create Postcard
              </span>
            </button>
          </div>

          {/* Mobile hamburger menu toggle */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={onOpenSearch}
              className="p-2 rounded-lg bg-[#19110d] border border-[#d4af37]/30 text-[#d1c4b2]"
              aria-label="সার্চ করুন"
            >
              <Search className="w-4 h-4" />
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-[#19110d] border border-[#d4af37]/30 text-[#d1c4b2] hover:text-white"
              aria-label="মেনু খুলুন"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-[#dfb76c]" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#d4af37]/20 bg-[#120c09] px-4 pt-3 pb-6 space-y-2 animate-fadeIn">
          {navItems.map((item) => {
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full px-4 py-3 rounded-xl text-left text-base font-medium flex items-center justify-between transition-all ${
                  isActive
                    ? "bg-[#251813] text-[#dfb76c] border border-[#d4af37]/40 font-bold"
                    : "text-[#d6c7b2] hover:bg-[#1c120d]"
                }`}
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                {item.id === "favorites" && favCount > 0 && (
                  <span className="bg-[#8b262d] text-white text-xs px-2 py-0.5 rounded-full border border-[#d4af37]">
                    {favCount}
                  </span>
                )}
              </button>
            );
          })}

          <div className="pt-2">
            <button
              onClick={() => handleNavClick("generator")}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#8b262d] to-[#6d1b21] text-[#fdf6e7] font-semibold text-center flex items-center justify-center gap-2 border border-[#d4af37]/40 shadow-lg"
            >
              <Sparkles className="w-4 h-4 text-[#dfb76c]" />
              <span>✨ পোস্টকার্ড তৈরি করুন (Create Postcard)</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
