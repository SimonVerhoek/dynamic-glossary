$(document).ready(function () {
  console.log('test');

  const text_input = $('#text_input');
  const comment_section = $('#comment_section');
  const comment_box_sample = $('.comment_box.sample');
  let comments = [];

  $(text_input).on('input', function (e) {
    if (e.target.value === 'puppy') {
      let comment_box = comment_box_sample.clone().removeClass('sample');

      $(comment_box).children('p').first().text(e.target.value);

      comments.push(comment_box);
    } else {
      comments.length = 0;
    }

    for (let i = 0; i < comments.length; i++) {
      comment_section.append(comments[i])
    }
  })


});
