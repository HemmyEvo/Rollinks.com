"use client"
import { FacebookIcon, Github, InstagramIcon, Linkedin, Twitter, Mail, Phone } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { motion } from 'framer-motion'

const Footer = () => {
  const socialIcons = [
    {
      path: 'https://www.facebook.com/profile.php?id=100084631813516',
      icon: <FacebookIcon className="w-5 h-5" />,
      name: 'Facebook'
    },
    {
      path: 'https://x.com/Hemmyevo?t=mMX6xoH_0SJs6pL8bLYblQ&s=09',
      icon: <Twitter className="w-5 h-5" />,
      name: 'Twitter'
    },
    {
      path: 'https://www.instagram.com/hemmy_evo?igsh=M2Q1eTNra2x4c3o4',
      icon: <InstagramIcon className="w-5 h-5" />,
      name: 'Instagram'
    },
    {
      path: 'https://www.linkedin.com/in/atilola-emmanuel-99964b324',
      icon: <Linkedin className="w-5 h-5" />,
      name: 'LinkedIn'
    },
  ]

  const footerLinks = [
    {
      title: "Shop",
      links: [
        { name: "All Products", href: "/product" },
        { name: "Featured", href: "#" },
        { name: "New Arrivals", href: "#" },
        { name: "Sale Items", href: "" },
      ]
    },
    {
      title: "Company",
      links: [
        { name: "About Us", href: "/about-us" },
        { name: "Our Story", href: "#" },
        { name: "Careers", href: "#" },
        { name: "Press", href: "#" },
      ]
    },
    {
      title: "Support",
      links: [
        { name: "Contact Us", href: "/contact" },
        { name: "FAQs", href: "#" },
        { name: "Shipping", href: "#" },
        { name: "Returns", href: "#" },
      ]
    }
  ]

  return (
    <footer className="relative bg-amber-900/90 backdrop-blur-lg text-white border-t border-amber-800/30">
      <div className="container mx-auto px-4 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand info */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <Link href="/" className="text-2xl font-bold text-amber-100 flex items-end">
              <span className="text-3xl text-amber-300">R</span>ollinks
            </Link>
            <p className="text-amber-100/80 text-sm">
              Premium quality products with a heritage of craftsmanship and timeless design.
            </p>

            <div className="flex space-x-4 pt-2">
              {socialIcons.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -3, scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="text-amber-100 hover:text-white transition-colors p-2 rounded-full hover:bg-amber-800/50"
                  aria-label={social.name}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Footer links */}
          {footerLinks.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <h3 className="text-lg font-semibold text-amber-200">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <motion.li 
                    key={linkIndex}
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Link 
                      href={link.href} 
                      className="text-amber-100/80 hover:text-amber-50 text-sm transition-colors"
                    >
                      {link.name}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}

          {/* Contact info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <h3 className="text-lg font-semibold text-amber-200">Contact Us</h3>
            <div className="space-y-3 text-sm text-amber-100/80">
              <motion.div 
                whileHover={{ x: 5 }}
                className="flex items-start space-x-3"
              >
                <Mail className="w-4 h-4 mt-0.5 flex-shrink-0 text-amber-200" />
                <a href="mailto: sukuratopeyemi17@gmail.com" className="hover:text-amber-50 transition-colors">
                  sukuratopeyemi17@gmail.com
                </a>
              </motion.div>
              <motion.div 
                whileHover={{ x: 5 }}
                className="flex items-start space-x-3"
              >
                <Phone className="w-4 h-4 mt-0.5 flex-shrink-0 text-amber-200" />
                <a href="tel:+2347053142223" className="hover:text-amber-50 transition-colors">
                  +234 705 314 2223
                </a>
              </motion.div>
              <p className="pt-2">
                Lautech,<br />
                Ogbomosho<br />
                Oyo state, Nigeria
              </p>
            </div>
          </motion.div>
        </div>

        {/* Bottom section */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16 pt-8 border-t border-amber-800/30"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-amber-100/60 text-center md:text-left">
              © {new Date().getFullYear()} Rollinks. All rights reserved.
            </p>

            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs">
              <Link href="/privacy" className="text-amber-100/60 hover:text-amber-50 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-amber-100/60 hover:text-amber-50 transition-colors">
                Terms of Service
              </Link>
              <Link href="/cookies" className="text-amber-100/60 hover:text-amber-50 transition-colors">
                Cookie Policy
              </Link>
              <Link href="/sitemap" className="text-amber-100/60 hover:text-amber-50 transition-colors">
                Sitemap
              </Link>
            </div>
          </div>

          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            viewport={{ once: true }}
            className="mt-6 text-xs text-amber-100/40 text-center"
          >
            Crafted with passion by <a href="https://hemmyevo.vercel.app" target="_blank" rel="noopener noreferrer" className="hover:text-amber-100/80 transition-colors">HemmyEvo</a>
          </motion.p>
        </motion.div>
      </div>
    </footer>
  )
}

export default Footer