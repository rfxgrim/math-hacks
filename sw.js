importScripts("/scram/scramjet.all.js");

const { ScramjetServiceWorker } = $scramjetLoadWorker();
const scramjet = new ScramjetServiceWorker();

const BYPASS = ["/scram/", "/baremux/", "/epoxy/", "/sw.js", "/index.html", "/css/", "/js/"];

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  
  // Never intercept our own assets
  if (BYPASS.some(path => url.pathname.startsWith(path))) return;
  
  // Only intercept scramjet-prefixed requests
  if (!url.pathname.startsWith("/scramjet/")) return;

  if (scramjet.route(event)) {
    event.respondWith((async () => {
      await scramjet.loadConfig();
      return scramjet.fetch(event);
    })());
  }
});