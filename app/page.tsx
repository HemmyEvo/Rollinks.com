"use client";
import { Baby, HandCoins, Leaf, PersonStanding, Smile, Truck } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import React from "react";
import { motion } from "framer-motion";
import NewArrival from "./(roots)/_components/NewArrival";
import HomeProducts from "./(roots)/_components/HomeProducts";
import Category from "./(roots)/_components/Category";


export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [displayText, setDisplayText] = useState("");
  const fullText = "Welcome to Rollinks Store";

  useEffect(() => {
    // Text-to-speech function with synchronized display
    const speakWelcome = () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        const speech = new SpeechSynthesisUtterance();
        speech.text = fullText;
        speech.volume = 1;
        speech.rate = 0.9; // Slightly slower for better sync
        speech.pitch = 1.1; // Slightly higher pitch for friendly tone
        
        // Animate text display with speech
        let currentIndex = 0;
        const interval = setInterval(() => {
          if (currentIndex <= fullText.length) {
            setDisplayText(fullText.substring(0, currentIndex));
            currentIndex++;
          } else {
            clearInterval(interval);
          }
        }, 80); // Matches speech rate

        speech.onend = () => {
          clearInterval(interval);
          setDisplayText(fullText);
          // Proceed to check assets after speech completes
          checkAssetsLoaded();
        };

        window.speechSynthesis.speak(speech);
      } else {
        // Fallback for browsers without speech synthesis
        setDisplayText(fullText);
        checkAssetsLoaded();
      }
    };

    // Check if all assets are loaded
    const checkAssetsLoaded = () => {
      const images = Array.from(document.images);
      const totalImages = images.length;
      
      if (totalImages === 0) {
        setTimeout(() => setIsLoading(false), 1000);
        return;
      }

      const imagePromises = images.map(img => {
        return img.complete 
          ? Promise.resolve() 
          : new Promise(resolve => img.addEventListener('load', resolve));
      });

      Promise.all(imagePromises).then(() => {
        setTimeout(() => setIsLoading(false), 800); // Smooth exit
      });
    };

    // Start the welcome sequence
    speakWelcome();

    return () => {
      window.speechSynthesis.cancel(); // Clean up speech
    };
  }, []);

  return (
    <>
      {/* Loading Screen */}
      {isLoading && (
        <div className="fixed inset-0 z-50 bg-white flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <motion.div
              animate={{ 
                scale: [1, 1.05, 1],
                rotate: [0, 2, -2, 0]
              }}
              transition={{ 
                repeat: Infinity, 
                repeatType: "reverse",
                duration: 2.5,
                ease: "easeInOut"
              }}
              className="mb-8"
            >
              <Leaf className="w-16 h-16 text-amber-600 mx-auto" />
            </motion.div>
            
            <div className="h-24 flex items-center justify-center">
              <motion.h1 
                key={displayText}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-600 to-amber-800 bg-clip-text text-transparent"
              >
                {displayText}
                <motion.span
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 1.2,
                    repeatDelay: 0.2
                  }}
                  className="ml-1"
                >
                  |
                </motion.span>
              </motion.h1>
            </div>

            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ 
                duration: 3, 
                ease: "linear",
                delay: 0.5
              }}
              className="mt-8 h-1 bg-amber-100 rounded-full overflow-hidden"
            >
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ 
                  duration: 3, 
                  ease: "linear",
                  delay: 0.5
                }}
                className="h-full bg-gradient-to-r from-amber-400 to-amber-600"
              />
            </motion.div>
          </motion.div>
        </div>
      )}

       {/* Main Content */}
      <div className={`relative overflow-x-hidden bg-gradient-to-b from-[#fff9f5] to-white ${isLoading ? 'opacity-0' : 'opacity-100 transition-opacity duration-500'}`}>
        {/* Hero Section */}
        <section
          className="relative w-full h-screen min-h-[600px] flex items-center justify-center bg-cover bg-center"
          style={{ backgroundImage: "url('/heroBkg.jpg')" }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/30"></div>

          <motion.div
            className="container mx-auto px-6 z-10"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <div className="max-w-3xl mx-auto text-center">
              <motion.h1 
                variants={itemVariants}
                className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight"
              >
                Indulge Your Skin With Luxurious Skincare
              </motion.h1>
              <motion.p 
                variants={itemVariants}
                className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto"
              >
                Discover our premium collection of natural skincare products designed to nourish and rejuvenate your skin.
              </motion.p>
              <motion.div variants={itemVariants}>
                <Link 
                  href="/product" 
                  className="inline-block bg-white/90 hover:bg-white text-amber-800 font-medium px-8 py-3 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1"
                >
                  Shop Now
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* Features Section */}
        <section className="relative z-10 -mt-16 md:-mt-20 px-4">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {heroFooter.map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  viewport={{ once: true }}
                  className="bg-white/80 backdrop-blur-lg rounded-xl p-6 shadow-lg border border-white/20"
                >
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-amber-100/50 rounded-full">
                      {React.cloneElement(item.icon, { className: "w-6 h-6 text-amber-700" })}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-gray-800">{item.title}</h3>
                      <p className="text-gray-600 text-sm mt-1">{item.label}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* New Arrivals */}
        <section className="py-16 md:py-24 px-4">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <motion.h2 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
              >
                New Arrivals
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                viewport={{ once: true }}
                className="text-gray-600 max-w-2xl mx-auto"
              >
                Discover our latest collection of premium skincare products
              </motion.p>
            </div>
            <NewArrival />
          </div>
        </section>

        {/* Parallax Banner */}
        <section className="relative h-[400px] md:h-[500px] overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-fixed"
            style={{ backgroundImage: "url('/banner.jpeg')" }}
          ></div>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
          <div className="relative z-10 h-full flex items-center justify-center px-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center max-w-3xl mx-auto"
            >
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                Elevate Your Beauty Routine
              </h2>
              <p className="text-lg md:text-xl text-white/90 mb-8">
                Embrace a radiant, youthful glow with our carefully crafted formulas
              </p>
              <Link 
                href="/product" 
                className="inline-block bg-white/20 hover:bg-white/30 text-white font-medium px-8 py-3 rounded-full transition-all duration-300 border border-white/30 backdrop-blur-md hover:shadow-lg"
              >
                Discover More
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-16 md:py-24 px-4 bg-white/50">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <motion.h2 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
              >
                Shop By Category
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                viewport={{ once: true }}
                className="text-gray-600 max-w-2xl mx-auto"
              >
                Find the perfect products for your skincare needs
              </motion.p>
            </div>
            <Category />
          </div>
        </section>

        {/* Second Parallax Banner */}
        <section className="relative h-[400px] overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-fixed"
            style={{ backgroundImage: "url('/banner2.jpg')" }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30 backdrop-blur-sm"></div>
          <div className="relative z-10 h-full flex items-center px-6 md:px-12">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="max-w-xl"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Grow Your Skin With Natural Products
              </h2>
              <p className="text-lg text-white/90 mb-8">
                Our plant-based formulas work in harmony with your skin's natural biology
              </p>
              <Link 
                href="/product" 
                className="inline-block bg-amber-600 hover:bg-amber-700 text-white font-medium px-8 py-3 rounded-full transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Explore
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-16 md:py-24 px-4 bg-gradient-to-b from-white to-[#fff9f5]">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <motion.h2 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
              >
                Our Best Sellers
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                viewport={{ once: true }}
                className="text-gray-600 max-w-2xl mx-auto"
              >
                Loved by thousands of customers worldwide
              </motion.p>
            </div>
            <HomeProducts />
          </div>
        </section>
      </div>
    </>
  );
}