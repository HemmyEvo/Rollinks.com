
import { client, urlFor } from '@/lib/sanity'
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

   

   export default async function page(props: {
     params: Promise<{ productId: string }>
   }) { 
  const params = await props.params;
  const data = await getData(params.productId)
  if (!data) return notFound()

  return <ProductPageClient data={data} />
}
