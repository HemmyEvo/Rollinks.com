
import { Metadata } from 'next';
import { client, urlFor } from '@/lib/sanity';
import ProductPageClient from './ProductPageClient';
import { notFound } from 'next/navigation';

interface ProductData {
  _id: string;
  name: string;
  slug: string;
  images: any[];
  description: any;
  price: number;
  discountPrice?: number;
  categoryName: string;
  rating?: number;
  reviewCount?: number;
  isNew?: boolean;
  ingredients?: string[];
  benefits?: string[];
  skinType?: string;
  volume?: string;
  howToUse?: string;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
}

async function getData(slug: string): Promise<ProductData | null> {
  try {
    const query = `*[_type == "product" && slug.current == "${slug}"][0]{
      _id,
      name,
      "slug": slug.current,
      images,
      "description": description,
      price,
      discountPrice,
      "categoryName": category->name,
      rating,
      reviewCount,
      isNew,
      ingredients,
      benefits,
      skinType,
      volume,
      howToUse,
      seo {
        metaTitle,
        metaDescription,
        keywords
      }
    }`;
    const data = await client.fetch(query);
    if (!data) throw new Error('Product not found');
    return data;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

export async function generateMetadata({ params }: { params: { productId: string } }): Promise<Metadata> {
  const data = await getData(params.productId);
  if (!data) return {};

  const hasDiscount = data.discountPrice && data.discountPrice < data.price;
  const discount = hasDiscount ? Math.round(((data.price - data.discountPrice) / data.price) * 100) : 0;

  return {
    title: data.seo?.metaTitle || `${data.name} | Rollinks Skincare`,
    description: data.seo?.metaDescription || 
      `Discover ${data.name} - ${data.categoryName} product${hasDiscount ? ` now at ${discount}% off` : ''}. ${
        data.description ? data.description[0]?.children[0]?.text.substring(0, 150) : ''
      }...`,
    keywords: data.seo?.keywords?.join(', ') || 
      `${data.name}, ${data.categoryName}, skincare, beauty, ${data.ingredients?.join(', ') || ''}`,
    openGraph: {
      title: data.seo?.metaTitle || `${data.name} | Rollinks Skincare`,
      description: data.seo?.metaDescription || 
        `Discover ${data.name} - ${data.categoryName} product${hasDiscount ? ` now at ${discount}% off` : ''}. ${
          data.description ? data.description[0]?.children[0]?.text.substring(0, 150) : ''
        }...`,
      images: data.images?.[0] ? [{ url: urlFor(data.images[0]).url() }] : [],
      type: 'product',
    },
    other: {
      'product:price:amount': (data.discountPrice ?? data.price).toString(),
      'product:price:currency': 'NGN',
      ...(hasDiscount && {
        'product:sale_price:amount': data.discountPrice!.toString(),
      }),
    },
  };
}

interface ProductPageProps {
  params: {
    productId: string;
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const data = await getData(params.productId);
  if (!data) return notFound();

  return <ProductPageClient data={data} />;
}