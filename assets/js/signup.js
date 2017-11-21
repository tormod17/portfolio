
function signupRequest() {
  var data = {};
  $('#signupForm input').each(function(i, ele){
      var name = $(this).attr('name');
      var value = $(this).val();
      data[name] = value;
  });

  function showMessage(result){
    $('#message').text(result);
  }
  $.post('/signup', data, showMessage);
}
