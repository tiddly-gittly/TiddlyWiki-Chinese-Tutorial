/* Enhance from and specially thank to https://github.com/adithya-badidey/TW5-codemirror-plus */
(function(mod) {
    if (typeof exports === 'object' && typeof module === 'object')
        // CommonJS
        module.exports = mod();
    else if (typeof define === 'function' && define.amd)
        // AMD
        define([], mod);
    // Plain browser env
    else mod();
})(function() {
    'use strict';

    function hintTiddler(editor, options, cme) {
        const current = editor.getCursor();
        var currentLine = editor.getLine(current.line);
        var pointer = current.ch;
        var end = current.ch;
        var max_length = 30;

        // wikilink match
        // look forward from cursor to [{|"
        // if meet ]}.> or line head, stop
        var escapeChars = ['.', ']', '}', '>'];
        var stopChars = ['[', '{', '|', '"'];
        while (pointer) {
            var ch = currentLine.charAt(pointer - 1);
            if (end - pointer > max_length || escapeChars.includes(ch)) {
                return undefined;
            }
            if (!stopChars.includes(ch)) {
                pointer--;
            } else {
                break;
            }
        }
        if (pointer == 0) return undefined;
        var curWord = pointer !== end && currentLine.slice(pointer, end);

        var tiddlerList = [];
        var filteredTiddler =
            currentLine.charAt(pointer) === '$' ?
            $tw.wiki.filterTiddlers('[all[tiddlers]search:title:literal[' + curWord + ']!prefix[$:/state]]') :
            $tw.wiki.filterTiddlers('[all[tiddlers]!is[system]search:title:literal[' + curWord + ']!prefix[$:/state]]');
        filteredTiddler.forEach(function(tiddler) {
            tiddlerList.push({
                text: tiddler,
                hintMatch: cme.service.RealtimeHint.makeLiteralHintMatch(tiddler, curWord),
            });
        });

        return {
            from: cme.CodeMirror.Pos(current.line, pointer),
            to: cme.CodeMirror.Pos(current.line, end),
            renderPreview: function(domNode, selectedData, selectedNode) {
                selectedNode.renderCache = domNode.innerHTML = $tw.wiki.renderTiddler('text/html', selectedData.text);
                return true;
            },
            type: 'tiddler',
            list: tiddlerList,
        };
    }

    return {
        hint: hintTiddler,
    };
});
