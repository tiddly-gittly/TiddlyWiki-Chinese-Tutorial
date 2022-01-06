importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.4/workbox-sw.js');

if (workbox) {
  console.log(`Yay! Workbox is loaded 🎉Service Worker is working!`);
} else {
  console.log(`Boo! Workbox didn't load 😬Service Worker won't work properly...`);
}

const { registerRoute } = workbox.routing;
const { CacheFirst, StaleWhileRevalidate } = workbox.strategies;
const { ExpirationPlugin } = workbox.expiration;
const { precacheAndRoute, matchPrecache } = workbox.precaching;

precacheAndRoute([{"revision":"51b1c635de81aaf49c1b674eb91971fa","url":"favicon.ico"},{"revision":"51b1c635de81aaf49c1b674eb91971fa","url":"images/favicon.ico"},{"revision":"b58c6b6a74ede2a61e2b6d5321a1eca2","url":"images/ProductHunt-Badge.svg"},{"revision":"bea727c84b4f89a9004343b5c5a8a2ba","url":"images/TiddlyGit-Screenshot.png"},{"revision":"713f708b9b2662da54cd38bc98a6483f","url":"images/TiddlyWikiIconBlack.png"},{"revision":"6d5ad68a36222fb106ebefe49484c9be","url":"images/TiddlyWikiIconBlue.png"},{"revision":"2c94295d5e6cfa9e5f0b666c4ba1964c","url":"images/TiddlyWikiIconWhite.png"},{"revision":"535f754ed31895ca44cddf46d213532e","url":"images/太记使用常见问题-开着代理502截图.png"},{"revision":"7e532d3df43d1068437c3d98c56637a3","url":"images/更新插件-截图.png"},{"revision":"330130dc91e49bece715b11193e85d4f","url":"index.html"},{"revision":"465878f444eee448eca15ef611533552","url":"tiddlywikicore-5.2.2-prerelease-2021-12-10.js"},{"revision":"713f708b9b2662da54cd38bc98a6483f","url":"TiddlyWikiIconBlack.png"},{"revision":"2c94295d5e6cfa9e5f0b666c4ba1964c","url":"TiddlyWikiIconWhite.png"}]);

registerRoute(
  /\.css$/,
  // Use cache but update in the background.
  new StaleWhileRevalidate({
    // Use a custom cache name.
    cacheName: 'css-cache',
  })
);

registerRoute(
  /\.(?:png|jpg|jpeg|svg|gif|woff2?|ttf)$/,
  // Use the cache if it's available.
  new CacheFirst({
    cacheName: 'image-cache',
    plugins: [
      new ExpirationPlugin({
        // Cache only a few images.
        maxEntries: 100,
        // Cache for a maximum of a week.
        maxAgeSeconds: 7 * 24 * 60 * 60,
      }),
    ],
  })
);

registerRoute(/\.js$/, new StaleWhileRevalidate());
registerRoute(/(^\/$|index.html)/, new StaleWhileRevalidate());
