import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Download, Image as ImageIcon, Sparkles, Trash2, Upload } from "lucide-react";
import { GoogleGenAI, Modality } from "@google/genai";

type Provider = "photoroom" | "gemini";

const DEFAULT_PROMPT =
  "Remove all watermarks, logos, and text overlays from the image while keeping the rest unchanged. Fill removed areas naturally and seamlessly, preserving details and resolution.";

export default function WatermarkRemoverPro() {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState<string>("");
  const [provider, setProvider] = useState<Provider>("photoroom");
  const [photoroomConfigured, setPhotoroomConfigured] = useState<boolean | null>(null);
  const [prompt, setPrompt] = useState(DEFAULT_PROMPT);

  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [processedUrl, setProcessedUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("watermark-removed.png");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const originalUrlRef = useRef<string | null>(null);
  const processedUrlRef = useRef<string | null>(null);
  const fileRef = useRef<File | null>(null);
  const runIdRef = useRef(0);

  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      try {
        const resp = await fetch("/api/watermark/status", { signal: controller.signal });
        if (!resp.ok) return;
        const data = (await resp.json()) as { photoroomConfigured?: boolean };
        const configured = Boolean(data.photoroomConfigured);
        setPhotoroomConfigured(configured);
        setProvider(configured ? "photoroom" : "gemini");
      } catch {
        // ignore
      }
    })();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    return () => {
      if (originalUrlRef.current) URL.revokeObjectURL(originalUrlRef.current);
      if (processedUrlRef.current) URL.revokeObjectURL(processedUrlRef.current);
    };
  }, []);

  const reset = () => {
    setError(null);
    setIsProcessing(false);
    setStatus("");
    if (originalUrlRef.current) URL.revokeObjectURL(originalUrlRef.current);
    if (processedUrlRef.current) URL.revokeObjectURL(processedUrlRef.current);
    originalUrlRef.current = null;
    processedUrlRef.current = null;
    fileRef.current = null;
    setOriginalUrl(null);
    setProcessedUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file (JPG/PNG/WebP).");
      return;
    }

    setError(null);
    setStatus("");
    setProcessedUrl(null);
    if (processedUrlRef.current) URL.revokeObjectURL(processedUrlRef.current);
    processedUrlRef.current = null;
    fileRef.current = file;
    setFileName(
      file.name.replace(/\.(png|jpg|jpeg|webp|gif|bmp|tiff?)$/i, "") + "-watermark-removed.png"
    );

    const url = URL.createObjectURL(file);
    if (originalUrlRef.current) URL.revokeObjectURL(originalUrlRef.current);
    originalUrlRef.current = url;
    setOriginalUrl(url);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };
  const onDragLeave = () => setDragActive(false);
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) void handleFile(file);
  };
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) void handleFile(file);
  };

  const processWithPhotoRoom = async (file: File, currentRunId: number) => {
    setStatus("Uploading image…");
    const form = new FormData();
    form.append("image", file);
    form.append("prompt", prompt);
    form.append("mode", "ai.auto");

    const resp = await fetch("/api/watermark/remove", { method: "POST", body: form });
    if (currentRunId !== runIdRef.current) return;
    if (!resp.ok) {
      let msg = `Failed (HTTP ${resp.status})`;
      try {
        const data = await resp.json();
        msg = data?.error || msg;
      } catch {
        // ignore
      }
      throw new Error(msg);
    }

    setStatus("Finalizing…");
    const blob = await resp.blob();
    if (currentRunId !== runIdRef.current) return;
    const url = URL.createObjectURL(blob);
    if (processedUrlRef.current) URL.revokeObjectURL(processedUrlRef.current);
    processedUrlRef.current = url;
    setProcessedUrl(url);
  };

  const processWithGemini = async (file: File, currentRunId: number) => {
    const apiKey =
      import.meta.env.VITE_GEMINI_API_KEY_WATERMARK || import.meta.env.VITE_GEMINI_API_KEY_CHAT;
    if (!apiKey) {
      throw new Error(
        "Gemini API key not configured. Set VITE_GEMINI_API_KEY_WATERMARK (or VITE_GEMINI_API_KEY_CHAT) in .env."
      );
    }

    setStatus("Encoding image…");
    const base64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error("Failed to read image."));
      reader.onloadend = () => resolve(String(reader.result || ""));
      reader.readAsDataURL(file);
    });
    const base64Data = base64.split(",")[1] || "";

    setStatus("Removing watermark (AI)…");
    const ai = new GoogleGenAI({ apiKey });
    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: [
        {
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType: file.type || "image/png",
                data: base64Data,
              },
            },
          ],
        },
      ],
      config: {
        temperature: 0.2,
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });

    if (currentRunId !== runIdRef.current) return;

    const parts = result.candidates?.[0]?.content?.parts || [];
    const imagePart = parts.find(
      (p: any) => p && typeof p === "object" && p.inlineData && typeof p.inlineData.data === "string"
    ) as { inlineData: { data: string } } | undefined;

    if (!imagePart?.inlineData?.data) {
      throw new Error("AI did not return an image. Try a different photo or prompt.");
    }

    const bytes = Uint8Array.from(atob(imagePart.inlineData.data), (c) => c.charCodeAt(0));
    const outBlob = new Blob([bytes], { type: "image/png" });
    const url = URL.createObjectURL(outBlob);
    if (processedUrlRef.current) URL.revokeObjectURL(processedUrlRef.current);
    processedUrlRef.current = url;
    setProcessedUrl(url);
  };

  const removeWatermark = async () => {
    const file = fileRef.current;
    if (!file) {
      setError("Please upload an image first.");
      return;
    }

    const runId = ++runIdRef.current;
    setError(null);
    setIsProcessing(true);
    setStatus("Starting…");

    try {
      if (provider === "photoroom") {
        await processWithPhotoRoom(file, runId);
      } else {
        await processWithGemini(file, runId);
      }
      if (runId === runIdRef.current) setStatus("Done!");
    } catch (err: any) {
      if (runId !== runIdRef.current) return;
      console.error("Watermark removal error:", err);
      setError(err instanceof Error ? err.message : "Failed to remove watermark.");
      setStatus("");
    } finally {
      if (runId === runIdRef.current) setIsProcessing(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const canUsePhotoRoom = useMemo(() => photoroomConfigured !== false, [photoroomConfigured]);
  const canProcess = Boolean(originalUrl) && !isProcessing;

  const download = () => {
    if (!processedUrl) return;
    const link = document.createElement("a");
    link.href = processedUrl;
    link.download = fileName || "watermark-removed.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="pt-32 pb-24 px-6">
      <input
        type="file"
        ref={fileInputRef}
        onChange={onFileChange}
        className="hidden"
        accept="image/*"
      />

      <header className="pb-8 flex flex-col items-center">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-5xl font-bold tracking-tight text-center bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-[length:200%_auto] bg-clip-text text-transparent animate-gradient-x"
        >
          Watermark Remover (Pro)
        </motion.h1>
        <div className="h-1 w-24 bg-blue-500 rounded-full mt-4" />
        <p className="mt-4 text-center text-sm text-[#8E8E93] max-w-2xl">
          Upload an image, remove watermarks with AI, then download a high-quality PNG.
        </p>
      </header>

      <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <div className="bg-white dark:bg-[#2C2C2E] rounded-[2.5rem] shadow-2xl shadow-blue-500/10 overflow-hidden border border-[#E5E5EA] dark:border-[#3A3A3C]">
          <div
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`relative aspect-[4/5] bg-[#F2F2F7] dark:bg-[#1C1C1E] cursor-pointer flex items-center justify-center ${
              dragActive ? "ring-2 ring-blue-500" : ""
            }`}
          >
            {!originalUrl ? (
              <div className="p-10 text-center">
                <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/40 rounded-3xl flex items-center justify-center mb-6 text-blue-600 dark:text-blue-400 shadow-inner mx-auto">
                  <Upload className="w-10 h-10" />
                </div>
                <h2 className="text-2xl font-bold mb-3 dark:text-white">Upload Image</h2>
                <p className="text-[#8E8E93] text-sm leading-relaxed">
                  Drag and drop an image here,
                  <br />
                  or click to browse
                </p>
                <div className="mt-8 flex items-center justify-center gap-3 text-[10px] font-bold text-[#8E8E93] uppercase tracking-widest">
                  Supports JPG, PNG, WEBP
                </div>
              </div>
            ) : (
              <img src={originalUrl} alt="Original" className="w-full h-full object-contain" />
            )}
          </div>

          <div className="p-6">
            <div className="flex flex-col gap-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-2 text-sm font-bold dark:text-white">
                  <ImageIcon className="w-4 h-4" />
                  Settings
                </div>
                <div className="flex items-center gap-2">
                  <select
                    className="text-xs font-bold px-3 py-2 rounded-xl border border-[#E5E5EA] dark:border-[#3A3A3C] bg-white dark:bg-[#1C1C1E] dark:text-white"
                    value={provider}
                    onChange={(e) => setProvider(e.target.value as Provider)}
                    disabled={isProcessing}
                  >
                    <option value="photoroom" disabled={!canUsePhotoRoom}>
                      PhotoRoom (Best)
                    </option>
                    <option value="gemini">Gemini (Fallback)</option>
                  </select>
                </div>
              </div>

              {provider === "photoroom" && photoroomConfigured === false && (
                <div className="text-xs text-amber-700 dark:text-amber-300 bg-amber-500/10 border border-amber-500/20 rounded-xl px-3 py-2">
                  PhotoRoom is not configured on the server. Set <code>PHOTOROOM_API_KEY</code> to
                  enable it.
                </div>
              )}

              <label className="text-xs font-bold text-[#8E8E93] uppercase tracking-widest">
                Prompt (optional)
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full min-h-24 text-sm rounded-2xl border border-[#E5E5EA] dark:border-[#3A3A3C] bg-white dark:bg-[#1C1C1E] dark:text-white px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/40"
                disabled={isProcessing}
              />

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={removeWatermark}
                  disabled={!canProcess}
                  className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-2xl font-bold text-sm bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  <Sparkles className="w-4 h-4" />
                  {isProcessing ? "Processing…" : "Remove Watermark"}
                </button>
                <button
                  onClick={reset}
                  disabled={isProcessing}
                  className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl font-bold text-sm bg-[#F2F2F7] dark:bg-[#1C1C1E] border border-[#E5E5EA] dark:border-[#3A3A3C] hover:bg-[#E5E5EA] dark:hover:bg-[#3A3A3C] disabled:opacity-50 transition"
                >
                  <Trash2 className="w-4 h-4" />
                  Reset
                </button>
              </div>

              <AnimatePresence>
                {(status || error) && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className={`text-sm rounded-2xl px-4 py-3 border ${
                      error
                        ? "bg-red-500/10 border-red-500/20 text-red-700 dark:text-red-300"
                        : "bg-blue-500/10 border-blue-500/20 text-blue-700 dark:text-blue-300"
                    }`}
                  >
                    {error || status}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#2C2C2E] rounded-[2.5rem] shadow-2xl shadow-purple-500/10 overflow-hidden border border-[#E5E5EA] dark:border-[#3A3A3C]">
          <div className="relative aspect-[4/5] bg-[#F2F2F7] dark:bg-[#1C1C1E] flex items-center justify-center">
            {!processedUrl ? (
              <div className="p-10 text-center">
                <div className="w-20 h-20 bg-purple-100 dark:bg-purple-900/40 rounded-3xl flex items-center justify-center mb-6 text-purple-600 dark:text-purple-400 shadow-inner mx-auto">
                  <Download className="w-10 h-10" />
                </div>
                <h2 className="text-2xl font-bold mb-3 dark:text-white">Result</h2>
                <p className="text-[#8E8E93] text-sm leading-relaxed">
                  Your watermark-removed image will appear here.
                </p>
              </div>
            ) : (
              <img src={processedUrl} alt="Processed" className="w-full h-full object-contain" />
            )}
          </div>

          <div className="p-6">
            <button
              onClick={download}
              disabled={!processedUrl}
              className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-2xl font-bold text-sm bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <Download className="w-4 h-4" />
              Download PNG
            </button>
            <div className="mt-3 text-[11px] text-[#8E8E93] text-center">
              Tip: If parts are still visible, try a tighter prompt like “Remove the bottom-right
              watermark only”.
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
