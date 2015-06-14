var username = localStorage.setItem("username");
$(document).ready(function() {

	$.ajax({
			type : "POST",
			url : 'https://songthief.herokuapp.com/getSongsStolenFromMe',
			data : {
				username : $("#user").val()
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