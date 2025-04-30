'use client';

import { fullProduct } from '@/app/interface';
import { client, urlFor } from '@/lib/sanity';
import React from 'react';
import { useParams } from 'next/navigation';
import { CheckCircle, Star, Truck, ChevronRight, Leaf } from 'lucide-react';
import { useShoppingCart } from 'use-shopping-cart';
import { motion } from 'framer-motion';
import Loading from '@/components/ui/Loading';
import Image from 'next/image';
import { PortableText } from '@portabletext/react';
import Head from 'next/head';
import Link from 'next/link'
import { portableTextComponents } from '@/lib/portableTextComponents';
async function getData(slug: string) {
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
  return await client.fetch(query);
}

export default function ProductPage() {
  const params = useParams();
  const [quantity, setQuantity] = React.useState(1);
  const [addMessage, setAddMessage] = React.useState('Add to cart');
  const { addItem, incrementItem, setItemQuantity, cartDetails } = useShoppingCart();
  const [data, setData] = React.useState<fullProduct | null>(null);
  const [activeImage, setActiveImage] = React.useState(0);

  const handleAddToCart = (item: any) => {
    console.log(item._id)
    setAddMessage('Added');
    const image = urlFor(item.images[0]).url();

    const product = {
      name: item.name,
      description: item.description,
      price: item.discountPrice ?? item.price,
      currency: 'NGN',
      image: image,
      quantity: quantity,
      id: item._id.toString(),
      sku: item._id.toString()
    };
   

    if (cartDetails && cartDetails[item._id]) {
      incrementItem(item._id, { count: quantity });
    } else {
      addItem(product);
      setItemQuantity(item._id, quantity);
    }

    setTimeout(() => setAddMessage('Add to cart'), 2000);
  };
function validatePortableText(content: any) {
  if (!content) return [];
  if (Array.isArray(content)) return content;
  return [];
}

  React.useEffect(() => {
    async function fetchData() {
      const productData = await getData(params.productId as string);
      setData(productData);
    }
    fetchData();
  }, [params.productId]);

  if (!data) return <Loading />;

  const hasDiscount = data.discountPrice && data.discountPrice < data.price;
  const finalPrice = hasDiscount ? data.discountPrice! : data.price;
  const discount = hasDiscount
    ? Math.round(((data.price - data.discountPrice!) / data.price) * 100)
    : 0;

  // SEO metadata
  const metaTitle = data.seo?.metaTitle || `${data.name} | Rollinks Skincare`;
  const metaDescription = data.seo?.metaDescription || 
    `Discover ${data.name} - ${data.categoryName} product${hasDiscount ? ` now at ${discount}% off` : ''}. ${data.description ? data.description[0]?.children[0]?.text.substring(0, 150) : ''}...`;
  const metaKeywords = data.seo?.keywords?.join(', ') || 
    `${data.name}, ${data.categoryName}, skincare, beauty, ${data.ingredients?.join(', ') || ''}`;

  return (
    <>
      <Head>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
        <meta name="keywords" content={metaKeywords} />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDescription} />
        {data.images?.[0] && (
          <meta property="og:image" content={urlFor(data.images[0]).url()} />
        )}
        <meta property="og:type" content="product" />
        <meta property="product:price:amount" content={finalPrice.toString()} />
        <meta property="product:price:currency" content="NGN" />
        {hasDiscount && (
          <meta property="product:sale_price:amount" content={data.discountPrice!.toString()} />
        )}
      </Head>

      <div className="min-h-screen bg-gradient-to-b from-blue-50/30 to-purple-50/30 py-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumbs with structured data */}
          <nav aria-label="Breadcrumb" className="flex items-center text-sm text-gray-600 mb-6">
            <ol className="flex items-center space-x-2">
              <li>
                <Link href="/" className="hover:text-blue-600">Home</Link>
              </li>
              <ChevronRight className="h-4 w-4" />
              <li>
                <Link href="/products" className="hover:text-blue-600">Products</Link>
              </li>
              <ChevronRight className="h-4 w-4" />
              <li aria-current="page" className="text-blue-600">
                {data.name}
              </li>
            </ol>
          </nav>

          <div className="grid md:grid-cols-2 gap-8 md:gap-12">
            {/* Image Gallery */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/20 shadow-lg">
              <div className="relative aspect-square w-full">
                {data.images?.[activeImage] && (
                  <Image
                    src={urlFor(data.images[activeImage]).url()}
                    alt={data.name}
                    fill
                    className="object-contain p-4"
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                )}
              </div>
              <div className="grid grid-cols-4 gap-2 p-4 border-t border-white/20">
                {data.images?.map((image: any, index: number) => (
                  <button
                    key={index}
                    onClick={() => setActiveImage(index)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      activeImage === index ? 'border-blue-500' : 'border-transparent'
                    }`}
                  >
                    <Image
                      src={urlFor(image).url()}
                      alt={`${data.name} thumbnail ${index + 1}`}
                      width={100}
                      height={100}
                      className="object-cover w-full h-full"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <article className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg flex flex-col">
              {/* Category and Badges */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-blue-600">{data.categoryName}</span>
                <div className="flex gap-2">
                  {data.isNew && (
                    <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                      New
                    </span>
                  )}
                  {discount > 0 && (
                    <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
                      -{discount}%
                    </span>
                  )}
                </div>
              </div>

              {/* Product Name */}
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{data.name}</h1>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center bg-amber-100 text-amber-800 px-2 py-1 rounded-full">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="ml-1 text-sm font-medium">
                    {data.rating?.toFixed(1) || '4.5'}
                  </span>
                </div>
                <span className="text-sm text-gray-500">
                  {data.reviewCount || '24'} reviews
                </span>
              </div>

              {/* Price */}
              <div className="my-4" itemScope itemType="http://schema.org/Offer" itemProp="offers">
                <div className="flex items-end gap-3">
                  <span className="text-3xl font-bold text-gray-900" itemProp="price">
                    ₦{finalPrice.toLocaleString()}
                  </span>
                  {hasDiscount && (
                    <span className="text-lg text-gray-500 line-through">
                      ₦{data.price.toLocaleString()}
                    </span>
                  )}
                </div>
                {discount > 0 && (
                  <span className="text-sm text-green-600">
                    You save ₦{(data.price - finalPrice).toLocaleString()} ({discount}%)
                  </span>
                )}
                <meta itemProp="priceCurrency" content="NGN" />
                <link itemProp="availability" href="http://schema.org/InStock" />
              </div>

              {/* Volume */}
              {data.volume && (
                <div className="mb-4">
                  <span className="text-sm text-gray-500">Size: </span>
                  <span className="text-sm font-medium">{data.volume}</span>
                </div>
              )}

              {/* Skin Types */}
              {data.skinType && data.skinType.length > 0 && (
                <div className="mb-4">
                  <span className="text-sm text-gray-500">Recommended for: </span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {data.skinType.map((type, i) => (
                      <span key={i} className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                        {type}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity and Add to Cart */}
              <div className="mt-4 mb-6">
                <div className="flex items-center gap-4">
                  <div className="flex items-center bg-white rounded-full border border-gray-200 overflow-hidden">
                    <button
                      onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                      className="px-3 py-2 text-gray-600 hover:bg-gray-50 transition-colors"
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={quantity}
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        if (!isNaN(value)) setQuantity(Math.max(1, Math.min(100, value)));
                      }}
                      className="w-12 text-center border-x border-gray-200 py-2 outline-none"
                      aria-label="Quantity"
                    />
                    <button
                      onClick={() => setQuantity(prev => Math.min(100, prev + 1))}
                      className="px-3 py-2 text-gray-600 hover:bg-gray-50 transition-colors"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>

                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleAddToCart(data)}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-blue-500 text-white px-6 py-3 rounded-full font-medium shadow-md hover:shadow-lg transition-all"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <span>{addMessage}</span>
                      {addMessage === 'Added' && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring' }}
                        >
                          <CheckCircle className="h-5 w-5" />
                        </motion.span>
                      )}
                    </div>
                  </motion.button>
                </div>
              </div>

              {/* Delivery Info */}
              <div className="flex items-center gap-3 p-4 bg-blue-50/50 rounded-lg mb-6">
                <Truck className="text-blue-500" />
                <div>
                  <p className="text-sm font-medium">Free delivery</p>
                  <p className="text-xs text-gray-500">Estimated 1-2 business days</p>
                </div>
              </div>

              {/* Description */}
              <div className="prose prose-sm text-gray-600 mb-6">
                <PortableText 
  value={validatePortableText(data.description)} 
  components={portableTextComponents}
/>
              </div>

              {/* Ingredients */}
              {data.ingredients && data.ingredients.length > 0 && (
                <div className="mb-6">
                  <h2 className="font-medium text-gray-900 mb-2">Key Ingredients</h2>
                  <div className="flex flex-wrap gap-2">
                    {data.ingredients.map((ingredient, i) => (
                      <span key={i} className="px-3 py-1.5 bg-white rounded-full text-sm shadow-sm border border-gray-100">
                        {ingredient}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* How to Use */}
              {data.howToUse && (
                <div className="mt-auto pt-4 border-t border-gray-100">
                  <h2 className="font-medium text-gray-900 mb-2">How To Use</h2>
                  <p className="text-sm text-gray-600">{data.howToUse}</p>
                </div>
              )}
            </article>
          </div>

          {/* Benefits */}
          {data.benefits && data.benefits.length > 0 && (
            <section className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <h2 className="sr-only">Product Benefits</h2>
              {data.benefits.map((benefit, i) => (
                <motion.div
                  key={i}
                  whileHover={{ y: -5 }}
                  className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-white/20 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100/50 rounded-full">
                      <Leaf className="h-5 w-5 text-blue-600" />
                    </div>
                    <h3 className="font-medium text-gray-900">{benefit}</h3>
                  </div>
                </motion.div>
              ))}
            </section>
          )}
        </div>
      </div>

      {/* Structured data for SEO */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Product",
          "name": data.name,
          "description": metaDescription,
          "brand": {
            "@type": "Brand",
            "name": "Rollinks"
          },
          "image": data.images?.map(img => urlFor(img).url()),
          "offers": {
            "@type": "Offer",
            "price": finalPrice,
            "priceCurrency": "NGN",
            "priceValidUntil": new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString().split('T')[0],
            "itemCondition": "https://schema.org/NewCondition",
            "availability": "https://schema.org/InStock"
          },
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": data.rating || 4.5,
            "reviewCount": data.reviewCount || 24
          }
        })}
      </script>
    </>
  );
}