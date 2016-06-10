var net = require('net');
var fs = require('fs');
var Sensor = require('./Sensor');

module.exports = function(conf) {
    fs.readFile(conf || './conf_vars.json', 'utf8', function(err, data) {
        if (err) throw new Error("Can't read configuration file");
        else {
            var cfv = JSON.parse(data);
            return {
                getData: function getStationsData(callback) {
                    var result = [];
                    var callback_manager = function(data) {
                        result.push(data);
                        if (result.length == cfv.length)
                            callback(result);
                    };

                    for (var i = 0; i < cfv.length; i++) {
                        fireSocket(cfv[i], callback_manager);
                    }

                }
            };
        }
    });

};

function fireSocket(sensorObj, callback) {
    console.log("Socket Fired @ ", sensorObj.ip, sensorObj.port);
    var client = new net.Socket({
        allowHalfOpen: true
    });

    client.connect(sensorObj.port, sensorObj.ip, function() {
        client.write('Get Infos');
    });

    client.on('data', function(data) {
        callback(new Sensor(sensorObj.name, sensorObj.x, sensorObj.y, JSON.parse(data)));
        client.end();
    });

    client.on('close', function() {
        console.log('Connection closed');
    });
}
