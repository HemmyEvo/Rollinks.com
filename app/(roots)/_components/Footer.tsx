
import { FacebookIcon, Github, InstagramIcon, Linkedin, Twitter } from 'lucide-react'
import Link from 'next/link'

import React from 'react'

const Footer = async () => {
  const icon = [
    {
        path:'https://www.facebook.com/profile.php?id=100084631813516',
        icon:<FacebookIcon />
    },
    {
        path:'https://x.com/Hemmyevo?t=mMX6xoH_0SJs6pL8bLYblQ&s=09',
        icon:<Twitter />
    },
    {
        path:'https://www.instagram.com/hemmy_evo?igsh=M2Q1eTNra2x4c3o4',
        icon: <InstagramIcon />
    },
    {
        path:'https://www.linkedin.com/in/atilola-emmanuel-99964b324?utm_source=sare&utm_campaign=share_via&utm_content=profile&utm_medium=android_app',
        icon: <Linkedin />
    },
 
]
  
  return (
    
   
    <div className="pt-10 bg-[#da9020] text-[white] px-8 overflow-hidden">
        <div className="mx-auto w-full   p-1">
       
          <hr className="my-4 border-gray-200 sm:mx-auto dark:border-gray-700 " />
          <div className="md:flex space-y-6 md:space-y-0 justify-center md:px-10 items-center w-full  md:items-center md:justify-between">
              <p className="text-sm text-gray-500 text-center  dark:text-gray-400">© 2024 <Link href="https://Hemmyevo.vercel.app" className="hover:underline">HemmyEvo™</Link>. All Rights Reserved.
              </p>
    
              <div className="flex mt-4 justify-center space-x-5 sm:mt-0">
                {icon.map((list,i) =>  <Link key={i} href={list.path} className="text-gray-500 hover:text-gray-900 dark:hover:text-white ">
                   {list.icon}
                  </Link> )}
                  
              </div>
          </div>
        </div>
    </div>
    

 
  )
}

export default Footer