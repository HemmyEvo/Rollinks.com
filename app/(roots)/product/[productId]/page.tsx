import { client } from '@/lib/sanity'
import ProductPageClient from './ProductPageClient'
import { notFound } from 'next/navigation'
import { fullProduct } from '@/app/interface'


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
    }`
    const data = await client.fetch(query)
    return data || null
  } catch (error) {
    console.error('Error fetching product:', error)
    return null
  }
}
   export async function generateMetadata(props: {
     params: Promise<{ productId: string }>
   }) {
  const data = await getData(params.productId)

  if (!data) {
    return {
      title: 'Product not found',
      description: 'The product you are looking for does not exist.'
    }
  }

  return {
    title: data.seo?.metaTitle || data.name,
    description: data.seo?.metaDescription || data.description,
    keywords: data.seo?.keywords,
    openGraph: {
      title: data.seo?.metaTitle || data.name,
      description: data.seo?.metaDescription || data.description,
      images: data.images?.length > 0 ? [
        {
          url: data.images[0],
          width: 800,
          height: 600,
          alt: data.name,
        }
      ] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: data.seo?.metaTitle || data.name,
      description: data.seo?.metaDescription || data.description,
      images: data.images?.length > 0 ? [data.images[0]] : undefined,
    },
  }
}

   export default async function page(props: {
     params: Promise<{ productId: string }>
     
   }) {
  const data = await getData(params.productId)
  if (!data) return notFound()

  return <ProductPageClient data={data} />
}