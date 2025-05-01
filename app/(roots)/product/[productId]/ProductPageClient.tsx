'use client';

import { fullProduct } from '@/app/interface';
import { urlFor } from '@/lib/sanity';
import React, { useState, useRef, useEffect } from 'react';
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
      description: item.description?.[0]?.children?.[0]?.text || item.name,
      price: item.discountPrice ?? item.price,
      currency: 'NGN',
      image,
      quantity,
      id: item._id,
      sku: item._id,
    };

    if (cartDetails?.[item._id]) {
      incrementItem(item._id, { count: quantity });
    } else {
      addItem(product);
      setItemQuantity(item._id, quantity);
    }

    setTimeout(() => setAddMessage('Add to cart'), 2000);
  };

  const handleShare = () => {
    setIsShareOpen((prev) => !prev);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const validatePortableText = (content: any) => {
    return Array.isArray(content) ? content : [];
  };

  if (!data) return <Loading />;

  const hasDiscount = data.discountPrice && data.discountPrice < data.price;
  const finalPrice = hasDiscount ? data.discountPrice : data.price;
  const discount = hasDiscount
    ? Math.round(((data.price - data.discountPrice!) / data.price) * 100)
    : 0;

const [activeImage, setActiveImage] = useState(0);
  const [zoomState, setZoomState] = useState({
    isActive: false,
    position: { x: 50, y: 50 },
    scale: 2,
    isDragging: false,
    dragStart: { x: 0, y: 0 }
  });
  
  const imageRef = useRef<HTMLDivElement>(null);
  const zoomRef = useRef<HTMLDivElement>(null);
  const thumbnailsRef = useRef<HTMLDivElement>(null);
  const zoomLensRef = useRef<HTMLDivElement>(null);

  // Handle mouse enter/leave
  const handleMouseEnter = () => {
    setZoomState(prev => ({ ...prev, isActive: true }));
  };

  const handleMouseLeave = () => {
    setZoomState(prev => ({ ...prev, isActive: false }));
  };

  // Handle mouse movement for zoom effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current || !zoomLensRef.current) return;

    const { left, top, width, height } = imageRef.current.getBoundingClientRect();
    let x = ((e.clientX - left) / width) * 100;
    let y = ((e.clientY - top) / height) * 100;

    // Boundary checks
    x = Math.max(0, Math.min(100, x));
    y = Math.max(0, Math.min(100, y));

    setZoomState(prev => ({
      ...prev,
      position: { x, y }
    }));
  };

  // Handle touch movement for mobile zoom
  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!imageRef.current || !zoomLensRef.current || !e.touches[0]) return;

    const { left, top, width, height } = imageRef.current.getBoundingClientRect();
    let x = ((e.touches[0].clientX - left) / width) * 100;
    let y = ((e.touches[0].clientY - top) / height) * 100;

    // Boundary checks
    x = Math.max(0, Math.min(100, x));
    y = Math.max(0, Math.min(100, y));

    setZoomState(prev => ({
      ...prev,
      position: { x, y }
    }));
  };

  // Handle zoom lens dragging
  const handleDragStart = (e: React.MouseEvent<HTMLDivElement>) => {
    setZoomState(prev => ({
      ...prev,
      isDragging: true,
      dragStart: { x: e.clientX, y: e.clientY }
    }));
  };

  const handleDragMove = (e: MouseEvent) => {
    if (!zoomState.isDragging || !imageRef.current || !zoomLensRef.current) return;

    const { width, height } = imageRef.current.getBoundingClientRect();
    const dx = ((e.clientX - zoomState.dragStart.x) / width) * 100;
    const dy = ((e.clientY - zoomState.dragStart.y) / height) * 100;

    setZoomState(prev => {
      let newX = prev.position.x - dx;
      let newY = prev.position.y - dy;

      // Boundary checks
      newX = Math.max(0, Math.min(100, newX));
      newY = Math.max(0, Math.min(100, newY));

      return {
        ...prev,
        position: { x: newX, y: newY },
        dragStart: { x: e.clientX, y: e.clientY }
      };
    });
  };

  const handleDragEnd = () => {
    setZoomState(prev => ({ ...prev, isDragging: false }));
  };

  // Close zoom when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (zoomRef.current && !zoomRef.current.contains(e.target as Node)) {
        setZoomState(prev => ({ ...prev, isActive: false }));
      }
    };

    if (zoomState.isActive) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('mousemove', handleDragMove);
      document.addEventListener('mouseup', handleDragEnd);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('mousemove', handleDragMove);
      document.removeEventListener('mouseup', handleDragEnd);
    };
  }, [zoomState.isActive, zoomState.isDragging]);

  // Zoom controls
  const zoomIn = () => {
    setZoomState(prev => ({
      ...prev,
      scale: Math.min(prev.scale + 0.5, 4)
    }));
  };

  const zoomOut = () => {
    setZoomState(prev => ({
      ...prev,
      scale: Math.max(prev.scale - 0.5, 1)
    }));
  };

  const resetZoom = () => {
    setZoomState(prev => ({
      ...prev,
      scale: 2,
      position: { x: 50, y: 50 }
    }));
  };


  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/30 to-purple-50/30 py-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center text-sm text-gray-600 mb-6">
          <ol className="flex items-center space-x-2">
            <li><Link href="/" className="hover:text-blue-600">Home</Link></li>
            <ChevronRight className="h-4 w-4" />
            <li><Link href="/product" className="hover:text-blue-600">Products</Link></li>
            <ChevronRight className="h-4 w-4" />
            <li aria-current="page" className="text-blue-600 line-clamp-1">{data.name}</li>
          </ol>
        </nav>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          {/* Image Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/20 shadow-lg">
      {/* Main Image with Zoom Lens */}
      <div 
        className="relative aspect-square w-full cursor-zoom-in"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
        onTouchStart={handleMouseEnter}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseLeave}
        ref={imageRef}
      >
        {data.images?.[activeImage] && (
          <>
            <Image
              src={urlFor(data.images[activeImage]).url()}
              alt={data.name || `Product image`}
              fill
              className="object-contain p-4"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            
            {/* Zoom Lens */}
            {zoomState.isActive && (
              <div
                ref={zoomLensRef}
                className="absolute border-2 border-white/50 bg-white/20 pointer-events-none"
                style={{
                  width: '100px',
                  height: '100px',
                  left: `calc(${zoomState.position.x}% - 50px)`,
                  top: `calc(${zoomState.position.y}% - 50px)`,
                  transform: 'translateZ(0)',
                  boxShadow: '0 0 0 1px rgba(0,0,0,0.1) inset',
                  backdropFilter: 'blur(2px)',
                  display: zoomState.isActive ? 'block' : 'none'
                }}
                onMouseDown={handleDragStart}
              />
            )}
          </>
        )}
      </div>

      {/* Zoomed View */}
      {zoomState.isActive && (
        <div 
          className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4 md:p-8"
          ref={zoomRef}
        >
          <div className="relative w-full h-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div 
              className="absolute inset-0 bg-white"
              style={{
                backgroundImage: `url(${urlFor(data.images[activeImage]).url()})`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: `${zoomState.position.x}% ${zoomState.position.y}%`,
                backgroundSize: `${zoomState.scale * 100}%`,
                transform: 'translateZ(0)'
              }}
            />
            
            {/* Zoom Controls */}
            <div className="absolute bottom-4 left-4 right-4 flex justify-center gap-4">
              <button
                onClick={zoomOut}
                className="bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
                aria-label="Zoom out"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </button>
              <button
                onClick={resetZoom}
                className="bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
                aria-label="Reset zoom"
              >
                <span className="text-sm font-medium">100%</span>
              </button>
              <button
                onClick={zoomIn}
                className="bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
                aria-label="Zoom in"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
            
            <button
              onClick={() => setZoomState(prev => ({ ...prev, isActive: false }))}
              className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
              aria-label="Close zoom"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            {/* Zoom Level Indicator */}
            <div className="absolute top-4 left-4 bg-white rounded-full px-3 py-1 shadow-lg text-sm font-medium">
              {Math.round(zoomState.scale * 100)}%
            </div>
          </div>
        </div>
      )}

      {/* Thumbnails with hidden scrollbar */}
      <div className="relative pb-2 px-4 border-t border-white/20">
        <div 
          ref={thumbnailsRef}
          className="flex gap-2 overflow-x-auto scroll-smooth py-2"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          <style jsx>{`
            .thumbnails::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          
          {data.images?.map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveImage(i)}
              className={`flex-shrink-0 aspect-square w-16 sm:w-20 md:w-16 rounded-lg overflow-hidden border-2 transition-all ${
                activeImage === i ? 'border-blue-500' : 'border-transparent hover:border-gray-300'
              }`}
              aria-label={`Select image ${i + 1}`}
            >
              <div className="relative w-full h-full">
                <Image
                  src={urlFor(img).url()}
                  alt={`Thumbnail ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 20vw, (max-width: 768px) 15vw, 10vw"
                />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

          {/* Product Details */}
          <article className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg flex flex-col">
            {/* Share Button */}
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

            {/* Product Info */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-blue-600">{data.categoryName}</span>
              <div className="flex gap-2">
                {data.isNew && <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">New</span>}
                {discount > 0 && <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">-{discount}%</span>}
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
              <span className="text-sm text-gray-500">{data.reviewCount || 24} reviews</span>
            </div>

            {/* Price */}
            <div className="my-4">
              <div className="flex items-end gap-3">
                <span className="text-3xl font-bold text-gray-900">₦{finalPrice.toLocaleString()}</span>
                {hasDiscount && (
                  <span className="text-lg text-gray-500 line-through">₦{data.price.toLocaleString()}</span>
                )}
              </div>
              {discount > 0 && (
                <span className="text-sm text-green-600">
                  You save ₦{(data.price - finalPrice).toLocaleString()} ({discount}%)
                </span>
              )}
            </div>

            {/* Volume and Skin Type */}
            {data.volume && (
              <div className="mb-4 text-sm">
                <span className="text-gray-500">Size: </span>
                <span className="font-medium">{data.volume}</span>
              </div>
            )}

          {Array.isArray(data.skinType) && data.skinType.length > 0 && (
  <div className="mb-4">
    <span className="text-sm text-gray-500">Recommended for: </span>
    <div className="flex flex-wrap gap-2 mt-1">
      {data.skinType.map((type, i) => (
        <span
          key={type + i}
          className="bg-amber-100 text-amber-800 text-xs font-medium px-2.5 py-0.5 rounded"
        >
          {type}
        </span>
      ))}
    </div>
  </div>
)}
            {/* Quantity & Cart */}
            <div className="mt-4 mb-6">
              <div className="flex items-center gap-4">
                <div className="flex items-center bg-white rounded-full border border-gray-200 overflow-hidden">
                  <button
                    onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                    className="px-3 py-2 text-gray-600 hover:bg-gray-50"
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={quantity}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      if (!isNaN(val)) setQuantity(Math.max(1, Math.min(100, val)));
                    }}
                    className="w-12 text-center border-x border-gray-200 py-2 outline-none"
                  />
                  <button
                    onClick={() => setQuantity((prev) => Math.min(100, prev + 1))}
                    className="px-3 py-2 text-gray-600 hover:bg-gray-50"
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

            {Array.isArray(data.ingredients) && data.ingredients?.length > 0 && (
              <div className="mb-6">
                <h2 className="font-medium text-gray-900 mb-2">Key Ingredients</h2>
                <div className="flex flex-wrap gap-2">
                  { data.ingredients.map((ingredient, i) => (
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

        {/* Benefits */}
        {Array.isArray(data.benefits) && data.benefits?.length > 0 && (
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