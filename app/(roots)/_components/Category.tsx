import { simplifiedProduct } from '@/app/interface';
import { client } from '@/lib/sanity';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState, useRef } from 'react';

async function getData() {
  const query = `*[_type == "category"]{
    _id,
    name,
    "imageUrl": image.asset->url,
    "slug": slug.current
  }`;
  const data = await client.fetch(query);
  return data;
}

export default function Category() {
  const [data, setData] = useState<simplifiedProduct[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchData() {
      const result = await getData();
      setData(result);
    }
    fetchData();
  }, []);

  // Swipe handling functions
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    if (containerRef.current) {
      setStartX(e.pageX - containerRef.current.offsetLeft);
      setScrollLeft(containerRef.current.scrollLeft);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    e.preventDefault();
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = (x - startX) * 1.5; // Adjust scroll speed
    containerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  // Touch event handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    if (containerRef.current) {
      setStartX(e.touches[0].pageX - containerRef.current.offsetLeft);
      setScrollLeft(containerRef.current.scrollLeft);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !containerRef.current) return;
    const x = e.touches[0].pageX - containerRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    containerRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <section className="pb-[50px] pt-[80px] px-4 sm:px-12 bg-white">
      <header className="w-full max-w-7xl mx-auto space-y-5 text-center">
        <div className="label flex items-center justify-center space-x-4">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
          <p className="text-sm uppercase tracking-wider text-red-500 font-medium">
            Categories
          </p>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
          Browse By Category
        </h2>
      </header>

      <div className="mt-16 max-w-7xl mx-auto relative">
        {/* Custom navigation arrows */}
        <button 
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center hover:scale-110 transition-transform hidden md:flex"
          onClick={() => {
            if (containerRef.current) {
              containerRef.current.scrollBy({ left: -200, behavior: 'smooth' });
            }
          }}
          aria-label="Scroll left"
        >
          &larr;
        </button>
        
        <div
          ref={containerRef}
          className="flex overflow-x-auto scrollbar-hide pb-8 gap-6 px-2 cursor-grab active:cursor-grabbing"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleMouseUp}
          style={{ scrollBehavior: isDragging ? 'unset' : 'smooth' }}
        >
          {data.map((item, index) => (
            <Link 
              key={item._id}
              href={`/product?category=${encodeURIComponent(item.name)}`}
              passHref
            >
              <div 
                className="flex-shrink-0 w-40 h-40 flex flex-col items-center justify-center bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-2 group"
                style={{
                  animation: `fadeInUp 0.5s ease-out ${index * 0.1}s forwards`,
                  opacity: 0 // Start invisible for animation
                }}
              >
                <div className="w-20 h-20 flex items-center justify-center mb-3 transition-transform duration-300 group-hover:scale-110">
                  {item.imageUrl && (
                    <Image 
                      src={item.imageUrl} 
                      width={80} 
                      height={80} 
                      className="object-contain transition-all duration-300 group-hover:opacity-90"
                      alt={item.name}
                      loading="lazy"
                    />
                  )}
                </div>
                <p className="text-base font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
                  {item.name}
                </p>
              </div>
            </Link>
          ))}
        </div>

        <button 
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center hover:scale-110 transition-transform hidden md:flex"
          onClick={() => {
            if (containerRef.current) {
              containerRef.current.scrollBy({ left: 200, behavior: 'smooth' });
            }
          }}
          aria-label="Scroll right"
        >
          &rarr;
        </button>
      </div>

      {/* Add global styles for the animations */}
      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
}