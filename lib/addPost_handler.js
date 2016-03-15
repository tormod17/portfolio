var redis =require('./redis.js');

function addPost_handler(request,reply){
    console.log('POST HANDLER',request.payload);
    redis.addtoRedis(request.payload);
	reply.view('blog');

}

module.exports = addPost_handler;