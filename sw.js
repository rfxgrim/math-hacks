importScripts("/assets/scramjet/scramjet.all.js");

const { ScramjetServiceWorker } = $scramjetLoadWorker();
const scramjet = new ScramjetServiceWorker();

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (url.pathname.startsWith("/assets/")) return;
  if (url.pathname.startsWith("/css/")) return;
  if (url.pathname.startsWith("/js/")) return;
  if (url.pathname === "/sw.js") return;
  if (url.pathname === "/go.html") return;
  if (url.pathname === "/" || url.pathname === "/index.html") return;
  if (!url.pathname.startsWith("/scramjet/")) return;

  if (scramjet.route(event)) {
    event.respondWith(scramjet.fetch(event));
  }
});