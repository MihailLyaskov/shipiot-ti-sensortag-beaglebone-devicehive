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

global.XMLHttpRequest = require('xhr2');
global.WebSocket = require('ws');
var DeviceHive = require('./devicehive.device');
var Equipment = require('./equipment');

var Device = function (options) {
    var dh = new DeviceHive(options.serviceUrl, options.deviceId, options.accessKey);
	this.dh = dh;
    this.equipment = options.equipment.map(function(e) { return new Equipment(dh, e); });
    this.key = options.deviceKey;
	this.network = options.network;
	this.deviceName = options.deviceName;
	this.deviceClass = options.deviceClass;
};

Device.prototype.start = function (cb, handler) {
    var self = this;
	console.log("Device registering: " + self.deviceName);
    self.dh.registerDevice(
		{
			guid: self.deviceId,
	        name: self.deviceName,
	        key: self.key, // obsolete but still required
	        network: {
	            name: self.network.name,
				key: self.network.key
	        },
	        status: "Online",
	        deviceClass: {
	            name: self.deviceClass.name,
	            version: self.deviceClass.version,
	            equipment: self.equipment.map( function(e){ return e.getDhDescription(); } )
	        }
	    }, 
		function (err, res) {
	        if (err) {
	            return cb(err);
	        }
	        self.dh.openChannel(function (err, res) {
	            if (err) {
	                return cb(err);
	            }
				self.equipment.map( function(e){ e.start(handler) });
	            return cb();
	        }, "websocket");
	    }
	);
};

Device.prototype.stop = function () {
	this.equipment.map( function(e){e.stop()} );
};

module.exports = Device;
