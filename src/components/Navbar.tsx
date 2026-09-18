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

  const navItems: { id: ActivePage; label: string; icon: React.ReactNode }[] = [
    { id: "home", label: "Home", icon: <Home className="w-4 h-4" /> },
    { id: "postcards", label: "Postcards", icon: <Mail className="w-4 h-4" /> },
    { id: "poetry", label: "Poetry", icon: <BookOpen className="w-4 h-4" /> },
    {
      id: "gallery",
      label: "Vintage Gallery",
      icon: <ImageIcon className="w-4 h-4" />,
    },
    { id: "categories", label: "Categories", icon: <Grid className="w-4 h-4" /> },
    {
      id: "favorites",
      label: "Favorites",
      icon: (
        <span className="relative">
          <Heart className="w-4 h-4 text-[#e05252]" />
          {favCount > 0 && (
            <span className="absolute -top-2 -right-2.5 bg-[#8b262d] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center border border-[#d4af37]">
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
    <header className="sticky top-0 z-40 w-full bg-[#0e0a08]/90 backdrop-blur-md border-b border-[#d4af37]/20 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo & Brand */}
          <button
            onClick={() => handleNavClick("home")}
            className="flex items-center gap-2.5 text-left group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#221612] border border-[#d4af37]/40 flex items-center justify-center text-xl shadow-inner group-hover:border-[#d4af37] transition-all">
              💌
            </div>
            <div>
              <span className="text-lg sm:text-xl font-bold font-serif tracking-tight text-[#fdf6e7] flex items-center gap-1">
                Universal Poetry Vibe
              </span>
              <span className="block text-[10px] text-[#c5a059] font-bengali-sans tracking-wide">
                পুরনো দিনের অনুভূতি, আজকের ভালোবাসার জন্য
              </span>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navItems.map((item) => {
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                    isActive
                      ? "bg-[#251813] text-[#dfb76c] border border-[#d4af37]/40 shadow-sm"
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
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={onOpenSearch}
              className="p-2.5 rounded-lg bg-[#19110d] border border-[#d4af37]/30 text-[#d1c4b2] hover:text-white hover:border-[#d4af37] transition-all"
              title="খুঁজুন (Search)"
              aria-label="উক্তি বা পোস্টকার্ড খুঁজুন"
            >
              <Search className="w-4 h-4" />
            </button>

            <button
              onClick={() => handleNavClick("generator")}
              className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#8b262d] via-[#a83232] to-[#7c1d24] text-[#fdf6e7] text-sm font-semibold shadow-md hover:shadow-[#8b262d]/40 border border-[#d4af37]/40 transition-all transform active:scale-95 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-[#dfb76c]" />
              <span>✨ Create Postcard</span>
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
