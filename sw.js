// Offline cache. Bump VERSION whenever any file changes so tablets pick up the update.
const VERSION='ckl-v10';
const ASSETS=['./','./index.html','./manifest.json','./css/style.css','./js/audio.js','./js/lessons.js','./js/app.js','./icons/icon.svg','./icons/icon-192.png','./icons/icon-512.png','./img/money/note_5_back.webp','./img/money/note_10_back.webp','./img/money/note_20_back.webp','./img/money/note_50_back.webp','./img/money/note_100_back.webp','./img/money/coin_10c.webp','./img/money/coin_25c.webp','./img/money/coin_1.webp'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(VERSION).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==VERSION).map(x=>caches.delete(x)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;e.respondWith(caches.match(e.request,{ignoreSearch:true}).then(r=>r||fetch(e.request)));});
