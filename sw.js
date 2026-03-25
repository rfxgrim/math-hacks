importScripts("/scram/scramjet.all.js");

const { ScramjetServiceWorker } = $scramjetLoadWorker();
const scramjet = new ScramjetServiceWorker();

self.addEventListener("fetch", (event) => {
  // Only intercept scramjet-prefixed requests
  if (!event.request.url.includes("/scramjet/")) return;
  if (scramjet.route(event)) {
    event.respondWith((async () => {
      await scramjet.loadConfig();
      return scramjet.fetch(event);
    })());
  }
});