'use client'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import 'tailwindcss/tailwind.css'
import { useState } from 'react'
import emailjs from 'emailjs-com' // Import emailjs

const page = () => {
  const [isSending, setIsSending] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [contactMessage, setContactMessage] = useState('') // State for success/error message

  const sendEmail = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSending(true)

    emailjs.sendForm('service_2gxwh09', 'template_aez9vka', e.target as HTMLFormElement, '683gBDmEpVhIeg7ET')
      .then(() => {
        setContactMessage('Message sent successfully ✅')
        setTimeout(() => {
          setContactMessage('')
        }, 5000)
        setName('')
        setEmail('')
        setMessage('')
      }, () => {
        setContactMessage('Message not sent (service error) ❌')
      })
      .finally(() => {
        setIsSending(false)
      })
  }

  return (
    <motion.div 
      className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-4xl font-bold mb-4 text-gray-800">Contact Us</h1>
      <form className="w-full max-w-lg bg-white p-8 rounded-lg shadow-md" onSubmit={sendEmail}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="name">
            Name
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="name"
            name="name"
            onChange={(e) => setName(e.target.value)}
            value={name}
            type="text"
            placeholder="Your name"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="email">
            Email
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="message">
            Message
          </label>
          <textarea
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="message"
            name="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Your message"
            rows={4}
            required
          />
        </div>
        <div className="flex items-center justify-between">
          <motion.div
            initial={{ scale: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Button
              className="bg-[#e09d22dc] hover:bg-[#d08c1fdc] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
              disabled={isSending}
            >
              {isSending ? 'Sending...' : 'Send'}
            </Button>
          </motion.div>
        </div>
        {contactMessage && (
          <div className="mt-4 text-center">
            <p className={contactMessage.includes('✅') ? 'text-green-600' : 'text-red-600'}>
              {contactMessage}
            </p>
          </div>
        )}
      </form>
    </motion.div>
  )
}

export default page
