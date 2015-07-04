// var map;
// function initialize() {
	// var myLatlng = new google.maps.LatLng(-25.363882, 131.044922);
// 
	// map = new google.maps.Map(document.getElementById('gMap'), {
		// zoom : 13,
		// center : myLatlng,
		// draggable: false
	// });
// 
	// var marker = new google.maps.Marker({
		// position : myLatlng,
		// map : map,
		// optimized: false,
   		 // zIndex: 9999
	// });
// }
// 
// google.maps.event.addDomListener(window, 'load', initialize);

var map, overlay;

function initialize() {
    var myLatlng = new google.maps.LatLng(-25.363882, 131.044922);
    map = new google.maps.Map(document.getElementById('gMap'), {
        zoom : 13,
        center : myLatlng,
        disableDefaultUI: true,
        draggable: false,
        scrollwheel: false,
        disableDoubleClickZoom: true
    });

    map.Overlay= new google.maps.OverlayView();

    map.Overlay.draw = function () {};

    map.Overlay.onAdd=function() {
        var gMapOverlay = document.createElement("section");
        gMapOverlay.innerHTML = "new div";
        gMapOverlay.id="gMapOverlay";
        this.getPanes().overlayLayer.appendChild(gMapOverlay);
    };

    var marker = new google.maps.Marker({
        position: myLatlng, 
        optimized: false, 
        map:map
    });

    map.Overlay.setMap(map);
}
google.maps.event.addDomListener(window, 'load', initialize);
