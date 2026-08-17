// Merkezi veri tipleri - siteye ait tüm backend veri modelleri burada tanımlanır.

export type OrderStatus = 'yeni' | 'hazirlaniyor' | 'yolda' | 'teslim-edildi' | 'iptal';
export type MessageStatus = 'yeni' | 'okundu' | 'yanitlandi';
export type FranchiseStatus = 'yeni' | 'inceleniyor' | 'onaylandi' | 'reddedildi';
export type NotificationType = 'siparis' | 'mesaj' | 'bayilik';

export interface OrderItem {
  name: string;
  unitPrice: number;
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  notes: string;
  items: OrderItem[];
  total: number;
  paymentMethod: string;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: MessageStatus;
  createdAt: string;
}

export interface FranchiseApplication {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  investmentBudget: string;
  experience: string;
  message: string;
  status: FranchiseStatus;
  createdAt: string;
}

export interface Notification {
  id: string;
  type: NotificationType;
  refId: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface AdminUser {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryKey: string;
  imageUrl: string; // /uploads/products/xxx.jpg veya boş string (emoji fallback kullanılır)
  emoji: string; // görsel yoksa gösterilecek ikon
  isActive: boolean; // menüde/siparişte görünsün mü
  isPopular: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SiteSettings {
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  city: string;
  instagramUrl: string;
  facebookUrl: string;
  twitterUrl: string;
  workingHoursWeekday: string;
  workingHoursSaturday: string;
  workingHoursSunday: string;
  logoUrl: string;
  heroImageUrl: string;
  heroTitleLine1: string;
  heroTitleLine2: string;
  heroSubtitle: string;
  deliveryTimeText: string;
  minOrderTotal: number;
  freeDeliveryThreshold: number;
  updatedAt: string;
}

export interface DBSchema {
  orders: Order[];
  contactMessages: ContactMessage[];
  franchiseApplications: FranchiseApplication[];
  notifications: Notification[];
  admins: AdminUser[];
  products: Product[];
  settings: SiteSettings;
}
