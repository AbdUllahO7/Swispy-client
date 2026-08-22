const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {}),
    },
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'API request failed');
  }
  return data;
}

export interface ProductOption {
  name: string;
  nameAr?: string;
  price: number;
}

export interface Product {
  _id: string;
  name: string;
  nameAr?: string;
  nameTr?: string;
  description?: string;
  descriptionAr?: string;
  descriptionTr?: string;
  price: number;
  category: { _id: string; name: string; nameAr?: string; nameTr?: string } | string;
  images: string[];
  thumbnail?: string;
  options?: ProductOption[];
  isAvailable: boolean;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  canBeInBox?: boolean;
  slug?: string;
}

export interface Category {
  _id: string;
  name: string;
  nameAr?: string;
  nameTr?: string;
  description?: string;
  descriptionAr?: string;
  descriptionTr?: string;
  isActive: boolean;
  order: number;
}

export interface Box {
  _id: string;
  name: 'FLIRT' | 'SECRET' | 'SIGNATURE' | string;
  nameAr?: string;
  nameTr?: string;
  description?: string;
  descriptionAr?: string;
  descriptionTr?: string;
  size: number;
  price: number;
  image?: string;
  isAvailable: boolean;
  allowCustomSelection: boolean;
}

export interface DeliveryArea {
  _id: string;
  name: string;
  nameAr?: string;
  deliveryFee: number;
  minimumOrder: number;
  estimatedTime: string;
  isActive: boolean;
}

export interface PromoValidation {
  success: boolean;
  code: string;
  discount: number;
  type: 'percentage' | 'fixed';
  value: number;
}

export interface OrderPayload {
  customerInfo: {
    name: string;
    phone: string;
    email?: string;
  };
  items: Array<{
    product?: string;
    box?: string;
    name: string;
    price: number;
    quantity: number;
    selectedOption?: string;
    note?: string;
    customBoxDetails?: {
      size?: number;
      items?: { name: string; quantity: number }[];
      message?: string;
    };
  }>;
  subtotal: number;
  deliveryFee?: number;
  discount?: number;
  promoCode?: string;
  orderType: 'delivery' | 'pickup';
  deliveryArea?: string;
  deliveryAddress?: {
    area?: string;
    street?: string;
    building?: string;
    floor?: string;
    notes?: string;
  };
  deliveryDate?: string;
  deliveryTime?: string;
  pickupDetails?: {
    date?: string;
    time?: string;
  };
  orderNotes?: string;
  paymentMethod: 'online' | 'cash_on_delivery';
}

export interface SpecialOrderPayload {
  type: 'gift' | 'event' | 'custom_box';
  customerInfo: {
    name: string;
    phone: string;
    email?: string;
  };
  giftDetails?: {
    recipientName?: string;
    recipientPhone?: string;
    giftMessage?: string;
    senderName?: string;
    includeCard?: boolean;
    cardDesign?: string;
    includeGiftPackaging?: boolean;
  };
  eventDetails?: {
    eventType?: string;
    eventDate?: string;
    eventTime?: string;
    location?: string;
    guestCount?: number;
    quantity?: number;
    preferredProducts?: string;
    notes?: string;
  };
  customBoxDetails?: {
    boxSize?: number;
    selectedProducts?: Array<{ product: string; quantity: number }>;
    message?: string;
  };
  items?: Array<{
    name: string;
    price: number;
    quantity: number;
    selectedOption?: string;
  }>;
  deliveryAddress?: {
    area?: string;
    street?: string;
    building?: string;
    notes?: string;
  };
  deliveryDate?: string;
  deliveryTime?: string;
  orderType?: 'delivery' | 'pickup';
  subtotal?: number;
  total?: number;
}

export const api = {
  // Products
  getProducts: (params?: { category?: string; featured?: boolean; bestSeller?: boolean; search?: string }) => {
    const q = new URLSearchParams();
    if (params?.category) q.set('category', params.category);
    if (params?.featured) q.set('featured', 'true');
    if (params?.bestSeller) q.set('bestSeller', 'true');
    if (params?.search) q.set('search', params.search);
    return request<{ success: boolean; data: Product[] }>(`/products?${q.toString()}`);
  },
  getProduct: (id: string) => request<{ success: boolean; data: Product }>(`/products/${id}`),

  // Categories
  getCategories: () => request<{ success: boolean; data: Category[] }>('/categories'),

  // Boxes
  getBoxes: () => request<{ success: boolean; data: Box[] }>('/boxes'),

  // Delivery Areas
  getDeliveryAreas: () => request<{ success: boolean; data: DeliveryArea[] }>('/delivery-areas'),

  // Promo codes
  validatePromoCode: (code: string, orderTotal: number) =>
    request<PromoValidation>('/promo-codes/validate', {
      method: 'POST',
      body: JSON.stringify({ code, orderTotal }),
    }),

  // Orders
  createOrder: (payload: OrderPayload) =>
    request<{
      success: boolean;
      data: {
        _id: string;
        orderNumber: string;
        total: number;
        subtotal?: number;
        deliveryFee?: number;
        discount?: number;
        status: string;
      };
    }>('/orders', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  // Special Orders (Gifts, Events, Custom Boxes)
  createSpecialOrder: (payload: SpecialOrderPayload) =>
    request<{ success: boolean; data: { _id: string; orderNumber: string; type: string; status: string } }>('/special-orders', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  // Settings (WhatsApp, Socials, Phone)
  getSettings: () =>
    request<{
      success: boolean;
      data: {
        whatsappNumber: string;
        phone: string;
        email: string;
        instagramUrl: string;
        tiktokUrl: string;
        storeAddress: string;
        currency: string;
        freeDeliveryThreshold: number;
      };
    }>('/settings'),
};

export default api;


