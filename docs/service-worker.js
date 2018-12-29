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
    "revision": "77bda679f0da744b0dbafd3dd76be80b"
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
    "url": "assets/js/app.31fc676e.js",
    "revision": "c9a0e14ba879bb4a960d1eb7c0b0ad4d"
  },
  {
    "url": "guide/install.html",
    "revision": "ce4754d54d0f2268e0d0ebfcaf2007b4"
  },
  {
    "url": "guide/quick-start.html",
    "revision": "0b0377f78357f5af953bc65ea86d53f7"
  },
  {
    "url": "index.html",
    "revision": "ae8d7cc51fcaf3dd85bf5c697d64749a"
  },
  {
    "url": "logo/logo-color.svg",
    "revision": "ce025e5858229195d4fa7018ee849edd"
  },
  {
    "url": "zh/guide/install.html",
    "revision": "bef11cf73151d3e07ebd5132b2a3a4f8"
  },
  {
    "url": "zh/guide/quick-start.html",
    "revision": "f6f67c6ae98012e35b9236e68087ef1f"
  },
  {
    "url": "zh/index.html",
    "revision": "824ff92b3b3154b1332aed2f8c70691d"
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
