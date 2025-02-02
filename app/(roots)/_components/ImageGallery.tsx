'use client'
import { urlFor } from "@/lib/sanity"
import Image from "next/image"
import { useState } from "react"

interface iAppProps {
  images: any[]
}

export default function ImageGallery({ images }: iAppProps) {
  const [bigImage, setBigImage] = useState(images[0])

  return (
    <div className="flex flex-col lg:flex-row gap-4">
      {/* Thumbnails */}
      <div className="flex lg:flex-col gap-3 order-last lg:order-first">
        {images.map((image, idx) => (
          <div
            key={idx}
            className="relative w-20 h-20 cursor-pointer border-2 border-transparent hover:border-gray-400 rounded-lg overflow-hidden"
            onClick={() => setBigImage(image)}
          >
            <Image
              src={urlFor(image).url()}
              alt={`Thumbnail ${idx}`}
              fill
              quality={100}
              style={{ objectFit: "cover", objectPosition:"center" }}
            />
          </div>
        ))}
      </div>

      {/* Main Image */}
      <div className="relative w-full sm:max-w-[300px] md:max-w-[500px] h-[500px] rounded-lg overflow-hidden bg-gray-100">
        <Image
          src={urlFor(bigImage).url()}
          alt="Main image"
          fill
          priority
          quality={100}
          style={{ objectFit: "cover", objectPosition:"center" }}
          className="cursor-pointer"
        />
        <span className="absolute left-0 top-0 rounded-br-lg bg-red-500 px-3 py-1.5 text-sm uppercase tracking-wider text-white">Sale</span>
      </div>
    </div>
  )
}
