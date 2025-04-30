import { simplifiedProduct } from '@/app/interface';
import { client } from '@/lib/sanity';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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
  const [isLoading, setIsLoading] = useState(true);
  const constraintsRef = useRef(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await getData();
        setData(result);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    },
    hover: {
      y: -10,
      scale: 1.05,
      transition: { duration: 0.3 }
    }
  };

  const pulse = {
    initial: { scale: 1 },
    animate: { 
      scale: [1, 1.2, 1],
      transition: { 
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <section className="pb-[80px] pt-[100px] px-4 sm:px-12 bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
      {/* Glass morphism background elements */}
      <motion.div 
        className="absolute top-20 left-1/4 w-40 h-40 rounded-full bg-blue-100 opacity-30 blur-xl"
        animate={{
          x: [0, 20, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />
      <motion.div 
        className="absolute bottom-10 right-1/4 w-60 h-60 rounded-full bg-pink-100 opacity-20 blur-xl"
        animate={{
          x: [0, -30, 0],
          y: [0, -20, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        <header className="w-full space-y-5 text-center mb-16">
          <motion.div 
            className="label flex items-center justify-center space-x-4"
            initial="hidden"
            animate="show"
            variants={{
              hidden: { opacity: 0 },
              show: { 
                opacity: 1,
                transition: { staggerChildren: 0.1 }
              }
            }}
          >
            <motion.div 
              className="w-3 h-3 bg-red-500 rounded-full"
              variants={pulse}
            />
            <motion.p 
              className="text-sm uppercase tracking-wider text-red-500 font-medium"
              initial={{ x: -10 }}
              animate={{ x: 0 }}
              transition={{ type: "spring" }}
            >
              Categories
            </motion.p>
          </motion.div>
          
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-gray-900"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Browse By Category
          </motion.h2>
        </header>

        <motion.div 
          ref={constraintsRef}
          className="relative"
          initial="hidden"
          animate="show"
          variants={container}
        >
          <AnimatePresence>
            {isLoading ? (
              <motion.div 
                className="flex gap-6 justify-center"
                exit={{ opacity: 0 }}
              >
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-40 h-40 rounded-xl bg-white/50 backdrop-blur-sm border border-white/30 shadow-sm flex-shrink-0"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  />
                ))}
              </motion.div>
            ) : (
              <motion.div 
                className="flex gap-6 pb-8 px-2 overflow-x-auto scrollbar-hide"
                drag="x"
                dragConstraints={constraintsRef}
                whileTap={{ cursor: "grabbing" }}
              >
                {data.map((item) => (
                  <motion.div
                    key={item._id}
                    variants={item}
                    whileHover="hover"
                    className="flex-shrink-0"
                  >
                    <Link href={`/product?category=${encodeURIComponent(item.name)}`} passHref>
                      <motion.div 
                        className="w-40 h-40 flex flex-col items-center justify-center rounded-xl backdrop-blur-sm bg-white/50 border border-white/30 shadow-sm hover:shadow-lg"
                        whileTap={{ scale: 0.95 }}
                      >
                        <motion.div 
                          className="w-20 h-20 flex items-center justify-center mb-3"
                          whileHover={{ scale: 1.1 }}
                        >
                          {item.imageUrl && (
                            <Image 
                              src={item.imageUrl} 
                              width={80} 
                              height={80} 
                              className="object-contain"
                              alt={item.name}
                              loading="lazy"
                            />
                          )}
                        </motion.div>
                        <motion.p className="text-base font-medium text-gray-700">
                          {item.name}
                        </motion.p>
                      </motion.div>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      <style jsx global>{`
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