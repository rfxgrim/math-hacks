import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import { server as wisp } from "@mercuryworkshop/wisp-js/server";
import { createRequire } from "module";
import fs from "fs";

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const scramjetDir = path.join(__dirname, "node_modules", "@mercuryworkshop", "scramjet", "dist");
const baremuxDir = path.join(__dirname, "node_modules", "@mercuryworkshop", "bare-mux", "dist");
const epoxyDir = path.join(__dirname, "node_modules", "@mercuryworkshop", "epoxy-transport", "dist");

// Serve proxy assets
app.use("/scram/", express.static(scramjetDir));
app.use("/baremux/", express.static(baremuxDir));
app.use("/epoxy/", express.static(epoxyDir));
app.use(express.static(__dirname));

// Keep-alive endpoint for cron-job.org
app.get("/ping", (req, res) => res.send("pong"));

// Debug route
app.get("/debug-scram-dist", (req, res) => {
  try {
    const files = fs.readdirSync(scramjetDir);
    res.json(files);
  } catch(e) {
    res.json({ error: e.message });
  }
});

// Fallback to index.html (SPA routing)
app.get("*", (req, res) => {
  if (req.url.startsWith("/scramjet/")) return;
  res.sendFile(path.join(__dirname, "index.html"));
});

const server = createServer(app);

// FIX 1: Flexible Wisp upgrade for Safari/Render compatibility
server.on("upgrade", (req, socket, head) => {
  if (req.url.startsWith("/wisp")) {
    wisp.routeRequest(req, socket, head);
  } else {
    socket.destroy();
  }
});

// FIX 2: Explicitly bind to 0.0.0.0 and Port 10000
const PORT = process.env.PORT || 10000;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`Math-Hacks is Live on port ${PORT}`);
});
