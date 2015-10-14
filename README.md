# Ship IoT with Texas Instruments CC2650/CC2541 Sensortags, Beaglebone Black, and DeviceHive

This is a demonstration of the TI CC2650 / CC2541 Sensortags communicating
via Bluetooth Low-Energy to a Beaglebone Black. On the Beaglebone is a gateway
created with Node.js and Python, bridging the Sensortags to the DeviceHive
device management platform. From DeviceHive, the wot.io data service exchange™
will send the data to a number of data services, such as scriptr, Circonus,
bip.io, and more.

You can read more about this demo here:

http://labs.wot.io/ship-iot-with-beaglebone-black-ti-sensortags-and-devicehive/

### Usage

Set up a Beaglebone Black with Node.js and Python. You'll need a Bluetooth
dongle hooked via USB. Drop this repo on the Bone. Set up your config
options under `config/default.json` and then run `./start.sh`

For details refer to the blog post above.

### License

Copyright (c) 2015 wot.io, Inc. All Rights Reserved.

by Aaron Kondziela

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.

Includes code from these other projects:

* https://github.com/IanHarvey/bluepy
* https://github.com/devicehive/devicehive-javascript

