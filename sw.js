// sw.js - service worker minimal pour TankBuster

self.addEventListener('install', event => {
  // on passe immédiatement à l'étape suivante
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  // on prend le contrôle des pages ouvertes
  event.waitUntil(self.clients.claim());
});

// Pas de logique de cache ici : la PWA fonctionne uniquement en ligne
