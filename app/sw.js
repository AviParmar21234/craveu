/* CraveU service worker — caches the app shell so the prototype opens
   instantly from the home screen and works offline. Bump VERSION on deploy. */
var VERSION = 'craveu-v2';
var SHELL = [
  './',
  './index.html',
  './app.css',
  './app.js',
  './manifest.webmanifest',
  '../assets/logo.png',
  '../assets/u-mark.png',
  '../assets/app-icon-512.png',
  '../assets/favicon.png',
  '../assets/apple-touch-icon.png',
  '../assets/icon-192.png',
  '../assets/icon-512.png'
];

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(VERSION).then(function (c) { return c.addAll(SHELL); }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k !== VERSION; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;
  var url = new URL(req.url);
  // Google Fonts: cache as they arrive, fall back to cache offline.
  if (url.hostname.indexOf('fonts.g') === 0 || url.hostname.indexOf('fonts.') === 0) {
    e.respondWith(caches.open(VERSION).then(function (c) {
      return fetch(req).then(function (res) { c.put(req, res.clone()); return res; }).catch(function () { return c.match(req); });
    }));
    return;
  }
  if (url.origin !== location.origin) return;
  // App shell: network first (so pushes show up), cache fallback (so it works offline).
  e.respondWith(fetch(req).then(function (res) {
    var copy = res.clone();
    caches.open(VERSION).then(function (c) { c.put(req, copy); });
    return res;
  }).catch(function () {
    return caches.match(req, { ignoreSearch: true }).then(function (hit) { return hit || caches.match('./index.html'); });
  }));
});
