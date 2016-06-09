var spawn = require('child_process').spawn;
var net = require('net');
var cfv = require('./confVars.js');

//var result = [];
var instances = cfv.sensorArr.length;


function getStationsData(callback) {
	var result = [];
	if (cfv.sensorArr.length == cfv.addrArr.length && cfv.portArr.length == cfv.sensorArr.length){
		for (var i = 0; i<cfv.sensorArr.length; i++){
			fireSocket(cfv.addrArr[i],cfv.portArr[i],cfv.sensorArr[i],callback,result);
		}
	} else {
		console.log("sensorArr: ",sensorArr.length ,"\naddrArr: ",  addrArr.length ,
		"\nportArr: ", portArr.length);
		console.log("Those arrays should be of equal length");
		throw new Error("ParametersError: Data Array Length not Consistent");
	}
}

function fireSocket(addr,port,sensorObj,callback,result) {
	console.log("Socket Fired @ ",addr,port);
	var client = new net.Socket({allowHalfOpen: true});
	client.connect(port, addr, function() {
		client.write('Get Infos');
	});

	client.on('data', function(data) {
		var payload = JSON.parse(data);
		sensorObj.data = payload;
		result.push(sensorObj);
		if (result.length==instances){
			callback(result);
			result = [];
		}
		client.end();
	});

	client.on('close', function() {
		console.log('Connection closed');
	});

}

exports.getData = function (callback){
	getStationsData(callback);
};
