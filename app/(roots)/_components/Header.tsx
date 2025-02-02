"use client"
import { Heart, LucideAlignRight, MenuIcon, Search, Settings, ShoppingCart, User, X } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
const Header = () => {
  React.useEffect(() => {
    if(window.document.fonts.status !== 'loaded') return 
  }, []);
  const [isToggle, setisToggle] = React.useState(false)
  console.log(isToggle)
  return (
    <div className="h-[56px] bg-[#b63333] relative">
      <div className='flex fixed inset-x-0 items-center py-2 z-50 bg-[#e09d22dc] justify-between px-8'>
        <p className="logo font-[gerald]  text-4xl flex items-end font-medium tracking-wider text-[#f0ebf0] ">
          <span className=' font-semibold text-[gold] '>R</span>ollinks
        </p>
        <section className='hidden space-x-4 items-center min-[874px]:flex '>
        <div className="menu-items space-x-3 text-[#ffecd7] text-sm">
        <Link className='hover:text-[#583e1be0]' href={"/"}>Home</Link>
            <Link className='hover:text-[#583e1be0]' href={"/product"}>Products</Link>
            <Link className='hover:text-[#583e1be0]' href={"/about-us"}>About</Link>
            <Link className='hover:text-[#583e1be0]' href={"/history"}>Transaction history</Link>
            <Link className='hover:text-[#583e1be0]' href={"/contact"}>Contact</Link>
       
        </div>
        <div className="search-bar flex items-center space-x-2 ">
          <input type="text" className='outline-none rounded-xl px-2 py-1 text-sm' placeholder='Search for products...' name="" id="" />
          <Search className='w-5 text-[#ffecd7] ' />
        </div>
        </section>
        <div className="icon space-x-2  flex">
          <div className="cart relative">
            <ShoppingCart />
          </div>
          <Heart />
          <User />
          <div className="menu max-[874px]:flex hidden">
            {!isToggle ?  <LucideAlignRight onClick={() => setisToggle(prev => !prev)} className='cursor-pointer'/> : <X onClick={() => setisToggle(prev => !prev)} className='cursor-pointer'/>}
          </div>
        </div>
        { isToggle &&(
          <div className={`fixed max-[874px]:flex hidden z-50 top-14 py-4 px-7 bg-[#070707da] bottom-0 left-0 right-0 `}>
          <div className="search relative h-full flex flex-col w-full">
          <div className="search-input overflow-hidden items-center flex px-4 w-full h-10 rounded-full bg-[#e2e2e2]">
            <input type="text" name="" className='flex-1 outline-none bg-transparent' placeholder='Search for products...' id="" />
            <Search />
          </div>
          <div className="bg-white relative flex-1 mt-2 w-full">
            <div className="absolute w-full top-0 bg-[#0080003a] hidden h-[50vh]"></div>
           <div className='flex flex-col px-5 py-10 space-y-5'>
           <Link onClick={() => setisToggle(prev => !prev)} className='hover:bg-[#583e1be0] hover:text-white bg-[gold] px-5 py-1 shadow-md rounded-full ' href={"/"}>Home</Link>
            <Link onClick={() => setisToggle(prev => !prev)} className='hover:bg-[#583e1be0] hover:text-white bg-[gold] px-5 py-1 shadow-md rounded-full' href={"/product"}>Products</Link>
            <Link onClick={() => setisToggle(prev => !prev)} className='hover:bg-[#583e1be0] hover:text-white bg-[gold] px-5 py-1 shadow-md rounded-full' href={"/about-us"}>About</Link>
            <Link onClick={() => setisToggle(prev => !prev)} className='hover:bg-[#583e1be0] hover:text-white bg-[gold] px-5 py-1 shadow-md rounded-full' href={"/history"}>Transaction history</Link>
            <Link onClick={() => setisToggle(prev => !prev)} className='hover:bg-[#583e1be0] hover:text-white bg-[gold] px-5 py-1 shadow-md rounded-full' href={"/contact"}>Contact</Link>
           </div>
           <div className="footer absolute w-full px-5 bottom-0">
           <p className="text-sm text-gray-500 text-center  dark:text-gray-400">© 2025 HemmyEvo™. All Rights Reserved.
           </p>
           </div>
          </div>
            </div>
          </div>
          )
        }
        
    </div>
    </div>
  )
}

export default Header