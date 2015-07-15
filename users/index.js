//Reference to USER schema model object
var UserM =  require('../dao').UserM;

//This function returns a list of songs a user stole from his friends
exports.getSongsIStole = function(req,res){	
	UserM.findOne({ 'username' : req.body.userId }, 'mySteal', function (err, doc) {
		if (err) return handleError(err);
		res.json(doc.mySteal);
	});
};


// This function connects to the database and returns a list of songs stolen from a user
// and returns a songs list with response object
exports.getSongsStolenFromMe = function(req, res){
	
	UserM.findOne({ 'userId' : req.body.userId}, 'mySongs', function (err, doc) {
		if (err) return handleError(err);

		var songsStealed = [];
		for (var i = 0; i < doc.mySongs.length; i++){
			//console.log(doc.mySongs[i])
			if (doc.mySongs[i].stolen){
				songsStealed.push(doc.mySongs[i]);
			}
		}
		res.json(songsStealed);
	});
};

// This function returns a user's robbers Facebook Id's
exports.getRobbers = function(req, res){
	var responseData = [];
	UserM.findOne({ 'userId' : req.body.userId }, 'robbers', function (err, doc) {
		if (err) return res.json({success: 0});

	// Find all robbers documents from the DB.
	UserM.find({ 'userId' : { $in : doc.robbers } }, function (err, robbersDoc) {
					if (err) return res.json({success: 0});

					for(var i = 0; i < doc.robbers.length; i++){
						responseData.push({
							robberId: robbersDoc[i].userId,
							profilePic: robbersDoc[i].profilePic,
						});
					}
					// Reset robbers list and reset 'needShowMessage' message
					doc.needShowMessage = false;
					doc.robbers = [];
					doc.save();
					res.json({ success: 1, robbersData: responseData });
				});
	});
};

// This function returns a user's friends list
exports.getFriendsLocations = function(req, res){
	var responseData = [];
	// Get logged-in user's friends list
	UserM.findOne({ 'userId' : req.body.userId },  function (err, doc) {
		if (err) return res.json({success: 0});
			console.log("logged-in user document: ", doc)
			console.log("he has: " + doc.friends.length + "Friends")

				// Find each friend in the DB 
				UserM.find({ 'userId' : { $in : doc.friends } }, function (err, friendDoc) {
					if (err) return res.json({success: 0});
					else{
						console.log(friendDoc)
						for(var i = 0; i < doc.friends.length; i++){
							responseData.push({
								friendId: friendDoc[i].userId,
								profilePic: friendDoc[i].profilePic,
								location: {
									lat: friendDoc[i].location.lat,
									lng: friendDoc[i].location.lng 
								}
							});
						}
					}
					res.json({ success: 1, friendsData: responseData });
				});	
	});
};

// This function connects to the database and checks if the credentials the user supplied
// are valid.
exports.connect = function(req,res){
	console.log('connect()');

	UserM.findOne({ userId: req.body.userId}, function (err, doc){
		if (err) return res.json({success: 0});
		if (!!doc){
			
			// The user exists then modify friends list
			doc.profilePic = req.body.profilePic;	//update profile picture
			doc.friends = req.body.friendsList;		//update friends list
			doc.save(function(err){
				console.log("########## Could not modify user. ERROR: ", err);
			});
			console.log("########## User is modified");
			res.json({success: 1, isRobbed: doc.needShowMessage});
			  		
	 	}else {
	 		// Create a new user
			// Step 1: Create a new model
			
			var newUser = new UserM({
				userId: req.body.userId,
				profilePic: req.body.profilePic, 
				needShowMessage: false,
				location: {
					lat: req.body.location.lat,
					lng: req.body.location.lng
				},
				friends: req.body.friendsList
			});
			console.log("########## Add new user: Step 1/2: Created successfully a new user model");
			// Step 2: Save it in the database
			newUser.save(function(err, doc){
				if (err) return res.json({success: 0});
		  		else{
		  			console.log("########## Add new user: Step 2/2: Saved the user in the database");
		  			res.json({success: 1});

		  		}
			});
	  	}
	});
};

// This function robbs a song from selected user
exports.rob = function(req, res){
	//var responseData = [];
	
	// UserM.aggregate(
	//   {$match: {userId: req.body.victimId}},
	//   {$unwind: '$mySongs'},
	//   {$match: {'mySongs.stolen': false}}, function (err, doc) {
	
	console.log('rob from: '+req.body.victimId);
	
	
	//aggregate.group({_id:’$cust_id’, total: {$sum: ‘$amount’}});

	// var aggregate = UserM.aggregate();
	// aggregate.match({userId: req.body.victimId});
	// aggregate.group({ mySongs: {$match: {mySongs.stolen: false}}});
	// aggregate.exec(function(err,results){
	// 	res.json({success: results});
	// });


	
	UserM.findOne(
    		{'userId' : req.body.victimId}, function (err, doc) {

	
		var songAvailable = [];
		for(var i=0; i<doc.mySongs.length;  i++){
			if (!doc.mySongs[i].stolen){
				songAvailable.push(i);
			}
		}

		// Get random song from 'songAvailable' array
		var randomSongIndexPtr =  randomIntFromInterval(0,songAvailable.length);

		var randomSongIndex = songAvailable[randomSongIndexPtr];
		doc.mySongs[ randomSongIndex ].stolen = true;
		doc.mySongs[ randomSongIndex ].stealTimestamp = Date.now();
		doc.robbers.push(req.body.robberId);
		doc.needShowMessage = true;
		doc.save();


		// Update robber document
		console.log("Robber ID#: ", req.body.robberId);

		var query = {'userId' : req.body.robberId};
		var update = {$push: {mySteal: {
    				url: doc.mySongs[ randomSongIndex].url,
    				songName: doc.mySongs[ randomSongIndex].songName,
    				artist: doc.mySongs[ randomSongIndex].artist,
    				stealTimestamp: doc.mySongs[ randomSongIndex].stealTimestamp,
    				userId: req.body.victimId
    			} }};
    	var options = {new: true};
		
		UserM.findOneAndUpdate(query, update, options, function(err,robberDoc) {
			if (err) return res.json({success: 0, desc: err});
	  		else{
	  			res.json({success: robberDoc});
	  		}
		});
		


		// UserM.update(
  //   		{'userId' : req.body.robberId}, {
  //   			$push: {
  //   				url: doc.mySongs[ randomSongIndex].url,
  //   				songName: doc.mySongs[ randomSongIndex].songName,
  //   				artist: doc.mySongs[ randomSongIndex].artist,
  //   				stealTimestamp: doc.mySongs[ randomSongIndex].stealTimeStamp,
  //   				userId: req.body.victimId

  //   			} 
  //   		}).exec(function (err, robberDoc) {
  //   			res.json({success: robberDoc});
  //   			// doc.mySteal.push({
  //   			// 	url: doc.mysongs[ randomSongIndex].url,
  //   			// 	songName: doc.mysongs[ randomSongIndex].songName,
  //   			// 	artist: doc.mysongs[ randomSongIndex].artist,
  //   			// 	stealTimestamp: doc.mysongs[ randomSongIndex].stealTimeStamp,
  //   			// 	userId: req.req.body.victimId

  //   			// });

		
		// //Update
		// //doc.save();

		// });





		//res.json( doc.mySongs[ randomSongIndex ]);
		
		//Update
		//doc.save();

	});

		// // Find each friend in the DB 
		// UserM.find({ 'userId' : { $in : doc.friends } }, function (err, friendDoc) {
		// 	if (err) return res.json({success: 0});
		// 	else{
		// 		console.log(friendDoc)
		// 		for(var i = 0; i < doc.friends.length; i++){
		// 			responseData.push({
		// 				friendId: friendDoc[i].userId,
		// 				profilePic: friendDoc[i].profilePic,
		// 				location: {
		// 					lat: friendDoc[i].location.lat,
		// 					lng: friendDoc[i].location.lng 
		// 				}
		// 			});
		// 		}
		// 	}
		// 	res.json({ success: 1, friendsData: responseData });
		// });	
	// });
};

exports.canRob = function(req, res) {
	//Working - get all available songs
	UserM.aggregate(
	  	{$match: {userId: req.body.victimId}},
	  	{$unwind: "$mySongs"},
	  	{$match: {"mySongs.stolen": false}}, function(err,docs){
			res.json({ success: 1, docs: docs });
	});
}

// Create random number between 2 numbers
function randomIntFromInterval(min,max) {
    return Math.floor(Math.random()*(max-min+1)+min);
}
>>>>>>> 6bfba41fb8807f7ce9c927ca79ef117ee8320deb
