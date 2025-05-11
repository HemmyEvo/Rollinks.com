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
      twitter: {
        card: 'summary',
        title: 'Product not found - Rollinks',
        description: 'The product you are looking for does not exist.',
        images: '/rollinks-logo.jpg',
      }
    }
  }

  // Format price with Naira symbol
  const formatPrice = (price:any) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(price).replace('NGN', '₦');
  };

  const price = formatPrice(data.discountPrice || data.price);
  const originalPrice = data.discountPrice ? formatPrice(data.price) : null;

  return {
    title: `${data.name} | ${data.categoryName} - Rollinks`,
    description: `${data.description} | Available for ${price}${originalPrice ? ` (was ${originalPrice})` : ''}`,
    keywords: [
      data.name,
      data.categoryName,
      ...(data.skinType ? data.skinType.split(',') : []),
      ...(data.ingredients ? data.ingredients.split(',') : []),
      'skincare',
      'beauty products',
      'Nigeria',
      'Naira',
      'affordable beauty'
    ],
    openGraph: {
      title: `${data.name} | ${data.categoryName} - Rollinks`,
      description: `${data.description} | Available for ${price}${originalPrice ? ` (was ${originalPrice})` : ''}`,
      type: 'product',
      url: `https://rollinks-com.vercel.app/products/${data.slug}`,
      images: data.images?.map(image => ({
        url: image,
        alt: data.name,
      })),
      siteName: 'Rollinks Beauty',
      ...(originalPrice && {
        price: {
          amount: data.discountPrice,
          currency: 'NGN',
          originalAmount: data.price,
        },
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title: `${data.name} | ${data.categoryName} - Rollinks`,
      description: `${data.description} | Now ${price}${originalPrice ? ` (was ${originalPrice})` : ''}`,
      images: data.images?.length > 0 ? data.images[0] : '/rollinks-logo.jpg',
    },
    alternates: {
      canonical: `https://rollinks-com.vercel.app/products/${data.slug}`,
    },
    other: {
      'product:price:amount': data.discountPrice || data.price,
      'product:price:currency': 'NGN',
      'product:brand': 'Rollinks',
      'product:availability': 'in stock',
      'product:condition': data.isNew ? 'new' : 'refurbished',
      'product:retailer_item_id': data._id,
      ...(originalPrice && {
        'product:original_price:amount': data.price,
        'product:original_price:currency': 'NGN',
      }),
    }
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