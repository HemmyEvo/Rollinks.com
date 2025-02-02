"use client";
import { Baby, HandCoins, Leaf, PersonStanding, Smile, Truck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { motion } from "framer-motion";
import NewArrival from "./(roots)/_components/NewArrival";
import HomeProducts from "./(roots)/_components/HomeProducts";
import Category from "./(roots)/_components/Category";



export default function Home() {


  const heroFooter = [
    {
      icon: <Leaf className="md:w-8 md:h-8" />,
      title: "Naturally Derived",
      label: "natural and organic beauty product",
    },
    {
      icon: <Truck className="md:w-8 md:h-8" />,
      title: "Free shipping",
      label: "free shipping on all order's over $99",
    },
    {
      icon: <HandCoins className="md:w-8 md:h-8" />,
      title: "secure payment",
      label: "Fully protected while paying online",
    },
  ];


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
    <div className="relative overflow-x-hidden">
      {/* Hero Section */}
      <section
        className="hero w-full px-4 flex flex-col items-center relative justify-center bg-cover bg-center h-[calc(90vh-56px)]"
        style={{ backgroundImage: "url('/heroBkg.jpg')" }}
      >
        <div className="overlay absolute top-0 bottom-0 left-0 right-0 bg-[#4d240d70]"></div>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-cont flex items-center flex-col justify-center z-30 max-w-prose leading-none"
        >
          <motion.p variants={itemVariants} initial="closed" whileInView="open" className="text-white font-medium text-center text-2xl">
            Indulge your skin with our Luxurious range of skincare product
          </motion.p>
          <motion.button variants={itemVariants} initial="closed" whileInView="open" className="mt-10 bg-[orange] text-white px-4 py-2 z-30 rounded-full shadow-md shadow-[#be975c]">
            <Link href="/product">Shop Now</Link>
          </motion.button>
        </motion.div>
      </section>

      {/* Hero Footer */}
      <section className="hero-footer px-10 min-h-[calc(20vh-56px)] flex justify-center items-center w-full">
        <div className="h-full flex max-[600px]:flex-col min-[600px]:space-x-6 min-[791px]:space-x-20">
          {heroFooter.map((item, i) => (
            <div key={i} className="flex space-x-4 max-[600px]:py-3 items-center">
              <div className="icon">{item.icon}</div>
              <div className="text">
                <p className="uppercase max-[791px]:text-[12px] text-sm font-semibold">{item.title}</p>
                <p className="text-xs capitalize text-[#696969]">{item.label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
        <NewArrival/>

      {/* Banner */}
      <section
        className="w-full h-[40vh] flex items-center justify-center relative bg-center bg-cover bg-fixed"
        style={{ backgroundImage: "url('/banner.jpeg')" }}
      >
        <div className="overlay absolute top-0 bottom-0 left-0 right-0 bg-[#1818185e]"></div>
        <p className="capitalize z-40 font-[gerald] text-4xl text-center text-[#ffc595]">
          Elevate your beauty routine and embrace a radiant, youth glow!
        </p>
      </section>



      {/* Category */}
      <Category />

      {/* Second Banner */}
      <section
        className="w-full shadow-xl h-[40vh] flex items-center justify-center relative bg-center bg-cover bg-fixed"
        style={{ backgroundImage: "url('/banner.jpeg')" }}
      >
        <p className="capitalize z-40 font-[gerald] text-4xl text-center text-[#ffc595]">
          Grow your skin with natural products
        </p>
        <div className="overlay absolute top-0 bottom-0 left-0 right-0 bg-[#1818185e]"></div>
      </section>

      {/* Products */}
      <HomeProducts />
    </div>
  );
}
