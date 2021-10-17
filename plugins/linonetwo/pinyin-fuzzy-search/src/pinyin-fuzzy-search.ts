import Fuse from 'fuse.js';
import pinyin from 'pinyin';

export interface IFilterOperatorParamOperator {
  /** the name of the filter operator specified in the WikiText; */
  operator: string;
  /** the operand for the filter step (as a string; if the filter specified it in angle brackets or braces, the text reference or letiable name will have already been resolved); */
  operand: string;
  /** (optional) a string containing a single exclamation mark if the filter operator is to be negated; */
  prefix?: string;
  /** (optional) a string containing an additional filter argument (typically a tiddler field name) following the filter name (separated by a colon in the filter syntax); */
  suffix?: string;
  /** multiple suffix
   * for example, in `search:<field list>:<flag list>[<operand>]`, you will get `<field list>` as suffixes[0], and `<flag list>` as suffixes[1]
   */
  suffixes?: string[][];
  /** (optional, deprecated) used instead of `operand` if the filter operand is a regexp. */
  regexp?: string;
}

export interface IFilterOperatorOptions {
  /** The `$tw.Wiki` object; */
  wiki: Object;
  /** (optional) a widget node. */
  widget: Object;
}

/** Regex equivalent to \p{Han} in other programming languages. */
const HAN_REGEX = /[\u2E80-\u2E99\u2E9B-\u2EF3\u2F00-\u2FD5\u3005\u3007\u3021-\u3029\u3038-\u303B\u3400-\u4DB5\u4E00-\u9FD5\uF900-\uFA6D\uFA70-\uFAD9]/;

/**
 * Returns true if the `text` contains at least one Chinese characters;
 * false otherwise.
 * @param {string} text - The text to be checked for Chinese.
 * @returns {boolean}
 */
function containsChinese(text: string) {
  // Empty strings don't contain Chinese.
  if (text === null || text === undefined || text === '') {
    return false;
  }
  // Check for any match using regex; cast boolean
  return !!text.match(HAN_REGEX);
}
$tw.utils.containsChinese = containsChinese;

function translatePinyin(item: string): string {
  if (!containsChinese(item)) {
    return item;
  }
  const pinyinVersionOfItem = pinyin(item, { style: pinyin.STYLE_NORMAL }).join('');
  return `${pinyinVersionOfItem} ${item}`;
}

export function hasPinyinMatchOrFuseMatch<T extends Record<string, string>, Ks extends keyof T>(
  items: T[],
  input: string,
  keys: Ks[] = [],
  options: { threshold?: number; distance?: number; minMatchCharLength?: number; searchTiddlerByTitle?: boolean } = {},
): Fuse.FuseResult<T>[] {
  const { threshold = 0.3, distance = 60, minMatchCharLength = 1, searchTiddlerByTitle = false } = options;
  const fuse = new Fuse<T>(items, {
    getFn: (object: T, keyPath: string | string[]): string => {
      // general usage
      let value: string;
      let realKeyPath: string;
      if (Array.isArray(keyPath)) {
        realKeyPath = keyPath[0] as 'any';
      } else {
        realKeyPath = keyPath as 'any';
      }
      value = object[realKeyPath];
      // tiddler search usage, should provide { title: string } to work
      if (searchTiddlerByTitle) {
        const title = object['title'];
        const fieldName = realKeyPath;
        const tiddler = $tw.wiki.getTiddler(title).fields;
        const fieldValue = typeof tiddler[fieldName] === 'string' ? tiddler[fieldName] : String(tiddler[fieldName] ?? '');
        // parse pinyin for long text is time consuming
        // if use chinese to search chinese, no need for pinyin
        if (fieldName === 'text' || containsChinese(input)) {
          return fieldValue;
        }
        return translatePinyin(fieldValue);
      }

      return translatePinyin(value);
    },
    keys: keys as string[],
    ignoreLocation: false,
    includeScore: true,
    includeMatches: true,
    shouldSort: true,
    minMatchCharLength,
    threshold,
    distance,
  });
  const result = fuse.search(input);
  return result.reverse();
}

$tw.utils.pinyinfuse = hasPinyinMatchOrFuseMatch;

type SourceIterator = (tiddler: Object, title: string) => void;
interface ISearchOptions {
  /** an iterator function for the source tiddlers, called source(iterator), where iterator is called as iterator(tiddler,title) */
  source?: (iter: SourceIterator) => void;
  /** An array of tiddler titles to exclude from the search */
  exclude?: string[];
  /** If true returns tiddlers that do not contain the specified string */
  invert?: boolean;
  /** If true forces a case sensitive search */
  caseSensitive?: boolean;
  /** If specified, restricts the search to the specified field, or an array of field names */
  field?: string | string[];
  /** If true, forces all but regexp searches to be anchored to the start of text */
  anchored?: boolean;
  /** If true, the field options are inverted to specify the fields that are not to be searched */
  excludeField?: boolean;
  /** searches for literal string */
  literal?: boolean;
  /** same as literal except runs of whitespace are treated as a single space */
  whitespace?: boolean;
  /** (default) treats search string as a list of tokens, and matches if all tokens are found, regardless of adjacency or ordering */
  words?: boolean;
}

/**
Return an array of tiddler titles that match a search string
@param searchText The text string to search for
@param options see below

Options available:
- source: an iterator function for the source tiddlers, called source(iterator), where iterator is called as iterator(tiddler,title)
- exclude: An array of tiddler titles to exclude from the search
- invert: If true returns tiddlers that do not contain the specified string
- caseSensitive: If true forces a case sensitive search
- field: If specified, restricts the search to the specified field, or an array of field names
- anchored: If true, forces all but regexp searches to be anchored to the start of text
- excludeField: If true, the field options are inverted to specify the fields that are not to be searched

The search mode is determined by the first of these boolean flags to be true:
- literal: searches for literal string
- whitespace: same as literal except runs of whitespace are treated as a single space
- regexp: treats the search term as a regular expression
- words: (default) treats search string as a list of tokens, and matches if all tokens are found, regardless of adjacency or ordering

*/
export function fuzzySearchWiki(searchText: string, options: ISearchOptions = {}) {
  const { exclude } = options;
  // Accumulate the array of fields to be searched or excluded from the search
  let fields: string[] = [];
  if (options.field) {
    if (Array.isArray(options.field)) {
      options.field.forEach((fieldName) => {
        if (fieldName) {
          fields.push(fieldName);
        }
      });
    } else {
      fields.push(options.field);
    }
  }
  // Use default fields if none specified and we're not excluding fields (excluding fields with an empty field array is the same as searching all fields)
  if (fields.length === 0 && !options.excludeField) {
    fields.push('title');
    fields.push('tags');
    fields.push('text');
  }

  // get tiddler list to search
  let tiddlerTitlesToSearch: string[] = [];
  if (typeof options.source === 'function') {
    options.source((tiddler, title) => {
      tiddlerTitlesToSearch.push(title);
    });
  } else {
    tiddlerTitlesToSearch = $tw.wiki.getTiddlers();
  }
  // seems getFn is not working here if it searches string[] , so we have to make items { title: string } first, and turn it back later
  const results = hasPinyinMatchOrFuseMatch<any, any>(
    tiddlerTitlesToSearch.map((title) => ({ title })),
    searchText,
    fields,
    { searchTiddlerByTitle: true },
  ).map((item) => item.item.title);
  // Remove any of the results we have to exclude
  if (exclude) {
    for (let excludeIndex = 0; excludeIndex < exclude.length; excludeIndex += 1) {
      let p = results.findIndex((item) => item.includes(exclude[excludeIndex]));
      if (p !== -1) {
        results.splice(p, 1);
      }
    }
  }
  return results.map((item) => item);
}

/**
 *
 * @example [pinyinfuse]
 * @param source
 * @param operator
 * @param options
 * @returns
 */
export const pinyinfuse = (source: (iter: SourceIterator) => void, operator: IFilterOperatorParamOperator, options: IFilterOperatorOptions) => {
  const invert = operator.prefix === '!';
  if (operator.suffixes) {
    let hasFlag = function (flag: string) {
      return (operator.suffixes?.[1] ?? []).indexOf(flag) !== -1;
    };
    let excludeFields = false;
    let fieldList = operator.suffixes[0] || [];
    let firstField = fieldList[0] || '';
    let firstChar = firstField.charAt(0);
    let fields: string[];
    if (firstChar === '-') {
      fields = [firstField.slice(1)].concat(fieldList.slice(1));
      excludeFields = true;
    } else if (fieldList[0] === '*') {
      fields = [];
      excludeFields = true;
    } else {
      fields = fieldList.slice(0);
    }
    return fuzzySearchWiki(operator.operand, {
      source: source,
      invert: invert,
      field: fields,
      excludeField: excludeFields,
      caseSensitive: hasFlag('casesensitive'),
      literal: hasFlag('literal'),
      whitespace: hasFlag('whitespace'),
      anchored: hasFlag('anchored'),
      words: hasFlag('words'),
    });
  } else {
    return fuzzySearchWiki(operator.operand, {
      source: source,
      invert: invert,
    });
  }
};
