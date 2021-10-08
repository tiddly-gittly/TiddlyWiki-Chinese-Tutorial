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

  function getSnippetName(tiddler) {
    let name = tiddler.fields['snippet-name'];
    if (!name) {
      const splits = tiddler.fields.title.split('/');
      name = splits[splits.length - 1];
    }
    return name;
  }

  function hintSnippet(editor, options, cme) {
    const current = editor.getCursor();
    const currentLine = editor.getLine(current.line);
    let pointer = current.ch;
    const end = current.ch;
    const max_length = 30;

    // Match /xxxx
    while (pointer) {
      const ch = currentLine.charAt(pointer - 1);
      if (end - pointer > max_length && !/[\w./\-]/i.test(ch)) {
        return undefined;
      }
      if (ch !== '/') {
        pointer--;
      } else {
        break;
      }
    }
    if (pointer == 0) return undefined;
    const currentWord = currentLine.slice(pointer, end);

    const hints = [];
    /** $:/plugins/Gk0Wk/TW5-CodeMirror-Enhanced/snippetslist/tw5-snippets.json: (7) [{…}, {…}, {…}, {…}, {…}, {…}, {…}] */
    Object.entries(cme.service.SnippetsList.getSnippetsList()).forEach(([snippetFileName, snippets]) => {
      snippets.forEach((snippet) => {
        try {
          if (snippet.id.includes(currentWord)) {
            if (snippet.i18n) {
              // cannot use ... syntax here, for backward compatibility
              snippet = Object.assign(snippet, {
                name: $tw.wiki.filterTiddlers(`[cmei18n[${snippet.name}]]`)[0],
                preview: $tw.wiki.filterTiddlers(`[cmei18n[${snippet.preview}]]`)[0],
              });
            }
            const displayText = snippet.name + "  /" + snippet.id;
            hints.push({
              /** pass full snippet object to hint service */
              text: snippet,
              displayText: displayText,
              hintMatch: cme.service.RealtimeHint.makeLiteralHintMatch(displayText, currentWord),
            });
          }
        } catch (error) {
          console.error(error);
        }
      });
    });

    // Load tw5 snippet
    $tw.wiki.filterTiddlers('[all[tiddlers+shadows]tag[$:/tags/TextEditor/Snippet]]').forEach(function (snippetTiddler) {
      const snippet = $tw.wiki.getTiddler(snippetTiddler);
      const name = getSnippetName(snippet);
      if (name.includes(currentWord)) {
        hints.push({
          text: {
            snippet: snippet.fields.text,
            preview: '!! ' + snippet.fields.caption + (snippet.fields['snippet-description'] ? '\n\n' + snippet.fields['snippet-description'] : ''),
          },
          displayText: name,
          hintMatch: cme.service.RealtimeHint.makeLiteralHintMatch(name, currentWord),
        });
      }
    });

    // Load KaTeX snippet
    $tw.wiki.filterTiddlers('[all[tiddlers+shadows]tag[$:/tags/KaTeX/Snippet]]').forEach(function (snippetTiddler) {
      const snippet = $tw.wiki.getTiddler(snippetTiddler);
      const name = getSnippetName(snippet);
      if (name.includes(currentWord)) {
        hints.push({
          text: {
            snippet: snippet.fields.text,
            preview: snippet.fields.text,
          },
          displayText: name,
          hintMatch: cme.service.RealtimeHint.makeLiteralHintMatch(name, currentWord),
        });
      }
    });

    return {
      from: cme.CodeMirror.Pos(current.line, pointer - 1),
      to: cme.CodeMirror.Pos(current.line, end),
      renderPreview: function (domNode, selectedData, selectedNode) {
        selectedNode.renderCache = domNode.innerHTML = $tw.wiki.renderText(
          'text/html',
          'text/vnd.tiddlywiki',
          selectedData.text.preview ? selectedData.text.preview : '',
        );
        return true;
      },
      hint: function (editor_, hints_, hint_) {
        // Snippet text replace
        const replaceText = hint_.text.snippet.replaceAll(/(\$\d+)/g, '');
        editor_.replaceRange(replaceText, hint_.from || hints_.from, hint_.to || hints_.to, 'complete');
        // Relocate cursor to placeholder
        const current_ = editor_.getCursor();
        let col = current_.ch;
        let row = current_.line;
        const parts = hint_.text.snippet.split(/(\$\d+)/, 3);
        if (parts[2]) {
          const splits = parts[2].split(/\n/);
          if (splits.length > 1) {
            row -= splits.length - 1;
            col = editor.getLine(row).length - splits[0].length;
          } else {
            col -= parts[2].length;
          }
          editor_.setCursor(row, col);
        }
      },
      type: 'snippet',
      list: hints,
    };
  }

  return {
    hint: hintSnippet,
  };
});
