$(function () {
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
        this.html.children('p').first().text(this.term + ': ' + this.description);
      };

      this.setText()
    }

    jqxhr.done(function (data) {
      glossary = data.words;

      const glossary_terms = Object.keys(glossary);

      $(text_input).on('input', function (e) {
        const text = e.target.value;

        for (let i = 0; i < glossary_terms.length; i++) {
          const term = glossary_terms[i];

          if (text.indexOf(term.toLowerCase()) < 0) {
            CommentSection.removeComment(term)
          } else if (!CommentSection.comments[term]) {
            CommentSection.addComment(term)
          }
        }
      })

    });
  });
});
