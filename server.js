import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import { createBareServer } from "@tomphttp/bare-server-node";
import { scramjetPath } from "@mercuryworkshop/scramjet/path";
import { baremuxPath } from "@mercuryworkshop/bare-mux/node";
import { epoxyPath } from "@mercuryworkshop/epoxy-transport";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const bareServer = createBareServer("/bare/");

app.use("/scram/", express.static(scramjetPath));
app.use("/baremux/", express.static(baremuxPath));
app.use("/epoxy/", express.static(epoxyPath));

app.use(express.static(__dirname));

app.get("*", (req, res) => {
  if (!bareServer.shouldRoute(req)) {
    res.sendFile(path.join(__dirname, "index.html"));
  }
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