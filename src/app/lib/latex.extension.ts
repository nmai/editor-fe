
import MediumEditor from 'medium-editor';
import katex from 'katex';

/** Inspired by autolink extension */
export const LatexExtension = MediumEditor.Extension.extend({

  name: 'latex',

  init: function () {
    MediumEditor.Extension.prototype.init.apply(this, arguments);
    this.subscribe('editableKeypress', this.onKeypress.bind(this));
  },

  onKeypress: function (keyPressEvent) {
    if (keyPressEvent.key == '$') {
      clearTimeout(this.performLinkingTimeout);
      // Let's run this on next cycle
      this.performLinkingTimeout = setTimeout(function () {
        let matches = this.findLatexInput(keyPressEvent.target);

        for (let m of matches) {
          // Cleanup
          let matchingTextNodes = MediumEditor.util.findOrCreateMatchingTextNodes(this.document, this.base.elements[0], m);
          for (let n of matchingTextNodes) {
            try {
              n.parentNode.removeChild(n)
            } catch(e) {
              console.debug(e);
            }
          }
          // Insert - example: c = \\pm\\sqrt{a^2 + b^2}
          let html = katex.renderToString(m.text.slice(1, m.text.length - 1), {
            throwOnError: false
          });

          try {
            MediumEditor.util.insertHTMLCommand(this.document, html);
            // let's indicate to our subscribers that we need to save again
            let customEventObj = { target: keyPressEvent.target, currentTarget: keyPressEvent.currentTarget };
            this.base.events.triggerCustomEvent('autoinsert', customEventObj, keyPressEvent.currentTarget);
            // todo: figure out how to move the cursor back out of the span into the parent.
            // having difficulty terminating the katex context
            // MediumEditor.util.insertHTMLCommand(this.document, '<span></span>');
            // MediumEditor.selection.moveCursor(this.document, this.base.elements[0].lastChild, 0);
          } catch(e) {
            console.debug(e);
          }
        }
      }.bind(this), 0);
    }
  },

  findLatexInput: function (contenteditable): { text: string, start: number, end: number }[] {
    let textContent: string = contenteditable.textContent;
    let matches = [];
    
    let regexMatches = textContent.match(/(?<=\$)(.*?)(?=\$)/g);
    if (regexMatches == null)
      return [];

    for (let m of regexMatches) {
      let idx = textContent.indexOf(m);
      // let's actually expand this to include the $ delimiters
      matches.push({
        text: '$' + m + '$',
        start: idx - 1, // note this can be a pretty poor assumption.. no guarantee that the immediate prev char is the delimiter...
        end: idx + m.length + 1,
      });
    }

    return matches;
  },
});
