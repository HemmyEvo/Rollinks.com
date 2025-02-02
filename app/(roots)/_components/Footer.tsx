import { Facebook, Instagram, Linkedin, MoveRight, Twitter } from 'lucide-react'
import React from 'react'

const Footer = () => {
  return (
    <div className='pt-10 bg-[#da9020] text-[white] px-8 overflow-hidden'>
        <div className="wrapper space-y-8 border-t py-6">
            <div className="top  flex flex-col sm:flex-row sm:justify-between sm:items-center">
                <div className="left  pt-9 sm:py-0 order-1">
                    <ul className='sm:flex uppercase text-sm space-y-5 sm:space-y-0 sm:space-x-4 items-center'>
                        <li>Contact </li>
                        <li>Terms of services </li>
                        <li>Shipping and returns</li>
                    </ul>
                </div>
            <div className="right-wrapper sm:order-2 space-y-4 sm:space-y-0">
                <div className="right-top  border-b-[#5e5e5e] border-b-2 py-2  flex space-x-20 justify-between items-center">
                    <input type="text" placeholder='Give an email, get the newsletter.' className=" bg-transparent  text-[white] placeholder:text-[#5e5e5e] outline-none w-[243px] px-1" />
                <MoveRight  className='text-[#5e5e5e]'/>
                </div>
                
    	        <div className="right-bottom sm:hidden flex  items-center space-x-2">
                    <input type="checkbox" className='cursor-pointer' name="email" id="email" />
                    <p>i agree to the website’s terms and conditions</p>
                </div>
                </div>
            </div>
            <div className="social-media sm:hidden flex space-x-5 items-center pt-2">
    	        <p className='text-[#5e5e5e]'>Follow us</p>
                <div className='flex space-x-2 items-center'>
                    <p className="line w-16 border border-[#5e5e5e]"></p>
                    <ul className='flex items-center space-x-3'>
                        <li><Facebook /></li>
                        <li><Instagram /> </li>
                        <li><Twitter /></li>
                    </ul>

                </div>
            </div>
            <div className="bottom flex sm:justify-between items-center">
                <div className="left text-sm">
                    <p>© <span className='text-[#5e5e5e]  cursor-pointer'>2024 Hemmyevo.</span> Terms of use <span className='text-[#5e5e5e]'>and</span> privacy policy.</p>
            
                </div>
                <div className="right hidden sm:flex">
                    <ul className='flex items-center space-x-6'>
                        <li className='cursor-pointer'><Linkedin /></li>
                        <li className='cursor-pointer'><Facebook /></li>
                        <li className='cursor-pointer'><Instagram /></li>
                        <li className='cursor-pointer'><Twitter /></li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Footer