let VERSION = 1;
let CACHE_NAME = 'cache_v' + VERSION;
let CACHE_URLS = [
    '/',
    '/api/movies',
    '/css/main.css',
    '/js/main.js',
    '/js/render.js',
    '/img/logo.png '
];

// 开辟一块与service worker相对应的缓存区域 会返回一个promise
function precache() {
    return caches.open(CACHE_NAME).then(function (cache) {
        return cache.addAll(CACHE_URLS);
    });
}

// 安装 register被注册成功之后 install事件就会被触发（install是sw触发的第一个事件 ）
self.addEventListener('install', function (event) {
    console.log('install')
    event.waitUntil(
        precache().then(self.skipWaiting)
    );
});


function clearStaleCache() {
    return caches.keys().then(keys => {
        keys.forEach(key => {
            if (CACHE_NAME !== key) {
                caches.delete(key);
            }
        });
    });
}

// 删除更新 旧的缓存
self.addEventListener('activate', function (event) {
    event.waitUntil(
        Promise.all([
            self.clients.claim(),
            clearStaleCache()
        ])
    );
});

// 保存缓存资源
function saveToCache(req, res) {
    return caches.open(CACHE_NAME)
        .then(cache => cache.put(req, res));
}

// 请求资源
function fetchAndCache(req) {
    return fetch(req)
        .then(function (res) {
            saveToCache(req, res.clone());
            return res;
        });
}

self.addEventListener('fetch',function(event){
    // 只对同源的资源走sw，cdn 上的资源利用 http 缓存策略
    // if (new URL(event.request.url).origin !== self.origin) {
    //     return;
    // }
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