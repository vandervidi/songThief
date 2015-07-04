// $(document).ready(function() {
// $("#sendBtn").click(function(){
//
// console.log("btn clicked");
// $.ajax({
// type : "POST",
// url : 'https://songthief.herokuapp.com/connect',
// data : {
// username : $("#user").val(),
// password : $("#pass").val()
// },
// success : function(data) {
// console.log(data);
// if(data.connection == 1){
// localStorage.setItem("username", $("#user").val());
// window.location.href = "songsIStole.html";
// }
// else
// {
// $("#errorMessage").empty();
// $("#errorMessage").append("You entered wrong username or password. Try again");
// }
// },
// error : function(objRequest, errortype) {
// console.log("Cannot get followd users Json");
// }
// });
//
// });
// });
$(document).ready(function() {
  $.ajaxSetup({ cache: true });
  $.getScript('//connect.facebook.net/en_US/sdk.js', function(){
    FB.init({
      appId: '1422789871382202',
      version: 'v2.3' // or v2.0, v2.1, v2.0
    });     
    $('#loginbutton,#feedbutton').removeAttr('disabled');
    FB.getLoginStatus(updateStatusCallback);
  });
});
		
		function updateStatusCallback(){
   alert('Status updated!!');
   // Your logic here
}
			