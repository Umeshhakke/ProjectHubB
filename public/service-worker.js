self.addEventListener('install', () => {
  self.skipWaiting();
});
self.addEventListener('activate', () => {
  clients.claim();
});
self.addEventListener('fetch', () => {}); // minimal offline support