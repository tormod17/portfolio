var fs = require('fs');
var redis = require('redis');
var port = process.env.REDIS_URL;
var client = redis.createClient(port);

client.on('connect', function() {
    console.log('connected to Redis');
}); 

const addToRedis = (hash, data, callback) => { 
    client.hmset(hash, data, function(err, reply) {
        if (err) {
            console.error(err);
            callback(err, reply);
        } else {
            callback(null, reply);
        }
    });
};

const getHash =(hash, callback) => {
    client.hgetall(hash, function(err, reply) {
        if (reply) {
            return callback(reply);
        } else {
            console.log('err', err);
        }
    });
};

const deleteHash = (hash, callback) => {
    client.del(hash, function(err, reply) {
        if (err) {
            console.error(err);
            callback(err, reply);
        } else {
            callback(null, reply);
        }
    });
};

const addPostToRedis = (obj, callback) => {
    var postTitle = obj.title.trim();
    var date = Date.now();
    client.hmset(postTitle, {
        ...obj,
        author: 'Tormod C Smith'
    }, function(error, reply) {
        (error) ? console.log('error adding hash'): console.log('success added to db', reply);
        client.ZADD('posts', date, postTitle, function(error, reply) {
            (error) ? console.log('error making sorted set'): console.log('success added to sorted set', reply);
            callback(error, reply);
        });
    }); 
};

const getsortedPosts = (list, callback) => {
    client.zrange(list, 0, -1, function(err, sortedPosts) {
        if (err) { 
            callback(err);
        } else {
            callback(sortedPosts);
        }
    });
};

const getAllPosts = (list, callback) => {
    getsortedPosts(list, function(sortedPosts) {
        var posts = {};
        let error = null;
        if (sortedPosts.length > 0) {
            sortedPosts.forEach(function(hash) {
                client.hgetall(hash, function(err, post) {
                    posts[hash]= post;
                    error = err;
                    if (Object.keys(posts).length === sortedPosts.length) {
                        callback(error, posts);
                    }
                });
            });
        } else {
            return callback(null, {});
        }
    });
};

const getPosts = (input, callback) => {
    client.hgetall(input, function(err, posts) {
        return callback(err, posts);
    });
};

const addFileToRedis = (name, file) => {
    client.set(name, file, function(err, reply) {
        console.log('Successful upload', reply);
    });

};

const getEmailNPwrd = (input, callback) => {
    client.hgetall(input, function(err, user) {
        console.log(user);
        return callback(err, user);
    });
};

const removePost = (list, input, callback) => {
    client.zrem(list, input, function(err, reply) {
        console.log(reply);
    });
    client.del(input, function(err, reply) {
        console.log(reply,  'post removed');
        callback(err, reply);
    });
};

const getFile = (file) => {
    client.get(file, function(err, data) {
        fs.writeFile(file, data, function(err) {
            if (err) {
                return console.error(err);
            }

        });
        console.log('GET FILE', data.length);
    });
};

module.exports = {
    getPosts,
    addToRedis,
    addPostToRedis,
    getsortedPosts,
    getAllPosts,
    getEmailNPwrd,
    removePost,
    addFileToRedis,
    getFile,
    getHash,
    deleteHash
};
