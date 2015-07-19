//##########################################################
var userId = window.sessionStorage.id;
var counterDownTime;  //This will hold the remaining time left counter of a song
$(document).ready(function() {
	$.ajax({
		type : "POST",
		url : 'https://songthief.herokuapp.com/songsStolenFromMe',
		data : {
			userId : userId
		},
		success : function(data) {
			console.log(data);
			
			if (data.success==1){
				$.each(data.songsList, function(key,song){
					
					if ( !is24HLeft(song.stealTimestamp) ){
						var songItem = $('<section class="song" data-url="' + song.url + '">');
						// Create circle
						var circle = $('<section class="circleHolder circle'+ key +'">');

						// Create song data
						var songData = $('<section class="songData">');
						var songCountDown = $('<section class="counterHolder countDown'+ key +'"><span class="hoursSymbol">H</span><span class="hours"></span><span class="minutes"></span></section>');
						
						countDown('countDown'+ key , song.stealTimestamp);
						
						
						songItem.append(songData);
						songData.append(circle);
						songData.append(songCountDown);
						songData.append('<div class="clear">');

						// Add to the screen
						$("#songs").append(songItem);

						// Calc percent to show
						var percent = calcPercentOfSecondsFrom24H(song.stealTimestamp);

						$('.circle'+ key).circleProgress({
							/**
							 * This is the only required option. It should be from 0.0 to 1.0
							 * @type {number}
							 */
							value: calcPercentOfSecondsFrom24H(song.stealTimestamp) / 100,

							/**
							 * Size of the circle / canvas in pixels
							 * @type {number}
							 */
							size: 80.0,

							/**
							 * Initial angle for 0.0 value in radians
							 * @type {number}
							 */
							startAngle:  -Math.PI / 4 * 2,

							/**
							 * Width of the arc. By default it's auto-calculated as 1/14 of size, but you may set it explicitly in pixels
							 * @type {number|string}
							 */
							thickness: '8',

							/**
							 * Fill of the arc. You may set it to:
							 *   - solid color:
							 *   - { color: '#3aeabb' }
							 *   - { color: 'rgba(255, 255, 255, .3)' }
							 *   - linear gradient (left to right):
							 *   - { gradient: ['#3aeabb', '#fdd250'], gradientAngle: Math.PI / 4 }
							 *   - { gradient: ['red', 'green', 'blue'], gradientDirection: [x0, y0, x1, y1] }
							 *   - image:
							 *   - { image: 'http://i.imgur.com/pT0i89v.png' }
							 *   - { image: imageObject }
							 *   - { color: 'lime', image: 'http://i.imgur.com/pT0i89v.png' } - color displayed until the image is loaded
							 */
							fill: {
							  color: '#00ffff'
							},

							/**
							 * Color of the "empty" arc. Only a color fill supported by now
							 * @type {string}
							 */
							emptyFill: '#FFFFF',

							/**
							 * <a href="http://www.jqueryscript.net/animation/">Animation</a> config (see jQuery animations: http://api.jquery.com/animate/)
							 */
							animation: {
							  duration: 800,
							  easing: 'circleProgressEasing'
							},

							/**
							 * Default animation starts at 0.0 and ends at specified `value`. Let's call this direct animation.
							 * If you want to make reversed animation then you should set `animationStartValue` to 1.0.
							 * Also you may specify any other value from 0.0 to 1.0
							 * @type {number}
							 */
							animationStartValue: 0.0,

							/**
							 * Reverse animation and arc draw
							 * @type {boolean}
							 */
							reverse: false,

							/**
							 * Arc line cap ('butt' (default), 'round' and 'square')
							 * Read more: https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D.lineCap
							 * @type {string}
							 */
							lineCap: 'butt',
							});

						//$('.circle'+ key).append('<img src="' +  data.victims[song.userId] + '">');
							debugger
						$('.circle'+ key + '> canvas').css( {
							"background-image": "url(" + data.robbers[song.robberId] + ")",
							"background-size": "80px 80px",
    						"background-repeat": "no-repeat",
    						"background-position":" center center"  
						});

					}else {
						// send to server this song to remove from my steal list
						// and re-enable the song at victims songs list
						giveBackSong_reenableVictimSong(song);
					}
				});
			}else{
				console.log(data.desc);
			}
		},
		error : function(objRequest, errortype) {
			console.log("Cannot get followd users Json");
		}
	});

	$('#backBtn').click(function(){
		window.location.href = "nearFriends.html";
	});


	// on 'swipe-right'
	$("body").on( "swiperight", function ( event ){
		window.location.href = "myLoot.html";
	});
});


//This function re-enables victim's stolen song.
function giveBackSong_reenableVictimSong(song){
	console.log('song.userId ',song.userId);
	$.ajax({
		type : "POST",
		url : 'https://songthief.herokuapp.com/giveBackSong',
		data : {
			userId : song.robberId,
			song : song.url,
			victimId : userId
		},
		success : function(data) {
			if (data.success){
				console.log(data);
				
				}
			else 
				return false;
		},
		error : function(objRequest, errortype) {
				console.log("Cannot get followd users Json");
			}
		});
}


function is24HLeft(timestamp){
	// Calculate time from timestamp untill now
	counterDownTime =  timeDifference( Date.now(), timestamp );
	console.log('time passed: ',counterDownTime);
	// If pass 48H
	if (counterDownTime.days >=1) return true;
	else return false;
}

// calculates the percentage of a given timestamp from a 24 hours timestamp
function calcPercentOfSecondsFrom24H(timestamp){
	var daySec = 86400;// 24h in seconds
	var secDiffVal = Math.floor((Date.now() - timestamp) / 1000);
	var percent = parseInt( secDiffVal * 100 / daySec );
	return percent;
}

// This function returns the difference between two timestamps
function timeDifference(dateNow,olderDate) {
        var difference = dateNow - olderDate;

        var daysDifference = Math.floor(difference/1000/60/60/24);
        difference -= daysDifference*1000*60*60*24

       var hoursDifference = Math.floor(difference/1000/60/60);
        difference -= hoursDifference*1000*60*60

        var minutesDifference = Math.floor(difference/1000/60);
        difference -= minutesDifference*1000*60

        var secondsDifference = Math.floor(difference/1000);

		return {
			days: daysDifference,
			hours: hoursDifference,
			minutes: minutesDifference,
			seconds: secondsDifference
		};
}


function countDown(element, userTs) {

    var interval = setInterval(function() {
    	//Saving an instance of the hours and minutes elements
    	var remaningTime = (userTs + 86400000) - Date.now();
	    var hoursElem = $('.'+element + ' .hours');
		var minutesElem = $('.'+element + ' .minutes');
    	
		//Subtracting the days from the timestamp
    	var d = Math.floor(remaningTime / 1000 / 60 / 60 / 24);
        remaningTime -= d * 1000 * 60 * 60 * 24;

       
        if(remaningTime == 0) {
         	hoursElem.text("00");
         	minutesElem.text("00");
            clearInterval(interval);
            return;
        }

        //Subtracting the hours from the timestamp
        var hours = Math.floor(remaningTime / 1000 / 60 / 60);
        remaningTime -= hours * 1000 * 60 * 60;
        if (hours < 10) hours = "0" + hours;
        hoursElem.text(hours);

        //Subtracting the minutes from the timestamp
        var minutes =  Math.floor(remaningTime / 1000 / 60);
        remaningTime -= minutes * 1000 * 60;
        if (minutes < 10) minutes = "0" + minutes;
        minutesElem.text(minutes);

    }, 1000);
}












































// var userId = window.sessionStorage.id;
// $(document).ready(function() {
// 	$.ajax({
// 		type : "POST",
// 		url : 'http://localhost:8020/songsStolenFromMe',
// 		data : {
// 			userId : userId
// 		},
// 		success : function(data) {
// 			console.log(data);
// 			debugger
// 			if (data.success==1){
// 				$.each(data.songsList, function(key,song){
// 					if ( !is24HLeft(song.stealTimestamp) ){
// 						// Create circle
// 						var circle = $('<canvas class="loader">');

// 						// Create song data
// 						var songNameArtist = $('<section id="songData" data-url="'+song.url+'" >' + song.artist + ' - '+ song.songName + '</section>');
						
// 						// connect them
// 						var songItem = $('<section class="song">');
// 						songItem.append(songNameArtist);
// 						songItem.append(circle);

// 						// Add to the screen
// 						$("#songs").append(songItem);

// 						// Calc percent to show
// 						var percent = calcPercentOfSecondsFrom24H(song.stealTimestamp);

// 						var options = {
// 							width: 65, // width of the loader in pixels
// 							height: 65, // height of the loader in pixels
// 							animate: true, // whether to animate the loader or not
// 							displayOnLoad: true,
// 							percentage: percent, // percent of the value, between 0 and 100
// 							speed: 40, // miliseconds between animation cycles, lower value is faster
// 							roundedLine: false, // whether the line is rounded, in pixels
// 							showRemaining: true, // how the remaining percentage (100% - percentage)
// 							//fontFamily: 'Helvetica', // name of the font for the percentage
// 							fontSize: '20px', // size of the percentage font, in pixels
// 							showText: false, // whether to display the percentage text
// 							diameter: 30, // diameter of the circle, in pixels
// 							//fontColor: 'rgba(25, 25, 25, 0.6)', // color of the font in the center of the loader, any CSS color would work, hex, rgb, rgba, hsl, hsla
// 							lineColor: '#2cf0b9', // line color of the main circle	// user remaining time
// 							remainingLineColor: '#000000', // line color of the remaining percentage (if showRemaining is true)	//user consume time
// 							lineWidth: 5 // the width of the circle line in pixels
// 						};
// 						//select the canvas and create classyloader
// 						$('.loader:last').ClassyLoader(options);
// 					}else {
// 						// send to server this song to remove from my steal list
// 						// and re-enable the song at victims songs list
// 						giveBackSong_reenableVictimSong(song);
// 					}
// 				});
// 			}else{
// 				console.log(data.desc);
// 			}
// 		},
// 		error : function(objRequest, errortype) {
// 			console.log("Cannot get followd users Json");
// 		}
// 	});

// 	$('#backBtn').click(function(){
// 		window.location.href = "nearFriends.html";
// 	});

// 	// Bind the swipeHandler callback function to the swipe event on div.box
// 	// on 'swipe-right'
// 	$("body").on( "swipeleft", function ( event ){
// 		window.location.href = "myLoot.html";
// 	});
// });

// function giveBackSong_reenableVictimSong(song){
// 	console.log('song.robberId ',song.robberId);
// 	$.ajax({
// 		type : "POST",
// 		url : 'http://localhost:8020/giveBackSong',
// 		data : {
// 			userId : song.robberId,
// 			song : song.url,
// 			victimId : userId
// 		},
// 		success : function(data) {
// 			if (data.success){
// 				debugger
// 				console.log(data);
// 				//Now reenable victim song
// 				}
// 			else 
// 				return false;
// 		},
// 		error : function(objRequest, errortype) {
// 				console.log("Cannot get followd users Json");
// 			}
// 		});
// }


// function is24HLeft(timestamp){
// 	// Calculate time from timestamp untill now
// 	var timeDiffVal =  timeDifference( Date.now(), timestamp );
// 	console.log('time left: ',timeDiffVal);
// 	// If pass 48H
// 	if (timeDiffVal.days >=1) return true;
// 	else return false;
// }
// function calcPercentOfSecondsFrom24H(timestamp){
// 	var daySec = 86400;// in seconds
// 	var secDiffVal = Math.floor((Date.now() - timestamp) / 1000);
// 	var percent = parseInt(secDiffVal*100/daySec);
// 	return percent;
// }
// function timeDiff( tstart, tend ) {
//   var diff = Math.floor((tend - (tend - tstart)) / 1000), units = [
//     { d: 60, l: "seconds" },
//     { d: 60, l: "minutes" },
//     { d: 24, l: "hours" },
//     { d: 7, l: "days" }
//   ];
//   var res = {
//   	seconds: 0,
//   	minutes: 0,
//   	hours: 0,
//   	days: 0
//   }
//   var s = '';
//   for (var i = 0; i < units.length; ++i) {
//     s = (diff % units[i].d) + " " + units[i].l + " " + s;
//     switch(i){
//     	case 0: res.seconds = diff % units[i].d;//seconds
//     		break;
//     	case 1: res.minutes = diff % units[i].d;//minutes
//     		break;
//     	case 2: res.hours = diff % units[i].d;//hours
//     		break;
//     	case 3: res.days = diff % units[i].d;//days
//     		break;
//     }
//     diff = Math.floor(diff / units[i].d);
//   }
//   //return s;
//   return res;
// }

// function timeDifference(dateNow,olderDate) {
//         var difference = dateNow - olderDate;

//         var daysDifference = Math.floor(difference/1000/60/60/24);
//         difference -= daysDifference*1000*60*60*24

//        var hoursDifference = Math.floor(difference/1000/60/60);
//         difference -= hoursDifference*1000*60*60

//         var minutesDifference = Math.floor(difference/1000/60);
//         difference -= minutesDifference*1000*60

//         var secondsDifference = Math.floor(difference/1000);

// 		return {
// 			days: daysDifference,
// 			hours: hoursDifference,
// 			minutes: minutesDifference,
// 			seconds: secondsDifference
// 		};
// 	     //document.WRITE('difference = ' + daysDifference + ' day/s ' + hoursDifference + ' hour/s ' + minutesDifference + ' minute/s ' + secondsDifference + ' second/s ');
// }

// function dataFromTimestamp(timestamp) {
// 	var d = new Date(timestamp);

// 	// Time
// 	var h = addZero(d.getHours());
// 	//hours
// 	var m = addZero(d.getMinutes());
// 	//minutes
// 	var s = addZero(d.getSeconds());
// 	//seconds

// 	// Date
// 	var da = d.getDate();
// 	//day
// 	var mon = d.getMonth() + 1;
// 	//month
// 	var yr = d.getFullYear();
// 	//year
// 	var dw = d.getDay();
// 	//day in week

// 	// Readable feilds
// 	months = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
// 	var monName = months[d.getMonth()];
// 	//month Name
// 	var time = h + ":" + m + ":" + s;
// 	//full time show
// 	var thisDay = da + "/" + mon + "/" + yr;
// 	//full date show

// 	var dateTime = {
// 		seconds : s,
// 		minutes : m,
// 		hours : h,
// 		dayInMonth : da,
// 		month : mon,
// 		year : yr,
// 		dayInTheWeek : dw,
// 		monthName : monName,
// 		fullTime : time,
// 		fullDate : thisDay
// 	};
// 	return dateTime;

// 	function addZero(i) {
// 		if (i < 10) {
// 			i = "0" + i;
// 		}
// 		return i;
// 	}
// }








// //########################################################################
// var userId = window.sessionStorage.id;
// var counterDownTime;  //This will hold the remaining time left counter of a song
// $(document).ready(function() {
// 	$.ajax({
// 		type : "POST",
// 		url : 'http://localhost:8020/songsStolenFromMe',
// 		data : {
// 			userId : userId
// 		},
// 		success : function(data) {
// 			console.log(data);
// 			debugger
// 			if (data.success==1){
// 				$.each(data.songsList, function(key,song){
					
// 					if ( !is24HLeft(song.stealTimestamp) ){
// 						var songItem = $('<section class="song">');
// 						// Create circle
// 						var circle = $('<section class="circle'+ key +'">');

// 						// Create song data
// 						var songNameArtist = $('<section class="songData" data-url="' + song.url + '" >' + song.artist + ' - '+ song.songName + '</section>');
// 						var songCountDown = $('<section class="countDown'+ key +'"><span class="hours"></span><span> : </span><span class="minutes"></span></section>');
						
// 						countDown('countDown'+ key , song.stealTimestamp);
						
// 						songItem.append(songCountDown);
// 						songItem.append(songNameArtist);
// 						songItem.append(circle);
// 						songItem.append(songCountDown);

// 						// Add to the screen
// 						$("#songs").append(songItem);

// 						// Calc percent to show
// 						var percent = calcPercentOfSecondsFrom24H(song.stealTimestamp);

// 						$('.circle'+ key).circleProgress({
// 							/**
// 							 * This is the only required option. It should be from 0.0 to 1.0
// 							 * @type {number}
// 							 */
// 							value: calcPercentOfSecondsFrom24H(song.stealTimestamp) / 100,

// 							/**
// 							 * Size of the circle / canvas in pixels
// 							 * @type {number}
// 							 */
// 							size: 100.0,

// 							/**
// 							 * Initial angle for 0.0 value in radians
// 							 * @type {number}
// 							 */
// 							startAngle:  -Math.PI / 4 * 2,

// 							/**
// 							 * Width of the arc. By default it's auto-calculated as 1/14 of size, but you may set it explicitly in pixels
// 							 * @type {number|string}
// 							 */
// 							thickness: 'auto',

// 							/**
// 							 * Fill of the arc. You may set it to:
// 							 *   - solid color:
// 							 *   - { color: '#3aeabb' }
// 							 *   - { color: 'rgba(255, 255, 255, .3)' }
// 							 *   - linear gradient (left to right):
// 							 *   - { gradient: ['#3aeabb', '#fdd250'], gradientAngle: Math.PI / 4 }
// 							 *   - { gradient: ['red', 'green', 'blue'], gradientDirection: [x0, y0, x1, y1] }
// 							 *   - image:
// 							 *   - { image: 'http://i.imgur.com/pT0i89v.png' }
// 							 *   - { image: imageObject }
// 							 *   - { color: 'lime', image: 'http://i.imgur.com/pT0i89v.png' } - color displayed until the image is loaded
// 							 */
// 							fill: {
// 							  gradient: ['#2cf0b9', '#009bff'],
// 							  gradientAngle: Math.PI / 4,
// 							  color: '#FFFFF'
// 							},

// 							/**
// 							 * Color of the "empty" arc. Only a color fill supported by now
// 							 * @type {string}
// 							 */
// 							emptyFill: '#FFFFF',

// 							/**
// 							 * <a href="http://www.jqueryscript.net/animation/">Animation</a> config (see jQuery animations: http://api.jquery.com/animate/)
// 							 */
// 							animation: {
// 							  duration: 1200,
// 							  easing: 'circleProgressEasing'
// 							},

// 							/**
// 							 * Default animation starts at 0.0 and ends at specified `value`. Let's call this direct animation.
// 							 * If you want to make reversed animation then you should set `animationStartValue` to 1.0.
// 							 * Also you may specify any other value from 0.0 to 1.0
// 							 * @type {number}
// 							 */
// 							animationStartValue: 0.0,

// 							/**
// 							 * Reverse animation and arc draw
// 							 * @type {boolean}
// 							 */
// 							reverse: false,

// 							*
// 							 * Arc line cap ('butt' (default), 'round' and 'square')
// 							 * Read more: https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D.lineCap
// 							 * @type {string}
							 
// 							lineCap: 'butt',
// 							});
// 						//select the canvas and create classyloader
// 						//$('.loader:last').ClassyLoader(options);
// 					}else {
// 						// send to server this song to remove from my steal list
// 						// and re-enable the song at victims songs list
// 						giveBackSong_reenableVictimSong(song);
// 					}
// 				});
// 			}else{
// 				console.log(data.desc);
// 			}
// 		},
// 		error : function(objRequest, errortype) {
// 			console.log("Cannot get followd users Json");
// 		}
// 	});

// 	$('#backBtn').click(function(){
// 		window.location.href = "myLoot.html";
// 	});

// 	// Bind the swipeHandler callback function to the swipe event on div.box
// 	// on 'swipe-right'
// 	$("body").on( "swiperight", function ( event ){
// 		window.location.href = "stolenFromMe.html";
// 	});
// });


// //This function re-enables victim's stolen song.
// function giveBackSong_reenableVictimSong(song){
// 	console.log('song.userId ',song.userId);
// 	$.ajax({
// 		type : "POST",
// 		url : 'http://localhost:8020/giveBackSong',
// 		data : {
// 			userId : song.robberId,
// 			song : song.url,
// 			victimId : userId
// 		},
// 		success : function(data) {
// 			if (data.success){
// 				debugger
// 				console.log(data);
				
// 				}
// 			else 
// 				return false;
// 		},
// 		error : function(objRequest, errortype) {
// 				console.log("Cannot get followd users Json");
// 			}
// 		});
// }


// function is24HLeft(timestamp){
// 	// Calculate time from timestamp untill now
// 	debugger
// 	counterDownTime =  timeDifference( Date.now(), timestamp );
// 	console.log('time passed: ',counterDownTime);
// 	// If pass 48H
// 	if (counterDownTime.days >=1) return true;
// 	else return false;
// }

// // calculates the percentage of a given timestamp from a 24 hours timestamp
// function calcPercentOfSecondsFrom24H(timestamp){
// 	var daySec = 86400;// 24h in seconds
// 	var secDiffVal = Math.floor((Date.now() - timestamp) / 1000);
// 	var percent = parseInt( secDiffVal * 100 / daySec );
// 	return percent;
// }

// // This function returns the difference between two timestamps
// function timeDifference(dateNow,olderDate) {
//         var difference = dateNow - olderDate;

//         var daysDifference = Math.floor(difference/1000/60/60/24);
//         difference -= daysDifference*1000*60*60*24

//        var hoursDifference = Math.floor(difference/1000/60/60);
//         difference -= hoursDifference*1000*60*60

//         var minutesDifference = Math.floor(difference/1000/60);
//         difference -= minutesDifference*1000*60

//         var secondsDifference = Math.floor(difference/1000);

// 		return {
// 			days: daysDifference,
// 			hours: hoursDifference,
// 			minutes: minutesDifference,
// 			seconds: secondsDifference
// 		};
// }


// function countDown(element, userTs) {

//     var interval = setInterval(function() {
//     	//Saving an instance of the hours and minutes elements
//     	var remaningTime = (userTs + 86400000) - Date.now();
// 	    var hoursElem = $('.'+element + ' .hours');
// 		var minutesElem = $('.'+element + ' .minutes');
    	
// 		//Subtracting the days from the timestamp
//     	var d = Math.floor(remaningTime / 1000 / 60 / 60 / 24);
//         remaningTime -= d * 1000 * 60 * 60 * 24;

       
//         if(remaningTime == 0) {
//          	hoursElem.text("00");
//          	minutesElem.text("00");
//             clearInterval(interval);
//             return;
//         }

//         //Subtracting the hours from the timestamp
//         var hours = Math.floor(remaningTime / 1000 / 60 / 60);
//         remaningTime -= hours * 1000 * 60 * 60;
//         if (hours < 10) hours = "0" + hours;
//         hoursElem.text(hours);

//         //Subtracting the minutes from the timestamp
//         var minutes =  Math.floor(remaningTime / 1000 / 60);
//         remaningTime -= minutes * 1000 * 60;
//         if (minutes < 10) minutes = "0" + minutes;
//         minutesElem.text(minutes);

//     }, 1000);
// }




















