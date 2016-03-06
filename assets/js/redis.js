const env = require('env2')('./config.env');
var redis = require('redis');
var client = redis.createClient();

if (process.env.REDISCLOUD_URL) {
	var redisCloud = require("url").parse(process.env.REDISCLOUD_URL);
	var client = redis.createClient(process.env.REDISCLOUD_URL, {no_ready_check: true})

} else {
	var client = require("redis").createClient();
}




client.on('connect', function() {
    console.log('connected to Redis');
});



const addtoRedis = (obj) => {
		
		var postTitle = obj.title;
		obj.date = Date.now();
		client.hmset(postTitle, {
				'author': obj.author,
				'body' :  obj.body,
				'date':   obj.date,
				},function(error,reply){
					(error) ? console.log('error adding hash') : console.log('success added to db')
			  }
		);
		client.ZADD('sortedPosts', obj.date , postTitle , function(error,reply){
			(error) ? console.log('error making sorted set') : console.log('success added to sorted set')
			}
		);
};

const getsortedPosts = (list , callback) => {
	
		client.zrange(list, 0 ,-1,function (err, sortedPosts){
			if (err) { console.log('nothing to get')};
			console.log('SP',sortedPosts);
			(callback) ?  callback(sortedPosts) : sortedPosts;
		});
	
};

const getAllHashes = (list ,callback ) => {
	
		getsortedPosts(list,function(sortedPosts){
			var postsArr=[];
			sortedPosts.forEach(function(hash) {
					client.hgetall(hash ,function(err, posts){
						postsArr.push(posts);
						if (sortedPosts.length === postsArr.length) { return callback(postsArr) } else { console.log('err')}

			         });
			});
 		

		});

};

module.exports = {
	addtoRedis : addtoRedis,
	getsortedPosts :getsortedPosts,
	getAllHashes:getAllHashes,
	
};