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

precacheAndRoute([{"revision":"51b1c635de81aaf49c1b674eb91971fa","url":"favicon.ico"},{"revision":"51b1c635de81aaf49c1b674eb91971fa","url":"images/favicon.ico"},{"revision":"bea727c84b4f89a9004343b5c5a8a2ba","url":"images/TiddlyGit-Screenshot.png"},{"revision":"713f708b9b2662da54cd38bc98a6483f","url":"images/TiddlyWikiIconBlack.png"},{"revision":"6d5ad68a36222fb106ebefe49484c9be","url":"images/TiddlyWikiIconBlue.png"},{"revision":"2c94295d5e6cfa9e5f0b666c4ba1964c","url":"images/TiddlyWikiIconWhite.png"},{"revision":"535f754ed31895ca44cddf46d213532e","url":"images/太记使用常见问题-开着代理502截图.png"},{"revision":"7e532d3df43d1068437c3d98c56637a3","url":"images/更新插件-截图.png"},{"revision":"b7cf8b1b8cf9efd1f634fb946d476a50","url":"index.html"},{"revision":"229908831c22c7c300a296f35e2a60ab","url":"library/index.html"},{"revision":"688a5ae2c10ef124cdedd503815f82e6","url":"library/recipes/library/tiddlers.json"},{"revision":"d887aede1fd61f9203350d62444653bd","url":"library/recipes/library/tiddlers/%24%3A%2Fplugins%2Fbimlas%2Fkin-filter.json"},{"revision":"0dc34bdf7fef74cf80de2d8571017370","url":"library/recipes/library/tiddlers/%24%3A%2Fplugins%2Fbimlas%2Flocator.json"},{"revision":"61ed0bf737d8386418fbcab9b8124f9e","url":"library/recipes/library/tiddlers/%24%3A%2Fplugins%2Fdullroar%2Fsitemap.json"},{"revision":"5bcb24c4dad585552b28a301683551a1","url":"library/recipes/library/tiddlers/%24%3A%2Fplugins%2Ffelixhayashi%2Fhotzone.json"},{"revision":"cd7424f96c368a5bbdcea15a7e533827","url":"library/recipes/library/tiddlers/%24%3A%2Fplugins%2Ffelixhayashi%2Ftiddlymap.json"},{"revision":"5477d20c2369f00f9b9ee166c27f910f","url":"library/recipes/library/tiddlers/%24%3A%2Fplugins%2Ffelixhayashi%2Ftopstoryview.json"},{"revision":"9675fce3bbd2e67ad02c255386759c52","url":"library/recipes/library/tiddlers/%24%3A%2Fplugins%2Ffelixhayashi%2Fvis.json"},{"revision":"bb259bf57fdf19d92c7ec73f09203ad9","url":"library/recipes/library/tiddlers/%24%3A%2Fplugins%2Fflibbles%2Frelink-markdown.json"},{"revision":"73c4ae7eba9f70b7656e986f7e7b29a1","url":"library/recipes/library/tiddlers/%24%3A%2Fplugins%2Fflibbles%2Frelink-titles.json"},{"revision":"a247b233757cea13affec8708ad0e236","url":"library/recipes/library/tiddlers/%24%3A%2Fplugins%2Fflibbles%2Frelink.json"},{"revision":"cc90dc680209493b36478936eb6376b4","url":"library/recipes/library/tiddlers/%24%3A%2Fplugins%2FGk0Wk%2FTW5-CodeMirror-Enhanced.json"},{"revision":"8b883703e03d6208051c86e12633bef6","url":"library/recipes/library/tiddlers/%24%3A%2Fplugins%2Flinonetwo%2Fcommandpalette.json"},{"revision":"88564e1d38c2b909f672a328e6f570ec","url":"library/recipes/library/tiddlers/%24%3A%2Fplugins%2Flinonetwo%2Fcopy-on-select.json"},{"revision":"5739ab84942577482348a258a323583b","url":"library/recipes/library/tiddlers/%24%3A%2Fplugins%2Flinonetwo%2Fgithub-external-image.json"},{"revision":"0aa5cfd9e56ad4132ae60cab41e80d24","url":"library/recipes/library/tiddlers/%24%3A%2Fplugins%2Flinonetwo%2Fgoogle-calendar-import.json"},{"revision":"22c45a6f56f5aa31699a3aab1a2ab358","url":"library/recipes/library/tiddlers/%24%3A%2Fplugins%2Flinonetwo%2Finverse-link-and-folder.json"},{"revision":"6ec35d49e2d63678b2fe1a6a8bf49bcf","url":"library/recipes/library/tiddlers/%24%3A%2Fplugins%2Flinonetwo%2Fitonnote.json"},{"revision":"9294b304203703e2443eda4002c71ae7","url":"library/recipes/library/tiddlers/%24%3A%2Fplugins%2Flinonetwo%2Fopened-tiddlers-bar.json"},{"revision":"fd78f10d1cc1968172b59438ad3b6563","url":"library/recipes/library/tiddlers/%24%3A%2Fplugins%2Flinonetwo%2Fpinyin-fuzzy-search.json"},{"revision":"e5de5e3c87a911ad3a1a27fe61623a93","url":"library/recipes/library/tiddlers/%24%3A%2Fplugins%2Flinonetwo%2Fprevent-edit.json"},{"revision":"e2a6c1e5c235aaff723f31bd0ee7538f","url":"library/recipes/library/tiddlers/%24%3A%2Fplugins%2Flinonetwo%2Fpreview-glass.json"},{"revision":"626100d6539b069cd78627c70421df4b","url":"library/recipes/library/tiddlers/%24%3A%2Fplugins%2Flinonetwo%2Fservice-worker.json"},{"revision":"36d1101e0151c36effd92e37d7d76f98","url":"library/recipes/library/tiddlers/%24%3A%2Fplugins%2Flinonetwo%2Fsource-control-management.json"},{"revision":"270c00e984fa24e2071c388514ffc2bd","url":"library/recipes/library/tiddlers/%24%3A%2Fplugins%2Flinonetwo%2Fsub-wiki.json"},{"revision":"baedaafc5814288c0682d98cb9bcd285","url":"library/recipes/library/tiddlers/%24%3A%2Fplugins%2Flinonetwo%2Fwatch-fs.json"},{"revision":"c925e1e279f1bb8b56dd5c8ba0985f28","url":"library/recipes/library/tiddlers/%24%3A%2Fplugins%2Flinonetwo%2Fzx-script.json"},{"revision":"4f5133ba23e8114b3a9fab95e97d3a7a","url":"library/recipes/library/tiddlers/%24%3A%2Fplugins%2Fmat%2Ffield-value-selector.json"},{"revision":"28fce55191e67ec6bd9eb03dd07cb2c1","url":"library/recipes/library/tiddlers/%24%3A%2Fplugins%2Foflg%2Ffishing.json"},{"revision":"759dc077b2673172ad004f6abb9cb368","url":"library/recipes/library/tiddlers/%24%3A%2Fplugins%2Fsobjornstad%2FTiddlyRemember.json"},{"revision":"09411f2d7cc0cf6497c345b232ce2930","url":"library/recipes/library/tiddlers/%24%3A%2Fplugins%2Ftelmiger%2FEditorCounter.json"},{"revision":"eb0210f14783940239646f72290ea952","url":"library/recipes/library/tiddlers/%24%3A%2Fplugins%2Ftelmiger%2FHarveyBalls.json"},{"revision":"c002ac17b259c38f9635f831e05476ba","url":"library/recipes/library/tiddlers/%24%3A%2Fplugins%2Ftelmiger%2FPluginSize.json"},{"revision":"32e1d9d82668f9cf17ce9edce6520a9e","url":"library/recipes/library/tiddlers/%24%3A%2Fplugins%2Ftobibeer%2Fappear.json"},{"revision":"d522b99e1abe5c80de8ea2e7666a0284","url":"library/recipes/library/tiddlers/%24%3A%2Fthemes%2Flinonetwo%2Fitonnote.json"},{"revision":"23bcf74d9a46aed1455a6e7736ce8fcb","url":"tiddlywikicore-5.2.0-prerelease.20211002.js"},{"revision":"713f708b9b2662da54cd38bc98a6483f","url":"TiddlyWikiIconBlack.png"},{"revision":"2c94295d5e6cfa9e5f0b666c4ba1964c","url":"TiddlyWikiIconWhite.png"}]);

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
