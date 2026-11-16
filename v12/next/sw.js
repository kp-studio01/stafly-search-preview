/* Stafly Search: saved files.
   Page: always fresh from the network when online; the saved copy opens when offline or the network is very slow.
   Map and QR library files and fonts: saved once, then opened from the phone.
   Stafly's server calls, photos, map tiles and payments are never touched. */
const SCOPE = self.registration.scope;
const PAGES = 'sf1-page:' + SCOPE, LIBS = 'sf1-lib', FONTS = 'sf1-font';
const SLOW_MS = 5000;
const isLib = (u) => u.origin === location.origin && /\/lib\/[^/]+\.[0-9a-f]{8}\.(js|css)$/.test(u.pathname);

async function savePage() {
  const res = await fetch(SCOPE, { cache: 'no-cache' });
  if (!res.ok) return;
  const text = await res.clone().text();
  await (await caches.open(PAGES)).put(SCOPE, res);
  const want = [...text.matchAll(/(?:src|href)="(\.\.\/lib\/[^"]+\.[0-9a-f]{8}\.(?:js|css))"/g)].map((m) => new URL(m[1], SCOPE).href);
  const libs = await caches.open(LIBS);
  await Promise.all(want.map(async (u) => { if (!(await libs.match(u))) { const r = await fetch(u); if (r.ok) await libs.put(u, r); } }));
}
self.addEventListener('install', (e) => { self.skipWaiting(); e.waitUntil(savePage().catch(() => {})); });
self.addEventListener('activate', (e) => { e.waitUntil(self.clients.claim()); });

async function page(e) {
  const cache = await caches.open(PAGES);
  const net = fetch(e.request).then(async (res) => { if (res.ok) await cache.put(SCOPE, res.clone()); return res; });
  const saved = await cache.match(SCOPE);
  if (!saved) return net;
  e.waitUntil(net.catch(() => {}));
  const slow = new Promise((ok) => setTimeout(() => ok(null), SLOW_MS));
  const first = await Promise.race([net.catch(() => null), slow]);
  return first && first.ok ? first : saved;
}
async function lib(req) {
  const cache = await caches.open(LIBS);
  const hit = await cache.match(req.url);
  if (hit) return hit;
  const res = await fetch(req);
  if (res.ok) await cache.put(req.url, res.clone());
  return res;
}
async function font(e, fresh) {
  const cache = await caches.open(FONTS);
  const hit = await cache.match(e.request.url);
  const net = fetch(e.request).then(async (res) => { if (res.ok || res.type === 'opaque') await cache.put(e.request.url, res.clone()); return res; });
  if (!hit) return net;
  if (fresh) e.waitUntil(net.catch(() => {})); else net.catch(() => {});
  return hit;
}
self.addEventListener('fetch', (e) => {
  const r = e.request; if (r.method !== 'GET') return;
  const u = new URL(r.url);
  if (r.mode === 'navigate') { if (u.origin + u.pathname === SCOPE) e.respondWith(page(e)); return; }
  if (isLib(u)) { e.respondWith(lib(r)); return; }
  if (u.hostname === 'fonts.googleapis.com') { e.respondWith(font(e, true)); return; }
  if (u.hostname === 'fonts.gstatic.com') { e.respondWith(font(e, false)); return; }
});
