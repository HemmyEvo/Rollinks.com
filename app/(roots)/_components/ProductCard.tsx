import { ShoppingCart, Star, Heart, Plus, Minus } from 'lucide-react'
import Image from 'next/image'
import React, { useState } from 'react'
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

const ProductCard = ({ id, title, price, description, image, discount, slug, rating, isNew }: Props) => {
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [isAdded, setIsAdded] = useState(false)
  const { addItem,setItemQuantity, incrementItem,
  decrementItem} = useShoppingCart()
  const safePrice = price || 0
  const safeDiscount = discount || 0
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
      description: description[0],
      currency: "NGN",
      image: image,
      quantity: quantity
    }
    addItem(product)
    setIsAdded(true)
  }

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsWishlisted(!isWishlisted)
  }

  const incrementQuantity = (e: React.MouseEvent) => {
    e.preventDefault()
    setQuantity(prev => prev + 1)
    incrementItem(id)
  }

  const decrementQuantity = (e: React.MouseEvent) => {
    e.preventDefault()
    setQuantity(prev => (prev > 0 ? prev - 1 : 1))
  decrementItem(id)
    quality === 0 && setIsAdded(false)
     
  }

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 1
    setQuantity(Math.max(1, value))
    setItemQuantity(id,value)
}
  return (
    <div className="w-full bg-white border border-gray-200 rounded-sm shadow-sm hover:shadow-md transition-shadow">
      <Link href={`/product/${slug}`} passHref>
        <div className="relative group">
          {/* Image Container */}
          <div className="relative aspect-square w-full overflow-hidden bg-gray-100">
            <Image
              src={image}
              alt={title}
              fill
              className="object-contain object-center p-2"
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
            
            {/* Discount Badge */}
            {discountPercentage > 0 && (
              <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-sm">
                -{discountPercentage}%
              </div>
            )}
            
            {/* New Badge */}
            {isNew && (
              <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-sm">
                New
              </div>
            )}
            
            {/* Wishlist Button */}
            <button 
              onClick={toggleWishlist}
              className="absolute top-10 right-2 z-10 p-1.5 rounded-full bg-white shadow-sm hover:bg-gray-100 transition-colors"
            >
              <Heart 
                className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} 
              />
            </button>
          </div>

          {/* Product Info */}
          <div className="p-3">
            {/* Title */}
            <h3 className="text-sm font-normal text-gray-800 line-clamp-2 mb-1 group-hover:text-orange-600 transition-colors">
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
              <span className="text-[10px] text-gray-500 ml-1">({Math.floor(rating * 10)})</span>
            </div>

            {/* Price Section */}
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

            {/* Add to Cart Button - Changes to quantity selector when clicked */}
            {!isAdded ? (
              <button
                onClick={handleAddToCart}
                className="w-full bg-orange-500 text-white text-sm font-medium py-2 rounded-sm hover:bg-orange-600 transition-colors flex items-center justify-center"
              >
                <ShoppingCart className="w-4 h-4 mr-1" />
                ADD TO CART
              </button>
            ) : (
              <div className="flex w-full  items-center border border-orange-500 rounded-sm overflow-hidden">
                <button 
                  onClick={decrementQuantity}
                  className="px-2 py-2 bg-orange-500 text-white hover:bg-orange-600 transition-colors"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={handleQuantityChange}
                  className="w-10 flex-1 text-center text-sm  border-x border-orange-500"
                />
                <button 
                  onClick={incrementQuantity}
                  className="px-2 py-2 bg-orange-500 text-white hover:bg-orange-600 transition-colors"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        </div>
      </Link>
    </div>
  )
}

export default ProductCard