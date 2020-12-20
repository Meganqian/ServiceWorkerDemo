let VERSION = 4;
let CACHE_NAME = 'cache_v' + VERSION;
let CACHE_URLS = [
    '/',
    '/api/movies',
    '/css/main.css',
    '/js/main.js',
    '/js/ui.js',
    '/js/render.js',
    '/img/logo.png '
];

function precache() {
    return caches.open(CACHE_NAME).then(function (cache) {
        return cache.addAll(CACHE_URLS);
    });
}

function clearStaleCache() {
    return caches.keys().then(keys => {
        keys.forEach(key => {
            if (CACHE_NAME !== key) {
                caches.delete(key);
            }
        });
    });
}

// 下载新的缓存
self.addEventListener('install', function (event) {
    event.waitUntil(
        precache().then(self.skipWaiting)
    );
});

// 删除旧的缓存
self.addEventListener('activate', function (event) {
    event.waitUntil(
        Promise.all([
            self.clients.claim(),
            clearStaleCache()
        ])
    );
});


function fetchAndCache(req) {
    return fetch(req)
        .then(function (res) {
            saveToCache(req, res.clone());
            return res;
        });
}

function saveToCache(req, res) {
    return caches
        .open(CACHE_NAME)
        .then(cache => cache.put(req, res));
}

self.addEventListener('fetch',function(event){
    // 只对同源的资源走 sw，cdn 上的资源利用 http 缓存策略
    if (new URL(event.request.url).origin !== self.origin) {
        return;
    }

    if (event.request.url.includes('/api/movies')) {
        event.respondWith(
            fetchAndCache(event.request)
                .catch(function () {
                    return caches.match(event.request);
                })
        );
        return;
    }

    event.respondWith(
        fetch(event.request).catch(function(){
            return caches.match(event.request)
        })
    )
})