import { ShoppingCart, Star, ChevronRight, Heart, Check } from 'lucide-react'
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
  const [isAdded, setIsAdded] = useState(false)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const { addItem } = useShoppingCart()

  const safePrice = price || 0;
  const safeDiscount = discount || 0;
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
    setIsAdded(true)
    
    // Reset added state after 2 seconds
    setTimeout(() => {
      setIsAdded(false)
      setQuantity(1)
    }, 2000)
  }

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsWishlisted(!isWishlisted)
  }

  const incrementQuantity = (e: React.MouseEvent) => {
    e.preventDefault()
    setQuantity(prev =>(prev + 1))
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
      <Link href={`/product/${slug}`} passHref>
        <motion.div 
          className="relative bg-white rounded-md overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col border border-gray-200 group"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          whileHover={{ y: -3 }}
        >
          {/* Image Container */}
          <div className="relative aspect-square w-full overflow-hidden bg-gray-100">
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
                className="object-contain object-center p-4"
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                priority
              />
            </motion.div>

            {/* Wishlist Button */}
            <button 
              onClick={toggleWishlist}
              className="absolute top-2 right-2 z-10 p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-md hover:bg-red-50 transition-colors"
            >
              <Heart 
                className={`w-4 h-4 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} 
              />
            </button>

            {/* Badges */}
            <div className="absolute top-2 left-2 flex flex-col space-y-2 z-10">
              {isNew && (
                <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-sm">
                  New
                </span>
              )}
              {discountPercentage > 0 && (
                <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-sm">
                  -{discountPercentage}%
                </span>
              )}
            </div>

            
          </div>

          {/* Product Info */}
          <div className="p-3 flex-grow flex flex-col">
            <h3 className="text-sm font-normal text-gray-800 line-clamp-2 mb-1 group-hover:text-blue-600 transition-colors">
              {title}
            </h3>

            {/* Rating */}
            <div className="flex items-center mb-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i}
                    className={`w-3 h-3 ${i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-500 ml-1">({Math.floor(rating * 10)})</span>
            </div>

            {/* Price Section */}
            <div className="mt-auto">
              <div className="mb-2">
                <span className="text-base font-bold text-gray-900">
                  ₦{safePrice.toLocaleString('en-US')}
                </span>
                {safeDiscount > 0 && (
                  <span className="text-xs text-gray-500 line-through ml-1">
                    ₦{safeDiscount.toLocaleString('en-US')}
                  </span>
                )}
              </div>

              {/* Add to Cart Section */}
              <AnimatePresence>
                {isHovered ? (
                  <motion.div
                    className="w-full"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {isAdded ? (
                      <motion.button
                        className="w-full bg-green-100 text-green-700 text-sm font-medium py-2 rounded flex items-center justify-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <Check className="w-4 h-4 mr-1" /> Added to Cart
                      </motion.button>
                    ) : (
                      <div className="flex items-center border border-gray-300 rounded overflow-hidden">
                        <button 
                          onClick={decrementQuantity}
                          className="px-2 py-1 bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                        >
                          -
                        </button>
                        <span className="flex-1 text-center text-sm px-2">
                          {quantity}
                        </span>
                        <button 
                          onClick={incrementQuantity}
                          className="px-2 py-1 bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                        >
                          +
                        </button>
                        <button
                          onClick={handleAddToCart}
                          className="bg-orange-500 text-white text-sm font-medium px-3 py-1 hover:bg-orange-600 transition-colors flex items-center"
                        >
                          <ShoppingCart className="w-4 h-4 mr-1" />
                          Add
                        </button>
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    className="text-orange-600 text-xs font-medium"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {stock > 0 ? 'In Stock' : 'Out of Stock'}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  )
}

export default ProductCard