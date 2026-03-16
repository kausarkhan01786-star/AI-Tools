import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './Header/Header';
import Home from './Home/Home';
import Login from './Auth/Login';
import Register from './Auth/Register';
import BGRemover from './Services/BGRemover';
import WatermarkRemoverPro from './Services/WatermarkRemoverPro';
import ChatAI from './Services/ChatAI';
import About from './About/About';
import Contact from './Contact/Contact';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './ProtectedRoute';

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <div className="min-h-screen bg-[#F2F2F7] dark:bg-[#1C1C1E] text-[#1C1C1E] dark:text-[#F2F2F7] font-montserrat selection:bg-blue-500/30 overflow-x-hidden transition-colors duration-300">
            <Header />
            <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            
            {/* Protected Routes */}
            <Route 
              path="/services/bg-remover" 
              element={
                <ProtectedRoute>
                  <BGRemover />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/services/watermark-remover" 
              element={
                <ProtectedRoute>
                  <WatermarkRemoverPro />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/services/chat-ai" 
              element={
                <ProtectedRoute>
                  <ChatAI />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  </AuthProvider>
);
}
