import debounce from 'lodash/debounce';

const Widget = require('$:/core/modules/widgets/widget.js').widget;

type AllPossibleEvent = PointerEvent | KeyboardEvent | MouseEvent;
export interface IResult {
  name: string;
  caption?: string;
  hint?: string;
  action?: (event: AllPossibleEvent) => void;
}
export interface IHistoryResult extends IResult {
  title: string;
}

export interface IAction extends IResult {
  keepPalette: boolean;
  immediate?: boolean;
}

export interface ITrigger extends IResult {
  trigger: string;
  text: string;
}

export interface ITiddler {
  fields: {
    text: string;
    title: string;
    tags: string[];
    // our custom fields
    'command-palette-type'?: string;
    'command-palette-name'?: string;
    'command-palette-caption'?: string;
    'command-palette-hint'?: string;
    'command-palette-mode'?: string;
    'command-palette-user-input'?: string;
    'command-palette-caret'?: string;
    'command-palette-immediate'?: string;
    'command-palette-trigger'?: string;
  };
}

export interface ISettings {
  maxResults: number;
  maxResultHintSize: number;
  neverBasic: boolean;
  showHistoryOnOpen: boolean;
  escapeGoesBack: boolean;
  alwaysPassSelection: boolean;
  theme: string;
}

export type IValidator = (term: string) => boolean;

class CommandPaletteWidget extends Widget {
  private actions: IAction[] = [];
  private triggers: ITrigger[] = [];
  private currentResults: HTMLDivElement[] = [];

  private typeField = 'command-palette-type' as const;
  /** 用于搜索的字段 */
  private nameField = 'command-palette-name' as const;
  /** 用于展示翻译内容的字段 */
  private captionField = 'command-palette-caption' as const;
  private hintField = 'command-palette-hint' as const;
  private modeField = 'command-palette-mode' as const;
  private userInputField = 'command-palette-user-input' as const;
  private caretField = 'command-palette-caret' as const;
  private immediateField = 'command-palette-immediate' as const;
  private triggerField = 'command-palette-trigger' as const;

  private currentSelection = 0; //0 is nothing selected, 1 is first result,...
  private symbolProviders: Record<string, { searcher: (term: string, hint?: string) => void; resolver: (e: AllPossibleEvent) => void }> = {};
  private blockProviderChange = false;
  private defaultSettings: ISettings = {
    maxResults: 15,
    maxResultHintSize: 45,
    neverBasic: false,
    showHistoryOnOpen: true,
    escapeGoesBack: true,
    alwaysPassSelection: true,
    theme: '$:/plugins/linonetwo/commandpalette/Compact.css',
  };
  private settings: Partial<ISettings> = {};
  private commandHistoryPath = '$:/plugins/linonetwo/commandpalette/CommandPaletteHistory' as const;
  private settingsPath = '$:/plugins/linonetwo/commandpalette/CommandPaletteSettings' as const;
  private searchStepsPath = '$:/plugins/linonetwo/commandpalette/CommandPaletteSearchSteps' as const;
  private customCommandsTag = '$:/tags/CommandPaletteCommand' as const;
  private themesTag = '$:/tags/CommandPaletteTheme' as const;

  /** current item's click/enter handler function */
  private currentResolver: (e: AllPossibleEvent) => void = () => {};
  private currentProvider: (input: string) => void = () => {};

  constructor(parseTreeNode: any, options: any) {
    super(parseTreeNode, options);
    this.initialise(parseTreeNode, options);
    this.onInput = debounce(this.onInput, 300);
  }

  actionStringBuilder(text: any) {
    return (e: any) => this.invokeActionString(text, this, e);
  }

  actionStringInput(action: any, hint: any, e: any) {
    this.blockProviderChange = true;
    this.allowInputFieldSelection = true;
    this.hint.innerText = hint;
    this.input.value = '';
    this.currentProvider = () => {};
    this.currentResolver = (e: AllPossibleEvent) => {
      this.invokeActionString(action, this, e, { commandpaletteinput: this.input.value });
      this.closePalette();
    };
    this.showResults([]);
    this.onInput(this.input.value);
  }

  invokeFieldMangler(tiddler: any, message: any, param: any, e: any) {
    let action = `<$fieldmangler tiddler="${tiddler}">
			<$action-sendmessage $message="${message}" $param="${param}"/>
			</$fieldmangler>`;
    this.invokeActionString(action, this, e);
  }

  tagOperation(
    event: AllPossibleEvent,
    hintTiddler: string,
    hintTag: string,
    /** (tiddler, terms) => [tiddlers] */
    filter: (tiddler: string, terms: string) => string[],
    allowNoSelection: boolean,
    message: string,
  ) {
    this.blockProviderChange = true;
    if (allowNoSelection) this.allowInputFieldSelection = true;
    this.currentProvider = this.historyProviderBuilder(hintTiddler);
    this.currentResolver = (e: AllPossibleEvent) => {
      if (this.currentSelection === 0) return;
      let tiddler: string | undefined = this.getDataFromResultDiv(this.currentResults[this.currentSelection - 1], 'name');
      this.currentProvider = (terms: string) => {
        this.currentSelection = 0;
        this.hint.innerText = hintTag;
        if (tiddler) {
          let searches = filter(tiddler, terms);
          this.showResults(
            searches.map((s) => {
              return { name: s };
            }),
          );
        }
      };
      this.input.value = '';
      this.onInput(this.input.value);
      this.currentResolver = (e: AllPossibleEvent) => {
        if (!allowNoSelection && this.currentSelection === 0) return;
        let tag: string | undefined = this.input.value;
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

  refreshThemes(e: AllPossibleEvent) {
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
  }

  //Re-adding an existing tag changes modification date
  // @ts-expect-error ts-migrate(7006) FIXME: Parameter 'tiddler' implicitly has an 'any' type.
  addTagIfNecessary(tiddler, tag, e) {
    if (this.hasTag(tiddler, tag)) return;
    this.invokeFieldMangler(tiddler, 'tm-add-tag', tag, e);
  }

  // @ts-expect-error ts-migrate(7006) FIXME: Parameter 'tiddler' implicitly has an 'any' type.
  hasTag(tiddler, tag) {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name '$tw'.
    return $tw.wiki.getTiddler(tiddler).fields.tags.includes(tag);
  }

  refreshCommands() {
    this.actions = [];
    this.actions.push({
      name: 'Refresh Command Palette',
      action: (e: AllPossibleEvent) => {
        this.refreshCommandPalette();
        this.promptCommand('');
      },
      keepPalette: true,
    });
    this.actions.push({ name: 'Explorer', action: (e: AllPossibleEvent) => this.explorer(e), keepPalette: true });
    this.actions.push({ name: 'History', caption: '查看历史记录', action: (e: AllPossibleEvent) => this.showHistory(), keepPalette: true });
    this.actions.push({ name: 'New Command Wizard', caption: '交互式创建新命令', action: (e: AllPossibleEvent) => this.newCommandWizard(), keepPalette: true });
    this.actions.push({
      name: 'Add tag to tiddler',
      caption: '向条目添加标签',
      action: (e) =>
        this.tagOperation(
          e,
          '选择一个条目来添加标签',
          '选择一个标签来添加 (⇧⏎ 可以多次添加)',
          (tiddler: string, terms: string): string[] =>
            // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name '$tw'.
            $tw.wiki.filterTiddlers(`[!is[system]tags[]] [is[system]tags[]] -[[${tiddler}]tags[]] +[pinyinfuse[${terms}]]`),
          true,
          'tm-add-tag',
        ),
      keepPalette: true,
    });
    this.actions.push({
      name: 'Remove tag',
      caption: '去除标签',
      action: (e) =>
        this.tagOperation(
          e,
          '选择一个条目来去除标签',
          '选择一个标签来去除 (⇧⏎ 可以去除多次)',
          // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name '$tw'.
          (tiddler: string, terms: string): string[] => $tw.wiki.filterTiddlers(`[[${tiddler}]tags[]] +[pinyinfuse[${terms}]]`),
          false,
          'tm-remove-tag',
        ),
      keepPalette: true,
    });

    let commandTiddlers = this.getTiddlersWithTag(this.customCommandsTag);
    for (let tiddler of commandTiddlers) {
      if (!tiddler.fields[this.typeField] === undefined) continue;
      let name = tiddler.fields[this.nameField];
      if (typeof name !== 'string') throw new Error(`命令菜单条目 ${tiddler.fields.title} 缺失 ${this.nameField} 字段`);
      let caption = this.translateCaption(tiddler.fields[this.captionField]);
      let type = tiddler.fields[this.typeField];
      let text = this.translateCaption(tiddler.fields.text);
      if (text === undefined) text = '';
      let textFirstLine = (text.match(/^.*/) ?? [''])[0];
      let hint = this.translateCaption(tiddler.fields[this.hintField] ?? tiddler.fields[this.nameField] ?? '');
      if (type === 'shortcut') {
        ``;
        let trigger = tiddler.fields[this.triggerField];
        if (trigger === undefined) continue;
        this.triggers.push({ name, caption, trigger, text, hint });
        continue;
      }
      if (!tiddler.fields[this.nameField] === undefined) continue;
      if (type === 'prompt') {
        let immediate = !!tiddler.fields[this.immediateField];
        let caret: number = Number(tiddler.fields[this.caretField]) ?? 0;
        let action = { name, caption, hint, action: () => this.promptCommand(textFirstLine, caret), keepPalette: !immediate, immediate: immediate };
        this.actions.push(action);
        continue;
      }
      if (type === 'prompt-basic') {
        let caret: number = Number(tiddler.fields[this.caretField]) ?? 0;
        let action = { name, caption, hint, action: () => this.promptCommandBasic(textFirstLine, caret, hint), keepPalette: true };
        this.actions.push(action);
        continue;
      }
      if (type === 'message') {
        this.actions.push({ name, caption, hint, action: (e: AllPossibleEvent) => this.tmMessageBuilder(textFirstLine)(e), keepPalette: false });
        continue;
      }
      if (type === 'actionString') {
        let userInput = tiddler.fields[this.userInputField] !== undefined && tiddler.fields[this.userInputField] === 'true';
        if (userInput) {
          this.actions.push({ name, caption, hint, action: (e: AllPossibleEvent) => this.actionStringInput(text, hint, e), keepPalette: true });
        } else {
          this.actions.push({ name, caption, hint, action: (e: AllPossibleEvent) => this.actionStringBuilder(text)(e), keepPalette: false });
        }
        continue;
      }
      if (type === 'history') {
        let mode = tiddler.fields[this.modeField];
        this.actions.push({
          name,
          caption,
          hint,
          action: (e: AllPossibleEvent) => this.commandWithHistoryPicker(textFirstLine, hint, mode).handler(e),
          keepPalette: true,
        });
        continue;
      }
    }
  }

  // @ts-expect-error ts-migrate(7006) FIXME: Parameter 'caption' implicitly has an 'any' type.
  translateCaption(caption) {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name '$tw'.
    return $tw.wiki.renderText('text/plain', 'text/vnd.tiddlywiki', caption);
  }

  newCommandWizard() {
    this.blockProviderChange = true;
    this.input.value = '';
    this.hint.innerText = '命令名';
    let name = '';
    let type = '';
    let hint = '';

    let messageStep = () => {
      this.input.value = '';
      this.hint.innerText = '输入信息';
      this.currentResolver = (e: AllPossibleEvent) => {
        this.tmMessageBuilder('tm-new-tiddler', {
          title: '$:/' + name,
          tags: this.customCommandsTag,
          [this.typeField]: type,
          [this.nameField]: name,
          [this.hintField]: hint,
          text: this.input.value,
        })(e);
        this.closePalette();
      };
    };

    let hintStep = () => {
      this.input.value = '';
      this.hint.innerText = '输入提示文本';
      this.currentResolver = (e: AllPossibleEvent) => {
        hint = this.input.value;
        messageStep();
      };
    };

    let typeStep = () => {
      this.input.value = '';
      this.hint.innerText = 'Enter type (prompt, prompt-basic, message, actionString, history)';
      this.currentResolver = (e: AllPossibleEvent) => {
        type = this.input.value;
        if (type === 'history') {
          hintStep();
        } else {
          this.tmMessageBuilder('tm-new-tiddler', {
            title: '$:/' + name,
            tags: this.customCommandsTag,
            [this.typeField]: type,
            [this.nameField]: name,
          })(e);
          this.closePalette();
        }
      };
    };

    this.currentProvider = (terms: string) => {};
    this.currentResolver = (e: AllPossibleEvent) => {
      if (this.input.value.length === 0) return;
      name = this.input.value;
      typeStep();
    };
    this.showResults([]);
  }

  explorer(e: AllPossibleEvent) {
    this.blockProviderChange = true;
    this.input.value = '$:/';
    this.lastExplorerInput = '$:/';
    this.hint.innerText = 'Explorer (⇧⏎ to add multiple)';
    this.currentProvider = (terms: string) => this.explorerProvider('$:/', terms);
    this.currentResolver = (e: AllPossibleEvent) => {
      if (this.currentSelection === 0) return;
      this.getActionFromResultDiv(this.currentResults[this.currentSelection - 1])?.(e);
    };
    this.onInput();
  }

  explorerProvider(url: string, terms: string) {
    let switchFolder = (url: string) => {
      this.input.value = url;
      this.lastExplorerInput = this.input.value;
      this.currentProvider = (terms: string) => this.explorerProvider(url, terms);
      this.onInput();
    };
    if (!this.input.value.startsWith(url)) {
      this.input.value = this.lastExplorerInput;
    }
    this.lastExplorerInput = this.input.value;
    this.currentSelection = 0;
    let search = this.input.value.substr(url.length);
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name '$tw'.
    let tiddlers = $tw.wiki.filterTiddlers(`[removeprefix[${url}]splitbefore[/]sort[]pinyinfuse[${search}]]`);
    let folders = [];
    let files = [];
    for (let tiddler of tiddlers) {
      if (tiddler.endsWith('/')) {
        folders.push({ name: tiddler, action: (e: AllPossibleEvent) => switchFolder(`${url}${tiddler}`) });
      } else {
        files.push({
          name: tiddler,
          action: (e: AllPossibleEvent) => {
            this.navigateTo(`${url}${tiddler}`);
            if (!e.getModifierState('Shift')) {
              this.closePalette();
            }
          },
        });
      }
    }
    let topResult;
    if (url !== '$:/') {
      let splits = url.split('/');
      splits.splice(splits.length - 2);
      let parent = splits.join('/') + '/';
      topResult = { name: '..', action: (e: AllPossibleEvent) => switchFolder(parent) };
      this.showResults([topResult, ...folders, ...files]);
      return;
    }
    this.showResults([...folders, ...files]);
  }

  setSetting<K extends keyof ISettings>(name: K, value: ISettings[K]) {
    //doing the validation here too (it's also done in refreshSettings, so you can load you own settings with a json file)
    if (typeof value === 'string') {
      if (value === 'true') (value as unknown as boolean) = true;
      if (value === 'false') (value as unknown as boolean) = false;
    }
    this.settings[name] = value;
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name '$tw'.
    $tw.wiki.setTiddlerData(this.settingsPath, this.settings);
  }

  //loadSettings?
  refreshSettings<K extends keyof ISettings>() {
    //get user or default settings
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name '$tw'.
    this.settings = $tw.wiki.getTiddlerData(this.settingsPath, { ...this.defaultSettings });
    //Adding eventual missing properties to current user settings
    for (let prop in this.defaultSettings) {
      if (!this.defaultSettings.hasOwnProperty(prop)) continue;
      const ownProp = prop as K;
      if (this.settings[ownProp] === undefined) {
        this.settings[ownProp] = this.defaultSettings[ownProp] as ISettings[K];
      }
    }
    // cast all booleans from string from tw
    for (let prop in this.settings) {
      if (!this.settings.hasOwnProperty(prop)) continue;
      const ownProp = prop as K;
      if (typeof this.settings[ownProp] !== 'string') continue;
      if ((this.settings[ownProp] as string).toLowerCase() === 'true') (this.settings[ownProp] as boolean) = true;
      if ((this.settings[ownProp] as string).toLowerCase() === 'false') (this.settings[ownProp] as boolean) = false;
    }
  }

  //helper function to retrieve all tiddlers (+ their fields) with a tag
  // @ts-expect-error ts-migrate(7006) FIXME: Parameter 'tag' implicitly has an 'any' type.
  getTiddlersWithTag(tag): ITiddler[] {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name '$tw'.
    let tiddlers = $tw.wiki.getTiddlersWithTag(tag);
    // @ts-expect-error ts-migrate(7006) FIXME: Parameter 't' implicitly has an 'any' type.
    return tiddlers.map((t) => $tw.wiki.getTiddler(t));
  }

  // @ts-expect-error ts-migrate(7006) FIXME: Parameter 'parent' implicitly has an 'any' type.
  render(parent, nextSibling) {
    this.parentDomNode = parent;
    this.execute();
    if ($tw.utils.pinyinfuse === undefined) {
      throw new Error('需要安装 linonetwo/pinyin-fuzzy-search 插件以获得模糊搜索和拼音搜索的能力');
    }
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name '$tw'.
    this.history = $tw.wiki.getTiddlerData(this.commandHistoryPath, { history: [] }).history;

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name '$tw'.
    $tw.rootWidget.addEventListener('open-command-palette', (e: AllPossibleEvent) => this.openPalette(e, e.param));
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name '$tw'.
    $tw.rootWidget.addEventListener('open-command-palette-selection', (e: AllPossibleEvent) => this.openPaletteSelection(e));
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name '$tw'.
    $tw.rootWidget.addEventListener('insert-command-palette-result', (e: AllPossibleEvent) => this.insertSelectedResult(e));
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name '$tw'.
    $tw.rootWidget.addEventListener('command-palette-switch-history', (e) => this.handleSwitchHistory(e, true));
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name '$tw'.
    $tw.rootWidget.addEventListener('command-palette-switch-history-back', (e) => this.handleSwitchHistory(e, false));

    let inputAndMainHintWrapper = this.createElement('div', { className: 'inputhintwrapper' });
    this.div = this.createElement('div', { className: 'commandpalette' }, { display: 'none' });
    this.mask = this.createElement('div', { className: 'commandpalette-masklayer' }, { opacity: '0' });
    this.input = this.createElement('input', { type: 'text' });
    this.hint = this.createElement('div', { className: 'commandpalettehint commandpalettehintmain' });
    inputAndMainHintWrapper.append(this.input, this.hint);
    this.scrollDiv = this.createElement('div', { className: 'cp-scroll' });
    this.div.append(inputAndMainHintWrapper, this.scrollDiv);
    this.input.addEventListener('keydown', (e: KeyboardEvent) => this.onKeyDown(e));
    this.input.addEventListener('input', () => this.onInput(this.input.value));
    document.addEventListener('click', (e: PointerEvent | MouseEvent | TouchEvent) => this.onClick(e));
    parent.insertBefore(this.mask, nextSibling);
    parent.insertBefore(this.div, nextSibling);

    this.refreshCommandPalette();

    this.symbolProviders['>'] = { searcher: (terms: string) => this.actionProvider(terms), resolver: (e) => this.actionResolver(e) };
    this.symbolProviders['》'] = this.symbolProviders['>'];
    this.symbolProviders['##'] = { searcher: (terms: string) => this.tagListProvider(terms), resolver: (e) => this.tagListResolver(e) };
    this.symbolProviders['#'] = { searcher: (terms: string) => this.tagProvider(terms), resolver: (e) => this.defaultResolver(e) };
    this.symbolProviders['?'] = { searcher: (terms: string) => this.helpProvider(terms), resolver: (e) => this.helpResolver(e) };
    this.symbolProviders['？'] = this.symbolProviders['?'];
    this.symbolProviders['['] = { searcher: (terms: string, hint?: string) => this.filterProvider(terms, hint), resolver: (e) => this.filterResolver(e) };
    this.symbolProviders['+'] = { searcher: (terms: string) => this.createTiddlerProvider(terms), resolver: (e) => this.createTiddlerResolver(e) };
    this.symbolProviders['|'] = { searcher: (terms: string) => this.settingsProvider(terms), resolver: (e) => this.settingsResolver(e) };
    this.currentResults = [];
    this.currentProvider = () => {};
  }

  helpProvider(terms: string) {
    //TODO: tiddlerify?
    this.currentSelection = 0;
    this.hint.innerText = 'Help';
    let searches = [
      { name: '直接打字是搜索条目标题和内容；而以下述特殊字符开头可以执行特殊搜索', action: () => this.promptCommand('') },
      { name: '> 查看和搜索命令列表', action: () => this.promptCommand('>') },
      { name: '+ 创建条目，先输入条目名，然后可以带上#打标签', action: () => this.promptCommand('+') },
      { name: '# 列出带标签的条目（标签不可包含空格，用空格隔开多个#开头的标签，不带#的作为搜索词）', action: () => this.promptCommand('#') },
      { name: '## 搜索标签列表', action: () => this.promptCommand('##', 2) },
      { name: '[ 筛选器语句', action: () => this.promptCommand('[') },
      { name: '| 命令菜单设置', action: () => this.promptCommand('|') },
      { name: '\\ 规避第一个字符是上述命令字符的情况，例如「\\#」可搜标题以「#」起头的条目', action: () => this.promptCommand('\\') },
      { name: '? 打开帮助', action: () => this.promptCommand('?') },
    ];
    this.showResults(searches);
  }

  /**
   * 解析输入，默认前两位可能是命令字符，会到 this.symbolProviders 里查找相应的 provider
   */
  parseCommand(text: string) {
    let terms = '';
    let resolver;
    let provider;
    let shortcut = this.triggers.find((t) => text.startsWith(t.trigger));
    if (shortcut !== undefined) {
      resolver = (e: AllPossibleEvent) => {
        let inputWithoutShortcut = this.input.value.substr(shortcut!.trigger.length);
        this.invokeActionString(shortcut!.text, this, e, { commandpaletteinput: inputWithoutShortcut });
        this.closePalette();
      };
      provider = (terms: string) => {
        this.hint.innerText = shortcut!.hint;
        this.showResults([]);
      };
    } else {
      // 从上到下找，先找长的，再找短的，以便 ## 优先匹配 ## 而不是 #
      let providerSymbol = Object.keys(this.symbolProviders)
        .sort((a, b) => -a.length + b.length)
        .find((symbol) => text.startsWith(symbol));
      if (providerSymbol === undefined) {
        resolver = this.defaultResolver;
        provider = this.defaultProvider;
        terms = text;
      } else {
        provider = this.symbolProviders[providerSymbol].searcher;
        resolver = this.symbolProviders[providerSymbol].resolver;
        terms = text.replace(providerSymbol, '');
      }
    }
    return { resolver, provider, terms };
  }

  refreshSearchSteps() {
    this.searchSteps = [];
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name '$tw'.
    let steps = $tw.wiki.getTiddlerData(this.searchStepsPath);
    steps = steps.steps;
    for (let step of steps) {
      this.searchSteps.push(this.searchStepBuilder(step.filter, step.caret, step.hint));
    }
  }

  refreshCommandPalette() {
    this.refreshSettings();
    // @ts-expect-error ts-migrate(2554) FIXME: Expected 1 arguments, but got 0.
    this.refreshThemes();
    this.refreshCommands();
    this.refreshSearchSteps();
  }

  handleSwitchHistory(event: KeyboardEvent, forward: boolean) {
    // we have history list in palette by default, if we have showHistoryOnOpen === true
    // TODO: handle this if !showHistoryOnOpen
    if (!this.isOpened) {
      this.openPalette(event);
    }

    this.onKeyDown(
      new KeyboardEvent('keydown', {
        bubbles: false,
        cancelable: true,
        key: forward ? 'ArrowDown' : 'ArrowUp',
        shiftKey: false,
      }),
    );

    const onCtrlKeyUp = (keyUpEvent: KeyboardEvent) => {
      if (!keyUpEvent.ctrlKey) {
        this.currentResolver(keyUpEvent);
        window.removeEventListener('keyup', onCtrlKeyUp);
      }
    };

    window.addEventListener('keyup', onCtrlKeyUp);
  }

  // @ts-expect-error ts-migrate(7006) FIXME: Parameter 'command' implicitly has an 'any' type.
  updateCommandHistory(command) {
    this.history = Array.from(new Set([command.name, ...this.history]));
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name '$tw'.
    $tw.wiki.setTiddlerData(this.commandHistoryPath, { history: this.history });
  }

  historyProviderBuilder(hint: string, mode?: 'drafts' | 'story') {
    return (terms: string) => {
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
      }
      // @ts-expect-error ts-migrate(7006) FIXME: Parameter 'r' implicitly has an 'any' type.
      results = results.map((r) => {
        return { name: r };
      });
      this.showResults(results);
    };
  }

  // @ts-expect-error ts-migrate(7006) FIXME: Parameter 'message' implicitly has an 'any' type.
  commandWithHistoryPicker(message, hint, mode) {
    let handler = (e: AllPossibleEvent) => {
      this.blockProviderChange = true;
      this.allowInputFieldSelection = true;
      this.currentProvider = provider;
      this.currentResolver = resolver;
      this.input.value = '';
      this.onInput(this.input.value);
    };
    let provider = this.historyProviderBuilder(hint, mode);
    let resolver = (e: AllPossibleEvent) => {
      if (this.currentSelection === 0) return;
      let title = this.getDataFromResultDiv(this.currentResults[this.currentSelection - 1], 'name');
      this.parentWidget.dispatchEvent({
        type: message,
        param: title,
        tiddlerTitle: title,
      });
      this.closePalette();
    };
    return {
      handler,
      provider,
      resolver,
    };
  }

  onInput(text: string = '') {
    if (this.blockProviderChange) {
      //prevent provider changes
      this.currentProvider(text);
      this.setSelectionToFirst();
      return;
    }
    let { resolver, provider, terms } = this.parseCommand(text);
    this.currentResolver = resolver;
    this.currentProvider = provider;
    this.currentProvider(terms);
    this.setSelectionToFirst();
  }

  onClick(event: MouseEvent | PointerEvent | TouchEvent) {
    if (this.isOpened && !this.div.contains(event.target)) {
      this.closePalette();
    }
  }

  openPaletteSelection(event: AllPossibleEvent) {
    let selection = this.getCurrentSelection();
    this.openPalette(event, selection);
  }
  openPalette(e: AllPossibleEvent, selection?: string) {
    this.isOpened = true;
    this.allowInputFieldSelection = false;
    this.goBack = undefined;
    this.blockProviderChange = false;
    let activeElement = this.getActiveElement();
    this.previouslyFocused = {
      element: activeElement,
      start: activeElement.selectionStart,
      end: activeElement.selectionEnd,
      caretPos: activeElement.selectionEnd,
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
    let selection = this.getDataFromResultDiv(this.currentResults[this.currentSelection - 1], 'name');
    // TODO: early return may cause bug here?
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

  onKeyDown(e: KeyboardEvent) {
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

  addResult(result: IResult, id: number) {
    let resultDiv = this.createElement('div', { className: 'commandpaletteresult' });
    let titleDiv = this.createElement('div', { className: 'commandpalettetitle', innerText: result.caption || result.name });
    resultDiv.appendChild(titleDiv);
    if (result.hint !== undefined) {
      let hint = this.createElement('div', { className: 'commandpalettehint', innerText: result.hint });
      resultDiv.appendChild(hint);
    }
    // we will get this later
    resultDiv.dataset.result = JSON.stringify(result);
    /** we use this to pass the action */
    if (result.action) {
      resultDiv.onabort = result.action as unknown as (this: GlobalEventHandlers, ev: UIEvent) => any;
    }
    this.currentResults.push(resultDiv);
    resultDiv.addEventListener('click', (e) => {
      this.setSelection(id + 1);
      this.validateSelection(e);
    });
    this.scrollDiv.appendChild(resultDiv);
  }

  private getDataFromResultDiv<K extends keyof IResult>(resultDiv: HTMLDivElement, key: K): IResult[K] | undefined {
    return JSON.parse(resultDiv.dataset.result ?? '{}')[key];
  }
  private getActionFromResultDiv(resultDiv: HTMLDivElement): IResult['action'] | undefined {
    return resultDiv.onabort as unknown as IResult['action'];
  }

  validateSelection(e: AllPossibleEvent) {
    this.currentResolver(e);
  }

  defaultResolver(e: AllPossibleEvent) {
    if (e.getModifierState('Shift')) {
      this.input.value = '+' + this.input.value; //this resolver expects that the input starts with +
      this.createTiddlerResolver(e);
      return;
    }
    if (this.currentSelection === 0) return;
    let selectionTitle = this.getDataFromResultDiv(this.currentResults[this.currentSelection - 1], 'name');
    this.closePalette();
    this.navigateTo(selectionTitle);
  }

  /**
   * 调用 tm-navigate 跳转到标题对应的条目处
   */
  navigateTo(title?: string) {
    if (title) {
      this.parentWidget.dispatchEvent({
        type: 'tm-navigate',
        param: title,
        navigateTo: title,
      });
    }
  }

  showHistory() {
    this.hint.innerText = '历史记录';
    this.currentProvider = (terms: string) => {
      let results: string[];
      if (terms.length === 0) {
        results = this.getHistory();
      } else {
        results = $tw.utils.pinyinfuse(this.getHistory(), terms).map((item: { item: string }) => item.item);
      }
      this.showResults(
        results.map((title) => {
          return {
            name: title,
            action: () => {
              this.navigateTo(title);
              this.closePalette();
            },
          };
        }),
      );
    };

    this.currentResolver = (e: AllPossibleEvent) => {
      if (this.currentSelection === 0) return;
      this.getActionFromResultDiv(this.currentResults[this.currentSelection - 1])?.(e);
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

  setSelection(id: number) {
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
    let selectionPos = Number(this.currentResults[this.currentSelection - 1]?.offsetTop ?? 0);
    let selectionHeight = Number(this.currentResults[this.currentSelection - 1]?.offsetHeight ?? 0);

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

  getHistory(): string[] {
    // TODO: what is the type here?
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name '$tw'.
    let history: string[] | undefined = $tw.wiki.getTiddlerData('$:/HistoryList');
    if (history === undefined) {
      history = [];
    }
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name '$tw'.
    history = [...history.reverse().map((x) => x.title), ...$tw.wiki.filterTiddlers('[list[$:/StoryList]]')];
    return Array.from(new Set(history.filter((t) => this.tiddlerOrShadowExists(t))));
  }

  // @ts-expect-error ts-migrate(7006) FIXME: Parameter 'title' implicitly has an 'any' type.
  tiddlerOrShadowExists(title) {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name '$tw'.
    return $tw.wiki.tiddlerExists(title) || $tw.wiki.isShadowTiddler(title);
  }

  defaultProvider(terms: string) {
    this.hint.innerText = '⏎搜索条目（⇧⏎ 创建条目）（？问号查看帮助）';
    let searches: IResult[];
    if (terms.startsWith('\\')) terms = terms.substr(1);
    if (terms.length === 0) {
      if (this.settings.showHistoryOnOpen) {
        searches = this.getHistory().map((s) => {
          return { name: s, hint: '历史记录' };
        });
      } else {
        searches = [];
      }
    } else {
      searches = this.searchSteps.reduce((a, c) => [...a, ...c(terms)], []);
      searches = Array.from(new Set(searches));
    }
    this.showResults(searches);
  }

  // @ts-expect-error ts-migrate(7006) FIXME: Parameter 'filter' implicitly has an 'any' type.
  searchStepBuilder(filter, caret, hint) {
    return (terms: string) => {
      let search = filter.substr(0, caret) + terms + filter.substr(caret);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name '$tw'.
      let results = $tw.wiki.filterTiddlers(search).map((s) => {
        return { name: s, hint: hint };
      });
      return results;
    };
  }

  tagListProvider(terms: string) {
    this.currentSelection = 0;
    this.hint.innerText = '搜索标签列表';
    let searches;
    if (terms.length === 0) {
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name '$tw'.
      searches = $tw.wiki.filterTiddlers('[!is[system]tags[]][is[system]tags[]][all[shadows]tags[]]');
    } else {
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name '$tw'.
      searches = $tw.wiki.filterTiddlers(
        '[all[]tags[]!is[system]pinyinfuse[' + terms + ']][all[]tags[]is[system]pinyinfuse[' + terms + ']][all[shadows]tags[]pinyinfuse[' + terms + ']]',
      );
    }
    // @ts-expect-error ts-migrate(7006) FIXME: Parameter 's' implicitly has an 'any' type.
    searches = searches.map((s) => {
      return { name: s };
    });
    this.showResults(searches);
  }

  tagListResolver(e: AllPossibleEvent) {
    if (this.currentSelection === 0) {
      let input = (this.input.value as string).substring(2);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name '$tw'.
      let exist = $tw.wiki.filterTiddlers('[tag[' + input + ']]');
      if (!exist) return;
      this.input.value = '##' + input;
      return;
    }
    let result = this.currentResults[this.currentSelection - 1];
    this.input.value = '##' + result.innerText;
    this.onInput(this.input.value);
  }

  tagProvider(terms: string) {
    this.currentSelection = 0;
    this.hint.innerText = '用「#标签 #标签2」搜索条目';
    let tiddlerNameSearchResults: string[] = [];
    if (terms.length !== 0) {
      let { tags, searchTerms, tagsFilter } = this.parseTags(this.input.value);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name '$tw'.
      let taggedTiddlers: string[] = $tw.wiki.filterTiddlers(tagsFilter);

      if (taggedTiddlers.length !== 0) {
        if (tags.length === 1) {
          let tag = tags[0];
          let tagTiddlerExists = this.tiddlerOrShadowExists(tag);
          if (tagTiddlerExists && searchTerms.some((s) => tag.includes(s))) tiddlerNameSearchResults.push(tag);
        }
        tiddlerNameSearchResults = [...tiddlerNameSearchResults, ...taggedTiddlers];
      }
    }
    this.showResults(
      tiddlerNameSearchResults.map((tiddlerName) => {
        return { name: tiddlerName };
      }),
    );
  }

  /**
   * @param input `'#aaa 1 #bbb#ccc'` => `['aaa', 'bbb#ccc']` and search `1`
   */
  parseTags(input: string) {
    let splits = input.split(' ').filter((s) => s !== '');
    let tags = [];
    let searchTerms = [];
    for (let i = 0; i < splits.length; i++) {
      // 空格分隔的结果可以以 # 开头，表示标签
      if (splits[i].startsWith('#')) {
        tags.push(splits[i].substr(1));
        continue;
      }
      // 也可以不带 # ，表示搜索词
      searchTerms.push(splits[i]);
    }
    let tagsFilter = `[all[tiddlers+system+shadows]${tags.reduce((a, c) => {
      return a + 'tag[' + c + ']';
    }, '')}]`;
    if (searchTerms.length !== 0) {
      tagsFilter = tagsFilter.substr(0, tagsFilter.length - 1); //remove last ']'
      tagsFilter += `pinyinfuse[${searchTerms.join(' ')}]]`;
    }
    return { tags, searchTerms, tagsFilter };
  }

  settingsProvider(terms: string) {
    this.currentSelection = 0;
    this.hint.innerText = 'Select the setting you want to change';
    let isNumerical: IValidator = (terms: string) => terms.length !== 0 && terms.match(/\D/gm) === null;
    let isBoolean: IValidator = (terms: string) => terms.length !== 0 && terms.match(/(true\b)|(false\b)/gim) !== null;
    this.showResults([
      { name: 'Theme (currently ' + this.settings.theme?.match?.(/[^\/]*$/) ?? 'no ' + ')', action: () => this.promptForThemeSetting() },
      this.settingResultBuilder('Max results', 'maxResults', 'Choose the maximum number of results', isNumerical, 'Error: value must be a positive integer'),
      this.settingResultBuilder(
        'Show history on open',
        'showHistoryOnOpen',
        'Chose whether to show the history when you open the palette',
        isBoolean,
        "Error: value must be 'true' or 'false'",
      ),
      this.settingResultBuilder(
        'Escape to go back',
        'escapeGoesBack',
        'Chose whether ESC should go back when possible',
        isBoolean,
        "Error: value must be 'true' or 'false'",
      ),
      this.settingResultBuilder(
        'Use selection as search query',
        'alwaysPassSelection',
        'Chose your current selection is passed to the command palette',
        isBoolean,
        "Error: value must be 'true' or 'false'",
      ),
      this.settingResultBuilder(
        'Never Basic',
        'neverBasic',
        'Chose whether to override basic prompts to show filter operation',
        isBoolean,
        "Error: value must be 'true' or 'false'",
      ),
      this.settingResultBuilder(
        'Field preview max size',
        'maxResultHintSize',
        'Choose the maximum hint length for field preview',
        isNumerical,
        'Error: value must be a positive integer',
      ),
    ]);
  }

  settingResultBuilder<K extends keyof ISettings>(name: string, settingName: K, hint: string, validator: IValidator, errorMsg: string) {
    return { name: name + ' (currently ' + this.settings[settingName] + ')', action: () => this.promptForSetting(settingName, hint, validator, errorMsg) };
  }

  settingsResolver(e: AllPossibleEvent) {
    if (this.currentSelection === 0) return;
    this.goBack = () => {
      this.input.value = '|';
      this.blockProviderChange = false;
      this.onInput(this.input.value);
    };
    this.getActionFromResultDiv(this.currentResults[this.currentSelection - 1])?.(e);
  }

  promptForThemeSetting() {
    this.blockProviderChange = true;
    this.allowInputFieldSelection = false;
    this.currentProvider = (terms: string) => {
      this.currentSelection = 0;
      this.hint.innerText = '选择一个主题';
      let defaultValue = this.defaultSettings['theme'];
      let results = [
        {
          name: '恢复默认值: ' + defaultValue.match(/[^\/]*$/),
          action: () => {
            this.setSetting('theme', defaultValue);
            // @ts-expect-error ts-migrate(2554) FIXME: Expected 1 arguments, but got 0.
            this.refreshThemes();
          },
        },
      ];
      for (let theme of this.themes) {
        let name = theme.fields.title;
        let shortName = name.match(/[^\/]*$/);
        let action = () => {
          this.setSetting('theme', name);
          // @ts-expect-error ts-migrate(2554) FIXME: Expected 1 arguments, but got 0.
          this.refreshThemes();
        };
        results.push({ name: shortName, action: action });
      }
      this.showResults(results);
    };
    this.currentResolver = (e: AllPossibleEvent) => {
      this.getActionFromResultDiv(this.currentResults[this.currentSelection - 1])?.(e);
    };
    this.input.value = '';
    this.onInput(this.input.value);
  }

  promptForSetting<K extends keyof ISettings>(settingName: K, hint: string, validator: IValidator, errorMsg: string) {
    this.blockProviderChange = true;
    this.allowInputFieldSelection = true;
    this.currentProvider = (terms: string) => {
      this.currentSelection = 0;
      this.hint.innerText = hint;
      let defaultValue = this.defaultSettings[settingName];
      let results = [{ name: 'Revert to default value: ' + defaultValue, action: () => this.setSetting(settingName, defaultValue) }];
      if (!validator(terms)) {
        results.push({ name: errorMsg, action: () => {} });
      }
      this.showResults(results);
    };
    this.currentResolver = (e: AllPossibleEvent) => {
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

  showResults(results: IResult[]) {
    for (let cur of this.currentResults) {
      cur.remove();
    }
    this.currentResults = [];
    let resultCount = 0;
    for (let result of results) {
      this.addResult(result, resultCount);
      resultCount++;
      if (resultCount >= (this.settings.maxResults ?? this.defaultSettings.maxResults)) break;
    }
  }

  // @ts-expect-error ts-migrate(7006) FIXME: Parameter 'message' implicitly has an 'any' type.
  tmMessageBuilder(message, params = {}) {
    return (e: AllPossibleEvent) => {
      let event = {
        type: message,
        paramObject: params,
        event: e,
      };
      this.parentWidget.dispatchEvent(event);
    };
  }
  actionProvider(terms: string) {
    this.currentSelection = 0;
    this.hint.innerText = '查看和搜索命令列表';
    let results: IResult[];
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
      results = $tw.utils.pinyinfuse(this.actions, terms.toLowerCase(), ['name', 'caption']).map((item) => item.item);
    }
    this.showResults(results);
  }

  filterProvider(terms: string, hint?: string) {
    this.currentSelection = 0;
    this.hint.innerText = hint === undefined ? '筛选器语句' : hint;
    terms = '[' + terms;
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name '$tw'.
    let fields = $tw.wiki.filterTiddlers('[fields[]]');
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name '$tw'.
    let results = $tw.wiki.filterTiddlers(terms).map((r) => {
      return { name: r };
    });
    // @ts-expect-error ts-migrate(7006) FIXME: Parameter 'i' implicitly has an 'any' type.
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
      }
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name '$tw'.
      let isTag = $tw.wiki.getTiddlersWithTag(initialResult.name).length !== 0;
      if (isTag) {
        if (alreadyMatched) {
          insertResult(i, { ...results[i] });
          i += 1;
        }
        results[i].action = () => this.promptCommand('#' + initialResult.name);
        results[i].hint = 'Tag'; //Todo more info?
        alreadyMatched = true;
      }
      let isTiddler = this.tiddlerOrShadowExists(initialResult.name);
      if (isTiddler) {
        if (alreadyMatched) {
          insertResult(i, { ...results[i] });
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
          insertResult(i, { ...results[i] });
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
          hint = $tw.wiki.getTiddler(foundTitles[0]).fields[initialResult.name];
          // @ts-expect-error ts-migrate(2358) FIXME: The left-hand side of an 'instanceof' expression m... Remove this comment to see the full error message
          if (hint instanceof Date) {
            hint = hint.toLocaleString();
          }
          hint = hint.toString().replace(/(\r\n|\n|\r)/gm, '');
          let maxSize = (this.settings.maxResultHintSize ?? this.defaultSettings.maxResultHintSize) - 3;
          if (hint.length > maxSize) {
            hint = hint.substring(0, maxSize);
            hint += '...';
          }
        }
        results[i].hint = hint;
        results[i].action = () => {};
        alreadyMatched = true;
      }
      // let isContentType = terms.includes('content-type');
    }
    this.showResults(results);
  }

  filterResolver(e: AllPossibleEvent) {
    if (this.currentSelection === 0) return;
    this.getActionFromResultDiv(this.currentResults[this.currentSelection - 1])?.(e);
    e.stopPropagation();
  }

  helpResolver(e: AllPossibleEvent) {
    if (this.currentSelection === 0) return;
    this.getActionFromResultDiv(this.currentResults[this.currentSelection - 1])?.(e);
    e.stopPropagation();
  }

  createTiddlerProvider(terms: string) {
    this.currentSelection = 0;
    this.hint.innerText = '创建条目，空格隔开可以用#打多个标签';
    this.showResults([]);
  }

  createTiddlerResolver(e: AllPossibleEvent) {
    let { tags, searchTerms } = this.parseTags(this.input.value.substring(1));
    let title = searchTerms.join(' ');
    // @ts-expect-error ts-migrate(2322) FIXME: Type 'string' is not assignable to type 'any[]'.
    tags = tags.join(' ');
    this.tmMessageBuilder('tm-new-tiddler', { title: title, tags: tags })(e);
    this.closePalette();
  }

  promptCommand(value: string, caret?: number) {
    this.blockProviderChange = false;
    this.input.value = value;
    this.input.focus();
    if (caret !== undefined) {
      this.input.setSelectionRange(caret, caret);
    }
    this.onInput(this.input.value);
  }

  promptCommandBasic(value: string, caret: number, hint: string) {
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

  basicProviderBuilder(value: string, caret: number, hint: string) {
    let start = value.substr(0, caret);
    let end = value.substr(caret);
    // @ts-expect-error ts-migrate(7006) FIXME: Parameter 'input' implicitly has an 'any' type.
    return (input) => {
      let { resolver, provider, terms } = this.parseCommand(start + input + end);
      let backgroundProvider = provider;
      backgroundProvider(terms, hint);
      this.currentResolver = resolver;
    };
  }

  getCommandHistory() {
    // @ts-expect-error ts-migrate(7006) FIXME: Parameter 'h' implicitly has an 'any' type.
    this.history = this.history.filter((h) => this.actions.some((a) => a.name === h)); //get rid of deleted command that are still in history;
    // @ts-expect-error ts-migrate(7006) FIXME: Parameter 'h' implicitly has an 'any' type.
    let results = this.history.map((h) => this.actions.find((a) => a.name === h));
    while (results.length <= (this.settings.maxResults ?? this.defaultSettings.maxResults)) {
      let nextDefaultAction = this.actions.find((a) => !results.includes(a));
      if (nextDefaultAction === undefined) break;
      results.push(nextDefaultAction);
    }
    return results;
  }

  actionResolver(e: AllPossibleEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (this.currentSelection === 0) return;
    let result = this.actions.find((a) => a.name === this.getDataFromResultDiv(this.currentResults[this.currentSelection - 1], 'name'));
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
    result.action?.(e);
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
  }
  // @ts-expect-error ts-migrate(7023) FIXME: 'getActiveElement' implicitly has return type 'any... Remove this comment to see the full error message
  getActiveElement(element = document.activeElement) {
    // @ts-expect-error ts-migrate(2531) FIXME: Object is possibly 'null'.
    const shadowRoot = element.shadowRoot;
    // @ts-expect-error ts-migrate(2531) FIXME: Object is possibly 'null'.
    const contentDocument = element.contentDocument;

    if (shadowRoot && shadowRoot.activeElement) {
      return this.getActiveElement(shadowRoot.activeElement);
    }

    if (contentDocument && contentDocument.activeElement) {
      return this.getActiveElement(contentDocument.activeElement);
    }

    return element;
  }
  // @ts-expect-error ts-migrate(7006) FIXME: Parameter 'el' implicitly has an 'any' type.
  focusAtCaretPosition(el, caretPos) {
    if (el !== null) {
      el.value = el.value;
      // ^ this is used to not only get "focus", but
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

  createElement<E extends keyof HTMLElementTagNameMap>(name: E, proprieties: any, styles?: Partial<CSSStyleDeclaration>): HTMLDivElement {
    document.createElement;
    let el = this.document.createElement(name) as HTMLDivElement;
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
