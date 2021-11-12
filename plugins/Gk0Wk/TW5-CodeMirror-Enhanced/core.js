(function (CodeMirror) {
    'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    function _interopNamespace(e) {
        if (e && e.__esModule) return e;
        var n = Object.create(null);
        if (e) {
            Object.keys(e).forEach(function (k) {
                if (k !== 'default') {
                    var d = Object.getOwnPropertyDescriptor(e, k);
                    Object.defineProperty(n, k, d.get ? d : {
                        enumerable: true,
                        get: function () { return e[k]; }
                    });
                }
            });
        }
        n["default"] = e;
        return Object.freeze(n);
    }

    var CodeMirror__default = /*#__PURE__*/_interopDefaultLegacy(CodeMirror);
    var CodeMirror__namespace = /*#__PURE__*/_interopNamespace(CodeMirror);

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    function __generator(thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    }

    function loadTiddler(tiddler) {
        try {
            switch ($tw.wiki.getTiddler(tiddler).fields.type) {
                case 'application/javascript':
                    return require(tiddler);
                case 'application/json':
                    return JSON.parse($tw.wiki.getTiddlerText(tiddler));
                case 'application/x-tiddler-dictionary':
                    return $tw.utils.parseFields($tw.wiki.getTiddlerText(tiddler));
                default:
                    return undefined;
            }
        }
        catch (error) {
            console.error(error);
            return undefined;
        }
    }

    function getOriginalShadowTiddler(tiddler) {
        var source = $tw.wiki.getShadowSource(tiddler);
        if (source === undefined)
            return undefined;
        var plugin = $tw.wiki.getPluginInfo(source);
        if (plugin === undefined)
            return undefined;
        return plugin.tiddlers[tiddler];
    }
    function isOverrideCMEShadowTiddler(tiddler) {
        return $tw.wiki.filterTiddlers('[field:title[$:/plugins/Gk0Wk/TW5-CodeMirror-Enhanced/config.json]is[shadow]]').length > 0;
    }
    function getOverridei18nShadowTiddler() {
        return $tw.wiki.filterTiddlers('[!field:cmei18n[]!is[draft]is[shadow]]');
    }
    function mergeShadowAndTiddler(tiddler) {
        var overrideTiddlerObject = loadTiddler(tiddler);
        if (overrideTiddlerObject === undefined)
            $tw.wiki.deleteTiddler(tiddler);
        var plugin = $tw.wiki.getPluginInfo('$:/plugins/Gk0Wk/TW5-CodeMirror-Enhanced');
        var shadowTiddlerObject;
        try {
            if (plugin.tiddlers[tiddler].type !== undefined && plugin.tiddlers[tiddler].type === 'application/x-tiddler-dictionary') {
                shadowTiddlerObject = $tw.utils.parseFields(plugin.tiddlers[tiddler].text);
            }
            else {
                shadowTiddlerObject = JSON.parse(plugin.tiddlers[tiddler].text);
            }
        }
        catch (error) {
            console.error(error);
            return undefined;
        }
        return new $tw.Tiddler(__assign(__assign(__assign(__assign(__assign({}, $tw.wiki.getCreationFields()), $tw.wiki.getPluginInfo('$:/plugins/Gk0Wk/TW5-CodeMirror-Enhanced').tiddlers[tiddler]), $tw.wiki.getTiddler(tiddler)), { text: JSON.stringify(__assign(__assign({}, shadowTiddlerObject), overrideTiddlerObject), null, 4) }), $tw.wiki.getModificationFields()));
    }
    function checkIncomingTiddler(tiddler) {
        var temporaryTiddler = tiddler;
        if (temporaryTiddler.fields.title !== undefined &&
            (temporaryTiddler.fields.title === '$:/plugins/Gk0Wk/TW5-CodeMirror-Enhanced/config.json' || temporaryTiddler.fields.cmei18n !== undefined))
            temporaryTiddler = mergeShadowAndTiddler(tiddler.fields.title);
        return temporaryTiddler;
    }
    function init$5() {
        if (isOverrideCMEShadowTiddler()) {
            var mergedTiddler = mergeShadowAndTiddler('$:/plugins/Gk0Wk/TW5-CodeMirror-Enhanced/config.json');
            if (mergedTiddler !== undefined)
                $tw.wiki.addTiddler(mergedTiddler);
            else
                $tw.wiki.deleteTiddler('$:/plugins/Gk0Wk/TW5-CodeMirror-Enhanced/config.json');
        }
        $tw.utils.each(getOverridei18nShadowTiddler(), function (i18nShadowTiddler) {
            var mergedTiddler = mergeShadowAndTiddler(i18nShadowTiddler);
            if (mergedTiddler !== undefined)
                $tw.wiki.addTiddler(mergedTiddler);
            else
                $tw.wiki.deleteTiddler(i18nShadowTiddler);
        });
        $tw.hooks.addHook('th-saving-tiddler', checkIncomingTiddler);
        $tw.hooks.addHook('th-importing-tiddler', checkIncomingTiddler);
        return {
            getOriginalShadowTiddler: getOriginalShadowTiddler,
            isOverrideCMEShadowTiddler: isOverrideCMEShadowTiddler,
        };
    }

    var activatedEditor;
    function currentEditor() {
        if (activatedEditor === undefined)
            return undefined;
        var wrapper = activatedEditor.getWrapperElement();
        if (!wrapper.ownerDocument.contains(wrapper))
            activatedEditor = undefined;
        return activatedEditor;
    }
    function insertToCurrentEditor(text) {
        var editor = currentEditor();
        if (editor === undefined)
            return false;
        editor.replaceRange(text, editor.getCursor(), editor.getCursor(), 'input');
        return true;
    }
    function getCurrentSelections() {
        var editor = currentEditor();
        if (editor === undefined)
            return [];
        return editor.getSelections();
    }
    function replaceCurrentSelections(textArray) {
        var editor = currentEditor();
        if (editor === undefined)
            return;
        editor.replaceSelections(textArray);
    }
    function init$4() {
        CodeMirror__default["default"].defineInitHook(function (editor) {
            editor.on('focus', function (editor_) {
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

    var InnerService = (function () {
        function InnerService(bald) {
            this.name = bald.name;
            this.tag = bald.tag !== undefined ? bald.tag : undefined;
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
    function updateService() {
        $tw.utils.each(services, function (service, name) {
            if (service.tag === undefined)
                return;
            var tiddlers = $tw.wiki.filterTiddlers("[all[tiddlers+shadows]tag[" + service.tag + "]!is[draft]]");
            $tw.utils.each(tiddlers, function (tiddler) {
                if (!(tiddler in service.addons)) {
                    var addon = loadTiddler(tiddler);
                    if (addon !== undefined)
                        service.addons[tiddler] = addon;
                }
                else {
                    var tiddlerData = $tw.wiki.getTiddler(tiddler);
                    if (tiddlerData !== undefined &&
                        ((tiddlerData.fields.modified !== undefined && tiddlerData.fields.modified >= service.lastAddonsUpdateTime) ||
                            (tiddlerData.fields.created !== undefined && tiddlerData.fields.created >= service.lastAddonsUpdateTime))) {
                        var addon = loadTiddler(tiddler);
                        if (addon !== undefined)
                            service.addons[tiddler] = addon;
                        else
                            delete service.addons[tiddler];
                    }
                }
            });
            $tw.utils.each(service.addons, function (addon, tiddler) {
                if (!tiddlers.includes(tiddler)) {
                    delete service.addons[tiddler];
                }
            });
            service.lastAddonsUpdateTime = new Date();
        });
    }
    function registerService(service) {
        services[service.name] = new InnerService(service);
        if (service.api !== undefined)
            api$1[service.name] = service.api;
    }
    function getAddons(name) {
        return services[name].addons;
    }
    function init$3(cme) {
        CodeMirror__namespace.defineInitHook(function (editor) {
            updateService();
            for (var name_1 in services) {
                var service = services[name_1];
                if (!service.isLoad)
                    service.onLoad(cme);
                service.onHook(editor, cme);
            }
        });
        return api$1;
    }

    function getOption(key) {
        return $tw.wiki.filterTiddlers("[[$:/plugins/Gk0Wk/TW5-CodeMirror-Enhanced/config.json]getindex[" + key + "]]")[0];
    }
    function getBoolean(key, defaultValue) {
        var optionText = getOption(key);
        return optionText !== undefined ? optionText.toLowerCase() === 'true' : defaultValue;
    }
    var Options = (function () {
        function Options() {
        }
        Object.defineProperty(Options, "clickableService", {
            get: function () {
                return getBoolean('clickable-links', false);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Options, "realtimeHint", {
            get: function () {
                return getBoolean('realtime-hint', false);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Options, "hintPreview", {
            get: function () {
                return getBoolean('hint-preview', false);
            },
            enumerable: false,
            configurable: true
        });
        return Options;
    }());

    var functionKey = /macintosh|mac os x/i.test(navigator.userAgent) ? 'metaKey' : 'ctrlKey';
    function init$2() {
        registerService({
            name: 'ClickableToken',
            tag: '$:/CodeMirrorEnhanced/ClickableToken',
            onLoad: function (cme) {
            },
            onHook: function (editor, cme) {
                editor.on('mousedown', function (cm, event) {
                    if (event[functionKey] && Options.clickableService) {
                        var addons = getAddons('ClickableToken');
                        for (var key in addons) {
                            if (addons[key].handler(editor, event, cme))
                                break;
                        }
                    }
                });
            },
        });
    }

    function globalHintRender(hintNode, hints, currentHint) {
        var _a, _b, _c, _d;
        var ownerDocument = hintNode.ownerDocument;
        var titlePartNode = ownerDocument.createElement('span');
        hintNode.append(titlePartNode);
        titlePartNode.className = 'hint-title';
        if (currentHint.render_ !== undefined) {
            currentHint.render_(titlePartNode, hints, currentHint);
        }
        else {
            var text_1 = (_b = (_a = currentHint.displayText) !== null && _a !== void 0 ? _a : currentHint.text) !== null && _b !== void 0 ? _b : '';
            if (currentHint.hintMatch !== undefined) {
                var textList_1 = [];
                try {
                    currentHint.hintMatch.sort(function (a, b) {
                        return a.from - b.from;
                    });
                    var pointer_1 = 0;
                    $tw.utils.each(currentHint.hintMatch, function (range) {
                        if (range.from > pointer_1) {
                            textList_1.push(text_1.substring(pointer_1, range.from));
                        }
                        pointer_1 = range.to;
                        textList_1.push("<span class=\"hint-title-highlighted\">" + text_1.substring(range.from, pointer_1) + "</span>");
                    });
                    if (text_1.length > pointer_1)
                        textList_1.push(text_1.substring(pointer_1));
                    text_1 = textList_1.join('');
                }
                catch (_e) {
                    text_1 = (_d = (_c = currentHint.displayText) !== null && _c !== void 0 ? _c : currentHint.text) !== null && _d !== void 0 ? _d : '';
                }
            }
            titlePartNode.innerHTML = text_1;
        }
        var typeString = currentHint.type;
        if (typeString !== undefined) {
            var typePartNode = ownerDocument.createElement('span');
            hintNode.append(typePartNode);
            typePartNode.className = 'hint-type';
            typePartNode.append(ownerDocument.createTextNode(typeString));
        }
    }
    function init$1() {
        var _this = this;
        registerService({
            name: 'RealtimeHint',
            tag: '$:/CodeMirrorEnhanced/RealtimeHint',
            onLoad: function (cme) {
                CodeMirror__default["default"].registerHelper('hint', 'tiddlywiki5', function (editor, options) { return __awaiter(_this, void 0, void 0, function () {
                    var addons, getHintAsyncTasks, _loop_1, addonTiddler, result_1, _a, _b, previewBoxNode_1, closePreview_1, error_1;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0:
                                _c.trys.push([0, 2, , 3]);
                                addons = getAddons('RealtimeHint');
                                getHintAsyncTasks = [];
                                _loop_1 = function (addonTiddler) {
                                    var addon = addons[addonTiddler];
                                    getHintAsyncTasks.push(new Promise(function (resolve) {
                                        var hintAddon = addon;
                                        try {
                                            var hints_1 = hintAddon.hint(editor, options, cme);
                                            var tmplist_1 = [];
                                            var minPos_1 = editor.getCursor();
                                            if (typeof hints_1 === 'object') {
                                                if (hints_1.from !== undefined && CodeMirror__default["default"].cmpPos(minPos_1, hints_1.from) > 0)
                                                    minPos_1 = hints_1.from;
                                                $tw.utils.each(hints_1.list, function (hint) {
                                                    if (typeof hint === 'string') {
                                                        if (hints_1.from !== undefined && hints_1.to !== undefined)
                                                            tmplist_1.push({
                                                                text: hint,
                                                                from: hints_1.from,
                                                                to: hints_1.to,
                                                                render_: hints_1.render,
                                                                render: globalHintRender,
                                                                renderPreview: hints_1.renderPreview,
                                                                hint: hints_1.hint,
                                                                type: hints_1.type,
                                                                className: 'cm-hacked-hint',
                                                            });
                                                    }
                                                    else {
                                                        var _from = hint.from === undefined ? hints_1.from : hint.from;
                                                        var _to = hint.to === undefined ? hints_1.to : hint.to;
                                                        if (_from !== undefined && _to !== undefined)
                                                            tmplist_1.push({
                                                                text: hint.text,
                                                                displayText: hint.displayText,
                                                                from: _from,
                                                                to: _to,
                                                                render_: hint.render === undefined ? hints_1.render : hint.render,
                                                                render: globalHintRender,
                                                                renderPreview: hint.renderPreview === undefined ? hints_1.renderPreview : hint.renderPreview,
                                                                hintMatch: hint.hintMatch === undefined ? hints_1.hintMatch : hint.hintMatch,
                                                                hint: hint.hint === undefined ? hints_1.hint : hint.hint,
                                                                type: hint.type === undefined ? hints_1.type : hint.type,
                                                                renderCache: hint.renderCache,
                                                                className: 'cm-hacked-hint',
                                                            });
                                                        if (hint.from !== undefined && CodeMirror__default["default"].cmpPos(minPos_1, hint.from) > 0)
                                                            minPos_1 = hint.from;
                                                    }
                                                });
                                            }
                                            resolve({
                                                from: minPos_1,
                                                list: tmplist_1,
                                                to: editor.getCursor(),
                                            });
                                        }
                                        catch (error) {
                                            console.error("Error occured by tiddler " + addonTiddler + ":");
                                            console.error(error);
                                            resolve(undefined);
                                        }
                                    }));
                                };
                                for (addonTiddler in addons) {
                                    _loop_1(addonTiddler);
                                }
                                result_1 = {
                                    from: editor.getCursor(),
                                    list: [],
                                    to: editor.getCursor(),
                                };
                                _b = (_a = $tw.utils).each;
                                return [4, Promise.all(getHintAsyncTasks)];
                            case 1:
                                _b.apply(_a, [_c.sent(), function (hints) {
                                        if (hints === undefined)
                                            return;
                                        $tw.utils.each(hints.list, function (hint) {
                                            result_1.list.push(hint);
                                        });
                                        if (CodeMirror__default["default"].cmpPos(result_1.from, hints.from) > 0)
                                            result_1.from = hints.from;
                                    }]);
                                closePreview_1 = function () {
                                    var _a;
                                    if (((_a = previewBoxNode_1 === null || previewBoxNode_1 === void 0 ? void 0 : previewBoxNode_1.ownerDocument.body) === null || _a === void 0 ? void 0 : _a.contains(previewBoxNode_1)) === true)
                                        previewBoxNode_1 === null || previewBoxNode_1 === void 0 ? void 0 : previewBoxNode_1.remove();
                                };
                                if (result_1.list.length > 0) {
                                    CodeMirror__default["default"].on(result_1, 'select', function (selectedData_, selectedNode_) {
                                        var selectedData = selectedData_;
                                        var selectedNode = selectedNode_;
                                        if (Options.hintPreview) {
                                            var parentNode = selectedNode.parentNode;
                                            var appendId = parentNode.id + '-hint-append';
                                            previewBoxNode_1 = selectedNode.ownerDocument.querySelector("#" + appendId);
                                            var shouldCreate = previewBoxNode_1 === null || previewBoxNode_1 === undefined;
                                            if (shouldCreate) {
                                                previewBoxNode_1 = selectedNode.ownerDocument.createElement('div');
                                                previewBoxNode_1.id = appendId;
                                                previewBoxNode_1.className =
                                                    'CodeMirror-hints CodeMirror-hints-append ' + (editor.getOption('theme') === undefined ? '' : editor.getOption('theme'));
                                                previewBoxNode_1.style.left = parentNode.offsetLeft + parentNode.offsetWidth + "px";
                                                previewBoxNode_1.style.top = parentNode.offsetTop + "px";
                                            }
                                            var shouldDisplay = false;
                                            try {
                                                if (typeof selectedData.renderCache === 'string') {
                                                    previewBoxNode_1.innerHTML = selectedData.renderCache;
                                                    shouldDisplay = true;
                                                }
                                                else if (typeof selectedData.renderPreview === 'function') {
                                                    shouldDisplay = selectedData.renderPreview(previewBoxNode_1, selectedData, selectedNode);
                                                    if (shouldDisplay && previewBoxNode_1.innerHTML.trim() === '')
                                                        shouldDisplay = false;
                                                }
                                            }
                                            catch (error) {
                                                previewBoxNode_1.textContent = String(error);
                                                console.error(error);
                                            }
                                            if (shouldDisplay) {
                                                if (shouldCreate) {
                                                    CodeMirror__default["default"].on(result_1, 'close', closePreview_1);
                                                    CodeMirror__default["default"].on(editor, 'endCompletion', closePreview_1);
                                                    var closingOnBlur_1;
                                                    editor.on('blur', function () {
                                                        closingOnBlur_1 = setTimeout(closePreview_1, 100);
                                                    });
                                                    editor.on('focus', function () { return clearTimeout(closingOnBlur_1); });
                                                    selectedNode.ownerDocument.body.append(previewBoxNode_1);
                                                }
                                            }
                                            else if (selectedNode.ownerDocument.body.contains(previewBoxNode_1))
                                                previewBoxNode_1 === null || previewBoxNode_1 === void 0 ? void 0 : previewBoxNode_1.remove();
                                        }
                                    });
                                }
                                else {
                                    closePreview_1();
                                }
                                return [2, result_1];
                            case 2:
                                error_1 = _c.sent();
                                console.error(error_1);
                                return [2, null];
                            case 3: return [2];
                        }
                    });
                }); });
            },
            onHook: function (editor, cme) {
                editor.on('change', function (cm, event) {
                    if (cm.state.completeActive || typeof cm.showHint !== 'function' || !Options.realtimeHint)
                        return;
                    if (event.origin === '+input') {
                        if (cm.getDoc().modeOption === 'text/vnd.tiddlywiki') {
                            if (/[,;]$/.test(event.text[0]))
                                return;
                        }
                        else {
                            if (/[(),;[\]{}]$/.test(event.text[0]))
                                return;
                        }
                        if (event.text[0].trim() === '') {
                            if (event.text.length > 1) {
                                if (event.text[1].trim() === '')
                                    return;
                            }
                            else
                                return;
                        }
                    }
                    else if (event.origin === '+delete') {
                        if (event.removed === undefined || event.removed.length > 2 || event.removed[0] === '')
                            return;
                        if (event.to.ch < 2)
                            return;
                        var theLine = cm.getDoc().getLine(event.to.line);
                        if (theLine === undefined || theLine.length === 0 || theLine.substr(0, event.to.ch - 1).trim() === '')
                            return;
                    }
                    else {
                        return;
                    }
                    cm.showHint({
                        completeSingle: false,
                        closeOnPick: true,
                    });
                });
            },
            api: {
                makeLiteralHintMatch: function (text, search, options) {
                    var hintMatch = [];
                    if (text.length === 0 || search.length === 0)
                        return hintMatch;
                    if ((options === null || options === void 0 ? void 0 : options.maxTimes) === 0)
                        return hintMatch;
                    if ((options === null || options === void 0 ? void 0 : options.caseSensitive) !== true) {
                        text = text.toLowerCase();
                        search = search.toLowerCase();
                    }
                    var to = 0;
                    if ((options === null || options === void 0 ? void 0 : options.maxTimes) !== undefined && options.maxTimes > 0) {
                        var counter = 0;
                        var times = options.maxTimes;
                        while (counter++ < times) {
                            var from = text.indexOf(search, to);
                            if (from < 0)
                                break;
                            to = from + search.length;
                            hintMatch.push({ from: from, to: to });
                        }
                    }
                    else {
                        while (true) {
                            var from = text.indexOf(search, to);
                            if (from < 0)
                                break;
                            to = from + search.length;
                            hintMatch.push({ from: from, to: to });
                        }
                    }
                    return hintMatch;
                },
            },
        });
    }

    function getSnippetsList() {
        return getAddons('SnippetsList');
    }
    function init() {
        registerService({
            name: 'SnippetsList',
            tag: '$:/CodeMirrorEnhanced/SnippetsList',
            onLoad: function (cme) {
            },
            onHook: function (editor, cme) {
            },
            api: {
                getSnippetsList: getSnippetsList,
            },
        });
    }

    var api = {};
    api.CodeMirror = CodeMirror__default["default"];
    api.tiddlerMerge = init$5();
    api.editor = init$4();
    api.service = init$3(api);
    init$2();
    init$1();
    init();
    var selfGlobal = (window === undefined ? globalThis : window);
    selfGlobal.$cme = api;

})(CodeMirror);
