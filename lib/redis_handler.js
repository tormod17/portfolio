var redis =require('./redis.js');

function redis_handler(request,reply){
  const { query, payload, params } =  request;

  const handleResponse = (err, res) => {
    if(err) {
      console.error(err);
      return reply(err);
    } else {
      return  reply(res);            
    }
  };
  const payloadObj = JSON.parse(payload);
  const paramValue = Object.values(params)[0];

  if (paramValue){
    switch (true) {
      case paramValue === 'posts':
        redis.getAllPosts(paramValue, handleResponse);
        break;
      case paramValue === 'delete':
        redis.removePost( 'posts', query.hash, handleResponse);
        break;
      case paramValue === 'addPost':
        redis.addPostToRedis(payloadObj, handleResponse);       
        break;
      case paramValue === 'add' :
        redis.addToRedis(query.hash, payloadObj, handleResponse);
        break;
      case paramValue === 'update':
        redis.addToRedis(query.hash, payloadObj, handleResponse);
        break;
      case paramValue === 'get':
        redis.getHash(query.hash, handleResponse);
        break;

    }
  }
}

module.exports = redis_handler;