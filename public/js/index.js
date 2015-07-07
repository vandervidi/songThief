var userFacebookId;

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
				userFacebookId = response.authResponse.userID;
				console.log('Logged in.');
				console.log(response);
				getFriends();
				//window.location.href = "nearFriends.html";

			}
		});

		//####
		function getFriends() {
			FB.api('/me/friendlists ', function(response) {
				console.log(response);
				if (response.data) {
					$.each(response.data, function(index, friend) {
						alert(friend.name + ' has id:' + friend.id);
					});
				} else {
					alert("Error!");
				}
			});
		}

		//####

		$("#loginbutton").click(function() {
			console.log("clicked connect button");
			FB.login(function(response) {
				// handle the response
			}, {
				scope : 'email,user_friends'
			});
			//window.location.href = "nearFriends.html";
		});
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

