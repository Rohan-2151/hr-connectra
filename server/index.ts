
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const port = process.env.PORT || 3000;

// Needed because you're using ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve built client
app.use(express.static(path.join(__dirname, "../dist/public")));

// API routes example
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Fallback for SPA
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../dist/public/index.html"));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
