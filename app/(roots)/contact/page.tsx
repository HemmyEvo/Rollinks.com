'use client'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import 'tailwindcss/tailwind.css'
import { useState } from 'react'

const page = () => {

  const [isSending, setIsSending] = useState(false)

  const handleSendClick = () => {
    setIsSending(true)
    // Simulate sending process
    setTimeout(() => {
      setIsSending(false)
    }, 2000)
  }
  return (
    <motion.div 
      className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-4xl font-bold mb-4 text-gray-800">Contact Us</h1>
      <form className="w-full max-w-lg bg-white p-8 rounded-lg shadow-md">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="name">
            Name
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="name"
            type="text"
            placeholder="Your name"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="email">
            Email
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="email"
            type="email"
            placeholder="Your email"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="message">
            Message
          </label>
          <textarea
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="message"
            placeholder="Your message"
            rows={4}
          />
        </div>
        <div className="flex items-center justify-between">
            <motion.div
            initial={{ scale: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300 }}
            >
            {!isSending ? (
              <Button
              onClick={handleSendClick}
              className="bg-[#e09d22dc] hover:bg-[#d08c1fdc] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
              >
              Send
              </Button>
            ) : (
              <Button
              className="bg-black text-green-600 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
             
              >
              Sent
              <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="ml-2"
              >
              <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
              </svg>
              </motion.div>
              </Button>
            )}
            </motion.div>
        </div>
      </form>
    </motion.div>
  )
}

export default page