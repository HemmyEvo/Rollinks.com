import React from 'react';
import { Leaf, LeafyGreen, Gem, HeartHandshake, Globe, FlaskConical, Sparkles } from 'lucide-react';

type Props = {};

const AboutUsPage = (props: Props) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-amber-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Main Glass Card */}
        <div className="backdrop-blur-lg bg-white/80 rounded-3xl shadow-lg overflow-hidden border border-white/20">
          {/* Header with decorative elements */}
          <div className="bg-emerald-500/10 p-8 text-center border-b border-white/20">
            <div className="flex justify-center space-x-2 mb-4">
              <Leaf className="w-8 h-8 text-emerald-600" />
              <LeafyGreen className="w-8 h-8 text-emerald-700" />
              <Leaf className="w-8 h-8 text-emerald-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              About <span className="text-emerald-600">Rollinks</span> Skincare
            </h1>
            <p className="text-emerald-700 font-medium">Nature's Wisdom, Scientific Precision</p>
          </div>

          <div className="p-8 md:p-10 space-y-8">
            {/* Mission Section */}
            <div className="backdrop-blur-sm bg-white/60 p-6 rounded-xl border border-white/30 shadow-sm flex flex-col md:flex-row gap-6">
              <div className="flex-shrink-0">
                <div className="bg-emerald-100/80 p-4 rounded-full w-16 h-16 flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-emerald-600" />
                </div>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  Our Holistic Approach
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  At Rollinks Skincare, we harmonize nature's purest botanicals with cutting-edge 
                  dermatological science. Our eco-conscious formulations deliver transformative 
                  results while respecting your skin's natural balance and our planet's wellbeing.
                </p>
              </div>
            </div>

            {/* Founder Story */}
            <div className="backdrop-blur-sm bg-white/60 p-6 rounded-xl border border-white/30 shadow-sm flex flex-col md:flex-row gap-6">
              <div className="flex-shrink-0">
                <div className="bg-amber-100/80 p-4 rounded-full w-16 h-16 flex items-center justify-center">
                  <Gem className="w-8 h-8 text-amber-600" />
                </div>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  The Rollinks Genesis
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  Founded in 2025 by Rolake, a skincare formulator and environmental advocate, 
                  Rollinks emerged from years of meticulous research into bioactive plant compounds. 
                  What began as a personal quest for clean, effective skincare evolved into a 
                  mission to redefine beauty standards through sustainable innovation.
                </p>
              </div>
            </div>

            {/* Quality Section */}
            <div className="backdrop-blur-sm bg-white/60 p-6 rounded-xl border border-white/30 shadow-sm flex flex-col md:flex-row gap-6">
              <div className="flex-shrink-0">
                <div className="bg-rose-100/80 p-4 rounded-full w-16 h-16 flex items-center justify-center">
                  <FlaskConical className="w-8 h-8 text-rose-600" />
                </div>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  Scientific Purity
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  Each formulation undergoes 27 rigorous quality checks from seed to serum. 
                  We partner with ethical growers worldwide to source organic, wildcrafted 
                  ingredients, then enhance their potency through advanced extraction 
                  technologies. Our cruelty-free certifications reflect our respect for 
                  all life.
                </p>
              </div>
            </div>

            {/* Customer Commitment */}
            <div className="backdrop-blur-sm bg-white/60 p-6 rounded-xl border border-white/30 shadow-sm flex flex-col md:flex-row gap-6">
              <div className="flex-shrink-0">
                <div className="bg-sky-100/80 p-4 rounded-full w-16 h-16 flex items-center justify-center">
                  <HeartHandshake className="w-8 h-8 text-sky-600" />
                </div>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  Your Skin Journey
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  We consider skincare a sacred ritual. Our aestheticians provide personalized 
                  consultations to create regimens addressing your unique concerns. From acne 
                  to aging, we formulate solutions that work with your skin's biology, not 
                  against it.
                </p>
              </div>
            </div>

            {/* Sustainability */}
            <div className="backdrop-blur-sm bg-white/60 p-6 rounded-xl border border-white/30 shadow-sm flex flex-col md:flex-row gap-6">
              <div className="flex-shrink-0">
                <div className="bg-teal-100/80 p-4 rounded-full w-16 h-16 flex items-center justify-center">
                  <Globe className="w-8 h-8 text-teal-600" />
                </div>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  Green Philosophy
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  Beyond clean ingredients, we've implemented a carbon-negative production 
                  process and 100% biodegradable packaging. Our refill program reduces waste 
                  by 76%, and every purchase helps protect endangered botanical habitats 
                  through our conservation partnerships.
                </p>
              </div>
            </div>

            {/* Closing */}
            <div className="text-center mt-8">
              <div className="inline-flex bg-emerald-100/70 px-6 py-3 rounded-full border border-emerald-200/50">
                <p className="text-emerald-800 font-medium">
                  Begin your transformation today
                </p>
              </div>
              <p className="mt-6 text-gray-700">
                Connect with our skincare specialists at <span className="font-semibold text-emerald-700">07010331943</span>
              </p>
              <div className="mt-8 pt-6 border-t border-white/30">
                <p className="text-gray-700 italic">
                  "Beautiful skin begins with respect—for yourself and the earth."
                </p>
                <p className="mt-2 font-medium text-gray-800">
                  Rolake, Founder & Formulator
                </p>
                <div className="flex justify-center mt-4 space-x-2">
                  <Leaf className="w-5 h-5 text-emerald-600" />
                  <LeafyGreen className="w-5 h-5 text-emerald-700" />
                  <Leaf className="w-5 h-5 text-emerald-600" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUsPage;