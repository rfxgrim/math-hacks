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

app.use("/assets/scramjet/", express.static(scramjetDir));
app.use("/assets/baremux/", express.static(baremuxDir));
app.use("/assets/epoxy/", express.static(epoxyDir));

app.use(express.static(__dirname));

app.get("*", (req, res) => {
  if (req.url.startsWith("/scramjet/")) return;
  res.sendFile(path.join(__dirname, "index.html"));
});

const server = createServer(app);

server.on("upgrade", (req, socket, head) => {
  if (req.url.endsWith("/wisp/")) {
    wisp.routeRequest(req, socket, head);
  } else {
    socket.destroy();
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Math-Hacks running on port ${PORT}`);
});