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
jQuery.fbInit = function(app_id) {
    window.fbAsyncInit = function() {
        FB.init({
            appId      : app_id, // App ID
            status     : true, // check login status
            cookie     : true, // enable cookies to allow the server to access the session
            xfbml      : true  // parse XFBML
        });
    };

    // Load the SDK Asynchronously
    (function(d){
        var js, id = 'facebook-jssdk'; if (d.getElementById(id)) {return;}
        js = d.createElement('script'); js.id = id; js.async = true;
        js.src = "//connect.facebook.net/en_US/all.js";
        d.getElementsByTagName('head')[0].appendChild(js);
    }(document));

    $('<div />').attr('id','fb-root').appendTo('body');
};

$(document).ready(function(){
    $.fbInit('1422789871382202');
});
      //appId: '1422789871382202',
      
			