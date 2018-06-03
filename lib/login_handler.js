var bcrypt = require('bcrypt'); 
var redis = require('./redis.js');

function login_handler(request, reply) {
    // show the registration form until its submitted correctly
    var payload =Object.assign({}, request.payload);

    if (Object.keys(payload || {}).length === 0) {
        return  reply.redirect('/blog?user=visitor');
    }
    redis.getEmailNPwrd(payload.email, function(err, user) { 
        if (user === null) {
            console.log('USER FAIL', user);
            reply.view('index');
        } else {

            bcrypt.compare(payload.password, user.password, function(err, isValid) {
                if(err) {
                    console.error(err);
                }
                if (isValid) {
                    reply.redirect('blogger?user=editing');
                } else {
                    console.log('PASSWORD MISMATCH');
                    reply.view('index');
                }
            });
        }
    });
}

module.exports = login_handler;
