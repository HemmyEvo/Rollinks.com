'use client'
import { urlFor } from "@/lib/sanity"
import Image from "next/image"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface iAppProps {
  images: any[]
}

export default function ImageGallery({ images }: iAppProps) {
  const [bigImage, setBigImage] = useState(images[0])
  const [activeIndex, setActiveIndex] = useState(0)

  const handleThumbnailClick = (image: any, index: number) => {
    setBigImage(image)
    setActiveIndex(index)
  }

  return (
    <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
      {/* Thumbnails - Glass Panel */}
      <motion.div 
        className="flex lg:flex-col gap-3 order-last lg:order-first p-2 rounded-xl bg-white/30 backdrop-blur-md border border-white/20 shadow-lg"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        {images.map((image, idx) => (
          <motion.div
            key={idx}
            className={`relative w-16 h-16 lg:w-20 lg:h-20 cursor-pointer rounded-lg overflow-hidden transition-all duration-300 ${
              activeIndex === idx 
                ? 'ring-2 ring-amber-500 ring-offset-2' 
                : 'hover:ring-1 hover:ring-gray-300'
            }`}
            onClick={() => handleThumbnailClick(image, idx)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Image
              src={urlFor(image).url()}
              alt={`Thumbnail ${idx}`}
              fill
              quality={100}
              className="object-cover object-center"
              sizes="(max-width: 768px) 80px, 100px"
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Main Image - Glass Panel */}
      <motion.div 
        className="relative w-full h-[400px] sm:h-[500px] rounded-xl overflow-hidden bg-white/30 backdrop-blur-md border border-white/20 shadow-lg"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={bigImage._key}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full"
          >
            <Image
              src={urlFor(bigImage).url()}
              alt="Main product image"
              fill
              priority
              quality={100}
              className="object-cover object-center cursor-zoom-in"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
            />
          </motion.div>
        </AnimatePresence>

        {/* Sale Badge - Glass Style */}
        <motion.span 
          className="absolute left-4 top-4 rounded-lg bg-amber-600/90 backdrop-blur-sm px-3 py-1.5 text-sm font-medium uppercase tracking-wider text-white shadow-lg"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Sale
        </motion.span>

        {/* Zoom Hint (mobile only) */}
        <motion.div
          className="lg:hidden absolute bottom-4 right-4 bg-black/50 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          Tap to zoom
        </motion.div>
      </motion.div>
    </div>
  )
}