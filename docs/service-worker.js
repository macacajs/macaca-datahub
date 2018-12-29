/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js");

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [
  {
    "url": "404.html",
    "revision": "70f640e07a16ab35f18171c9df30ef7e"
  },
  {
    "url": "assets/css/0.styles.f0400774.css",
    "revision": "b16e815fc972fa6e26f91610002378ce"
  },
  {
    "url": "assets/img/search.83621669.svg",
    "revision": "83621669651b9a3d4bf64d1a670ad856"
  },
  {
    "url": "assets/js/2.f46b35d6.js",
    "revision": "482860428bc46850870028af06499584"
  },
  {
    "url": "assets/js/3.19d6ec5c.js",
    "revision": "c347b1f7bffc730f36cfd050f3b9545c"
  },
  {
    "url": "assets/js/4.2c81b87c.js",
    "revision": "4df0121d1a183a786f0646655b0230ec"
  },
  {
    "url": "assets/js/5.f2dd75b8.js",
    "revision": "e96ed3adcee3dfaf0aa341334160de4f"
  },
  {
    "url": "assets/js/6.666e8759.js",
    "revision": "183f4a737ff1352d38b2b00df52bee4d"
  },
  {
    "url": "assets/js/7.2a92c79e.js",
    "revision": "9afaeed2ba963760e61498556adb8c2d"
  },
  {
    "url": "assets/js/8.3af1fd55.js",
    "revision": "0d343c0348cf186216036ff8da8efd0c"
  },
  {
    "url": "assets/js/9.92fefd5f.js",
    "revision": "d5a44794f076ff5417c90ddbf68094b4"
  },
  {
    "url": "assets/js/app.22cd827e.js",
    "revision": "ec46820a34a59a3157d4697668ebde43"
  },
  {
    "url": "guide/install.html",
    "revision": "073cf9fc0b52a90a2bbd129dc3585590"
  },
  {
    "url": "guide/quick-start.html",
    "revision": "c259fcbaf5e1fe04bb419f200ec3f24e"
  },
  {
    "url": "index.html",
    "revision": "ae36b1d4301925a9496847deb7911dc9"
  },
  {
    "url": "zh/guide/install.html",
    "revision": "e95bd1b90223816c1f884221e6addf36"
  },
  {
    "url": "zh/guide/quick-start.html",
    "revision": "84406018a38bc87f47f13a662f1f40bb"
  },
  {
    "url": "zh/index.html",
    "revision": "6cf739e41f705239da8a4b343cb663b9"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.suppressWarnings();
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});
addEventListener('message', event => {
  const replyPort = event.ports[0]
  const message = event.data
  if (replyPort && message && message.type === 'skip-waiting') {
    event.waitUntil(
      self.skipWaiting().then(
        () => replyPort.postMessage({ error: null }),
        error => replyPort.postMessage({ error })
      )
    )
  }
})
