
var mqtt = require('mqtt');
var DeviceDataModel = require('./model/deviceData');
const express = require('express');
var socket = require('./app');
// const BatchModel = require('./model/batch');
var lastVal = 0;

console.log("MQTT Loaded");
client = mqtt.connect('mqtt://138.197.92.157:1883');
var moment = require('moment-timezone');

client.on('connect', function () {
    console.log('mqtt connected ... ');
    client.subscribe('smartbin/nbiot');

});



var thisTime = moment().tz("Asia/Colombo");;
var lastObject = new DeviceDataModel({
    node_id: "ANANKE002",
    val:171,
    timestamp: 1599662020920,
    place: 'cocacola',
    datetime: moment("2020-09-09, 8:03:40 pm"),
    time: moment("2020-09-09, 8:03:40 pm"),
    date: moment("2020-09-09"),
});





    client.on('message', async function (topic, message) {
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
        var topc = "smartbin/nbiot/time/" + dto.node_id;
        var time = 100;
        client.publish(topc, time.toString());
        console.log(topc);
        console.log(time);
        console.log("SENT");


        try {

            const DeviceData = new DeviceDataModel({
                node_id: dto.node_id,
                val: dto.val,
                timestamp: dto.timestamp,
                place: 'cocacola',
                datetime: dto.datetime,
                date: dto.date,
                time: dto.time
            });



            thisTime = moment().tz("Asia/Colombo");
            lastObject = dto;

            const savedDeviceData = await DeviceData.save();
            console.log(savedDeviceData);

            require('./app').emit("ANANKESMARTBIN", savedDeviceData);


        } catch (error) {
            console.log(error.message);

        };


    });




setInterval(async () => {
    console.log("SET TIMEOUT");
    if (moment().tz("Asia/Colombo").diff(thisTime, 'seconds') > 900) {
        console.log("DUMMY DATA");

       var timestamp = moment().tz("Asia/Colombo");
        var datetime = moment().tz("Asia/Colombo").format("YYYY-MM-DD, h:mm:ss a");
       var date = moment().tz("Asia/Colombo").format("YYYY-MM-DD");
        var time = moment().tz("Asia/Colombo").format("HH:mm:ss");

console.log(lastObject);

        try {

            const DeviceData = new DeviceDataModel({
                node_id: lastObject.node_id,
                val: lastObject.val,
                timestamp :timestamp,
                datetime : datetime,
                date : date,
                time:time,
                temp: true
            });

            thisTime = moment().tz("Asia/Colombo");
            lastObject = lastObject;
            const savedDeviceData = await DeviceData.save();
            console.log(savedDeviceData);

            require('./app').emit("ANANKESMARTBIN", savedDeviceData);

        } catch (error) {
            console.log(error.message);

        };


    }

},900000);


async function getLastData() {
    return await DeviceDataModel.findOne().sort({ _id: -1 });
}