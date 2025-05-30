"use client"
import { Button } from '@/components/ui/button'
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'
import { Heart, LucideAlignRight, MenuIcon, Search, Settings, ShoppingCart, User, X } from 'lucide-react'
import Link from 'next/link'
import React, { useState } from 'react'
import { useShoppingCart } from 'use-shopping-cart'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'

const Header = () => {
  const [isToggle, setIsToggle] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showMobileSearch, setShowMobileSearch] = useState(false)
  const { cartCount = 0, handleCartClick } = useShoppingCart()
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
     window.location.href=`/product?search=${encodeURIComponent(searchQuery)}`
      setSearchQuery('')
      setIsToggle(false)
      setShowMobileSearch(false)
    }
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      {/* Glassmorphism Navbar */}
      <nav className="backdrop-blur-lg bg-white/80 border-b border-white/20 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center"
            >
              <Link href="/" className="text-2xl font-bold text-amber-800 flex items-end" onClick={() => setIsToggle(false)}>
                <span className="text-3xl text-amber-600">R</span>ollinks
              </Link>
            </motion.div>

            {/* Desktop Navigation */}  
            <div className="hidden md:flex items-center space-x-8">  
              <div className="flex space-x-6">  
                <Link href="/" className="text-gray-700 hover:text-amber-600 transition-colors font-medium text-sm">  
                  Home  
                </Link>  
                <Link href="/product" className="text-gray-700 hover:text-amber-600 transition-colors font-medium text-sm">  
                  Products  
                </Link>  
                <Link href="/about-us" className="text-gray-700 hover:text-amber-600 transition-colors font-medium text-sm">  
                  About  
                </Link>  
                <Link href="/history" className="text-gray-700 hover:text-amber-600 transition-colors font-medium text-sm">  
                  History  
                </Link>  
                <Link href="/contact" className="text-gray-700 hover:text-amber-600 transition-colors font-medium text-sm">  
                  Contact  
                </Link>  
              </div>  
            </div>  

            {/* Icons */}  
            <div className="flex items-center space-x-4">
              {/* Search Input - Always visible on desktop */}
              <div className="hidden md:flex relative">
                <form onSubmit={handleSearch} className="relative">
                  <input
                    type="text"
                    placeholder="Search products..."
                    className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </form>
              </div>

              {/* Search Button - Mobile */}
              <button 
                onClick={() => {setShowMobileSearch(!showMobileSearch); setIsToggle(false)}}
                className="md:hidden p-2 rounded-full hover:bg-amber-50 transition-colors"
              >
                <Search className="w-5 h-5 text-gray-700" />
              </button>

              {/* Cart */}  
              <motion.button  
                whileHover={{ scale: 1.05 }}  
                whileTap={{ scale: 0.95 }}  
                onClick={() => handleCartClick()}  
                className="relative p-2 rounded-full hover:bg-amber-50 transition-colors"  
              >  
                <ShoppingCart className="w-5 h-5 text-gray-700" />  
                {cartCount > 0 && (  
                  <span className="absolute -top-1 -right-1 bg-amber-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">  
                    {cartCount < 100 ? cartCount : "99+"}  
                  </span>  
                )}  
              </motion.button>  

              {/* User Auth */}  
              <div className="hidden md:block">  
                <SignedIn>  
                  <UserButton   
                    appearance={{  
                      elements: {  
                        userButtonAvatarBox: "w-8 h-8",  
                        userButtonPopoverCard: "backdrop-blur-lg bg-white/90"  
                      }  
                    }}  
                  />  
                </SignedIn>  
                <SignedOut>  
                  <SignInButton>  
                    <Button   
                      onClick={() => setIsToggle(!isToggle)}  
                      variant="outline"   
                      className="bg-transparent border-amber-600 text-amber-700 hover:bg-amber-50 hover:text-amber-800"  
                    >  
                      Sign In  
                    </Button>  
                  </SignInButton>  
                </SignedOut>  
              </div>  

              {/* Mobile Menu Button */}  
              <button   
                onClick={() => setIsToggle(!isToggle)}  
                className="md:hidden p-2 rounded-full hover:bg-amber-50 transition-colors"  
              >  
                {!isToggle ? (  
                  <LucideAlignRight className="w-5 h-5 text-gray-700" />  
                ) : (  
                  <X className="w-5 h-5 text-gray-700" />  
                )}  
              </button>  
            </div>  
          </div>  

          {/* Mobile Search Input */}
          {showMobileSearch && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden px-4 pb-4"
            >
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </form>
            </motion.div>
          )}
        </div>  

        {/* Mobile Menu */}  
        {isToggle && (  
          <motion.div   
            initial={{ opacity: 0, y: -20 }}  
            animate={{ opacity: 1, y: 0 }}  
            exit={{ opacity: 0, y: -20 }}  
            transition={{ duration: 0.2 }}  
            className="md:hidden absolute top-16 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-white/20 shadow-lg"  
          >  
            <div className="container mx-auto px-4 py-4">  
              <div className="flex flex-col space-y-4">  
                <Link href="/" onClick={() => setIsToggle(false)} className="text-gray-700 hover:text-amber-600 transition-colors font-medium py-2 border-b border-gray-100">  
                  Home  
                </Link>  
                <Link href="/product" onClick={() => setIsToggle(false)} className="text-gray-700 hover:text-amber-600 transition-colors font-medium py-2 border-b border-gray-100">  
                  Products  
                </Link>  
                <Link href="/about-us" onClick={() => setIsToggle(false)} className="text-gray-700 hover:text-amber-600 transition-colors font-medium py-2 border-b border-gray-100">  
                  About  
                </Link>  
                <Link href="/history" onClick={() => setIsToggle(false)} className="text-gray-700 hover:text-amber-600 transition-colors font-medium py-2 border-b border-gray-100">  
                  History  
                </Link>  
                <Link href="/contact" onClick={() => setIsToggle(false)} className="text-gray-700 hover:text-amber-600 transition-colors font-medium py-2 border-b border-gray-100">  
                  Contact  
                </Link>  
              </div>  

              <div className="pt-4 border-t border-gray-100">  
                <SignedIn>  
                  <div className="flex justify-center">  
                    <UserButton />  
                  </div>  
                </SignedIn>  
                <SignedOut>  
                  <SignInButton>  
                    <Button   
                      variant="default"   
                      className="w-full bg-amber-600 hover:bg-amber-700"  
                      onClick={() => setIsToggle(false)}  
                    >  
                      Sign In  
                    </Button>  
                  </SignInButton>  
                </SignedOut>  
              </div>  
            </div>  
          </motion.div>  
        )}  
      </nav>  
    </header>
  )
}

export default Header