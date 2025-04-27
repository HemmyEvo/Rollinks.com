import { FacebookIcon, Github, InstagramIcon, Linkedin, Twitter } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const Footer = async () => {
  const icon = [
    {
        path:'https://www.facebook.com/profile.php?id=100084631813516',
        icon:<FacebookIcon className="w-5 h-5" />
    },
    {
        path:'https://x.com/Hemmyevo?t=mMX6xoH_0SJs6pL8bLYblQ&s=09',
        icon:<Twitter className="w-5 h-5" />
    },
    {
        path:'https://www.instagram.com/hemmy_evo?igsh=M2Q1eTNra2x4c3o4',
        icon: <InstagramIcon className="w-5 h-5" />
    },
    {
        path:'https://www.linkedin.com/in/atilola-emmanuel-99964b324?utm_source=sare&utm_campaign=share_via&utm_content=profile&utm_medium=android_app',
        icon: <Linkedin className="w-5 h-5" />
    },
  ]

  return (
    <div className="pt-10 px-8 overflow-hidden relative">
      <div className="absolute inset-0 bg-white/10 backdrop-blur-lg z-[-1]" />
      
      <div className="mx-auto w-full p-1">
        <hr className="my-4 border-white/20" />
        
        <div className="md:flex space-y-6 md:space-y-0 justify-center md:px-10 items-center w-full md:items-center md:justify-between">
          <p className="text-sm text-white/80 text-center">
            © 2024 <Link href="https://Hemmyevo.vercel.app" className="hover:underline hover:text-white transition-colors">HemmyEvo™</Link>. All Rights Reserved.
          </p>

          <div className="flex mt-4 justify-center space-x-5 sm:mt-0">
            {icon.map((list,i) => (
              <Link 
                key={i} 
                href={list.path} 
                className="text-white/70 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10"
                target="_blank"
                rel="noopener noreferrer"
              >
                {list.icon}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Footer