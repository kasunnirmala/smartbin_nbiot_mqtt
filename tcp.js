var net = require('net');
const express = require('express');
const app = express();
// require('./db');
const https = require('https');
//const DeviceModel = require('./model/device');

// var socket;

var tcp = net.createServer(function (soc) {
    console.log("CONNECTED");

    soc.setKeepAlive(true);


soc.on('error', function(err) {
console.log(err);
});

    soc.on('data', async function (data) {
        data = data.toString();
        console.log(data);

soc.write('100');
//soc.pipe(socket);
        // const Device = new DeviceModel({
        //     deviceID: "Device001",
        //     value: data
        // });

        //  try {
        //     const savedDevice = await Device.save();
        //     console.log(savedDevice);
        // } catch (error) {
        //     console.log(error.message);

        // };


  //      io.emit('tea-msg', data);

    });
}).listen(1111);
console.log("SERVER STARTED");
