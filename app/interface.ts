export interface simplifiedProduct {
    _id: string;
    name: string;
    slug: string;
    imageUrl: string;
    price: number;
    categoryName: string;
}
interface SanityReference {
  _ref: string;
  _type: 'reference';
}

interface SanityImage {
  _key: string;
  asset: SanityReference;
  alt?: string;
}

interface SeoMetadata {
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
}

interface ProductSpecification {
  key: string;
  value: string;
}

export interface fullProduct {
  _id: string;
  _createdAt?: string;
  _updatedAt?: string;
  name: string;
  slug: string;
  images: SanityImage[];
  price: number;
  originalPrice?: number;
  discountPrice?: number;
  category: SanityReference;
  categoryName: string;
  description: string | any[]; // For portable text
  ingredients?: string[];
  benefits?: string[];
  rating?: number;
  reviewCount?: number;
  isNew?: boolean;
  isBestSeller?: boolean;
  skinType?: ('dry' | 'oily' | 'combination' | 'sensitive' | 'normal')[];
  volume?: string;
  howToUse?: string;
  inStock?: boolean;
  seo?: SeoMetadata;
  specifications?: ProductSpecification[];
  sku?: string;
  brand?: SanityReference;
}