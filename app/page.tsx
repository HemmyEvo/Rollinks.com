"use client"
import { Baby, HandCoins, Leaf, PersonStanding, Smile, Truck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import ProductCard from "./(roots)/_components/ProductCard";
import {motion, stagger} from "framer-motion"
export default function Home() {
  React.useEffect(() => {
   
    if(window.document.fonts.status !== 'loaded') return 
  }, []);
  const heroFooter = [
    {icon:<Leaf className="md:w-8 md:h-8"/>, title:"Naturally Derived" , label:"natural and organic beauty product"},
    {icon:<Truck className="md:w-8 md:h-8"/>, title:"Free shipping" , label:"free shipping on all order's over $99"},
    {icon:<HandCoins className="md:w-8 md:h-8"/>, title:"secure payment" , label:"Fully protected while paying online"},
  ]
  const category = [
    {icon:<PersonStanding />, label:"Men"},
    {icon:<PersonStanding />, label:"Women"},
    {icon:<Baby/>, label:"Kids"},
    {icon:<Smile />, label:"Face wash"},
  ]
  const containerVariant= {
    hidden:{
      x: "-100vw"
    },
    visible:{
      x: 0,
      transition:{
        type:'spring',
        staggerChildren: 0.4
      }
    },
  }
  const childVariant = {
    hidden:{
      opacity: 0
    },
    visible:{
      opacity: 1,
    
    }
  }
  return (
  <div className="relative overflow-x-hidden">


    {/* Hero */}
   <section className="hero w-full px-4 flex flex-col items-center relative justify-center bg-cover bg-center h-[calc(90vh-56px)]" style={{backgroundImage: "url('/heroBkg.jpg')"}}>
   <div className="overlay absolute top-0  bottom-0 left-0 right-0  bg-[#4d240d70]"></div>
   <motion.div variants={containerVariant} animate="visible" initial="hidden" className="text-cont flex items-center flex-col justify-center z-30 max-w-prose leading-none">
   <motion.p variants={childVariant} animate="visible" initial="hidden" className="text-white font-medium  text-center text-2xl">Indulge your skin with our Luxrious range of skincare product</motion.p>
   <motion.button variants={childVariant} animate="visible" initial="hidden" className="mt-10 bg-[orange] text-white px-4 py-2 z-30 rounded-full shadow-md shadow-[#be975c]"><Link href={'/product'}>Shop Now</Link></motion.button>
   </motion.div>
   </section>


    {/* Hero Footer  */}
  <section className="hero-footer px-10 min-h-[calc(20vh-56px)] flex justify-center items-center  w-full">
    <div className=" h-full flex max-[600px]:flex-col  min-[600px]:space-x-6 min-[791px]:space-x-20">
        {heroFooter.map((list,i) => (
          <div key={i} className="flex space-x-4 max-[600px]:py-3 items-center">
            <div className="icon ">{list.icon}</div>
            <div className="text">
              <p className="uppercase  max-[791px]:text-[12px] text-sm font-semibold">{list.title}</p>
              <p className="text-xs capitalize text-[#696969]">{list.label}</p>
            </div>
          </div>
        ))}
    </div>
  </section>


    {/* new-arrival  */}
  <section className="new-arrival bg-[#d3d2d2]  px-12 pb-[30px] pt-[56px] ">
      <header className="w-full text-center">
        <p className="font-[gerald] text-[30px]">For your Beauty</p>
        <p className="font-bold text-4xl">New Arrival</p>
      </header>
      <main className="md:max-w-4xl mt-10 grid lg:grid-cols-4 min-[509px]:grid-cols-2 gap-4 min-[712px]:grid-cols-3 grid-cols-1  mx-auto">
      <ProductCard id={1} title="Face wash" image={"/image 5.jpg"} price={500} rating={4} discount={600} />
        <ProductCard id={2} title="Make up" image={"/image 3.png"} price={500} rating={4} discount={600} />
        <ProductCard id={3} title="Body cream" image={"/image (2).png"} price={500} rating={4} discount={600} />
        <ProductCard id={4} title="Baby cream" image={"/image (4).png"} price={500} rating={4} discount={600} />
        <ProductCard id={5} title="Make up" image={"/images (17).jpeg"} price={500} rating={4} discount={600} />
        <ProductCard id={6} title="Maemo" image={"/images (20).jpeg"} price={500} rating={4} discount={600} />
        <ProductCard id={7} title="Foot cream" image={"/images (19).jpeg"} price={500} rating={4} discount={600} />
        <ProductCard id={8} title="Meamo" image={"/images (20).jpeg"} price={500} rating={4} discount={600} />
      </main>
  </section>

  {/* Banner  */}

  <section className="w-full  h-[40vh] flex items-center justify-center relative bg-center bg-cover bg-fixed" style={{backgroundImage: "url('/banner.jpeg')"}}>
  <div className="overlay absolute top-0  bottom-0 left-0 right-0  bg-[#1818185e]"></div>
  <p className="capitalize z-40 font-[gerald] text-4xl text-center text-[#ffc595]">Elevate your beauty routine and embrace a radiant, youth glow!</p>
  </section>


  {/* category */}
  <section className="pb-[30px] pt-[56px] px-12 bg-[#d3d2d2]">
  <header className="w-full md:max-w-4xl mx-auto space-y-5   text-center">
    <div className="label flex items-center space-x-4">
      <Image src={"/Rectangle 18.png"} width={12} height={12} alt=""/>
      <p className="text-sm text-[#DB4444]">Categories</p>
    </div>
    <div className="title text-xl  text-left font-semibold">
        <p>Browse By Category</p>
    </div>
      </header>
      <main className=" mt-10 max-w-4xl  overflow-hidden mx-auto ">
        <div className="h-28   flex  w-fit   space-x-7">
          {category.map((list,i) =>
          <div key={i} className="h-full w-28 flex items-center justify-center space-y-4 flex-col cursor-pointer bg-[#e0e0e0] shadow-inner  border-2 rounded-xl border-[gray]">

            <div className="icon">{list.icon}</div>
            <p className="text-[#646464]">{list.label}</p>
          </div>
          )}
        </div>
      </main>
  </section>

  {/* Banner  */}
  <section className="w-full shadow-xl h-[40vh] flex items-center justify-center relative bg-center bg-cover bg-fixed" style={{backgroundImage: "url('/banner.jpeg')"}}>
 
  <p className="capitalize z-40 font-[gerald] text-4xl text-center text-[#ffc595]">
  Grow your skin with natural products
  </p>
  <div className="overlay absolute top-0  bottom-0 left-0 right-0  bg-[#1818185e]"></div>
  </section>

    {/* Products  */}
    <section className="new-arrival bg-[#d3d2d2]  px-12 py-[56px] ">
    <header className="w-full md:max-w-4xl mx-auto space-y-5   text-center">
    <div className="label flex items-center space-x-4">
      <Image src={"/Rectangle 18.png"} width={12} height={12} alt=""/>
      <p className="text-sm text-[#DB4444] capitalize">our products</p>
    </div>
    <div className="title text-xl  text-left font-semibold">
        <p>Explore Our Products</p>
    </div>
      </header>
      <main className="md:max-w-4xl mt-10 grid lg:grid-cols-4 min-[509px]:grid-cols-2 gap-4 min-[712px]:grid-cols-3 grid-cols-1  mx-auto">
       
        <ProductCard id={1} title="Face wash" image={"/image 5.jpg"} price={1500} rating={4} discount={600} />
        <ProductCard id={2} title="Make up" image={"/image 3.png"} price={1500} rating={4} discount={600} />
        <ProductCard id={3} title="Body cream" image={"/image (2).png"} price={1500} rating={4} discount={600} />
        <ProductCard id={4} title="Baby cream" image={"/image (4).png"} price={1500} rating={4} discount={600} />
        <ProductCard id={5} title="Make up" image={"/images (17).jpeg"} price={1500} rating={4} discount={600} />
        <ProductCard id={6} title="Maemo" image={"/images (20).jpeg"} price={1500} rating={4} discount={600} />
        <ProductCard id={7} title="Foot cream" image={"/images (19).jpeg"} price={1500} rating={4} discount={600} />
        <ProductCard id={8} title="Meamo" image={"/images (20).jpeg"} price={1500} rating={4} discount={600} />
       
      </main>
          <div className="flex justify-center mt-10">
          <Link href={"/product"}><button className="px-5 py-3 rounded-2xl bg-[goldenrod] shadow-md">View All Products</button></Link>
          </div>
  </section>


  </div>
  );
}
