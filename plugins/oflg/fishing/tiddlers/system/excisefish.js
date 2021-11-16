/*\
title: $:/core/modules/editor/operations/text/excisefish.js
type: application/javascript
module-type: texteditoroperation

Text editor operation to excise the selection to a new fishing qa tiddler.
Based on TW's core/modules/editor/operations/text/excise.js

\*/
(function () {

  /*jslint node: true, browser: true */
  /*global $tw: false */
  "use strict";
  exports['excisefish'] = function (event, operation) {
    const editTiddler = this.wiki.getTiddler(this.editTitle);
    var editTiddlerTitle = this.editTitle;
    if (editTiddler && editTiddler.fields['draft.of']) {
      editTiddlerTitle = editTiddler.fields['draft.of'];
    }
    const currenttime = new Date(new Date().getTime()).toISOString().replace(/-|T|:|\.|Z/g, '');
    if (event.paramObject.exciseform === 'title<br>text') {
      var fishtitle = operation.selection.split('\n')[0];
      var fishtext = operation.selection.replace(fishtitle + '\n', '');
    } else if (event.paramObject.exciseform === 'title<br>') {
      var fishtitle = operation.selection.split('\n')[0];
      var fishtext = '';
    } else {
      // default to '__title^^T^^__text'
      var fishtitle = operation.selection.indexOf('^^T^^__') !== -1 ? operation.selection.split('^^T^^__')[0].replace('__', '') : editTiddlerTitle + '/' + currenttime;
      var fishtext = operation.selection.indexOf('^^T^^__') !== -1 ? operation.selection.replace('__' + fishtitle + '^^T^^__', '') : operation.selection;
    }
    const title = this.wiki.generateNewTitle(fishtitle.replace(/\||\{|\}|\[|\]/g, ''));
    const due = new Date(new Date().getTime() + 86400000).toISOString().replace(/-|T|:|\.|Z/g, '');
    const caption = event.paramObject.caption ? event.paramObject.caption : editTiddlerTitle + '/' + currenttime;
    if (event.paramObject.exciseto === 'newTiddler') {

      const text = fishtext;
      const tags = [editTiddlerTitle, '?'];
      // add due, default due in one day

      this.wiki.addTiddler(
        new $tw.Tiddler(this.wiki.getCreationFields(), this.wiki.getModificationFields(), {
          title,
          text,
          tags,
          due,
          caption,
          factor: editTiddler.getFieldString("factor") || 2.50,
          interval: editTiddler.getFieldString("interval") || 1
        })
      );

      if (editTiddler.type === 'text/x-markdown') {
        operation.replacement = '· [[' + title + ']]{{' + title + '}}';
      } else {
        operation.replacement = '\n· [[' + title + ']]\n\n<<<.tc-fish-quote\n{{' + title + '}}\n<<<\n\n';
      }
      operation.cutStart = operation.selStart;
      operation.cutEnd = operation.selEnd;
      operation.newSelStart = operation.selStart;
      operation.newSelEnd = operation.selStart + operation.replacement.length;
    } else {
      // default to 'currentTiddler'
      this.wiki.addTiddler(
        new $tw.Tiddler(this.wiki.getCreationFields(), editTiddler, this.wiki.getModificationFields(), {
          'draft.title': title || editTiddler.fields['draft.title'],
          tags: editTiddler.getFieldString("tags") + ' ?',
          due: editTiddler.getFieldString("due") || due,
          caption,
          factor: editTiddler.getFieldString("factor") || 2.50,
          interval: editTiddler.getFieldString("interval") || 1
        })
      );
    }

  };
})();