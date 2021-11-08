// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: https://codemirror.net/LICENSE

/* Enhance from and specially thank to https://github.com/adithya-badidey/TW5-codemirror-plus,
   and the original author of this mode is PMario(https://github.com/pmario) */
(function(mod) {
    if (typeof exports == "object" && typeof module == "object") // CommonJS
        mod(require("$:/plugins/tiddlywiki/codemirror/lib/codemirror.js"));
    else if (typeof define == "function" && define.amd) // AMD
        define(["$:/plugins/tiddlywiki/codemirror/lib/codemirror.js"], mod);
    else // Plain browser env
        mod(CodeMirror);
})(function(CodeMirror) {
    "use strict";

    CodeMirror.defineMode("tiddlywiki5", function(cmCfg, modeCfg) {
        var styleSheet = {
            'rainbow': ['keyword', 'variable-2', 'variable-3']
        };

        var macroKeywords = {
            "changecount": true,
            "colour": true,
            "colour-picker": true,
            "contrastcolour": true,
            "copy-to-clipboard": true,
            "csvtiddlers": true,
            "datauri": true,
            "dumpvariables": true,
            "image-picker": true,
            "jsontiddler": true,
            "jsontiddlers": true,
            "lingo": true,
            "list-links": true,
            "list-links-draggable": true,
            "list-tagged-draggable": true,
            "list-thumbnails": true,
            "makedatauri": true,
            "now": true,
            "qualify": true,
            "resolvepath": true,
            "box-shadow": true,
            "filter": true,
            "transition": true,
            "background-linear-gradient": true,
            "transform-origin": true,
            "toc": true,
            "toc-expandable": true,
            "toc-selective-expandable": true,
            "toc-tabbed-internal-nav": true,
            "toc-tabbed-external-nav": true,
            "tabs": true,
            "tag": true,
            "tag-picker": true,
            "tag-pill": true,
            "thumbnail": true,
            "timeline": true,
            "tree": true,
            "unusedtitle": true,
            "version": true
        };

        function getMode(name) {
            if (CodeMirror.findModeByName) {
                var found = CodeMirror.findModeByName(name);
                if (found) name = found.mime || found.mimes[0];
            }
            var mode_ = CodeMirror.getMode(cmCfg, name);
            return mode_.name == "null" ? null : mode_;
        }

        if (modeCfg.fencedCodeBlockHighlighting === undefined)
            modeCfg.fencedCodeBlockHighlighting = true;

        if (modeCfg.fencedCodeBlockDefaultMode === undefined)
            modeCfg.fencedCodeBlockDefaultMode = 'text/plain';

        var reHR = /^\-\-\-+$/, // <hr>
            reBlockQuote = /^<<</,
            rePreStart = /^```[ \t]*([\w\/+#-]*)[^\n`]*$/,
            rePreEnd = /^```$/;

        function chain(stream, state, f) {
            state.tokenize = f;
            return f(stream, state);
        }

        function onNewLine(state) {
            state.line++;
            state.listLevel = 0;
            state.boldLine = false;
        }

        function tokenBase(stream, state) {
            var sol = stream.sol();
            // 解析
            var tokens = tokenBaseBald(sol, stream, state);
            if (tokens == null) tokens = '';
            // 后缀
            if (state.quoteLevel > 0 && sol) {
                tokens += ' line-cm-quote-line quote-' + state.quoteLevel;
            }
            if (state.codeBlockModeState != null) {
                tokens += ' comment';
            }
            if (state.listLevel > 0) {
                tokens += ' list ' + styleSheet.rainbow[state.listLevel % styleSheet.rainbow.length];
            }
            if (state.boldLine) {
                tokens += ' strong';
            }
            return tokens.trim();
        }

        function tokenBaseBald(sol, stream, state) {
            var ch = stream.peek(); // Returns the next character in the stream without advancing it. Will return a null at the end of the line.

            // 检查是不是block的开头
            // 两个条件：1.在行首 2.以</*{}-`开头
            if (sol && /[<\/\*{}\-`]/.test(ch)) {
                // <<<引用block
                if (stream.match(reBlockQuote)) {
                    return twTokenQuote(stream, state);
                }

                // 分割线
                if (stream.match(reHR))
                    return 'hr';

                // 代码块
                var match = null;
                if (match = stream.match(rePreStart, false))
                    return twTokenPre(stream, state, match);
            }

            // 其他情况
            var matched = null;
            if (sol && (matched = stream.match(/^\s*([\/\*!#;:>|])/))) {
                ch = matched[1];
                // 标题
                if (ch === "!") {
                    var countOfHeaderLevel = 1;
                    while (stream.eat('!'))
                        countOfHeaderLevel++;
                    stream.skipToEnd();
                    return 'header h' + countOfHeaderLevel;
                }

                // 列表
                if (/[\*#;:]/.test(ch)) {
                    var countOfListLevel = 1;
                    var past_ch = ch;
                    while (ch = stream.eat(/[\*#;:]/)) {
                        countOfListLevel++;
                        past_ch = ch;
                    }
                    state.boldLine = past_ch === ";";
                    state.listLevel = countOfListLevel;
                    return 'list ' + styleSheet.rainbow[countOfListLevel % styleSheet.rainbow.length] + (past_ch === ";" ? ' strong' : '');
                }
                if (ch === ">") { // single line quote
                    stream.eatWhile(">");
                    return "quote";
                }
                if (ch === "|")
                    return 'header';
            }

            stream.next();

            // 外部链接
            // rudimentary html:// file:// link matching. TW knows much more ...
            if (/[hf]/i.test(ch) &&
                /[ti]/i.test(stream.peek()) &&
                stream.match(/\b(ttps?|tp|ile):\/\/[\-A-Z0-9+&@#\/%?=~_|$!:,.;]*[A-Z0-9+&@#\/%=~_|$]/i, true))
                return 'externallink link';

            // LaTeX 公式
            if (ch == '$' && stream.match("$", false) && !stream.match("$$", false)) {
                stream.next();
                return twTokenFormula(stream, state);
            }

            // `xx`等宽
            if (ch == '`') {
                return chain(stream, state, twTokenMonospace);
            }

            // 斜体
            if (ch == "/" && stream.eat("/")) {
                return chain(stream, state, twTokenEm);
            }

            //
            if (ch == "{" && stream.eat("{"))
                return chain(stream, state, twTranslclude);

            // wikilink 或 图片
            if (ch == "[" && stream.eat("["))
                return chain(stream, state, twInternalLink);

            // 下划线
            if (ch == "_" && stream.eat("_"))
                return chain(stream, state, twTokenUnderline);

            // 上角标
            if (ch == "^" && stream.eat("^"))
                return chain(stream, state, twSuperscript);

            // 下角标
            if (ch == "," && stream.eat(","))
                return chain(stream, state, twSubscript);

            // 删除线
            if (ch == "~" && stream.eat("~")) {
                return chain(stream, state, twTokenStrike);
            }

            // 粗体
            if (ch == "'" && stream.eat("'"))
                return chain(stream, state, twTokenStrong);

            // 宏
            if (ch == "<" && stream.eat("<"))
                return chain(stream, state, twTokenMacro);

            return null;
        }

        // 粗体
        function twTokenStrong(stream, state) {
            var maybeEnd = false,
                ch;
            while (ch = stream.next()) {
                if (ch == "'" && maybeEnd) {
                    state.tokenize = tokenBase;
                    break;
                }
                maybeEnd = (ch == "'");
            }
            return "strong";
        }

        // `xx`等宽
        function twTokenMonospace(stream, state) {
            var ch;
            while (ch = stream.next()) {
                if (ch == "`") {
                    state.tokenize = tokenBase;
                    break;
                }
            }
            return "comment";
        }

        // 斜体
        function twTokenEm(stream, state) {
            var maybeEnd = false,
                ch;
            while (ch = stream.next()) {
                if (ch == "/" && maybeEnd) {
                    state.tokenize = tokenBase;
                    break;
                }
                maybeEnd = (ch == "/");
            }
            return "em";
        }

        // 包含
        function twTranslclude(stream, state) {
            state.tokenize = function(stream_, state_) {
                var ch;
                while (ch = stream_.next()) {
                    if (ch === "}" && stream_.peek() === "}") {
                        stream_.backUp(1);
                        state_.tokenize = function(stream__, state__) {
                            stream__.match("}}");
                            state__.tokenize = tokenBase;
                            return "builtin";
                        };
                        break;
                    }
                }
                return "builtin internallink";
            };
            return "builtin";
        }

        // tw internal links
        function twInternalLink(stream, state) {
            // 开头 [[
            if (stream.current() == '[[') {
                state.pastDivider = false;
                return 'link';
            }
            // 结尾 ]]
            if (stream.peek() == ']') {
                stream.next();
                if (stream.next() == ']') {
                    state.tokenize = tokenBase;
                    return 'link';
                }
            }
            var pastDivider = state.pastDivider,
                ch;
            while (ch = stream.peek()) {
                if (!pastDivider && ch == '|') {
                    stream.next();
                    state.pastDivider = true;
                    return 'internallink link';
                }
                if (ch == "]" && stream.peek() == "]") {
                    return 'internallink link';
                }
                ch = stream.next();
                if (/[hf]/i.test(ch) &&
                    /[ti]/i.test(stream.peek()) &&
                    stream.match(/\b(ttps?|tp|ile):\/\/[\-A-Z0-9+&@#\/%?=~_|$!:,.;]*[A-Z0-9+&@#\/%=~_|$]/i, true)) {
                    return 'externallink link';
                }
                stream.eatWhile(/[^|\]]/);
            }
            return null;
        }

        // tw underlined text
        function twTokenUnderline(stream, state) {
            var maybeEnd = false,
                ch;
            while (ch = stream.next()) {
                if (ch == "_" && maybeEnd) {
                    state.tokenize = tokenBase;
                    break;
                }
                maybeEnd = (ch == "_");
            }
            return "underlined";
        }

        function twSubscript(stream, state) {
            var maybeEnd = false,
                ch;

            while (ch = stream.next()) {
                if (ch == "," && maybeEnd) {
                    state.tokenize = tokenBase;
                    break;
                }
                maybeEnd = (ch == ",");
            }
            return "string subscript";
        }

        function twSuperscript(stream, state) {
            var maybeEnd = false,
                ch;

            while (ch = stream.next()) {
                if (ch == "^" && maybeEnd) {
                    state.tokenize = tokenBase;
                    break;
                }
                maybeEnd = (ch == "^");
            }
            return "string superscript";
        }

        function twTokenStrike(stream, state) {
            var maybeEnd = false,
                ch;

            while (ch = stream.next()) {
                if (ch == "~" && maybeEnd) {
                    state.tokenize = tokenBase;
                    break;
                }
                maybeEnd = (ch == "~");
            }
            return "strikethrough";
        }

        // LaTeX公式
        function twTokenFormula(stream, state) {
            state.tokenize = tokenBase;
            var innerMode = modeCfg.fencedCodeBlockHighlighting && getMode("text/x-latex");
            state.LaTeXModeState = !innerMode ? 'unknown' : {
                mode: innerMode,
                state: CodeMirror.startState(innerMode),
                start: state.line
            };
            return "comment";
        }

        function twTokenPre(stream, state, match) {
            state.tokenize = function(stream_, state_) {
                state_.tokenize = tokenBase;
                var innerMode = modeCfg.fencedCodeBlockHighlighting &&
                    getMode(match[1] || modeCfg.fencedCodeBlockDefaultMode);
                state_.codeBlockModeState = !innerMode ? 'unknown' : {
                    mode: innerMode,
                    state: CodeMirror.startState(innerMode),
                    start: state.line
                };
                if (match[1]) {
                    stream_.skipToEnd();
                    return "tag";
                } else {
                    return null;
                }
            };
            stream.match('```');
            return "comment";
        }

        function twTokenQuote(stream, state) {
            var level = 1;
            while (stream.match(reBlockQuote))
                level++;
            if (state.quoteLevel == level) {
                state.quoteLevel--;
            } else if (state.quoteLevel < level) {
                state.quoteHead = true;
                state.quoteLevel = level;
                state.tokenize = function(stream_, state_) {
                    state_.quoteHead = false;
                    state_.tokenize = tokenBase;
                    if (!stream_.sol()) {
                        stream_.skipToEnd();
                        return "tag";
                    } else {
                        return null;
                    }
                };
            } else {
                state.quoteLevel = level - 1;
            }
            return "quote line-cm-quote-line";
        }

        function twTokenMacro(stream, state) {
            if (stream.current() == '<<') {
                return 'macro';
            }

            var ch = stream.next();
            if (!ch) {
                state.tokenize = tokenBase;
                return null;
            }
            if (ch == ">") {
                if (stream.peek() == '>') {
                    stream.next();
                    state.tokenize = tokenBase;
                    return "macro";
                }
            }

            stream.eatWhile(/[\w\$_]/);
            return macroKeywords.propertyIsEnumerable(stream.current()) ? "keyword" : "macro";
        }

        // Interface
        var mode = {
            blankLine: function(stream) {
                onNewLine(stream);
                return "";
            },
            closeBrackets: "()[]{}''\"\"``",
            startState: function() {
                return {
                    tokenize: tokenBase, // 当前解析器
                    curStream: null,
                    line: 0,
                    quoteLevel: 0,
                    quoteHead: false,
                    listLevel: 0,
                    boldLine: false,
                    codeBlockModeState: null,
                    LaTeXModeState: null
                };
            },
            copyState: function(oldState) {
                var newState = {};
                for (var key in oldState) newState[key] = oldState[key];
                if (oldState.codeBlockModeState && typeof oldState.codeBlockModeState == 'object')
                    newState.codeBlockModeState = {
                        mode: oldState.codeBlockModeState.mode,
                        state: CodeMirror.copyState(oldState.codeBlockModeState.mode, oldState.codeBlockModeState.state),
                        start: oldState.start
                    };
                if (oldState.LaTeXModeState)
                    newState.LaTeXModeState = {
                        mode: oldState.LaTeXModeState.mode,
                        state: CodeMirror.copyState(oldState.LaTeXModeState.mode, oldState.LaTeXModeState.state),
                        start: oldState.start
                    };
            },
            token: function(stream, state) {
                // 新的一行
                if (stream != state.curStream) {
                    onNewLine(state);
                    state.curStream = stream;
                }

                // ```代码块
                if (state.codeBlockModeState != null) {
                    // 代码块的结束
                    if (stream.match(rePreEnd)) {
                        state.codeBlockModeState = null;
                        return "comment";
                    }
                    if (typeof state.codeBlockModeState === "string") {
                        stream.skipToEnd();
                        return "comment line-background-cm-code-block-line";
                    }
                    // 否则，就是用对应的mode来做
                    return state.codeBlockModeState.mode.token(stream, state.codeBlockModeState.state) + " line-background-cm-code-block-line";
                }

                // LaTeX公式块
                if (state.LaTeXModeState != null) {
                    // 公式块的结束
                    if (stream.match('$$')) {
                        state.LaTeXModeState = null;
                        return "comment";
                    }
                    if (typeof state.LaTeXModeState === "string") {
                        stream.skipToEnd();
                        return "comment latex";
                    }
                    // 否则，就是用对应的mode来做
                    return state.LaTeXModeState.mode.token(stream, state.LaTeXModeState.state) + " latex";
                }

                // 读掉空行 / 行末的空白
                if (stream.match(/^\s+$/, true) || stream.match(/\s+$/, true)) return null;
                else return state.tokenize(stream, state);
            },
            innerMode: function(state) {
                if (state.codeBlockModeState != null && typeof state.codeBlockModeState === "object") {
                    return state.codeBlockModeState;
                }
                if (state.LaTeXModeState != null && typeof state.LaTeXModeState === "object") {
                    return state.LaTeXModeState;
                }
                return {
                    state: state,
                    mode: mode
                };
            },
            indent: function(state, textAfter, line) {
                if (state.codeBlockModeState != null &&
                    typeof state.codeBlockModeState === "object" &&
                    typeof state.codeBlockModeState.mode.indent == 'function') {
                    return state.codeBlockModeState.mode.indent(state.codeBlockModeState.state, textAfter, line);
                }
                return CodeMirror.Pass;
            },
            blockCommentStart: '<!--',
            blockCommentEnd: '-->'
        };
        return mode;
    });

    CodeMirror.defineMIME("text/vnd.tiddlywiki", "tiddlywiki5");
    CodeMirror.defineMIME("", "tiddlywiki5");
});
