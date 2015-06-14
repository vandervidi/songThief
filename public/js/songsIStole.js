var username = localStorage.getItem("username");
$(document).ready(function() {

	$.ajax({
			type : "POST",
			url : 'https://songthief.herokuapp.com/songsIStole',
			data : {
				username : username
			},
			success : function(data) {
				console.log(data);
				debugger
				

			},
			error : function(objRequest, errortype) {
				console.log("Cannot get followd users Json");
			}
		});

	});
});	