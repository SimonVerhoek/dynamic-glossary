$(function () {
  const jqxhr = $.getJSON('glossary.json');

  $(document).ready(function () {
    const text_input = $('#text_input');
    const comment_section = $('#comment_section');
    const comment_box_sample = $('.comment_box.sample');
    let comments = {};
    let glossary;

    function updateCommentSection() {
      comment_section.empty();
      $.each(comments, function (term, comment_box) {
        comment_box = comment_box[0];
        comment_section.append(comment_box)
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
            let comment_box = comment_box_sample.clone().removeClass('sample');

            $(comment_box).children('p').first().text(term + ': ' + glossary[term]);

            comments[term] = comment_box;
          }
        }

        updateCommentSection();
      })

    });
  });
});
