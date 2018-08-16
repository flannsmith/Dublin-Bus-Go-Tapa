$("#about").click(function() {
  $(".show-login").hide();
  $("#about-p").show();
});
$("#go-back-login").click(function() {
  $("#about-p").hide();
  $(".show-login").show();
});
