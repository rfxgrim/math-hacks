importScripts("/assets/scramjet/scramjet.all.js");

const { ScramjetServiceWorker } = $scramjetLoadWorker();
const scramjet = new ScramjetServiceWorker();

scramjet.config = {
  prefix: "/scramjet/",
  files: {
    wasm: "/assets/scramjet/scramjet.wasm.wasm",
    all: "/assets/scramjet/scramjet.all.js",
    sync: "/assets/scramjet/scramjet.sync.js",
  },
  flags: {
    serviceworkers: false,
    syncxhr: false,
    strictRewrites: true,
    rewriterLogs: false,
    captureErrors: true,
    cleanErrors: false,
    scramitize: false,
    sourcemaps: true,
    destructureRewrites: false,
    interceptDownloads: false,
    allowInvalidJs: true,
    allowFailedIntercepts: true,
  },
  codec: {
    encode: "e=>e?encodeURIComponent(e):e",
    decode: "e=>e?decodeURIComponent(e):e",
  },
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