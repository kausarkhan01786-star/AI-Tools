import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import multer from "multer";
import fs from "fs";
import FormData from "form-data";
import axios from "axios";

async function startServer() {
  const app = express();
  const PORT = 3000;

  const upload = multer({ dest: "/tmp/uploads/" });

  // Ensure uploads directory exists
  if (!fs.existsSync("/tmp/uploads")) {
    fs.mkdirSync("/tmp/uploads", { recursive: true });
  }

  // API routes
  app.post("/api/remove-bg", upload.single("image"), async (req, res) => {
    try {
      console.log("--- New Background Removal Request ---");
      if (!req.file) {
        console.error("No file received in the request");
        return res.status(400).json({ error: "No image uploaded. Please select an image." });
      }

      console.log("File received:", {
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        path: req.file.path
      });

      // Use environment variable if available, otherwise use the provided fallback key
      const apiKey = process.env.PHOTOROOM_API_KEY || "sk_pr_backgroundremover_82da5717efd8ce6e7080e40b68a4616dfb293f00";
      
      if (!apiKey || apiKey === "YOUR_PHOTOROOM_API_KEY_HERE") {
        console.error("PHOTOROOM_API_KEY is missing or invalid");
        return res.status(500).json({ error: "Photoroom API key is not configured. Please add PHOTOROOM_API_KEY to Vercel environment variables." });
      }

      console.log("Reading file from disk...");
      const fileBuffer = fs.readFileSync(req.file.path);
      
      const formData = new FormData();
      formData.append("image_file", fileBuffer, {
        filename: req.file.originalname,
        contentType: req.file.mimetype,
      });

      console.log("Sending request to Photoroom API using Axios...");
      
      const response = await axios.post("https://sdk.photoroom.com/v1/segment", formData, {
        headers: {
          "x-api-key": apiKey,
          ...formData.getHeaders(),
        },
        responseType: "arraybuffer",
      });

      console.log("Photoroom API success, status:", response.status);
      
      // Cleanup
      if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
      
      console.log("Sending processed image back to client");
      res.set("Content-Type", "image/png");
      res.send(Buffer.from(response.data));
    } catch (error: any) {
      console.error("CRITICAL SERVER ERROR:", error.response?.data ? error.response.data.toString() : error.message);
      
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }

      const status = error.response?.status || 500;
      let errorMessage = error.message;

      if (error.response?.data) {
        try {
          const errorData = JSON.parse(error.response.data.toString());
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (e) {
          errorMessage = error.response.data.toString() || errorMessage;
        }
      }

      res.status(status).json({ error: `Photoroom Error: ${errorMessage}` });
    }
  });

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

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
