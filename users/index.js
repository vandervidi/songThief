//Reference to USER schema model object
var UserM =  require('../dao').UserM;

//This function returns a list of songs a user stole from his friends
exports.getSongsIStole = function(req,res){	
	var victims = {};
	UserM.aggregate(
	  {$match: {userId: req.body.userId}},
	  {$unwind: '$mySteal'},
	  {$group: {'_id':'$_id', 'songs': {'$push': '$mySteal'}, 'victims': {'$push' : '$mySteal.userId'} }}, function (err, doc) {
	  	if (err) return res.json({success: 0});
	  	console.log(doc)
  		  	if(doc.length > 0){
		  		UserM.find({ 'userId' : { $in : doc[0].victims } },'userId profilePic' ,function (err, victimsDoc) {
		  			if (err) return res.json({success: 0});
						console.log("victimsDoc: ", victimsDoc)
						for(var i = 0; i < victimsDoc.length; i++){
							victims[victimsDoc[i].userId] = victimsDoc[i].profilePic;
						}

						if (doc[0].songs.length >0){
							res.json({success:1, songsList: doc[0].songs, victims: victims});
						}else{
							res.json({success:2, desc:'List of songs stolen from me is empty'});
						}	
		  		});	
  			}else{
				res.json({success:2, desc:'List of songs stolen from me is empty'});
			}	
	  });
	};


// This function connects to the database and returns a list of songs stolen from a user
// and returns a songs list with response object
exports.getSongsStolenFromMe = function(req, res){
	var robbers = {};
	UserM.aggregate(
	  {$match: {userId: req.body.userId}},
	  {$unwind: '$mySongs'},
	  {$match: {'mySongs.stolen': true}},
	  {$group: {'_id':'$_id', 'songs': {'$push': '$mySongs'}, 'robbers': {'$push' : '$mySongs.robberId'} }}, function (err, doc) {
	  	if (err) return res.json({success: 0});

	  	if(doc.length > 0){
		  		UserM.find({ 'userId' : { $in : doc[0].robbers } },'userId profilePic' ,function (err, robbersDoc) {
		  			if (err) return res.json({success: 0});
						
						for(var i = 0; i < doc[0].robbers.length; i++){
							robbers[robbersDoc[i].userId] = robbersDoc[i].profilePic;
							
						}

						if (doc[0].songs.length >0){
							res.json({success:1, songsList: doc[0].songs, robbers: robbers});
						}else{
							res.json({success:2, desc:'List of songs stolen from me is empty'});
						}	
		  		});	
	  	}else{
				res.json({success:2, desc:'List of songs stolen from me is empty'});
			}	
	  })};


// This function returns a user's robbers Facebook Id's
exports.getRobbers = function(req, res){
	var responseData = [];
	UserM.findOne({ 'userId' : req.body.userId }, function (err, doc) {
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
						doc.robbers = [];
						doc.save();

						var songsAreBackStatus; 
						console.log('userDoc: ',doc);
						//This is used to configure proper navigation in the robbery notifications page
						if(doc.robbersGiveBackSong.length > 0){
							songsAreBackStatus = true;
						}else{
							songsAreBackStatus = false;
						}
							
						res.json({ success: 1, robbersData: responseData, songsAreBack: songsAreBackStatus });
		});
	});
};


exports.getRobbersOfSongsThatAreBack = function(req, res){
	var responseData = [];
	UserM.findOne({ 'userId' : req.body.userId }, 'robbersGiveBackSong', function (err, doc) {
		if (err) return res.json({success: 0});
		console.log("robbers give back song array: ", doc.robbersGiveBackSong);
	// Find all robbers documents from the DB.
	UserM.find({ 'userId' : { $in : doc.robbersGiveBackSong } }, function (err, robbersDoc) {
					if (err) return res.json({success: 0});

					for(var i = 0; i < doc.robbersGiveBackSong.length; i++){
						console.log("### Robber's doc: ",robbersDoc[i] );
						responseData.push({
							robberId: robbersDoc[i].userId,
							profilePic: robbersDoc[i].profilePic,
						});
					}
					
					//This is used to configure proper navigation in the robbery notifications page
					if(doc.robbersGiveBackSong.length > 0)
						songsAreBack = true;
					else
						songsAreBack = false;

					//Reset the array
					doc.robbersGiveBackSong = [];
					doc.save();

					res.json({ success: 1, robbersData: responseData, songsAreBack: songsAreBack });
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

		// Find each friend in the DB --> that really have song in 'mySongs'
		UserM.find({ 'userId' : { $in : doc.friends } }, function (err, friendDoc) {
			if (err) return res.json({success: 0});
			else{
				console.log('friendDoc: ',friendDoc);
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
	
	UserM.findOne({ userId: req.body.userId}, function (err, doc){
		if (err) return res.json({success: 0});
		if (!!doc){
			
			// The user exists then modify friends list
			doc.profilePic = req.body.profilePic;	//update profile picture
			doc.friends = ["11111","22222","33333","44444","55555"];		//update friends list (Static friends)
			doc.save(function(err){
				if (err){
					console.log("########## Could not modify user. ERROR: ", err);
					res.json({success: 0, desc: "Could not modify user"});
				}
			});
			
			console.log("########## User is modified");

			var songAreBackStatus,robbedStatus;
			// if there are any songs that came back from robbery then songsAreBack == true.
			if(doc.robbersGiveBackSong.length > 0){
				songAreBackStatus = true;
			}else{
				songAreBackStatus = false;
			}			


			if(doc.robbers.length > 0){
				robbedStatus = true;
			}else{
				robbedStatus = false;
			}	

			res.json({success: 1, isRobbed: robbedStatus, songAreBack: songAreBackStatus});
			  		
	 	}else {
	 		// Create a new user
			// Step 1: Create a new model
			var newUser = new UserM({
				userId: req.body.userId,
				profilePic: req.body.profilePic,
				location: {
					lat: req.body.location.lat,
					lng: req.body.location.lng
				},
				//friends: req.body.friendsList
				friends: ["11111","22222","33333","44444","55555"]
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
	
	console.log('rob from: '+ req.body.victimId);
	
	UserM.findOne(
    		{'userId' : req.body.victimId}, function (err, doc) {
				var songAvailable = [];
				for(var i=0; i<doc.mySongs.length;  i++){
					if (!doc.mySongs[i].stolen){
						songAvailable.push(i);
					}
				}
				console.log("songAvailable: ", songAvailable);
		// Get random song from 'songAvailable' array
		var randomSongIndexPtr =  randomIntFromInterval(0,songAvailable.length -1);
		console.log("randomSongIndexPtr: ", randomSongIndexPtr);
		var randomSongIndex = songAvailable[randomSongIndexPtr];
		console.log("randomSongIndex", randomSongIndex);
		doc.mySongs[ randomSongIndex ].stolen = true;
		doc.mySongs[ randomSongIndex ].stealTimestamp = req.body.stealTimestamp;
		doc.mySongs[ randomSongIndex ].robberId = req.body.robberId;
		doc.robbers.push(req.body.robberId);
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
	});
};

// This function unlocks a song that its robbery time is over, to the 
exports.giveBackSong = function(req, res){

	console.log('giveBackSong() userId ',req.body.userId);
	console.log('giveBackSong() song ',req.body.song);
	console.log('giveBackSong() song ',req.body.victimId);

	//Remove this song from robbers 'mySteal' array.
	UserM.update(
		{userId: req.body.userId} ,
		{ $pull: { 'mySteal': { url: req.body.song } } } 
		,function(err, effectedDoc1){
			if (err) return res.json({ success: 0, desc: err });
	  		else{
	  			//Push the robber's user ID into the victim's robbersGiveBackSong array.
	  			// It is used later to notify the victim for songs that are given back to him (after 24 hours of captivity)
				// Return only the firs elements from mySongs array matching the query and then 
	  			//  re-enable the song in victimId mySongs list
				UserM.update(
					{userId: req.body.victimId, 'mySongs.url': req.body.song  } ,
					{ 	'mySongs.$': 1 ,
						$push: { 'robbersGiveBackSong' : req.body.userId },
						$set: {'mySongs.$.stolen' : false, 'mySongs.$.stealTimestamp' : -1, 'mySongs.$.robberId' : -1 } 
					},

					function(err, effectedDoc2){
						if (err) return res.json({success: 0, desc: err});
	  					else{
							res.json({ success: 1});
						}
				});
			}
		});
}


exports.canRob = function(req, res) {
	//  get all available songs  - Available = are robbable
	UserM.aggregate(
	  	{$match: {userId: req.body.victimId}},
	  	{$unwind: "$mySongs"},
	  	{$match: {"mySongs.stolen": false}}, function(err,docs){
			res.json({ success: 1, docs: docs });
	});
}


// Create random number between 2 numbers
function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

