'use strict';
/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */

function isObject(value) {
  var type = typeof value;
  return value != null && (type == 'object' || type == 'function');
}

var isObject_1 = isObject;
var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};
/** Detect free variable `global` from Node.js. */

var freeGlobal = typeof commonjsGlobal == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;
var _freeGlobal = freeGlobal;
/** Detect free variable `self`. */

var freeSelf = typeof self == 'object' && self && self.Object === Object && self;
/** Used as a reference to the global object. */

var root = _freeGlobal || freeSelf || Function('return this')();
var _root = root;
/**
 * Gets the timestamp of the number of milliseconds that have elapsed since
 * the Unix epoch (1 January 1970 00:00:00 UTC).
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Date
 * @returns {number} Returns the timestamp.
 * @example
 *
 * _.defer(function(stamp) {
 *   console.log(_.now() - stamp);
 * }, _.now());
 * // => Logs the number of milliseconds it took for the deferred invocation.
 */

var now = function () {
  return _root.Date.now();
};

var now_1 = now;
/** Used to match a single whitespace character. */

var reWhitespace = /\s/;
/**
 * Used by `_.trim` and `_.trimEnd` to get the index of the last non-whitespace
 * character of `string`.
 *
 * @private
 * @param {string} string The string to inspect.
 * @returns {number} Returns the index of the last non-whitespace character.
 */

function trimmedEndIndex(string) {
  var index = string.length;

  while (index-- && reWhitespace.test(string.charAt(index))) {}

  return index;
}

var _trimmedEndIndex = trimmedEndIndex;
/** Used to match leading whitespace. */

var reTrimStart = /^\s+/;
/**
 * The base implementation of `_.trim`.
 *
 * @private
 * @param {string} string The string to trim.
 * @returns {string} Returns the trimmed string.
 */

function baseTrim(string) {
  return string ? string.slice(0, _trimmedEndIndex(string) + 1).replace(reTrimStart, '') : string;
}

var _baseTrim = baseTrim;
/** Built-in value references. */

var Symbol = _root.Symbol;
var _Symbol = Symbol;
/** Used for built-in method references. */

var objectProto$1 = Object.prototype;
/** Used to check objects for own properties. */

var hasOwnProperty = objectProto$1.hasOwnProperty;
/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */

var nativeObjectToString$1 = objectProto$1.toString;
/** Built-in value references. */

var symToStringTag$1 = _Symbol ? _Symbol.toStringTag : undefined;
/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */

function getRawTag(value) {
  var isOwn = hasOwnProperty.call(value, symToStringTag$1),
      tag = value[symToStringTag$1];

  try {
    value[symToStringTag$1] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString$1.call(value);

  if (unmasked) {
    if (isOwn) {
      value[symToStringTag$1] = tag;
    } else {
      delete value[symToStringTag$1];
    }
  }

  return result;
}

var _getRawTag = getRawTag;
/** Used for built-in method references. */

var objectProto = Object.prototype;
/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */

var nativeObjectToString = objectProto.toString;
/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */

function objectToString(value) {
  return nativeObjectToString.call(value);
}

var _objectToString = objectToString;
/** `Object#toString` result references. */

var nullTag = '[object Null]',
    undefinedTag = '[object Undefined]';
/** Built-in value references. */

var symToStringTag = _Symbol ? _Symbol.toStringTag : undefined;
/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */

function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }

  return symToStringTag && symToStringTag in Object(value) ? _getRawTag(value) : _objectToString(value);
}

var _baseGetTag = baseGetTag;
/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */

function isObjectLike(value) {
  return value != null && typeof value == 'object';
}

var isObjectLike_1 = isObjectLike;
/** `Object#toString` result references. */

var symbolTag = '[object Symbol]';
/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */

function isSymbol(value) {
  return typeof value == 'symbol' || isObjectLike_1(value) && _baseGetTag(value) == symbolTag;
}

var isSymbol_1 = isSymbol;
/** Used as references for various `Number` constants. */

var NAN = 0 / 0;
/** Used to detect bad signed hexadecimal string values. */

var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;
/** Used to detect binary string values. */

var reIsBinary = /^0b[01]+$/i;
/** Used to detect octal string values. */

var reIsOctal = /^0o[0-7]+$/i;
/** Built-in method references without a dependency on `root`. */

var freeParseInt = parseInt;
/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3.2);
 * // => 3.2
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3.2');
 * // => 3.2
 */

function toNumber(value) {
  if (typeof value == 'number') {
    return value;
  }

  if (isSymbol_1(value)) {
    return NAN;
  }

  if (isObject_1(value)) {
    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
    value = isObject_1(other) ? other + '' : other;
  }

  if (typeof value != 'string') {
    return value === 0 ? value : +value;
  }

  value = _baseTrim(value);
  var isBinary = reIsBinary.test(value);
  return isBinary || reIsOctal.test(value) ? freeParseInt(value.slice(2), isBinary ? 2 : 8) : reIsBadHex.test(value) ? NAN : +value;
}

var toNumber_1 = toNumber;
/** Error message constants. */

var FUNC_ERROR_TEXT = 'Expected a function';
/* Built-in method references for those with the same name as other `lodash` methods. */

var nativeMax = Math.max,
    nativeMin = Math.min;
/**
 * Creates a debounced function that delays invoking `func` until after `wait`
 * milliseconds have elapsed since the last time the debounced function was
 * invoked. The debounced function comes with a `cancel` method to cancel
 * delayed `func` invocations and a `flush` method to immediately invoke them.
 * Provide `options` to indicate whether `func` should be invoked on the
 * leading and/or trailing edge of the `wait` timeout. The `func` is invoked
 * with the last arguments provided to the debounced function. Subsequent
 * calls to the debounced function return the result of the last `func`
 * invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is
 * invoked on the trailing edge of the timeout only if the debounced function
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `_.debounce` and `_.throttle`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to debounce.
 * @param {number} [wait=0] The number of milliseconds to delay.
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=false]
 *  Specify invoking on the leading edge of the timeout.
 * @param {number} [options.maxWait]
 *  The maximum time `func` is allowed to be delayed before it's invoked.
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new debounced function.
 * @example
 *
 * // Avoid costly calculations while the window size is in flux.
 * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
 *
 * // Invoke `sendMail` when clicked, debouncing subsequent calls.
 * jQuery(element).on('click', _.debounce(sendMail, 300, {
 *   'leading': true,
 *   'trailing': false
 * }));
 *
 * // Ensure `batchLog` is invoked once after 1 second of debounced calls.
 * var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
 * var source = new EventSource('/stream');
 * jQuery(source).on('message', debounced);
 *
 * // Cancel the trailing debounced invocation.
 * jQuery(window).on('popstate', debounced.cancel);
 */

function debounce(func, wait, options) {
  var lastArgs,
      lastThis,
      maxWait,
      result,
      timerId,
      lastCallTime,
      lastInvokeTime = 0,
      leading = false,
      maxing = false,
      trailing = true;

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }

  wait = toNumber_1(wait) || 0;

  if (isObject_1(options)) {
    leading = !!options.leading;
    maxing = 'maxWait' in options;
    maxWait = maxing ? nativeMax(toNumber_1(options.maxWait) || 0, wait) : maxWait;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }

  function invokeFunc(time) {
    var args = lastArgs,
        thisArg = lastThis;
    lastArgs = lastThis = undefined;
    lastInvokeTime = time;
    result = func.apply(thisArg, args);
    return result;
  }

  function leadingEdge(time) {
    // Reset any `maxWait` timer.
    lastInvokeTime = time; // Start the timer for the trailing edge.

    timerId = setTimeout(timerExpired, wait); // Invoke the leading edge.

    return leading ? invokeFunc(time) : result;
  }

  function remainingWait(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime,
        timeWaiting = wait - timeSinceLastCall;
    return maxing ? nativeMin(timeWaiting, maxWait - timeSinceLastInvoke) : timeWaiting;
  }

  function shouldInvoke(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime; // Either this is the first call, activity has stopped and we're at the
    // trailing edge, the system time has gone backwards and we're treating
    // it as the trailing edge, or we've hit the `maxWait` limit.

    return lastCallTime === undefined || timeSinceLastCall >= wait || timeSinceLastCall < 0 || maxing && timeSinceLastInvoke >= maxWait;
  }

  function timerExpired() {
    var time = now_1();

    if (shouldInvoke(time)) {
      return trailingEdge(time);
    } // Restart the timer.


    timerId = setTimeout(timerExpired, remainingWait(time));
  }

  function trailingEdge(time) {
    timerId = undefined; // Only invoke if we have `lastArgs` which means `func` has been
    // debounced at least once.

    if (trailing && lastArgs) {
      return invokeFunc(time);
    }

    lastArgs = lastThis = undefined;
    return result;
  }

  function cancel() {
    if (timerId !== undefined) {
      clearTimeout(timerId);
    }

    lastInvokeTime = 0;
    lastArgs = lastCallTime = lastThis = timerId = undefined;
  }

  function flush() {
    return timerId === undefined ? result : trailingEdge(now_1());
  }

  function debounced() {
    var time = now_1(),
        isInvoking = shouldInvoke(time);
    lastArgs = arguments;
    lastThis = this;
    lastCallTime = time;

    if (isInvoking) {
      if (timerId === undefined) {
        return leadingEdge(lastCallTime);
      }

      if (maxing) {
        // Handle invocations in a tight loop.
        clearTimeout(timerId);
        timerId = setTimeout(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }

    if (timerId === undefined) {
      timerId = setTimeout(timerExpired, wait);
    }

    return result;
  }

  debounced.cancel = cancel;
  debounced.flush = flush;
  return debounced;
}

var debounce_1 = debounce;

const Widget = require('$:/core/modules/widgets/widget.js').widget;

class CommandPaletteWidget extends Widget {
  constructor(parseTreeNode, options) {
    super(parseTreeNode, options);
    this.actions = [];
    this.triggers = [];
    this.currentResults = [];
    this.typeField = 'command-palette-type';
    /** 用于搜索的字段 */

    this.nameField = 'command-palette-name';
    /** 用于展示翻译内容的字段 */

    this.captionField = 'command-palette-caption';
    this.hintField = 'command-palette-hint';
    this.modeField = 'command-palette-mode';
    this.userInputField = 'command-palette-user-input';
    this.caretField = 'command-palette-caret';
    this.immediateField = 'command-palette-immediate';
    this.triggerField = 'command-palette-trigger';
    this.currentSelection = 0; //0 is nothing selected, 1 is first result,...

    this.symbolProviders = {};
    this.blockProviderChange = false;
    this.defaultSettings = {
      maxResults: 15,
      maxResultHintSize: 45,
      neverBasic: false,
      showHistoryOnOpen: true,
      escapeGoesBack: true,
      alwaysPassSelection: true,
      theme: '$:/plugins/linonetwo/commandpalette/Compact.css'
    };
    this.settings = {};
    this.commandHistoryPath = '$:/plugins/linonetwo/commandpalette/CommandPaletteHistory';
    this.settingsPath = '$:/plugins/linonetwo/commandpalette/CommandPaletteSettings';
    this.searchStepsPath = '$:/plugins/linonetwo/commandpalette/CommandPaletteSearchSteps';
    this.customCommandsTag = '$:/tags/CommandPaletteCommand';
    this.themesTag = '$:/tags/CommandPaletteTheme';
    /** current item's click/enter handler function */

    this.currentResolver = () => {};

    this.currentProvider = () => {};

    this.initialise(parseTreeNode, options);
    this.onInput = debounce_1(this.onInput, 300);
  }

  actionStringBuilder(text) {
    return e => this.invokeActionString(text, this, e);
  }

  actionStringInput(action, hint, e) {
    this.blockProviderChange = true;
    this.allowInputFieldSelection = true;
    this.hint.innerText = hint;
    this.input.value = '';

    this.currentProvider = () => {};

    this.currentResolver = e => {
      this.invokeActionString(action, this, e, {
        commandpaletteinput: this.input.value
      });
      this.closePalette();
    };

    this.showResults([]);
    this.onInput(this.input.value);
  }

  invokeFieldMangler(tiddler, message, param, e) {
    let action = `<$fieldmangler tiddler="${tiddler}">
			<$action-sendmessage $message="${message}" $param="${param}"/>
			</$fieldmangler>`;
    this.invokeActionString(action, this, e);
  }

  tagOperation(event, hintTiddler, hintTag,
  /** (tiddler, terms) => [tiddlers] */
  filter, allowNoSelection, message) {
    this.blockProviderChange = true;
    if (allowNoSelection) this.allowInputFieldSelection = true;
    this.currentProvider = this.historyProviderBuilder(hintTiddler);

    this.currentResolver = e => {
      if (this.currentSelection === 0) return;
      let tiddler = this.getDataFromResultDiv(this.currentResults[this.currentSelection - 1], 'name');

      this.currentProvider = terms => {
        this.currentSelection = 0;
        this.hint.innerText = hintTag;

        if (tiddler) {
          let searches = filter(tiddler, terms);
          this.showResults(searches.map(s => {
            return {
              name: s
            };
          }));
        }
      };

      this.input.value = '';
      this.onInput(this.input.value);

      this.currentResolver = e => {
        if (!allowNoSelection && this.currentSelection === 0) return;
        let tag = this.input.value;

        if (this.currentSelection !== 0) {
          tag = this.getDataFromResultDiv(this.currentResults[this.currentSelection - 1], 'name');
        }

        this.invokeFieldMangler(tiddler, message, tag, e);

        if (!e.getModifierState('Shift')) {
          this.closePalette();
        } else {
          this.onInput(this.input.value);
        }
      };
    };

    this.input.value = '';
    this.onInput(this.input.value);
  }

  refreshThemes(e) {
    this.themes = this.getTiddlersWithTag(this.themesTag);
    let found = false;

    for (let theme of this.themes) {
      let themeName = theme.fields.title;

      if (themeName === this.settings.theme) {
        found = true;
        this.addTagIfNecessary(themeName, '$:/tags/Stylesheet', e);
      } else {
        this.invokeFieldMangler(themeName, 'tm-remove-tag', '$:/tags/Stylesheet', e);
      }
    }

    if (found) return;
    this.addTagIfNecessary(this.defaultSettings.theme, '$:/tags/Stylesheet', e);
  } //Re-adding an existing tag changes modification date
  // @ts-expect-error ts-migrate(7006) FIXME: Parameter 'tiddler' implicitly has an 'any' type.


  addTagIfNecessary(tiddler, tag, e) {
    if (this.hasTag(tiddler, tag)) return;
    this.invokeFieldMangler(tiddler, 'tm-add-tag', tag, e);
  } // @ts-expect-error ts-migrate(7006) FIXME: Parameter 'tiddler' implicitly has an 'any' type.


  hasTag(tiddler, tag) {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name '$tw'.
    return $tw.wiki.getTiddler(tiddler).fields.tags.includes(tag);
  }

  refreshCommands() {
    var _a, _b, _c, _d, _e;

    this.actions = [];
    this.actions.push({
      name: 'Refresh Command Palette',
      action: e => {
        this.refreshCommandPalette();
        this.promptCommand('');
      },
      keepPalette: true
    });
    this.actions.push({
      name: 'Explorer',
      action: e => this.explorer(e),
      keepPalette: true
    });
    this.actions.push({
      name: 'See History',
      action: e => this.showHistory(),
      keepPalette: true
    });
    this.actions.push({
      name: 'New Command Wizard',
      action: e => this.newCommandWizard(),
      keepPalette: true
    });
    this.actions.push({
      name: 'Add tag to tiddler',
      action: e => this.tagOperation(e, 'Pick tiddler to tag', 'Pick tag to add (⇧⏎ to add multiple)', (tiddler, terms) => // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name '$tw'.
      $tw.wiki.filterTiddlers(`[!is[system]tags[]] [is[system]tags[]] -[[${tiddler}]tags[]] +[pinyinfuse[${terms}]]`), true, 'tm-add-tag'),
      keepPalette: true
    });
    this.actions.push({
      name: 'Remove tag',
      action: e => this.tagOperation(e, 'Pick tiddler to untag', 'Pick tag to remove (⇧⏎ to remove multiple)', // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name '$tw'.
      (tiddler, terms) => $tw.wiki.filterTiddlers(`[[${tiddler}]tags[]] +[pinyinfuse[${terms}]]`), false, 'tm-remove-tag'),
      keepPalette: true
    });
    let commandTiddlers = this.getTiddlersWithTag(this.customCommandsTag);

    for (let tiddler of commandTiddlers) {
      if (!tiddler.fields[this.typeField] === undefined) continue;
      let name = tiddler.fields[this.nameField];
      if (typeof name !== 'string') throw new Error(`Command palette tiddler ${tiddler.fields.title} doesn't have a ${this.nameField} field`);
      let caption = this.translateCaption(tiddler.fields[this.captionField]);
      let type = tiddler.fields[this.typeField];
      let text = this.translateCaption(tiddler.fields.text);
      if (text === undefined) text = '';
      let textFirstLine = ((_a = text.match(/^.*/)) !== null && _a !== void 0 ? _a : [''])[0];
      let hint = this.translateCaption((_c = (_b = tiddler.fields[this.hintField]) !== null && _b !== void 0 ? _b : tiddler.fields[this.nameField]) !== null && _c !== void 0 ? _c : '');

      if (type === 'shortcut') {
        let trigger = tiddler.fields[this.triggerField];
        if (trigger === undefined) continue;
        this.triggers.push({
          name,
          caption,
          trigger,
          text,
          hint
        });
        continue;
      }

      if (!tiddler.fields[this.nameField] === undefined) continue;

      if (type === 'prompt') {
        let immediate = !!tiddler.fields[this.immediateField];
        let caret = (_d = Number(tiddler.fields[this.caretField])) !== null && _d !== void 0 ? _d : 0;
        let action = {
          name,
          caption,
          hint,
          action: () => this.promptCommand(textFirstLine, caret),
          keepPalette: !immediate,
          immediate: immediate
        };
        this.actions.push(action);
        continue;
      }

      if (type === 'prompt-basic') {
        let caret = (_e = Number(tiddler.fields[this.caretField])) !== null && _e !== void 0 ? _e : 0;
        let action = {
          name,
          caption,
          hint,
          action: () => this.promptCommandBasic(textFirstLine, caret, hint),
          keepPalette: true
        };
        this.actions.push(action);
        continue;
      }

      if (type === 'message') {
        this.actions.push({
          name,
          caption,
          hint,
          action: e => this.tmMessageBuilder(textFirstLine)(e),
          keepPalette: false
        });
        continue;
      }

      if (type === 'actionString') {
        let userInput = tiddler.fields[this.userInputField] !== undefined && tiddler.fields[this.userInputField] === 'true';

        if (userInput) {
          this.actions.push({
            name,
            caption,
            hint,
            action: e => this.actionStringInput(text, hint, e),
            keepPalette: true
          });
        } else {
          this.actions.push({
            name,
            caption,
            hint,
            action: e => this.actionStringBuilder(text)(e),
            keepPalette: false
          });
        }

        continue;
      }

      if (type === 'history') {
        let mode = tiddler.fields[this.modeField];
        this.actions.push({
          name,
          caption,
          hint,
          action: e => this.commandWithHistoryPicker(textFirstLine, hint, mode).handler(e),
          keepPalette: true
        });
        continue;
      }
    }
  } // @ts-expect-error ts-migrate(7006) FIXME: Parameter 'caption' implicitly has an 'any' type.


  translateCaption(caption) {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name '$tw'.
    return $tw.wiki.renderText('text/plain', 'text/vnd.tiddlywiki', caption);
  }

  newCommandWizard() {
    this.blockProviderChange = true;
    this.input.value = '';
    this.hint.innerText = 'Command Name';
    let name = '';
    let type = '';
    let hint = '';

    let messageStep = () => {
      this.input.value = '';
      this.hint.innerText = 'Enter Message';

      this.currentResolver = e => {
        this.tmMessageBuilder('tm-new-tiddler', {
          title: '$:/' + name,
          tags: this.customCommandsTag,
          [this.typeField]: type,
          [this.nameField]: name,
          [this.hintField]: hint,
          text: this.input.value
        })(e);
        this.closePalette();
      };
    };

    let hintStep = () => {
      this.input.value = '';
      this.hint.innerText = 'Enter hint';

      this.currentResolver = e => {
        hint = this.input.value;
        messageStep();
      };
    };

    let typeStep = () => {
      this.input.value = '';
      this.hint.innerText = 'Enter type (prompt, prompt-basic, message, actionString, history)';

      this.currentResolver = e => {
        type = this.input.value;

        if (type === 'history') {
          hintStep();
        } else {
          this.tmMessageBuilder('tm-new-tiddler', {
            title: '$:/' + name,
            tags: this.customCommandsTag,
            [this.typeField]: type,
            [this.nameField]: name
          })(e);
          this.closePalette();
        }
      };
    };

    this.currentProvider = terms => {};

    this.currentResolver = e => {
      if (this.input.value.length === 0) return;
      name = this.input.value;
      typeStep();
    };

    this.showResults([]);
  }

  explorer(e) {
    this.blockProviderChange = true;
    this.input.value = '$:/';
    this.lastExplorerInput = '$:/';
    this.hint.innerText = 'Explorer (⇧⏎ to add multiple)';

    this.currentProvider = terms => this.explorerProvider('$:/', terms);

    this.currentResolver = e => {
      var _a;

      if (this.currentSelection === 0) return;
      (_a = this.getActionFromResultDiv(this.currentResults[this.currentSelection - 1])) === null || _a === void 0 ? void 0 : _a(e);
    };

    this.onInput();
  }

  explorerProvider(url, terms) {
    let switchFolder = url => {
      this.input.value = url;
      this.lastExplorerInput = this.input.value;

      this.currentProvider = terms => this.explorerProvider(url, terms);

      this.onInput();
    };

    if (!this.input.value.startsWith(url)) {
      this.input.value = this.lastExplorerInput;
    }

    this.lastExplorerInput = this.input.value;
    this.currentSelection = 0;
    let search = this.input.value.substr(url.length); // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name '$tw'.

    let tiddlers = $tw.wiki.filterTiddlers(`[removeprefix[${url}]splitbefore[/]sort[]pinyinfuse[${search}]]`);
    let folders = [];
    let files = [];

    for (let tiddler of tiddlers) {
      if (tiddler.endsWith('/')) {
        folders.push({
          name: tiddler,
          action: e => switchFolder(`${url}${tiddler}`)
        });
      } else {
        files.push({
          name: tiddler,
          action: e => {
            this.navigateTo(`${url}${tiddler}`);

            if (!e.getModifierState('Shift')) {
              this.closePalette();
            }
          }
        });
      }
    }

    let topResult;

    if (url !== '$:/') {
      let splits = url.split('/');
      splits.splice(splits.length - 2);
      let parent = splits.join('/') + '/';
      topResult = {
        name: '..',
        action: e => switchFolder(parent)
      };
      this.showResults([topResult, ...folders, ...files]);
      return;
    }

    this.showResults([...folders, ...files]);
  }

  setSetting(name, value) {
    //doing the validation here too (it's also done in refreshSettings, so you can load you own settings with a json file)
    if (typeof value === 'string') {
      if (value === 'true') value = true;
      if (value === 'false') value = false;
    }

    this.settings[name] = value; // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name '$tw'.

    $tw.wiki.setTiddlerData(this.settingsPath, this.settings);
  } //loadSettings?


  refreshSettings() {
    //get user or default settings
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name '$tw'.
    this.settings = $tw.wiki.getTiddlerData(this.settingsPath, Object.assign({}, this.defaultSettings)); //Adding eventual missing properties to current user settings

    for (let prop in this.defaultSettings) {
      if (!this.defaultSettings.hasOwnProperty(prop)) continue;
      const ownProp = prop;

      if (this.settings[ownProp] === undefined) {
        this.settings[ownProp] = this.defaultSettings[ownProp];
      }
    } // cast all booleans from string from tw


    for (let prop in this.settings) {
      if (!this.settings.hasOwnProperty(prop)) continue;
      const ownProp = prop;
      if (typeof this.settings[ownProp] !== 'string') continue;
      if (this.settings[ownProp].toLowerCase() === 'true') this.settings[ownProp] = true;
      if (this.settings[ownProp].toLowerCase() === 'false') this.settings[ownProp] = false;
    }
  } //helper function to retrieve all tiddlers (+ their fields) with a tag
  // @ts-expect-error ts-migrate(7006) FIXME: Parameter 'tag' implicitly has an 'any' type.


  getTiddlersWithTag(tag) {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name '$tw'.
    let tiddlers = $tw.wiki.getTiddlersWithTag(tag); // @ts-expect-error ts-migrate(7006) FIXME: Parameter 't' implicitly has an 'any' type.

    return tiddlers.map(t => $tw.wiki.getTiddler(t));
  } // @ts-expect-error ts-migrate(7006) FIXME: Parameter 'parent' implicitly has an 'any' type.


  render(parent, nextSibling) {
    this.parentDomNode = parent;
    this.execute();

    if ($tw.utils.pinyinfuse === undefined) {
      throw new Error('需要安装 linonetwo/pinyin-fuzzy-search 插件以获得模糊搜索和拼音搜索的能力');
    } // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name '$tw'.


    this.history = $tw.wiki.getTiddlerData(this.commandHistoryPath, {
      history: []
    }).history; // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name '$tw'.

    $tw.rootWidget.addEventListener('open-command-palette', e => this.openPalette(e, e.param)); // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name '$tw'.

    $tw.rootWidget.addEventListener('open-command-palette-selection', e => this.openPaletteSelection(e)); // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name '$tw'.

    $tw.rootWidget.addEventListener('insert-command-palette-result', e => this.insertSelectedResult(e)); // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name '$tw'.

    $tw.rootWidget.addEventListener('command-palette-switch-history', e => this.handleSwitchHistory(e, true)); // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name '$tw'.

    $tw.rootWidget.addEventListener('command-palette-switch-history-back', e => this.handleSwitchHistory(e, false));
    let inputAndMainHintWrapper = this.createElement('div', {
      className: 'inputhintwrapper'
    });
    this.div = this.createElement('div', {
      className: 'commandpalette'
    }, {
      display: 'none'
    });
    this.mask = this.createElement('div', {
      className: 'commandpalette-masklayer'
    }, {
      opacity: '0'
    });
    this.input = this.createElement('input', {
      type: 'text'
    });
    this.hint = this.createElement('div', {
      className: 'commandpalettehint commandpalettehintmain'
    });
    inputAndMainHintWrapper.append(this.input, this.hint);
    this.scrollDiv = this.createElement('div', {
      className: 'cp-scroll'
    });
    this.div.append(inputAndMainHintWrapper, this.scrollDiv);
    this.input.addEventListener('keydown', e => this.onKeyDown(e));
    this.input.addEventListener('input', () => this.onInput(this.input.value));
    document.addEventListener('click', e => this.onClick(e));
    parent.insertBefore(this.mask, nextSibling);
    parent.insertBefore(this.div, nextSibling);
    this.refreshCommandPalette();
    this.symbolProviders['>'] = {
      searcher: terms => this.actionProvider(terms),
      resolver: e => this.actionResolver(e)
    };
    this.symbolProviders['》'] = this.symbolProviders['>'];
    this.symbolProviders['#'] = {
      searcher: terms => this.tagListProvider(terms),
      resolver: e => this.tagListResolver(e)
    };
    this.symbolProviders['@'] = {
      searcher: terms => this.tagProvider(terms),
      resolver: e => this.defaultResolver(e)
    };
    this.symbolProviders['?'] = {
      searcher: terms => this.helpProvider(terms),
      resolver: e => this.helpResolver(e)
    };
    this.symbolProviders['？'] = this.symbolProviders['?'];
    this.symbolProviders['['] = {
      searcher: (terms, hint) => this.filterProvider(terms, hint),
      resolver: e => this.filterResolver(e)
    };
    this.symbolProviders['+'] = {
      searcher: terms => this.createTiddlerProvider(terms),
      resolver: e => this.createTiddlerResolver(e)
    };
    this.symbolProviders['|'] = {
      searcher: terms => this.settingsProvider(terms),
      resolver: e => this.settingsResolver(e)
    };
    this.currentResults = [];

    this.currentProvider = () => {};
  }

  refreshSearchSteps() {
    this.searchSteps = []; // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name '$tw'.

    let steps = $tw.wiki.getTiddlerData(this.searchStepsPath);
    steps = steps.steps;

    for (let step of steps) {
      this.searchSteps.push(this.searchStepBuilder(step.filter, step.caret, step.hint));
    }
  }

  refreshCommandPalette() {
    this.refreshSettings(); // @ts-expect-error ts-migrate(2554) FIXME: Expected 1 arguments, but got 0.

    this.refreshThemes();
    this.refreshCommands();
    this.refreshSearchSteps();
  }

  handleSwitchHistory(event, forward) {
    // we have history list in palette by default, if we have showHistoryOnOpen === true
    // TODO: handle this if !showHistoryOnOpen
    if (!this.isOpened) {
      this.openPalette(event);
    }

    this.onKeyDown(new KeyboardEvent('keydown', {
      bubbles: false,
      cancelable: true,
      key: forward ? 'ArrowDown' : 'ArrowUp',
      shiftKey: false
    }));

    const onCtrlKeyUp = keyUpEvent => {
      if (!keyUpEvent.ctrlKey) {
        this.currentResolver(keyUpEvent);
        window.removeEventListener('keyup', onCtrlKeyUp);
      }
    };

    window.addEventListener('keyup', onCtrlKeyUp);
  } // @ts-expect-error ts-migrate(7006) FIXME: Parameter 'command' implicitly has an 'any' type.


  updateCommandHistory(command) {
    this.history = Array.from(new Set([command.name, ...this.history])); // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name '$tw'.

    $tw.wiki.setTiddlerData(this.commandHistoryPath, {
      history: this.history
    });
  }

  historyProviderBuilder(hint, mode) {
    return terms => {
      this.currentSelection = 0;
      this.hint.innerText = hint;
      let results;

      if (mode !== undefined && mode === 'drafts') {
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name '$tw'.
        results = $tw.wiki.filterTiddlers('[has:field[draft.of]]');
      } else if (mode !== undefined && mode === 'story') {
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name '$tw'.
        results = $tw.wiki.filterTiddlers('[list[$:/StoryList]]');
      } else {
        results = this.getHistory();
      } // @ts-expect-error ts-migrate(7006) FIXME: Parameter 'r' implicitly has an 'any' type.


      results = results.map(r => {
        return {
          name: r
        };
      });
      this.showResults(results);
    };
  } // @ts-expect-error ts-migrate(7006) FIXME: Parameter 'message' implicitly has an 'any' type.


  commandWithHistoryPicker(message, hint, mode) {
    let handler = e => {
      this.blockProviderChange = true;
      this.allowInputFieldSelection = true;
      this.currentProvider = provider;
      this.currentResolver = resolver;
      this.input.value = '';
      this.onInput(this.input.value);
    };

    let provider = this.historyProviderBuilder(hint, mode);

    let resolver = e => {
      if (this.currentSelection === 0) return;
      let title = this.getDataFromResultDiv(this.currentResults[this.currentSelection - 1], 'name');
      this.parentWidget.dispatchEvent({
        type: message,
        param: title,
        tiddlerTitle: title
      });
      this.closePalette();
    };

    return {
      handler,
      provider,
      resolver
    };
  }

  onInput(text = '') {
    if (this.blockProviderChange) {
      //prevent provider changes
      this.currentProvider(text);
      this.setSelectionToFirst();
      return;
    }

    let {
      resolver,
      provider,
      terms
    } = this.parseCommand(text);
    this.currentResolver = resolver;
    this.currentProvider = provider;
    this.currentProvider(terms);
    this.setSelectionToFirst();
  }

  parseCommand(text) {
    let terms = '';
    let prefix = text.substr(0, 1);
    let resolver;
    let provider;
    let shortcut = this.triggers.find(t => text.startsWith(t.trigger));

    if (shortcut !== undefined) {
      resolver = e => {
        let inputWithoutShortcut = this.input.value.substr(shortcut.trigger.length);
        this.invokeActionString(shortcut.text, this, e, {
          commandpaletteinput: inputWithoutShortcut
        });
        this.closePalette();
      };

      provider = terms => {
        this.hint.innerText = shortcut.hint;
        this.showResults([]);
      };
    } else {
      let providerSymbol = Object.keys(this.symbolProviders).find(p => p === prefix);

      if (providerSymbol === undefined) {
        resolver = this.defaultResolver;
        provider = this.defaultProvider;
        terms = text;
      } else {
        provider = this.symbolProviders[providerSymbol].searcher;
        resolver = this.symbolProviders[providerSymbol].resolver;
        terms = text.substring(1);
      }
    }

    return {
      resolver,
      provider,
      terms
    };
  }

  onClick(event) {
    if (this.isOpened && !this.div.contains(event.target)) {
      this.closePalette();
    }
  }

  openPaletteSelection(event) {
    let selection = this.getCurrentSelection();
    this.openPalette(event, selection);
  }

  openPalette(e, selection) {
    this.isOpened = true;
    this.allowInputFieldSelection = false;
    this.goBack = undefined;
    this.blockProviderChange = false;
    let activeElement = this.getActiveElement();
    this.previouslyFocused = {
      element: activeElement,
      start: activeElement.selectionStart,
      end: activeElement.selectionEnd,
      caretPos: activeElement.selectionEnd
    };
    this.input.value = '';

    if (selection !== undefined) {
      this.input.value = selection;
    }

    if (this.settings.alwaysPassSelection) {
      this.input.value += this.getCurrentSelection();
    }

    this.currentSelection = 0;
    this.onInput(this.input.value); //Trigger results on open

    this.div.style.display = 'flex';
    this.mask.style.opacity = '0.6';
    this.input.focus();
  }

  insertSelectedResult() {
    if (!this.isOpened) return;
    if (this.currentSelection === 0) return; //TODO: what to do here?

    let previous = this.previouslyFocused;
    let previousValue = previous.element.value;
    if (previousValue === undefined) return;
    let selection = this.getDataFromResultDiv(this.currentResults[this.currentSelection - 1], 'name'); // TODO: early return may cause bug here?

    if (!selection) return;

    if (previous.start !== previous.end) {
      this.previouslyFocused.element.value = previousValue.substring(0, previous.start) + selection + previousValue.substring(previous.end);
    } else {
      this.previouslyFocused.element.value = previousValue.substring(0, previous.start) + selection + previousValue.substring(previous.start);
    }

    this.previouslyFocused.caretPos = previous.start + selection.length;
    this.closePalette();
  }

  closePalette() {
    this.div.style.display = 'none';
    this.mask.style.opacity = '0';
    this.isOpened = false;
    this.focusAtCaretPosition(this.previouslyFocused.element, this.previouslyFocused.caretPos);
  }

  onKeyDown(e) {
    if (e.key === 'Escape') {
      //									\/ There's no previous state
      if (!this.settings.escapeGoesBack || this.goBack === undefined) {
        this.closePalette();
      } else {
        this.goBack();
        this.goBack = undefined;
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      e.stopPropagation();
      let sel = this.currentSelection - 1;

      if (sel === 0) {
        if (!this.allowInputFieldSelection) {
          sel = this.currentResults.length;
        }
      } else if (sel < 0) {
        sel = this.currentResults.length;
      }

      this.setSelection(sel);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      e.stopPropagation();
      let sel = (this.currentSelection + 1) % (this.currentResults.length + 1);

      if (!this.allowInputFieldSelection && sel === 0 && this.currentResults.length !== 0) {
        sel = 1;
      }

      this.setSelection(sel);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();
      this.validateSelection(e);
    }
  }

  addResult(result, id) {
    let resultDiv = this.createElement('div', {
      className: 'commandpaletteresult'
    });
    let titleDiv = this.createElement('div', {
      className: 'commandpalettetitle',
      innerText: result.caption || result.name
    });
    resultDiv.appendChild(titleDiv);

    if (result.hint !== undefined) {
      let hint = this.createElement('div', {
        className: 'commandpalettehint',
        innerText: result.hint
      });
      resultDiv.appendChild(hint);
    } // we will get this later


    resultDiv.dataset.result = JSON.stringify(result);
    /** we use this to pass the action */

    if (result.action) {
      resultDiv.onabort = result.action;
    }

    this.currentResults.push(resultDiv);
    resultDiv.addEventListener('click', e => {
      this.setSelection(id + 1);
      this.validateSelection(e);
    });
    this.scrollDiv.appendChild(resultDiv);
  }

  getDataFromResultDiv(resultDiv, key) {
    var _a;

    return JSON.parse((_a = resultDiv.dataset.result) !== null && _a !== void 0 ? _a : '{}')[key];
  }

  getActionFromResultDiv(resultDiv) {
    return resultDiv.onabort;
  }

  validateSelection(e) {
    this.currentResolver(e);
  }

  defaultResolver(e) {
    if (e.getModifierState('Shift')) {
      this.input.value = '+' + this.input.value; //this resolver expects that the input starts with +

      this.createTiddlerResolver(e);
      return;
    }

    if (this.currentSelection === 0) return;
    let selectionTitle = this.getDataFromResultDiv(this.currentResults[this.currentSelection - 1], 'name');
    this.closePalette();
    this.navigateTo(selectionTitle);
  } // @ts-expect-error ts-migrate(7006) FIXME: Parameter 'title' implicitly has an 'any' type.


  navigateTo(title) {
    this.parentWidget.dispatchEvent({
      type: 'tm-navigate',
      param: title,
      navigateTo: title
    });
  }

  showHistory() {
    this.hint.innerText = 'History';

    this.currentProvider = terms => {
      let results;

      if (terms.length === 0) {
        results = this.getHistory();
      } else {
        results = $tw.utils.pinyinfuse(this.getHistory(), terms, ['title']).map(item => item.item);
      }

      this.showResults(results.map(r => {
        return {
          name: r.title,
          action: () => {
            this.navigateTo(r);
            this.closePalette();
          }
        };
      }));
    };

    this.currentResolver = e => {
      if (this.currentSelection === 0) return;
      this.getActionFromResultDiv(this.currentResults[this.currentSelection - 1]);
    };

    this.input.value = '';
    this.blockProviderChange = true;
    this.onInput(this.input.value);
  }

  setSelectionToFirst() {
    let sel = 1;

    if (this.allowInputFieldSelection || this.currentResults.length === 0) {
      sel = 0;
    }

    this.setSelection(sel);
  }

  setSelection(id) {
    var _a, _b, _c, _d;

    this.currentSelection = id;

    for (let i = 0; i < this.currentResults.length; i++) {
      let selected = this.currentSelection === i + 1;
      this.currentResults[i].className = selected ? 'commandpaletteresult commandpaletteresultselected' : 'commandpaletteresult';
    }

    if (this.currentSelection === 0) {
      this.scrollDiv.scrollTop = 0;
      return;
    }

    let scrollHeight = this.scrollDiv.offsetHeight;
    let scrollPos = this.scrollDiv.scrollTop;
    let selectionPos = Number((_b = (_a = this.currentResults[this.currentSelection - 1]) === null || _a === void 0 ? void 0 : _a.offsetTop) !== null && _b !== void 0 ? _b : 0);
    let selectionHeight = Number((_d = (_c = this.currentResults[this.currentSelection - 1]) === null || _c === void 0 ? void 0 : _c.offsetHeight) !== null && _d !== void 0 ? _d : 0);

    if (selectionPos < scrollPos || selectionPos >= scrollPos + scrollHeight) {
      //select the closest scrolling position showing the selection
      let a = selectionPos;
      let b = selectionPos - scrollHeight + selectionHeight;
      a = Math.abs(a - scrollPos);
      b = Math.abs(b - scrollPos);

      if (a < b) {
        this.scrollDiv.scrollTop = selectionPos;
      } else {
        this.scrollDiv.scrollTop = selectionPos - scrollHeight + selectionHeight;
      }
    }
  }

  getHistory() {
    // TODO: what is the type here?
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name '$tw'.
    let history = $tw.wiki.getTiddlerData('$:/HistoryList');

    if (history === undefined) {
      history = [];
    } // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name '$tw'.


    history = [...history.reverse().map(x => x.title), ...$tw.wiki.filterTiddlers('[list[$:/StoryList]]')];
    return Array.from(new Set(history.filter(t => this.tiddlerOrShadowExists(t))));
  } // @ts-expect-error ts-migrate(7006) FIXME: Parameter 'title' implicitly has an 'any' type.


  tiddlerOrShadowExists(title) {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name '$tw'.
    return $tw.wiki.tiddlerExists(title) || $tw.wiki.isShadowTiddler(title);
  }

  defaultProvider(terms) {
    this.hint.innerText = 'Search tiddlers (⇧⏎ to create)';
    let searches;
    if (terms.startsWith('\\')) terms = terms.substr(1);

    if (terms.length === 0) {
      if (this.settings.showHistoryOnOpen) {
        searches = this.getHistory().map(s => {
          return {
            name: s,
            hint: '历史记录'
          };
        });
      } else {
        searches = [];
      }
    } else {
      searches = this.searchSteps.reduce((a, c) => [...a, ...c(terms)], []);
      searches = Array.from(new Set(searches));
    }

    this.showResults(searches);
  } // @ts-expect-error ts-migrate(7006) FIXME: Parameter 'filter' implicitly has an 'any' type.


  searchStepBuilder(filter, caret, hint) {
    return terms => {
      let search = filter.substr(0, caret) + terms + filter.substr(caret); // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name '$tw'.

      let results = $tw.wiki.filterTiddlers(search).map(s => {
        return {
          name: s,
          hint: hint
        };
      });
      return results;
    };
  }

  tagListProvider(terms) {
    this.currentSelection = 0;
    this.hint.innerText = 'Search tags';
    let searches;

    if (terms.length === 0) {
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name '$tw'.
      searches = $tw.wiki.filterTiddlers('[!is[system]tags[]][is[system]tags[]][all[shadows]tags[]]');
    } else {
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name '$tw'.
      searches = $tw.wiki.filterTiddlers('[all[]tags[]!is[system]pinyinfuse[' + terms + ']][all[]tags[]is[system]pinyinfuse[' + terms + ']][all[shadows]tags[]pinyinfuse[' + terms + ']]');
    } // @ts-expect-error ts-migrate(7006) FIXME: Parameter 's' implicitly has an 'any' type.


    searches = searches.map(s => {
      return {
        name: s
      };
    });
    this.showResults(searches);
  }

  tagListResolver(e) {
    if (this.currentSelection === 0) {
      let input = this.input.value.substr(1); // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name '$tw'.

      let exist = $tw.wiki.filterTiddlers('[tag[' + input + ']]');
      if (!exist) return;
      this.input.value = '@' + input;
      return;
    }

    let result = this.currentResults[this.currentSelection - 1];
    this.input.value = '@' + result.innerText;
    this.onInput(this.input.value);
  }

  tagProvider(terms) {
    this.currentSelection = 0;
    this.hint.innerText = 'Search tiddlers with @tag(s)'; // @ts-expect-error ts-migrate(7034) FIXME: Variable 'searches' implicitly has type 'any[]' in... Remove this comment to see the full error message

    let searches = [];

    if (terms.length !== 0) {
      let {
        tags,
        searchTerms,
        tagsFilter
      } = this.parseTags(this.input.value); // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name '$tw'.

      let taggedTiddlers = $tw.wiki.filterTiddlers(tagsFilter);

      if (taggedTiddlers.length !== 0) {
        if (tags.length === 1) {
          let tag = tags[0];
          let tagTiddlerExists = this.tiddlerOrShadowExists(tag);
          if (tagTiddlerExists && searchTerms.some(s => tag.includes(s))) searches.push(tag);
        }

        searches = [...searches, ...taggedTiddlers];
      }
    } // @ts-expect-error ts-migrate(7005) FIXME: Variable 'searches' implicitly has an 'any[]' type... Remove this comment to see the full error message


    searches = searches.map(s => {
      return {
        name: s
      };
    });
    this.showResults(searches);
  }

  parseTags(input) {
    let splits = input.split(' ').filter(s => s !== '');
    let tags = [];
    let searchTerms = [];

    for (let i = 0; i < splits.length; i++) {
      if (splits[i].startsWith('@')) {
        tags.push(splits[i].substr(1));
        continue;
      }

      searchTerms.push(splits[i]);
    }

    let tagsFilter = `[all[tiddlers+system+shadows]${tags.reduce((a, c) => {
      return a + 'tag[' + c + ']';
    }, '')}]`;

    if (searchTerms.length !== 0) {
      tagsFilter = tagsFilter.substr(0, tagsFilter.length - 1); //remove last ']'

      tagsFilter += `pinyinfuse[${searchTerms.join(' ')}]]`;
    }

    return {
      tags,
      searchTerms,
      tagsFilter
    };
  }

  settingsProvider(terms) {
    var _a, _b, _c;

    this.currentSelection = 0;
    this.hint.innerText = 'Select the setting you want to change';

    let isNumerical = terms => terms.length !== 0 && terms.match(/\D/gm) === null;

    let isBoolean = terms => terms.length !== 0 && terms.match(/(true\b)|(false\b)/gim) !== null;

    this.showResults([{
      name: (_c = 'Theme (currently ' + ((_b = (_a = this.settings.theme) === null || _a === void 0 ? void 0 : _a.match) === null || _b === void 0 ? void 0 : _b.call(_a, /[^\/]*$/))) !== null && _c !== void 0 ? _c : 'no ' + ')',
      action: () => this.promptForThemeSetting()
    }, this.settingResultBuilder('Max results', 'maxResults', 'Choose the maximum number of results', isNumerical, 'Error: value must be a positive integer'), this.settingResultBuilder('Show history on open', 'showHistoryOnOpen', 'Chose whether to show the history when you open the palette', isBoolean, "Error: value must be 'true' or 'false'"), this.settingResultBuilder('Escape to go back', 'escapeGoesBack', 'Chose whether ESC should go back when possible', isBoolean, "Error: value must be 'true' or 'false'"), this.settingResultBuilder('Use selection as search query', 'alwaysPassSelection', 'Chose your current selection is passed to the command palette', isBoolean, "Error: value must be 'true' or 'false'"), this.settingResultBuilder('Never Basic', 'neverBasic', 'Chose whether to override basic prompts to show filter operation', isBoolean, "Error: value must be 'true' or 'false'"), this.settingResultBuilder('Field preview max size', 'maxResultHintSize', 'Choose the maximum hint length for field preview', isNumerical, 'Error: value must be a positive integer')]);
  }

  settingResultBuilder(name, settingName, hint, validator, errorMsg) {
    return {
      name: name + ' (currently ' + this.settings[settingName] + ')',
      action: () => this.promptForSetting(settingName, hint, validator, errorMsg)
    };
  }

  settingsResolver(e) {
    var _a;

    if (this.currentSelection === 0) return;

    this.goBack = () => {
      this.input.value = '|';
      this.blockProviderChange = false;
      this.onInput(this.input.value);
    };

    (_a = this.getActionFromResultDiv(this.currentResults[this.currentSelection - 1])) === null || _a === void 0 ? void 0 : _a(e);
  }

  promptForThemeSetting() {
    this.blockProviderChange = true;
    this.allowInputFieldSelection = false;

    this.currentProvider = terms => {
      this.currentSelection = 0;
      this.hint.innerText = 'Choose a theme';
      let defaultValue = this.defaultSettings['theme'];
      let results = [{
        name: 'Revert to default value: ' + defaultValue.match(/[^\/]*$/),
        action: () => {
          this.setSetting('theme', defaultValue); // @ts-expect-error ts-migrate(2554) FIXME: Expected 1 arguments, but got 0.

          this.refreshThemes();
        }
      }];

      for (let theme of this.themes) {
        let name = theme.fields.title;
        let shortName = name.match(/[^\/]*$/);

        let action = () => {
          this.setSetting('theme', name); // @ts-expect-error ts-migrate(2554) FIXME: Expected 1 arguments, but got 0.

          this.refreshThemes();
        };

        results.push({
          name: shortName,
          action: action
        });
      }

      this.showResults(results);
    };

    this.currentResolver = e => {
      var _a;

      (_a = this.getActionFromResultDiv(this.currentResults[this.currentSelection - 1])) === null || _a === void 0 ? void 0 : _a(e);
    };

    this.input.value = '';
    this.onInput(this.input.value);
  }

  promptForSetting(settingName, hint, validator, errorMsg) {
    this.blockProviderChange = true;
    this.allowInputFieldSelection = true;

    this.currentProvider = terms => {
      this.currentSelection = 0;
      this.hint.innerText = hint;
      let defaultValue = this.defaultSettings[settingName];
      let results = [{
        name: 'Revert to default value: ' + defaultValue,
        action: () => this.setSetting(settingName, defaultValue)
      }];

      if (!validator(terms)) {
        results.push({
          name: errorMsg,
          action: () => {}
        });
      }

      this.showResults(results);
    };

    this.currentResolver = e => {
      if (this.currentSelection === 0) {
        let input = this.input.value;

        if (validator(input)) {
          this.setSetting(settingName, input);
          this.goBack = undefined;
          this.blockProviderChange = false;
          this.allowInputFieldSelection = false;
          this.promptCommand('|');
        }
      } else {
        let action = this.getActionFromResultDiv(this.currentResults[this.currentSelection - 1]);

        if (action) {
          action(e);
          this.goBack = undefined;
          this.blockProviderChange = false;
          this.allowInputFieldSelection = false;
          this.promptCommand('|');
        }
      }
    };

    this.input.value = this.settings[settingName];
    this.onInput(this.input.value);
  }

  showResults(results) {
    var _a;

    for (let cur of this.currentResults) {
      cur.remove();
    }

    this.currentResults = [];
    let resultCount = 0;

    for (let result of results) {
      this.addResult(result, resultCount);
      resultCount++;
      if (resultCount >= ((_a = this.settings.maxResults) !== null && _a !== void 0 ? _a : this.defaultSettings.maxResults)) break;
    }
  } // @ts-expect-error ts-migrate(7006) FIXME: Parameter 'message' implicitly has an 'any' type.


  tmMessageBuilder(message, params = {}) {
    return e => {
      let event = {
        type: message,
        paramObject: params,
        event: e
      };
      this.parentWidget.dispatchEvent(event);
    };
  }

  actionProvider(terms) {
    this.currentSelection = 0;
    this.hint.innerText = 'Search commands';
    let results;

    if (terms.length === 0) {
      results = this.getCommandHistory();
    } else {
      /**
       * {
              item: T;
              refIndex: number;
              score?: number | undefined;
              matches?: readonly Fuse.FuseResultMatch[] | undefined;
          }
       */
      results = $tw.utils.pinyinfuse(this.actions, terms.toLowerCase(), ['name', 'caption']).map(item => item.item);
    }

    this.showResults(results);
  }

  helpProvider(terms) {
    //TODO: tiddlerify?
    this.currentSelection = 0;
    this.hint.innerText = 'Help';
    let searches = [{
      name: '... Search',
      action: () => this.promptCommand('')
    }, {
      name: '> Commands',
      action: () => this.promptCommand('>')
    }, {
      name: '+ Create tiddler with title',
      action: () => this.promptCommand('+')
    }, {
      name: '# Search tags',
      action: () => this.promptCommand('#')
    }, {
      name: '@ List tiddlers with tag',
      action: () => this.promptCommand('@')
    }, {
      name: '[ Filter operation',
      action: () => this.promptCommand('[')
    }, {
      name: '| Command Palette Settings',
      action: () => this.promptCommand('|')
    }, {
      name: '\\ Escape first character',
      action: () => this.promptCommand('\\')
    }, {
      name: '? Help',
      action: () => this.promptCommand('?')
    }];
    this.showResults(searches);
  }

  filterProvider(terms, hint) {
    var _a;

    this.currentSelection = 0;
    this.hint.innerText = hint === undefined ? 'Filter operation' : hint;
    terms = '[' + terms; // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name '$tw'.

    let fields = $tw.wiki.filterTiddlers('[fields[]]'); // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name '$tw'.

    let results = $tw.wiki.filterTiddlers(terms).map(r => {
      return {
        name: r
      };
    }); // @ts-expect-error ts-migrate(7006) FIXME: Parameter 'i' implicitly has an 'any' type.

    let insertResult = (i, result) => results.splice(i + 1, 0, result);

    for (let i = 0; i < results.length; i++) {
      let initialResult = results[i];
      let alreadyMatched = false;
      let date = 'Invalid Date';

      if (initialResult.name.length === 17) {
        //to be sure to only match tiddly dates (17 char long)
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name '$tw'.
        date = $tw.utils.parseDate(initialResult.name).toLocaleString();
      }

      if (date !== 'Invalid Date') {
        results[i].hint = date;

        results[i].action = () => {};

        alreadyMatched = true;
      } // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name '$tw'.


      let isTag = $tw.wiki.getTiddlersWithTag(initialResult.name).length !== 0;

      if (isTag) {
        if (alreadyMatched) {
          insertResult(i, Object.assign({}, results[i]));
          i += 1;
        }

        results[i].action = () => this.promptCommand('@' + initialResult.name);

        results[i].hint = 'Tag'; //Todo more info?

        alreadyMatched = true;
      }

      let isTiddler = this.tiddlerOrShadowExists(initialResult.name);

      if (isTiddler) {
        if (alreadyMatched) {
          insertResult(i, Object.assign({}, results[i]));
          i += 1;
        }

        results[i].action = () => {
          this.navigateTo(initialResult.name);
          this.closePalette();
        };

        results[i].hint = 'Tiddler';
        alreadyMatched = true;
      }

      let isField = fields.includes(initialResult.name);

      if (isField) {
        if (alreadyMatched) {
          insertResult(i, Object.assign({}, results[i]));
          i += 1;
        }

        let parsed;

        try {
          // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name '$tw'.
          parsed = $tw.wiki.parseFilter(this.input.value);
        } catch (e) {} //The error is already displayed to the user


        let foundTitles = [];

        for (let node of parsed || []) {
          if (node.operators.length !== 2) continue;

          if (node.operators[0].operator === 'title' && node.operators[1].operator === 'fields') {
            foundTitles.push(node.operators[0].operand);
          }
        }

        let hint = 'Field';

        if (foundTitles.length === 1) {
          // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name '$tw'.
          hint = $tw.wiki.getTiddler(foundTitles[0]).fields[initialResult.name]; // @ts-expect-error ts-migrate(2358) FIXME: The left-hand side of an 'instanceof' expression m... Remove this comment to see the full error message

          if (hint instanceof Date) {
            hint = hint.toLocaleString();
          }

          hint = hint.toString().replace(/(\r\n|\n|\r)/gm, '');
          let maxSize = ((_a = this.settings.maxResultHintSize) !== null && _a !== void 0 ? _a : this.defaultSettings.maxResultHintSize) - 3;

          if (hint.length > maxSize) {
            hint = hint.substring(0, maxSize);
            hint += '...';
          }
        }

        results[i].hint = hint;

        results[i].action = () => {};

        alreadyMatched = true;
      } // let isContentType = terms.includes('content-type');

    }

    this.showResults(results);
  }

  filterResolver(e) {
    var _a;

    if (this.currentSelection === 0) return;
    (_a = this.getActionFromResultDiv(this.currentResults[this.currentSelection - 1])) === null || _a === void 0 ? void 0 : _a(e);
    e.stopPropagation();
  }

  helpResolver(e) {
    var _a;

    if (this.currentSelection === 0) return;
    (_a = this.getActionFromResultDiv(this.currentResults[this.currentSelection - 1])) === null || _a === void 0 ? void 0 : _a(e);
    e.stopPropagation();
  }

  createTiddlerProvider(terms) {
    this.currentSelection = 0;
    this.hint.innerText = 'Create new tiddler with title @tag(s)';
    this.showResults([]);
  }

  createTiddlerResolver(e) {
    let {
      tags,
      searchTerms
    } = this.parseTags(this.input.value.substr(1));
    let title = searchTerms.join(' '); // @ts-expect-error ts-migrate(2322) FIXME: Type 'string' is not assignable to type 'any[]'.

    tags = tags.join(' ');
    this.tmMessageBuilder('tm-new-tiddler', {
      title: title,
      tags: tags
    })(e);
    this.closePalette();
  }

  promptCommand(value, caret) {
    this.blockProviderChange = false;
    this.input.value = value;
    this.input.focus();

    if (caret !== undefined) {
      this.input.setSelectionRange(caret, caret);
    }

    this.onInput(this.input.value);
  }

  promptCommandBasic(value, caret, hint) {
    // TODO: I delete this.settings.neverBasic === 'true' ||  here, see if cause bug
    if (this.settings.neverBasic === true) {
      //TODO: validate settings to avoid unnecessary checks
      this.promptCommand(value, caret);
      return;
    }

    this.input.value = '';
    this.blockProviderChange = true;
    this.currentProvider = this.basicProviderBuilder(value, caret, hint);
    this.onInput(this.input.value);
  }

  basicProviderBuilder(value, caret, hint) {
    let start = value.substr(0, caret);
    let end = value.substr(caret); // @ts-expect-error ts-migrate(7006) FIXME: Parameter 'input' implicitly has an 'any' type.

    return input => {
      let {
        resolver,
        provider,
        terms
      } = this.parseCommand(start + input + end);
      let backgroundProvider = provider;
      backgroundProvider(terms, hint);
      this.currentResolver = resolver;
    };
  }

  getCommandHistory() {
    var _a; // @ts-expect-error ts-migrate(7006) FIXME: Parameter 'h' implicitly has an 'any' type.


    this.history = this.history.filter(h => this.actions.some(a => a.name === h)); //get rid of deleted command that are still in history;
    // @ts-expect-error ts-migrate(7006) FIXME: Parameter 'h' implicitly has an 'any' type.

    let results = this.history.map(h => this.actions.find(a => a.name === h));

    while (results.length <= ((_a = this.settings.maxResults) !== null && _a !== void 0 ? _a : this.defaultSettings.maxResults)) {
      let nextDefaultAction = this.actions.find(a => !results.includes(a));
      if (nextDefaultAction === undefined) break;
      results.push(nextDefaultAction);
    }

    return results;
  }

  actionResolver(e) {
    var _a;

    e.preventDefault();
    e.stopPropagation();
    if (this.currentSelection === 0) return;
    let result = this.actions.find(a => a.name === this.getDataFromResultDiv(this.currentResults[this.currentSelection - 1], 'name'));
    if (!result) return;

    if (result.keepPalette) {
      let curInput = this.input.value;

      this.goBack = () => {
        this.input.value = curInput;
        this.blockProviderChange = false;
        this.onInput(this.input.value);
      };
    }

    this.updateCommandHistory(result);
    (_a = result.action) === null || _a === void 0 ? void 0 : _a.call(result, e);

    if (result.immediate) {
      this.validateSelection(e);
      return;
    }

    if (!result.keepPalette) {
      this.closePalette();
    }
  }

  getCurrentSelection() {
    // @ts-expect-error ts-migrate(2531) FIXME: Object is possibly 'null'.
    let selection = window.getSelection().toString();
    if (selection !== '') return selection;
    let activeElement = this.getActiveElement();
    if (activeElement === undefined || activeElement.selectionStart === undefined) return '';

    if (activeElement.selectionStart > activeElement.selectionEnd) {
      return activeElement.value.substring(activeElement.selectionStart, activeElement.selectionEnd);
    } else {
      return activeElement.value.substring(activeElement.selectionEnd, activeElement.selectionStart);
    }
  } // @ts-expect-error ts-migrate(7023) FIXME: 'getActiveElement' implicitly has return type 'any... Remove this comment to see the full error message


  getActiveElement(element = document.activeElement) {
    // @ts-expect-error ts-migrate(2531) FIXME: Object is possibly 'null'.
    const shadowRoot = element.shadowRoot; // @ts-expect-error ts-migrate(2531) FIXME: Object is possibly 'null'.

    const contentDocument = element.contentDocument;

    if (shadowRoot && shadowRoot.activeElement) {
      return this.getActiveElement(shadowRoot.activeElement);
    }

    if (contentDocument && contentDocument.activeElement) {
      return this.getActiveElement(contentDocument.activeElement);
    }

    return element;
  } // @ts-expect-error ts-migrate(7006) FIXME: Parameter 'el' implicitly has an 'any' type.


  focusAtCaretPosition(el, caretPos) {
    if (el !== null) {
      el.value = el.value; // ^ this is used to not only get "focus", but
      // to make sure we don't have it everything -selected-
      // (it causes an issue in chrome, and having it doesn't hurt any other browser)

      if (el.createTextRange) {
        var range = el.createTextRange();
        range.move('character', caretPos);
        range.select();
        return true;
      } else {
        // (el.selectionStart === 0 added for Firefox bug)
        if (el.selectionStart || el.selectionStart === 0) {
          el.focus();
          el.setSelectionRange(caretPos, caretPos);
          return true;
        } else {
          // fail city, fortunately this never happens (as far as I've tested) :)
          el.focus();
          return false;
        }
      }
    }
  }

  createElement(name, proprieties, styles) {
    let el = this.document.createElement(name);

    for (let [propriety, value] of Object.entries(proprieties || {})) {
      // @ts-expect-error ts-migrate(2304) FIXME: Element implicitly has an 'any' type because expression of type 'string' can't be used to index type 'HTMLDivElement'. No index signature with a parameter of type 'string' was found on type 'HTMLDivElement'.ts(7053)
      el[propriety] = value;
    }

    for (let [style, value] of Object.entries(styles || {})) {
      el.style[style] = value;
    }

    return el;
  }
  /*
            Selectively refreshes the widget if needed. Returns true if the widget or any of its children needed re-rendering
            */


  refresh() {
    return false;
  }

}

exports.commandpalettewidget = CommandPaletteWidget;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29tbWFuZFBhbGV0dGVXaWRnZXQuanMiLCJzb3VyY2VzIjpbXSwic291cmNlc0NvbnRlbnQiOltdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIn0=
