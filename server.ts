import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import multer from "multer";
import fs from "fs";
import FormData from "form-data";

async function startServer() {
  const app = express();
  const PORT = 3000;

  const upload = multer({ dest: "uploads/" });

  // Ensure uploads directory exists
  if (!fs.existsSync("uploads")) {
    fs.mkdirSync("uploads");
  }

  // API routes
  app.post("/api/remove-bg", upload.single("image"), async (req, res) => {
    try {
      console.log("Received background removal request");
      if (!req.file) {
        console.error("No file in request");
        return res.status(400).json({ error: "No image uploaded" });
      }

      // Use environment variable if available, otherwise use the provided fallback key
      const apiKey = process.env.PHOTOROOM_API_KEY || "sk_pr_backgroundremover_82da5717efd8ce6e7080e40b68a4616dfb293f00";
      
      if (!apiKey) {
        console.error("PHOTOROOM_API_KEY is not set");
        return res.status(500).json({ error: "Background removal service is not configured." });
      }

      const fileBuffer = fs.readFileSync(req.file.path);
      const formData = new FormData();
      formData.append("image_file", fileBuffer, {
        filename: req.file.originalname,
        contentType: req.file.mimetype,
      });

      console.log("Calling Photoroom API with file:", req.file.originalname, "type:", req.file.mimetype);
      
      const buffer = formData.getBuffer();
      const response = await fetch("https://sdk.photoroom.com/v1/segment", {
        method: "POST",
        headers: {
          "x-api-key": apiKey,
          ...formData.getHeaders(),
          "Content-Length": buffer.length.toString(),
        },
        body: buffer,
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch (e) {
          errorData = { message: errorText };
        }
        
        console.error("Photoroom API error status:", response.status);
        console.error("Photoroom API error data:", errorData);
        
        if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
        
        return res.status(response.status).json({ 
          error: errorData.message || errorData.error || `Photoroom API Error (${response.status})`, 
          details: errorData 
        });
      }

      console.log("Photoroom API success, sending image back");
      const imageBuffer = await response.arrayBuffer();
      if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
      
      res.set("Content-Type", "image/png");
      res.send(Buffer.from(imageBuffer));
    } catch (error: any) {
      console.error("Server error:", error);
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      res.status(500).json({ error: error.message || "Internal server error" });
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
