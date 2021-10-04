/* Enhance from and specially thank to https://github.com/adithya-badidey/TW5-codemirror-plus */
(function(mod) {
    if (typeof exports === "object" && typeof module === "object") // CommonJS
        module.exports = mod(require("$:/plugins/tiddlywiki/codemirror/lib/codemirror.js"));
    else if (typeof define === "function" && define.amd) // AMD
        define(["$:/plugins/tiddlywiki/codemirror/lib/codemirror.js"], mod);
    else // Plain browser env
        mod(CodeMirror);
})(function(CodeMirror) {
    "use strict";

    function hintTiddler(editor, options, cme) {
        var cur = editor.getCursor();
        var curLine = editor.getLine(cur.line);
        var pointer = cur.ch;
        var end = cur.ch;
        var max_length = 30;

        // wikilink match
        // look forward from cursor to [{|"
        // if meet ]}.> or line head, stop
        var escapeChars = ['.', ']', '}', '>'];
        var stopChars = ['[', '{', '|', '"'];
        while (pointer) {
            var ch = curLine.charAt(pointer - 1);
            if (end - pointer > max_length || escapeChars.includes(ch)) {
                return null;
            }
            if (!(stopChars.includes(ch))) {
                pointer--;
            } else {
                break;
            }
        }
        if (pointer == 0) return null;
        var curWord = pointer !== end && curLine.slice(pointer, end);

        return {
            from: CodeMirror.Pos(cur.line, pointer),
            to: CodeMirror.Pos(cur.line, end),
            renderPreview: function(domNode, selectedData, selectedNode) {
                selectedNode.renderCache = domNode.innerHTML = $tw.wiki.renderTiddler("text/html", selectedData.text);
                return true;
            },
            type: "tiddler",
            list: (curLine.charAt(pointer) == '$') ?
                $tw.wiki.filterTiddlers(`[all[tiddlers]search:title:literal[${curWord}]!prefix[$:/state]]`) : $tw.wiki.filterTiddlers(`[all[tiddlers]!is[system]!is[shadow]search:title:literal[${curWord}]!prefix[$:/state]]`)
        };
    }

    return {
        hint: hintTiddler
    };
});
