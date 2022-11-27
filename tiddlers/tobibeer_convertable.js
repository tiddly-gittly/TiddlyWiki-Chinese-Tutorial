/*\
title: $:/plugins/tobibeer/convertable.js
type: application/javascript
module-type: widget
created: 20160827150245119
creator: Tobias Beer
modified: 20160915191750302
modifier: Tobias Beer


A widget to convert a pasted excel or google spreadsheet to a tiddlywiki table.

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

var Widget = require("$:/core/modules/widgets/widget.js").widget;

var ConvertableWidget = function(parseTreeNode,options) {
	this.initialise(parseTreeNode,options);
};

ConvertableWidget.prototype = new Widget();

ConvertableWidget.prototype.render = function(parent,nextSibling) {
	this.parentDomNode = parent;
	this.computeAttributes();
	var textNode = this.document.createElement("textarea"),
		buttonNode = this.document.createElement("button");
	textNode.style.width = "100%";
	buttonNode.style.clear = "left";
	buttonNode.innerHTML="Convert to Wikitext";
	buttonNode.addEventListener("click",function (event) {
		textNode.value = textNode.value.replace(/^|$|\t/gm, '|');
	});
	textNode.value = this.getAttribute("text") || "";
	this.domNodes.push(textNode);
	parent.insertBefore(textNode,nextSibling);
	this.domNodes.push(buttonNode);
	parent.insertBefore(buttonNode,nextSibling);
};

ConvertableWidget.prototype.refresh = function(changedTiddlers) {
	return false;
};

exports.convertable = ConvertableWidget;

})();