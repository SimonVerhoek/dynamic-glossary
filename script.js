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
        addComment: function (term) {
          this.comments[term] = new CommentBox(term);
          this.update()
        },
        removeComment: function (term) {
          delete this.comments[term];
          this.update()
        }
      };

      function CommentBox(term) {
        this.term = term;
        this.description = glossary[term];
        this.html = comment_box_sample.clone().removeClass('sample');

        this.setText = function () {
          const elem = this.html.children('p').first();
          elem.find('span.term').text(this.term);
          elem.find('span.description').text(this.description);
        };

        this.setText()
      }

      jqxhr.done(function (data) {
        glossary = data.words;

        const glossary_terms = Object.keys(glossary);

        $(text_input).on('input', function (e) {
          let text_html = e.target.innerHTML;
          let text = e.target.innerText;

          for (let i = 0; i < glossary_terms.length; i++) {
            const term = glossary_terms[i];

            if (text.indexOf(term.toLowerCase()) < 0) {
              CommentSection.removeComment(term)
            } else if (!CommentSection.comments[term]) {
              CommentSection.addComment(term);

              // highlight term and term occurrence in text
              const highlighted_text = '<span class="highlighted">' + term + '</span>';
              text_html = text_html.replace(term.toLowerCase(), highlighted_text);

              $(text_input).html(text_html)
            }
          }
        })

      });
    });
  });
  
}
