/* Enhance from and specially thank to https://github.com/adithya-badidey/TW5-codemirror-plus */
(function (mod) {
  if (typeof exports === 'object' && typeof module === 'object')
    // CommonJS
    module.exports = mod();
  else if (typeof define === 'function' && define.amd)
    // AMD
    define(mod);
  // Plain browser env
  else mod();
})(function () {
  'use strict';

  function handler(editor, event, cme) {
    if (event.target.classList.contains('cm-externallink')) {
      window.open(event.target.innerText);
      return true;
    } else if (event.target.classList.contains('cm-internallink')) {
      new $tw.Story().navigateTiddler(event.target.innerText);
      return true;
    } else {
      return false;
    }
  }

  return {
    handler: handler,
  };
});
