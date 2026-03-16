import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Send, 
  Image as ImageIcon, 
  Plus, 
  User, 
  Bot, 
  Loader2, 
  X, 
  Code, 
  Sparkles, 
  MessageSquare,
  Download,
  Terminal,
  Mic,
  MicOff,
  Volume2,
  VolumeX
} from 'lucide-react';
import { GoogleGenAI, Modality } from "@google/genai";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  image?: string;
  isImageGen?: boolean;
}

export default function ChatAI() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hello! I'm your AI Assistant. I can help you with coding, solving issues, analyzing images, or even generating new images. How can I help you today?"
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isLiveMode, setIsLiveMode] = useState(false);
  const [showVoiceOverlay, setShowVoiceOverlay] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [mode, setMode] = useState<'chat' | 'image'>('chat');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const generateImage = async (prompt: string) => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY_CHAT;
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: [{ parts: [{ text: prompt }] }],
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error('No image generated');
  };

  const handleSend = async (voiceInput?: string, isLive?: boolean) => {
    const messageContent = voiceInput || input;
    if (!messageContent.trim() && !selectedImage) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageContent,
      image: selectedImage || undefined
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = messageContent;
    const currentImage = selectedImage;
    const currentMode = mode;
    const isLiveActive = isLive || isLiveMode;
    
    if (!voiceInput) setInput('');
    setSelectedImage(null);
    setIsLoading(true);

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY_CHAT;
      if (!apiKey) {
        throw new Error("API key not configured. Please set VITE_GEMINI_API_KEY_CHAT in your .env file.");
      }
      const ai = new GoogleGenAI({ apiKey });
      
      if (currentMode === 'image') {
        const generatedImageUrl = await generateImage(currentInput);
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `Generated image for: "${currentInput}"`,
          image: generatedImageUrl,
          isImageGen: true
        };
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        // Chat / Vision / Code Mode
        const model = ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: messages.concat(userMessage).map(m => ({
            role: m.role === 'user' ? 'user' : 'model',
            parts: [
              ...(m.image && !m.isImageGen ? [{
                inlineData: {
                  mimeType: "image/jpeg",
                  data: m.image.split(',')[1]
                }
              }] : []),
              { text: m.content }
            ]
          })),
          config: {
            systemInstruction: "You are a highly capable AI assistant named AI-TOOLS Bot. You excel at coding (Python, JS, React, etc.), solving complex issues, and analyzing images. Provide clear, concise, and professional answers. Use Markdown for formatting and code blocks."
          }
        });

        const result = await model;
        const text = result.text;

        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: text || "I'm sorry, I couldn't process that request."
        };
        setMessages(prev => [...prev, assistantMessage]);

        // If Live Mode or Auto-Speak is on, speak the response
        if ((isLiveActive || autoSpeak) && text) {
          speakResponse(text, assistantMessage.id, isLiveActive);
        }
      }
    } catch (error: any) {
      console.error("Gemini Error:", error);
      let errorMessage = error.message || "Sorry, I encountered an error. Please check your API key or try again later.";
      
      if (error.message?.includes('429') || error.message?.includes('Quota exceeded') || error.message?.includes('RESOURCE_EXHAUSTED')) {
        errorMessage = "Gemini API limit reached. Please wait 10-20 seconds and try again. (Free tier has limits)";
      }
      
      if (error.message?.includes('API key not valid')) {
        errorMessage = "Invalid API Key. Please check the hardcoded key in the source code.";
      }

      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Error: ${errorMessage}`
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const startListening = (isLive: boolean = false) => {
    // Unlock audio on first user interaction
    const silentAudio = new Audio('data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAAAAA==');
    silentAudio.play().catch(() => {});

    if (!('webkitSpeechRecognition' in window)) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      if (isLive) {
        setIsLiveMode(true);
        setShowVoiceOverlay(true);
      }
    };
    
    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onerror = (event: any) => {
      console.error(event.error);
      setIsListening(false);
      setIsLiveMode(false);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      if (isLive) {
        handleSend(transcript, true);
      } else {
        setInput(prev => prev + (prev ? ' ' : '') + transcript);
      }
    };

    recognition.start();
  };

  const speakResponse = async (text: string, messageId: string, continueLive: boolean = false) => {
    if (isSpeaking === messageId) {
      setIsSpeaking(null);
      if (window.speechSynthesis.speaking) window.speechSynthesis.cancel();
      return;
    }

    setIsSpeaking(messageId);
    
    // Clean text for TTS (remove markdown and limit length)
    let cleanedText = text
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove markdown links
      .replace(/[*_#`~]/g, '') // Remove markdown formatting
      .replace(/```[\s\S]*?```/g, 'code block') // Replace code blocks
      .substring(0, 1000)
      .trim();

    if (!cleanedText) cleanedText = "I have a response for you.";

    const fallbackToBrowser = () => {
      console.log("Using Browser TTS Fallback");
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(cleanedText);
      utterance.lang = 'en-US';
      utterance.rate = 1.0;
      
      utterance.onend = () => {
        setIsSpeaking(null);
        if (continueLive && isLiveMode) {
          setTimeout(() => startListening(true), 500);
        }
      };
      utterance.onerror = (e) => {
        console.error("Browser TTS Error:", e);
        setIsSpeaking(null);
        if (continueLive && isLiveMode) startListening(true);
      };
      window.speechSynthesis.speak(utterance);
    };

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY_CHAT;
      if (!apiKey) {
        throw new Error("API key not configured for TTS.");
      }
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: cleanedText }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Zephyr' }, 
            },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        // Play Raw PCM 24000Hz Audio
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const binaryString = window.atob(base64Audio);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }

        // Convert 16-bit PCM to Float32
        const floatData = new Float32Array(bytes.length / 2);
        for (let i = 0; i < floatData.length; i++) {
          const int = (bytes[i * 2 + 1] << 8) | bytes[i * 2];
          floatData[i] = (int >= 0x8000 ? int - 0x10000 : int) / 0x8000;
        }

        const buffer = audioContext.createBuffer(1, floatData.length, 24000);
        buffer.getChannelData(0).set(floatData);

        const source = audioContext.createBufferSource();
        source.buffer = buffer;
        source.connect(audioContext.destination);
        
        source.onended = () => {
          setIsSpeaking(null);
          audioContext.close();
          if (continueLive && isLiveMode) {
            setTimeout(() => startListening(true), 500);
          }
        };

        source.start();
      } else {
        fallbackToBrowser();
      }
    } catch (error) {
      console.error("Gemini TTS Error:", error);
      fallbackToBrowser();
    }
  };

  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role === 'assistant' && autoSpeak && !lastMessage.isImageGen) {
        speakResponse(lastMessage.content, lastMessage.id);
      }
    }
  }, [messages, autoSpeak]);

  return (
    <div className="pt-20 md:pt-24 h-screen flex flex-col bg-[#F2F2F7] dark:bg-[#1C1C1E] transition-colors duration-300">
      {/* Header */}
      <div className="bg-white dark:bg-[#2C2C2E] border-b border-[#E5E5EA] dark:border-[#3A3A3C] shadow-sm">
        <div className="max-w-7xl mx-auto px-3 md:px-6 py-3 md:py-4 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
              <Bot className="w-5 h-5 md:w-6 md:h-6" />
            </div>
            <div>
              <h1 className="font-bold dark:text-white text-sm md:text-base">AI-TOOLS Bot</h1>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-bold text-[#8E8E8E] uppercase tracking-widest hidden sm:inline">Online & Ready</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 md:gap-4">
            <button 
              onClick={() => setAutoSpeak(!autoSpeak)}
              className={`p-2 rounded-xl transition-all flex items-center gap-2 ${autoSpeak ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600' : 'text-[#8E8E93]'}`}
              title={autoSpeak ? "Auto-speak ON" : "Auto-speak OFF"}
            >
              {autoSpeak ? <Volume2 className="w-4 h-4 md:w-5 md:h-5" /> : <VolumeX className="w-4 h-4 md:w-5 md:h-5" />}
              <span className="text-[10px] font-bold uppercase hidden md:inline">Voice</span>
            </button>

            <div className="flex bg-[#F2F2F7] dark:bg-[#3A3A3C] p-1 rounded-xl">
              <button 
                onClick={() => setMode('chat')}
                className={`px-2 md:px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${mode === 'chat' ? 'bg-white dark:bg-[#2C2C2E] shadow-sm text-blue-600' : 'text-[#8E8E93]'}`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Chat</span>
              </button>
              <button 
                onClick={() => setMode('image')}
                className={`px-2 md:px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${mode === 'image' ? 'bg-white dark:bg-[#2C2C2E] shadow-sm text-purple-600' : 'text-[#8E8E93]'}`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Generate</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-3 md:p-6 space-y-4 md:space-y-6">
          <AnimatePresence initial={false}>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[90%] md:max-w-[70%] flex gap-2 md:gap-3 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-7 h-7 md:w-8 md:h-8 rounded-lg flex-shrink-0 flex items-center justify-center ${message.role === 'user' ? 'bg-blue-600 text-white' : 'bg-white dark:bg-[#2C2C2E] border border-[#E5E5EA] dark:border-[#3A3A3C] text-blue-600'}`}>
                    {message.role === 'user' ? <User className="w-4 h-4 md:w-5 md:h-5" /> : <Bot className="w-4 h-4 md:w-5 md:h-5" />}
                  </div>
                  
                  <div className={`space-y-2 ${message.role === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className={`p-3 md:p-4 rounded-2xl shadow-sm ${
                      message.role === 'user' 
                        ? 'bg-blue-600 text-white rounded-tr-none' 
                        : 'bg-white dark:bg-[#2C2C2E] dark:text-[#F2F2F7] border border-[#E5E5EA] dark:border-[#3A3A3C] rounded-tl-none'
                    }`}>
                      {message.image && (
                        <div className="mb-3 relative group">
                          <img 
                            src={message.image} 
                            alt="Uploaded/Generated" 
                            className="max-w-full rounded-xl border border-black/5 dark:border-white/5"
                          />
                          {message.isImageGen && (
                            <a 
                              href={message.image} 
                              download="generated-image.png"
                              className="absolute top-2 right-2 p-2 bg-black/50 hover:bg-black/70 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Download className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                      )}
                      <div className="prose prose-sm dark:prose-invert max-w-none">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {message.content}
                        </ReactMarkdown>
                      </div>
                      {message.role === 'assistant' && !message.isImageGen && (
                        <button 
                          onClick={() => speakResponse(message.content, message.id)}
                          className={`mt-2 p-1.5 rounded-lg transition-all ${isSpeaking === message.id ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-600' : 'text-[#8E8E93] hover:bg-black/5 dark:hover:bg-white/5'}`}
                        >
                          {isSpeaking === message.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Volume2 className="w-4 h-4" />}
                        </button>
                      )}
                    </div>
                    <span className="text-[10px] text-[#8E8E93] font-bold uppercase tracking-widest px-1">
                      {message.role === 'user' ? 'You' : 'AI Assistant'}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white dark:bg-[#2C2C2E] p-4 rounded-2xl rounded-tl-none border border-[#E5E5EA] dark:border-[#3A3A3C] flex items-center gap-3">
                <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                <span className="text-sm font-medium dark:text-[#F2F2F7]">Thinking...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Voice Assistant Overlay */}
      <AnimatePresence>
        {showVoiceOverlay && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-blue-600 flex flex-col items-center justify-center text-white p-6"
          >
            <div className="absolute top-8 right-8">
              <button 
                onClick={() => {
                  setShowVoiceOverlay(false);
                  setIsLiveMode(false);
                  setIsListening(false);
                  setIsSpeaking(null);
                }}
                className="p-4 bg-white/10 hover:bg-white/20 rounded-full transition-all"
              >
                <X className="w-8 h-8" />
              </button>
            </div>

            <div className="flex flex-col items-center gap-12 text-center">
              <div className="relative">
                {/* Pulsing Rings */}
                <motion.div 
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 bg-white/20 rounded-full"
                />
                <motion.div 
                  animate={{ scale: [1, 2, 1], opacity: [0.3, 0, 0.3] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute inset-0 bg-white/10 rounded-full"
                />
                
                <div className="relative w-48 h-48 bg-white rounded-full flex items-center justify-center shadow-2xl">
                  {isSpeaking ? (
                    <Volume2 className="w-24 h-24 text-blue-600 animate-bounce" />
                  ) : isListening ? (
                    <Mic className="w-24 h-24 text-blue-600 animate-pulse" />
                  ) : (
                    <Bot className="w-24 h-24 text-blue-600" />
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-4xl font-black tracking-tight">
                  {isSpeaking ? "AI is Speaking..." : isListening ? "Listening to you..." : "AI Assistant"}
                </h2>
                <p className="text-blue-100 text-xl font-medium max-w-md">
                  {isSpeaking 
                    ? "Listen to the AI's response" 
                    : isListening 
                      ? "Speak now, I'm listening..." 
                      : "Ready for your voice command"}
                </p>
              </div>

              {/* Waveform Animation */}
              {(isListening || isSpeaking) && (
                <div className="flex items-center gap-1 h-12">
                  {[...Array(12)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{ 
                        height: isSpeaking ? [10, 40, 10] : [10, 25, 10] 
                      }}
                      transition={{ 
                        duration: 0.5, 
                        repeat: Infinity, 
                        delay: i * 0.05 
                      }}
                      className="w-1.5 bg-white rounded-full"
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="absolute bottom-12 flex flex-col items-center gap-4">
              <p className="text-blue-200 text-sm font-bold uppercase tracking-widest">Live Voice Mode Active</p>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
                <span className="text-xs font-bold">Connected to Gemini AI</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input Area */}
      <div className="bg-white dark:bg-[#2C2C2E] border-t border-[#E5E5EA] dark:border-[#3A3A3C]">
        <div className="max-w-7xl mx-auto p-3 md:p-6">
          <div className="max-w-4xl mx-auto">
            {selectedImage && (
              <div className="mb-4 relative inline-block">
                <img src={selectedImage} alt="Preview" className="h-20 w-20 object-cover rounded-xl border-2 border-blue-500" />
                <button 
                  onClick={() => setSelectedImage(null)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
            
            <div className="flex items-end gap-2 md:gap-3">
              <div className="flex-1 bg-[#F2F2F7] dark:bg-[#3A3A3C] rounded-[2rem] p-1.5 md:p-2 flex items-end gap-1 md:gap-2 border border-transparent focus-within:border-blue-500/30 transition-all">
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 md:p-3 text-[#8E8E93] hover:text-blue-600 transition-colors"
                >
                  <ImageIcon className="w-5 h-5 md:w-6 md:h-6" />
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleImageSelect} 
                  className="hidden" 
                  accept="image/*" 
                />
                
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder={mode === 'chat' ? "Ask anything..." : "Describe image..."}
                  className="flex-1 bg-transparent border-none focus:ring-0 py-2 md:py-3 px-1 md:px-2 text-[#1C1C1E] dark:text-[#F2F2F7] resize-none max-h-32 text-sm"
                  rows={1}
                />
                
                <div className="flex items-center gap-1 pr-1 md:pr-2">
                  <button 
                    onClick={() => isLiveMode ? setIsLiveMode(false) : startListening(true)}
                    className={`p-2 md:p-3 rounded-full transition-all ${
                      isLiveMode 
                        ? 'bg-red-500 text-white animate-pulse shadow-lg shadow-red-500/30' 
                        : 'text-[#8E8E93] hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                    }`}
                    title={isLiveMode ? "Stop Live Voice" : "Start Live Voice Chat"}
                  >
                    {isLiveMode ? <MicOff className="w-5 h-5 md:w-6 md:h-6" /> : <Mic className="w-5 h-5 md:w-6 md:h-6" />}
                  </button>

                  <button 
                    onClick={() => handleSend()}
                    disabled={isLoading || (!input.trim() && !selectedImage)}
                    className={`p-2 md:p-3 rounded-full transition-all ${
                      isLoading || (!input.trim() && !selectedImage)
                        ? 'bg-[#E5E5EA] dark:bg-[#48484A] text-[#C7C7CC]'
                        : 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 hover:bg-blue-700'
                    }`}
                  >
                    {isLoading ? <Loader2 className="w-5 h-5 md:w-6 md:h-6 animate-spin" /> : <Send className="w-5 h-5 md:w-6 md:h-6" />}
                  </button>
                </div>
              </div>
            </div>
            
            <div className="mt-3 md:mt-4 flex flex-wrap gap-2 justify-center">
              <QuickAction icon={<Code className="w-3.5 h-3.5" />} label="Fix Code" onClick={() => setInput("Can you help me fix this code? ")} />
              <QuickAction icon={<Terminal className="w-3.5 h-3.5" />} label="Explain" onClick={() => setInput("Explain the logic behind ")} />
              <QuickAction icon={<Sparkles className="w-3.5 h-3.5" />} label="Idea" onClick={() => setInput("Give me a creative idea for ")} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function QuickAction({ icon, label, onClick }: { icon: React.ReactNode, label: string, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="px-3 py-1.5 bg-[#F2F2F7] dark:bg-[#3A3A3C] text-[#8E8E93] dark:text-[#F2F2F7] rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 transition-all flex items-center gap-1.5 border border-transparent hover:border-blue-500/30"
    >
      {icon}
      {label}
    </button>
  );
}
