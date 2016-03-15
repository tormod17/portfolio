var Request = require('request');


function uploadcare_handler(request, reply) {
    var file_id = request.payload.my_file.split('/')[3];
    console.log('FID',file_id);
    Request({
        method: 'PUT',
        url:'http://api.uploadcare.com/files/'+file_id+'/storage/',
        headers: {
   	        Authorization: 'Uploadcare.Simple demopublickey:demoprivatekey'
        }
    }, function(error, request, body) {
        console.log('BODY', body, JSON.parse(body).url);
        var fileObj = JSON.parse(body);
        reply.view('blog', {download: fileObj.original_file_url});
    });





}

module.exports = uploadcare_handler;
