"use client"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import Image from "next/image"
import { useShoppingCart } from "use-shopping-cart"
import dynamic from 'next/dynamic'
import { X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Leaf, Droplet } from 'lucide-react'

const CheckoutButton = dynamic(() => import('./CheckoutButton'), { ssr: false })

export default function ShoppingCartModal() {
    const {cartCount =0, shouldDisplayCart, handleCartClick, cartDetails, removeItem, totalPrice} = useShoppingCart()

    return (
      <Sheet open={shouldDisplayCart} onOpenChange={() => handleCartClick()}>
        <SheetContent className="w-full sm:max-w-lg bg-white/90 backdrop-blur-lg border-l border-green-50 shadow-xl" showX={false}>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="relative h-full flex flex-col"
          >
            <SheetHeader className="border-b border-green-100 pb-4">
              <div className="flex justify-between items-center">
                <SheetTitle className="text-2xl font-bold text-green-800 flex items-center gap-2">
                  <Leaf className="h-5 w-5 text-green-600" />
                  Your Skincare Routine
                </SheetTitle>
                <button 
                  onClick={() => handleCartClick()}
                  className="p-1 rounded-full hover:bg-green-50 transition-all"
                >
                  <X className="h-5 w-5 text-green-700" />
                </button>
              </div>
            </SheetHeader>
            
            <div className="flex-1 overflow-y-auto py-4">
              {cartCount === 0 ? (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex flex-col items-center justify-center h-full text-center p-8"
                >
                  <motion.div 
                    animate={{ rotate: -10, y: [0, -5, 0] }}
                    transition={{ repeat: Infinity, duration: 3 }}
                    className="bg-green-50 rounded-full p-6 mb-6"
                  >
                    <Droplet className="h-12 w-12 text-green-400" />
                  </motion.div>
                  <h2 className="text-xl font-medium text-green-800 mb-2">Your Routine is Empty</h2>
                  <p className="text-green-600 max-w-md">
                    Nourish your skin with our carefully formulated products. Your perfect regimen awaits.
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleCartClick()}
                    className="mt-6 px-6 py-2 bg-green-600 text-white rounded-full text-sm font-medium shadow-sm hover:bg-green-700 transition-colors"
                  >
                    Discover Products
                  </motion.button>
                </motion.div>
              ) : (
                <motion.ul 
                  layout
                  className="space-y-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ staggerChildren: 0.1 }}
                >
                  <AnimatePresence>
                    {Object.values(cartDetails ?? {}).map((entry) => (
                      <motion.li 
                        key={entry.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        className="flex gap-4 p-4 bg-white rounded-lg border border-green-50 shadow-sm hover:shadow-md transition-shadow"
                      >
                        <motion.div 
                          whileHover={{ scale: 1.05 }}
                          className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg"
                        >
                          <Image 
                            src={entry.image as string} 
                            alt={entry.name} 
                            fill
                            className="object-cover"
                          />
                        </motion.div>

                        <div className="flex-1 flex flex-col">
                          <div className="flex justify-between">
                            <h3 className="font-medium text-green-900">{entry.name}</h3>
                            <p className="font-semibold text-green-800">₦{entry.price}</p>
                          </div>
                          <p className="text-sm text-green-600 mt-1 line-clamp-1">{entry.description}</p>
                          
                          <div className="mt-auto flex justify-between items-center">
                            <span className="text-sm text-green-500">Qty: {entry.quantity}</span>
                            <motion.button 
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => removeItem(entry.id)} 
                              className="text-xs font-medium text-amber-600 hover:text-amber-700 transition-colors"
                            >
                              Remove
                            </motion.button>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </motion.ul>
              )}
            </div>

            {cartCount > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="border-t border-green-100 pt-4 mt-auto"
              >
                <div className="flex justify-between text-lg font-semibold text-green-900 mb-2">
                  <span>Subtotal</span>
                  <span>₦{totalPrice?.toFixed(2)}</span>
                </div>
                <p className="text-sm text-green-600 mb-4">
                  Free shipping on orders over ₦50,000
                </p>
                
                <div className="space-y-3">
                  <CheckoutButton />
                  
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleCartClick()}
                    className="w-full py-3 text-sm font-medium text-green-700 hover:text-green-900 transition-colors"
                  >
                    Continue Your Skincare Journey
                  </motion.button>
                </div>
              </motion.div>
            )}
          </motion.div>
        </SheetContent>
      </Sheet>
    )
}