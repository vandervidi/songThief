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
	overlay.draw = function() {};

	overlay.onAdd = function() {
		var projection = this.getProjection();
		var pixel = projection.fromLatLngToContainerPixel(marker.getPosition());
		console.log(pixel);
		// var gMapOverlay = document.createElement("section");
		// gMapOverlay.innerHTML = "new div";
		// gMapOverlay.id = "gMapOverlay";
		// this.getPanes().overlayLayer.appendChild(gMapOverlay);
	};
	overlay.setMap(map);

	var marker = new google.maps.Marker({
		position : myLatlng,
		optimized : false,
		map : map
	});

}

google.maps.event.addDomListener(window, 'load', initialize);

$(document).ready(function() {
	/*
	 * Draggable and droppable objects - configuration
	 */
	$(".draggable").draggable({
		containment : "#wrapper",
		revert : "invalid",
		scroll : false
	});

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
		}
	});

});

