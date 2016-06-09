var spawn = require('child_process').spawn;
var net = require('net');
var cfv = require('./confVars');

//var result = [];


function getStationsData(callback) {
    var instances = cfv.sensorArr.length;
    var result = [];
    var callback_manager = function(data) {
        result.push(data);
        if (result.length == instances)
            callback(result);
    };

    if (instances == cfv.addrArr.length == cfv.portArr.length) {
        for (var i = 0; i < instances; i++) {
            fireSocket(cfv.addrArr[i], cfv.portArr[i], cfv.sensorArr[i], callback_manager);
        }
    } else {
        console.log("sensorArr: ", sensorArr.length, "\naddrArr: ", addrArr.length,
            "\nportArr: ", portArr.length);
        console.log("Those arrays should be of equal length");
        throw new Error("ParametersError: Data Array Length not Consistent");
    }
}

function fireSocket(addr, port, sensorObj, callback) {
    console.log("Socket Fired @ ", addr, port);
    var client = new net.Socket({
        allowHalfOpen: true
    });
    client.connect(port, addr, function() {
        client.write('Get Infos');
    });

    client.on('data', function(data) {
        var payload = JSON.parse(data);
        callback(payload);
        client.end();
    });

    client.on('close', function() {
        console.log('Connection closed');
    });
}

exports.getData = getStationsData;
