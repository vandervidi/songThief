$(document).ready(function() {
	window.fbAsyncInit = function() {
		FB.init({
			appId : '1422789871382202',
			xfbml : true,
			version : 'v2.3'
		});

		FB.getLoginStatus(function(response) {
			//If the user is already logged in from a previous session  - redirect him to the next page
			if (response.status === 'connected') {
				//Save connected user id
				
				console.log(response);
				FB.api('/me/friends', function(resFriends) {
				
					console.log('get FB friends ', resFriends);
					saveUserData(response.authResponse.userID, 'http://picture', resFriends.data);
				});
				//window.location.href = "nearFriends.html";

			}
		});

		//####
		$("#loginbutton").click(function() {
			console.log("clicked connect button");
			FB.login(function(response) {
				// handle the response
				
				FB.api('/me/friends', function(resFriends) {
				
					console.log('get FB friends ', resFriends);
					saveUserData(response.authResponse.userID, 'http://picture', resFriends.data);
				});
				
			}, {
				scope : 'user_friends'
			});
			//window.location.href = "nearFriends.html";
		});

		function saveUserData(userId, profilePic, friendsListFb ){
			console.log("AJAX " ,friendsListFb);
			// Create new friends list from response 'friendsList'
			var friendsList = [];
			$.each(friendsListFb, function(i, friend) { 
				friendsList.push(friend.id);  
			});
			console.log('friendsList ',friendsList);

			$.ajax({
 				type : "POST",
 				url : 'http://localhost:8020/connect',
				data : {
					userId: userId,
					profilePic: profilePic,
					friendsList: friendsList,
					location: {
						lat: 31.9743780,
						lng: 34.7739330
					}
				},
  				success : function(data) {
 					console.log('data: ',data);
 					if (data.success){
 						// redirect

 					}else {
 						// prompt msg to user on failure
 					}
 				},
 				error : function(objRequest, errortype) {
					console.log("Cannot get followd users Json");
				}
			});
		}

		//####
		// function getFriends() {
		// 	FB.api('/me/friends', function(response) {
		// 		debugger;
		// 		console.log('getFriends() ',response);
		// 		return response.data;
		// 	});
		// }
	};
	( function(d, s, id) {
			var js,
			    fjs = d.getElementsByTagName(s)[0];
			if (d.getElementById(id)) {
				return;
			}
			js = d.createElement(s);
			js.id = id;
			js.src = "//connect.facebook.net/en_US/sdk.js";
			fjs.parentNode.insertBefore(js, fjs);
		}(document, 'script', 'facebook-jssdk'));
});

