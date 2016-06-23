var net = require('net');
var fs = require('fs');
var Sensor = require('./Sensor');


module.exports = function(conf) {
    var data = fs.readFileSync('./conf_vars.json', 'utf8');
        if (!data) throw new Error("Can't read configuration file");
        else {
            var cfv = JSON.parse(data);
            return {
                getData: function getStationsData(reqData ,callback) {
                    var result = [];
                    var callback_manager = function(data) {
                        result.push(data);
                        if (result.length == cfv.length)
                            callback(result);
                    };

                    for (var i = 0; i < cfv.length; i++) {
                        fireSocket(cfv[i], reqData, callback_manager);
                    }

                }
            };
        }
};


function fireSocket(sensorObj, reqData, callback) {
    console.log("Socket Fired @ ", sensorObj.ip, sensorObj.port);
    var client = new net.Socket();

    client.connect(sensorObj.port, sensorObj.ip, function() {
        client.write(reqData);
    });

    client.on('data', function(data) {
        callback(new Sensor(sensorObj.name, sensorObj.x, sensorObj.y, JSON.parse(data)));
        client.end();
    });

    client.on('close', function() {
        console.log('Connection closed');
    });
    client.on('error',function(err){
      console.log("ERROR", err);
      callback(new Sensor(sensorObj.name, sensorObj.x, sensorObj.y, JSON.parse('[]')));
    });
}
