import React from 'react';
import { motion } from 'motion/react';
import { ChevronRight, Sparkles, Smartphone, Layers, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-[length:200%_auto] bg-clip-text text-transparent animate-gradient-x"
          >
            Magic AI Tools for Everyone
          </motion.h1>
          <p className="text-xl text-[#8E8E93] max-w-2xl mx-auto mb-10">
            Professional-grade AI tools to remove backgrounds, watermarks, and chat with intelligent assistants.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              to="/services/bg-remover"
              className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all flex items-center gap-2 group"
            >
              Get Started
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              to="/about"
              className="px-8 py-4 bg-white dark:bg-[#2C2C2E] text-[#1C1C1E] dark:text-[#F2F2F7] border border-[#E5E5EA] dark:border-[#3A3A3C] rounded-2xl font-bold hover:bg-[#F2F2F7] dark:hover:bg-[#3A3A3C] transition-all"
            >
              Learn More
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          <FeatureCard 
            icon={<Sparkles className="text-blue-500" />}
            title="AI Powered"
            description="State-of-the-art neural networks for pixel-perfect results."
          />
          <FeatureCard 
            icon={<Smartphone className="text-purple-500" />}
            title="Mobile Ready"
            description="Optimized for all devices, from desktop to mobile phones."
          />
          <FeatureCard 
            icon={<Layers className="text-emerald-500" />}
            title="Batch Processing"
            description="Process multiple images at once with lightning speed."
          />
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-white dark:bg-[#2C2C2E] p-8 rounded-3xl border border-[#E5E5EA] dark:border-[#3A3A3C] shadow-sm hover:shadow-xl transition-all"
    >
      <div className="w-12 h-12 bg-[#F2F2F7] dark:bg-[#3A3A3C] rounded-2xl flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3 dark:text-white">{title}</h3>
      <p className="text-[#8E8E93] dark:text-[#8E8E93] leading-relaxed">{description}</p>
    </motion.div>
  );
}
