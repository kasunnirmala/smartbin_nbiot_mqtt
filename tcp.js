var net = require('net');
var moment = require('moment-timezone');
var DeviceDataModel = require('./model/deviceData');
const express = require('express');
var socket = require('./app');
const https = require('https');
//const DeviceModel = require('./model/device');

// var socket;
var lastVal = 0;
var tcp = net.createServer(function (soc) {
    console.log("CONNECTED");

    soc.setKeepAlive(true);


soc.on('error', function(err) {
console.log(err);
});

    soc.on('data', async function (data) {
        var message = data.toString();
        console.log(message);

        var dto = {};
        var splitArr = message.toString().split(':');

        dto.node_id = splitArr[0];
        dto.val = parseFloat(splitArr[1]);
        dto.timestamp = moment().tz("Asia/Colombo");
        dto.datetime = moment().tz("Asia/Colombo").format("YYYY-MM-DD, h:mm:ss a");
        dto.date = moment().tz("Asia/Colombo").format("YYYY-MM-DD");
        dto.time = moment().tz("Asia/Colombo").format("HH:mm:ss");

        console.log(dto);
        dto.val = dto.val == 0 ? lastVal : dto.val;
        lastVal = dto.val;


        try {

            const DeviceData = new DeviceDataModel({
                node_id: dto.node_id,
                val: dto.val,
                timestamp: dto.timestamp,
                datetime: dto.datetime,
                date: dto.date,
                time: dto.time
            });




            const savedDeviceData = await DeviceData.save();
            console.log(savedDeviceData);

            require('./app').emit("ANANKESMARTBIN", savedDeviceData);


        } catch (error) {
            console.log(error.message);

        };




            soc.write('5');
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
