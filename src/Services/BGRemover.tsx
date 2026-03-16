<<<<<<< HEAD
import React, { useEffect, useState, useRef, useCallback } from 'react';
=======
import React, { useState, useRef, useCallback } from 'react';
>>>>>>> 7fcffe0a0c3215adf6396fb4a7b067e90c0b13c6
import { motion, AnimatePresence } from 'motion/react';
import { 
  Upload, 
  Image as ImageIcon, 
  Download, 
  Trash2, 
<<<<<<< HEAD
  Sparkles
} from 'lucide-react';
// Heavy background-removal runs in a Web Worker to keep UI/animations responsive.
=======
  Loader2, 
  Sparkles
} from 'lucide-react';
>>>>>>> 7fcffe0a0c3215adf6396fb4a7b067e90c0b13c6

export default function BGRemover() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
<<<<<<< HEAD
  const originalUrlRef = useRef<string | null>(null);
  const processedUrlRef = useRef<string | null>(null);
  const runIdRef = useRef(0);
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    return () => {
      if (workerRef.current) workerRef.current.terminate();
      if (originalUrlRef.current) URL.revokeObjectURL(originalUrlRef.current);
      if (processedUrlRef.current) URL.revokeObjectURL(processedUrlRef.current);
    };
  }, []);
=======
>>>>>>> 7fcffe0a0c3215adf6396fb4a7b067e90c0b13c6

  const handleFile = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file.');
      return;
    }

<<<<<<< HEAD
    const runId = ++runIdRef.current;
    setError(null);
    setIsProcessing(true);

    // Show a fast preview first (and avoid huge base64 strings in state).
    const nextOriginalUrl = URL.createObjectURL(file);
    if (originalUrlRef.current) URL.revokeObjectURL(originalUrlRef.current);
    if (processedUrlRef.current) URL.revokeObjectURL(processedUrlRef.current);
    originalUrlRef.current = nextOriginalUrl;
    processedUrlRef.current = null;
    setProcessedImage(null);
    setOriginalImage(nextOriginalUrl);

    // Yield one frame so React can paint the preview and keep animations responsive.
    await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

    try {
      // Terminate any in-flight job (cancels CPU work in the old worker).
      if (workerRef.current) workerRef.current.terminate();
      workerRef.current = new Worker(
        new URL('../workers/bgRemoval.worker.ts', import.meta.url),
        { type: 'module' }
      );

      const fileBuffer = await file.arrayBuffer();

      const worker = workerRef.current;
      const result = await new Promise<{ outBuffer: ArrayBuffer; outType: string }>((resolve, reject) => {
        const cleanup = () => {
          worker.removeEventListener('message', onMessage);
          worker.removeEventListener('error', onError);
        };
        const onMessage = (ev: MessageEvent<any>) => {
          const data = ev.data;
          if (!data || data.id !== runId) return;
          if (data.type === 'progress') {
            // Optional: console log for debugging without blocking UI.
            // console.log(`Processing ${data.key}: ${data.current}/${data.total}`);
            return;
          }
          if (data.type === 'done' && data.ok) {
            cleanup();
            resolve({ outBuffer: data.outBuffer, outType: data.outType });
          }
          if (data.type === 'done' && !data.ok) {
            cleanup();
            reject(new Error(data.error || 'Failed to remove background.'));
          }
        };
        const onError = () => {
          cleanup();
          reject(new Error('Worker crashed while removing background.'));
        };

        worker.addEventListener('message', onMessage);
        worker.addEventListener('error', onError);

        worker.postMessage(
          { type: 'remove', id: runId, fileBuffer, fileType: file.type },
          [fileBuffer]
        );
      });

      if (runId !== runIdRef.current) return;

      const outBlob = new Blob([result.outBuffer], { type: result.outType || 'image/png' });
      const url = URL.createObjectURL(outBlob);
      if (processedUrlRef.current) URL.revokeObjectURL(processedUrlRef.current);
      processedUrlRef.current = url;
      setProcessedImage(url);
    } catch (err: any) {
      if (runId === runIdRef.current) {
        console.error('Background removal error:', err);
        setError('Failed to remove background. Please try a different image.');
      }
    } finally {
      if (runId === runIdRef.current) setIsProcessing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
=======
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
>>>>>>> 7fcffe0a0c3215adf6396fb4a7b067e90c0b13c6
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
<<<<<<< HEAD
    runIdRef.current++;
    if (workerRef.current) {
      workerRef.current.terminate();
      workerRef.current = null;
    }
    if (originalUrlRef.current) URL.revokeObjectURL(originalUrlRef.current);
    if (processedUrlRef.current) URL.revokeObjectURL(processedUrlRef.current);
    originalUrlRef.current = null;
    processedUrlRef.current = null;
    setOriginalImage(null);
    setProcessedImage(null);
    setError(null);
    setIsProcessing(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
=======
    setOriginalImage(null);
    setProcessedImage(null);
    setError(null);
>>>>>>> 7fcffe0a0c3215adf6396fb4a7b067e90c0b13c6
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
<<<<<<< HEAD
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={onFileChange} 
        className="hidden" 
        accept="image/*"
      />
=======
>>>>>>> 7fcffe0a0c3215adf6396fb4a7b067e90c0b13c6
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
<<<<<<< HEAD
          <AnimatePresence>
=======
          <AnimatePresence mode="wait">
>>>>>>> 7fcffe0a0c3215adf6396fb4a7b067e90c0b13c6
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
<<<<<<< HEAD
=======
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={onFileChange} 
                  className="hidden" 
                  accept="image/*"
                />
                
>>>>>>> 7fcffe0a0c3215adf6396fb4a7b067e90c0b13c6
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
<<<<<<< HEAD
                  {/* Show original image during processing, processed image after */}
                  {isProcessing ? (
                    <div className="relative w-full h-full">
                      <img 
                        src={originalImage!} 
                        alt="Processing" 
                        className="w-full h-full object-contain"
                      />
                      {/* Scanning overlay animation */}
                      <div className="absolute inset-0 overflow-hidden">
                        <motion.div 
                          className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent shadow-[0_0_20px_rgba(59,130,246,1)]"
                          initial={{ top: '0%' }}
                          animate={{ top: '100%' }}
                          transition={{ 
                            duration: 1.5, 
                            repeat: Infinity, 
                            repeatType: "loop",
                            ease: "linear" 
                          }}
                          key={`scan-line-${originalImage}`}
                        />
                        <motion.div 
                          className="absolute inset-0 bg-gradient-to-b from-blue-500/5 via-blue-500/15 to-blue-500/5"
                          initial={{ opacity: 0.3 }}
                          animate={{ opacity: 0.8 }}
                          transition={{ 
                            duration: 1.5, 
                            repeat: Infinity, 
                            repeatType: "reverse",
                            ease: "easeInOut" 
                          }}
                          key={`scan-beam-${originalImage}`}
                        />
                        <div className="absolute inset-0 grid grid-cols-6 grid-rows-8 gap-px bg-blue-300/10">
                          {Array(48).fill(0).map((_, i) => (
                            <div key={i} className="bg-white/5" />
                          ))}
                        </div>
                      </div>
                      {/* Scanning frame corners */}
                      <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-blue-500" />
                      <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-blue-500" />
                      <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-blue-500" />
                      <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-blue-500" />
                    </div>
                  ) : (
                    <img 
                      src={processedImage || originalImage!} 
                      alt="Preview" 
                      className="w-full h-full object-contain"
                    />
                  )}
                  
                  {isProcessing && (
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
                      <p className="px-4 py-2 bg-blue-600 text-white text-sm font-bold tracking-widest uppercase rounded-full shadow-lg shadow-blue-500/50 animate-pulse">Scanning & Processing...</p>
=======
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
>>>>>>> 7fcffe0a0c3215adf6396fb4a7b067e90c0b13c6
                    </div>
                  )}

                  <div className="absolute top-4 right-4 flex gap-2">
<<<<<<< HEAD
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="p-3 bg-white/90 backdrop-blur-md rounded-2xl text-blue-600 shadow-lg hover:bg-blue-50 transition-colors"
                      disabled={isProcessing}
                      title="Change image"
                    >
                      <Upload className="w-5 h-5" />
                    </button>
=======
>>>>>>> 7fcffe0a0c3215adf6396fb4a7b067e90c0b13c6
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
