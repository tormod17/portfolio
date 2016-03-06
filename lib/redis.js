
var redis = require('redis');
var env =require('env2')('./config.env');
var port = process.env.REDIS_URL ;
var client = redis.createClient( port);

console.log('REDISPORT',port);




client.on('connect', function() {
    console.log('connected to Redis');
});



const addtoRedis = (obj) => {
		
		var postTitle = obj.title;
		var date = Date.now();
		var author ="Tormod C Smith"
		client.hmset(postTitle, {
				'title':  obj.title,
				'author': author,
				'body' :  obj.body,
				'date':   date,
				},function(error,reply){
					(error) ? console.log('error adding hash') : console.log('success added to db')
			  }
		);
		client.ZADD('sortedPosts', date , postTitle , function(error,reply){
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
			if(sortedPosts.length > 0){
					sortedPosts.forEach(function(hash) {

							client.hgetall(hash ,function(err, posts){
								postsArr.push(posts);
								if (sortedPosts.length === postsArr.length) {
								 return callback(postsArr)
								  } else {
								 console.log('err')
								}

					         });
					});
			} else {
				console.log('there are no posts');
				return callback(postsArr);

			}
 		

		});

};

module.exports = {
	addtoRedis : addtoRedis,
	getsortedPosts :getsortedPosts,
	getAllHashes:getAllHashes
	
};