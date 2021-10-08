(function() {

    /*jslint node: true, browser: true */
    /*global $tw: false */
    "use strict";

    var Widget = require("$:/core/modules/widgets/widget.js").widget;

    var cmei18nWidget = function(parseTreeNode, options) {
        this.initialise(parseTreeNode, options);
    };

    /*
    Inherit from the base widget class
    */
    cmei18nWidget.prototype = new Widget();

    /*
    Render this widget into the DOM
    */
    cmei18nWidget.prototype.render = function(parent, nextSibling) {
        this.parentDomNode = parent;
        this.computeAttributes();
        this.execute();
        this.textDomNode = this.document.createTextNode(this.wiki.filterTiddlers('[cmei18n[' + this.getAttribute("id", "") + ']]')[0]);
        parent.insertBefore(this.textDomNode, nextSibling);
        this.domNodes.push(this.textDomNode);
    };

    /*
    Compute the internal state of the widget
    */
    cmei18nWidget.prototype.execute = function() {};

    /*
    Selectively refreshes the widget if needed. Returns true if the widget or any of its children needed re-rendering
    */
    cmei18nWidget.prototype.refresh = function(changedTiddlers) {
        var newMessage = this.wiki.filterTiddlers('[cmei18n[' + this.getAttribute("id", "") + ']]')[0];
        if (newMessage !== this.textDomNode.textContent) {
            this.textDomNode.textContent = newMessage;
            return true;
        } else {
            return false;
        }
    };

    exports.cmei18n = cmei18nWidget;

})();
