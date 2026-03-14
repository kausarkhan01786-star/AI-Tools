import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Upload, 
  X, 
  Loader2, 
  Download, 
  Sparkles, 
  Droplets,
  CheckCircle2
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

export default function WatermarkRemover() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setProcessedImage(null);
        setProgress(0);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeWatermark = async () => {
    if (!selectedImage) return;
    
    setIsProcessing(true);
    setProgress(10);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY_WATERMARK });
      
      // Detect mime type from base64
      const mimeType = selectedImage.split(';')[0].split(':')[1] || 'image/jpeg';
      const base64Data = selectedImage.split(',')[1];
      
      setProgress(30);
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            {
              inlineData: {
                data: base64Data,
                mimeType: mimeType
              }
            },
            {
              text: "Act as a professional photo editor. Remove all watermarks, text overlays, logos, and stamps from this image. Reconstruct the missing parts of the background seamlessly to match the surrounding textures and colors. The output must be only the cleaned image."
            }
          ]
        }
      });

      setProgress(70);

      let foundImage = false;
      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          setProcessedImage(`data:image/png;base64,${part.inlineData.data}`);
          foundImage = true;
          break;
        }
      }
      
      if (!foundImage) {
        throw new Error("AI did not return an image. It might have returned text instead.");
      }
      
      setProgress(100);
    } catch (error) {
      console.error('Error removing watermark:', error);
      alert('Failed to process image. This could be due to an invalid API key or a safety filter. Please try again with a different image.');
    } finally {
      setTimeout(() => {
        setIsProcessing(false);
      }, 500);
    }
  };

  const downloadImage = () => {
    if (!processedImage) return;
    const link = document.createElement('a');
    link.href = processedImage;
    link.download = 'watermark-removed-1280x1080.png';
    link.click();
  };

  return (
    <div className="pt-32 pb-24 min-h-screen bg-[#F2F2F7] dark:bg-[#1C1C1E] transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-6">
        {/* Title Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black dark:text-white mb-4 tracking-tight">AI Watermark <span className="text-blue-600">Remover</span></h1>
          <p className="text-[#8E8E93] font-medium">Upload your image and let AI clean it for you.</p>
        </div>

        {/* Center Input Area */}
        <div className="flex flex-col items-center gap-8">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-2xl"
          >
            <div 
              onClick={() => !isProcessing && fileInputRef.current?.click()}
              className={`relative aspect-video rounded-[2rem] border-4 border-dashed transition-all cursor-pointer overflow-hidden flex flex-col items-center justify-center group ${
                selectedImage 
                  ? 'border-blue-500 bg-white dark:bg-[#2C2C2E]' 
                  : 'border-[#E5E5EA] dark:border-[#3A3A3C] bg-white dark:bg-[#2C2C2E] hover:border-blue-400'
              }`}
            >
              {selectedImage ? (
                <>
                  <img src={selectedImage} alt="Original" className="w-full h-full object-contain" />
                  {isProcessing && (
                    <motion.div 
                      initial={{ top: '0%' }}
                      animate={{ top: '100%' }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                      className="absolute left-0 w-full h-1 bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.8)] z-10"
                    />
                  )}
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <p className="text-white font-bold flex items-center gap-2 bg-black/50 px-4 py-2 rounded-full">
                      <Upload className="w-5 h-5" />
                      Change Image
                    </p>
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedImage(null);
                      setProcessedImage(null);
                    }}
                    className="absolute top-4 right-4 p-2 bg-white/90 dark:bg-black/50 rounded-full shadow-lg text-red-500 hover:scale-110 transition-transform z-20"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </>
              ) : (
                <div className="text-center p-12">
                  <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 rounded-3xl flex items-center justify-center mx-auto mb-6 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                    <Upload className="w-10 h-10" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 dark:text-white">Upload Image</h3>
                  <p className="text-[#8E8E93]">Click or drag and drop</p>
                </div>
              )}
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageUpload} 
                className="hidden" 
                accept="image/*" 
              />
            </div>

            <button
              onClick={removeWatermark}
              disabled={!selectedImage || isProcessing}
              className={`w-full mt-6 py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all ${
                !selectedImage || isProcessing
                  ? 'bg-[#E5E5EA] dark:bg-[#3A3A3C] text-[#C7C7CC] cursor-not-allowed'
                  : 'bg-blue-600 text-white shadow-xl shadow-blue-500/30 hover:bg-blue-700 active:scale-95'
              }`}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  Scanning & Removing... {progress}%
                </>
              ) : (
                <>
                  <Droplets className="w-6 h-6" />
                  Remove Watermark
                </>
              )}
            </button>
          </motion.div>

          {/* Result Area Below */}
          <AnimatePresence>
            {processedImage && (
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
                className="w-full max-w-2xl space-y-6"
              >
                <div className="relative aspect-video rounded-[2rem] bg-white dark:bg-[#2C2C2E] border border-[#E5E5EA] dark:border-[#3A3A3C] shadow-2xl overflow-hidden flex items-center justify-center">
                  <img src={processedImage} alt="Result" className="w-full h-full object-contain" />
                  <div className="absolute top-4 left-4 px-4 py-2 bg-emerald-500 text-white text-xs font-bold uppercase tracking-widest rounded-full shadow-lg flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    Cleaned (1280x1080)
                  </div>
                </div>

                <div className="flex items-center justify-between p-6 bg-white dark:bg-[#2C2C2E] rounded-3xl border border-[#E5E5EA] dark:border-[#3A3A3C] shadow-xl">
                  <div>
                    <h4 className="font-bold dark:text-white text-lg">Process Complete</h4>
                    <p className="text-sm text-[#8E8E93]">Watermark removed successfully</p>
                  </div>
                  <button 
                    onClick={downloadImage}
                    className="flex items-center gap-2 bg-emerald-500 text-white px-8 py-4 rounded-2xl font-bold hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
                  >
                    <Download className="w-5 h-5" />
                    Download HD
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
