export enum Category {
  Tops = 'tops',
  Bottoms = 'bottoms',
  Outerwear = 'outerwear',
  Footwear = 'footwear',
  Accessories = 'accessories'
}

export enum Season {
  Spring = 'spring',
  Summer = 'summer',
  Autumn = 'autumn',
  Winter = 'winter'
}

export enum ItemStatus {
  InWardrobe = 'in_wardrobe',
  ToWash = 'to_wash',
  AtTailor = 'at_tailor',
  DryCleaning = 'dry_cleaning'
}

export interface ItemImage {
  id: string;
  itemId: string;
  imageUrl: string;
  label?: string;
  sortOrder: number;
  isPrimary: boolean;
  createdAt: string;
}

export interface ClothingItem {
  id: string;
  name: string;
  category: Category;
  subCategory?: string; // e.g., "Hoodie", "Jeans"
  imageUrl: string;
  brand?: string;
  size?: string;
  material?: string;
  purchaseDate?: string;
  lastWorn?: string;
  status: ItemStatus;
  tags: string[]; // e.g., "Casual", "Cotton"
  price?: number;
  cpw?: number; // Cost Per Wear
  wearCount?: number;
  season?: Season | string;
  images?: ItemImage[];
}

export interface Outfit {
  id: string;
  title: string;
  date?: string; // ISO date string
  time?: string;
  occasion: string;
  season?: string;
  items: ClothingItem[];
  status: 'planned' | 'completed';
}

export interface ImportRecord {
  id: string;
  title: string;
  source: string; // e.g., "Taobao", "Zara"
  orderId?: string;
  date: string;
  price: number;
  status: 'parsed' | 'parsing' | 'review_needed' | 'imported';
  imageUrl: string;
}

export interface WalletStat {
  totalItems: number;
  totalValue: number;
  avgPrice: number;
  monthlyTrend: { month: string; amount: number }[];
}

export interface WardrobeStats {
  totalItems: number;
  totalValue: number;
  avgPrice: number;
  spendingTrend: { name: string; amount: number }[];
  mostWorn: ClothingItem[];
  leastWorn: ClothingItem[];
  categoryData: { name: string; value: number }[];
}