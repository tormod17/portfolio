var bcrypt = require('bcrypt'); // github.com/chriso/validator.js
const saltRounds = 10;

var redis = require('./redis.js');


function signup_handler(request, reply) {
  var payload = Object.assign({},request.payload);

  redis.getEmailNPwrd(payload.email, function(err, user) { 
    if (!user){
      return reply('You\'re not an admin sorry');
    }

    if (user && user.email && user.password) {
       bcrypt.compare(payload.password, user.password, function(err, isValid) {
          if (isValid) {
            bcrypt.hash(payload.newpassword, saltRounds, function(err, hash) {
            // Store hash in your password DB.
              if (hash) {
                const newPassword = hash;
                const data = {
                  password: newPassword,
                  email: payload.email
                };
                redis.addToRedis(user.email, data, function(err, res) {
                  if (err) {
                    console.error(err);
                    reply('Password wasn\'t set');
                  }
                  reply('Password has been set');
                });
              }
            });
          } else {
             return reply('Password mis-match');
          }
       });
    }

    if (user && user.email && !user.password) {
      console.log('no user password');
      // hash the password the save it. 
      bcrypt.hash(payload.password, saltRounds, function(err, hash) {
      // Store hash in your password DB.
        if (hash) {
          const newPassword = hash;
          const data = {
            password: newPassword,
            email: payload.email
          };
          redis.addToRedis(user.email, data, function(err, res) {
            if (err) {
              console.error(err);
              reply('Password wasn\'t set');
            }
            reply('Password has been set');
          });
        }
      });
    }

  });
}

module.exports = signup_handler;
