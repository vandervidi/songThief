var username = localStorage.getItem("username");
$(document).ready(function() {
	$.ajax({
		type : "POST",
		url : 'http://localhost:8020/songsIStole',
		data : {
			username : username
		},
		success : function(data) {
			console.log(data);
			$.each(data, function(key,song){

				if (!isDayLeft(song.stealTimestamp)){
					// Create circle
					var circle = $('<canvas class="loader">');

					// Create song data
					var songNameArtist = $('<section id="songData">' + song.artist + ' - '+ song.songName + '</section>');
					
					// connect them
					var songItem = $('<section class="song">');
					songItem.append(songNameArtist);
					songItem.append(circle);
					

					// Add to the screen
					$("#songs").append(songItem);

					var percent = calculatePercentDayLeft(song.stealTimestamp);

					var options = {
						width: 65, // width of the loader in pixels
						height: 65, // height of the loader in pixels
						animate: true, // whether to animate the loader or not
						displayOnLoad: true,
						percentage: percent, // percent of the value, between 0 and 100
						speed: 40, // miliseconds between animation cycles, lower value is faster
						roundedLine: false, // whether the line is rounded, in pixels
						showRemaining: true, // how the remaining percentage (100% - percentage)
						fontFamily: 'Helvetica', // name of the font for the percentage
						fontSize: '20px', // size of the percentage font, in pixels
						showText: true, // whether to display the percentage text
						diameter: 30, // diameter of the circle, in pixels
						fontColor: 'rgba(25, 25, 25, 0.6)', // color of the font in the center of the loader, any CSS color would work, hex, rgb, rgba, hsl, hsla
						lineColor: 'rgba(55, 55, 55, 1)', // line color of the main circle
						remainingLineColor: 'rgba(55, 55, 55, 0.4)', // line color of the remaining percentage (if showRemaining is true)
						lineWidth: 5 // the width of the circle line in pixels
					};
					//select the canvas and create classyloader
					$('.loader:last').ClassyLoader(options);
				}
			});
		},
		error : function(objRequest, errortype) {
			console.log("Cannot get followd users Json");
		}
	});

	// Bind the swipeHandler callback function to the swipe event on div.box
	$("body").on( "swipe", function ( event ){
		window.location.href = "stolenFromMe.html";
	});

});


function isDayLeft(timestamp){
	// Calculate time from timestamp untill now
	// and return is a day (24H) was left
	// ...
	// ...

	// for test:
	return false;
}
function calculatePercentDayLeft(timestamp){
	// Calculate time from timestamp untill now
	// and calculate how many time of the day has left
	// ....
	// ...

	//for test:
	return 67;
}



function timeDiff( tstart, tend ) {
  var diff = Math.floor((tend - tstart) / 1000), units = [
    { d: 60, l: "seconds" },
    { d: 60, l: "minutes" },
    { d: 24, l: "hours" },
    { d: 7, l: "days" }
  ];

  var s = '';
  for (var i = 0; i < units.length; ++i) {
    s = (diff % units[i].d) + " " + units[i].l + " " + s;
    diff = Math.floor(diff / units[i].d);
  }
  return s;
}


function dataFromTimestamp(timestamp) {
	var d = new Date(timestamp);

	// Time
	var h = addZero(d.getHours());
	//hours
	var m = addZero(d.getMinutes());
	//minutes
	var s = addZero(d.getSeconds());
	//seconds

	// Date
	var da = d.getDate();
	//day
	var mon = d.getMonth() + 1;
	//month
	var yr = d.getFullYear();
	//year
	var dw = d.getDay();
	//day in week

	// Readable feilds
	months = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
	var monName = months[d.getMonth()];
	//month Name
	var time = h + ":" + m + ":" + s;
	//full time show
	var thisDay = da + "/" + mon + "/" + yr;
	//full date show

	var dateTime = {
		seconds : s,
		minutes : m,
		hours : h,
		dayInMonth : da,
		month : mon,
		year : yr,
		dayInTheWeek : dw,
		monthName : monName,
		fullTime : time,
		fullDate : thisDay
	};
	return dateTime;

	function addZero(i) {
		if (i < 10) {
			i = "0" + i;
		}
		return i;
	}
}