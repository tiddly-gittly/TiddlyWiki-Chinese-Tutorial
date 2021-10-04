(function(mod) {
    if (typeof exports === "object" && typeof module === "object") // CommonJS
        module.exports = mod(require("$:/plugins/tiddlywiki/codemirror/lib/codemirror.js"));
    else if (typeof define === "function" && define.amd) // AMD
        define(["$:/plugins/tiddlywiki/codemirror/lib/codemirror.js"], mod);
    else // Plain browser env
        mod(CodeMirror);
})(function(CodeMirror) {
    "use strict";

    function hintSnippet(editor, options, cme) {
        var cur = editor.getCursor();
        var curLine = editor.getLine(cur.line);
        var pointer = cur.ch;
        var end = cur.ch;
        var max_length = 30;

        // Match /xxxx
        while (pointer) {
            var ch = curLine.charAt(pointer - 1);
            if (end - pointer > max_length && !/[\w\.\-\/]/i.test(ch)) {
                return null;
            }
            if (ch !== '/') {
                pointer--;
            } else {
                break;
            }
        }
        if (pointer == 0) return null;
        var curWord = curLine.slice(pointer, end);

        var hints = [];
        $tw.utils.each(cme.service.SnippetsList.getSnippetsList(), function(snippets) {
            try {
                $tw.utils.each(snippets, function(value, key) {
                    if (key.indexOf(curWord) >= 0)
                        hints.push({
                            text: value,
                            displayText: key
                        });
                });
            } catch (e) {
                console.error(e);
            }
        });

        $tw.wiki.filterTiddlers('[all[tiddlers+shadows]tag[$:/tags/TextEditor/Snippet]]').forEach(snippetTiddler => {
            var snippet = $tw.wiki.getTiddler(snippetTiddler);
            if (snippet.fields['snippet-name']) {
                if (snippet.fields['snippet-name'].indexOf(curWord) >= 0) {
                    hints.push({
                        text: {
                            snippet: snippet.fields.text,
                            preview: '!! ' + snippet.fields.caption + (snippet.fields['snippet-description'] ? ('\n\n' + snippet.fields['snippet-description']) : '')
                        },
                        displayText: snippet.fields['snippet-name']
                    });
                }
            } else {
                var splits = snippet.fields.title.split('/');
                var name = splits[splits.length - 1];
                if (name.indexOf(curWord) >= 0) {
                    hints.push({
                        text: {
                            snippet: snippet.fields.text,
                            preview: '!! ' + snippet.fields.caption + (snippet.fields['snippet-description'] ? ('\n\n' + snippet.fields['snippet-description']) : '')
                        },
                        displayText: name
                    });
                }
            }
        });

        return {
            from: CodeMirror.Pos(cur.line, pointer - 1),
            to: CodeMirror.Pos(cur.line, end),
            renderPreview: function(domNode, selectedData, selectedNode) {
                selectedNode.renderCache = domNode.innerHTML =
                    $tw.wiki.renderText('text/html', 'text/vnd.tiddlywiki', selectedData.text.preview ? selectedData.text.preview : "");
                return true;
            },
            hint: function(editor_, hints_, hint_) {
                // Snippet text replace
                var replaceText = hint_.text.snippet.replaceAll(/(\$\d+)/g, '');
                editor_.replaceRange(replaceText, hint_.from || hints_.from, hint_.to || hints_.to, "complete");
                // Relocate cursor to placeholder
                var cur_ = editor_.getCursor();
                var col = cur_.ch,
                    row = cur_.line;
                var parts = hint_.text.snippet.split(/(\$\d+)/, 3);
                if (parts[2]) {
                    var splits = parts[2].split(/\n/);
                    if (splits.length > 1) {
                        row -= splits.length - 1;
                        col = editor.getLine(row).length - splits[0].length;
                    } else {
                        col -= parts[2].length;
                    }
                    editor_.setCursor(row, col);
                }
            },
            type: "snippet",
            list: hints
        };
    }

    return {
        hint: hintSnippet
    };
});
