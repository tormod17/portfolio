'Use strict';


const Hapi = require('hapi');
const server = new Hapi.Server();
const port = process.env.PORT || 3000;

const Inert = require('inert');
require('path');
const Vision = require('vision');
const Handlebars = require('handlebars');

const redis = require('./lib/redis.js');

const Login = require('hapi-login');

/*
const Bcrypt = require('bcrypt');
const Joi = require('joi');*/


var custom_fields = require('./lib/custom_fields');

const login_handler = require('./lib/login_handler.js');
const addPost_handler = require('./lib/addPost_handler.js');
const upload_handler = require('./lib/upload_handler');
const uploadcare_handler =require('./lib/uploadcare_handler.js');



var opts = {
    fields: custom_fields,
    handler: login_handler,
    fail_action_handler: login_handler
};


var HapiLogin = {
    register: Login,
    options: opts
};


server.connection({
    port: port
});

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
                path: 'public'


            });

            server.route([{
                        method: 'GET',
                        path: '/',
                        handler: (request, reply) => {


                            redis.getAllHashes('sortedPosts', (postsArr) => {
                                console.log('GAH', postsArr.length);
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
                        handler: (request, reply) => {
                            reply.view('login');
                        }

                    }, {
                        method: 'POST',
                        path: '/blogpage',
                        handler: login_handler

                    }, {
                        method: 'POST',
                        path: '/redis',
                        handler: addPost_handler
                    }, {
                        method: 'POST',
                        path: '/redis/delete',
                        handler: (request, reply) => {
                            console.log('DEL', request.payload.post_name);
                            redis.removePostFromList('sortedPosts', request.payload.post_name);
                            redis.getFile('new-file');
                            reply.view('blog', {
                                title: 'Let\'s write',
                                name: 'friend'
                            });
                        }
                    },
                    {
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
                                allow:'multipart/form-data'
                            	}
                            },
                        handler: upload_handler
                    }

                    ]);

            });

        server.start(err => {
            if (err) throw err;
            console.log('Server is running at : ' + server.info.uri);
        });
