export type CategoryId =
  | "all"
  | "love"
  | "romantic"
  | "heartbreak"
  | "missing"
  | "rain"
  | "night"
  | "love_letter"
  | "proposal"
  | "birthday"
  | "anniversary"
  | "one_sided"
  | "memories"
  | "classic_vintage"
  | "bengali_vintage";

export interface Category {
  id: CategoryId;
  nameBn: string;
  nameEn: string;
  icon: string;
  description: string;
}

export type BorderStyle =
  | "vintage_gold"
  | "postage_stamp"
  | "classic_double"
  | "ornate_royal"
  | "dashed_ticket"
  | "minimal_film"
  | "none";

export type VintageEffectType =
  | "original"
  | "sepia"
  | "old_paper"
  | "faded"
  | "black_and_white"
  | "film_grain"
  | "dust_scratches"
  | "coffee_stain"
  | "warm_vintage";

export type AspectRatioType =
  | "postcard" // 3:2 / 4:3 landscape or classic
  | "square" // 1:1 Instagram
  | "story" // 9:16 Instagram / Facebook Story
  | "facebook" // 1.91:1 / 16:9 Facebook Post
  | "status"; // 9:16 WhatsApp Status

export type FontFamilyType =
  | "Noto Serif Bengali"
  | "Galada"
  | "Hind Siliguri"
  | "Tiro Bangla"
  | "Anek Bangla"
  | "Special Elite"
  | "Playfair Display"
  | "Cormorant Garamond"
  | "Cinzel"
  | "Alex Brush";

export type TextPositionType =
  | "center"
  | "bottom_heavy"
  | "top_heavy"
  | "letter_split"
  | "card_floating"
  | "left_aligned";

export interface PostcardStyle {
  fontFamily: FontFamilyType;
  fontSize: number; // in px or scale
  textColor: string;
  position: TextPositionType;
  isBold?: boolean;
  isItalic?: boolean;
  textAlign?: "left" | "center" | "right";
  letterSpacing?: number; // em / px
  lineHeight?: number;
  showStamp?: boolean;
  stampType?: "vintage_rose" | "postmark" | "wax_seal" | "airmail";
  borderStyle?: BorderStyle;
}

export interface PostcardTemplate {
  id: string;
  title: string;
  titleBn: string;
  category: CategoryId;
  categoryBn: string;
  image: string;
  defaultQuote: string;
  defaultRecipient?: string;
  defaultSender?: string;
  defaultDate?: string;
  style: PostcardStyle;
  badge?: "জনপ্রিয়" | "নতুন" | "ক্লাসিক" | "রোমান্টিক" | "বৃষ্টি";
  tags: string[];
}

export interface QuoteItem {
  id: string;
  text: string;
  author?: string;
  category: CategoryId;
  categoryBn: string;
  tags: string[];
}

export interface GalleryItem {
  id: string;
  title: string;
  image: string;
  category: CategoryId;
  categoryBn: string;
  quoteText: string;
  author?: string;
  tags: string[];
}

export interface PostcardCustomData {
  templateId: string;
  recipient: string;
  quoteText: string;
  sender: string;
  date: string;
  style: PostcardStyle;
  effect: VintageEffectType;
  aspectRatio: AspectRatioType;
}

export type ActivePage =
  | "home"
  | "postcards"
  | "poetry"
  | "gallery"
  | "categories"
  | "favorites"
  | "generator";

export interface FavoriteItems {
  postcards: string[]; // ids
  quotes: string[]; // ids
  gallery: string[]; // ids
}
