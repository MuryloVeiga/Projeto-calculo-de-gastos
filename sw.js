// Service worker: deixa o app abrir offline e pega atualizações assim que houver internet.
// O GitHub Pages manda guardar os arquivos por 10 min (max-age=600); por isso toda busca aqui
// ignora o cache HTTP do navegador ('no-store'/'reload'), senão o iPhone recebia a versão velha.
// Ao mudar o app, aumente VERSION: 2.2 → 2.3 → 2.4... (também aparece em Ajustes).
const VERSION = '2.6';
const CACHE = 'financas-v' + VERSION;
const ASSETS = ['./', './index.html', './manifest.webmanifest', './icon-180.png', './icon-192.png', './icon-512.png'];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE)
      .then((c) => c.addAll(ASSETS.map((u) => new Request(u, { cache: 'reload' }))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('message', (e) => {
  if (e.data === 'version' && e.source) e.source.postMessage({ version: VERSION });
});

// Primeiro a internet (sem cache HTTP), com limite de 4 s; sem internet, usa o que está guardado.
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  e.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const key = req.mode === 'navigate' ? './index.html' : req;
    const net = fetch(req, { cache: 'no-store' }).then((res) => {
      if (res.ok) cache.put(key, res.clone());
      return res;
    });
    const timeout = new Promise((resolve) => setTimeout(resolve, 4000));
    try {
      const res = await Promise.race([net, timeout]);
      if (res) return res;
    } catch (err) { /* sem internet */ }
    const hit = await cache.match(key, { ignoreSearch: true });
    return hit || net;
  })());
});
