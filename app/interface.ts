export interface simplifiedProduct {
    _id: string;
    name: string;
    slug: string;
    imageUrl: string;
    price: number;
    categoryName: string;
}
export interface ProductImage {
  _key: string;
  asset: {
    _ref: string;
    _type: string;
  };
  alt?: string;
}

export interface SEO {
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
}

export interface CategoryReference {
  _ref: string;
  _type: string;
  name?: string; // This would be populated when using the 'category.name' in your preview
}

export interface fullProduct {
  _id: string;
  _type: 'product';
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  name: string;
  slug: {
    _type: 'slug';
    current: string;
  };
  images: string[];
  price: number;
  discountPrice: number;
  category: CategoryReference;
  categoryName?: string; // This would be populated when joining data
  description: any[]; // Array of block content or images
  ingredients?: string[];
  benefits?:string[];
  rating?: number;
  isNew: boolean;
  reviewCount: number;
  isBestSeller: boolean;
  skinType?: string[];
  volume?: string;
  howToUse?: string;
  inStock: boolean;
  seo?: SEO;
}

export interface Order {
  _id: string;
  orderId: string;
  status: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  shippingAddress: any; // Replace with proper type if possible
  items: Array<{
    _key: string;
    name: string;
    price: number;
    quantity: number;
    currency: string;
    image: string;
    product: {
      _id: string;
      name: string;
      slug: string;
    };
  }>;
  payment: {
    method: string;
    status: string;
    transactionId: string;
    amount: number;
    currency: string;
  };
  shipping?: {
    method?: string;
    cost?: number;
    trackingNumber?: string;
    carrier?: string;
  };
  subtotal: number;
  total: number;
  discount: number;
  createdAt: string;
  updatedAt: string;
}