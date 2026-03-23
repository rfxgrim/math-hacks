import { scramjetPath } from "@mercuryworkshop/scramjet/path";
import { baremuxPath } from "@mercuryworkshop/bare-mux/node";
import { epoxyPath } from "@mercuryworkshop/epoxy-transport";
import { createServer } from "http";
import { createBareServer } from "@tomphttp/bare-server-node";
import express from "express";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const bareServer = createBareServer("/bare/");

// Serve Scramjet files under /scram/
app.use("/scram/", express.static(scramjetPath));

// Serve BareMux files under /baremux/
app.use("/baremux/", express.static(baremuxPath));

// Serve Epoxy transport under /epoxy/
app.use("/epoxy/", express.static(epoxyPath));

// Serve your public folder
app.use(express.static(path.join(__dirname, "public")));

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

server.listen(3000, () => console.log("Running on http://localhost:3000"));