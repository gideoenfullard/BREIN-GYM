// ═══════════════════════════════════════════════════════════════════
// BREIN GYM — sw.js (service worker)
// Doel: maak die PWA offline-bruikbaar, MAAR sonder om ooit op 'n ou
// weergawe vas te haak. Strategie:
//   • Selfde-oorsprong (index.html, app.js, ens.) → NETWORK-FIRST:
//       altyd eers vars probeer haal; val net op die kas terug as jy
//       offline is. So sien jy elke deploy dadelik die nuutste weergawe.
//   • CDN (React/Babel van unpkg) → CACHE-FIRST: vinnig, en werk offline
//       ná die eerste keer.
//
// BELANGRIK: as jy in die toekoms iets verander en dit haak steeds vas,
// verhoog net die weergawe-nommer hieronder (v3 → v4). Die ou kas word
// dan outomaties uitgevee.
// ═══════════════════════════════════════════════════════════════════

const CACHE = 'breingym-v3';

// Die kern-lêers wat ons offline wil hê. Paaie is relatief tot die
// service worker se scope (bv. /BREIN-GYM/).
const SHELL = [
  './',
  './index.html',
  './app.js',
  './manifest.json',
  './icon.svg',
  './icon-192.png'
];

// ── INSTALL: pre-cache die kern-lêers (elkeen apart, sodat 'n enkele
//    ontbrekende lêer nie die hele install laat misluk nie). ──
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then(async (cache) => {
      await Promise.all(
        SHELL.map((url) =>
          cache.add(url).catch((err) => {
            // Moenie install laat val as een lêer ontbreek nie
            console.warn('SW pre-cache oorgeslaan:', url, err);
          })
        )
      );
      // Aktiveer die nuwe service worker dadelik (moenie wag nie)
      await self.skipWaiting();
    })
  );
});

// ── ACTIVATE: vee enige OU kasse uit (alles wat nie die huidige CACHE is
//    nie), en neem dadelik beheer van oop bladsye. ──
self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))
      );
      await self.clients.claim();
    })()
  );
});

// ── FETCH: kies strategie volgens oorsprong. ──
self.addEventListener('fetch', (event) => {
  const req = event.request;

  // Net GET-versoeke word gekas
  if (req.method !== 'GET') return;

  let url;
  try {
    url = new URL(req.url);
  } catch {
    return;
  }

  const sameOrigin = url.origin === self.location.origin;

  if (sameOrigin) {
    // NETWORK-FIRST: altyd eers vars probeer haal.
    event.respondWith(
      fetch(req)
        .then((res) => {
          // Stoor 'n vars kopie vir offline-gebruik
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
          return res;
        })
        .catch(async () => {
          // Offline: gebruik die kas; val terug op index.html vir navigasie
          const hit = await caches.match(req);
          if (hit) return hit;
          if (req.mode === 'navigate') {
            const shell = await caches.match('./index.html');
            if (shell) return shell;
          }
          return Response.error();
        })
    );
  } else {
    // CDN (React/ReactDOM/Babel): CACHE-FIRST, dan netwerk.
    event.respondWith(
      caches.match(req).then((hit) => {
        if (hit) return hit;
        return fetch(req)
          .then((res) => {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
            return res;
          })
          .catch(() => hit || Response.error());
      })
    );
  }
});
