var validator = require('validator');
var Bcrypt = require('bcrypt'); // github.com/chriso/validator.js

var redis = require('./redis.js');


function extract_validation_error(error) {
    var key = error.data.details[0].path;
    err = {}
    err[key] = {
        class: 'input-error', // css class
        message: error.data.details[0].message // Joi error message
    }
    return err;
}

/**
 * return_values extracts the values the person submitted if they
 * submitted the form with incomplete or invalid data so that
 * the form is not "wiped" each time it gets valdiated!
 * @param {Object} error - see: http://git.io/vciZd
 * @returns {Object} values - key:value pairs of the fields
 * with the value sent by the client.
 */
function return_form_input_values(error) {
    // var values;
    // if(error.data && error.data._object) { // see: http://git.io/vciZd
    var values = {};
    var keys = Object.keys(error.data._object)
    keys.forEach(function(k) {
        values[k] = validator.escape(error.data._object[k]);
    });
    // }
    return values;
}

/**
 * register_handler is a dual-purpose handler that initially renders
 * the registration form but is re-used to display the form with any
 * Joi validation errors to the client until they input valid info
 * @param {Object} request - the hapi request object
 * @param {Object} reply - the standard hapi reply object
 * @param {String} source - source of the invalid field e.g: 'payload'
 * @param {Object} error - the error object prepared for the client
 * response (including the validation function error under error.data
 */

function login_handler(request, reply) {
    // show the registration form until its submitted correctly
     if (Object.keys(request.payload || {}).length === 0 ) {
        return reply.view('firebaseBlog', {title: 'Let\'s write', name: 'friend'})
     }

    redis.getEmailNPwrd(request.payload.username, function(err, user) {

        var hashPword = Bcrypt.hashSync(request.payload.password, 10);

        if (user === null) {
            reply.view('index');
        } else {
            //Bcrypt.compare(hashPword, user.password, function(err, isValid) {
            // to set the encrypted password we need a signup area to start with.
            var isValid = request.payload.password === user.password;  // enter password in the database unencrypted.
            if (isValid) {
                reply.view('firebaseBlog', {
                    title: 'Let\'s write',
                    name: 'Tormod'
                });
            } else {
                console.log('PASSWORD MISMATCH', isValid);
                reply.view('index');
            }
            //});
        }
    });
}

module.exports = login_handler;
