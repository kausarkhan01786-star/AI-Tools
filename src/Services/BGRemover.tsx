import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Upload, 
  Image as ImageIcon, 
  Download, 
  Trash2, 
  Loader2, 
  Sparkles
} from 'lucide-react';

export default function BGRemover() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file.');
      return;
    }

    setError(null);
    const reader = new FileReader();
    reader.onload = (e) => setOriginalImage(e.target?.result as string);
    reader.readAsDataURL(file);

    setIsProcessing(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      console.log('Attempting Photoroom background removal...');
      const response = await fetch('/api/remove-bg', {
        method: 'POST',
        body: formData,
      });

      const contentType = response.headers.get('content-type');

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = 'Server error';
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.error || errorData.message || errorText;
        } catch (e) {
          errorMessage = errorText || response.statusText || 'Server error';
        }
        throw new Error(errorMessage);
      }

      if (contentType && contentType.includes('image')) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setProcessedImage(url);
      } else {
        const text = await response.text();
        try {
          const data = JSON.parse(text);
          if (data.imageUrl) {
            setProcessedImage(data.imageUrl);
          } else if (data.error) {
            throw new Error(data.error);
          } else {
            throw new Error('Unexpected JSON response from server');
          }
        } catch (e: any) {
          if (e.message.includes('Unexpected JSON')) throw e;
          throw new Error(`Server returned non-image response: ${text.substring(0, 100)}...`);
        }
      }
    } catch (err: any) {
      console.error('Background removal error:', err);
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const onDragLeave = () => {
    setDragActive(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const reset = () => {
    setOriginalImage(null);
    setProcessedImage(null);
    setError(null);
  };

  const downloadImage = () => {
    if (!processedImage) return;
    const link = document.createElement('a');
    link.href = processedImage;
    link.download = 'removed-bg.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="pt-32 pb-24 px-6">
      <header className="pb-8 flex flex-col items-center">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-5xl font-bold tracking-tight text-center bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-[length:200%_auto] bg-clip-text text-transparent animate-gradient-x"
        >
          Quick Background Remover
        </motion.h1>
        <div className="h-1 w-24 bg-blue-500 rounded-full mt-4" />
      </header>

      <main className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-center gap-12">
        {/* Left Side Animation */}
        <div className="hidden lg:block w-64 h-80 relative rounded-3xl overflow-hidden shadow-xl border border-white/20">
          <BackgroundRemovalDemo 
            imageUrl="https://ik.imagekit.io/3n2eqtqw5/removed-bg.png" 
            seed="portrait" 
          />
        </div>

        <div className="w-full max-w-md">
          <AnimatePresence mode="wait">
            {!originalImage ? (
              <motion.div
                key="upload"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
                className={`
                  relative aspect-[4/5] rounded-[2.5rem] border-2 border-dashed transition-all duration-500
                  flex flex-col items-center justify-center p-8 text-center cursor-pointer
                  ${dragActive 
                    ? 'border-blue-500 bg-blue-500/5 scale-[1.02]' 
                    : 'border-[#C7C7CC] bg-white hover:border-blue-400 hover:bg-blue-50/30'}
                `}
                onClick={() => fileInputRef.current?.click()}
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={onFileChange} 
                  className="hidden" 
                  accept="image/*"
                />
                
                <div className="w-20 h-20 bg-blue-100 rounded-3xl flex items-center justify-center mb-6 text-blue-600 shadow-inner">
                  <Upload className="w-10 h-10" />
                </div>
                
                <h2 className="text-2xl font-bold mb-3">Upload Image</h2>
                <p className="text-[#8E8E93] text-sm leading-relaxed">
                  Drag and drop your photo here,<br />or click to browse files
                </p>
                
                <div className="mt-8 flex items-center gap-3 text-[10px] font-bold text-[#8E8E93] uppercase tracking-widest">
                  <span className="w-8 h-[1px] bg-[#E5E5EA]" />
                  Supports JPG, PNG, WEBP
                  <span className="w-8 h-[1px] bg-[#E5E5EA]" />
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="preview"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-[2.5rem] shadow-2xl shadow-blue-500/10 overflow-hidden border border-[#E5E5EA]"
              >
                <div className="relative aspect-[4/5] bg-[#F2F2F7] group">
                  <img 
                    src={processedImage || originalImage} 
                    alt="Preview" 
                    className={`w-full h-full object-contain transition-all duration-700 ${isProcessing ? 'blur-md grayscale' : ''}`}
                  />
                  
                  {isProcessing && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/40 backdrop-blur-sm">
                      <div className="relative">
                        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
                        <motion.div 
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1.2, opacity: 1 }}
                          transition={{ repeat: Infinity, duration: 1.5, repeatType: "reverse" }}
                          className="absolute inset-0 bg-blue-400/20 rounded-full blur-xl"
                        />
                      </div>
                      <p className="mt-4 text-sm font-bold text-blue-600 tracking-widest uppercase">Removing Background...</p>
                    </div>
                  )}

                  <div className="absolute top-4 right-4 flex gap-2">
                    <button 
                      onClick={reset}
                      className="p-3 bg-white/90 backdrop-blur-md rounded-2xl text-red-500 shadow-lg hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  <button
                    disabled={isProcessing || !processedImage}
                    onClick={downloadImage}
                    className={`
                      w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all duration-300
                      ${processedImage 
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 hover:bg-blue-700 hover:scale-[1.02]' 
                        : 'bg-[#E5E5EA] text-[#8E8E93] cursor-not-allowed'}
                    `}
                  >
                    <Download className="w-5 h-5" />
                    Download HD Image
                  </button>
                  
                  <p className="mt-4 text-center text-[10px] text-[#8E8E93] font-medium uppercase tracking-tighter">
                    Free for personal use • High Quality Output
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Side Video Animation */}
        <div className="hidden lg:block w-64 h-80 relative rounded-3xl overflow-hidden shadow-xl border border-white/20 bg-white">
          <video 
            src="https://storyblok-cdn.photoroom.com/f/191576/x/4f9dc3ca36/remove-background-animation-v1_1.mp4"
            autoPlay 
            loop 
            muted 
            playsInline
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-4 left-4 right-4 bg-black/50 backdrop-blur-md py-2 px-3 rounded-xl text-[10px] text-white font-bold tracking-widest uppercase text-center">
            Background removing
          </div>
        </div>
      </main>

      {error && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-2xl shadow-xl font-bold text-sm z-50"
        >
          {error}
        </motion.div>
      )}
    </div>
  );
}

function BackgroundRemovalDemo({ seed, imageUrl }: { seed: string, imageUrl?: string }) {
  const displayImage = imageUrl || `https://picsum.photos/seed/${seed}/400/600`;
  
  return (
    <div className="w-full h-full bg-white relative overflow-hidden group">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
      
      <img 
        src={displayImage} 
        alt="Demo" 
        className="w-full h-full object-contain relative z-10"
        referrerPolicy="no-referrer"
      />

      <motion.div 
        className="absolute inset-0 bg-[#E5E5EA] z-0"
        initial={{ x: '0%' }}
        animate={{ x: '100%' }}
        transition={{ 
          duration: 3, 
          repeat: Infinity, 
          repeatType: "reverse",
          ease: "easeInOut" 
        }}
      />

      <motion.div 
        className="absolute top-0 bottom-0 w-1 bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.8)] z-20"
        initial={{ left: '0%' }}
        animate={{ left: '100%' }}
        transition={{ 
          duration: 3, 
          repeat: Infinity, 
          repeatType: "reverse",
          ease: "easeInOut" 
        }}
      />

      <div className="absolute top-4 left-4 z-30 bg-black/50 backdrop-blur-md py-1 px-2 rounded-lg text-[8px] text-white font-bold uppercase">
        Before
      </div>
      <div className="absolute top-4 right-4 z-30 bg-blue-500/80 backdrop-blur-md py-1 px-2 rounded-lg text-[8px] text-white font-bold uppercase">
        After
      </div>

      <div className="absolute bottom-4 left-4 right-4 z-30 bg-black/50 backdrop-blur-md py-2 px-3 rounded-xl text-[10px] text-white font-bold tracking-widest uppercase text-center">
        Background removing
      </div>
    </div>
  );
}
