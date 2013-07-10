$(document).ready(function(){
  if ($(window).width() <= 320) {
    $('.button').removeClass('small');
    $('.button').addClass('tiny');
  }


  function updateButton(button, status) {
    if(status === 'follows') {
      button.addClass('success');
      button.text('Following');
    } else if(status === 'requested') {
      button.text('Requested');
      button.addClass('success');
    } else {
      button.text('Follow');
      button.removeClass('success');
    }
  }

  $('a.follow').on('click', function(e){
    e.preventDefault();

    var id = $(this).data('id');
    var button = $(this);

    if($(this).hasClass('success')) {
      $.get('/set_relationship?id=' + id + '&relation=unfollow', function(data) {
        updateButton(button, data.outgoing_status);
      });
    } else {
      $.get('/set_relationship?id=' + id + '&relation=follow', function(data) {
        updateButton(button, data.outgoing_status);
      });
    }
  });
});