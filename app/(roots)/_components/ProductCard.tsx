import { CheckCircle, Eye, Heart, Plus, Minus } from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useShoppingCart } from 'use-shopping-cart'

type Props = {
  id: string,
  title: string,
  price: number,
  description: string,
  image: string,
  discount: number,
  slug: string
}

const ProductCard = ({ id, title, price, description, slug, image, discount }: Props) => {
  const [quantity, setQuantity] = React.useState(1)
  const [addMessage, setAddMessage] = React.useState("Add to cart")
  const [isHovered, setIsHovered] = React.useState(false)
  const { addItem, incrementItem, setItemQuantity, cartDetails } = useShoppingCart();

  const handleAddToCart = () => {
    setAddMessage("Added")

    const product = {
      id: id,
      name: title,
      description: description,
      price: price,
      currency: "NGN",
      image: image,
    };

    if (cartDetails && cartDetails[id]) {
      incrementItem(id, { count: quantity })
    } else {
      addItem(product)
      setItemQuantity(id, quantity)
    }

    setTimeout(() => {
      setAddMessage("Add to cart")
    }, 2000)
  }

  const handleQuantityChange = (value: number) => {
    const newValue = Math.max(1, Math.min(100, value))
    setQuantity(newValue)
  }

  return (
    <motion.div 
      className="w-full"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -100px 0px" }}
      transition={{ duration: 0.5 }}
    >
      <div 
        className="relative group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Glassmorphism Card */}
        <motion.div 
          className="bg-white/80 backdrop-blur-lg rounded-xl overflow-hidden shadow-lg border border-white/20 transition-all duration-300 hover:shadow-xl"
          whileHover={{ y: -5 }}
        >
          {/* Image Container */}
          <div className="relative h-48 sm:h-56 md:h-64 w-full overflow-hidden">
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              priority
            />
            
            {/* Hover Overlay */}
            <motion.div 
              className="absolute inset-0 bg-black/20 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="absolute top-3 right-3 sm:top-4 sm:right-4 flex flex-col space-y-2 sm:space-y-3"
                initial={{ y: -20, opacity: 0 }}
                animate={{ 
                  y: isHovered ? 0 : -20,
                  opacity: isHovered ? 1 : 0
                }}
                transition={{ delay: 0.1 }}
              >
                <Link href={`/product/${slug}`}>
                  <button className="p-1.5 sm:p-2 bg-white/90 rounded-full shadow-md hover:bg-white transition-colors">
                    <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
                  </button>
                </Link>
                <button className="p-1.5 sm:p-2 bg-white/90 rounded-full shadow-md hover:bg-white transition-colors">
                  <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-rose-500" />
                </button>
              </motion.div>
            </motion.div>
            
            {/* Discount Badge */}
            {discount && (
              <motion.div 
                className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-amber-600 text-white text-xs font-bold px-2 py-1 rounded-full"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                {Math.round(((discount - price) / discount) * 100)}% OFF
              </motion.div>
            )}
          </div>

          {/* Product Info */}
          <div className="p-3 sm:p-4">
            <Link href={`/product/${slug}`}>
              <h3 className="font-medium text-gray-800 hover:text-amber-600 transition-colors line-clamp-1 text-sm sm:text-base">
                {title}
              </h3>
            </Link>
            
            <div className="flex items-center justify-between mt-1 sm:mt-2">
              <div className="flex items-center space-x-1 sm:space-x-2">
                <span className="text-sm sm:text-lg font-bold text-amber-700">
                  ₦{price.toFixed(2)}
                </span>
                {discount && (
                  <span className="text-xs sm:text-sm text-gray-400 line-through">
                    ₦{discount.toFixed(2)}
                  </span>
                )}
              </div>
            </div>

            {/* Quantity Selector and Add to Cart - Stack on small screens */}
            <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <motion.div 
                className="flex items-center border border-gray-200 rounded-full overflow-hidden bg-white/90 w-full sm:w-auto"
                whileTap={{ scale: 0.95 }}
              >
                <button 
                  className="px-2 py-1 text-gray-600 hover:bg-amber-50 transition-colors"
                  onClick={() => handleQuantityChange(quantity - 1)}
                >
                  <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={quantity}
                  onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                  className="w-8 sm:w-12 text-center bg-transparent outline-none text-xs sm:text-sm"
                />
                <button 
                  className="px-2 py-1 text-gray-600 hover:bg-amber-50 transition-colors"
                  onClick={() => handleQuantityChange(quantity + 1)}
                >
                  <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
              </motion.div>

              {/* Add to Cart Button - Full width on mobile */}
              <motion.button
                onClick={handleAddToCart}
                className={`w-full sm:w-auto px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-colors ${
                  addMessage === "Added" 
                    ? "bg-green-500 text-white" 
                    : "bg-amber-600 hover:bg-amber-700 text-white"
                }`}
                whileHover={addMessage !== "Added" ? { scale: 1.05 } : {}}
                whileTap={addMessage !== "Added" ? { scale: 0.95 } : {}}
              >
                <div className="flex items-center justify-center sm:justify-start space-x-1">
                  <span>{addMessage}</span>
                  <AnimatePresence>
                    {addMessage === "Added" && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        transition={{ type: "spring" }}
                      >
                        <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Floating animation when added to cart */}
        <AnimatePresence>
          {addMessage === "Added" && (
            <motion.div
              className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3 bg-green-500 text-white rounded-full p-1 sm:p-2 shadow-lg"
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 45 }}
              transition={{ type: "spring", damping: 10, stiffness: 100 }}
            >
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

export default ProductCard