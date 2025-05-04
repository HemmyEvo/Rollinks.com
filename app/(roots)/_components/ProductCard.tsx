import { ShoppingCart, Star, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useShoppingCart } from 'use-shopping-cart'

type Props = {
  id: string,
  title: string,
  price: number | null,
  description: any[],
  image: string,
  discount: number | null,
  slug: string,
  rating: number,
  isNew: boolean,
}

const ProductCard = ({ id, title, price, description, slug, image, discount, rating, isNew }: Props) => {
  const [isHovered, setIsHovered] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const { addItem } = useShoppingCart()

  const safePrice = price || 0; // Fallback to 0 if price is null/undefined
  const safeDiscount = discount || 0; // Fallback to 0 if discount is null/undefined
  
  const discountPercentage = discount && price 
    ? Math.round(((safeDiscount - safePrice) / safeDiscount) * 100) 
    : 0

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    const product = {
      id: id,
      sku: id,
      name: title,
      price: safePrice,
      currency: "NGN",
      image: image,
      quantity: quantity
    }
    addItem(product)

    // Animation feedback
    setIsHovered(false)
    setQuantity(1)
  }

  const incrementQuantity = (e: React.MouseEvent) => {
    e.preventDefault()
    setQuantity(prev => prev + 1)
  }

  const decrementQuantity = (e: React.MouseEvent) => {
    e.preventDefault()
    setQuantity(prev => (prev > 1 ? prev - 1 : 1))
  }

  return (
    <motion.div 
      className="w-full h-full"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -100px 0px" }}
      transition={{ duration: 0.4 }}
    >
      <motion.div 
        className="relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 h-full flex flex-col border border-gray-100"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={{ y: -5 }}
      >
        {/* Image Container */}
        <div className="relative aspect-square w-full overflow-hidden">
          <motion.div
            initial={{ scale: 1 }}
            animate={{ scale: isHovered ? 1.05 : 1 }}
            transition={{ duration: 0.3 }}
            className="h-full w-full"
          >
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover object-center"
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              priority
            />
          </motion.div>
</div>

          {/* Glassmorphism Badges */}
<div className="absolute top-3 left-3 flex flex-col space-y-2 z-10">
  {isNew && (
    <motion.span 
      className="backdrop-blur-md bg-white/30 border border-white/20 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ 
        scale: 1, 
        opacity: 1,
        background: [
          'linear-gradient(90deg, rgba(255,255,255,0.1) 0%, rgba(37,99,235,0.6) 50%, rgba(255,255,255,0.1) 100%)',
          'linear-gradient(90deg, rgba(255,255,255,0.3) 0%, rgba(37,99,235,0.6) 50%, rgba(255,255,255,0.3) 100%)',
          'linear-gradient(90deg, rgba(255,255,255,0.1) 0%, rgba(37,99,235,0.6) 50%, rgba(255,255,255,0.1) 100%)'
        ]
      }}
      transition={{ 
        delay: 0.2,
        duration: 2,
        repeat: Infinity,
        repeatType: "reverse"
      }}
    >
      New Formula
    </motion.span>
  )}
  {discountPercentage > 0 && (
    <motion.span 
      className="backdrop-blur-md bg-white/30 border border-white/20 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ 
        scale: 1, 
        opacity: 1,
        background: [
          'linear-gradient(90deg, rgba(255,255,255,0.1) 0%, rgba(22,163,74,0.6) 50%, rgba(255,255,255,0.1) 100%)',
          'linear-gradient(90deg, rgba(255,255,255,0.3) 0%, rgba(22,163,74,0.6) 50%, rgba(255,255,255,0.3) 100%)',
          'linear-gradient(90deg, rgba(255,255,255,0.1) 0%, rgba(22,163,74,0.6) 50%, rgba(255,255,255,0.1) 100%)'
        ]
      }}
      transition={{ 
        delay: 0.3,
        duration: 2,
        repeat: Infinity,
        repeatType: "reverse"
      }}
    >
      {discountPercentage}% OFF
    </motion.span>
  )}
</div>
        {/* Product Info */}
        <div className="p-4 flex-grow flex flex-col">
          <h3 className="text-md font-medium text-gray-800 line-clamp-2 mb-2 hover:text-blue-600 transition-colors">
            {title}
          </h3>

          {/* Price Section */}
          <div className="mt-auto">
            <div className="mb-3 flex items-center">
              <span className="text-xl font-bold text-gray-900">
                {safePrice.toLocaleString('en-NG', {
  style: 'currency',
  currency: 'NGN',
  minimumFractionDigits: 2,
})}
              </span>
              {safeDiscount > 0 && (
                <span className="text-sm text-red-500 line-through ml-2">
                  ₦{safeDiscount.toLocaleString('en-NG', {
  style: 'currency',
  currency: 'NGN',
  minimumFractionDigits: 2,
})}
                </span>
              )}
            </div>

            {/* Rating */}
            <div className="flex items-center mb-4">
              <div className="flex items-center bg-blue-50 px-2 py-1 rounded-full">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                <span className="text-sm font-medium">{rating && rating.toFixed(1)}</span>
              </div>
              <span className="text-xs text-gray-500 ml-2">({rating && Math.floor(rating * 10)} reviews)</span>
            </div>

            {/* Add to Cart Section */}
            <Link href={`/product/${slug}`} passHref>
              <AnimatePresence>
                <motion.div
                  className="flex items-center text-blue-600 hover:text-blue-700 transition-colors"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <span className="text-sm font-medium mr-1">View Details</span>
                  <ChevronRight className="w-4 h-4" />
                </motion.div>
              </AnimatePresence>
            </Link>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default ProductCard