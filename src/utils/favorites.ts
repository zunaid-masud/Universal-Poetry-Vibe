import { FavoriteItems } from "../types";

const FAVORITES_STORAGE_KEY = "universal_poetry_vibe_favorites_v1";

const DEFAULT_FAVORITES: FavoriteItems = {
  postcards: ["vp001", "vp004"],
  quotes: ["q001", "q004", "q006"],
  gallery: ["g001", "g004"],
};

export const getStoredFavorites = (): FavoriteItems => {
  if (typeof window === "undefined") return DEFAULT_FAVORITES;
  try {
    const raw = localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(DEFAULT_FAVORITES));
      return DEFAULT_FAVORITES;
    }
    const parsed = JSON.parse(raw);
    return {
      postcards: Array.isArray(parsed.postcards) ? parsed.postcards : DEFAULT_FAVORITES.postcards,
      quotes: Array.isArray(parsed.quotes) ? parsed.quotes : DEFAULT_FAVORITES.quotes,
      gallery: Array.isArray(parsed.gallery) ? parsed.gallery : DEFAULT_FAVORITES.gallery,
    };
  } catch {
    return DEFAULT_FAVORITES;
  }
};

export const saveFavorites = (favs: FavoriteItems): void => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favs));
    window.dispatchEvent(new CustomEvent("uv_favorites_updated", { detail: favs }));
  } catch (err) {
    console.error("Failed to save favorites to localStorage", err);
  }
};

export const toggleFavoritePostcard = (id: string): boolean => {
  const current = getStoredFavorites();
  const exists = current.postcards.includes(id);
  const updated: FavoriteItems = {
    ...current,
    postcards: exists
      ? current.postcards.filter((item) => item !== id)
      : [...current.postcards, id],
  };
  saveFavorites(updated);
  return !exists;
};

export const toggleFavoriteQuote = (id: string): boolean => {
  const current = getStoredFavorites();
  const exists = current.quotes.includes(id);
  const updated: FavoriteItems = {
    ...current,
    quotes: exists
      ? current.quotes.filter((item) => item !== id)
      : [...current.quotes, id],
  };
  saveFavorites(updated);
  return !exists;
};

export const toggleFavoriteGallery = (id: string): boolean => {
  const current = getStoredFavorites();
  const exists = current.gallery.includes(id);
  const updated: FavoriteItems = {
    ...current,
    gallery: exists
      ? current.gallery.filter((item) => item !== id)
      : [...current.gallery, id],
  };
  saveFavorites(updated);
  return !exists;
};

export const isFavoriteItem = (
  type: "postcard" | "quote" | "gallery",
  id: string,
  current?: FavoriteItems
): boolean => {
  const favs = current || getStoredFavorites();
  if (type === "postcard") return favs.postcards.includes(id);
  if (type === "quote") return favs.quotes.includes(id);
  if (type === "gallery") return favs.gallery.includes(id);
  return false;
};
