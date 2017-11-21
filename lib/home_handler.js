var redis = require('./redis.js');

function home_handler(request, reply) {
    // show the registration form until its submitted correctly
    redis.getAllPosts('posts', (postsArr) => {
        if(!postsArr) {
            return reply.view('index');
        }
        var allBlogs = {};
        postsArr.reverse().map((obj) => {
            obj.body = obj.body;
            var timeNdate = new Date(Number(obj.date));
            obj.date = timeNdate;
        });
        allBlogs.blogs = postsArr;
        allBlogs.title = 'Work In Progress, Learning Blog';
        reply.view('index', allBlogs);

    });
}

module.exports = home_handler;