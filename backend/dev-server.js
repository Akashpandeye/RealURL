import cors from "cors";
import express from "express";

// Ensure dotenv runs before other imports!
import "dotenv/config";

import codesHandler from "./api/codes.js";
import healthHandler from "./api/health.js";
import idHandler from "./api/[id].js";
import shortCodeHandler from "./api/[shortCode].js";
import shortenHandler from "./api/shorten.js";

const app = express();
app.use(cors());
app.use(express.json());

const wrapHandler = (handler) => async (req, res) => {
  const mergedQuery = { ...req.query, ...req.params };
  Object.defineProperty(req, "query", {
    get: () => mergedQuery,
    configurable: true,
  });

  try {
    await handler(req, res);
  } catch (e) {
    if (!res.headersSent) {
      res.status(500).json({ error: "Internal Server Error", message: e?.message || String(e) });
    }
  }
};

app.post("/api/shorten", wrapHandler(shortenHandler));
app.get("/api/health", wrapHandler(healthHandler));
app.get("/api/codes", wrapHandler(codesHandler));
app.delete("/api/:id", wrapHandler(idHandler));
app.get("/api/:shortCode", wrapHandler(shortCodeHandler));

const PORT = Number(process.env.PORT || 3001);
app.listen(PORT, () => {
  console.log(`✅ Local Dev Server running on http://localhost:${PORT}`);
});

