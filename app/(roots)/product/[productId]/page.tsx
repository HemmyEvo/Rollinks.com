import { client } from '@/lib/sanity'
import ProductPageClient from './ProductPageClient'
import { notFound } from 'next/navigation'
import { fullProduct } from '@/app/interface'


async function getData(slug: string): Promise<fullProduct | null> {
  try {
    const query = `*[
  _type == "product" &&
  slug.current == "${slug}" &&
  inStock == true
][0]{
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
  const params = await props.params
  const data = await getData(params.productId)

  if (!data) {
    return {
      title: 'Product not found - Rollinks',
      description: 'The product you are looking for does not exist.',
      openGraph: {
        title: 'Product not found - Rollinks',
        description: 'The product you are looking for does not exist.',
        url: 'https://rollinks-com.vercel.app',
        images: '/rollinks-logo.jpg',
      },
     
    }
  }

  // Format price with Naira symbol
  const formatPrice = (price:any) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(price).replace('NGN', '₦');
  };

  const price = formatPrice(data.price);
  const originalPrice =  formatPrice(data.price) 

  return {
    title: `${data.name} | ${data.categoryName} - Rollinks`,
    description: `${data.description} | Available for ${price}${originalPrice ? ` (was ${originalPrice})` : ''}`,
    keywords: [
      data.name,
      data.categoryName,
      'skincare',
      'beauty products',
      'Nigeria',
      'Naira',
      'affordable beauty'
    ],
    
}
}
   export default async function page(props: {
     params: Promise<{ productId: string }>

   }) {
     const params = await props.params
    console.log(params)
  const data = await getData(params.productId)
  if (!data) return notFound()

  return <ProductPageClient data={data} />
}