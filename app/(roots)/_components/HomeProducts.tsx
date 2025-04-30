import { simplifiedProduct } from '@/app/interface';
import { client } from '@/lib/sanity';
import React from 'react'
import ProductCard from './ProductCard';
import { motion } from "framer-motion";
// Fetch data from Sanity
async function getData() {
    const query = `*[_type == "product" && !(_id in path("drafts.**"))] {
  _id,
  name,
  description,
  "slug": slug.current,
  "images": images[].asset->url,
  price,
  discountPrice,
  "categoryName": category->name,
  rating,
  isNew
}`;
    function shuffleArray(array: any[]) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
    
    const data = await client.fetch(query);
    return shuffleArray(data).slice(0, 8);
}

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function HomeProducts() {
  const [data, setData] = useState<simplifiedProduct[]>([]);

  useEffect(() => {
    async function fetchData() {
      const result = await getData();
      setData(result);
    }
    fetchData();
  }, []);
    
  // Container variants (for staggering children)
  const containerVariants = {
    transition: { staggerChildren: 2, delayChildren: 0.6 }
  };

  const itemVariants = {
    open: {
        y: 0,
        opacity: 1,
        transition: {
            y: { stiffness: 1000, velocity: -100 },
        },
    },
    closed: {
        y: 100,
        opacity: 0,
        transition: {
            y: { stiffness: 1000 },
        },
    },
};


    return (
            <div className="products bg-[#d3d2d2] px-12 pb-[30px] pt-[56px]">
            <header className="w-full md:max-w-4xl mx-auto space-y-5 text-center">
            <div className="label flex items-center space-x-4">
            <Image src="/Rectangle 18.png" width={12} height={12} alt="" />
            <p className="text-sm text-[#DB4444] capitalize">our products</p>
            </div>
            <div className="title text-xl text-left font-semibold">
            <p>Explore Our Products</p>
            </div>
            </header>
                {/* Wrap the product grid in a motion container for staggering */}
                <motion.div
                  variants={containerVariants}
                  className="md:max-w-4xl mt-10 grid lg:grid-cols-4 min-[509px]:grid-cols-2 gap-4 min-[712px]:grid-cols-3 grid-cols-1 mx-auto"
                > 
                
                  {data.length === 0 ? 
                  Array.from({ length: 8 }).map((_, i) => (
                     <motion.div
                        key={i}
                        variants={itemVariants}
                        initial="closed"
                        whileInView="open"
                    >
                        <div className="drop-shadow-xl mx-auto animate-pulse justify-center items-center flex flex-col pb-4 bg-[#fd9e4554] rounded-xl overflow-hidden h-full max-w-[212px]">
                        <div className="bg-gray-300 h-64 w-full mb-4"></div>
                        <div className="bg-gray-300 rounded-full h-6 w-3/4 mb-2"></div>
                        <div className="bg-gray-300 rounded-full h-6 w-1/2"></div>
                        </div>
                    </motion.div> )) : 
                    data.map((item: any, i: number) => (
                    <motion.div
                      key={i}
                      variants={itemVariants}
                        initial="closed"
                        whileInView="open"

                    >
                    <ProductCard
                    id={item._id}
                    title={item.name}
                      image={item.images?.[0]}
                    price={item.price}
                    description={item.description}
                    slug={item.slug}
                    discount={item.discountPrice}
                    rating={item.rating}
                    isNew={item.isNew}
                  />
                    </motion.div>
                  ))}
                </motion.div>
            <div className="flex justify-center mt-10">
            <Link href="/product">
            <button className="px-5 py-3 rounded-2xl bg-[goldenrod] shadow-md">View All Products</button>
            </Link>
            </div>
              </div>
       
    )
}