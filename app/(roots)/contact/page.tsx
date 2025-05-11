'use client'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { Leaf,LeafyGreen, Mail, User, MessageSquare, Send } from 'lucide-react'
import { useState } from 'react'
import emailjs from 'emailjs-com'

const ContactPage = () => {
  const [isSending, setIsSending] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [contactMessage, setContactMessage] = useState('')

  const sendEmail = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSending(true)

    emailjs.sendForm('service_2gxwh09', 'template_lcap4pf', e.target as HTMLFormElement, '_A7yErceDiU4I-Ppb')
      .then(() => {
        setContactMessage('Message sent successfully ✅')
        setTimeout(() => setContactMessage(''), 5000)
        setName('')
        setEmail('')
        setMessage('')
      }, () => {
        setContactMessage('Message not sent (service error) ❌')
      })
      .finally(() => setIsSending(false))
  }

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-emerald-50 to-amber-50 p-4 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-full max-w-2xl">
        {/* Glass Card Container */}
        <div className="backdrop-blur-lg bg-white/80 rounded-3xl shadow-lg overflow-hidden border border-white/20">
          {/* Decorative Header */}
          <div className="bg-emerald-500/10 p-6 text-center border-b border-white/20">
            <div className="flex justify-center space-x-3 mb-3">
              <Leaf className="w-6 h-6 text-emerald-600" />
              <MessageSquare className="w-6 h-6 text-emerald-700" />
              <Leaf className="w-6 h-6 text-emerald-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800">
              Contact <span className="text-emerald-600">Rollinks</span>
            </h1>
            <p className="text-emerald-700 mt-1">We'd love to hear from you</p>
          </div>

          {/* Form Content */}
          <form onSubmit={sendEmail} className="p-6 md:p-8 space-y-6">
            {/* Name Field */}
            <div className="backdrop-blur-sm bg-white/60 p-4 rounded-xl border border-white/30 shadow-sm">
              <label className="block text-gray-700 text-sm font-semibold mb-2 flex items-center gap-2">
                <User className="w-4 h-4 text-emerald-600" />
                Your Name
              </label>
              <input
                className="w-full bg-white/50 border border-white/50 rounded-lg py-2 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-300"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                type="text"
                placeholder="Enter your name"
                required
              />
            </div>

            {/* Email Field */}
            <div className="backdrop-blur-sm bg-white/60 p-4 rounded-xl border border-white/30 shadow-sm">
              <label className="block text-gray-700 text-sm font-semibold mb-2 flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-600" />
                Email Address
              </label>
              <input
                className="w-full bg-white/50 border border-white/50 rounded-lg py-2 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-300"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                required
              />
            </div>

            {/* Message Field */}
            <div className="backdrop-blur-sm bg-white/60 p-4 rounded-xl border border-white/30 shadow-sm">
              <label className="block text-gray-700 text-sm font-semibold mb-2 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-600" />
                Your Message
              </label>
              <textarea
                className="w-full bg-white/50 border border-white/50 rounded-lg py-2 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-300 min-h-[120px]"
                name="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="How can we help you?"
                required
              />
            </div>

            {/* Submit Button */}
            <motion.div
              className="flex justify-center"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 px-6 rounded-full shadow-md transition-all flex items-center gap-2"
                type="submit"
                disabled={isSending}
              >
                {isSending ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send Message
                  </>
                )}
              </Button>
            </motion.div>

            {/* Status Message */}
            {contactMessage && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`text-center p-3 rounded-lg ${contactMessage.includes('✅') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}
              >
                {contactMessage}
              </motion.div>
            )}

            {/* Footer */}
            <div className="text-center pt-4 border-t border-white/30">
              <p className="text-sm text-gray-600">
                Or reach us directly at <span className="font-medium text-emerald-700">07053142223</span>
              </p>
              <div className="flex justify-center mt-3 space-x-1">
                <Leaf className="w-4 h-4 text-emerald-600" />
                <LeafyGreen className="w-4 h-4 text-emerald-700" />
                <Leaf className="w-4 h-4 text-emerald-600" />
              </div>
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  )
}

export default ContactPage