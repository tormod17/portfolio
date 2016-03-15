var fs = require('fs');
var redis = require('./redis.js');

function upload_handler(request, reply) {

  		
  		var data  =request.payload;
  	
  		if (data.file) {
                var name = data.file.hapi.filename;
                var path = __dirname + "/uploads/" + name;
                var file = fs.createWriteStream(path);

                file.on('error', function (err) { 
                    console.error(err) 
                });

                data.file.pipe(file);

                data.file.on('end', function (err) { 
                    var ret = {
                        filename: data.file.hapi.filename,
                        headers: data.file.hapi.headers
                    };
             		redis.addFileToRedis('new-file', JSON.stringify(data.file));
                    console.log('Successful upload');
                    reply(ret.filename);
                });
            } else {
            	reply('you need to select a file to upload')
            }
  			
  		

}

module.exports = upload_handler;
