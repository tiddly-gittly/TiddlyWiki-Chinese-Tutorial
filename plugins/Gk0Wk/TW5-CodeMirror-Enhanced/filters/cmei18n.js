(function () {
  'use strict';

  // Load tiddler object
  function loadTiddler(tiddler, tw) {
    try {
      switch (tw.wiki.filterTiddlers('[[' + tiddler + ']get[type]]')[0]) {
          case 'application/javascript':
              return require(tiddler);
          case 'application/json':
              return JSON.parse(tw.wiki.filterTiddlers('[[' + tiddler + ']get[text]]')[0]);
          case 'application/x-tiddler-dictionary':
              return tw.utils.parseFields(tw.wiki.filterTiddlers('[[' + tiddler + ']get[text]]')[0]);
          default:
              return {};
      }
    } catch (error) {
      console.error(error);
      return {};
    }
  }

  // i18n message cache
  const cache = {};

  exports.cmei18n = function (source, operator, options) {
    // Get language
    let language = options.wiki.filterTiddlers('[[$:/plugins/Gk0Wk/TW5-CodeMirror-Enhanced/config.json]getindex[language]]')[0];
    if (!language || language === 'system') {
      language = options.wiki.getTiddlerText('$:/language').substring(13);
    }

    // ParseMessage
    const messages = operator.operand.split(':', 2);
    let message = messages.length > 1 ? messages[1] : messages[0];
    const namespace = messages.length > 1 ? messages[0] : 'core';

    // Fetch languages
    const exactLanguage = language;
    const majorLanguage = language.split('-')[0];
    const languageFallbackList = [undefined, undefined, undefined];
    options.wiki.filterTiddlers('[all[tiddlers+shadows]!field:cmei18n[]!is[draft]cmei18n-namespace[' + namespace + ']]').forEach(function(tiddler) {
      const i18n = options.wiki.filterTiddlers('[[' + tiddler + ']get[cmei18n]]')[0];
      if (i18n.includes(exactLanguage)) languageFallbackList[0] = tiddler;
      if (i18n.includes(majorLanguage)) languageFallbackList[1] = tiddler;
      if (i18n.includes('default')) languageFallbackList[2] = tiddler;
    });

    for (let index = 0; index < 3; index++) {
      if (!languageFallbackList[index]) continue;
      let node = loadTiddler(languageFallbackList[index], options);
      const subpaths = message.split('.');
      for (const index_ in subpaths) {
        node = node[subpaths[index_]];
        if (!node) break;
      }
      if (typeof node === 'string') {
        cache[message] = node;
        message = node;
        break;
      } else if (Array.isArray(node)) {
        cache[message] = node.join('\n');
        message = cache[message];
        break;
      } else if (cache[message]) {
        message = cache[message];
        break;
      }
    }
    return [message];
  };
})();
