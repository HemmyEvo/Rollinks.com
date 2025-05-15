"use client";
import { Leaf, HandCoins, Truck } from "lucide-react";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import NewArrival from "./(roots)/_components/NewArrival";
import HomeProducts from "./(roots)/_components/HomeProducts";
import Category from "./(roots)/_components/Category";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [displayText, setDisplayText] = useState("");
  const fullText = "Welcome to Rollinks Skincare!";

  useEffect(() => {
    const animateText = () => {
      let currentIndex = 0;
      const interval = setInterval(() => {
        if (currentIndex <= fullText.length) {
          setDisplayText(fullText.substring(0, currentIndex));
          currentIndex++;
        } else {
          clearInterval(interval);
          checkAssetsLoaded();
        }
      }, 100);
    };

    const checkAssetsLoaded = () => {
      const images = Array.from(document.images);
      
      if(images.length !== 0){
      setTimeout(() => setIsLoading(false), 1500);
}
      let loadedCount = 0;
      const imageLoadPromises = images.map((img) => {
        console.log(img)
        if (img.complete) {
          loadedCount++;
          return Promise.resolve();
        }
        return new Promise<void>((resolve) => {
          img.addEventListener("load", () => {
            loadedCount++;
            resolve();
          });
          img.addEventListener("error", () => resolve());
        });
      });

      Promise.all(imageLoadPromises).then(() => {
        setTimeout(() => setIsLoading(false), 1500);
      });
    };

    const speakWelcome = () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        // Mobile-friendly speech synthesis with user gesture requirement
        const handleUserInteraction = () => {
          const speech = new SpeechSynthesisUtterance(fullText);
          speech.volume = 1;
          speech.rate = 0.9;
          speech.pitch = 1.1;

          // Mobile browsers often require this to work
          window.speechSynthesis.cancel();
          
          speech.onstart = animateText;
          speech.onend = checkAssetsLoaded;
          window.speechSynthesis.speak(speech);

          // Remove the event listener after first interaction
          document.removeEventListener("click", handleUserInteraction);
          document.removeEventListener("touchstart", handleUserInteraction);
        };

        // Add event listeners for both click and touch
        document.addEventListener("click", handleUserInteraction);
        document.addEventListener("touchstart", handleUserInteraction);

        // Fallback in case no interaction occurs
        const fallbackTimer = setTimeout(() => {
          document.removeEventListener("click", handleUserInteraction);
          document.removeEventListener("touchstart", handleUserInteraction);
          animateText();
          checkAssetsLoaded();
        }, 3000);

        return () => clearTimeout(fallbackTimer);
      } else {
        animateText();
        checkAssetsLoaded();
      }
    };

    speakWelcome();

    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);
  const heroFooter = [
    {
      icon: <Leaf className="w-6 h-6" />,
      title: "Naturally Derived",
      label: "Natural and organic beauty products",
    },
    {
      icon: <Truck className="w-6 h-6" />,
      title: "Free Shipping",
      label: "Enjoy free shipping on orders of 5+ products delivered to Lautech Campus!",
    },
    {
      icon: <HandCoins className="w-6 h-6" />,
      title: "Secure Payment",
      label: "Fully protected while paying online",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  };

  return (
    <div className={`${isLoading ? 'overflow-hidden':''}`}>
      {/* Enhanced Loading Screen */}
      {isLoading && (
        <div className="fixed overflow-hidden inset-0 z-50 bg-white flex flex-col items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="relative w-64 h-64 mb-8"
          >
            {/* Animated logo/brand mark */}
            <motion.div
              animate={{
                rotate: [0, 5, -5, 0],
                scale: [1, 1.03, 1],
              }}
              transition={{
                repeat: Infinity,
                repeatType: "mirror",
                duration: 3,
                ease: "easeInOut",
              }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="w-40 h-40 rounded-full bg-amber-50 flex items-center justify-center shadow-inner">
                <Leaf className="w-20 h-20 text-amber-600" />
              </div>
            </motion.div>

            {/* Progress ring */}
            <motion.svg
              className="absolute inset-0"
              viewBox="0 0 64 64"
              initial={{ rotate: -90 }}
            >
              <motion.circle
                cx="32"
                cy="32"
                r="30"
                fill="none"
                strokeWidth="2"
                strokeLinecap="round"
                stroke="#FBBF24"
                strokeDasharray="188.5"
                strokeDashoffset="188.5"
                animate={{ strokeDashoffset: 0 }}
                transition={{ duration: 3, ease: "linear" }}
              />
            </motion.svg>
          </motion.div>

          <div className="text-center max-w-md px-4">
            <motion.h1
              key={displayText}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl font-bold text-gray-800 mb-2"
            >
              {displayText}
              <motion.span
                animate={{ opacity: [0, 1, 0] }}
                transition={{
                  repeat: Infinity,
                  duration: 1.5,
                }}
                className="ml-1"
              >
                |
              </motion.span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-gray-500 text-sm"
            >
              Loading assets...
            </motion.p>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div
        className={`relative overflow-x-hidden bg-gradient-to-b from-[#fff9f5] to-white ${
          isLoading ? "opacity-0 overflow-y-hidden" : "opacity-100 transition-opacity duration-500"
        }`}
      >
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
            
            <Category />
          </div>
        </section>

        {/* Second Parallax Banner */}
        <section className="relative h-[400px] overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-fixed"
            style={{ backgroundImage: "url('/banner.jpeg')" }}
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
          
            <HomeProducts />
          </div>
        </section>
      </div>
    </div>
  );
}