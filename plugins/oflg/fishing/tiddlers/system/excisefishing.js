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
  // we add current time to legacy title, so won't collide with parent title
  const currentTime = new Date(new Date().getTime()).toISOString().replace(/-|T|:|\.|Z/g, '');

  const fishtag = event.paramObject.fishtag || '?';
  const fishfactor = event.paramObject.fishfactor || '2.50';
  const fishinterval = event.paramObject.fishtag || '1';
  // add due, default due in one day
  const fishdue = new Date(new Date().getTime() + Number(fishinterval) * 86400000).toISOString().replace(/-|T|:|\.|Z/g, '');
  const fishtitle = this.wiki.generateNewTitle(operation.selection);
  const fishtext = event.paramObject.selectionAsAnswer === 'yes' ? operation.selection : '';
  // add template
  const fishcaption = event.paramObject.template
    ? `{{||${event.paramObject.template}}}`
    : event.paramObject.randomCaption
      ? `${editTiddlerTitle}/${currentTime}`
      : '';
  this.wiki.addTiddler(
    new $tw.Tiddler(this.wiki.getCreationFields(), this.wiki.getModificationFields(), {
      title: fishtitle,
      text: fishtext,
      tags: event.paramObject.tagnew === 'yes' ? [editTiddlerTitle, fishtag] : [fishtag],
      due: fishdue,
      factor: fishfactor,
      interval: fishinterval,
      caption: fishcaption,
    })
  );
  // "?" is the default fishing macro
  const fishingprefix = event.paramObject.macro === '?' ? ' ﷼' : '';
  operation.replacement = `${fishingprefix}[[${fishtitle}]]`;
  if (event.paramObject.cut === 'yes') {
    operation.cutStart = operation.selStart;
    operation.cutEnd = operation.selEnd;
    operation.newSelStart = operation.selStart;
    operation.newSelEnd = operation.selStart + operation.replacement.length;
  } else {
    // don't need to delete original texts
    operation.cutStart = operation.selEnd;
    operation.cutEnd = operation.selEnd;
    operation.newSelStart = operation.selStart + operation.replacement.length;
    operation.newSelEnd = operation.selStart + operation.replacement.length;
  }
};
