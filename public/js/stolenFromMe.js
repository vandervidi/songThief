var username = localStorage.getItem("username");
$(document).ready(function() {

	$.ajax({
			type : "POST",
			url : 'https://songthief.herokuapp.com/songsStolenFromMe',
			data : {
				username : username
			},
			success : function(data) {
				$.each(data, function(key,value){
					$("#data").append("<section>" + value.artist + " - "+ value.songName + "</section>");
				});
			},
			error : function(objRequest, errortype) {
				console.log("Cannot get followd users Json");
			}
		});
});	