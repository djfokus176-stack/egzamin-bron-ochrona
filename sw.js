const CACHE="egzamin-ochrona-offline-1-3-1-auth";
const RESOURCES=["./","./index.html","./report.js","./manifest.webmanifest","./icons/icon.svg","./privacy.html","./audit.html","./account.html","./account.js"];
self.addEventListener("install",event=>{
 event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(RESOURCES)).then(()=>self.skipWaiting()));
});
self.addEventListener("activate",event=>{
 event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith("egzamin-ochrona-")&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener("fetch",event=>{
 if(event.request.method!=="GET"||new URL(event.request.url).origin!==self.location.origin)return;
 const u=new URL(event.request.url);
 // Konfiguracja Firebase musi być zawsze pobierana na świeżo po edycji na GitHubie.
 if(u.pathname.endsWith("/firebase-config.js"))return;
 if(event.request.mode==="navigate"){
  event.respondWith(fetch(event.request).then(res=>{
   if(res.ok)caches.open(CACHE).then(c=>c.put(event.request,res.clone()));
   return res;
  }).catch(()=>caches.match(event.request).then(r=>r||caches.match("./index.html"))));
 }else{
  event.respondWith(caches.match(event.request).then(c=>c||fetch(event.request).then(r=>{
   if(r.ok)caches.open(CACHE).then(cache=>cache.put(event.request,r.clone()));
   return r;
  })));
 }
});