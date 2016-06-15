/*
#	This code comes with NO LICENSE and NO WARRANTY
#
#	The following code implements a simple nodejs script that
#	serve data collected from other servers through the
#   nnode.js module.
#
#	Usage: npm start
#
#	AUTHOR: Andrea Galloni andreagalloni92@gmail.com
*/
var thePort = process.env.npm_package_config_port;

var http = require("http");
var url = require('url');
var socketsClient = require('./socketsClient')();

var server = http.createServer(function(request, response) {
    var path = url.parse(request.url).pathname;
    switch (path) {
        case '/iwlist':
            socketsClient.getData("iwlist",function(data) {
                response.writeHead(200, {
                    'Content-Type': 'text'
                });
                response.write(JSON.stringify(data));
                response.end();
            });

            break;
        case '/airodump':
          socketsClient.getData("airodump", function(data) {
              response.writeHead(200, {
                  'Content-Type': 'text'
              });
              response.write(JSON.stringify(data));
              response.end();
          });
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
