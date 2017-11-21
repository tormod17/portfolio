var bcrypt = require('bcrypt'); 
var redis = require('./redis.js');

function blog_handler(request, reply) {
    // show the registration form until its submitted correctly

    var blogInfoVisitor = {
        title: 'Enjoy reading',
        name: 'visitor'
    };
    var blogInfoMe = {
        title: 'Enjoy Editing',
        name: 'Tormod'
    };

    if(!request.params.editor) {
        return reply.file('./public/blogger.html');
    }

    if (request.query === 'editing1234') {
        return  reply.view(request.url);            
    }
    if (request.query.user === 'me') {
        return  reply.view('blog', blogInfoMe);
    } else if (request.query.user === 'visitor') {
        return  reply.view('blog', blogInfoVisitor);
    }
}

module.exports = blog_handler;
