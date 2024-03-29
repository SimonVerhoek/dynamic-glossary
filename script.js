const page_name = window.location.href.split("/").slice(-1)[0];
const script_page = '?page_id=2714&preview=true';

if (page_name !== script_page) {
  // do not run script
} else {
  $(function () {
    const spreadsheet_id = 'your_spreadsheet_id';
    const jqxhr = $.ajax({
      url: `https://docs.google.com/spreadsheets/d/e/${spreadsheet_id}/pub?gid=0&single=true&output=tsv`,
      type: 'GET',
      dataType: 'text',
      mimeType: 'text/plain',
    });

    $(document).ready(function () {
      const glossary = {};

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
          Object.keys(_this.comments).sort().forEach(function (key) {
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

      function getRandomColor(i = null) {
        if (i === null) {
          const hue = 360 * Math.random();
          const saturation = 25 + 70 * Math.random();
          const lightness = 30 + 10 * Math.random();
          return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
        } else {
          const colors = [
            '#ffa6bf', '#ff3e89', '#ea8d8d', '#eec120', '#ffc700', '#ff66c4', '#ff914d', '#a6a6a6',
            '#3efff3', '#5ce1e6'
          ];
          return colors[i];
        }
      }

      function delay(fn, ms) {
        let timer = 0;
        return function (...args) {
          clearTimeout(timer);
          timer = setTimeout(fn.bind(this, ...args), ms || 0)
        }
      }

      jqxhr.done(function (data) {

        const lines = data.split('\n');
        for (let i = 0; i < lines.length; i++) {
          const [term, description] = lines[i].split('\t');
          glossary[term] = description
        }

        const glossary_terms = Object.keys(glossary);

        $(TextInputField.elem).on('input', delay(function (e) {
          let text = e.target.innerText;
          let comment_color_number = 0;

          for (let i = 0; i < glossary_terms.length; i++) {
            const term = glossary_terms[i];

            if (text.indexOf(term) >= 0 || text.indexOf(term.toLowerCase()) >= 0) {
              comment_color_number += 1;
              const color = getRandomColor(comment_color_number);
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
