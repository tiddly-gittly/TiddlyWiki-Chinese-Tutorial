/*\
title: $:/core/modules/editor/operations/text/excisefishing.js
type: application/javascript
module-type: texteditoroperation

Text editor operation to excise the selection to a new fishing qa tiddler.
Based on TW's core/modules/editor/operations/text/excise.js

\*/
exports['excisefishing'] = function (event, operation) {
  const editTiddler = this.wiki.getTiddler(this.editTitle);
  let editTiddlerTitle = this.editTitle;
  if (editTiddler && editTiddler.fields['draft.of']) {
    editTiddlerTitle = editTiddler.fields['draft.of'];
  }
  const currenttime = new Date(new Date().getTime()).toISOString().replace(/-|T|:|\.|Z/g, '');
  const fishtitle = event.paramObject.selectionAsAnswer === 'yes' ? (operation.selection.indexOf('^^T^^__') == -1 ? editTiddlerTitle + '/' + currenttime : operation.selection.split('^^T^^__')[0].replace('__', '')) : operation.selection.split('\n')[0];
  const fishtext = event.paramObject.selectionAsAnswer === 'yes' ? (operation.selection.indexOf('^^T^^__') == -1 ? operation.selection : operation.selection.replace('__' + fishtitle + '^^T^^__', '')) : operation.selection.replace(fishtitle, '').replace('\n', '');
  // we add current time to legacy title, so won't collide with parent title
  const title = this.wiki.generateNewTitle(fishtitle.replace(/\||\{|\}|\[|\]/g, ''));
  const text = fishtext;
  const tags = [editTiddlerTitle, '?'];
  // add due, default due in one day
  const due = new Date(new Date().getTime() + 86400000).toISOString().replace(/-|T|:|\.|Z/g, '');
  // add template
  const caption = event.paramObject.template ? '{{||' + event.paramObject.template + '}}' : editTiddlerTitle + '/' + currenttime;
  this.wiki.addTiddler(
    new $tw.Tiddler(this.wiki.getCreationFields(), this.wiki.getModificationFields(), {
      title,
      text,
      tags,
      due,
      caption,
      factor: 2.50,
      interval: 1
    })
  );

  operation.replacement = '· [[' + title + ']]\n\n<<<.tc-fish-quote\n{{' + title + '}}\n<<<\n\n';
  operation.cutStart = operation.selStart;
  operation.cutEnd = operation.selEnd;
  operation.newSelStart = operation.selStart;
  operation.newSelEnd = operation.selStart + operation.replacement.length;
};
