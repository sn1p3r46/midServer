/*
#	This code comes with NO LICENSE and NO WARRANTY
#
#	The following code implements a simple nodejs script that
#	serve data collected from other servers through the
#   nnode.js module.
#
#	Usage: nodejs nnonde.js
#
#	AUTHOR: Andrea Galloni andreagalloni92@gmail.com
*/
var thePort="8001";



var http = require("http");
var url = require('url');
var fs = require('fs');
var socketsClient = require('./socketsClient.js');

var server = http.createServer(function(request, response){
  var path = url.parse(request.url).pathname;
  switch(path){
      case '/':
            socketsClient.getData(function (data) {
            response.writeHead(200, {'Content-Type': 'text'});
            response.write(JSON.stringify(data));
            response.end();
            });

          break;
      case '/ifn':
          response.writeHead(200, {'Content-Type': 'text'});
          response.write("It Works");
          response.end();

          break;
      default:
          response.writeHead(404);
          response.write("The content you are looking for des not exsts. Error 404 Not Found");
          response.end();
          break;
  }
});
server.listen(thePort);

//process.on('uncaughtException', function (err) {
//  console.log('Caught exception: ${err}\n');
//});
