/*
Ship IoT with TI Sensortags, Beaglebone Black, and DeviceHive
https://github.com/wotio/shipiot-ti-sensortag-beaglebone-devicehive

Copyright (c) 2015 wot.io, Inc. All Rights Reserved.

by Aaron Kondziela

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

var execSync = require('child_process').execSync;

var Equipment = function (dh, options) {
    this.dh = dh;
    this.name = options.name;
    this.code = options.code;
	this.command = options.command;
    this.interval = parseInt(options.interval);
	this.timeout = 5000;
	this.units = options.units;
};

Equipment.prototype.getSensorValue = function () {
	try {
		var sensorReturn = execSync(this.command, {"timeout":this.timeout, "maxBuffer":1024} );
	} catch (e) {
		console.log('execSync error - did you remember to turn on the Sensortag??');
		return 'execSync timeout or other error';
	}

	var value = parseFloat(sensorReturn);
	if ( isNaN(value) ) {
		console.log('execSync NaN error; got this: ' + sensorReturn);
		return 'execSync NaN error';
	}

	return value;
}

Equipment.prototype.getDhDescription = function () {
    return {
        name: this.name + ' Sensor',
        type: 'Sensortag',
        code: this.code
    };
};

Equipment.prototype.start = function(handler) {
    var self = this;
	console.log("Equipment starting: " + self.name);
    self._intervalHandler = setInterval(
		function() {
			console.log("Getting " + self.name + " sensor value");
			var parameters = {
				name: self.name,
				value: self.getSensorValue(),
				units: self.units
			};

			// Send notifcation to device hive
			//self.getAndSendSensorValue(handler, parameters);
			self.dh.sendNotification(self.name, parameters, function(err, res) {
				console.log("equipment sendNotification " + self.name + " " + parameters.value);
				return handler(err, parameters, self);
			});
		}, self.interval
	);
};

Equipment.prototype.stop = function () {
    return this._intervalHandler && clearInterval(this._intervalHandler);
};

module.exports = Equipment;
