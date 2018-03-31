const VERSION = '1.1';
const FILES = [
  'icon-192.png',
  'index.html',
  'manifest.json',
  './'
];

self.addEventListener('install', function(event) {
  console.log('Installing service worker')
  event.waitUntil(
    caches.open(`kcalculator-${VERSION}`)
     .then(function(cache) {
       return cache.addAll(FILES);
    })
  );
});

self.addEventListener('activate', function() {
  console.log('Service worker active')
  caches.keys()
    .then(cacheNames =>
      Promise.all(
        cacheNames
          .map(c => c.split('-'))
          .filter(c => c[0] === 'kcalculator')
          .filter(c => c[1] !== VERSION)
          .map(c => caches.delete(c.join('-')))
      )
    )
});

self.addEventListener('fetch', function(event) {
  console.log('Service worker fetch')
  var request = event.request;
  event.respondWith(
    caches.match(request)
      .then(function(response) {
        if (response) {
          return response;
        }
        return fetch(request);
      }
    )
  );

});
