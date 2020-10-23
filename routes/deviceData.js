const express = require('express');
const router = express.Router();
const DeviceDataModel = require('../model/deviceData');
var moment = require('moment-timezone');

router.get('/byDateAndID/:nodeID/:date', async (req, res) => {
    try {
        var DeviceData = await DeviceDataModel.find({ node_id: req.params.nodeID, date: req.params.date });
        res.json(DeviceData);
    } catch (error) {
        res.json({ message: error.message });
    }

})


router.get('/byData/:date', async (req, res) => {
    try {
        var showData = [];
        var DeviceData = await DeviceDataModel.find({ node_id: "ANANKE002", date: req.params.date });
        DeviceData.forEach(deviceData => {
            showData.push({
                datetime: deviceData.datetime,
                value: deviceData.val,
                color: deviceData.val < 40 ? "RED" : deviceData.val < 80 ? "ORANGE" : deviceData.val < 120 ? "BLUE" : "GREEN"
            });
        });

        res.json(showData);
    } catch (error) {
        res.json({ message: error.message });
    }

})

router.get('/getAll', async (req, res) => {
    try {
        var DeviceData = await DeviceDataModel.find();
        res.json(DeviceData);
    } catch (error) {
        res.json({ message: error.message });
    }

})



module.exports = router;
