var username = localStorage.getItem("username");
$(document).ready(function() {
	debugger;
	console.log('(Ajax) get songsStolenFromMe...')

	$.ajax({
		type : "POST",
		url : 'https://songthief.herokuapp.com/songsStolenFromMe',
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