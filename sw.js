importScripts("/assets/scramjet/scramjet.all.js");

const { ScramjetServiceWorker } = $scramjetLoadWorker();
const scramjet = new ScramjetServiceWorker();

scramjet.config = {
  prefix: "/scramjet/",
  codec: "plain",
  wasm: "/assets/scramjet/scramjet.wasm.wasm",
  all: "/assets/scramjet/scramjet.all.js",
  sync: "/assets/scramjet/scramjet.sync.js",
};

async function handleRequest(event) {
  if (scramjet.route(event)) {
    return scramjet.fetch(event);
  }
  return fetch(event.request);
}

self.addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event));
});