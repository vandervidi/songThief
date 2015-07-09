$.ajax({
	type : "POST",
	url : 'https://songthief.herokuapp.com/getRobbers',
	data : {
		userId : window.sessionStorage.id,
	},
	success : function(data) {
		console.log('data: ', data);
		if (data.success) {
			
		} else {
			// prompt msg to user on failure
			alert('We are sorry,\nthere is an error.');
		}
	},
	error : function(objRequest, errortype) {
		console.log("Cannot get followd users Json");
	}
}); 