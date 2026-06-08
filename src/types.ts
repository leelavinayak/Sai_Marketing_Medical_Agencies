export interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  image: string;
  price?: string; // e.g. "Wholesale Pricing" or price range
  inStock: boolean;
  isFeatured: boolean;
  packSize?: string; // e.g. "Box of 100", "5 Litres", etc.
  manufacturer?: string;
  chemicalFormula?: string; // Optional for chemical products
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string; // e.g. "medical-supplies"
  description: string;
  image: string;
}

export interface Inquiry {
  id: string;
  name: string;
  phone: string;
  email: string;
  companyName: string;
  message: string;
  products: {
    productId: string;
    productName: string;
    quantity: number;
  }[];
  status: 'pending' | 'reviewed' | 'completed' | 'delivered' | 'rejected';
  adminNotes?: string;
  callingConfirmed?: boolean;
  createdAt: string;
}

export interface GalleryImage {
  id: string;
  url: string;
  title: string;
  category: string; // e.g. "Office", "Products", "Warehouse"
  createdAt: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  feedback: string;
  rating: number; // 1-5
  createdAt: string;
}

export interface CompanySettings {
  companyName: string;
  ownerName: string;
  phone: string;
  email: string;
  address: string;
  whatsappNumber: string;
  facebookUrl?: string;
  twitterUrl?: string;
  linkedinUrl?: string;
  officeHours: string;
  announcement?: string;
}

export interface DashboardStats {
  totalProducts: number;
  totalCategories: number;
  totalInquiries: number;
  totalGalleryImages: number;
  pendingInquiries: number;
  totalCustomers?: number;
  totalOrders?: number;
  pendingOrders?: number;
  deliveredOrders?: number;
  totalTestimonials?: number;
}

export interface CustomerUser {
  id: string;
  name: string;
  phone: string;
  password?: string;
  companyName?: string;
  email?: string;
  createdAt: string;
}

