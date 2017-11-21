'Use strict';

const Hapi = require('hapi');
const server = new Hapi.Server();
const port = process.env.PORT || 3000;

const Inert = require('inert');
require('path');
const Vision = require('vision');
const Handlebars = require('handlebars');

const Login = require('hapi-login');

var custom_fields = require('./lib/custom_fields');

const login_handler = require('./lib/login_handler.js');
const signup_handler = require('./lib/signup_handler.js');
const redis_handler = require('./lib/redis_handler.js');
const blog_handler = require('./lib/blog_handler.js');
const upload_handler = require('./lib/upload_handler');
const uploadcare_handler =require('./lib/uploadcare_handler.js');
const home_handler = require('./lib/home_handler.js');

var options = {
    fields: custom_fields,
    handler: login_handler,
    fail_action_handler: login_handler
};


var HapiLogin = {
    register: Login,
    options
};

server.connection({ port });

const plugins = [
    Inert,
    Vision,
    HapiLogin
];

server.register(plugins, (err) => {

            if (err) console.error(err);

            server.views({
                engines: { html: Handlebars },
                relativeTo: __dirname,
                path: 'views'
            });

            server.route([{
                        method: 'GET',
                        path: '/',
                        handler: home_handler
                    }, {
                        method: 'GET',
                        path: '/assets/{params*}',
                        handler: {
                            directory: {
                                path: 'assets/'
                            }
                        }
                    },
                    {
                        method: 'GET',
                        path: '/lib/uploads/{params*}',
                        handler: {
                            directory: {
                                path: 'lib/uploads/'
                            }
                        }
                    },

                    {
                        method: 'GET',
                        path: '/blogLogin',
                        handler: (request, reply) => reply.view('login')
                    }, {
                        method: ['POST', 'GET'],
                        path: '/blogpage',
                        handler: login_handler

                    },{
                        method: ['POST', 'GET'],
                        path: '/blogger/{params*}',
                        handler: blog_handler

                    },{
                        method: 'POST',
                        path: '/signup',
                        handler: signup_handler

                    }, {
                        method: ['POST', 'GET'],
                        path: '/redis/{params*}',
                        handler: redis_handler
                    }, {
                        method: 'POST',
                        path: '/uploadcare',
                        handler: uploadcare_handler
                    },

                    {
                        method: 'POST',
                        path: '/upload',
                        config: {
                            payload: {
                                maxBytes: 209715200,
                                output: 'stream',
                                parse: true,
                                allow:'multipart/form-data'                          	}
                            },
                        handler: upload_handler
                    }

                    ]);

            });

        server.start(err => {
            if (err) throw err;
            console.log('Server is running at : ' + server.info.uri);
        });
