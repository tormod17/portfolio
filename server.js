"Use strict";

const Hapi = require('hapi');
const server = new Hapi.Server();
const port = process.env.PORT || 3000;

const Inert = require('inert');
const Path =require('path');
const Vision = require('vision');
const Handlebars = require('handlebars');

const redis = require('./lib/redis.js');


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
					 
						  
						   redis.getAllHashes('sortedPosts',(postsArr) => {
                          	   		console.log('GAH', postsArr.length);
	                          	    var obj={};
	                          		postsArr.map( (obj) => {
	                          		 			obj.date=  new Date(obj.date);
	                          		            obj.body= obj.body.replace(/<(?:.|\n)*?>/gm, '');
	                          		});

		                          		obj.blogs = postsArr;
		                          		obj.title ='Work In Progress, Learning Blog'
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
						reply.view('blog', {	
											title:'Let\'s write',
																				});
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
