$(document).ready(function() {
	$("#sendBtn").click(function(){
	
		console.log("btn clicked");
	$.ajax({
			type : "POST",
			url : 'https://songthief.herokuapp.com/connect',
			data : {
				username : $("#user").val(),
				password : $("#pass").val()
			},
			success : function(data) {
				console.log(data);
				debugger
				if(data.connection == 1){
					localStorage.setItem("username", $("#user").val());
					window.location.href = "songsIStole.html";
				}
				else
				{
					$("#errorMessage").empty();
					$("#errorMessage").append("You entered wrong username or password. Try again");
				}
			},
			error : function(objRequest, errortype) {
				console.log("Cannot get followd users Json");
			}
		});

	});
});	