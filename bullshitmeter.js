$(function () {
  const jqxhr = $.getJSON('glossary.json');

  $(document).ready(function () {
    const text_input = $('#text_input');
    const comment_section = $('#comment_section');
    const comment_box_sample = $('.comment_box.sample');
    let comments = {};
    let glossary;

    function CommentBox(term) {
      this.term = term;
      this.description = glossary[term];
      this.html = comment_box_sample.clone().removeClass('sample');

      this.setText = function () {
        this.html.children('p').first().text(this.term + ': ' + this.description);
      };

      this.setText()
    }

    function updateCommentSection() {
      comment_section.empty();
      $.each(comments, function (term, comment_box) {
        comment_section.append(comment_box.html)
      })
    }

    jqxhr.done(function (data) {
      glossary = data.words;

      const glossary_terms = Object.keys(glossary);

      $(text_input).on('input', function (e) {
        const text = e.target.value;

        for (let i = 0; i < glossary_terms.length; i++) {
          const term = glossary_terms[i];

          if (text.indexOf(term.toLowerCase()) < 0) {
            delete comments[term]
          } else if (!comments[term]) {
            comments[term] = new CommentBox(term);
          }
        }

        updateCommentSection();
      })

    });
  });
});
