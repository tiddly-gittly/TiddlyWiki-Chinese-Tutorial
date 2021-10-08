(function() {
    "use strict";

    exports.cmei18n = function(source, operator, options) {
        var splitOptions = {};
        operator.operand.split('+').forEach(option => {
            splitOptions[option] = true;
        })
        var results = [];
        source(function(tiddler, title) {
            var section = [];
            title.split('\n').forEach(line => {
                var newSection = false;

                if ((splitOptions.all || splitOptions.h1) && /^!(\.[\w\-]+)?\s+[^\n]+$/.test(line)) {
                    newSection = true;
                } else if ((splitOptions.all || splitOptions.h2) && /^!!(\.[\w\-]+)?\s+[^\n]+$/.test(line)) {
                    newSection = true;
                } else if ((splitOptions.all || splitOptions.h3) && /^!!!(\.[\w\-]+)?\s+[^\n]+$/.test(line)) {
                    newSection = true;
                } else if ((splitOptions.all || splitOptions.h4) && /^!!!!(\.[\w\-]+)?\s+[^\n]+$/.test(line)) {
                    newSection = true;
                } else if ((splitOptions.all || splitOptions.h5) && /^!!!!!(\.[\w\-]+)?\s+[^\n]+$/.test(line)) {
                    newSection = true;
                } else if ((splitOptions.all || splitOptions.h6) && /^!!!!!!(\.[\w\-]+)?\s+[^\n]+$/.test(line)) {
                    newSection = true;
                } else if ((splitOptions.all || splitOptions.hr) && /^---+$/.test(line)) {
                    newSection = true;
                } else if ((splitOptions.all || splitOptions.blank) && /^\s*$/.test(line)) {
                    newSection = true;
                }

                if (newSection && section.length > 0) {
                    results.push(section.join('\n').trim());
                    section = [];
                }
                section.push(line);
            });
            results.push(section.join('\n').trim());
        });
        return results;
    };

})();
