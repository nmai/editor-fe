
import MediumEditor from 'medium-editor';

const WHITESPACE_CHARS = [' ', '\t', '\n', '\r', '\u00A0', '\u2000', '\u2001', '\u2002', '\u2003',
                                '\u2028', '\u2029'];


export const Latex = MediumEditor.Extension.extend({

    name: 'latex',

    init: function () {
        MediumEditor.Extension.prototype.init.apply(this, arguments);
        this.subscribe('editableKeypress', this.onKeypress.bind(this));
    },

    onKeypress: function (keyPressEvent) {
        if (MediumEditor.util.isKey(keyPressEvent, [MediumEditor.util.keyCode.SPACE, MediumEditor.util.keyCode.ENTER])) {
            clearTimeout(this.performLinkingTimeout);
            // Saving/restoring the selection in the middle of a keypress doesn't work well...
            this.performLinkingTimeout = setTimeout(function () {
              this.findLinkableText(keyPressEvent.target);
            }.bind(this), 0);
        }
    },

    findLinkableText: function (contenteditable) {
        let textContent: string = contenteditable.textContent;
        let matches = [];
        
        let regexMatches = textContent.match(/(?<=\$)(.*?)(?=\$)/g);

        for (let m of regexMatches) {
          let idx = textContent.indexOf(m);
          matches.push({
              href: m,
              start: idx,
              end: idx + m.length,
          });
        }

        return matches;
    },

});

MediumEditor.extensions.latex = Latex;
