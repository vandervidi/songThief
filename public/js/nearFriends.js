var map,
    overlay,
    userLocatinoOffset = 0.00008;
//Offset to present user location at the bottom of the map instead of the center
var mapCenter = {
	lat : 32.0900000 + userLocatinoOffset,
	lng : 34.8030835
};
//Setting user STATIC location - Shenkar college

/*
 * Google Maps initalization
 */
function initialize() {
	var myLatlng = new google.maps.LatLng(mapCenter.lat, mapCenter.lng);
	map = new google.maps.Map(document.getElementById('gMap'), {
		zoom : 21,
		center : myLatlng,
		disableDefaultUI : true,
		draggable : false,
		scrollwheel : false,
		disableDoubleClickZoom : true
	});

	var overlay = new google.maps.OverlayView();
	overlay.draw = function() {
	};

	overlay.onAdd = function() {
		var projection = this.getProjection();
		var pixel = null;

		$.ajax({
			type : "POST",
			url : 'http://localhost:8020/getFriendsLocations',
			data : {
				userId : window.sessionStorage.id,
			},
			success : function(data) {
				console.log('data: ', data);
				if (data.success) {

					var marker;
					$.each(data.friendsData, function(key, val) {
						debugger
						pixel = new google.maps.LatLng(val.location.lat, val.location.lng);
						marker = new google.maps.Marker({
							position : pixel,
							optimized : false,
							map : map
						});
						
						//Display a profile pic only if it is in the map boundries
						if (map.getBounds().contains(marker.getPosition())) {
							pixel = projection.fromLatLngToContainerPixel(marker.getPosition());
							$("#wrapper").append($("<section>").attr("id",val.friendId).addClass('draggable').css({
								'position' : 'absolute',
								'top' : pixel.y,
								'left' : pixel.x,
								'width' : '60px',
								'height' : '60px',
								'background' : "url(" + val.profilePic + ") no-repeat",
								'background-size' : 'contain'
							}));
						}
					});
					
					//Draggable event configurations
					$(".draggable").draggable({
						containment : "#wrapper",
						revert : "invalid",
						scroll : false
					});

				} else {
					// prompt msg to user on failure
					alert('We are sorry,\nthere is an error.');
				}
			},
			error : function(objRequest, errortype) {
				console.log("Cannot get followd users Json");
			}
		});
	};
	overlay.setMap(map);


}


$(document).ready(function() {
	google.maps.event.addDomListener(window, 'load', initialize);

	//Droppable event configurations
	$("#chestHolder").droppable({
		accept : ".draggable",
		activeClass : "droppableGlowingChest",
		hoverClass : "droppableObjectOverChest",
		drop : function(event, ui) {
			console.log(event);
			console.log(ui);
			ui.draggable.css("display", "none");
			console.log($(this));
			$("#chestHolder").removeClass();
			$("#chestHolder").addClass("droppableChestAfterUserDropped");
			window.location.href = "timeToRun.html";
		}
	});

	// Onclick for 'skip' button
	$('#skipBtn').click(function (){
		window.location.href = "myLoot.html";
	});

});

