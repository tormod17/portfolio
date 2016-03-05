"Use strict";

const Hapi = require('hapi');
const server = new Hapi.Server();
const port = process.env.PORT || 3000;
const env = require('env2')('./config.env');
const Inert = require('inert');
const Path =require('path');
const Vision = require('vision');
const Handlebars = require('handlebars');

const redis = require('./assets/js/redis.js');

server.connection({
	port:port	
});

const plugins = [
		Inert,
		Vision
];

server.register(plugins,(err) => {

		if(err) console.log(err);

		server.views({
			engines:{html:Handlebars},
			relativeTo:__dirname,
			path:'public'


		});

		server.route([{
				method:'GET',
				path:'/',
				handler:(request, reply) => {
					  	  var obj={};
						  
						  redis.emptyCheck( function(count){
						  		 if (count < 1) {
	  							console.log('empty');
	  							reply.view('index');
	  							} else {
	  							console.log('full');
	  							}
						  });
                          
                          redis.getAllHashes('sortedPosts',(postsArr) => {
                          		if(err){ reply.view('index')}
                          		obj.blogs = postsArr;
                          	
                          		console.log(obj);
                          		reply.view('index', obj);

						  });
                      		
                    		
						}
					  
				},
				{
					method:'GET',
					path:'/assets/{params*2}',
					handler:{
						directory: {
							path:'assets/'
							}						
						}
				},
				{
					method:'GET',
					path:'/assets/{params*3}',
					handler:{
						directory: {
							path:'assets/'
							}						
						}
				},
				{
					method:'GET',
					path:'/assets/{params*4}',
					handler:{
						directory: {
							path:'assets/'
							}						
						}
				},
				{
					method :'GET',
					path:'/blog',
					handler:(request,reply) => {
						reply.view('blog', {title:'Let\'s write'});
						}

				},
				{
					method:'POST',
					path:'/blog',
					handler: (request ,reply) => {
							console.log('PAYLOAD', request.payload);
							console.log('PAYLOAD', request.headers);

							redis.addtoRedis(request.payload);
							reply.redirect('/blog');
						}
					
				}
		
			
		]);

});

server.start(err => {
	if (err) throw err;
	console.log('Server is running at : ' + server.info.uri);
});
