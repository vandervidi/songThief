var username = localStorage.getItem("username");
$(document).ready(function() {
	$.ajax({
		type : "POST",
		url : 'http://localhost:8020/songsStolenFromMe',
		data : {
			username : username
		},
		success : function(data) {
			console.log(data);
			debugger
			$.each(data, function(key,value){
				$("#data").append("<section>" + value.artist + " - "+ value.songName + "</section>");
			});
		},
		error : function(objRequest, errortype) {
			console.log("Cannot get followd users Json");
		}
	});


	// Bind the swipeHandler callback function to the swipe event on div.box
	$("body").on( "swipe", function ( event ){
		window.location.href = "songsIStole.html";
	});
});	