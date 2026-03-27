importScripts("/assets/scramjet/scramjet.all.js");

const { ScramjetServiceWorker } = $scramjetLoadWorker();
const scramjet = new ScramjetServiceWorker();

async function waitForConfig() {
  for (let i = 0; i < 20; i++) {
    await scramjet.loadConfig();
    if (scramjet.config) return;
    await new Promise(r => setTimeout(r, 300));
  }
}

async function handleRequest(event) {
  if (!scramjet.config) {
    await waitForConfig();
  }
  if (scramjet.route(event)) {
    return scramjet.fetch(event);
  }
  return fetch(event.request);
}

self.addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event));
});