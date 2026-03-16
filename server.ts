<<<<<<< HEAD
import "dotenv/config";
import express from "express";
import path from "path";
import multer from "multer";
import axios from "axios";
import FormData from "form-data";

const app = express();
=======
import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import multer from "multer";
import fs from "fs";
import FormData from "form-data";
import axios from "axios";

const app = express();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
>>>>>>> 7fcffe0a0c3215adf6396fb4a7b067e90c0b13c6

// API routes
app.get("/api/test", (req, res) => {
  res.json({ message: "API is working!", env: process.env.NODE_ENV });
});

<<<<<<< HEAD
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB
});

app.get("/api/watermark/status", (req, res) => {
  res.json({ photoroomConfigured: Boolean(process.env.PHOTOROOM_API_KEY) });
});

app.post("/api/watermark/remove", upload.single("image"), async (req, res) => {
  const apiKey = process.env.PHOTOROOM_API_KEY;
  if (!apiKey) {
    return res.status(501).json({
      error:
        "PhotoRoom API key not configured. Please set PHOTOROOM_API_KEY on the server.",
    });
  }

  const file = req.file;
  if (!file) {
    return res.status(400).json({
      error: "Missing image file. Send multipart/form-data with field name 'image'.",
    });
  }

  const prompt =
    typeof (req.body as any)?.prompt === "string" && (req.body as any).prompt.trim()
      ? (req.body as any).prompt.trim()
      : "Remove all watermarks, logos, and text overlays from the image while keeping the rest unchanged. Fill removed areas naturally and seamlessly, preserving details and resolution.";

  const mode =
    typeof (req.body as any)?.mode === "string" && (req.body as any).mode.trim()
      ? (req.body as any).mode.trim()
      : "ai.auto";

  try {
    const form = new FormData();
    form.append("imageFile", file.buffer, {
      filename: file.originalname || "image.png",
      contentType: file.mimetype || "application/octet-stream",
    });
    form.append("removeBackground", "false");
    form.append("editWithAI.mode", mode);
    form.append("editWithAI.prompt", prompt);

    const upstream = await axios.post("https://image-api.photoroom.com/v2/edit", form, {
      headers: {
        ...form.getHeaders(),
        "x-api-key": apiKey,
      },
      responseType: "arraybuffer",
      validateStatus: () => true,
      timeout: 120_000,
    });

    if (upstream.status >= 400) {
      const contentType = String(upstream.headers["content-type"] || "");
      if (contentType.includes("application/json")) {
        try {
          const json = JSON.parse(Buffer.from(upstream.data).toString("utf8"));
          return res.status(upstream.status).json({
            error: "PhotoRoom API error",
            details: json,
          });
        } catch {
          // fall through
        }
      }
      return res.status(upstream.status).json({
        error: "PhotoRoom API error",
        details: Buffer.from(upstream.data).toString("utf8").slice(0, 2000),
      });
    }

    res.setHeader("Content-Type", upstream.headers["content-type"] || "image/png");
    return res.status(200).send(Buffer.from(upstream.data));
  } catch (err: any) {
    console.error("PhotoRoom watermark removal error:", err);
    const message =
      typeof err?.message === "string" ? err.message : "Failed to remove watermark.";
    return res.status(500).json({ error: message });
=======
app.post("/api/remove-bg", upload.single("image"), async (req, res) => {
  try {
    console.log("--- New Background Removal Request (Memory Storage) ---");
    if (!req.file) {
      console.error("No file received in the request");
      return res.status(400).json({ error: "No image uploaded. Please select an image." });
    }

    console.log("File received:", {
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size
    });

    // Use environment variable if available, otherwise use the provided fallback key
    const apiKey = process.env.PHOTOROOM_API_KEY || "sk_pr_backgroundremover_82da5717efd8ce6e7080e40b68a4616dfb293f00";
    
    if (!apiKey || apiKey === "YOUR_PHOTOROOM_API_KEY_HERE") {
      return res.status(500).json({ error: "Photoroom API key is missing. Please add PHOTOROOM_API_KEY to your environment variables." });
    }

    const formData = new FormData();
    formData.append("image_file", req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
    });

    console.log("Sending request to Photoroom API...");
    
    const response = await axios.post("https://sdk.photoroom.com/v1/segment", formData, {
      headers: {
        "x-api-key": apiKey,
        ...formData.getHeaders(),
      },
      responseType: "arraybuffer",
      timeout: 30000,
    });

    console.log("Photoroom API success, status:", response.status);
    
    res.set("Content-Type", "image/png");
    res.send(Buffer.from(response.data));
  } catch (error: any) {
    let errorMessage = error.message;
    let statusCode = 500;

    if (error.response) {
      statusCode = error.response.status;
      if (error.response.data instanceof Buffer || error.response.data instanceof ArrayBuffer) {
        try {
          const decoded = JSON.parse(Buffer.from(error.response.data).toString());
          errorMessage = decoded.message || decoded.error || JSON.stringify(decoded);
        } catch (e) {
          errorMessage = Buffer.from(error.response.data).toString();
        }
      } else {
        errorMessage = JSON.stringify(error.response.data);
      }
    }

    console.error("SERVER ERROR:", { 
      statusCode, 
      errorMessage, 
      photoroomData: error.response?.data ? Buffer.from(error.response.data).toString() : "No data"
    });
    
    res.status(statusCode).json({ 
      error: errorMessage,
      details: error.response?.data ? Buffer.from(error.response.data).toString() : undefined
    });
>>>>>>> 7fcffe0a0c3215adf6396fb4a7b067e90c0b13c6
  }
});

async function startServer() {
  const PORT = 3000;

<<<<<<< HEAD
  if (process.env.NODE_ENV !== "production") {
    // Dynamic import for Vite to avoid bundling it in production
    const { createServer: createViteServer } = await import("vite");
=======
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
>>>>>>> 7fcffe0a0c3215adf6396fb4a7b067e90c0b13c6
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

<<<<<<< HEAD
  // Only listen if not on Vercel
=======
>>>>>>> 7fcffe0a0c3215adf6396fb4a7b067e90c0b13c6
  if (!process.env.VERCEL) {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  }
}

startServer();

export default app;
