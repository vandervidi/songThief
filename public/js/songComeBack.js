$(document).ready(function(){


	$.ajax({
		type : "POST",
		url : 'http://localhost:8020/getRobbersOfSongsThatAreBack',
		data : {
			userId :  window.sessionStorage.id
		},
		success : function(data) {
			if(data.success){
				debugger
				//need to implement..
			}
		},
		error : function(objRequest, errortype) {
			console.log("cannot get robbers of songs that are back");
		}
	});

	// Onclick for 'skip' button
	$('#skipBtn').click(function (){
		window.location.href = "getReady.html";
	});
});







