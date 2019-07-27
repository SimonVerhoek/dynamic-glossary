const page_name = window.location.href.split("/").slice(-1)[0];
const script_page = '?page_id=2714&preview=true';

if (page_name === script_page) {
  // do not run script
} else {
  $(function () {
    // const jqxhr = $.getJSON('/wp-content/uploads/2019/07/glossary.json');
    const jqxhr = $.getJSON('glossary.json');

    $(document).ready(function () {
      let glossary;

      const TextInputField = {
        elem: $('#text_input-area')[0],

        highlightTerm: function (term, color) {
          const _this = this;
          const highlighted_text = `<span class="highlighted" style="color: ${color};">${term}</span>`;
          $(_this.elem).html(_this.elem.innerHTML.replace(term, highlighted_text));
        }
      };

      const CommentSection = {
        html: $('#comment_section'),
        comments: {},

        sortComments: function () {
          const _this = this;
          let ordered_comments = {};
          Object.keys(_this.comments).sort().forEach(function(key) {
            ordered_comments[key] = _this.comments[key];
          });
          _this.comments = ordered_comments;
        },
        update: function () {
          const _this = this;
          _this.sortComments();

          _this.html.empty();
          $.each(_this.comments, function (term, comment_box) {
            _this.html.append(comment_box.html)
          });
        },
        addComment: function (term, term_color) {
          this.comments[term] = new CommentBox(term, term_color);
          this.update()
        },
        removeComment: function (term) {
          delete this.comments[term];
          this.update()
        }
      };

      class CommentBox {
        constructor(term, term_color) {
          this.term = term;
          this.term_color = term_color;
          this.description = glossary[this.term];
          this.html = $('.comment_box.sample').clone().removeClass('sample');
          this.setText();
        }

        setText() {
          const elem = this.html.children('p').first();
          elem.find('span.term')
            .css('color', this.term_color)
            .text(this.term);

          const styled_description = this.description.replace(/[0-9]/g, function (char) {
            return `<strong>${char}</strong>`;
          });
          elem.find('span.description').html(styled_description);
        };
      }

      function getRandomColor() {
        const hue = 360 * Math.random();
        const saturation = 25 + 70 * Math.random();
        const lightness = 30 + 10 * Math.random();
        return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
      }

      function delay(fn, ms) {
        let timer = 0;
        return function(...args) {
          clearTimeout(timer);
          timer = setTimeout(fn.bind(this, ...args), ms || 0)
        }
      }

      jqxhr.done(function (data) {
        glossary = data.words;

        const glossary_terms = Object.keys(glossary);

        $(TextInputField.elem).on('input', delay(function (e) {
          let text = e.target.innerText;

          for (let i = 0; i < glossary_terms.length; i++) {
            const term = glossary_terms[i];

            if (text.indexOf(term) >= 0 || text.indexOf(term.toLowerCase()) >= 0) {
              const color = getRandomColor();
              CommentSection.addComment(term, color);
              TextInputField.highlightTerm(term, color);
              TextInputField.highlightTerm(term.toLowerCase(), color)
            } else {
              CommentSection.removeComment(term)
            }
          }
        }, 500))

      });
    });
  });

}
