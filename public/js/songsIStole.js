var username = localStorage.getItem("username");
$(document).ready(function() {
	console.log('(Ajax) get songs i songsIStole...')

	$.ajax({
		type : "POST",
		url : 'https://songthief.herokuapp.com/songsIStole',
		data : {
			username : username
		},
		success : function(data) {
			console.log(data);
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
		window.location.href = "stolenFromMe.html";
	});

});
