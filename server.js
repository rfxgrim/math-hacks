import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";

// ESM path fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import Rammerhead server
import rammerhead from "./rammerhead/server.js";

const app = express();
const server = createServer(app);

// Serve your static site
app.use(express.static(__dirname));

// Mount Rammerhead at /proxy
rammerhead(server, {
  path: "/proxy"
});

// SPA fallback
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Math-Hacks running on port ${PORT}`);
});
