import React from 'react';
import { motion, Variants } from 'framer-motion';
import { Phone, Mail } from 'lucide-react';

interface AboutUsPageProps {
  // Add any props you need here
}

const AboutUsPage: React.FC<AboutUsPageProps> = () => {
  // Animation variants with proper typing
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants: Variants = {
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

  const headingVariants: Variants = {
    hidden: { scale: 0.95, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: [0.175, 0.885, 0.32, 1.275] // backOut easing
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
        {/* Section 1 */}
        <motion.p variants={itemVariants} className="text-lg leading-relaxed text-gray-700">
          Welcome to Rollinks Skincare, your premier destination for exceptional skincare solutions. 
          We're committed to delivering premium, eco-conscious products that combine scientific 
          innovation with nature's finest ingredients.
        </motion.p>

        {/* Section 2 */}
        <motion.div variants={itemVariants} className="bg-indigo-50 p-6 rounded-lg border-l-4 border-indigo-500">
          <h3 className="text-xl font-bold text-indigo-700 mb-3">Our Origin Story</h3>
          <p className="text-lg leading-relaxed text-gray-700">
            Founded in 2025 by Rolake, Rollinks began as a passion project 
            dedicated to solving complex skin concerns through clean formulations.
          </p>
        </motion.div>

        {/* Cards Section */}
        <motion.div variants={itemVariants} className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-gray-800 mb-3">Our Commitment</h3>
            <p className="text-gray-700">
              We source ingredients from ethical suppliers who meet our sustainability criteria.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-gray-800 mb-3">Our Promise</h3>
            <p className="text-gray-700">
              Your skin's health is our priority with dermatologist-approved formulas.
            </p>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div 
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-r from-indigo-500 to-purple-600 p-8 rounded-xl text-white"
        >
          <h3 className="text-2xl font-bold mb-4">Join Our Skincare Revolution</h3>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-2 bg-white text-indigo-600 font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            Meet Our Team
          </motion.button>
        </motion.div>

        {/* Contact Section */}
        <motion.div 
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 items-center"
        >
          <motion.a 
            href="tel:07010331943" 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
          >
            <Phone className="w-5 h-5" />
            +234 701 033 1943
          </motion.a>
          <motion.a 
            href="mailto:info@rollinks.com" 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 border border-gray-300 font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <Mail className="w-5 h-5" />
            info@rollinks.com
          </motion.a>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default AboutUsPage;