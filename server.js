import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import { createBareServer } from "@tomphttp/bare-server-node";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const bareServer = createBareServer("/bare/");

const scramjetDir = path.join(__dirname, "node_modules", "@mercuryworkshop", "scramjet", "dist");
const baremuxDir = path.join(__dirname, "node_modules", "@mercuryworkshop", "bare-mux", "dist");
const epoxyDir = path.join(__dirname, "node_modules", "@mercuryworkshop", "epoxy-transport", "dist");

console.log("Scramjet path:", scramjetDir);
console.log("Baremux path:", baremuxDir);
console.log("Epoxy path:", epoxyDir);

app.use("/scram/", express.static(scramjetDir));
app.use("/baremux/", express.static(baremuxDir));
app.use("/epoxy/", express.static(epoxyDir));

app.use(express.static(__dirname));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

const server = createServer((req, res) => {
  if (bareServer.shouldRoute(req)) {
    bareServer.routeRequest(req, res);
  } else {
    app(req, res);
  }
});

server.on("upgrade", (req, socket, head) => {
  if (bareServer.shouldRoute(req)) {
    bareServer.routeUpgrade(req, socket, head);
  } else {
    socket.destroy();
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Math-Hacks running on port ${PORT}`);
});