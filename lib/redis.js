var fs = require('fs');
var redis = require('redis');
var env =require('env2')('./config.env');
var port = process.env.REDIS_URL ;
var client = redis.createClient( port);

console.log('REDISPORT',port);




client.on('connect', function() {
    console.log('connected to Redis');
});



const addtoRedis = (obj) => {
		
		var postTitle = obj.title.trim();
		var date = Date.now();
		var author ="Tormod C Smith";
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


const addFileToRedis = (name, file) => {
	client.set(name ,file ,function (err, reply){
		 console.log('Successful upload');
	});

};

const getEmailNPwrd = (input, callback)=>{
     client.hgetall(input, function(err, user){
	     		
	     		console.log(user);
	     		return callback(err, user);
     });
};

const removePostFromList = ( list, input ) => {
	client.zrem(list, input, function(err, reply){
		console.log(reply);
	});
	client.hdel(input,'sortedPosts',function(err,reply){
		console.log(reply);
	});
};

const getFile = (file )=> {

	client.get(file , function(err,data){
		var path = __dirname + "/uploads/" + file;

		//writes file to file system accessible to FE.
		fs.writeFile(file,data,function(err){
			  if (err) {
       		  return console.error(err);
       		}
       		
		});
		console.log('GET FILE',data.length);
	


		
	});
};

module.exports = {
	addtoRedis : addtoRedis,
	getsortedPosts :getsortedPosts,
	getAllHashes:getAllHashes,
	getEmailNPwrd:getEmailNPwrd,
	removePostFromList:removePostFromList,
	addFileToRedis:addFileToRedis,
	getFile:getFile
};