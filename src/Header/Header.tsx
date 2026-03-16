import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronDown,
  MessageSquare,
  Eraser,
  Droplets,
  LogOut,
  Sun,
  Moon
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { signOut } from 'firebase/auth';

function MegaMenuItem({ icon, title, description, to }: { icon: React.ReactNode, title: string, description: string, to: string }) {
  return (
    <Link to={to} className="flex items-start gap-3 p-3 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors cursor-pointer group">
      <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
        {icon}
      </div>
      <div>
        <div className="text-xs font-bold text-[#1C1C1E] dark:text-[#F2F2F7]">{title}</div>
        <div className="text-[10px] text-[#8E8E93] dark:text-[#8E8E93]">{description}</div>
      </div>
    </Link>
  );
}

export default function Header() {
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isProfileHovered, setIsProfileHovered] = useState(false);
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/80 dark:bg-[#1C1C1E]/80 backdrop-blur-xl border-b border-[#E5E5EA] dark:border-[#3A3A3C] z-[100] px-6 py-3 transition-colors duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left: Logo */}
        <Link to="/" className="flex items-center gap-2 cursor-pointer group">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center overflow-hidden shadow-lg group-hover:scale-105 transition-transform">
            <img 
              src="https://ik.imagekit.io/3n2eqtqw5/image-cache-Photoroom.png" 
              alt="Logo" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <span className="font-bold text-xl tracking-tight hidden sm:block dark:text-white">AI-TOOLS</span>
        </Link>

        {/* Center: Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-sm font-semibold hover:text-blue-600 dark:text-[#F2F2F7] dark:hover:text-blue-400 transition-colors">Home</Link>
          <Link to="/about" className="text-sm font-semibold hover:text-blue-600 dark:text-[#F2F2F7] dark:hover:text-blue-400 transition-colors">About</Link>
          
          {/* Services with Mega Menu */}
          <div 
            className="relative group py-2"
            onMouseEnter={() => setIsServicesOpen(true)}
            onMouseLeave={() => setIsServicesOpen(false)}
          >
            <button className="flex items-center gap-1 text-sm font-semibold hover:text-blue-600 dark:text-[#F2F2F7] dark:hover:text-blue-400 transition-colors">
              Services
              <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isServicesOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {isServicesOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 bg-white dark:bg-[#2C2C2E] rounded-2xl shadow-2xl border border-[#E5E5EA] dark:border-[#3A3A3C] overflow-hidden p-2"
                >
                  <div className="flex flex-col gap-1">
                    <MegaMenuItem 
                      icon={<Eraser className="w-4 h-4" />} 
                      title="BG Remover" 
                      description="Remove backgrounds instantly"
                      to="/services/bg-remover"
                    />
                    <MegaMenuItem 
                      icon={<Droplets className="w-4 h-4" />} 
                      title="Watermark Remover" 
<<<<<<< HEAD
                      description="Remove watermarks with AI"
=======
                      description="Clean up your images"
>>>>>>> 7fcffe0a0c3215adf6396fb4a7b067e90c0b13c6
                      to="/services/watermark-remover"
                    />
                    <MegaMenuItem 
                      icon={<MessageSquare className="w-4 h-4" />} 
                      title="Chat AI" 
                      description="Intelligent assistant"
                      to="/services/chat-ai"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link to="/contact" className="text-sm font-semibold hover:text-blue-600 dark:text-[#F2F2F7] dark:hover:text-blue-400 transition-colors">Contact</Link>
        </div>

        {/* Right: Login & Profile */}
        <div className="flex items-center gap-4">
          {/* Theme Toggle */}
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-[#F2F2F7] dark:bg-[#2C2C2E] text-[#1C1C1E] dark:text-[#F2F2F7] hover:bg-[#E5E5EA] dark:hover:bg-[#3A3A3C] transition-all"
          >
            {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </button>

          {!user ? (
            <Link to="/login" className="text-sm font-semibold hover:text-blue-600 dark:text-[#F2F2F7] dark:hover:text-blue-400 transition-colors px-4 py-2">
              Login
            </Link>
          ) : (
            <div className="flex items-center gap-4">
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 text-sm font-semibold text-red-500 hover:text-red-600 transition-colors px-4 py-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
              
              <div 
                className="relative"
                onMouseEnter={() => setIsProfileHovered(true)}
                onMouseLeave={() => setIsProfileHovered(false)}
              >
                <div className="w-10 h-10 rounded-full border-2 border-blue-500 p-0.5 cursor-pointer hover:scale-105 transition-transform overflow-hidden bg-white dark:bg-[#2C2C2E]">
                  {user.photoURL ? (
                    <img 
                      src={user.photoURL} 
                      alt="User Profile" 
                      className="w-full h-full object-cover rounded-full"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-600 font-bold text-lg rounded-full">
                      {user.email?.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                
                <AnimatePresence>
                  {isProfileHovered && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8, x: -20 }}
                      animate={{ opacity: 1, scale: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.8, x: -20 }}
                      className="absolute right-0 top-full mt-2 whitespace-nowrap bg-black text-white text-[10px] font-bold py-1 px-3 rounded-full shadow-lg"
                    >
                      {user.email}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
