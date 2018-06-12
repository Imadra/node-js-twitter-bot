var Twit = require('twit');
var config = require('./config');
var fs = require('fs');

var T = new Twit(config);

var stream = T.stream('user');

stream.on('follow', function(eventMsg) {
	var name = eventMsg.source.name;
	var screenName = eventMsg.source.screen_name;
	tweetIt('.@' + screenName + ' do you like coding?');
});

stream.on('tweet', function(eventMsg) {
	//var json = JSON.stringify(eventMsg, null, 2);
	//fs.writeFile('tween.json', json);

	var replyTo = eventMsg.in_reply_to_screen_name;
	var text = eventMsg.text;
	var from = eventMsg.user.screen_name;

	if(replyTo === 'rassulkhassen') {
		var newTweet = '@' + from + ' thanks for tweeting me!';
		tweetIt(newTweet);
	}
})

//tweeIt();
//setInterval(tweeIt, 1000*10);

tweetPic();

function tweetIt(txt) {
	var r = Math.floor(Math.random()*100);
	console.log('Someone followed me!');
	T.post('statuses/update', { status: txt }, function(err, data, response) {
	  console.log(data)
	})
}

function tweetPic() {
	var b64content = fs.readFileSync('../shopping-cart/public/images/fifa18.jpg', { encoding: 'base64' })
 
	// first we must post the media to Twitter
	T.post('media/upload', { media_data: b64content }, function (err, data, response) {
	  // now we can assign alt text to the media, for use by screen readers and
	  // other text-based presentations and interpreters
	  var mediaIdStr = data.media_id_string
	  var altText = "Coding continues..."
	  var meta_params = { media_id: mediaIdStr, alt_text: { text: altText } }
	 
	  T.post('media/metadata/create', meta_params, function (err, data, response) {
	    if (!err) {
	      // now we can reference the media and post a tweet (media will attach to the tweet)
	      var params = { status: 'love #coding', media_ids: [mediaIdStr] }
	 
	      T.post('statuses/update', params, function (err, data, response) {
	        console.log(data);
	      })
	    }
	  })
	})
}
//Search
/*T.get('search/tweets', { q: 'rainbow', count: 2 }, function(err, data, response) {
  var tweets = data.statuses;
  for(var i = 0; i < tweets.length; i++) {
  	console.log(tweets[i].text);
  }
})*/