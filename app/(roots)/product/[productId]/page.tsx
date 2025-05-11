import { client } from '@/lib/sanity';
import ProductPageClient from './ProductPageClient';
import { notFound } from 'next/navigation';
import { fullProduct } from '@/app/interface';
import { Metadata, ResolvingMetadata } from 'next';

async function getData(slug: string): Promise<fullProduct | null> {
  try {
    const query = `*[_type == "product" && slug.current == "${slug}"][0]{
      _id,
      name,
      "slug": slug.current,
      images,
      description,
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
    return data || null;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

type Props = {
  params: { productId: string };
  searchParams: Record<string, string | string[] | undefined>;
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const data = await getData(params.productId);

  if (!data) {
    return {
      title: 'Product Not Found',
      description: 'The product you are looking for does not exist.',
    };
  }

  const previousMetadata = await parent;

  return {
    title: data.seo?.metaTitle || data.name,
    description: data.seo?.metaDescription || data.description,
    keywords: data.seo?.keywords,
    openGraph: {
      ...previousMetadata.openGraph,
      title: data.seo?.metaTitle || data.name,
      description: data.seo?.metaDescription || data.description,
      images: data.images?.length > 0
        ? [
            {
              url: data.images[0],
              width: 800,
              height: 600,
              alt: data.name,
            },
          ]
        : undefined,
    },
    twitter: {
      ...previousMetadata.twitter,
      card: 'summary_large_image',
      title: data.seo?.metaTitle || data.name,
      description: data.seo?.metaDescription || data.description,
      images: data.images?.length > 0 ? [data.images[0]] : undefined,
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const data = await getData(params.productId);
  if (!data) return notFound();

  return <ProductPageClient data={data} />;
}