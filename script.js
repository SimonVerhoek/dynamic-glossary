const page_name = window.location.href.split("/").slice(-1)[0];
const script_page = '?page_id=2714&preview=true';

if (page_name === script_page) {
  // do not run script
} else {
  $(function () {
    // const jqxhr = $.getJSON('/wp-content/uploads/2019/07/glossary.json');
    const jqxhr = $.getJSON('glossary.json');

    $(document).ready(function () {
      const text_input = $('#text_input-area');
      const comment_section = $('#comment_section');
      const comment_box_sample = $('.comment_box.sample');
      let glossary;

      const CommentSection = {
        html: comment_section,
        comments: {},
        update: function () {
          const _this = this;

          _this.html.empty();
          $.each(_this.comments, function (term, comment_box) {
            _this.html.append(comment_box.html)
          })
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

      function CommentBox(term, term_color) {
        this.term = term;
        this.term_color = term_color;
        this.description = glossary[term];
        this.html = comment_box_sample.clone().removeClass('sample');

        this.setText = function () {
          const elem = this.html.children('p').first();
          elem.find('span.term')
            .css('color', this.term_color)
            .text(this.term);
          elem.find('span.description').text(this.description);
        };

        this.setText()
      }

      function getRandomColor() {
        return "hsl(" + 360 * Math.random() + ',' +
                 (25 + 70 * Math.random()) + '%,' +
                 (30 + 10 * Math.random()) + '%)';
      }

      jqxhr.done(function (data) {
        glossary = data.words;

        const glossary_terms = Object.keys(glossary);

        $(text_input).on('input', function (e) {
          let text_html = e.target.innerHTML;
          let text = e.target.innerText;

          for (let i = 0; i < glossary_terms.length; i++) {
            const term = glossary_terms[i];
            const term_lowercase = glossary_terms[i].toLowerCase();

            if (text.toLowerCase().indexOf(term_lowercase) < 0) {
              CommentSection.removeComment(term)
            } else {
              // highlight term and term occurrence in text
              const color = getRandomColor();
              CommentSection.addComment(term, color);

              const highlighted_text = '<span style="color: ' + color + '; font-weight: bold; font-size: 16px;">' + term_lowercase + '</span>';
              text_html = text_html.replace(term, highlighted_text);

              text_input.html(text_html)
            }
          }
        })

      });
    });
  });

}
