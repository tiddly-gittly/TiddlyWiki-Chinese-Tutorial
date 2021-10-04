(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.CodeMirrorEnhanced = factory());
})(this, (function () { 'use strict';

    var InnerService = /** @class */ (function () {
        function InnerService(bald) {
            this.name = bald.name;
            this.tag = bald.tag ? bald.tag : null;
            this.onLoad = bald.onLoad;
            this.onHook = bald.onHook;
            this.addons = {};
            this.isLoad = false;
            this.lastAddonsUpdateTime = new Date(0);
        }
        return InnerService;
    }());
    var services = {};
    var api$1 = {};
    function loadTiddler(tiddler) {
        switch ($tw.wiki.getTiddler(tiddler).fields.type) {
            case "application/javascript":
                return require(tiddler);
            case "application/json":
                return JSON.parse($tw.wiki.getTiddlerText(tiddler));
            case "application/x-tiddler-dictionary":
                return $tw.utils.parseFields($tw.wiki.getTiddlerText(tiddler));
            default:
                return null;
        }
    }
    function updateService() {
        $tw.utils.each(services, function (service, name) {
            // Update add-ons
            if (!service.tag)
                return;
            var tiddlers = $tw.wiki.filterTiddlers("[all[tiddlers+shadows]tag[" + service.tag + "]!is[draft]]");
            $tw.utils.each(tiddlers, function (tiddler) {
                if (!(tiddler in service.addons)) {
                    // load add-on not loaded before
                    var addon = loadTiddler(tiddler);
                    if (addon)
                        service.addons[tiddler] = addon;
                }
                else {
                    // reload add-on updated after last check
                    var tiddlerData = $tw.wiki.getTiddler(tiddler);
                    if (tiddlerData &&
                        tiddlerData.fields &&
                        ((tiddlerData.fields.modified &&
                            tiddlerData.fields.modified >= service.lastAddonsUpdateTime) ||
                            (tiddlerData.fields.created &&
                                tiddlerData.fields.created >= service.lastAddonsUpdateTime))) {
                        var addon = loadTiddler(tiddler);
                        if (addon)
                            service.addons[tiddler] = addon;
                        else
                            delete service.addons[tiddler];
                    }
                }
            });
            $tw.utils.each(service.addons, function (addon, tiddler) {
                if (tiddler in tiddlers) {
                    delete service.addons[tiddler];
                }
            });
            // Update add-on update time
            service.lastAddonsUpdateTime = new Date();
        });
    }
    function registerService(service) {
        services[service.name] = new InnerService(service);
        if (service.api)
            api$1[service.name] = service.api;
    }
    function getAddons(name) {
        return services[name].addons;
    }
    function init$4(CodeMirror, cme) {
        // When new editor instance is created, update addons and hook service
        CodeMirror.defineInitHook(function (editor) {
            updateService();
            $tw.utils.each(services, function (service, name) {
                if (!service.isLoad)
                    service.onLoad(CodeMirror, cme);
                service.onHook(editor, cme);
            });
        });
        return api$1;
    }

    function getBoolean(tiddler, defaultValue) {
        var tiddlerText = $tw.wiki.getTiddlerText(tiddler);
        return tiddlerText ? tiddlerText.toLowerCase() === "true" : defaultValue;
    }
    var Options = /** @class */ (function () {
        function Options() {
        }
        Object.defineProperty(Options, "clickableService", {
            get: function () {
                return getBoolean("$:/plugins/Gk0Wk/TW5-CodeMirror-Enhanced/config/clickable-link", false);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Options, "realtimeHint", {
            get: function () {
                return getBoolean("$:/plugins/Gk0Wk/TW5-CodeMirror-Enhanced/config/realtime-hint", false);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Options, "hintPreview", {
            get: function () {
                return getBoolean("$:/plugins/Gk0Wk/TW5-CodeMirror-Enhanced/config/hint-preview", false);
            },
            enumerable: false,
            configurable: true
        });
        return Options;
    }());

    var functionKey = /macintosh|mac os x/i.test(navigator.userAgent)
        ? "metaKey"
        : "ctrlKey";
    function init$3() {
        registerService({
            name: "ClickableToken",
            tag: "$:/CodeMirrorEnhanced/ClickableToken",
            onLoad: function (CodeMirror, cme) { },
            onHook: function (editor, cme) {
                editor.on("mousedown", function (cm, event) {
                    if (event[functionKey] && Options.clickableService) {
                        var addons = getAddons("ClickableToken");
                        for (var key in addons) {
                            if (addons[key].handler(editor, event, cme))
                                break;
                        }
                    }
                });
            },
        });
    }

    var Hints = /** @class */ (function () {
        function Hints(list, from) {
            this.list = list;
            this.from = from;
        }
        return Hints;
    }());
    function globalHintRender(hintNode, hints, curHint) {
        var ownerDocument = hintNode.ownerDocument;
        // Render (left side) [title]
        var titlePartNode = hintNode.appendChild(ownerDocument.createElement("span"));
        if (curHint.render_) {
            curHint.render_(titlePartNode, hints, curHint);
        }
        else {
            titlePartNode.appendChild(ownerDocument.createTextNode(curHint.displayText || curHint.text || ""));
        }
        // Render (right side) [type]
        var typeString = curHint.type || null;
        if (typeString) {
            var typePartNode = hintNode.appendChild(ownerDocument.createElement("span"));
            typePartNode.appendChild(ownerDocument.createTextNode(typeString));
        }
    }
    function init$2() {
        registerService({
            name: "RealtimeHint",
            tag: "$:/CodeMirrorEnhanced/RealtimeHint",
            onLoad: function (CodeMirror, cme) {
                CodeMirror.registerHelper("hint", "tiddlywiki5", function (editor, options) {
                    return new Promise(function (resolve, reject) {
                        try {
                            var promises_1 = [];
                            $tw.utils.each(getAddons("RealtimeHint"), function (addon, addonTiddler) {
                                promises_1.push(new Promise(function (resolve_, reject_) {
                                    try {
                                        var hints_1 = addon.hint(editor, options, cme);
                                        var tmplist_1 = [];
                                        var minPos_1 = editor.getCursor();
                                        if (hints_1 && typeof hints_1 === "object") {
                                            if (hints_1.from &&
                                                CodeMirror.cmpPos(minPos_1, hints_1.from) > 0)
                                                minPos_1 = hints_1.from;
                                            hints_1.list.forEach(function (hint) {
                                                if (typeof hint === "string") {
                                                    tmplist_1.push({
                                                        text: hint,
                                                        from: hints_1.from,
                                                        to: hints_1.to,
                                                        render_: hints_1.render,
                                                        render: globalHintRender,
                                                        renderPreview: hints_1.renderPreview,
                                                        hint: hints_1.hint,
                                                        type: hints_1.type,
                                                        className: "cm-hacked-hint",
                                                    });
                                                }
                                                else {
                                                    tmplist_1.push({
                                                        text: hint.text,
                                                        displayText: hint.displayText,
                                                        from: hint.from || hints_1.from,
                                                        to: hint.to || hints_1.to,
                                                        render_: hint.render || hints_1.render,
                                                        render: globalHintRender,
                                                        renderPreview: hint.renderPreview || hints_1.renderPreview,
                                                        hint: hint.hint || hints_1.hint,
                                                        type: hint.type || hints_1.type,
                                                        renderCache: hint.renderCache,
                                                        className: "cm-hacked-hint",
                                                    });
                                                    if (hint.from &&
                                                        CodeMirror.cmpPos(minPos_1, hint.from) > 0)
                                                        minPos_1 = hint.from;
                                                }
                                            });
                                        }
                                        resolve_(new Hints(tmplist_1, minPos_1));
                                    }
                                    catch (e) {
                                        console.error("Error occured by tiddler " + addonTiddler + ":");
                                        console.error(e);
                                        resolve_(null);
                                    }
                                }));
                            });
                            Promise.all(promises_1).then(function (hintsList) {
                                var result = new Hints([], editor.getCursor());
                                hintsList.forEach(function (hints) {
                                    if (!hints)
                                        return;
                                    hints.list.forEach(function (hint) {
                                        result.list.push(hint);
                                    });
                                    if (CodeMirror.cmpPos(result.from, hints.from) > 0)
                                        result.from = hints.from;
                                });
                                CodeMirror.on(result, "select", function (selectedData, selectedNode) {
                                    if (Options.hintPreview) {
                                        var appendId = selectedNode.parentNode.id +
                                            "-hint-append";
                                        var previewBoxNode_1 = selectedNode.ownerDocument.getElementById(appendId);
                                        var shouldCreate = !previewBoxNode_1;
                                        if (shouldCreate) {
                                            previewBoxNode_1 =
                                                selectedNode.ownerDocument.createElement("div");
                                            previewBoxNode_1.id = appendId;
                                            previewBoxNode_1.className =
                                                "CodeMirror-hints CodeMirror-hints-append " +
                                                    editor.options.theme;
                                            previewBoxNode_1.style.left =
                                                selectedNode.parentNode.offsetLeft +
                                                    selectedNode.parentNode.offsetWidth +
                                                    "px";
                                            previewBoxNode_1.style.top =
                                                selectedNode.parentNode.offsetTop +
                                                    "px";
                                        }
                                        var shouldDisplay = void 0;
                                        try {
                                            if (selectedData.renderCache &&
                                                typeof selectedData.renderCache === "string") {
                                                previewBoxNode_1.innerHTML = selectedData.renderCache;
                                                shouldDisplay = true;
                                            }
                                            else if (selectedData.renderPreview &&
                                                typeof selectedData.renderPreview === "function") {
                                                shouldDisplay =
                                                    selectedData.renderPreview(previewBoxNode_1, selectedData, selectedNode) === true;
                                                if (shouldDisplay &&
                                                    previewBoxNode_1.innerHTML.trim() === "")
                                                    shouldDisplay = false;
                                            }
                                            else {
                                                shouldDisplay = false;
                                            }
                                        }
                                        catch (e) {
                                            previewBoxNode_1.innerText = String(e);
                                            console.error(e);
                                        }
                                        if (shouldDisplay) {
                                            if (shouldCreate) {
                                                CodeMirror.on(result, "close", function () {
                                                    if (selectedNode.ownerDocument.body.contains(previewBoxNode_1))
                                                        selectedNode.ownerDocument.body.removeChild(previewBoxNode_1);
                                                });
                                                selectedNode.ownerDocument.body.appendChild(previewBoxNode_1);
                                            }
                                        }
                                        else if (selectedNode.ownerDocument.body.contains(previewBoxNode_1))
                                            selectedNode.ownerDocument.body.removeChild(previewBoxNode_1);
                                    }
                                });
                                resolve(result);
                            });
                        }
                        catch (e) {
                            console.error(e);
                            resolve(null);
                        }
                    });
                });
            },
            onHook: function (editor, cme) {
                // Hint when text change
                editor.on("change", function (cm, event) {
                    // Check if hint is open and hint function exists
                    if (cm.state.completeActive && typeof cm.showHint !== "function")
                        return;
                    // Check if auto hint switch on
                    if (!Options.realtimeHint)
                        return;
                    // If user type something
                    if (event.origin === "+input") {
                        // Check if cursor point to any stop words
                        if (cm.doc.modeOption === "text/vnd.tiddlywiki") {
                            // If writting tw text
                            if (/[;,]$/.test(event.text[0]))
                                return;
                        }
                        else {
                            // If writting other text
                            if (/[;,{}()[\]]$/.test(event.text[0]))
                                return;
                        }
                        // Check if just break the line
                        if (event.text[0].trim() === "") {
                            if (event.text[1]) {
                                if (event.text[1].trim() === "")
                                    return;
                            }
                            else
                                return;
                        }
                    }
                    // If user delete something
                    else if (event.origin === "+delete") {
                        // If delete nothing
                        if (event.removed[0] === "")
                            return;
                        // If cursor point to the line head
                        if (event.to.ch < 2)
                            return;
                        // If text of line before the cursor is blank
                        var theLine = cm.getDoc().getLine(event.to.line);
                        if (!theLine || theLine.substr(0, event.to.ch - 1).trim() === "")
                            return;
                    }
                    // If not above, show hint
                    cm.showHint({
                        // If there is oly one hint suggestion, don't complete automatically, or can be awful.
                        completeSingle: false,
                        // Close when pick one of hints
                        closeOnPick: true,
                    });
                });
            },
        });
    }

    function getSnippetsList() {
        return getAddons("SnippetsList");
    }
    function init$1() {
        registerService({
            name: "SnippetsList",
            tag: "$:/CodeMirrorEnhanced/SnippetsList",
            onLoad: function (CodeMirror, cme) { },
            onHook: function (editor, cme) { },
            api: {
                getSnippetsList: getSnippetsList,
            },
        });
    }

    var activatedEditor = null;
    function currentEditor() {
        if (!activatedEditor.display.wrapper.ownerDocument.contains(activatedEditor.display.wrapper))
            activatedEditor = null;
        return activatedEditor;
    }
    function insertToCurrentEditor(text) {
        var editor = currentEditor();
        if (!editor)
            return false;
        editor.replaceRange(text, editor.getCursor(), editor.getCursor(), "input");
        return true;
    }
    function getCurrentSelections() {
        var editor = currentEditor();
        if (!editor)
            return [];
        return editor.getSelections();
    }
    function replaceCurrentSelections(textArray) {
        var editor = currentEditor();
        if (!editor)
            return;
        editor.replaceSelections(textArray);
    }
    function init(CodeMirror) {
        // When new editor instance is created, update addons and hook service
        CodeMirror.defineInitHook(function (editor) {
            editor.on("focus", function (editor_) {
                activatedEditor = editor_;
            });
        });
        return {
            currentEditor: currentEditor,
            insertToCurrentEditor: insertToCurrentEditor,
            getCurrentSelections: getCurrentSelections,
            replaceCurrentSelections: replaceCurrentSelections,
        };
    }

    var CodeMirror = require("$:/plugins/tiddlywiki/codemirror/lib/codemirror.js");
    var api = {};
    api["service"] = init$4(CodeMirror, api);
    init$3();
    init$2();
    init$1();
    api["editor"] = init(CodeMirror);
    if (window)
        window["$cme"] = api;

    return api;

}));
