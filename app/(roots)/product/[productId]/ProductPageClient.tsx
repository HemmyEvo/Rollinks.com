'use client';

import { fullProduct } from '@/app/interface';
import { urlFor } from '@/lib/sanity';
import React from 'react';
import { CheckCircle, Star, Truck, ChevronRight, Leaf, Share2, Copy } from 'lucide-react';
import { useShoppingCart } from 'use-shopping-cart';
import { motion } from 'framer-motion';
import Loading from '@/components/ui/Loading';
import Image from 'next/image';
import { PortableText } from '@portabletext/react';
import Link from 'next/link';
import { portableTextComponents } from '@/lib/portableTextComponent';

type CartProduct = {
  name: string;
  description: string;
  price: number;
  currency: string;
  image: string;
  quantity: number;
  id: string;
  sku: string;
};

export default function ProductPageClient({ data }: { data: fullProduct }) {
  const [quantity, setQuantity] = React.useState(1);
  const [addMessage, setAddMessage] = React.useState('Add to cart');
  const { addItem, incrementItem, setItemQuantity, cartDetails } = useShoppingCart();
  const [activeImage, setActiveImage] = React.useState(0);
  const [isShareOpen, setIsShareOpen] = React.useState(false);
  const [isCopied, setIsCopied] = React.useState(false);

  const handleAddToCart = (item: fullProduct) => {
    setAddMessage('Added');
    const image = urlFor(item.images[0]).url();

    const product: CartProduct = {
      name: item.name,
      description: item.description[0]?.children[0]?.text || item.name,
      price: item.discountPrice ?? item.price,
      currency: 'NGN',
      image: image,
      quantity: quantity,
      id: item._id,
      sku: item._id
    };

    if (cartDetails && cartDetails[item._id]) {
      incrementItem(item._id, { count: quantity });
    } else {
      addItem(product);
      setItemQuantity(item._id, quantity);
    }

    setTimeout(() => setAddMessage('Add to cart'), 2000);
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: data?.name,
          text: `Check out this product: ${data?.name}`,
          url: window.location.href,
        });
      } else {
        setIsShareOpen(true);
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
      const textArea = document.createElement('textarea');
      textArea.value = window.location.href;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  function validatePortableText(content: any) {
    if (!content) return [];
    if (Array.isArray(content)) return content;
    return [];
  }

  if (!data) return <Loading />;

  const hasDiscount = data.discountPrice && data.discountPrice < data.price;
  const finalPrice = hasDiscount ? data.discountPrice! : data.price;
  const discount = hasDiscount ? Math.round(((data.price - data.discountPrice!) / data.price) * 100) : 0;

  
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/30 to-purple-50/30 py-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
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

          <article className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg flex flex-col">
            <div className="flex justify-end mb-2 relative">
              <button 
                onClick={handleShare}
                className="p-2 text-gray-500 hover:text-blue-600 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Share product"
              >
                <Share2 className="w-5 h-5" />
              </button>

              {isShareOpen && (
                <div className="absolute top-10 right-0 bg-white rounded-lg shadow-lg p-2 z-10 border border-gray-200">
                  <button
                    onClick={copyToClipboard}
                    className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 rounded w-full text-left"
                  >
                    <Copy className="w-4 h-4" />
                    {isCopied ? 'Copied!' : 'Copy link'}
                  </button>
                </div>
              )}
            </div>

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

            <h1 className="text-3xl font-bold text-gray-900 mb-2">{data.name}</h1>

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

            {data.volume && (
              <div className="mb-4">
                <span className="text-sm text-gray-500">Size: </span>
                <span className="text-sm font-medium">{data.volume}</span>
              </div>
            )}

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

            <div className="flex items-center gap-3 p-4 bg-blue-50/50 rounded-lg mb-6">
              <Truck className="text-blue-500" />
              <div>
                <p className="text-sm font-medium">Free delivery</p>
                <p className="text-xs text-gray-500">Estimated 1-2 business days</p>
              </div>
            </div>

            <div className="prose prose-sm text-gray-600 mb-6">
              <PortableText
                value={validatePortableText(data.description)}
                components={portableTextComponents}
              />
            </div>

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

            {data.howToUse && (
              <div className="mt-auto pt-4 border-t border-gray-100">
                <h2 className="font-medium text-gray-900 mb-2">How To Use</h2>
                <p className="text-sm text-gray-600">{data.howToUse}</p>
              </div>
            )}
          </article>
        </div>

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
  );
                  }
