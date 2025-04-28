import { Heart, ShoppingCart, Star, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useShoppingCart } from 'use-shopping-cart'

type Props = {
  id: string,
  title: string,
  price: number,
  description: any[],
  image: string,
  discount: number,
  slug: string,
  rating: number,
  isNew: boolean,
  
}

const ProductCard = ({ id, title, price, description, slug, image, discount, rating, isNew, sales = 0 }: Props) => {
  const [isHovered, setIsHovered] = React.useState(false)
  const [isLiked, setIsLiked] = React.useState(false)
  const { addItem } = useShoppingCart();

  const handleAddToCart = () => {
    const product = {
      id: id,
      sku: id,
      name: title,
      price: price,
      currency: "NGN",
      image: image,
    };
    addItem(product)
  }

  const discountPercentage = discount ? Math.round(((discount - price) / discount) * 100) : 0

  return (
    <motion.div 
      className="w-full"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -100px 0px" }}
      transition={{ duration: 0.3 }}
    >
      <div 
        className="relative bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image Container */}
        <div className="relative aspect-square w-full overflow-hidden">
          <Link href={`/product/${slug}`}>
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              priority
            />
          </Link>

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col space-y-1 z-10">
            {isNew && (
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded">
                New
              </span>
            )}
            {discountPercentage > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded">
                {discountPercentage}% OFF
              </span>
            )}
          </div>

          {/* Like Button */}
          <button 
            className={`absolute top-2 right-2 p-1.5 rounded-full ${isLiked ? 'text-red-500' : 'text-gray-400 bg-white/80'}`}
            onClick={() => setIsLiked(!isLiked)}
          >
            <Heart 
              className="w-5 h-5" 
              fill={isLiked ? 'currentColor' : 'none'}
            />
          </button>

          {/* Add to Cart Button - Shows on hover */}
          <AnimatePresence>
            {isHovered && (
              <motion.button
                onClick={handleAddToCart}
                className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-white text-red-500 flex items-center justify-center px-4 py-1.5 rounded-full shadow-md text-sm font-medium"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
              >
                <ShoppingCart className="w-4 h-4 mr-1" />
                Add to Cart
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Product Info */}
        <div className="p-3">
          <Link href={`/product/${slug}`}>
            <h3 className="text-sm text-gray-800 line-clamp-2 h-10 mb-1 hover:text-red-500 transition-colors">
              {title}
            </h3>
          </Link>

          {/* Price Section */}
          <div className="mb-1">
            <span className="text-lg font-bold text-red-500">
              ₦{price.toLocaleString('en-US', {minimumFractionDigits: 2})}
            </span>
            {discount > 0 && (
              <span className="text-xs text-gray-500 line-through ml-1">
                ₦{discount.toLocaleString('en-US', {minimumFractionDigits: 2})}
              </span>
            )}
          </div>

          {/* Rating and Sales */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center">
              <div className="flex items-center bg-yellow-50 px-1 py-0.5 rounded">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400 mr-0.5" />
                <span>{rating.toFixed(1)}</span>
              </div>
             
            </div>
            <Link href={`/product/${slug}`} className="text-blue-500 hover:text-blue-600 flex items-center">
              Details <ChevronRight className="w-3 h-3" />
            </Link>
          </div>

          
        </div>
      </div>
    </motion.div>
  )
}

export default ProductCard