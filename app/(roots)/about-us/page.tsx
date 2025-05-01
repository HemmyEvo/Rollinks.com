import React from 'react';
import { motion } from 'framer-motion';

const AboutUsPage = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const headingVariants = {
    hidden: { scale: 0.95, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "backOut"
      }
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="font-sans p-8 max-w-4xl mx-auto"
    >
      <motion.h1 
        variants={headingVariants}
        className="text-center text-4xl font-extrabold text-gray-900 mb-12"
      >
        About <span className="text-indigo-600">Rollinks</span> Skincare
      </motion.h1>

      <motion.div className="space-y-8" variants={containerVariants}>
        <motion.p variants={itemVariants} className="text-lg leading-relaxed text-gray-700">
          Welcome to Rollinks Skincare, your premier destination for exceptional skincare solutions. 
          We're committed to delivering premium, eco-conscious products that combine scientific 
          innovation with nature's finest ingredients. Our philosophy centers on three core principles: 
          <span className="font-semibold"> efficacy, sustainability,</span> and <span className="font-semibold">inclusivity</span>.
        </motion.p>

        <motion.div variants={itemVariants} className="bg-indigo-50 p-6 rounded-lg border-l-4 border-indigo-500">
          <h3 className="text-xl font-bold text-indigo-700 mb-3">Our Origin Story</h3>
          <p className="text-lg leading-relaxed text-gray-700">
            Founded in 2025 by Rolake, a skincare visionary, Rollinks began as a passion project 
            dedicated to solving complex skin concerns through clean, sustainable formulations. 
            What started in a small home laboratory has blossomed into a globally recognized brand, 
            thanks to our uncompromising quality standards and customer-first approach.
          </p>
        </motion.div>

        <motion.div variants={itemVariants} className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-gray-800 mb-3">Our Commitment</h3>
            <p className="text-gray-700">
              We meticulously source ingredients from ethical suppliers who meet our rigorous 
              sustainability criteria. Each product undergoes extensive testing to ensure 
              both performance and skin compatibility.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-gray-800 mb-3">Our Promise</h3>
            <p className="text-gray-700">
              Your skin's health is our priority. Our dermatologist-approved formulas 
              are free from harmful additives, cruelty-free, and designed to deliver 
              visible, lasting results.
            </p>
          </div>
        </motion.div>

        <motion.p variants={itemVariants} className="text-lg leading-relaxed text-gray-700">
          What sets Rollinks apart is our <span className="font-semibold">bespoke approach</span> to skincare. 
          We recognize that skin needs vary by individual, climate, and lifestyle. 
          Our product development team continuously innovates to address these diverse 
          requirements through cutting-edge research.
        </motion.p>

        <motion.div 
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-r from-indigo-500 to-purple-600 p-8 rounded-xl text-white"
        >
          <h3 className="text-2xl font-bold mb-4">Join Our Skincare Revolution</h3>
          <p className="mb-4">
            We're proud to serve a global community of skincare enthusiasts who value 
            both results and responsibility. As we grow, we remain steadfast in our 
            commitment to environmental stewardship and product excellence.
          </p>
          <button className="px-6 py-2 bg-white text-indigo-600 font-medium rounded-lg hover:bg-gray-50 transition">
            Meet Our Team
          </button>
        </motion.div>

        <motion.p 
          variants={itemVariants}
          className="text-lg leading-relaxed text-gray-700"
        >
          We invite you to experience the Rollinks difference. For personalized recommendations 
          or inquiries, our skincare specialists are available at:
        </motion.p>

        <motion.div 
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 items-center"
        >
          <a 
            href="tel:07010331943" 
            className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
          >
            <PhoneIcon className="w-5 h-5" />
            +234 701 033 1943
          </a>
          <a 
            href="mailto:info@rollinks.com" 
            className="px-6 py-3 border border-gray-300 font-medium rounded-lg hover:bg-gray-50 transition flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
          >
            <MailIcon className="w-5 h-5" />
            atilolaemmanuel22@gmail.com
          </a>
        </motion.div>

        <motion.p 
          variants={itemVariants}
          className="text-lg mt-8 italic text-gray-600"
        >
          With gratitude,
          <br />
          <span className="font-bold text-gray-800">The Rollinks Team</span>
        </motion.p>
      </motion.div>
    </motion.div>
  );
};

// Simple icon components (you can replace with actual icons from your preferred library)
const PhoneIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M3 2h18a1 1 0 011 1v18a1 1 0 01-1 1H3a1 1 0 01-1-1V3a1 1 0 011-1zm17 8.67V4H4v6.67l5-3 5 3 5-3 3 1.67z"/>
  </svg>
);

const MailIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M3 3h18a1 1 0 011 1v16a1 1 0 01-1 1H3a1 1 0 01-1-1V4a1 1 0 011-1zm9 12l-7-5v10h14V10l-7 5zm0-2l7-5H5l7 5z"/>
  </svg>
);

export default AboutUsPage;