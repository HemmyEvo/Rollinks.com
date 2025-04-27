import { CheckCircle, Eye, Heart, Plus, Minus, Star, ShoppingCart } from 'lucide-react'
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
  isNew: boolean
}

const ProductCard = ({ id, title, price, description, slug, image, discount, rating, isNew }: Props) => {
  const [quantity, setQuantity] = React.useState(1)
  const [addMessage, setAddMessage] = React.useState("Add to cart")
  const [isHovered, setIsHovered] = React.useState(false)
  const { addItem, incrementItem, setItemQuantity, cartDetails, clearCart } = useShoppingCart();

  const handleAddToCart = () => {
    setAddMessage("Added")
    clearCart()
    const product = {
      id: id,
      sku: id,
      name: title,
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
          className="bg-white/20 backdrop-blur-xl rounded-2xl overflow-hidden shadow-lg border border-white/30 transition-all duration-300 hover:shadow-2xl hover:border-white/50"
          whileHover={{ y: -5 }}
          style={{
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.15) 100%)'
          }}
        >
          {/* Image Container with Frosted Glass Effect */}
          <div className="relative h-64 w-full overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/10 z-10" />
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover object-center transition-transform duration-700 group-hover:scale-110"
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              priority
            />

            {/* Hover Overlay */}
            <motion.div 
              className="absolute inset-0 bg-black/10 flex items-center justify-center z-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="absolute top-4 right-4 flex flex-col space-y-3"
                initial={{ y: -20, opacity: 0 }}
                animate={{ 
                  y: isHovered ? 0 : -20,
                  opacity: isHovered ? 1 : 0
                }}
                transition={{ delay: 0.1 }}
              >
                <Link href={`/product/${slug}`}>
                  <button className="p-2 bg-white/90 rounded-full shadow-md hover:bg-white transition-colors hover:scale-110">
                    <Eye className="w-5 h-5 text-gray-700" />
                  </button>
                </Link>
                <button className="p-2 bg-white/90 rounded-full shadow-md hover:bg-white transition-colors hover:scale-110">
                  <Heart className="w-5 h-5 text-rose-500" />
                </button>
              </motion.div>
            </motion.div>

            {/* Badges - Floating Glass Effect */}
            <div className="absolute top-4 left-4 flex flex-col space-y-2 z-20">
              {isNew && (
                <motion.div 
                  className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-xs font-bold px-3 py-1 rounded-full backdrop-blur-sm shadow-md"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  New
                </motion.div>
              )}
              {discount && (
                <motion.div 
                  className="bg-gradient-to-r from-amber-500 to-orange-600 text-white text-xs font-bold px-3 py-1 rounded-full backdrop-blur-sm shadow-md"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {Math.round(((discount - price) / discount) * 100)}% OFF
                </motion.div>
              )}
            </div>
          </div>

          {/* Product Info - Frosted Glass Panel */}
          <div className="p-5 bg-white/10 backdrop-blur-md border-t border-white/20">
            <Link href={`/product/${slug}`}>
              <h3 className="font-semibold text-gray-800 hover:text-amber-600 transition-colors line-clamp-1 text-lg mb-1">
                {title}
              </h3>
            </Link>

            {/* Rating with Glass Background */}
            <div className="inline-flex items-center px-2 py-1 rounded-full bg-white/30 backdrop-blur-sm mb-3">
              <Star className="w-4 h-4 fill-amber-500 text-amber-500 mr-1" />
              <span className="text-sm font-medium text-gray-700">{rating.toFixed(1)}</span>
            </div>

            {/* Price Section */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-end space-x-2">
                <span className="text-xl font-bold text-gray-800">
                  ₦{price.toLocaleString('en-US', {minimumFractionDigits: 2})}
                </span>
                {discount && (
                  <span className="text-sm text-gray-500 line-through">
                    ₦{discount.toLocaleString('en-US', {minimumFractionDigits: 2})}
                  </span>
                )}
              </div>
            </div>

            {/* Add to Cart Section */}
            <div className="flex flex-col space-y-3">
              {/* Quantity Selector - Glass Style */}
              <motion.div 
                className="flex items-center justify-between bg-white/30 backdrop-blur-sm rounded-full overflow-hidden border border-white/40"
                whileTap={{ scale: 0.95 }}
              >
                <button 
                  className="px-3 py-2 text-gray-700 hover:bg-white/20 transition-colors"
                  onClick={() => handleQuantityChange(quantity - 1)}
                >
                  <Minus className="w-4 h-4" />
                </button>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={quantity}
                  onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                  className="w-12 text-center bg-transparent outline-none text-sm font-medium text-gray-700"
                />
                <button 
                  className="px-3 py-2 text-gray-700 hover:bg-white/20 transition-colors"
                  onClick={() => handleQuantityChange(quantity + 1)}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </motion.div>

              {/* Add to Cart Button - Glass Morphic */}
              <motion.button
                onClick={handleAddToCart}
                className={`w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-full text-sm font-semibold transition-all ${
                  addMessage === "Added" 
                    ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg" 
                    : "bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-lg hover:shadow-xl"
                }`}
                whileHover={addMessage !== "Added" ? { scale: 1.02 } : {}}
                whileTap={addMessage !== "Added" ? { scale: 0.98 } : {}}
              >
                <ShoppingCart className="w-5 h-5" />
                <span>{addMessage}</span>
                <AnimatePresence>
                  {addMessage === "Added" && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      transition={{ type: "spring" }}
                    >
                      <CheckCircle className="w-5 h-5" />
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Floating Confirmation Animation */}
        <AnimatePresence>
          {addMessage === "Added" && (
            <motion.div
              className="absolute -top-3 -right-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full p-2 shadow-xl z-30"
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 45 }}
              transition={{ type: "spring", damping: 10, stiffness: 100 }}
            >
              <CheckCircle className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

export default ProductCard