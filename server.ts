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

// API routes
app.get("/api/test", (req, res) => {
  res.json({ message: "API is working!", env: process.env.NODE_ENV });
});

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
      timeout: 30000, // 30 seconds timeout
    });

    console.log("Photoroom API success, status:", response.status);
    
    res.set("Content-Type", "image/png");
    res.send(Buffer.from(response.data));
  } catch (error: any) {
    console.error("SERVER ERROR DETAILS:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data ? error.response.data.toString() : "No data"
    });

    const status = error.response?.status || 500;
    let errorMessage = error.message;

    if (error.response?.data) {
      try {
        const errorString = error.response.data.toString();
        const errorData = JSON.parse(errorString);
        errorMessage = errorData.message || errorData.error || errorString;
      } catch (e) {
        errorMessage = error.response.data.toString() || errorMessage;
      }
    }

    res.status(status).json({ error: `Photoroom API Error: ${errorMessage}` });
  }
});

async function startServer() {
  const PORT = 3000;

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
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

  if (!process.env.VERCEL) {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  }
}

startServer();

export default app;
