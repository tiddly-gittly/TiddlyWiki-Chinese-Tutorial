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

precacheAndRoute([{"revision":"51b1c635de81aaf49c1b674eb91971fa","url":"favicon.ico"},{"revision":"51b1c635de81aaf49c1b674eb91971fa","url":"images/favicon.ico"},{"revision":"b58c6b6a74ede2a61e2b6d5321a1eca2","url":"images/ProductHunt-Badge.svg"},{"revision":"bea727c84b4f89a9004343b5c5a8a2ba","url":"images/TiddlyGit-Screenshot.png"},{"revision":"713f708b9b2662da54cd38bc98a6483f","url":"images/TiddlyWikiIconBlack.png"},{"revision":"6d5ad68a36222fb106ebefe49484c9be","url":"images/TiddlyWikiIconBlue.png"},{"revision":"2c94295d5e6cfa9e5f0b666c4ba1964c","url":"images/TiddlyWikiIconWhite.png"},{"revision":"535f754ed31895ca44cddf46d213532e","url":"images/太记使用常见问题-开着代理502截图.png"},{"revision":"ace235617bdf31b4dc54db9f7300b816","url":"images/批量删除草稿.jpg"},{"revision":"df0e2bd0e75e276bbcde9e3e0501c3dc","url":"images/提交Git变更.png"},{"revision":"cb675dfbfc21ebe579fabc49fb8c544a","url":"images/撤销当前Wiki变更.png"},{"revision":"7e532d3df43d1068437c3d98c56637a3","url":"images/更新插件-截图.png"},{"revision":"4233fe4b82db6d0fed0a7268809ba892","url":"images/查看当前Wiki变更.png"},{"revision":"79bd3dc1a2a518ed06b46541d1b862d6","url":"images/渲染Mermaid语法-编辑.png"},{"revision":"9166a73746a6cfbc125e1de6cd438cb0","url":"images/渲染Mermaid语法-预览.png"},{"revision":"78c09cb1b8a70ee3365613709d6d5800","url":"images/用GithubDesktop打开.png"},{"revision":"704996c45a50f1972702d1bfb023da66","url":"index.html"},{"revision":"c992489c82c3d5b1d22064801654f259","url":"offline.html"},{"revision":"d13a3a783d79ae942a24a9da80956be3","url":"tiddlywikicore-5.2.3-prerelease-2022-04-09.js"},{"revision":"713f708b9b2662da54cd38bc98a6483f","url":"TiddlyWikiIconBlack.png"},{"revision":"2c94295d5e6cfa9e5f0b666c4ba1964c","url":"TiddlyWikiIconWhite.png"}]);

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
